export const sideEffectsContentPt = {
  // ── Seção 1 — Gastrointestinais ─────────────────────────────────────────
  nausea: {
    title: 'Náusea',
    cause:
      'É o efeito mais comum. Os GLP-1 retardam o esvaziamento gástrico (a comida permanece mais tempo no estômago) e ativam receptores no cérebro que controlam o reflexo da náusea. Depende da dose, aparece principalmente nas primeiras semanas e ao aumentar a dose, e costuma melhorar com o tempo.',
    whatToDo:
      'Titulação lenta da dose; refeições pequenas e frequentes; evitar alimentos gordurosos, fritos e muito doces; comer devagar e parar ao se sentir cheio; não deitar logo após comer; manter a hidratação. Contate o médico se a náusea impedir você de comer ou beber, ou se for persistente.',
    supplements: ['Gengibre', 'Vitamina B6 (piridoxina) — evidência na náusea da gravidez, não específica de GLP-1'],
  },
  vomiting: {
    title: 'Vômito',
    cause:
      'Mesmo mecanismo da náusea (esvaziamento gástrico retardado). Costuma ser desencadeado por comer demais, rápido demais ou alimentos gordurosos. Afeta cerca de 25% dos usuários; reações digestivas graves são incomuns.',
    whatToDo:
      'Porções pequenas, evitar gorduras, comer devagar. Procure atendimento médico se o vômito durar mais de 24-48 horas, você não tolerar líquidos, ou houver sinais de desidratação ou dor abdominal intensa (risco de desidratação e lesão renal). Pode exigir reduzir a dose ou pausar o tratamento.',
    supplements: ['Gengibre', 'Vitamina B6', 'Soluções de reidratação oral com eletrólitos'],
  },
  diarrhea: {
    title: 'Diarreia',
    cause:
      'Os GLP-1 alteram a motilidade intestinal; em algumas pessoas aceleram o trânsito ou mudam a microbiota, produzindo fezes moles. Afeta cerca de 30% dos usuários.',
    whatToDo:
      'Hidrate-se bem com líquidos claros e eletrólitos; evite laticínios, cafeína, álcool e adoçantes tipo polióis (sorbitol, xilitol); dieta leve. Consulte se for intensa, com sangue, com febre ou durar vários dias.',
    supplements: ['Probióticos', 'Fibra solúvel suave', 'Soluções de reidratação com eletrólitos'],
  },
  constipation: {
    title: 'Prisão de ventre',
    cause:
      'Ao desacelerar a digestão, os resíduos permanecem mais tempo no cólon, mais água é reabsorvida e as fezes endurecem. Comer menos quantidade e menos fibra agrava. Afeta cerca de 24% dos usuários.',
    whatToDo:
      'Aumente a fibra gradualmente, hidratação abundante e atividade física (cerca de 150 minutos/semana de intensidade moderada). Use laxante só se o sintoma aparecer (abordagem reativa, não preventiva). Consulte se ficar vários dias sem evacuar ou tiver dor ou distensão importante.',
    supplements: ['Magnésio (óxido ou citrato)', 'Fibra de psyllium', 'Probióticos', 'Kiwi'],
  },
  reflux: {
    title: 'Refluxo / azia',
    cause:
      'O esvaziamento gástrico mais lento aumenta a pressão dentro do estômago e prolonga a exposição ao ácido, empurrando-o para o esôfago. É pior durante os aumentos de dose e costuma melhorar por volta dos meses 2-3 em cada dose.',
    whatToDo:
      'Refeições pequenas; evite gorduras, cafeína, álcool, picantes e ácidos; não deite por 2-3 horas após comer; caminhe 10 minutos após o jantar; antiácidos de venda livre. Se não melhorar ou for grave, consulte (podem indicar inibidores de bomba de prótons, seguros junto com GLP-1).',
    supplements: [],
  },
  sulfurBurps: {
    title: 'Arrotos com cheiro de ovo podre',
    cause:
      'Com o esvaziamento gástrico retardado, as bactérias intestinais fermentam por mais tempo os aminoácidos com enxofre de alimentos ricos em enxofre, produzindo gás sulfeto de hidrogênio que sai como arroto com cheiro de ovo. É pior 24-72 horas após a injeção e ao aumentar a dose; costuma melhorar em 2-4 semanas.',
    whatToDo:
      'Limite alimentos ricos em enxofre (ovos, alho, cebola, brócolis, couve-flor, repolho, carnes vermelhas), sobretudo perto do dia da injeção; refeições pequenas; mantenha um diário alimentar para identificar gatilhos; hidratação. Remédios de venda livre como simeticona ou subsalicilato de bismuto.',
    supplements: ['Probióticos', 'Simeticona (para o gás)', 'Bismuto'],
  },
  bloatingGas: {
    title: 'Gases e distensão',
    cause:
      'A comida permanece mais tempo no trato digestivo, o que aumenta a fermentação bacteriana e a produção de gás, causando distensão abdominal, arrotos e flatulência.',
    whatToDo:
      'Coma devagar (para engolir menos ar); reduza alimentos muito fermentáveis; refeições pequenas; atividade física; identifique gatilhos.',
    supplements: ['Simeticona', 'Óleo de hortelã (antiespasmódico)', 'Probióticos'],
  },
  dehydration: {
    title: 'Desidratação',
    cause:
      'A menor sensação de sede, junto com náuseas, vômitos ou diarreia, pode reduzir a ingestão de líquidos ou aumentar sua perda.',
    whatToDo:
      'Programe lembretes para beber água ao longo do dia em vez de esperar sentir sede. Inclua alimentos ricos em água. Fique atento a sinais como urina escura, tontura ou boca seca, e contate seu médico se aparecerem.',
    supplements: ['Soluções de reidratação com eletrólitos'],
  },

  // ── Seção 2 — Sistêmicos e cosméticos ───────────────────────────────────
  fatigue: {
    title: 'Fadiga extrema',
    cause:
      'Principalmente pela redução brusca de calorias (menos energia disponível), pela desidratação decorrente de sintomas digestivos, possíveis quedas de glicose e déficits nutricionais (ferro, complexo B, magnésio). É mais intensa durante a titulação e costuma melhorar ao estabilizar a dose.',
    whatToDo:
      'Hidratação; refeições pequenas e frequentes com proteína suficiente; movimento leve (caminhar); priorize o sono. Consulte se a fadiga for grave, durar mais de 4 semanas ou interferir na sua vida diária (podem pedir exames para descartar outras causas).',
    supplements: ['Corrigir déficits de ferro, B12/complexo B, vitamina D e magnésio (guiado por laboratório)', 'Proteína adequada'],
  },
  hairLoss: {
    title: 'Queda de cabelo',
    cause:
      'Não é dano direto do medicamento, e sim eflúvio telógeno: a perda rápida de peso e o estresse metabólico empurram muitos folículos para a fase de repouso, com queda difusa 2-4 meses depois. É mais comum em mulheres e geralmente temporária e reversível.',
    whatToDo:
      'Garanta proteína e calorias suficientes; evite perda de peso agressiva demais; peça ao médico para verificar ferritina, tireoide (TSH), vitamina D e zinco. A queda costuma se resolver conforme o corpo se adapta.',
    supplements: ['Corrigir déficits de ferro/ferritina, zinco e vitamina D', 'Proteína adequada', 'Colágeno hidrolisado + zinco + complexo B (evidência na população geral)'],
  },
  facialAging: {
    title: 'Rosto mais abatido ("Ozempic face")',
    cause:
      'Não é dano do medicamento à pele; é consequência da perda rápida de gordura subcutânea facial. Os compartimentos de gordura murcham mais rápido do que a pele consegue retrair, deixando o rosto mais fundo e enrugado. Ocorre com qualquer perda de peso rápida.',
    whatToDo:
      'Ritmo de perda de peso mais gradual; proteína adequada; proteção solar e cuidados com a pele. Para flacidez significativa, avalie com dermatologista ou cirurgião plástico (preenchimentos, laser, radiofrequência).',
    supplements: ['Proteína suficiente', 'Colágeno hidrolisado com vitamina C'],
  },
  looseSkin: {
    title: 'Flacidez da pele',
    cause:
      'A pele perde a gordura de sustentação mais rápido do que consegue se contrair; com uma perda grande e rápida, o colágeno e a elastina não se adaptam a tempo, deixando pele pendente no abdômen, braços ou coxas.',
    whatToDo:
      'Perda de peso mais lenta; treino de força para preservar músculo e dar sustentação; hidratação da pele. Para excesso importante de pele, avaliação dermatológica ou cirúrgica.',
    supplements: ['Proteína adequada', 'Colágeno hidrolisado com vitamina C, zinco e cobre'],
  },
  glutealLoss: {
    title: 'Perda de glúteos e curvas ("Ozempic butt")',
    cause:
      'Perda de gordura subcutânea glútea combinada com perda de massa muscular. Uma parte relevante do peso perdido pode ser massa magra se não for contrabalançada. É uma resposta fisiológica normal à perda de peso, não uma complicação.',
    whatToDo:
      'Treino de força 2-3 vezes/semana, especialmente exercícios de glúteos; proteína adequada (meta orientativa acima de ~1,2 g/kg/dia distribuída no dia); ritmo de perda controlado.',
    supplements: ['Proteína (incluindo proteína em pó)', 'Creatina (junto com treino de força)', 'Vitamina D se houver déficit'],
  },
  muscleLoss: {
    title: 'Perda muscular',
    cause:
      'Uma parte importante da perda rápida de peso pode vir de músculo em vez de gordura se a proteína e o treino de resistência não forem priorizados. É um dos efeitos mais preveníveis com a rotina certa.',
    whatToDo:
      'Priorize proteína em cada refeição e inclua treino de força (mesmo leve, em casa) em vez de apenas cardio. Pergunte ao seu médico ou a um treinador sobre um plano adequado à sua situação.',
    supplements: ['Suplementação de proteína (whey ou vegetal, se a dieta não bastar)', 'Creatina (junto com treino de força)'],
  },
  headache: {
    title: 'Dor de cabeça',
    cause:
      'Pode estar relacionada à desidratação, à baixa ingestão de alimentos/calorias ou à adaptação do corpo ao medicamento.',
    whatToDo:
      'Primeiro verifique sua hidratação e se você comeu o suficiente naquele dia. Descanse em um lugar tranquilo e escuro se necessário. Se as dores de cabeça forem frequentes, fortes ou novas para você, comente com seu médico.',
    supplements: [],
  },

  // ── Seção 3 — Genitourinários, sexuais e hormonais ──────────────────────
  vulvarVolume: {
    title: 'Perda de volume na região vulvar',
    cause:
      'Termo não médico. A perda rápida de peso reduz a gordura do monte de Vênus e dos lábios, causando flacidez da pele vulvar; a queda relativa de estrogênio associada à perda de gordura pode contribuir. Não é dano direto do medicamento.',
    whatToDo:
      'Ritmo de perda gradual; treino do assoalho pélvico; hidratação e nutrição adequadas. Consulte um ginecologista se houver desconforto ou mudanças importantes. Para a secura associada, veja o efeito de secura vaginal.',
    supplements: [],
  },
  vaginalDryness: {
    title: 'Secura vaginal',
    cause:
      'A perda de gordura e as mudanças hormonais (queda relativa de estrogênio) podem afinar e ressecar a mucosa vaginal; a desidratação e as mudanças na microbiota também contribuem. Não figura como reação adversa nas bulas; é conhecida por relatos clínicos.',
    whatToDo:
      'Hidratação geral; hidratantes vaginais de uso regular e lubrificantes para as relações; consulte um ginecologista, que pode indicar estrogênio vaginal local se for mais grave.',
    supplements: ['Hidratantes vaginais de ácido hialurônico (tópicos)', 'Óvulos de vitamina E (tópicos)'],
  },
  libidoLoss: {
    title: 'Perda de libido',
    cause:
      'Multifatorial: os GLP-1 agem nas vias de recompensa do cérebro (dopamina), o que reduz o desejo em algumas pessoas; a fadiga, as náuseas, as mudanças hormonais pela perda de peso e a secura vaginal também influenciam. A evidência é limitada.',
    whatToDo:
      'Otimize nutrição e hidratação; revise hormônios, tireoide e nutrientes; controle a secura; comunicação aberta com o parceiro; converse com seu médico sobre ajuste de dose ou troca de medicamento.',
    supplements: [],
  },
  anorgasmia: {
    title: 'Dificuldade para chegar ao orgasmo',
    cause:
      'Há um relato de caso de anorgasmia após iniciar um GLP-1, com mecanismo proposto via modulação de neurotransmissores nas vias de recompensa; a redução de sensibilidade, a secura e fatores hormonais também contribuem. A evidência é muito preliminar.',
    whatToDo:
      'Descarte outras causas (medicamentos, hormônios, fatores psicológicos); consulte seu médico ou um especialista em medicina sexual; considere um ajuste do tratamento.',
    supplements: [],
  },
  menstrualChanges: {
    title: 'Mudanças menstruais',
    cause:
      'Não é um efeito direto, mas consequência da perda de peso e das mudanças metabólicas/hormonais. Em pessoas com SOP, a regularidade costuma melhorar; com perda grande e rápida podem surgir irregularidades ou até ausência de menstruação se a gordura corporal cair abaixo de certo limite.',
    whatToDo:
      'Mantenha um registro do ciclo; descarte gravidez se faltar a menstruação; consulte o ginecologista diante de mudanças importantes, sangramento intenso ou persistente. A maioria das mudanças é temporária.',
    supplements: [],
  },
  chillsHotFlashes: {
    title: 'Calafrios / ondas de calor',
    cause:
      'Não estão listados como efeitos formais, mas são relatados na prática. Possíveis causas: mudanças no metabolismo e na regulação da temperatura, mudanças hormonais pela perda de peso, ou quedas de glicose (que causam suor e calafrios). Atenção: suor e calafrios com tremor podem ser sinal de hipoglicemia.',
    whatToDo:
      'Descarte hipoglicemia (coma se tiver sintomas de queda); vista-se em camadas; hidratação; comente com seu médico se forem frequentes ou intensos.',
    supplements: [],
  },
  vividDreams: {
    title: 'Sonhos vívidos',
    cause:
      'Não é um efeito oficial nas bulas. Propõe-se que a modulação de neurotransmissores pelos GLP-1 poderia alterar os sonhos; quedas noturnas de glicose e mudanças no sono também influenciam. A pesquisa é limitada.',
    whatToDo:
      'Higiene do sono; evite refeições pesadas e álcool antes de dormir; comente com seu médico se interferirem no descanso (podem ajustar a dose ou o horário da injeção).',
    supplements: [],
  },

  // ── Seção 4 — Complicações sérias ───────────────────────────────────────
  gastroparesis: {
    title: 'Gastroparesia / íleo (paralisia gástrica ou intestinal)',
    cause:
      'A mesma desaceleração do esvaziamento gástrico pode, em alguns casos, levar à gastroparesia (esvaziamento muito retardado) ou até a íleo (paralisia intestinal). O risco aumenta com a escalada rápida de dose sem respeitar a titulação. A maioria dos casos se resolve após suspender o medicamento.',
    whatToDo:
      'SINAIS DE ALARME que exigem atendimento médico: dor abdominal intensa, distensão marcada, vômitos persistentes, incapacidade de tolerar alimentos ou líquidos, prisão de ventre grave. Respeite sempre a titulação lenta. Pode exigir exames e a suspensão do medicamento. Não é um quadro para manejar com suplementos.',
    supplements: [],
  },
  injectionSite: {
    title: 'Dor no local da injeção',
    cause:
      'Distensão do tecido pelo líquido injetado e irritação local; a técnica e a temperatura fria do medicamento influenciam. As reações locais (vermelhidão, inchaço, coceira, pequenos nódulos) são comuns e costumam se resolver em 1-3 dias.',
    whatToDo:
      'Deixe o medicamento atingir a temperatura ambiente antes de injetar (não aqueça artificialmente); alterne os locais (abdômen, coxa, parte de trás do braço), a 2-3 cm do ponto anterior, sem repetir o mesmo local por 4 semanas; injete devagar a 90°; aplique compressa fria depois. Consulte se houver vermelhidão com calor, pus, febre ou dor forte; procure atendimento imediato diante de sinais de reação alérgica grave (dificuldade para respirar, inchaço que se espalha).',
    supplements: [],
  },
  hypoglycemia: {
    title: 'Tremores, suor, confusão, batimento acelerado (sinais de alarme)',
    cause:
      'A combinação de tremores, suor frio, confusão e taquicardia (também tontura, fome intensa, visão embaçada, dificuldade para falar, fraqueza) é o quadro clássico de HIPOGLICEMIA (açúcar no sangue baixo). A semaglutida/tirzepatida sozinhas raramente causam, mas o risco aumenta muito com insulina ou sulfonilureias, ou ao pular refeições, fazer exercício intenso sem comer, beber álcool ou não comer por náuseas.',
    whatToDo:
      'ISTO PODE SER UMA EMERGÊNCIA. Se os sintomas forem leves-moderados e for possível, meça a glicose e use a regra 15/15: tome 15 g de carboidrato rápido (suco, tabletes de glicose, bala), espere 15 minutos e repita se ainda estiver baixa. Se houver confusão intensa, perda de consciência, convulsões ou não melhorar: LIGUE PARA A EMERGÊNCIA imediatamente (pode ser necessário glucagon). Não se maneja com suplementos.',
    supplements: [],
  },

  // ── Seção 5 — Psicológicos ──────────────────────────────────────────────
  moodSwings: {
    title: 'Mudanças de humor / irritabilidade',
    cause:
      'As mudanças rápidas nos padrões alimentares, na glicemia e o ajuste emocional de mudar sua relação com a comida podem afetar o humor.',
    whatToDo:
      'Mantenha um registro diário simples de como você se sente — padrões são mais fáceis de ver escritos do que lembrados. Comer com regularidade (mesmo porções menores) ajuda a estabilizar a glicemia e o humor. Conversar com alguém de confiança, ou com um terapeuta, sobre o lado emocional desse processo pode ajudar.',
    supplements: [],
  },
  anxiety: {
    title: 'Ansiedade',
    cause:
      'Pode vir do ajuste físico ao medicamento, da preocupação com efeitos colaterais, ou do peso emocional de uma grande mudança de estilo de vida.',
    whatToDo:
      'Técnicas de aterramento (respiração lenta, caminhadas curtas) podem ajudar no momento. Manter uma rotina consistente reduz a incerteza. Se a ansiedade for persistente ou afetar o dia a dia, vale conversar com seu médico ou um profissional de saúde mental — isso é comum e tratável.',
    supplements: [],
  },
  lowMotivation: {
    title: 'Baixa motivação / apatia',
    cause:
      'A menor ingestão de energia, a fadiga e o esforço mental de manter uma nova rotina podem reduzir a motivação para tarefas que antes pareciam fáceis.',
    whatToDo:
      'Divida as tarefas em passos menores. Pequenas vitórias constantes (uma caminhada curta, uma refeição saudável) reconstroem o impulso melhor do que tentar fazer tudo de uma vez. Se isso parecer mais do que baixa energia — como perder interesse em coisas que você gostava — fale com seu médico.',
    supplements: [],
  },
  insomnia: {
    title: 'Insônia / dificuldade para dormir',
    cause:
      'Mudanças no horário das refeições, flutuações de glicemia ou ansiedade sobre o processo de tratamento podem atrapalhar o sono.',
    whatToDo:
      'Mantenha um horário consistente para deitar e acordar. Evite refeições grandes ou telas logo antes de dormir. Se o sono ruim continuar por mais de duas semanas ou você se sentir exausto no dia seguinte de forma constante, comente com seu médico.',
    supplements: [],
  },
  foodRelationship: {
    title: 'Mudança na relação com a comida',
    cause:
      'Perder o desejo de comer por conforto, ou notar mudanças no controle de impulsos com comida, álcool ou compras, é um efeito reconhecido que algumas pessoas sentem conforme os sinais de apetite mudam.',
    whatToDo:
      'Isso pode parecer desorientador mesmo quando a perda de peso em si é bem-vinda. Dê a si mesmo tempo para se ajustar a uma nova relação com a comida em vez de esperar que se sinta "normal" imediatamente. Se você notar mudanças significativas de humor, uso de álcool ou hábitos de gastos, vale conversar com seu médico.',
    supplements: [],
  },
} as const;
