import net from 'net'
import Logger from '#root/classes/Logger'
import type SRSClient from '#root/classes/SRS/SRSClient'

const SYNC_MESSAGE = {
  Client: {
    ClientGuid: 'X8DqOG8uPkKuDHfRRK9_QA', // H8DqOG8uPkKuDHfRRK9_QA
    Name: 'TankerBot',
    Seat: 0,
    Coalition: 2,
    AllowRecord: false,
    RadioInfo: {
      radios: [
        {
          enc: false,
          encKey: 1,
          freq: 251000000,
          modulation: 0, // AM
          secFreq: 243000000,
          retransmit: false
        }
      ],
      unit: 'External AWACS',
      unitId: 100000001,
      iff: {
        control: 2,
        mode1: -1,
        mode3: -1,
        mode4: false,
        mic: -1,
        status: 1 // default: 0, idk what this does
      }
    },
    LatLngPosition: { lat: 0, lng: 0, alt: 0 }
  },
  MsgType: 2,
  Version: '2.0.8.3'
}

export default class TCPMessageClient {
  srsClient: SRSClient
  client: net.Socket

  constructor(srsClient: SRSClient) {
    this.srsClient = srsClient
    this.client = new net.Socket()

    Logger.info(`Connecting SRS TCP client to ${srsClient.host}:${srsClient.port}...`)
    
    this.client.connect(this.srsClient.port, this.srsClient.host, () => {
      Logger.info('SRS TCP client connected.')
      
      this.client.setNoDelay(true)
      const syncMessage = SYNC_MESSAGE
      syncMessage.Client.ClientGuid = srsClient.tanker.guid
      syncMessage.Client.RadioInfo.unitId = srsClient.tanker.unitID
      syncMessage.Client.Name = srsClient.tanker.callsign
      syncMessage.Client.Coalition = srsClient.tanker.coalition
      syncMessage.Client.RadioInfo.radios[0].freq = srsClient.tanker.frequency

      Logger.info('Sending SRS TCP radio update message...')
      this.client.write(JSON.stringify(syncMessage) + '\n')
      // DELAY IT BY 1ms, NO FUCKING CLUE WHY I HAVE TO DO THIS, BUT IT WORKS I GUESS
      // setTimeout(() => this.client.write(raw + '\n'), 1)
    })
    
    this.client.on('close', () => {
      Logger.info('SRS TCP socket closed.')
    })

    this.client.on('error', err => {
      Logger.error('An error occoured with the SRS TCP socket, is the SRS server running?', err)
    })
  }
}