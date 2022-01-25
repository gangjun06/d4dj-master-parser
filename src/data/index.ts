import * as types from '../types'
import { parseMasterItem } from '../utils'

export const ParseGroup: types.ParseGroupType = {
  Character: ['Unit', 'Character', 'Attribute', 'Skill', 'Card'],
  Passive: ['PassiveSkill', 'PassiveSkillDescription', 'PassiveSkillExp'],
  Music: ['ChartAchieve', 'ChartDesigner', 'Music', 'Chart'],
  Event: [],
  Items: ['StockViewCategory', 'Stock', 'Reward'],
  ClubItem: ['ClubItemDetail', 'ClubItemSpot', 'ClubItem'],
  Mission: ['MissionGroup', 'MissionPanel', 'MissionDetail'],
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
  AssistOptionPreset: {
    name: 'assist-option-presets',
  },
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
  ClubItem: {
    fields: {
      detailId: {
        relation: {
          target: 'club-item-details',
        },
      },
      spotPrimaryKey: {
        name: 'spot',
        relation: {
          target: 'club-item-spots',
        },
      },
    },
    name: 'club-items',
  },
  ClubItemDetail: {
    fields: {
      requiredStockId1: {
        name: 'requiredStock1',
        relation: {
          target: 'stocks',
        },
      },
      requiredStockId2: {
        name: 'requiredStock2',
        relation: {
          target: 'stocks',
        },
      },
      requiredStockId3: {
        name: 'requiredStock3',
        relation: {
          target: 'stocks',
        },
      },
      requiredStockId4: {
        name: 'requiredStock4',
        relation: {
          target: 'stocks',
        },
      },
      requiredStockId5: {
        name: 'requiredStock5',
        relation: {
          target: 'stocks',
        },
      },
    },
    name: 'club-item-details',
  },
  ClubItemSpot: {
    fields: {
      catgory: 'category',
    },
    name: 'club-item-spots',
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
  EventAggregationBase: {
    fields: {
      eventPrimaryKey: {
        name: 'event',
        relation: {
          target: 'events',
        },
      },
    },
    name: 'event-aggregation-bases',
  },
  EventMedleySetlist: {
    fields: {
      aggregationPrimaryKey: {
        name: 'aggregation',
        relation: {
          target: 'event-aggregation-bases',
        },
      },
      characterMatchParameterBonusPrimaryKey: {
        name: 'characterMatchParameterBonus',
        relation: {
          target: 'parameter-bonuses',
        },
      },
      musicIds: {
        name: 'musics',
        relation: {
          target: 'music-games',
        },
      },
      specificBonusCharacterIds: {
        relation: {
          target: 'characters',
        },
      },
    },
    name: 'event-medley-setlists',
  },
  EventPointReward: {
    fields: {
      aggregationPrimaryKey: {
        name: 'aggregation',
        relation: {
          target: 'event-aggregation-bases',
        },
      },
    },
    name: 'event-point-rewards',
  },
  EventRankingReward: {
    fields: {
      aggregationPrimaryKey: {
        name: 'aggregation',
        relation: {
          target: 'event-aggregation-bases',
        },
      },
    },
    name: 'event-ranking-rewards',
  },
  EventSpecificBonus: {
    fields: {
      allMatchParameterBonusPrimaryKey: {
        name: 'allMatchParameterBonus',
        relation: {
          target: 'parameter-bonuses',
        },
      },
      attributeId: {
        name: 'attribute',
        relation: {
          target: 'attributes',
        },
      },
      attributeMatchParameterBonusPrimaryKey: {
        name: 'attributeMatchParameterBonus',
        relation: {
          target: 'parameter-bonuses',
        },
      },
      characterIds: {
        name: 'characters',
        relation: {
          target: 'characters',
        },
      },
      characterMatchParameterBonusPrimaryKey: {
        name: 'characterMatchParameterBonus',
        relation: {
          target: 'parameter-bonuses',
        },
      },
      eventPrimaryKey: {
        name: 'event',
        relation: {
          target: 'events',
        },
      },
    },
    name: 'event-specific-bonuses',
  },
  Exchange: {
    fields: {
      gaugeColorCodes: {
        ignore: true,
      },
    },
    name: 'exchanges',
  },
  ExchangeItem: {
    fields: {
      exchangePrimaryKey: {
        name: 'exchange',
        relation: {
          target: 'exchanges',
        },
      },
      requiredStockId1: {
        name: 'requiredStock1',
        relation: {
          target: 'stocks',
        },
      },
      requiredStockId2: {
        name: 'requiredStock2',
        relation: {
          target: 'stocks',
        },
      },
      requiredStockId3: {
        name: 'requiredStock3',
        relation: {
          target: 'stocks',
        },
      },
      requiredStockId4: {
        name: 'requiredStock4',
        relation: {
          target: 'stocks',
        },
      },
    },
    name: 'exchange-items',
  },
  Gacha: {
    fields: {
      _unused: {
        ignore: true,
      },
      homeAnimationCardsPrimaryKey: {
        ignore: true,
      },
      pickUpCardsPrimaryKey: {
        name: 'pickUpCards',
        relation: {
          target: 'cards',
        },
      },
      pickUpDuplicateBonusStockAmounts: {
        ignore: true,
      },
      pickUpDuplicateBonusStockIds: {
        ignore: true,
      },
      selectBonusCardsPrimaryKey: {
        ignore: true,
      },
      selectBonusRewardsPrimaryKey: {
        ignore: true,
      },
      tableIds: {
        ignore: true,
      },
      tableRatesPrimaryKey: {
        ignore: true,
      },
    },
    name: 'gachas',
  },
  Honor: {
    fields: {
      duplicateStockAmounts: {
        asJSON: true,
      },
      duplicateStockIds: {
        asJSON: true,
      },
    },
    name: 'honors',
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
  LoginBonus: {
    customFields: {
      fields: [
        {
          name: 'loginBonusItems',
          parser: (originalData, loadedData, locale) =>
            loadedData['!LoginBonusItem']
              .filter(
                (item) => item['__LoginBonusPrimaryKey__'] === originalData.Id,
              )
              .map((item) =>
                parseMasterItem(
                  item,
                  {
                    loginBonusPrimaryKey: {
                      ignore: true,
                    },
                    positions: {
                      asJSON: true,
                    },
                    rewardsPrimaryKey: {
                      name: 'rewards',
                      relation: {
                        target: 'rewards',
                      },
                    },
                  },
                  loadedData,
                  locale,
                ),
              ),
        },
      ],
      load: ['rewards', '!LoginBonusItem'],
    },
    fields: {
      datePositions: {
        asJSON: true,
      },
    },
    name: 'login-bonuses',
  },
  MissionDetail: {
    fields: {
      rewardsPrimaryKey: {
        name: 'rewards',
        relation: {
          target: 'rewards',
        },
      },
    },
    name: 'mission-details',
  },
  MissionGroup: {
    name: 'mission-groups',
  },
  MissionPanel: {
    fields: {
      allCompleteRewardsPrimaryKey: {
        name: 'allCompleteRewards',
        relation: {
          target: 'rewards',
        },
      },
      groupPrimaryKey: {
        name: 'group',
        relation: {
          target: 'mission-groups',
        },
      },
    },
    name: 'mission-panels',
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
  OptionPreset: {
    name: 'option-presets',
  },
  ParameterBonus: {
    name: 'parameter-bonuses',
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
  QuestBlock: {
    fields: {
      assistOptionPrimaryKey: {
        name: 'assistOption',
        relation: {
          target: 'assist-option-presets',
        },
      },
      chartPrimaryKey: {
        name: 'chart',
        relation: {
          target: 'charts',
        },
      },
      firstRewardsPrimaryKey: {
        name: 'firstRewards',
        relation: {
          target: 'rewards',
        },
      },
      loopRewardsPrimaryKey: {
        name: 'loopRewards',
        relation: {
          target: 'rewards',
        },
      },
      mapPrimaryKey: {
        name: 'map',
        relation: {
          target: 'quest-maps',
        },
      },
      optionPrimaryKey: {
        name: 'option',
        relation: {
          target: 'option-presets',
        },
      },
    },
    name: 'quest-blocks',
  },
  QuestClubDeck: {
    fields: {
      itemPrimaryKey: {
        name: 'item',
        relation: {
          target: 'club-items',
        },
      },
      spotPrimaryKey: {
        name: 'spot',
        relation: {
          target: 'club-item-spots',
        },
      },
    },
    name: 'quest-club-decks',
  },
  QuestDeck: {
    fields: {
      cardPrimaryKey: {
        name: 'card',
        relation: {
          target: 'cards',
        },
      },
    },
    name: 'quest-decks',
  },
  QuestMap: {
    name: 'quest-maps',
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
  Reward: {
    name: 'rewards',
  },
  Skill: {
    name: 'skills',
  },
  Stamp: {
    name: 'stamps',
  },
  Stock: {
    customFields: {
      fields: [
        {
          name: 'random',
          parser: (originalData, loadedData, locale) =>
            loadedData['!RandomStock']
              .filter((item) => item['OriginalStockId'] === originalData.Id)
              .map((item) => ({
                stockId: item.StockId,
                amount: item.Amount,
                rate: item.Rate,
              })),
        },
      ],
      load: ['!RandomStock'],
    },
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
