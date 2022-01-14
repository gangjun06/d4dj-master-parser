export function UnauthorizedException(reason: string): Response {
  return new Response(reason, {
    status: 401,
    statusText: 'Unauthorized',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      'Cache-Control': 'no-store',
    },
  })
}

export function BadRequestException(reason: string): Response {
  return new Response(reason, {
    status: 400,
    statusText: 'Bad Request',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      'Cache-Control': 'no-store',
    },
  })
}

export function InternalServerErrorException(reason: string): Response {
  return new Response(reason, {
    status: 500,
    statusText: 'Internal Server Error',
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
      'Cache-Control': 'no-store',
    },
  })
}
