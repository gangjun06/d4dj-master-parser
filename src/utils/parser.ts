import * as types from '../types'

const formatText = (str: string): string => {
  str = str.replace(/__/gi, '')
  const match = str.match(/^\b[A-Z]+/)
  if (match) {
    return str.replace(/^\b[A-Z]+/, match[0].toLowerCase())
  }
  return str
}

export const objToArr = (obj: any): any[] => {
  const result: any[] = []
  Object.keys(obj).forEach((key) => {
    result.push(obj[key])
  })
  return result
}

export const parseMasterItem = (
  obj: { [key: string]: any },
  fieldMeta: types.ParseFields,
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
      } else if (parseField.ignore === true) {
      } else if (parseField.changeFieldByIndex) {
        objItem[parseField.name || formated] = {}
        ;(obj[key2] as []).forEach((item, index) => {
          objItem[parseField.name || formated][
            parseField.changeFieldByIndex![index] || ''
          ] = item
        })
      } else if (parseField.relation) {
        try {
          if (typeof obj[key2] === 'object') {
            objItem[parseField.name || formated] = []
            obj[key2].forEach((item: any) => {
              objItem[parseField.name || formated].push(
                relationData[parseField!.relation!.target][item][locale].id,
              )
            })
          } else
            objItem[parseField.name || formated] =
              relationData[parseField!.relation!.target][obj[key2]][locale].id
        } catch (e) {}
      } else if (parseField.asJSON) {
        objItem[parseField.name || formated] = JSON.stringify(obj[key2])
      } else if (parseField.changeValueByName) {
        objItem[parseField.name || formated] =
          parseField.changeValueByName[obj[key2]] ||
          parseField.changeValueByName['']
      } else {
        objItem[parseField.name || formated] = obj[key2]
      }
    }
  })
  return objItem
}

export const dataArrToObj = (arr: any[]): { [key: string]: any } => {
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
