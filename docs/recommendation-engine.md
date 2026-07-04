# Recommendation Engine

## Proposito

Priorizar contenido y acciones segun el perfil dinamico del usuario.

## Entrada

- TreatmentProfile
- sintomas actuales
- historial reciente
- objetivo principal
- adherencia
- uso del medicamento
- estado de suscripcion
- idioma

## Salida

- orden de widgets del dashboard
- recomendaciones principales
- alertas
- recordatorios
- tono de comunicacion
- modulo destacado

## Enfoque

No usar cadenas largas de condicionales por fase.
Usar una capa de reglas con prioridad y puntuacion.

## Ejemplo de prioridad

- nausea activa -> guia de nausea
- caida de cabello -> modulo capilar
- abandono del tratamiento -> plan anti rebote
- ausencia de sintomas -> prevencion

## Componentes sugeridos

- Rule definitions
- Scoring engine
- Priority resolver
- Presentation mapper

## Resultado esperado

El dashboard siempre debe sentirse personal y relevante.

