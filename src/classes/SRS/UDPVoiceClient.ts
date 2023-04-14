import dgram from 'dgram'
import ffmpeg from 'fluent-ffmpeg'
import Logger from '#root/classes/Logger'

// UDP Voice Client
export default class UDPVoiceClient {
  client: dgram.Socket

  constructor(host: string, port: number, unitID: number, coalition: number, callsign: string, frequency: number) {
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