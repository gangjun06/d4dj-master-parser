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
  if (!name) {
    return BadRequestException('Name param is required')
  } else if (!region) {
    return BadRequestException('Region param is required')
  }

  try {
    await parse(region, name)
  } catch (e) {
    console.error(e)
    return InternalServerErrorException('Error')
  }

  return new Response('Success')
}
