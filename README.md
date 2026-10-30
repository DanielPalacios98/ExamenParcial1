# API de reservas de canchas · Evaluación P1

Hola, soy Daniel Palacios (L00056071). Este es mi proyecto de la evaluación del primer parcial de Desarrollo Web Avanzado: una API en Express con Prisma y PostgreSQL para reservar canchas deportivas. La armé sobre el kit del profe y siguiendo la misma estructura que hicimos en clase (rutas → controladores → servicios, con los middlewares aparte).

Como mi ID termina en 1, a mí me tocó Básquet 1 y Tenis 1 para el 11 de noviembre de 2026. En el seed quedaron los dos horarios, uno de 08:00 a 10:00 y otro de 10:00 a 12:00 (UTC), y una reserva en cada uno. El puerto local es el 3071.

## Cómo levantarlo

Necesitas Node y Docker. Copia el `.env-example` a `.env` (ahí ya está el puerto y lo demás), y luego:

```bash
npm install
docker compose up -d
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
npm run dev
```

Ojo que con Prisma 7 el `migrate dev` ya no corre el generate ni el seed solo, por eso van aparte. Si la base ya tiene la migración, basta con `npx prisma migrate deploy`.

Con eso la API queda en http://localhost:3071 y si entras a `/` te sale el Hello World.

Para probar puedes entrar como admin con `paulo.galarza@example.com` / `admin123`, o con mi usuario `depalacios2@espe.edu.ec` / `usuario123`.

## Endpoints

Todo va bajo `/api`. Los que piden token se mandan con `Authorization: Bearer <token>`, y el token sale del login.

| Método | Ruta | Quién puede | Qué hace |
|---|---|---|---|
| POST | `/api/auth/register` | Cualquiera | Crea un usuario con rol USER |
| POST | `/api/auth/login` | Cualquiera | Devuelve el JWT (dura 4 horas) |
| GET | `/api/auth/protected-route` | Con token | Para comprobar que el token sirve |
| POST | `/api/admin/schedules` | Solo ADMIN | Crea un horario nuevo |
| GET | `/api/admin/bookings` | Solo ADMIN | Lista todas las reservas con su usuario y horario |
| POST | `/api/bookings` | Con token | Reserva un horario (400 si ya está ocupado ese día) |
| GET | `/api/bookings/:id` | El dueño o ADMIN | Ver una reserva |
| PUT | `/api/bookings/:id` | El dueño o ADMIN | Cambiar fecha u horario |
| DELETE | `/api/bookings/:id` | El dueño o ADMIN | Borrar la reserva |
| GET | `/api/users/:id/bookings` | El mismo usuario o ADMIN | Ver las reservas de un usuario |

Si no mandas token te da 401, si el token es inválido o no te toca ver eso te da 403, y si la reserva no existe 404.

## Postman

En la carpeta `postman` está mi colección `EVAL_P1_Palacios` y el entorno local. Lo mejor es correrla en orden justo después del seed, porque los logins guardan los tokens en el entorno y las peticiones de reservas usan los ids que crea el seed. Tiene una petición por cada endpoint y también los casos de error.

## Render

Para el despliegue usé Render (plan gratuito): una base Postgres, la migración y el seed corridos desde mi PC con la URL externa, y un Web Service con `npm install --include=dev && npx prisma generate` de build y `npm start`. Si la primera petición se demora, es porque el servicio se duerme cuando nadie lo usa.

La API desplegada está en: https://TU-SERVICIO.onrender.com
