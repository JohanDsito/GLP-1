export const sideEffectsContentPt = {
  nausea: {
    title: 'Nausea',
    cause:
      'Os medicamentos GLP-1 fazem o estomago esvaziar mais devagar, o que pode causar sensacao de empanzinamento, mal-estar ou nausea, principalmente logo apos um aumento de dose.',
    whatToDo:
      'Coma porcoes menores e com mais frequencia em vez de refeicoes grandes. Evite alimentos gordurosos, fritos ou muito doces. Coma devagar e pare antes de se sentir muito cheio. Cha de gengibre ou balas de gengibre podem ajudar. Se a nausea for forte, persistente ou impedir voce de manter liquidos, contate seu medico.',
    supplements: ['Gengibre', 'Vitamina B6 (comumente discutida com o medico para nausea)'],
  },
  vomiting: {
    title: 'Vomito',
    cause:
      'O vomito geralmente e uma extensao da nausea causada pelo esvaziamento lento do estomago, e pode ser mais provavel apos um aumento de dose ou comer demais/muito rapido.',
    whatToDo:
      'Beba liquidos claros aos poucos para evitar desidratacao. Descanse e evite alimentos solidos ate melhorar, depois reintroduza alimentos leves aos poucos (biscoitos, arroz, torrada). Se o vomito for frequente, impedir voce de manter qualquer liquido, ou durar mais de um dia, contate seu medico rapidamente.',
    supplements: ['Solucoes de reidratacao com eletrolitos'],
  },
  constipation: {
    title: 'Prisao de ventre',
    cause:
      'A digestao mais lenta combinada com menor ingestao de alimentos pode reduzir a frequencia das evacuacoes.',
    whatToDo:
      'Aumente a ingestao de agua ao longo do dia. Adicione fibra aos poucos (vegetais, frutas, graos integrais), ja que adiciona-la rapido demais pode piorar o inchaco. Movimento leve regular (caminhada) pode ajudar. Se persistir por mais de alguns dias ou causar dor significativa, fale com seu medico.',
    supplements: ['Psyllium ou outro suplemento de fibra', 'Magnesio (comumente discutido com o medico)'],
  },
  diarrhea: {
    title: 'Diarreia',
    cause:
      'Mudancas na velocidade de digestao e motilidade intestinal causadas pelo medicamento podem, as vezes, favorecer fezes mais soltas em vez de prisao de ventre.',
    whatToDo:
      'Mantenha-se hidratado com agua e eletrolitos. Reduza temporariamente alimentos ricos em gordura e fibra ate estabilizar. Se a diarreia for severa, com sangue, ou durar mais de 2 dias, contate seu medico.',
    supplements: ['Solucoes de reidratacao com eletrolitos', 'Probioticos (comumente discutidos com o medico)'],
  },
  fatigue: {
    title: 'Fadiga extrema',
    cause:
      'Comer menos no geral (menor ingestao calorica) combinado com a adaptacao do corpo ao medicamento pode reduzir a energia disponivel, principalmente nas primeiras semanas.',
    whatToDo:
      'Priorize proteina em cada refeicao para manter uma energia mais estavel. Mantenha um horario de sono consistente. Movimento leve diario costuma ajudar mais do que descansar completamente. Se a fadiga for extrema ou repentina, comente com seu medico para descartar outras causas (como glicemia baixa ou anemia).',
    supplements: ['Vitamina B12', 'Ferro (somente se um exame de sangue mostrar niveis baixos)'],
  },
  hairLoss: {
    title: 'Queda de cabelo',
    cause:
      'A perda rapida de peso e a menor ingestao de calorias/proteina podem levar os foliculos capilares a uma fase de repouso (eflúvio telogeno), causando queda notavel alguns meses depois.',
    whatToDo:
      'Certifique-se de comer proteina suficiente diariamente — esta e a lacuna mais comum. Evite restricao calorica muito agressiva. A queda de cabelo por essa causa costuma ser temporaria e melhora quando a ingestao se estabiliza. Se a queda for severa ou nao melhorar, consulte um dermatologista.',
    supplements: ['Multivitaminico', 'Biotina', 'Revisao da ingestao de proteina com um profissional de nutricao'],
  },
  dehydration: {
    title: 'Desidratacao',
    cause:
      'A menor sensacao de sede, nausea, vomito ou diarreia podem reduzir a ingestao de liquidos ou aumentar sua perda.',
    whatToDo:
      'Programe lembretes para beber agua ao longo do dia em vez de esperar sentir sede. Inclua alimentos ricos em agua. Fique atento a sinais como urina escura, tontura ou boca seca, e contate seu medico se aparecerem.',
    supplements: ['Solucoes de reidratacao com eletrolitos'],
  },
  reflux: {
    title: 'Refluxo / azia',
    cause:
      'O esvaziamento mais lento do estomago pode aumentar a pressao e a chance do acido estomacal subir para o esofago.',
    whatToDo:
      'Coma porcoes menores, evite deitar logo apos comer, e reduza alimentos picantes, gordurosos ou acidos se eles causarem sintomas. Elevar a cabeceira da cama pode ajudar a noite. Se persistir ou piorar, fale com seu medico.',
    supplements: [],
  },
  muscleLoss: {
    title: 'Perda muscular / flacidez da pele',
    cause:
      'Uma parte significativa da perda rapida de peso pode vir de musculo em vez de gordura se a proteina e o treino de resistencia nao forem priorizados, o que tambem pode deixar a pele com aparencia mais flacida.',
    whatToDo:
      'Priorize proteina em cada refeicao e inclua treino de forca/resistencia (mesmo leve, em casa) em vez de apenas cardio. Este e um dos efeitos mais previniveis com a rotina certa — pergunte ao seu medico ou a um treinador sobre um plano adequado para sua situacao.',
    supplements: ['Suplementacao de proteina (whey ou vegetal, se a dieta sozinha nao for suficiente)'],
  },
  headache: {
    title: 'Dor de cabeca',
    cause:
      'Pode estar relacionada a desidratacao, baixa ingestao de alimentos/calorias, ou a adaptacao do corpo ao medicamento.',
    whatToDo:
      'Primeiro verifique sua hidratacao e se voce comeu o suficiente naquele dia. Descanse em um espaco tranquilo e escuro se necessario. Se as dores de cabeca forem frequentes, severas, ou novas para voce, comente com seu medico.',
    supplements: [],
  },
  moodSwings: {
    title: 'Mudancas de humor / irritabilidade',
    cause:
      'Mudancas rapidas nos padroes alimentares, na glicemia, e o ajuste emocional de mudar sua relacao com a comida podem afetar o humor.',
    whatToDo:
      'Mantenha um registro diario simples de como voce se sente — padroes sao mais faceis de ver escritos do que lembrados. Comer com regularidade (mesmo porcoes menores) ajuda a estabilizar a glicemia e o humor. Conversar com alguem de confianca, ou com um terapeuta, sobre o lado emocional desse processo pode ajudar.',
    supplements: [],
  },
  anxiety: {
    title: 'Ansiedade',
    cause:
      'Pode vir do ajuste fisico ao medicamento, da preocupacao com efeitos colaterais, ou do peso emocional de uma grande mudanca de estilo de vida.',
    whatToDo:
      'Tecnicas de aterramento (respiracao lenta, caminhadas curtas) podem ajudar no momento. Manter uma rotina consistente reduz a incerteza. Se a ansiedade for persistente ou afetar o dia a dia, vale a pena conversar com seu medico ou um profissional de saude mental — isso e comum e tratavel.',
    supplements: [],
  },
  lowMotivation: {
    title: 'Baixa motivacao / apatia',
    cause:
      'A menor ingestao de energia, a fadiga, e o esforco mental de manter uma nova rotina podem reduzir a motivacao para tarefas que antes pareciam faceis.',
    whatToDo:
      'Divida as tarefas em passos menores. Pequenas vitorias constantes (uma caminhada curta, uma refeicao saudavel) reconstroem o impulso melhor do que tentar fazer tudo de uma vez. Se isso parecer mais do que baixa energia — como perder interesse em coisas que voce costumava gostar — fale com seu medico.',
    supplements: [],
  },
  insomnia: {
    title: 'Insonia / dificuldade para dormir',
    cause:
      'Mudancas no horario das refeicoes, flutuacoes de glicemia, ou ansiedade sobre o processo de tratamento podem atrapalhar o sono.',
    whatToDo:
      'Mantenha um horario consistente para deitar e acordar. Evite refeicoes grandes ou telas logo antes de dormir. Se o sono ruim continuar por mais de duas semanas ou voce se sentir exausto no dia seguinte de forma constante, comente com seu medico.',
    supplements: [],
  },
  foodRelationship: {
    title: 'Mudanca na relacao com a comida',
    cause:
      'Perder o desejo de comer por conforto, ou notar mudancas no controle de impulsos com comida, alcool ou compras, e um efeito reconhecido que algumas pessoas sentem conforme os sinais de apetite mudam.',
    whatToDo:
      'Isso pode parecer desorientador mesmo quando a perda de peso em si e bem-vinda. De a si mesmo tempo para se ajustar a uma nova relacao com a comida em vez de esperar que se sinta "normal" imediatamente. Se voce notar mudancas significativas de humor, uso de alcool ou habitos de gastos, vale a pena conversar com seu medico.',
    supplements: [],
  },
} as const;
