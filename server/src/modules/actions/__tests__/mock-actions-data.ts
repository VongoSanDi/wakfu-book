/**
 * Mock dataset representing a collection of in-game actions, it contains 5 actions.
 *
 * Each item contains:
 * - `definition`: Detailed actions attributes such as ID and effects.
 * - `description`: Action description in multiple languages.
 */
export const mockActionsData = [
  {
    definition: { id: 1, effect: 'Dommage : Neutre' },
    description: {
      fr: 'Dommage [el0] : [#1]{[+3]?% des PV:}{[+3]?{[1\u003d3]? max:{[2\u003d3]? courants:{[3\u003d3]? manquants:{[4\u003d3]? max:{[5\u003d3]? courants:{[6\u003d3]? manquants:}}}}}}:}{[+3]?{[4\u003c3]? du lanceur:{[7\u003c3]? de la cible:}}:}{[-2]?{[0\u003d2]? [ecnbi] [ecnbr]:}:}{[+2]?{[2\u003d2]? [ecnbi]:}:}{[+2]?{[1\u003d2]? [ecnbr]:}:}',
      en: '[el0] Damage: [#1]{[+3]?% of HP:}{[+3]?{[1\u003d3]? max:{[2\u003d3]? current:{[3\u003d3]? lost:{[4\u003d3]? max:{[5\u003d3]? current:{[6\u003d3]? lost:}}}}}}:}{[+3]?{[4\u003c3]? of caster:{[7\u003c3]? of target:}}:}{[-2]?{[0\u003d2]? [ecnbi] [ecnbr]:}:}{[+2]?{[2\u003d2]? [ecnbi]:}:}{[+2]?{[1\u003d2]? [ecnbr]:}:}',
      es: 'Daño [el0]: [#1]{[+3]?% de los PdV:}{[+3]?{[1\u003d3]? máx:{[2\u003d3]? corrientes:{[3\u003d3]? faltantes:{[4\u003d3]? máx:{[5\u003d3]? corrientes:{[6\u003d3]? faltantes:}}}}}}:}{[+3]?{[4\u003c3]? del lanzador:{[7\u003c3]? del objetivo:}}:}{[-2]?{[0\u003d2]? [ecnbi] [ecnbr]:}:}{[+2]?{[2\u003d2]? [ecnbi]:}:}{[+2]?{[1\u003d2]? [ecnbr]:}:}',
      pt: 'Dano de [el0]: [#1]{[+3]?% dos PV:}{[+3]?{[1\u003d3]? máx.:{[2\u003d3]? atuais:{[3\u003d3]? perdidos:{[4\u003d3]? máx.:{[5\u003d3]? atuais:{[6\u003d3]? perdidos:}}}}}}:}{[+3]?{[4\u003c3]? do lançador:{[7\u003c3]? do alvo:}}:}{[-2]?{[0\u003d2]? [ecnbi] [ecnbr]:}:}{[+2]?{[2\u003d2]? [ecnbi]:}:}{[+2]?{[1\u003d2]? [ecnbr]:}:}',
    },
  },
  {
    definition: { id: 20, effect: 'Boost : Point de vie (PV)' },
    description: {
      fr: '[#charac HP] [#1] PV',
      en: '[#charac HP] [#1] HP',
      es: '[#charac HP] [#1] PdV',
      pt: '[#charac HP] [#1] PV',
    },
  },
  {
    definition: { id: 21, effect: 'Deboost : Point de vie (PV)' },
    description: {
      fr: '[#charac HP] -[#1] Point{[\u003e1]?s:} de Vie',
      en: '[#charac HP] -[#1] Health Point{[\u003e1]?s:}',
      es: '[#charac HP] -[#1] punto{[\u003d1]?:s} de vida',
      pt: '[#charac HP] -[#1] Ponto{[\u003e1]?s:} de Vida',
    },
  },
  {
    definition: { id: 24, effect: 'Soin : Neutre (Vol de vie)' },
    description: {
      fr: 'Soin [el0] (Vol de vie) : [#1]{[-2]?{[0\u003d2]? [ecnbi]:}:}',
      en: '[el0]  Heal (Health Steal): [#1]{[-2]?{[0\u003d2]? [ecnbi]:}:}',
      es: 'Cura [el0] (robo de vida): [#1]{[-2]?{[0\u003d2]? [ecnbi]:}:}',
      pt: 'Cura [el0]  (Roubo de Vida): [#1]{[-2]?{[0\u003d2]? [ecnbi]:}:}',
    },
  },
  {
    definition: { id: 26, effect: 'Gain : Maîtrise Soin' },
    description: {
      fr: '[#charac HEAL_IN_PERCENT] [#1] Maîtrise Soin',
      en: '[#charac HEAL_IN_PERCENT] [#1] Healing Mastery',
      es: '[#charac HEAL_IN_PERCENT] [#1] Dominio cura',
      pt: '[#charac HEAL_IN_PERCENT] [#1] Domínio de cura',
    },
  },
];
