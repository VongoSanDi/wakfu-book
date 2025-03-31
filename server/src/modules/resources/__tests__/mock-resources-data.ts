/**
 * Mock dataset representing a collection of in-game resources, it contains 8 items.
 *
 * Each resource contains:
 * - `definition`: Detailed item attributes such as ID, resourceType, icon.
 * - `title`: Resource name in multiple languages (`fr`, `en`, `es`, `pt`).
 */
export const mockResourcesData = [
  {
    definition: {
      id: 6,
      resourceType: 1,
      isBlocking: true,
      idealRainRangeMin: 0,
      idealRainRangeMax: 0,
      idealTemperatureRangeMin: 5,
      idealTemperatureRangeMax: 25,
      iconGfxId: 2011718,
      lastEvolutionStep: 1,
      usableByHeroes: false,
      idealRain: 2
    },
    title: {
      fr: "Pommier",
      en: "Api Tree",
      es: "Ñiamzamo",
      pt: "Árvore de Api"
    }
  },
  {
    definition: {
      id: 8,
      resourceType: 1,
      isBlocking: true,
      idealRainRangeMin: 34,
      idealRainRangeMax: 66,
      idealTemperatureRangeMin: -10,
      idealTemperatureRangeMax: 10,
      iconGfxId: 2751719,
      lastEvolutionStep: 1,
      usableByHeroes: false,
      idealRain: 2
    },
    title: {
      fr: "Bouleau",
      en: "Birch",
      es: "Abedul",
      pt: "Bétula"
    }
  },
  {
    definition: {
      id: 15,
      resourceType: 1,
      isBlocking: true,
      idealRainRangeMin: 0,
      idealRainRangeMax: 0,
      idealTemperatureRangeMin: 5,
      idealTemperatureRangeMax: 25,
      iconGfxId: 2751732,
      lastEvolutionStep: 1,
      usableByHeroes: false,
      idealRain: 1
    },
    title: {
      fr: "Noisetier",
      en: "Hazel Tree",
      es: "Avellano",
      pt: "Avelaneira"
    }
  },
  {
    definition: {
      id: 18,
      resourceType: 2,
      isBlocking: false,
      idealRainRangeMin: 0,
      idealRainRangeMax: 0,
      idealTemperatureRangeMin: 5,
      idealTemperatureRangeMax: 30,
      iconGfxId: 3101750,
      lastEvolutionStep: 1,
      usableByHeroes: false,
      idealRain: 1
    },
    title: {
      fr: "Orge",
      en: "Barley",
      es: "Cebada",
      pt: "Cevada"
    }
  },
  {
    definition: {
      id: 23,
      resourceType: 2,
      isBlocking: false,
      idealRainRangeMin: 0,
      idealRainRangeMax: 0,
      idealTemperatureRangeMin: 5,
      idealTemperatureRangeMax: 30,
      iconGfxId: 3101752,
      lastEvolutionStep: 1,
      usableByHeroes: false,
      idealRain: 1
    },
    title: {
      fr: "Blé",
      en: "Wheat",
      es: "Trigo",
      pt: "Trigo"
    }
  },
  {
    definition: {
      id: 37,
      resourceType: 7,
      isBlocking: false,
      idealRainRangeMin: 0,
      idealRainRangeMax: 100,
      idealTemperatureRangeMin: -25,
      idealTemperatureRangeMax: 35,
      iconGfxId: -1,
      lastEvolutionStep: 16,
      usableByHeroes: false,
      idealRain: 0
    },
    title: {
      fr: "Fer primitif",
      en: "Primitive Iron",
      es: "Hierro primitivo",
      pt: "Ferro Primitivo"
    }
  },
  {
    definition: {
      id: 60,
      resourceType: 10,
      isBlocking: false,
      idealRainRangeMin: 0,
      idealRainRangeMax: 0,
      idealTemperatureRangeMin: -5,
      idealTemperatureRangeMax: 15,
      iconGfxId: 2792504,
      lastEvolutionStep: 1,
      usableByHeroes: false,
      idealRain: 2
    },
    title: {
      fr: "Chardon couronné",
      en: "Crowned Thistle",
      es: "Cardo borriquero",
      pt: "Cardo Coroado"
    }
  },
  {
    definition: {
      id: 76,
      resourceType: 2,
      isBlocking: false,
      idealRainRangeMin: 67,
      idealRainRangeMax: 100,
      idealTemperatureRangeMin: -5,
      idealTemperatureRangeMax: 35,
      iconGfxId: 30911464,
      lastEvolutionStep: 1,
      usableByHeroes: false,
      idealRain: 3
    },
    title: {
      fr: "Plant de Salace",
      en: "Babbage Plant",
      es: "Planta de enchalada",
      pt: "Pepolho"
    }
  }
]
