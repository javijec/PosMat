# 🚀 Despliegue de PosMat en un VPS con Nginx

Esta guía deja el proyecto **PosMat** funcionando en un VPS con:

- **Nginx** como proxy inverso
- **Node.js + PM2** para el backend
- **PostgreSQL** como base de datos
- **React/Vite** servido como sitio estático

---

## 1) Requisitos previos

Asumimos que ya tienes:

- Un VPS Linux
- `nginx` instalado
- Un dominio apuntando a la IP del VPS

Si usas **Ubuntu/Debian**, instala lo que falta con:

```bash
sudo apt update
sudo apt install -y nginx git curl postgresql postgresql-contrib
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

Verifica versiones:

```bash
node -v
npm -v
pm2 -v
nginx -v
psql --version
```

---

## 2) Subir el proyecto al VPS

Puedes clonar el repositorio en `/var/www/posmat`:

```bash
cd /var/www
sudo git clone TU_REPO_URL posmat
sudo chown -R $USER:$USER /var/www/posmat
cd /var/www/posmat
```

Instala dependencias:

```bash
npm install
npm --prefix server install
```

---

## 3) Configurar PostgreSQL

Entrar al cliente postgres:

```bash
sudo -u postgres psql
```

Crear la base y el usuario:

```sql
CREATE DATABASE posmat;
CREATE USER posmat_user WITH PASSWORD 'TU_PASSWORD_FUERTE';
GRANT ALL PRIVILEGES ON DATABASE posmat TO posmat_user;
\q
```

---

## 4) Configurar variables de entorno

### Archivo raíz `.env`

```env
VITE_API_BASE_URL=https://tudominio.com/api
```

### Archivo `server/.env`

```env
PORT=4000
CORS_ORIGIN=https://tudominio.com
JWT_SECRET=pon_aca_un_secreto_largo_y_seguro
ADMIN_EMAIL=tucorreo@dominio.com
ADMIN_PASSWORD=TuPasswordAdminSegura
```

> Si vas a usar `www.tudominio.com`, puedes ajustar luego `CORS_ORIGIN` según tu dominio final.

---

## 5) Inicializar la base de datos

Desde la raíz del proyecto:

```bash
npm run db:push
npm run db:seed
```

Luego generar el frontend:

```bash
npm run build
```

---

## 6) Levantar el backend con PM2

Desde la raíz del proyecto:

```bash
pm2 start npm --name posmat-api --prefix server -- run start
pm2 save
pm2 startup
```

Ver estado:

```bash
pm2 status
pm2 logs posmat-api
```

La API quedará en:

- `http://127.0.0.1:4000`

---

## 7) Servir el frontend con Nginx

El build de Vite queda en:

```bash
/var/www/posmat/dist
```

Crea el archivo de configuración de Nginx:

```bash
sudo nano /etc/nginx/sites-available/posmat
```

Pega esto:

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    root /var/www/posmat/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activar el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/posmat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8) Activar HTTPS con Let's Encrypt

Si el dominio ya apunta al VPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

Esto configurará SSL automáticamente para Nginx.

---

## 9) Flujo de actualización del proyecto

Cada vez que quieras actualizar la app:

```bash
cd /var/www/posmat
git pull
npm install
npm --prefix server install
npm run db:push
npm run build
pm2 restart posmat-api
sudo systemctl reload nginx
```

---

## 10) Comandos útiles

### Ver estado de procesos

```bash
pm2 status
pm2 logs posmat-api
sudo systemctl status nginx
```

### Reiniciar servicios

```bash
pm2 restart posmat-api
sudo systemctl reload nginx
```

### Verificar la API localmente

```bash
curl http://127.0.0.1:4000/api/health
```

Debería responder algo similar a:

```json
{"status":"ok","service":"posmat-api"}
```

---

## 11) Estructura final del despliegue

| Servicio | Puerto | Función |
|---|---:|---|
| `nginx` | `80 / 443` | expone el sitio y hace proxy |
| `Node/Express` | `4000` | backend API |
| `PostgreSQL` | `5432` | base de datos |

---

## 12) Resumen rápido

1. Instalar `node`, `pm2` y `postgresql`
2. Subir el proyecto a `/var/www/posmat`
3. Configurar `.env` y `server/.env`
4. Ejecutar:

```bash
npm install
npm --prefix server install
npm run db:push
npm run db:seed
npm run build
pm2 start npm --name posmat-api --prefix server -- run start
```

5. Configurar Nginx para:
   - servir `/var/www/posmat/dist`
   - redirigir `/api` hacia `127.0.0.1:4000`
6. Activar HTTPS con `certbot`

---

## 13) Recomendaciones finales

- Usa un `JWT_SECRET` largo y único
- No expongas PostgreSQL públicamente a internet
- Haz backups periódicos de la base
- Si cambias dominio, actualiza `VITE_API_BASE_URL` y `CORS_ORIGIN`
- Después de modificar el frontend, recuerda ejecutar `npm run build`

---

Si quieres, el siguiente paso puede ser generar también un archivo `server/.env.production.example` listo para tu VPS.