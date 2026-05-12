import { Request } from '../services/request'

export class RequestJob {
  private service: Request

  constructor(service: Request) {
    this.service = service
  }

  async consume(phone: string, data: object) {
    const a = { ...(data as any) }
    const payload: any = a.payload
    const { url, method, headers, body } = payload
    await this.service.send(phone, url, method, headers, body)
  }
}
