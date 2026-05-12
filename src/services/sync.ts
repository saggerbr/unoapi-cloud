export interface Sync {
  process(phone: string, jids: string[]): Promise<boolean>
}
