import logger from './logger'
import { Client, getClient } from './client'
import { getConfig } from './config'
import { OnNewLogin } from './socket'
import { Listener } from './listener'
import { Sync } from './sync'
import { t } from '../i18n'
import { SEND_MESSAGE_ON_DECRYPT_ERROR } from '../defaults'

export class SyncBaileys implements Sync {
  private service: Listener
  private getClient: getClient
  private getConfig: getConfig
  private onNewLogin: OnNewLogin

  constructor(service: Listener, getConfig: getConfig, getClient: getClient, onNewLogin: OnNewLogin) {
    this.service = service
    this.getConfig = getConfig
    this.getClient = getClient
    this.onNewLogin = onNewLogin
  }

  async process(phone, jids: string[]) {
    if (!SEND_MESSAGE_ON_DECRYPT_ERROR) {
      return true
    }

    const client: Client = await this.getClient({
      phone,
      listener: this.service,
      getConfig: this.getConfig,
      onNewLogin: this.onNewLogin,
    })
    if (!client) {
      throw 'Disconnected Client ' + phone
    }
    logger.debug('Send baileys automaticaly message to sync keys and decrypt %s', phone)
    await Promise.all(jids.map((jid: string) => {
      return client.send(
        {
          type: 'text',
          to: jid,
          text: {
            body: t('retry_decrypt')
          }
        }, {}
      )
    }))
    return true
  }
}
