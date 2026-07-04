# Propuesta de Datos

## Objetivo

Diseñar PostgreSQL desde el dominio, no al reves.

## Reglas generales

- Foreign keys para relaciones criticas.
- Indexes en campos de busqueda y filtros frecuentes.
- Constraints para integridad de estados y rangos.
- Views para lecturas compuestas frecuentes.
- Functions para logica repetida en base de datos.
- Triggers solo donde aporten valor real.
- RLS obligatorio para todo dato sensible.
- Soft delete cuando exista necesidad de auditoria o recuperacion.

## Tablas candidatas

- `users`
- `treatment_profiles`
- `medications`
- `doses`
- `symptoms`
- `symptom_records`
- `recommendations`
- `alerts`
- `medical_reports`
- `subscriptions`
- `notifications`
- `quizzes`
- `questions`
- `answers`
- `conditions`
- `goals`
- `reminders`

## Observaciones

- `users` no debe duplicar lo que ya viva en Auth de Supabase.
- `subscriptions` debe sincronizarse con Stripe por webhooks.
- `recommendations` debe guardar tanto la regla aplicada como el resultado.
- `symptom_records` debe permitir historico temporal para evolucion.

## Seguridad

- JWT y session handling desde Supabase Auth.
- RLS para lectura y escritura por usuario.
- Policies diferentes para usuarios, admin y procesos de webhook.

