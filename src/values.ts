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
  customFields?: {
    load: string[]
    fields: {
      name: string
      parser: (originalData: any, loadedData: { [key: string]: any[] }) => any
    }[]
  }
}

export const ParseGroup: { [key: string]: string[] } = {
  Character: ['Unit', 'Character', 'Attribute', 'Skill', 'Card'],
  Passive: ['PassiveSkill', 'PassiveSkillDescription', 'PassiveSkillExp'],
  Music: ['ChartAchieve', 'ChartDesigner', 'Music', 'Chart'],
  Event: [],
  Items: ['StockViewCategory', 'Stock', 'Reward'],
  Etc: [],
}

export const LocaleTable: { [key: string]: string } = {
  en: 'en',
  jp: 'ja-JP',
}

export const ParserData: { [key: string]: ParserDataType } = {
  Attribute: {
    name: 'attributes',
  },
  Card: {
    fields: {
      attributePrimaryKey: {
        name: 'attribute',
        relation: {
          target: 'attributes',
        },
      },
      CardIllustCenterDistanceX: {
        asJSON: true,
      },
      cardIllustHeadDistanceX: {
        asJSON: true,
      },
      characterPrimaryKey: {
        name: 'character',
        relation: {
          target: 'characters',
        },
      },
      maxParameters: {
        changeFieldByIndex: ['heart', 'technique', 'physical'],
      },
      passiveSkillPrimaryKey: {
        name: 'passiveSkill',
        relation: {
          target: 'passive-skills',
        },
      },
      rarityPrimaryKey: 'rarity',
      skillParameterPrimaryKey: {
        name: 'skill',
        relation: {
          target: 'skills',
        },
      },
    },
    name: 'cards',
  },
  Character: {
    fields: {
      profileAnswers: {
        ignore: true,
      },
      unitPrimaryKey: {
        name: 'unit',
        relation: {
          target: 'units',
        },
      },
    },
    name: 'characters',
  },
  Chart: {
    customFields: {
      fields: [
        {
          name: 'chartNoteCount',
          parser: (originalData, loadedData) => {
            const id = originalData.masterID
            const result: any[] = []
            loadedData['!ChartNoteCount'].forEach((item) => {
              if (item.ChartId === id) {
                result.push({
                  section: item.Section,
                  count: item.Count,
                })
              }
            })
            return result
          },
        },
      ],
      load: ['!ChartNoteCount'],
    },
    fields: {
      designerPrimaryKey: {
        name: 'designer',
        relation: {
          target: 'chart-designers',
        },
      },
      musicPrimaryKey: {
        name: 'music',
        relation: {
          target: 'music-games',
        },
      },
      trends: {
        changeFieldByIndex: [
          'notes',
          'danger',
          'scratch',
          'effect',
          'technique',
        ],
      },
    },
    name: 'charts',
  },
  ChartAchieve: {
    fields: {
      rewardStockPrimaryKey: {
        name: 'rewardStock',
        relation: {
          target: 'stocks',
        },
      },
    },
    name: 'chart-achieves',
  },
  ChartDesigner: {
    name: 'chart-designers',
  },
  Music: {
    fields: {
      _unused: 'unused',
      purchaseBonusesPrimaryKey: {
        asJSON: true,
        name: 'purchaseBonuses',
      },
      unitPrimaryKey: {
        name: 'unit',
        relation: {
          target: 'units',
        },
      },
    },
    name: 'music-games',
  },
  PassiveSkill: {
    name: 'passive-skills',
  },
  PassiveSkillDescription: {
    name: 'passive-skill-descriptions',
  },
  PassiveSkillExp: {
    fields: {
      rarityId: 'rarity',
    },
    name: 'passive-skill-exps',
  },
  Rarity: {
    fields: {
      limitBreakBonuses: {
        asJSON: true,
      },
      maxLevelParameterRates: {
        asJSON: true,
      },
      maxLevels: {
        asJSON: true,
      },
    },
  },
  Skill: {
    name: 'skills',
  },
  Stock: {
    fields: {
      viewCategoryPrimaryKey: {
        name: 'viewCategory',
        relation: {
          target: 'stock-view-categories',
        },
      },
    },
    name: 'stocks',
  },
  StockViewCategory: {
    name: 'stock-view-categories',
  },
  Unit: {
    fields: {
      initDeckCharacterIds: {
        ignore: true,
      },
    },
    name: 'units',
  },
}
