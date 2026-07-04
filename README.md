# GLP-1 Guide

Base inicial de arquitectura para una plataforma SaaS de acompanamiento para personas en tratamiento con agonistas GLP-1.

## Ya existe

- Documentacion de arquitectura, dominio, datos y navegacion.
- Guia visual base extraida de la referencia compartida.
- Scaffold inicial de React 19 + Vite + TypeScript.
- Shell visual con rutas para dashboard, dosificador, sintomas y reportes.

## Stack objetivo

- React 19
- Vite
- TypeScript
- React Router
- TanStack Query
- Zustand
- TailwindCSS
- shadcn/ui
- React Hook Form
- Zod
- react-i18next
- Supabase
- PostgreSQL
- Stripe Billing
- Resend
- Sentry
- PostHog

## Como seguir

1. Instalar dependencias con `npm install`.
2. Levantar la app con `npm run dev`.
3. Ajustar el primer flujo real que quieras construir.

## Supabase

- Crea un archivo `.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
- Configura `auth` en Supabase con email/password.
- Deja Stripe para la siguiente capa; la vista de suscripcion ya esta preparada.
- Define `VITE_STRIPE_CHECKOUT_URL` y `VITE_STRIPE_CUSTOMER_PORTAL_URL` cuando tengas Stripe listo.
- Aplica la migracion en `supabase/migrations/202607030001_create_subscriptions.sql`.
- Revisa `docs/supabase-stripe-setup.md` para conectar metadata, webhook y permisos.

## Siguiente decision

Podemos continuar por una de estas rutas:

1. Onboarding + quiz que construye el `TreatmentProfile`
2. Dashboard dinamico basado en recomendaciones
3. Supabase auth + suscripcion activa
4. Sistema de design system reusable con componentes base
