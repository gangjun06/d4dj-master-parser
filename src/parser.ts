import * as values from './values'
import * as request from './request'
import axios from 'axios'

const formatText = (str: string): string => {
  str = str.replace(/__/gi, '')
  const match = str.match(/^\b[A-Z]+/)
  if (match) {
    return str.replace(/^\b[A-Z]+/, match[0].toLowerCase())
  }
  return str
}

const objToArr = (obj: any): any[] => {
  const result: any[] = []
  Object.keys(obj).forEach((key) => {
    result.push(obj[key])
  })
  return result
}

const parseMasterItem = (
  obj: { [key: string]: any },
  fieldMeta: values.ParseFields,
  relationData: { [key: string]: any },
  locale: string,
) => {
  const objItem: { [key: string]: any } = {}
  Object.keys(obj).forEach((key2) => {
    if (key2 === 'Id') {
      objItem['masterID'] = obj[key2]
    } else {
      const formated = formatText(key2)
      const parseField = fieldMeta[formated]
      if (!parseField) {
        objItem[formated] = obj[key2]
      } else if (typeof parseField === 'string') {
        objItem[parseField] = obj[key2]
      } else if (parseField.ignore === true || parseField.asJSON === true) {
      } else if (parseField.changeFieldByIndex) {
        objItem[parseField.name || formated] = {}
        ;(obj[key2] as []).forEach((item, index) => {
          objItem[parseField.name || formated][
            parseField.changeFieldByIndex![index] || ''
          ] = item
        })
      } else if (parseField.relation) {
        objItem[parseField.name || formated] =
          relationData[parseField.relation.target][obj[key2]][locale].id
      } else if (parseField.asJSON) {
        objItem[parseField.name || formated] = JSON.stringify(obj[key2])
      } else {
        objItem[parseField.name || formated] = obj[key2]
      }
    }
  })
  return objItem
}

const requestMaster = (region: string, name: string): Promise<any> => {
  return axios.get(
    `https://asset.d4dj.info/${region}/Master/${name}Master.json`,
  )
}

const dataArrToObj = (arr: any[]): { [key: string]: any } => {
  const result: { [key: string]: any } = {}
  arr.forEach((item) => {
    if (!result[item.attributes.masterID]) result[item.attributes.masterID] = {}
    result[item.attributes.masterID][item.attributes.locale] = {
      id: item.id,
      ...item.attributes,
    }
  })
  return result
}

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

  for (const item of parseList) {
    const meta = values.ParserData[item]

    const res = await requestMaster(region, item)
    const parsed = objToArr(res.data)
    const name = meta.name || item
    let allData = downloadedData[name]
    if (!allData) {
      const allDataArr = await request.getAll({ name })
      allData = dataArrToObj(allDataArr)
      downloadedData[name] = allData
    }

    for (let item in meta.fields || {}) {
      const field = meta.fields![item]
      if (
        typeof field !== 'string' &&
        field.relation &&
        !downloadedData[field.relation.target]
      ) {
        const allDataArr = await request.getAll({
          name: field.relation.target,
        })
        downloadedData[field.relation.target] = dataArrToObj(allDataArr)
      }
    }

    if (meta.customFields) {
      for (let name of meta.customFields.load) {
        if (!downloadedData[name]) {
          const allData = name.startsWith('!')
            ? await requestMaster(region, name.replace(/^!/, ''))
            : await request.getAll({ name })
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
      const select = allData[data.Id]
      if (select) {
        if (!select[locale]) {
          const parsed = doParse()
          await request.create({
            locale,
            data: parsed,
            name: meta.name || item,
            update: select[Object.keys(select)[0]].id,
          })
          log.push([`${item}-${region}`, 'Add Locale', parsed.masterID])
        }
        continue
      }
      const parsed = doParse()
      await request.create({
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
