export interface Request {
  send(phone: string, url: string, method: string, headers: object, body: string): Promise<void>
}
