import * as types from '../types'
import { parseMasterItem } from '../utils'

export const ParseGroup: types.ParseGroupType = {
  Character: ['Unit', 'Character', 'Attribute', 'Skill', 'Card'],
  Passive: ['PassiveSkill', 'PassiveSkillDescription', 'PassiveSkillExp'],
  Music: ['ChartAchieve', 'ChartDesigner', 'Music', 'Chart'],
  Event: [],
  Items: ['StockViewCategory', 'Stock', 'Reward'],
  Etc: [],
}

export const LocaleTable: types.LocaleTableType = {
  en: 'en',
  jp: 'ja-JP',
}

const conditionCustomParser: types.ParserDataCustomFieldsContent = {
  name: 'condition',
  parser: (originalData, loadedData) =>
    loadedData['!Condition']
      .filter(
        (item) =>
          originalData['__ConditionsPrimaryKey__'].indexOf(item.Id) > -1,
      )
      .map((item) => ({
        masterID: item.Id,
        category: item.Category,
        value: JSON.stringify(item.Value),
      })),
}

export const ParserData: types.ParserDatasType = {
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
    customFields: {
      fields: [
        {
          name: 'episode',
          parser: (originalData, loadedData, locale) =>
            loadedData['!CharacterEpisode']
              .filter((item) => item['CharacterId'] === originalData.Id)
              .map((item) => ({
                backgroundId: item.BackgroundId,
                chapterNumber: item.ChapterNumber,
                episode: loadedData['episodes'][item.Id][locale].id,
              })),
        },
      ],
      load: ['episodes', '!CharacterEpisode'],
    },
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
          parser: (originalData, loadedData) =>
            loadedData['!ChartNoteCount']
              .filter((item) => item.ChartId === originalData.Id)
              .map((item) => ({
                section: item.Section,
                count: item.Count,
              })),
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
  Episode: {
    customFields: {
      fields: [conditionCustomParser],
      load: ['!Condition'],
    },
    fields: {
      conditionsPrimaryKey: {
        ignore: true,
      },
      rewardsPrimaryKey: {
        asJSON: true,
        name: 'rewards',
      },
    },
    name: 'episodes',
  },
  Event: {
    customFields: {
      fields: [
        {
          name: 'episode',
          parser: (originalData, loadedData, locale) =>
            loadedData['!EventEpisode']
              .filter((item) => item['__EventPrimaryKey__'] === originalData.Id)
              .map((item) => ({
                backgroundId: item.BackgroundId,
                chapterNumber: item.ChapterNumber,
                episode: loadedData['episodes'][item.Id][locale].id,
              })),
        },
      ],
      load: ['episodes', '!EventEpisode'],
    },
    fields: {
      episodeCharacters: {
        relation: {
          target: 'characters',
        },
      },
      type: {
        changeValueByName: {
          '': 'Etc',
          keyDown: 'Raid',
          keyUp: 'Slot',
          mouseDrag: 'Poker',
          mouseMove: 'Medley',
          mouseUp: 'Bingo',
        },
      },
    },
    name: 'events',
  },
  Live2DUIChat: {
    fields: {
      categories: {
        asJSON: true,
      },
      characterPrimaryKey: {
        name: 'character',
        relation: {
          target: 'characters',
        },
      },
    },
    name: 'live2d-ui-chats',
  },
  LiveResultEpisode: {
    customFields: {
      fields: [
        {
          name: 'episode',
          parser: (originalData, loadedData, locale) =>
            loadedData['episodes'][originalData.Id][locale].id,
        },
      ],
      load: ['episodes'],
    },
    fields: {
      charactersPrimaryKey: {
        name: 'characters',
        relation: {
          target: 'characters',
        },
      },
    },
    name: 'live-result-episodes',
  },
  Music: {
    customFields: {
      fields: [
        {
          name: 'musicMix',
          parser: (originalData, loadedData) =>
            loadedData['!MusicMix']
              .filter((item) => item['__MusicPrimaryKey__'] === originalData.Id)
              .map((item) =>
                parseMasterItem(
                  item,
                  {
                    musicPrimaryKey: {
                      ignore: true,
                    },
                  },
                  {},
                  '',
                ),
              ),
        },
      ],
      load: ['!MusicMix'],
    },
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
    customFields: {
      fields: [
        {
          name: 'episode',
          parser: (originalData, loadedData, locale) =>
            loadedData['!UnitEpisode']
              .filter((item) => item['__UnitPrimaryKey__'] === originalData.Id)
              .map((item) => ({
                backgroundId: item.BackgroundId,
                chapterNumber: item.ChapterNumber,
                season: item.Season,
                episode: loadedData['episodes'][item.Id][locale].id,
              })),
        },
      ],
      load: ['episodes', '!UnitEpisode'],
    },
    fields: {
      initDeckCharacterIds: {
        ignore: true,
      },
    },
    name: 'units',
  },
}
