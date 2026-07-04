# Arquitectura Base

## Principios

- Feature first, nunca por tipo de archivo.
- Clean Architecture adaptada al frontend.
- Separacion clara entre UI, dominio, casos de uso y acceso a datos.
- Reglas de negocio en servicios y motores, no en componentes.
- Personalizacion basada en `TreatmentProfile`, no en una variable de fase.

## Capas

### Presentation

- Pages
- Layouts
- UI components
- Route guards
- Local form state

### Application

- Use cases
- Orquestacion de flujo
- DTOs
- Validacion de entradas

### Domain

- Entidades
- Value objects
- Reglas de negocio
- Policies
- Recommendation rules

### Infrastructure

- Supabase client
- Auth
- Query adapters
- Persistence repositories
- Stripe, Resend, Sentry, PostHog

## Estructura de alto nivel

```text
src/
  app/
  features/
  shared/
  entities/
  services/
  routes/
  i18n/
```

## Reglas de organizacion

- Cada feature contiene su UI, hooks, queries, services y tipos.
- `shared` solo contiene piezas verdaderamente reutilizables.
- `entities` guarda el modelo de dominio comun.
- `services` expone integraciones transversales.
- `app` concentra bootstrap, providers y composicion general.

## Decisiones clave

- El dashboard se construye desde un ranking de prioridades.
- El quiz no clasifica; construye el perfil dinamico.
- La suscripcion activa es un requisito de acceso.
- Los textos se cargan desde i18n desde el primer dia.

