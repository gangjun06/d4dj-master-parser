/* eslint-disable @typescript-eslint/ban-ts-comment */
// https://developers.cloudflare.com/workers/examples/basic-auth

import { BadRequestException, UnauthorizedException } from './responses'

function verifyCredentials(user: string, pass: string) {
  //@ts-ignore
  const userData = BASIC_USER
  //@ts-ignore
  const passData = BASIC_PASS
  if (userData !== user) {
    return UnauthorizedException('Invalid username.')
  }

  if (passData !== pass) {
    return UnauthorizedException('Invalid password.')
  }
}

export function basicAuthentication(request: Request): Response | undefined {
  const Authorization = request.headers.get('Authorization')

  if (!Authorization) {
    return BadRequestException('Missing Authorization Header')
  }

  const [scheme, encoded] = Authorization.split(' ')

  if (!encoded || scheme !== 'Basic') {
    return BadRequestException('Malformed authorization header.')
  }

  const buffer = Uint8Array.from(atob(encoded), (character) =>
    character.charCodeAt(0),
  )
  const decoded = new TextDecoder().decode(buffer).normalize()

  const index = decoded.indexOf(':')

  // eslint-disable-next-line no-control-regex
  if (index === -1 || /[\0-\x1F\x7F]/.test(decoded)) {
    return BadRequestException('Invalid authorization value.')
  }

  return verifyCredentials(
    decoded.substring(0, index),
    decoded.substring(index + 1),
  )
}
