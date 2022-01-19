export type ParseFields = {
  [key: string]:
    | string
    | {
        name?: string
        ignore?: boolean
        asJSON?: boolean
        changeFieldByIndex?: string[]
        relation?: {
          target: string
        }
      }
}

export type ParserDataType = {
  name?: string
  fields?: ParseFields
}

export const ParseGroup: { [key: string]: string[] } = {
  Character: ['Unit', 'Character', 'Card'],
  Music: [],
  Event: [],
  Items: [],
  Etc: [],
}

export const LocaleTable: { [key: string]: string } = {
  en: 'en',
  jp: 'ja-JP',
}

export const ParserData: { [key: string]: ParserDataType } = {
  Attribute: {},
  Card: {
    fields: {
      rarityPrimaryKey: 'rarity',
      maxParameters: {
        changeFieldByIndex: ['heart', 'technique', 'physical'],
      },
      cardIllustHeadDistanceX: { asJSON: true },
      CardIllustCenterDistanceX: { asJSON: true },
      attributePrimaryKey: {
        name: 'attribute',
        relation: {
          target: 'attribute',
        },
      },
      characterPrimaryKey: {
        name: 'character',
        relation: {
          target: 'character',
        },
      },
      skillParameterPrimaryKey: {
        name: 'skill',
        relation: {
          target: 'skill',
        },
      },
    },
  },
  Character: {
    name: 'characters',
    fields: {
      profileAnswers: { ignore: true },
      unitPrimaryKey: {
        name: 'unit',
        relation: {
          target: 'units',
        },
      },
    },
  },
  Music: {
    name: 'MusicGame',
  },
  Rarity: {
    fields: {
      maxLevels: { asJSON: true },
      maxLevelParameterRates: { asJSON: true },
      limitBreakBonuses: { asJSON: true },
    },
  },
  Skill: {},
  Unit: {
    name: 'units',
    fields: {
      initDeckCharacterIds: { ignore: true },
    },
  },
}
