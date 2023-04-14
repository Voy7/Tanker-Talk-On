import dgram from 'dgram'
import ffmpeg from 'fluent-ffmpeg'
import Logger from '#root/classes/Logger'

import type SRSClient from '#root/classes/SRS/SRSClient'

// UDP Voice Client
export default class UDPVoiceClient {
  client: dgram.Socket

  constructor(srsClient: SRSClient) {
    this.client = dgram.createSocket('udp4')

    this.client.on('message', msg => {
      Logger.info(`UDP Voice Client message: ${msg}`)
    })

    this.client.on('error', err => {
      Logger.error(`UDP Voice Client error: ${err.message}`)
      this.client.close()
    })
  }
}