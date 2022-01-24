export type ParseGroupType = { [key: string]: string[] }
export type LocaleTableType = { [key: string]: string }
export type CustomParserType = (
  originalData: any,
  loadedData: { [key: string]: any[] },
  locale: string,
) => any
export type ParserDatasType = { [key: string]: ParserDataType }
export type ParserDataCustomFieldsContent = {
  name: string
  parser: CustomParserType
}
export type ParserDataCustomFields = {
  load: string[]
  fields: ParserDataCustomFieldsContent[]
}

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
        changeValueByName?: {
          [key: string]: string
          '': string
        }
      }
}

export type ParserDataType = {
  name?: string
  fields?: ParseFields
  customFields?: ParserDataCustomFields
}
