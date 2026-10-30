# Evaluación P1 · API de reservas de canchas

Kit del examen de la Unidad 1: **2 horas en línea**, en la Lección «Evaluación P1» de Moodle. Allí están los requisitos de cada hito y sus preguntas, que respondes **después de cada avance**.

## Configuración de esta variante

- ID ESPE: `L00056071`
- Puerto local: `3071`
- Fecha seed: `2026-11-11`
- Canchas seed: `Básquet 1` (`08:00–10:00`) y `Tenis 1` (`10:00–12:00`) UTC
- Usuario seed: `Daniel Palacios <l00056071@espe.edu.ec>`

## Instalación y base de datos

```bash
cp .env-example .env
npm install
docker compose up -d
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm start
```

La API queda disponible en `http://localhost:3071`. El administrador del seed es
`paulo.galarza@example.com` / `admin123`; el usuario de la variante usa
`l00056071@espe.edu.ec` / `usuario123`.

## Qué trae el kit (igual que el proyecto de clase)
| Archivo | Contenido |
|---|---|
| `src/server.js`, `src/app.js` | Servidor Express en capas: `express.json`, logger, rutas en `/api`, `GET /` y errorHandler |
| `src/middlewares/` | `logger.js`, `errorHandler.js` (stack solo en `development`) y `auth.js` (`authenticateToken`) |
| `src/routes/auth.js`, `controllers/authController.js`, `services/authService.js` | Registro (bcrypt) y login (JWT `{ id, role }`, 4 h) |
| `src/routes/index.js` | Monta `/auth`. Aquí montas tus routers |
| `src/utils/validation.js` | `isValidEmail` |
| `prisma/schema.prisma` | `User` y `enum Role`. Aquí agregas `Schedule` y `Booking` |
| `prisma.config.ts` | Prisma 7: esquema, migraciones, seed (`node prisma/seed.js`) y `DATABASE_URL` |
| `docker-compose.yml`, `.env-example`, `package.json` | PostgreSQL 17, variables y dependencias del curso |
| `postman/EVAL_P1_local.postman_environment.json` | Entorno con `baseUrl` y `token` |

## Al iniciar (5 min)
```bash
cp .env-example .env          # PORT=30XX con los dos últimos dígitos de tu ID ESPE
npm install
docker compose up -d
git init && git add . && git commit -m "inicio: kit"
git branch -M main && git remote add origin <tu repositorio privado> && git push -u origin main
```

## Endpoints

| Método | Ruta | Autorización | Uso |
|---|---|---|---|
| POST | `/api/auth/register` | Pública | Registra un usuario USER |
| POST | `/api/auth/login` | Pública | Devuelve JWT |
| GET | `/api/auth/protected-route` | Token | Comprueba autenticación |
| POST | `/api/admin/schedules` | ADMIN | Crea un horario |
| GET | `/api/admin/bookings` | ADMIN | Lista reservas con usuario y horario |
| POST | `/api/bookings` | Token | Crea una reserva |
| GET | `/api/bookings/:id` | Dueño/ADMIN | Consulta una reserva |
| PUT | `/api/bookings/:id` | Dueño/ADMIN | Actualiza una reserva |
| DELETE | `/api/bookings/:id` | Dueño/ADMIN | Elimina una reserva |
| GET | `/api/users/:id/bookings` | Dueño/ADMIN | Lista reservas de un usuario |

## Hitos
| Hito | Qué haces | Etiqueta |
|---|---|---|
| 1 | `Schedule` y `Booking` (1:N), migración `init`, `npx prisma generate` y seed de tu variante | `hito-1` |
| 2 | `POST /api/admin/schedules` y `GET /api/admin/bookings` (rol ADMIN) | `hito-2` |
| 3 | CRUD de `/api/bookings` con horario ocupado → 400 y `authorizeBooking` | `hito-3` |
| 4 | `GET /api/users/:id/bookings` con `authorizeUser` y tu colección de Postman | `hito-4` |

Cada hito se cierra **antes** de responder sus preguntas en la Lección:
```bash
git add . && git commit -m "hito N: …" && git tag hito-N && git push && git push --tags
```

> Prisma 7: `npx prisma migrate dev` ya no genera el cliente ni ejecuta el seed. Después de migrar, ejecuta `npx prisma generate` y `npx prisma db seed`.

## Entrega
Lo que esté en tu repositorio al terminar las 2 horas es lo que se califica: código, etiquetas `hito-1` a `hito-4` y `postman/EVAL_P1_<Apellido>.postman_collection.json`. En la última pregunta de la Lección pegas el enlace del repositorio y el hash del último commit.
