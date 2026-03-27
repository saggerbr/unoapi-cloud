import { amqpPublish } from '../amqp'
import { UNOAPI_EXCHANGE_BROKER_NAME, UNOAPI_QUEUE_REQUEST } from '../defaults'
import { Request } from './request'

export class RequestAmqp implements Request {
  async send(phone: string, url: string, method: string, headers: object, body: string) {
    await amqpPublish(UNOAPI_EXCHANGE_BROKER_NAME, UNOAPI_QUEUE_REQUEST, phone, { url, method, headers, body })
  }
}
