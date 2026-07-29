export const sideEffectsContentEs = {
  // ── Sección 1 — Gastrointestinales ──────────────────────────────────────
  nausea: {
    title: 'Náuseas',
    cause:
      'Es el efecto más común. Los GLP-1 retrasan el vaciamiento gástrico (la comida permanece más tiempo en el estómago) y activan receptores en el cerebro que controlan el reflejo de la náusea. Depende de la dosis, aparece sobre todo en las primeras semanas y al subir dosis, y suele mejorar con el tiempo.',
    whatToDo:
      'Titulación lenta de la dosis; comidas pequeñas y frecuentes; evitar alimentos grasos, fritos y muy dulces; comer despacio y parar al sentirse lleno; no acostarse justo después de comer; mantener hidratación. Consulta al médico si las náuseas te impiden comer o beber, o si son persistentes.',
    supplements: ['Jengibre', 'Vitamina B6 (piridoxina) — evidencia en náusea del embarazo, no específica de GLP-1'],
  },
  vomiting: {
    title: 'Vómitos',
    cause:
      'Mismo mecanismo que las náuseas (vaciamiento gástrico retrasado). Suele desencadenarse al comer demasiado, demasiado rápido o alimentos grasos. Afectan a alrededor del 25% de los usuarios; las reacciones digestivas severas son poco frecuentes.',
    whatToDo:
      'Porciones pequeñas, evitar grasas, comer lento. Busca atención médica si el vómito persiste más de 24-48 horas, no toleras líquidos, o hay signos de deshidratación o dolor abdominal intenso (riesgo de deshidratación y lesión renal). Puede requerir reducir la dosis o pausar el tratamiento.',
    supplements: ['Jengibre', 'Vitamina B6', 'Soluciones de rehidratación oral con electrolitos'],
  },
  diarrhea: {
    title: 'Diarrea',
    cause:
      'Los GLP-1 alteran la motilidad intestinal; en algunas personas aceleran el tránsito o cambian la microbiota, produciendo heces sueltas. Afecta a alrededor del 30% de los usuarios.',
    whatToDo:
      'Hidrátate bien con líquidos claros y electrolitos; evita lácteos, cafeína, alcohol y edulcorantes tipo polioles (sorbitol, xilitol); dieta blanda. Consulta si es intensa, con sangre, con fiebre o dura varios días.',
    supplements: ['Probióticos', 'Fibra soluble suave', 'Soluciones de rehidratación con electrolitos'],
  },
  constipation: {
    title: 'Estreñimiento',
    cause:
      'Al enlentecerse la digestión, los desechos permanecen más tiempo en el colon, se reabsorbe más agua y las heces se endurecen. Comer menos cantidad y menos fibra lo agrava. Afecta a alrededor del 24% de los usuarios.',
    whatToDo:
      'Aumenta la fibra de forma gradual, hidratación abundante y actividad física (unos 150 minutos/semana de intensidad moderada). Usa laxante solo si aparece el síntoma (enfoque reactivo, no preventivo). Consulta si no evacúas durante varios días o hay dolor o distensión importante.',
    supplements: ['Magnesio (óxido o citrato)', 'Fibra de psyllium', 'Probióticos', 'Kiwi'],
  },
  reflux: {
    title: 'Reflujo / acidez',
    cause:
      'El vaciamiento gástrico más lento aumenta la presión dentro del estómago y prolonga la exposición al ácido, empujándolo hacia el esófago. Es peor durante las subidas de dosis y suele mejorar hacia los meses 2-3 en cada dosis.',
    whatToDo:
      'Comidas pequeñas; evita grasas, cafeína, alcohol, picantes y ácidos; no te acuestes durante 2-3 horas tras comer; camina 10 minutos después de la cena; antiácidos de venta libre. Si no mejora o es severo, consulta (pueden indicarse inhibidores de la bomba de protones, seguros junto con GLP-1).',
    supplements: [],
  },
  sulfurBurps: {
    title: 'Eructos con olor a huevo podrido',
    cause:
      'Al retrasarse el vaciamiento gástrico, las bacterias intestinales fermentan más tiempo los aminoácidos con azufre de alimentos ricos en azufre, produciendo gas sulfuro de hidrógeno que sale como eructo con olor a huevo. Es peor 24-72 horas tras la inyección y al subir dosis; suele mejorar en 2-4 semanas.',
    whatToDo:
      'Limita alimentos azufrados (huevos, ajo, cebolla, brócoli, coliflor, coles, carnes rojas), sobre todo alrededor del día de inyección; comidas pequeñas; lleva un diario de alimentos para identificar desencadenantes; hidratación. Remedios de venta libre como simeticona o subsalicilato de bismuto.',
    supplements: ['Probióticos', 'Simeticona (para el gas)', 'Bismuto'],
  },
  bloatingGas: {
    title: 'Gases y distensión',
    cause:
      'La comida permanece más tiempo en el tubo digestivo, lo que aumenta la fermentación bacteriana y la producción de gas, causando distensión abdominal, eructos y flatulencia.',
    whatToDo:
      'Come lento (para tragar menos aire); reduce alimentos muy fermentables; comidas pequeñas; actividad física; identifica desencadenantes.',
    supplements: ['Simeticona', 'Aceite de menta (antiespasmódico)', 'Probióticos'],
  },
  dehydration: {
    title: 'Deshidratación',
    cause:
      'La menor sensación de sed, junto con náuseas, vómitos o diarrea, puede reducir la ingesta de líquidos o aumentar su pérdida.',
    whatToDo:
      'Programa recordatorios para beber agua a lo largo del día en vez de esperar a tener sed. Incluye alimentos ricos en agua. Vigila señales como orina oscura, mareo o boca seca, y contacta a tu médico si aparecen.',
    supplements: ['Soluciones de rehidratación con electrolitos'],
  },

  // ── Sección 2 — Sistémicos y cosméticos ─────────────────────────────────
  fatigue: {
    title: 'Fatiga extrema',
    cause:
      'Principalmente por la reducción brusca de calorías (menos energía disponible), la deshidratación derivada de síntomas digestivos, posibles bajones de glucosa y déficits nutricionales (hierro, complejo B, magnesio). Es más intensa durante la titulación y suele mejorar al estabilizar la dosis.',
    whatToDo:
      'Hidratación; comidas pequeñas y frecuentes con suficiente proteína; movimiento suave (caminar); prioriza el sueño. Consulta si la fatiga es severa, persiste más de 4 semanas o interfiere con tu vida diaria (pueden pedir análisis para descartar otras causas).',
    supplements: ['Corregir déficits de hierro, B12/complejo B, vitamina D y magnesio (guiado por laboratorio)', 'Proteína adecuada'],
  },
  hairLoss: {
    title: 'Pérdida de cabello',
    cause:
      'No es un daño directo del fármaco, sino telogen effluvium: la pérdida de peso rápida y el estrés metabólico empujan muchos folículos a la fase de reposo, con caída difusa 2-4 meses después. Es más frecuente en mujeres y generalmente temporal y reversible.',
    whatToDo:
      'Asegura proteína y calorías suficientes; evita una pérdida de peso demasiado agresiva; pide al médico que revise ferritina, tiroides (TSH), vitamina D y zinc. La caída suele resolverse a medida que el cuerpo se adapta.',
    supplements: ['Corregir déficits de hierro/ferritina, zinc y vitamina D', 'Proteína adecuada', 'Colágeno hidrolizado + zinc + complejo B (evidencia en población general)'],
  },
  facialAging: {
    title: 'Cara más hundida ("Ozempic face")',
    cause:
      'No es un daño del fármaco a la piel; es la consecuencia de la pérdida rápida de grasa subcutánea facial. Los compartimentos de grasa se desinflan más rápido de lo que la piel puede retraerse, dejando la cara más hundida y con más arrugas. Ocurre con cualquier pérdida de peso rápida.',
    whatToDo:
      'Ritmo de pérdida de peso más gradual; proteína adecuada; protección solar y cuidado de la piel. Para laxitud significativa, evalúa con un dermatólogo o cirujano plástico (rellenos, láser, radiofrecuencia).',
    supplements: ['Proteína suficiente', 'Colágeno hidrolizado con vitamina C'],
  },
  looseSkin: {
    title: 'Flacidez de la piel',
    cause:
      'La piel pierde la grasa de soporte más rápido de lo que puede contraerse; con una pérdida grande y rápida, el colágeno y la elastina no se adaptan a tiempo, dejando piel colgante en abdomen, brazos o muslos.',
    whatToDo:
      'Pérdida de peso más lenta; entrenamiento de fuerza para preservar músculo y dar soporte; hidratación de la piel. Para exceso importante de piel, evaluación dermatológica o quirúrgica.',
    supplements: ['Proteína adecuada', 'Colágeno hidrolizado con vitamina C, zinc y cobre'],
  },
  glutealLoss: {
    title: 'Pérdida de glúteos y curvas ("Ozempic butt")',
    cause:
      'Pérdida de grasa subcutánea glútea combinada con pérdida de masa muscular. Una parte relevante del peso perdido puede ser masa magra si no se contrarresta. Es una respuesta fisiológica normal a la pérdida de peso, no una complicación.',
    whatToDo:
      'Entrenamiento de fuerza 2-3 veces/semana, especialmente ejercicios de glúteos; proteína adecuada (objetivo orientativo superior a ~1,2 g/kg/día distribuida en el día); ritmo de pérdida controlado.',
    supplements: ['Proteína (incluida proteína en polvo)', 'Creatina (junto con entrenamiento de fuerza)', 'Vitamina D si hay déficit'],
  },
  muscleLoss: {
    title: 'Pérdida muscular',
    cause:
      'Una parte importante de la pérdida rápida de peso puede provenir de músculo en lugar de grasa si no se priorizan la proteína y el entrenamiento de fuerza. Es uno de los efectos más prevenibles con la rutina adecuada.',
    whatToDo:
      'Prioriza proteína en cada comida e incluye entrenamiento de fuerza (aunque sea suave, en casa) en vez de solo cardio. Pregunta a tu médico o a un entrenador sobre un plan adecuado a tu situación.',
    supplements: ['Suplementación de proteína (whey o vegetal, si la dieta no alcanza)', 'Creatina (junto con entrenamiento de fuerza)'],
  },
  headache: {
    title: 'Dolor de cabeza',
    cause:
      'Puede relacionarse con la deshidratación, la baja ingesta de alimentos/calorías o la adaptación del cuerpo al medicamento.',
    whatToDo:
      'Primero revisa tu hidratación y si has comido suficiente ese día. Descansa en un lugar tranquilo y oscuro si hace falta. Si los dolores de cabeza son frecuentes, severos o nuevos para ti, coméntalo con tu médico.',
    supplements: [],
  },

  // ── Sección 3 — Genitourinarios, sexuales y hormonales ──────────────────
  vulvarVolume: {
    title: 'Pérdida de volumen en zona vulvar',
    cause:
      'Término no médico. La pérdida rápida de peso reduce la grasa del monte de Venus y de los labios, causando flacidez de la piel vulvar; la caída relativa de estrógeno asociada a la pérdida de grasa puede contribuir. No es un daño directo del fármaco.',
    whatToDo:
      'Ritmo de pérdida gradual; entrenamiento del suelo pélvico; hidratación y nutrición adecuadas. Consulta con un ginecólogo si hay molestias o cambios importantes. Para la sequedad asociada, revisa el efecto de sequedad vaginal.',
    supplements: [],
  },
  vaginalDryness: {
    title: 'Sequedad vaginal',
    cause:
      'La pérdida de grasa y los cambios hormonales (descenso relativo de estrógeno) pueden adelgazar y resecar la mucosa vaginal; la deshidratación y los cambios en la microbiota también contribuyen. No figura como reacción adversa en las fichas técnicas; se conoce por reportes clínicos.',
    whatToDo:
      'Hidratación general; hidratantes vaginales de uso regular y lubricantes para las relaciones; consulta con un ginecólogo, que puede indicar estrógeno vaginal local si es más severo.',
    supplements: ['Hidratantes vaginales de ácido hialurónico (tópicos)', 'Óvulos de vitamina E (tópicos)'],
  },
  libidoLoss: {
    title: 'Pérdida de libido',
    cause:
      'Multifactorial: los GLP-1 actúan sobre las vías de recompensa cerebrales (dopamina), lo que en algunas personas reduce el deseo; también influyen la fatiga, las náuseas, los cambios hormonales por la pérdida de peso y la sequedad vaginal. La evidencia es limitada.',
    whatToDo:
      'Optimiza nutrición e hidratación; revisa hormonas, tiroides y nutrientes; maneja la sequedad; comunicación abierta con tu pareja; habla con tu médico sobre ajuste de dosis o cambio de fármaco.',
    supplements: [],
  },
  anorgasmia: {
    title: 'Dificultad para llegar al orgasmo',
    cause:
      'Existe algún reporte de caso de anorgasmia tras iniciar un GLP-1, con un mecanismo propuesto vía modulación de neurotransmisores en las vías de recompensa; también contribuyen la reducción de sensibilidad, la sequedad y factores hormonales. La evidencia es muy preliminar.',
    whatToDo:
      'Descarta otras causas (medicamentos, hormonas, factores psicológicos); consulta con tu médico o un especialista en medicina sexual; considera un ajuste del tratamiento.',
    supplements: [],
  },
  menstrualChanges: {
    title: 'Cambios menstruales',
    cause:
      'No es un efecto directo, sino consecuencia de la pérdida de peso y los cambios metabólicos/hormonales. En personas con SOP suele mejorar la regularidad; con una pérdida grande y rápida pueden aparecer irregularidades o incluso ausencia de regla si la grasa corporal cae por debajo de cierto umbral.',
    whatToDo:
      'Lleva un registro del ciclo; descarta embarazo si falta la regla; consulta al ginecólogo ante cambios importantes, sangrado abundante o persistente. La mayoría de los cambios son temporales.',
    supplements: [],
  },
  chillsHotFlashes: {
    title: 'Escalofríos / sofocos',
    cause:
      'No están listados como efectos formales, pero se reportan en la práctica. Posibles causas: cambios en el metabolismo y en la regulación de la temperatura, cambios hormonales por la pérdida de peso, o bajones de glucosa (que causan sudoración y escalofríos). Ojo: sudoración y escalofríos con temblor pueden ser signo de hipoglucemia.',
    whatToDo:
      'Descarta hipoglucemia (come si tienes síntomas de bajón); vístete en capas; hidratación; coméntalo con tu médico si son frecuentes o intensos.',
    supplements: [],
  },
  vividDreams: {
    title: 'Sueños vívidos',
    cause:
      'No es un efecto oficial en las fichas técnicas. Se propone que la modulación de neurotransmisores por los GLP-1 podría alterar los sueños; también influyen los bajones de glucosa nocturnos y los cambios en el sueño. La investigación es limitada.',
    whatToDo:
      'Higiene del sueño; evita comidas pesadas y alcohol antes de dormir; coméntalo con tu médico si interfieren con el descanso (pueden ajustar la dosis o el momento de la inyección).',
    supplements: [],
  },

  // ── Sección 4 — Complicaciones serias ───────────────────────────────────
  gastroparesis: {
    title: 'Gastroparesia / íleo (parálisis gástrica o intestinal)',
    cause:
      'El mismo enlentecimiento del vaciamiento gástrico puede, en algunos casos, llevar a gastroparesia (retraso marcado del vaciamiento) o incluso íleo (parálisis intestinal). El riesgo aumenta con la escalada rápida de dosis sin respetar la titulación. La mayoría de los casos se resuelve tras suspender el medicamento.',
    whatToDo:
      'SEÑALES DE ALARMA que requieren atención médica: dolor abdominal intenso, distensión marcada, vómitos persistentes, incapacidad de tolerar alimentos o líquidos, estreñimiento severo. Respeta siempre la titulación lenta. Puede requerir estudios y suspensión del medicamento. No es un cuadro para manejar con suplementos.',
    supplements: [],
  },
  injectionSite: {
    title: 'Dolor en el sitio de inyección',
    cause:
      'Distensión del tejido por el líquido inyectado e irritación local; la técnica y la temperatura fría del medicamento influyen. Las reacciones locales (enrojecimiento, hinchazón, picor, pequeños nódulos) son comunes y suelen resolverse en 1-3 días.',
    whatToDo:
      'Deja que el medicamento alcance temperatura ambiente antes de inyectar (no lo calientes artificialmente); rota los sitios (abdomen, muslo, parte posterior del brazo), a 2-3 cm del punto previo, sin repetir el mismo sitio durante 4 semanas; inyecta lento a 90°; aplica compresa fría después. Consulta si hay enrojecimiento con calor, pus, fiebre o dolor severo; busca atención inmediata ante signos de reacción alérgica grave (dificultad para respirar, hinchazón que se extiende).',
    supplements: [],
  },
  hypoglycemia: {
    title: 'Temblores, sudoración, confusión, taquicardia (señales de alarma)',
    cause:
      'La combinación de temblores, sudoración fría, confusión y taquicardia (también mareo, hambre intensa, visión borrosa, dificultad para hablar, debilidad) es el cuadro clásico de HIPOGLUCEMIA (azúcar en sangre bajo). La semaglutida/tirzepatida por sí solas rara vez la causan, pero el riesgo aumenta mucho con insulina o sulfonilureas, o al saltarse comidas, hacer ejercicio intenso sin comer, tomar alcohol o no comer por náuseas.',
    whatToDo:
      'ESTO PUEDE SER UNA EMERGENCIA. Si hay síntomas leves-moderados y es posible, mide la glucosa y aplica la regla 15/15: toma 15 g de carbohidrato rápido (jugo, tabletas de glucosa, caramelo), espera 15 minutos y repite si sigue baja. Si hay confusión intensa, pérdida de conciencia, convulsiones o no mejora: LLAMA A EMERGENCIAS de inmediato (puede requerir glucagón). No se maneja con suplementos.',
    supplements: [],
  },

  // ── Sección 5 — Psicológicos ────────────────────────────────────────────
  moodSwings: {
    title: 'Cambios de humor / irritabilidad',
    cause:
      'Los cambios rápidos en los patrones de alimentación, en la glucemia y el ajuste emocional de cambiar tu relación con la comida pueden afectar el estado de ánimo.',
    whatToDo:
      'Lleva un registro diario simple de cómo te sientes: los patrones son más fáciles de ver escritos que recordados. Comer con regularidad (aunque sean porciones pequeñas) ayuda a estabilizar la glucemia y el ánimo. Hablar con alguien de confianza o con un terapeuta sobre el lado emocional de este proceso puede ayudar.',
    supplements: [],
  },
  anxiety: {
    title: 'Ansiedad',
    cause:
      'Puede venir del ajuste físico al medicamento, de la preocupación por los efectos secundarios o del peso emocional de un gran cambio de estilo de vida.',
    whatToDo:
      'Las técnicas de anclaje (respiración lenta, caminatas cortas) pueden ayudar en el momento. Mantener una rutina consistente reduce la incertidumbre. Si la ansiedad es persistente o afecta tu día a día, vale la pena hablar con tu médico o un profesional de salud mental: es común y tratable.',
    supplements: [],
  },
  lowMotivation: {
    title: 'Baja motivación / apatía',
    cause:
      'La menor ingesta de energía, la fatiga y el esfuerzo mental de mantener una nueva rutina pueden reducir la motivación para tareas que antes parecían fáciles.',
    whatToDo:
      'Divide las tareas en pasos más pequeños. Las pequeñas victorias constantes (una caminata corta, una comida saludable) reconstruyen el impulso mejor que intentar hacer todo de una vez. Si sientes que es más que baja energía (como perder interés en cosas que antes disfrutabas), habla con tu médico.',
    supplements: [],
  },
  insomnia: {
    title: 'Insomnio / dificultad para dormir',
    cause:
      'Los cambios en el horario de las comidas, las fluctuaciones de glucemia o la ansiedad sobre el proceso de tratamiento pueden alterar el sueño.',
    whatToDo:
      'Mantén un horario consistente para acostarte y despertar. Evita comidas grandes o pantallas justo antes de dormir. Si el mal sueño continúa más de dos semanas o te sientes agotado al día siguiente de forma constante, coméntalo con tu médico.',
    supplements: [],
  },
  foodRelationship: {
    title: 'Cambio en la relación con la comida',
    cause:
      'Perder el deseo de comer por consuelo, o notar cambios en el control de impulsos con la comida, el alcohol o las compras, es un efecto reconocido que algunas personas experimentan a medida que cambian las señales de apetito.',
    whatToDo:
      'Puede resultar desorientador incluso cuando la pérdida de peso en sí es bienvenida. Date tiempo para ajustarte a una nueva relación con la comida en vez de esperar que se sienta "normal" de inmediato. Si notas cambios importantes de ánimo, uso de alcohol o hábitos de gasto, vale la pena hablarlo con tu médico.',
    supplements: [],
  },
} as const;
