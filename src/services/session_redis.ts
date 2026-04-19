import { BufferJSON } from 'baileys'
import { setAuth, getAuth, delAuth } from './redis'
import { session, writeData, readData, removeData, getKey } from './session'
import logger from './logger'

export const sessionRedis: session = async (phone: string) => {
  const getKey: getKey = (type: string, id: string) => `${phone}:${type}-${id}`

  const writeData: writeData = async (key: string, data: object, ttl: number) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return setAuth(key, data, ttl, (value: any) => JSON.stringify(value, BufferJSON.replacer))
    } catch (error) {
      logger.error(error, 'Error on write auth')
      throw error
    }
  }

  const readData: readData = async (key: string) => {
    try {
      return getAuth(key, (value: string) => {
        try {
          return value ? JSON.parse(value, BufferJSON.reviver) : null
        } catch (error) {
          logger.error(`Error on parsing auth: ${value}`)
          throw error
        }
      })
    } catch (error) {
      logger.error(error, 'Error on read auth')
      throw error
    }
  }

  const removeData: removeData = async (key: string) => {
    try {
      await delAuth(key)
    } catch (error) {
      logger.error(error, 'Error on remove auth %s')
      throw error
    }
  }

  return { writeData, getKey, removeData, readData, extension: '' }
}
