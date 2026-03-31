# Guía VPS, migración desde Firebase y actualización de base de datos

## 1. Objetivo

Esta guía resume cómo:

- migrar datos desde Firestore a PostgreSQL
- generar los JSON necesarios para el proyecto
- actualizar la base de datos usando esos JSON
- corregir el error `TypeError: Failed to fetch` en el VPS

---

## 2. Colecciones usadas desde Firestore

Las colecciones detectadas y soportadas son:

- `Home`
- `about`
- `authorizedEmails`
- `contacto`
- `courses`
- `faq`
- `links`
- `professors`
- `rules`
- `students`
- `tesis`

Estas se exportan y/o sincronizan con los archivos JSON en `src/files/`.

---

## 3. Variables de entorno necesarias

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

En producción/VPS usar:

```env
VITE_API_BASE_URL=https://tu-dominio.com/api
```

o si todavía no hay dominio:

```env
VITE_API_BASE_URL=http://IP_DE_TU_VPS:4000/api
```

### Backend `server/.env`

```env
PORT=4000
CORS_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
JWT_SECRET=change-me
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/posmat?schema=public
ADMIN_EMAIL=admin@ejemplo.com
ADMIN_PASSWORD=change-me
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./postmat.json
```

En VPS, para CORS:

```env
CORS_ORIGIN=https://tu-dominio.com,http://IP_DE_TU_VPS
```

---

## 4. Instalar dependencias

Desde la raíz del proyecto:

```bash
npm install
npm --prefix server install
```

Si falta Firebase Admin:

```bash
cd server
npm install firebase-admin
```

---

## 5. Importar datos desde Firebase

### Comando principal

```bash
cd server
npm run import:firebase
```

### Qué hace este comando

- se conecta a Firestore usando `firebase-admin`
- genera/actualiza JSON en `src/files/`
- sincroniza contenido con PostgreSQL mediante Prisma

### Archivos JSON generados

- `home.json`
- `about.json`
- `contacto.json`
- `authorizedEmails.json`
- `courses.json`
- `faqs.json`
- `links.json`
- `professors.json`
- `rules.json`
- `students.json`
- `tesis.json`

### Exportar solo JSON

```bash
cd server
npm run export:firebase:json
```

---

## 6. Actualizar la base de datos desde los JSON

Si ya tenés los JSON listos, corré:

```bash
npm run db:push
npm run db:seed
```

O directamente:

```bash
cd server
npm run db:seed
```

### Qué hace cada comando

- `db:push`: aplica el esquema Prisma a PostgreSQL
- `db:seed`: carga datos desde `src/files/*.json`

---

## 7. Verificación local

### Revisar que la API esté viva

```bash
curl http://localhost:4000/api/health
```

Respuesta esperada:

```json
{"status":"ok","service":"posmat-api"}
```

### Probar endpoints útiles

```bash
curl http://localhost:4000/api/content/Home
curl http://localhost:4000/api/content/contacto
curl http://localhost:4000/api/courses
```

### Abrir Prisma Studio

```bash
npm --prefix server run prisma:studio
```

---

## 8. Error en VPS: `TypeError: Failed to fetch`

### Causa

En producción, el frontend no puede usar:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

porque `localhost` en el navegador del usuario no apunta al VPS sino a su propia máquina.

### Solución

Configurar en el VPS:

```env
VITE_API_BASE_URL=https://tu-dominio.com/api
```

Y en backend:

```env
CORS_ORIGIN=https://tu-dominio.com
```

Después reconstruir el frontend:

```bash
cd /opt/PosMat
npm run build
```

Y reiniciar backend/frontend.

---

## 9. Ejemplo de flujo completo en VPS

```bash
cd /opt/PosMat
npm install
npm --prefix server install
npm run db:push
npm --prefix server run db:seed
npm --prefix server run import:firebase
npm run build
npm --prefix server run start
```

---

## 10. Estado verificado durante esta sesión

Se verificó correctamente que:

- `npm run import:firebase` terminó con éxito
- se generaron todos los JSON esperados
- la API respondió en `http://localhost:4000/api/health`
- el frontend compiló con `npm run build`
- el contenido `Home` y `contacto` quedó accesible desde `/api/content/...`

---

## 11. Notas finales

- `401` en `/api/auth/me` sin sesión iniciada es normal
- el error real del VPS estaba relacionado con `VITE_API_BASE_URL` y `CORS_ORIGIN`
- el frontend `Hero` quedó protegido para no romperse si `Home` viene vacío

---

## 12. Comandos rápidos

### Desarrollo local

```bash
npm start
```

### Importar desde Firebase

```bash
cd server
npm run import:firebase
```

### Exportar JSON solamente

```bash
cd server
npm run export:firebase:json
```

### Sincronizar DB desde JSON

```bash
npm run db:push
npm run db:seed
```
