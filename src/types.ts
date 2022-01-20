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

export type ParseGroupType = { [key: string]: string[] }
export type LocaleTableType = { [key: string]: string }
export type ParserDatasType = { [key: string]: ParserDataType }
