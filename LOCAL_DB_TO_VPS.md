# 📦 Migrar la base PostgreSQL local al VPS

Esta guía explica cómo exportar tu base de datos PostgreSQL local y restaurarla en tu VPS.

Este método suele ser **más simple y más confiable** que volver a importar todo desde Firebase, siempre que tu base local ya tenga los datos correctos.

---

## 1) Cuándo conviene este método

Usa esta opción si:

- en tu PC local ya tienes la base `posmat` funcionando bien
- ya cargaste datos correctamente en PostgreSQL local
- quieres copiar esa misma base al VPS sin reconstruir todo a mano

---

## 2) Método recomendado: `pg_dump` + `pg_restore`

### En tu máquina local: exportar la base

#### En Windows PowerShell

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U postgres -d posmat -F c -f "F:\Programacion\PosMat\posmat.backup"
```

> Si `pg_dump` no existe en esa ruta, revisa tu versión instalada en `C:\Program Files\PostgreSQL\` y cambia `18` por la correcta.

#### Verificar la herramienta

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" --version
```

Esto genera un archivo de backup binario:

- `posmat.backup`

> Si usas otro usuario distinto de `postgres`, reemplázalo en el comando.

---

## 3) Copiar el backup al VPS

### Opción A — usando `scp`

Si tu acceso SSH real funciona con un host como `ssh.posmat.fi.mdp.edu.ar`, entonces desde tu máquina local puedes usar:

```powershell
scp "F:\Programacion\PosMat\posmat.backup" root@ssh.posmat.fi.mdp.edu.ar:/opt/PosMat/
```

> Importante: para `scp`, `ssh` o `sftp` debes usar el host **sin** `https://`.

### Opción B — usando WinSCP o FileZilla

Si estás en Windows, esta suele ser la forma más simple:

- protocolo: `SFTP`
- host: `ssh.posmat.fi.mdp.edu.ar`
- puerto: `22`
- usuario: `root` o el que uses

Luego arrastras `posmat.backup` a:

- `/opt/PosMat/`

### Opción C — si solo tienes consola web SSH

Si solo puedes entrar por una URL como:

- `https://ssh.posmat.fi.mdp.edu.ar/`

entonces eso probablemente sea una **consola web SSH**. En ese caso, primero prueba si el host SSH real también acepta conexión desde tu PC:

```powershell
ssh root@ssh.posmat.fi.mdp.edu.ar
```

Si eso conecta, entonces `scp` y `WinSCP` también deberían funcionar.

---

## 4) Preparar la base en el VPS

Entrar a PostgreSQL en el VPS:

```bash
sudo -u postgres psql
```

Y crear la base vacía:

```sql
DROP DATABASE IF EXISTS posmat;
CREATE DATABASE posmat OWNER posmat_user;
\q
```

> Cambia `posmat_user` por el usuario real que uses en tu VPS.

---

## 5) Restaurar el backup en el VPS

```bash
pg_restore -U posmat_user -d posmat /opt/PosMat/posmat.backup
```

Si necesitas pasar host y contraseña:

```bash
PGPASSWORD='TU_PASSWORD' pg_restore -h localhost -U posmat_user -d posmat /opt/PosMat/posmat.backup
```

---

## 6) Alternativa: exportar en SQL plano

También puedes exportar la base como archivo `.sql`:

```bash
pg_dump -U postgres -d posmat > posmat.sql
```

Luego subirlo al VPS y restaurarlo así:

```bash
psql -U posmat_user -d posmat < posmat.sql
```

---

## 7) Qué método conviene más

| Método | Recomendación |
|---|---|
| `pg_dump -F c` + `pg_restore` | ✅ mejor opción |
| exportar a `.sql` | útil, pero más básico |

---

## 8) Ventajas de hacerlo así

- no dependes de Firebase
- migras toda la base de una vez
- conservas estructura y datos
- es más rápido y más limpio

---

## 9) Verificar que la restauración salió bien

En el VPS, prueba:

```bash
curl http://127.0.0.1:4000/api/health
```

Y también puedes comprobar que haya datos:

```bash
curl http://127.0.0.1:4000/api/courses
curl http://127.0.0.1:4000/api/content/about
curl http://127.0.0.1:4000/api/content/contacto
```

---

## 10) Flujo recomendado completo

1. exportar la base local con `pg_dump`
2. subir el backup al VPS con `scp`
3. crear la base vacía en el VPS
4. restaurar con `pg_restore`
5. levantar el backend
6. comprobar que la API responde bien

---

## 11) Resumen rápido

Si tu base local ya está bien, la forma correcta es:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U postgres -d posmat -F c -f "F:\Programacion\PosMat\posmat.backup"
scp "F:\Programacion\PosMat\posmat.backup" root@ssh.posmat.fi.mdp.edu.ar:/opt/PosMat/
```

Y luego en el VPS:

```bash
pg_restore -U posmat_user -d posmat /opt/PosMat/posmat.backup
```

---

## 12) Recomendación final

Si tu objetivo es llevar al VPS exactamente lo que ya tienes probado en local, esta es la mejor ruta.

Es más directa que volver a importar todo desde Firebase y evita inconsistencias durante la migración.
