const formatText = (str: string): string => {
  str = str.replace(/__/gi, '')
  const match = str.match(/^\b[A-Z]+/)
  if (match) {
    return str.replace(/^\b[A-Z]+/, match[0].toLowerCase())
  }
  return str
}

const parseJSON = (json: any): any[] => {
  const result: any[] = []
  Object.keys(json).forEach((key) => {
    const objItem = {}
    Object.keys(json[key]).forEach((key2) => {
      //@ts-ignore
      objItem[formatText(key2)] = json[key][key2]
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

export const parse = async (region: string, name: string): Promise<void> => {
  const res = await requestMaster(region, name)
  const parsed = parseJSON(res)
}
