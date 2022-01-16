import { basicAuthentication } from './basicAuth'
import { parse } from './parser'
import { BadRequestException, InternalServerErrorException } from './responses'

export async function handleRequest(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const result = basicAuthentication(request)
  if (result !== undefined) return result

  if (request.method !== 'POST') {
    return BadRequestException('method')
  }

  const name = searchParams.get('name')
  const region = searchParams.get('region')
  const group = searchParams.get('group')
  if (!name) {
    return BadRequestException('Name param is required')
  } else if (!region) {
    return BadRequestException('Region param is required')
  }

  try {
    const res = await parse(region, name, group === 'true')
    if (res) {
      return new Response(JSON.stringify(res), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  } catch (e) {
    return InternalServerErrorException(e as any)
  }

  return new Response('Success')
}
