export const createRequest = async (props: {
  data: object
  name: string
  locale: string
  update: boolean
}) => {
  //@ts-ignore
  const [apiKey, apiUrl] = [API_KEY || '', API_URL || '']
  const res = await fetch(`${apiUrl}/api/${props.name}/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        ...props.data,
        locale: props.locale,
      },
    }),
  })
  const json = await res.text()
  console.log(json)
}

export const getAllRequest = (props: { name: string }) => {
  //@ts-ignore
  const [apiKey, apiUrl] = [API_KEY || '', API_URL || '']
  fetch(`${apiUrl}/api/${props.name}/`)
}
