# PosMat

Aplicación web de PosMat con **frontend en React/Vite** y **backend propio en Express + Prisma + PostgreSQL**.

## Puesta en marcha

### 1. Instalar dependencias
```bash
npm install
npm --prefix server install
```

### 2. Configurar entorno
Frontend (`.env`):
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Backend (`server/.env`):
```env
PORT=4000
CORS_ORIGIN=http://127.0.0.1:5173
JWT_SECRET=change-me
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/posmat?schema=public
ADMIN_EMAIL=admin@ejemplo.com
ADMIN_PASSWORD=change-me
```

### 3. Inicializar base de datos
```bash
npm run db:push
npm run db:seed
```

### 4. Levantar frontend + backend
```bash
npm start
```

## Scripts útiles

- `npm start`: levanta API y web juntos
- `npm run build`: genera build de producción
- `npm run db:push`: aplica el esquema Prisma
- `npm run db:seed`: carga datos iniciales

### Actualizar sólo los jurados de tesis

El archivo corregido está incluido en `server/data/tesis-corregidas.db`. En el servidor, ejecutá primero una vista previa:

```bash
cd /ruta/al/proyecto/server
npm run tesis:update-jurors -- data/tesis-corregidas.db
```

Si el resumen es correcto, aplicá los cambios:

```bash
npm run tesis:update-jurors -- data/tesis-corregidas.db --apply
```

El script actualiza únicamente los jurados de tesis que encuentre de forma inequívoca en PostgreSQL. No modifica directores, autores, títulos ni ningún otro dato. Requiere Node.js 22.5 o superior.

## Stack actual

- React 19 + Vite
- Express + Prisma
- PostgreSQL
- JWT en cookies para autenticación

## Nota

Firebase fue retirado del flujo principal del proyecto; la app ahora opera sobre `PostgreSQL + backend propio`. 
