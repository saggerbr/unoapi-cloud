import fetch, { Response, RequestInit, HeaderInit } from 'node-fetch'
import { REQUEST_TIMEOUT_MS } from '../defaults'
import logger from './logger'
import { Request } from './request'

export class RequestHttp implements Request {
  async send(phone: string, url: string, method: string, headers: object, body: string) {
    logger.debug(`Send with ${phone} url ${url} with headers %s and body %s`, JSON.stringify(headers), body)
    let response: Response
    try {
      const options: RequestInit = { method, body, headers: headers as HeaderInit }
      if (REQUEST_TIMEOUT_MS) {
        options.signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      }
      response = await fetch(url, options)
    } catch (error) {
      logger.error('Error on send to url %s with headers %s and body %s', url, JSON.stringify(headers), body)
      logger.error(error)
      throw error
    }
    logger.debug('Response: %s', response?.status)
    if (!response?.ok) {
      throw await response?.text()
    }
  }
}
