# Estrategia de branching

Usamos un flujo **GitFlow simplificado**, adecuado para un equipo pequeño con
despliegue continuo en Render (backend) y Vercel (frontend).

## Ramas

| Rama | Propósito | Despliega a |
|------|-----------|-------------|
| `main` | Código en producción, siempre estable. | Producción (Render + Vercel) |
| `develop` | Integración de funcionalidades terminadas. | Entorno de pruebas / preview |
| `feature/*` | Una rama por historia de usuario. | Preview de Vercel por PR |

Ejemplos de ramas de funcionalidad:

```
feature/registro-trabajadores
feature/propina-qr
feature/panel-admin
```

## Flujo de trabajo

1. Se crea la rama desde `develop`:
   `git checkout develop && git checkout -b feature/propina-qr`
2. Se desarrolla con **commits descriptivos** siguiendo Conventional Commits:
   `feat(tips): registrar propina digital por trabajador`
3. Se abre un **Pull Request** `feature/* → develop`.
4. El CI (GitHub Actions) ejecuta build + test automáticamente.
5. Tras **revisión y aprobación** de al menos un compañero, se hace merge.
6. Cuando `develop` está estable, se abre PR `develop → main` para liberar.
7. El merge a `main` dispara el **deploy automático** vía el job `deploy`.

## Convención de commits (Conventional Commits)

```
feat:     nueva funcionalidad
fix:      corrección de bug
docs:     documentación
refactor: cambio interno sin alterar comportamiento
test:     añadir o corregir pruebas
chore:    tareas de mantenimiento (deps, config)
```

## Relación con la Definition of Done

Una historia se considera **terminada** solo cuando:

- [ ] El código está en una rama `feature/*` con commits descriptivos.
- [ ] El PR pasa el CI (build + test en verde).
- [ ] Fue revisado y aprobado por otro miembro del equipo.
- [ ] Se integró a `develop` sin conflictos.
- [ ] Cumple los criterios de aceptación de la historia.
