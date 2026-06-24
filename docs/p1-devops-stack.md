# Pregunta 1 — Metodología DevOps y stack tecnológico

## 1.1 ¿Qué es DevOps y cómo se aplica al proyecto?

DevOps es una **cultura y un conjunto de prácticas** que unen el desarrollo
(Dev) y la operación (Ops) para entregar software de forma continua, rápida y
confiable. No es una herramienta, sino una forma de trabajar que se apoya en
cuatro principios (modelo **CALMS**):

- **Cultura de colaboración:** desarrollo y operación comparten la
  responsabilidad del producto en lugar de trabajar en silos.
- **Automatización:** todo lo repetitivo (build, pruebas, despliegue) se
  automatiza para reducir el error humano.
- **Medición:** se monitorea el sistema para tomar decisiones con datos.
- **Compartir (Lean + Sharing):** entregas pequeñas y frecuentes, con
  retroalimentación constante.

### El ciclo de vida DevOps aplicado a nuestra solución

DevOps se organiza en un **ciclo continuo** de fases. Así lo aplicamos:

| Fase | Qué hacemos en el proyecto | Herramienta |
|------|----------------------------|-------------|
| **Plan** | Historias de usuario, backlog y sprints del caso. | Jira |
| **Code** | Desarrollo de API y frontend con control de versiones y ramas. | Git / GitHub |
| **Build** | Compilación de la API (NestJS) y del frontend (Next.js); imagen Docker. | GitHub Actions |
| **Test** | Pruebas unitarias automáticas en cada push/PR. | Jest + GitHub Actions |
| **Release** | Versionado por ramas (`feature → develop → main`) con PR revisados. | GitHub |
| **Deploy** | Despliegue automático al integrar a `main`. | Render + Vercel |
| **Operate** | La aplicación corre como servicio gestionado, siempre accesible por URL. | Render / Vercel |
| **Monitor** | Health check de la API y logs de la plataforma. | `/api/health` + logs Render |

La práctica central que conecta todo es **CI/CD (Integración y Entrega
Continuas)**: cada cambio que subimos al repositorio pasa automáticamente por
build y pruebas, y si todo está en verde, se despliega solo. Esto hace que el
software siempre esté en un estado entregable.

## 1.2 Stack tecnológico justificado

Cada componente se eligió por una razón concreta, no por moda:

| Componente | Tecnología | Justificación |
|-----------|-----------|---------------|
| **Frontend** | Next.js + TypeScript | Framework líder de React; renderizado del lado del servidor para perfiles públicos rápidos y buen SEO (importante para visibilizar a los trabajadores). TypeScript da seguridad de tipos. |
| **Backend / API** | NestJS + TypeScript | Arquitectura modular por capas (controllers/services) fácil de mantener y defender; mismo lenguaje que el frontend reduce la curva de aprendizaje del equipo. |
| **ORM** | Prisma | Modela la base de datos de forma declarativa; el `schema.prisma` sirve a la vez como modelo entidad-relación y genera el cliente tipado y las migraciones versionadas. |
| **Base de datos** | PostgreSQL | Relacional: el dominio (usuarios, trabajadores, propinas) tiene relaciones claras e integridad transaccional en los pagos. |
| **Contenedores** | Docker | Empaqueta la API con sus dependencias; "funciona igual en mi máquina y en producción", clave para un despliegue confiable. |
| **CI/CD** | GitHub Actions | Integrado al repositorio; automatiza build, pruebas y despliegue sin servidor extra. Plan gratuito suficiente para el proyecto. |
| **Hosting backend** | Render | PaaS que despliega el contenedor Docker y ofrece **PostgreSQL gestionada**, con URL pública y deploy automático desde GitHub. Baja complejidad operativa. |
| **Hosting frontend** | Vercel | Plataforma optimizada para Next.js; despliegue automático, CDN global y previews por cada PR. |
| **Gestión ágil** | Jira | Tablero Scrum, backlog, estimación con story points y burndown para evidenciar la planificación. |

## 1.3 Vínculo de DevOps con el problema del caso

El caso aborda una **economía de subsistencia** (personas que limpian
parabrisas en cruces): sin ingreso fijo, sin protección social y socialmente
invisibilizadas. Nuestra solución busca **dar visibilidad y un canal de apoyo
económico** (propina digital por QR) a estas personas.

DevOps es directamente relevante para este objetivo social:

1. **Entrega continua = impacto continuo.** Al automatizar el despliegue,
   cualquier mejora (registrar más trabajadores, ajustar el flujo de propina)
   llega a los usuarios reales en minutos, no en semanas. La plataforma puede
   evolucionar al ritmo que la realidad social exige.

2. **Confiabilidad = confianza.** Una herramienta que maneja propinas debe
   estar siempre disponible y no perder datos. Las pruebas automáticas y el
   health check garantizan que la plataforma sea estable; si fallara, el
   conductor no podría apoyar y el trabajador perdería el ingreso.

3. **Bajo costo operativo = sostenibilidad.** Una iniciativa social rara vez
   tiene presupuesto. Un stack con planes gratuitos (Render, Vercel, GitHub
   Actions) y despliegue automatizado permite operar sin un equipo de
   infraestructura dedicado, haciendo el proyecto sostenible.

4. **Iteración basada en evidencia.** El monitoreo y las entregas pequeñas
   permiten validar rápido qué funciona con los usuarios reales (trabajadores y
   conductores) y corregir el rumbo, en lugar de construir durante meses algo
   que quizá no resuelva el problema.

En resumen: DevOps no es solo eficiencia técnica, sino lo que hace que una
solución social pequeña pueda **lanzarse, mantenerse y mejorar de forma
confiable y sostenible** para las personas a las que busca dignificar.
