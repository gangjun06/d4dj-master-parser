import { basicAuthentication } from './basicAuth'
// import { BadRequestException, UnauthorizedException } from './responses'

export async function handleRequest(request: Request): Promise<Response> {
  const { protocol, pathname } = new URL(request.url)
  const result = basicAuthentication(request)
  if (result !== undefined) return result

  return new Response('Success')
}
