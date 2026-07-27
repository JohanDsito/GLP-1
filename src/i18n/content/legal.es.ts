export const legalContentEs = {
  draftNotice: 'Borrador preliminar — pendiente de revisión por un abogado antes del lanzamiento.',
  backToApp: 'Volver',
  terms: {
    title: 'Términos y condiciones',
    updated: 'Última actualización: julio de 2026',
    sections: [
      {
        h: '1. Naturaleza del servicio',
        p: 'Lumea es una aplicación de acompañamiento y educación para personas en tratamiento con agonistas GLP-1. No es un servicio médico, no reemplaza la consulta con un profesional de la salud y no proporciona diagnóstico ni tratamiento médico.',
      },
      {
        h: '2. No es consejo médico',
        p: 'Todo el contenido (guías de efectos secundarios, alimentación, dosis de referencia, recordatorios) es informativo y general. Siempre debes consultar a tu médico o profesional de la salud antes de tomar decisiones sobre tu tratamiento, dosis o suplementos.',
      },
      {
        h: '3. Suscripción y pagos',
        p: 'El acceso al producto requiere una suscripción de pago procesada por Stripe. La suscripción se renueva de forma periódica hasta que la canceles desde el portal de facturación. Los precios y condiciones pueden cambiar con aviso previo.',
      },
      {
        h: '4. Cuenta del usuario',
        p: 'Eres responsable de la confidencialidad de tu cuenta y contraseña, y de la exactitud de los datos que registras. Debes ser mayor de edad para crear una cuenta.',
      },
      {
        h: '5. Uso adecuado',
        p: 'Te comprometes a usar la aplicación únicamente para fines personales y legítimos, y a no ingresar información falsa que pueda afectar tu seguimiento de salud.',
      },
      {
        h: '6. Limitación de responsabilidad',
        p: 'En la máxima medida permitida por la ley, no somos responsables de decisiones tomadas con base en la información de la app. Ante cualquier señal de alarma o emergencia, contacta a tu médico o a los servicios de emergencia.',
      },
      {
        h: '7. Contacto',
        p: 'Para dudas sobre estos términos, escríbenos al correo de soporte que aparece en la aplicación.',
      },
    ],
  },
  privacy: {
    title: 'Política de privacidad',
    updated: 'Última actualización: julio de 2026',
    sections: [
      {
        h: '1. Datos que recopilamos',
        p: 'Recopilamos los datos que ingresas al registrarte (nombre, apellido, correo, fecha de nacimiento y sexo) y los datos de seguimiento que registras (dosis, síntomas, peso, estado de ánimo, sueño). También datos técnicos básicos para el funcionamiento del servicio.',
      },
      {
        h: '2. Para qué los usamos',
        p: 'Usamos tus datos para personalizar tu experiencia, mostrar tu progreso, enviarte recordatorios y generar tu informe médico. No vendemos tus datos a terceros.',
      },
      {
        h: '3. Datos de salud',
        p: 'La información de salud que registras es sensible y se trata con especial cuidado. Solo tú puedes ver tus registros individuales; a nivel interno solo usamos datos agregados y anónimos.',
      },
      {
        h: '4. Dónde se almacenan',
        p: 'Tus datos se almacenan de forma segura en Supabase. Los pagos son procesados por Stripe; no almacenamos los datos de tu tarjeta.',
      },
      {
        h: '5. Tus derechos',
        p: 'Puedes acceder, corregir o solicitar la eliminación de tus datos escribiéndonos al correo de soporte. También puedes cancelar tu suscripción en cualquier momento.',
      },
      {
        h: '6. Notificaciones',
        p: 'Si activas las notificaciones push, guardamos la información técnica necesaria para enviártelas. Puedes desactivarlas cuando quieras desde la configuración de tu dispositivo o de la app.',
      },
      {
        h: '7. Contacto',
        p: 'Para ejercer tus derechos o resolver dudas de privacidad, escríbenos al correo de soporte que aparece en la aplicación.',
      },
    ],
  },
} as const;
