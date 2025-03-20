/**
 * Mock dataset representing a collection of in-game items, it contains 4 items.
 *
 * Each item contains:
 * - `definition`: Detailed item attributes such as ID, level, parameters, effects, and properties.
 * - `title`: Item name in multiple languages (`fr`, `en`, `es`, `pt`).
 * - `description`: Item description in multiple languages.
 */
export const mockItemsData = [
  {
    definition: {
      item: {
        id: 2021,
        level: 6,
        baseParameters: {
          itemTypeId: 120,
          itemSetId: 41,
          rarity: 1,
          bindType: 0,
          minimumShardSlotNumber: 1,
          maximumShardSlotNumber: 4,
        },
        useParameters: {
          useCostAp: 0,
          useCostMp: 0,
          useCostWp: 0,
          useRangeMin: 0,
          useRangeMax: 0,
          useTestFreeCell: false,
          useTestLos: false,
          useTestOnlyLine: false,
          useTestNoBorderCell: false,
          useWorldTarget: 0,
        },
        graphicParameters: {
          gfxId: 1202021,
          femaleGfxId: 1202021,
        },
        properties: [],
      },
      useEffects: [],
      useCriticalEffects: [],
      equipEffects: [
        {
          effect: {
            definition: {
              id: 184047,
              actionId: 20,
              areaShape: 32767,
              areaSize: [],
              params: [6.0, 0.0, 1.0, 0.0, 0.0, 0.0],
            },
          },
        },
        {
          effect: {
            definition: {
              id: 184048,
              actionId: 150,
              areaShape: 32767,
              areaSize: [],
              params: [2.0, 0.0],
            },
          },
        },
        {
          effect: {
            definition: {
              id: 184049,
              actionId: 120,
              areaShape: 32767,
              areaSize: [],
              params: [9.0, 0.0],
            },
          },
        },
        {
          effect: {
            definition: {
              id: 360361,
              actionId: 31,
              areaShape: 32767,
              areaSize: [],
              params: [1.0, 0.0, 1.0, 0.0, 0.0, 0.0],
            },
          },
        },
      ],
    },
    title: {
      fr: 'Amulette du Bouftou',
      en: 'Gobball Amulet',
      es: 'Amuleto de jalató',
      pt: 'Amuleto de Papatudo',
    },
    description: {
      fr: "Attention mesdemoiselles, il paraît qu'elle bouffe tout...",
      en: 'Watch out ladies, it seems this thing chews everything...',
      es: 'Cuidado señoritas, al parecer se lo jala todo...',
      pt: 'Cuidado, meninas, parece que essa coisa mastiga tudo...',
    },
  },
  {
    definition: {
      item: {
        id: 2022,
        level: 8,
        baseParameters: {
          itemTypeId: 103,
          itemSetId: 41,
          rarity: 1,
          bindType: 0,
          minimumShardSlotNumber: 1,
          maximumShardSlotNumber: 4,
        },
        useParameters: {
          useCostAp: 0,
          useCostMp: 0,
          useCostWp: 0,
          useRangeMin: 0,
          useRangeMax: 0,
          useTestFreeCell: false,
          useTestLos: false,
          useTestOnlyLine: false,
          useTestNoBorderCell: false,
          useWorldTarget: 0,
        },
        graphicParameters: {
          gfxId: 1032022,
          femaleGfxId: 1032022,
        },
        properties: [],
      },
      useEffects: [],
      useCriticalEffects: [],
      equipEffects: [
        {
          effect: {
            definition: {
              id: 184050,
              actionId: 20,
              areaShape: 32767,
              areaSize: [],
              params: [5.0, 0.0, 1.0, 0.0, 0.0, 0.0],
            },
          },
        },
        {
          effect: {
            definition: {
              id: 184051,
              actionId: 120,
              areaShape: 32767,
              areaSize: [],
              params: [5.0, 0.0],
            },
          },
        },
      ],
    },
    title: {
      fr: 'Anneau de Bouze le Clerc',
      en: "Bouze Lite Yeah's Ring",
      es: 'Anillo de Boz Layt Yer',
      pt: 'Anel de Baz Laitir',
    },
    description: {
      fr: "Bouze parlait souvent d'un fin Eni et d'au-delà...",
      en: 'This ring once belonged to the renowned Bouze Lite Yeah...',
      es: 'Boz hablaba a menudo de un tal Ninfi Tito...',
      pt: 'Esse anel pertencia ao renomado Baz Laitir...',
    },
  },
  {
    definition: {
      item: {
        id: 2024,
        level: 9,
        baseParameters: {
          itemTypeId: 132,
          itemSetId: 41,
          rarity: 2,
          bindType: 0,
          minimumShardSlotNumber: 1,
          maximumShardSlotNumber: 4,
        },
        useParameters: {
          useCostAp: 0,
          useCostMp: 0,
          useCostWp: 0,
          useRangeMin: 0,
          useRangeMax: 0,
          useTestFreeCell: false,
          useTestLos: false,
          useTestOnlyLine: false,
          useTestNoBorderCell: false,
          useWorldTarget: 0,
        },
        graphicParameters: {
          gfxId: 1322024,
          femaleGfxId: 1322024,
        },
        properties: [],
      },
      useEffects: [],
      useCriticalEffects: [],
      equipEffects: [
        {
          effect: {
            definition: {
              id: 184066,
              actionId: 20,
              areaShape: 32767,
              areaSize: [],
              params: [11.0, 0.0, 1.0, 0.0, 0.0, 0.0],
            },
          },
        },
        {
          effect: {
            definition: {
              id: 184067,
              actionId: 150,
              areaShape: 32767,
              areaSize: [],
              params: [2.0, 0.0],
            },
          },
        },
        {
          effect: {
            definition: {
              id: 184068,
              actionId: 120,
              areaShape: 32767,
              areaSize: [],
              params: [12.0, 0.0],
            },
          },
        },
        {
          effect: {
            definition: {
              id: 360612,
              actionId: 31,
              areaShape: 32767,
              areaSize: [],
              params: [1.0, 0.0, 1.0, 0.0, 0.0, 0.0],
            },
          },
        },
      ],
    },
    title: {
      fr: 'Cape Bouffante',
      en: 'Gobball Cape',
      es: 'Capa Jalosa',
      pt: 'Capa de Papatudo',
    },
    description: {
      fr: "Cette cape a été fabriquée à partir des restes d'un repas de Bouftou. Parce que oui, il arrive qu'il y ait des restes.",
      en: "This cloak was made from the remains of a Gobball's dinner. Yes, you read right. Sometimes even Gobballs don't clear their plates.",
      es: 'Esta capa se fabricó con los restos de una comida de jalató. Pues sí, a veces quedan restos.',
      pt: 'Esta capa é feita dos restos de jantar de um Papatudo. Sim, você leu direito. Às vezes, até um Papatudo deixa comida no prato.',
    },
  },
  {
    definition: {
      item: {
        id: 2035,
        level: 7,
        baseParameters: {
          itemTypeId: 120,
          itemSetId: 44,
          rarity: 1,
          bindType: 0,
          minimumShardSlotNumber: 1,
          maximumShardSlotNumber: 4,
        },
        useParameters: {
          useCostAp: 0,
          useCostMp: 0,
          useCostWp: 0,
          useRangeMin: 0,
          useRangeMax: 0,
          useTestFreeCell: false,
          useTestLos: false,
          useTestOnlyLine: false,
          useTestNoBorderCell: false,
          useWorldTarget: 0,
        },
        graphicParameters: {
          gfxId: 1202035,
          femaleGfxId: 1202035,
        },
        properties: [],
      },
      useEffects: [],
      useCriticalEffects: [],
      equipEffects: [
        {
          effect: {
            definition: {
              id: 184378,
              actionId: 20,
              areaShape: 32767,
              areaSize: [],
              params: [6.0, 0.0, 1.0, 0.0, 0.0, 0.0],
            },
          },
        },
        {
          effect: {
            definition: {
              id: 184379,
              actionId: 150,
              areaShape: 32767,
              areaSize: [],
              params: [4.0, 0.0],
            },
          },
        },
        {
          effect: {
            definition: {
              id: 184380,
              actionId: 120,
              areaShape: 32767,
              areaSize: [],
              params: [6.0, 0.0],
            },
          },
        },
        {
          effect: {
            definition: {
              id: 360544,
              actionId: 31,
              areaShape: 32767,
              areaSize: [],
              params: [1.0, 0.0, 1.0, 0.0, 0.0, 0.0],
            },
          },
        },
      ],
    },
    title: {
      fr: 'Amulette du Tofu',
      en: 'Tofu Amulet',
      es: 'Amuleto de tofu',
      pt: 'Amuleto de Tofu',
    },
    description: {
      fr: 'Glissez cette amulette entre vos reins pour sentir son vrai pouvoir.',
      en: 'If you manage to get this amulet around your waist you will unleash its true powers.',
      es: 'Desliza este amuleto por los riñones para sentir su verdadero poder.',
      pt: 'Se conseguir colocar esse amuleto ao redor da cintura, libertará os verdadeiros poderes dele.',
    },
  },
];
