# Proyecto Final de Carrera III — Caso 3

Plataforma para dignificar la economía de subsistencia de las personas que limpian
parabrisas en cruces de alto tráfico: registro de trabajadores, perfil público con
geolocalización del cruce y **propina digital** mediante QR.

## Arquitectura (resumen)

| Capa | Tecnología | Despliegue |
|------|-----------|-----------|
| Frontend | Next.js + TypeScript | Vercel (Edge/CDN) |
| Backend / API | NestJS + TypeScript (Docker) | Render Web Service |
| Base de datos | PostgreSQL (Prisma ORM) | Render PostgreSQL (gestionada) |
| Infra como código | Blueprint | `render.yaml` |
| CI/CD | GitHub Actions | — |
| Gestión Scrum | Jira | — |

## Estructura del repositorio

```
.
├── backend/        API NestJS + Prisma
├── frontend/       App Next.js (pendiente)
└── docker-compose.yml   Entorno local (PostgreSQL + API)
```

## Desarrollo local

```bash
# Levantar PostgreSQL
docker compose up -d db

# Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev
```

## Estrategia de branching

`main` (producción) ← `develop` (integración) ← `feature/*` (cada historia de usuario),
con Pull Requests revisados antes de integrar. Detalle en
[`docs/branching.md`](docs/branching.md).

## CI/CD

Pipeline en GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)):

1. **Backend** — `npm ci` → `prisma generate` → build → pruebas (Jest).
2. **Frontend** — `npm ci` → build de Next.js.
3. **Deploy** — al integrar a `main`, dispara el despliegue en Render y Vercel
   (vía deploy hooks configurados como *secrets*, o despliegue nativo desde GitHub).
