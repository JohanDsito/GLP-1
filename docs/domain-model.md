# Modelo de Dominio

## Entidades principales

- User
- TreatmentProfile
- Medication
- Dose
- Symptom
- SymptomRecord
- Recommendation
- Alert
- MedicalReport
- Subscription
- Notification
- Quiz
- Question
- Answer
- Language
- Condition
- Goal
- Reminder

## TreatmentProfile

Es el centro del dominio. Representa el estado real del usuario y resume:

- etapa del tratamiento
- severidad de sintomas
- medicamento utilizado
- condicion medica
- idioma
- evolucion
- frecuencia de dosis
- historial de registros
- objetivo principal

## Relacion funcional

```text
Quiz -> TreatmentProfile -> Recommendation Engine -> Dashboard
                      -> Alerts
                      -> Reminders
                      -> Reports
```

## Mentalidades principales

- Preventivo: busca evitar problemas y mantener el tratamiento.
- Reactivo: ya presenta sintomas y necesita alivio y documentacion.

## Regla central

La aplicacion siempre responde:

```text
Que necesita este usuario exactamente hoy
```

No:

```text
Que modulo le corresponde
```

