import axios from 'axios'

export const createRequest = async (props: {
  data: object
  name: string
  locale: string
  update: boolean
}) => {
  //@ts-ignore
  const [apiKey, apiUrl] = [
    process.env.API_KEY || '',
    process.env.API_URL || '',
  ]
  try {
    const res = await axios.post(
      `${apiUrl}/api/${props.name}/`,
      {
        data: {
          ...props.data,
          locale: props.locale,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (e) {
    //@ts-ignore
    console.log(e.response.data)
  }
}

export const getAllRequest = (props: { name: string }) => {
  //@ts-ignore
  const [apiKey, apiUrl] = [
    process.env.API_KEY || '',
    process.env.API_URL || '',
  ]
  axios.get(`${apiUrl}/api/${props.name}/`)
}
