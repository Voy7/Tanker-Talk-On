import dgram from 'dgram'
import ffmpeg from 'fluent-ffmpeg'
import Logger from '#root/classes/Logger'

import type SRSClient from '#root/classes/SRS/SRSClient'

// UDP Voice Client
export default class UDPVoiceClient {
  client: dgram.Socket

  constructor(srsClient: SRSClient) {
    this.client = dgram.createSocket({ type: 'udp4', reuseAddr: true })

    this.client.connect(5002, srsClient.host, (err: Error) => {
      if (err) throw err

      Logger.info('SRS UDP client connected.')
  
      this.client.send(srsClient.tanker.guid, err => {
        if (err) throw err
        Logger.info('SRS UDP client sent GUID sync.')
      })
  
      // Listen for UDP messages from SRS server on port 5002
      this.client.on('message', (msg, rinfo) => {
        console.log(`UDP message received from ${rinfo.address}:${rinfo.port}`.cyan)
        try {
          // Test retransmition
          // setTimeout(() => {
            // const newMsg = new UDPVoicePacket(msg).get()
            // const msgInfo = logUDPVoicePacket(msg, 'return')
            // if (!msgInfo) return
            // lastVoicePacket = msg
            // console.log('set last voice packed!'.yellow)
            // clientUDP.send(newMsg, err => {
            //   if (err) throw err
            //   console.log('UDP message sent'.green)
            // })
  
          // }, 2000)
        }
        catch (err) { console.log(err) }
      })
  
      // setTimeout(() => {
      //   convertFileToOpusStream(clientUDP)
      // }, 500)
    })
  }

  // Send a UDP message to the SRS server
  send(msg: Buffer) {
    this.client.send(msg, err => {
      if (err) throw err
      console.log('UDP message sent'.green)
    })
  }
}