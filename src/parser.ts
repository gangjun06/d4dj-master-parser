import { group } from 'console'
import * as values from './values'

const formatText = (str: string): string => {
  str = str.replace(/__/gi, '')
  const match = str.match(/^\b[A-Z]+/)
  if (match) {
    return str.replace(/^\b[A-Z]+/, match[0].toLowerCase())
  }
  return str
}

const requestAPIServer = () => {
  //@ts-ignore
  const [apiKey, apiUrl] = [API_KEY || '', API_URL || '']
}

const parseJSON = (json: any, parseFields: values.ParseFields): any[] => {
  const result: any[] = []
  Object.keys(json).forEach((key) => {
    const objItem: { [key: string]: any } = {}
    Object.keys(json[key]).forEach((key2) => {
      if (key2 === 'Id') {
        objItem['masterID'] = json[key][key2]
      } else {
        const formated = formatText(key2)
        const parseField = parseFields[formated]
        if (!parseField) {
          objItem[formated] = json[key][key2]
        } else if (typeof parseField === 'string') {
          objItem[parseField] = json[key][key2]
        } else if (parseField.ignore === true || parseField.asJSON === true) {
        } else if (parseField.changeFieldByIndex) {
          objItem[parseField.name || formated] = {}
          ;(json[key][key2] as []).forEach((item, index) => {
            objItem[parseField.name || formated][
              parseField.changeFieldByIndex![index] || ''
            ] = item
          })
        } else if (parseField.relation) {
        } else {
          objItem[parseField.name || formated] = json[key][key2]
        }
      }
    })
    result.push(objItem)
  })
  return result
}

const requestMaster = (region: string, name: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    fetch(`https://asset.d4dj.info/${region}/Master/${name}Master.json`)
      .then((res) => res.json())
      .then((res) => resolve(res))
      .catch((reason) => reject(reason))
  })
}

export const parse = async (
  region: string,
  name: string,
  parseGroup: boolean,
): Promise<any> => {
  const parseList = parseGroup ? values.ParseGroup[name] || [] : [name]
  if (!parseList.length) throw new Error('name is wrong')

  const downloadedData: { [key: string]: any[] } = {}

  const requestData = (name: string) => {}

  for (const item of parseList) {
    const meta = values.ParserData[item]
    // if (meta.fields)
    //   Object.keys(meta.fields).forEach((item) => {
    //     console.log(meta.fields![item])
    //   })

    const res = await requestMaster(region, name)
    const parsed = parseJSON(res, meta.fields || {})
    return parsed
  }
}
