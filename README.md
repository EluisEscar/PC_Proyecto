# Proyecto Final de Carrera III — Caso 3

Plataforma para dignificar la economía de subsistencia de las personas que limpian
parabrisas en cruces de alto tráfico: registro de trabajadores, perfil público con
geolocalización del cruce y **propina digital** mediante QR.

## Arquitectura (resumen)

| Capa | Tecnología | Despliegue |
|------|-----------|-----------|
| Frontend | Next.js + TypeScript | Vercel |
| Backend / API | NestJS + TypeScript | AWS ECS Fargate (Docker) |
| Base de datos | PostgreSQL (Prisma ORM) | AWS RDS |
| Almacenamiento | Imágenes de perfil | AWS S3 |
| Red / Balanceo | VPC + ALB + CloudFront | AWS |
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
con Pull Requests revisados antes de integrar.
