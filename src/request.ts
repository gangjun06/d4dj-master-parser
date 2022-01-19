import axios from 'axios'
import * as values from './values'

export const create = async (props: {
  data: object
  name: string
  locale: string
  update?: string
}) => {
  //@ts-ignore
  const [apiKey, apiUrl] = [
    process.env.API_KEY || '',
    process.env.API_URL || '',
  ]
  try {
    const res = await axios.post(
      `${apiUrl}/api/${props.name}/${
        props.update ? `${props.update}/localizations` : ''
      }`,
      {
        ...(props.update
          ? {
              ...props.data,
              locale: props.locale,
            }
          : {
              data: {
                ...props.data,
                locale: props.locale,
              },
            }),
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )
  } catch (e) {
    //@ts-ignore
    console.log(e)
    // console.log(e.response.data)
  }
}

export const getAll = async (props: { name: string }) => {
  //@ts-ignore
  const [apiKey, apiUrl] = [
    process.env.API_KEY || '',
    process.env.API_URL || '',
  ]
  let [pageCount, curPage] = [1, 1]
  const result: any[] = []
  const locales: { [key: string]: string } = {}
  Object.keys(values.LocaleTable).forEach((item, index) => {
    locales[`locale[${index}]`] = values.LocaleTable[item]
  })
  for (;;) {
    const res = await axios.get(`${apiUrl}/api/${props.name}/`, {
      params: {
        'pagination[page]': curPage,
        'pagination[pageSize]': 1000,
        ...locales,
      },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    result.push(...res.data.data)
    pageCount = res.data.meta.pagination.pageCount
    curPage += 1
    if (pageCount < curPage || !res.data.data.length) break
  }

  return result
}
