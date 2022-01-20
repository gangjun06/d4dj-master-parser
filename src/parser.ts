import * as values from './data'
import {
  objToArr,
  requestMaster,
  getAll,
  dataArrToObj,
  parseMasterItem,
  create,
} from './utils'

/**
 * Parse d4dj asset's masterfile and make data
 * @param {string} region Region of master to parse
 * @param {string} name Parsing target master file's name
 * @param {boolean} parseGroup If true, Parsing into groups registered in data/index.ts
 */
export const parse = async (
  region: string,
  name: string,
  parseGroup: boolean,
): Promise<any> => {
  const parseList = parseGroup ? values.ParseGroup[name] || [] : [name]
  if (!parseList.length) throw new Error('name is wrong')

  const downloadedData: { [key: string]: any } = {}

  const locale = values.LocaleTable[region]

  let log: string[][] = []

  // Parsing datas from parseList
  for (const item of parseList) {
    // Load parsing info
    const meta = values.ParserData[item]

    // Get parse target master file and convert to object
    const res = await requestMaster(region, item)
    const parsed = objToArr(res.data)

    // Load exists data from Backend to avoid duplicate create
    const name = meta.name || item
    let allData = downloadedData[name]
    if (!allData) {
      const allDataArr = await getAll({ name })
      allData = dataArrToObj(allDataArr)
      downloadedData[name] = allData
    }

    // Load relation data to relation with id
    for (let item in meta.fields || {}) {
      const field = meta.fields![item]
      if (
        typeof field !== 'string' &&
        field.relation &&
        !downloadedData[field.relation.target]
      ) {
        const allDataArr = await getAll({
          name: field.relation.target,
        })
        downloadedData[field.relation.target] = dataArrToObj(allDataArr)
      }
    }

    // Load data needed by customFields
    if (meta.customFields) {
      for (let name of meta.customFields.load) {
        if (!downloadedData[name]) {
          const allData = name.startsWith('!')
            ? await requestMaster(region, name.replace(/^!/, ''))
            : await getAll({ name })
          downloadedData[name] = name.startsWith('!')
            ? objToArr(allData.data)
            : dataArrToObj(allData)
        }
      }
    }

    for (const data of parsed) {
      const doParse = () => {
        const parsed = parseMasterItem(
          data,
          meta.fields || {},
          downloadedData,
          locale,
        )
        if (meta.customFields) {
          for (let customField of meta.customFields.fields) {
            parsed[customField.name] = customField.parser(
              parsed,
              downloadedData,
            )
          }
        }
        return parsed
      }

      // If same data already exists on DB
      const select = allData[data.Id]
      if (select) {
        if (!select[locale]) {
          // But doesn't have this regions data
          const parsed = doParse()
          await create({
            locale,
            data: parsed,
            name: meta.name || item,
            update: select[Object.keys(select)[0]].id,
          })
          log.push([`${item}-${region}`, 'Add Locale', parsed.masterID])
        }
        continue
      }

      // Create new data in DB
      const parsed = doParse()
      await create({
        locale,
        data: parsed,
        name: meta.name || item,
      })
      log.push([`${item}-${region}`, 'Create', parsed.masterID])
    }
  }
  return {
    result: log,
  }
}
