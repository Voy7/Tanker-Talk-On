import TCPMessageClient from '#root/classes/SRS/TCPMessageClient'
import UDPVoiceClient from '#root/classes/SRS/UDPVoiceClient'

import type Tanker from '#root/classes/Tanker'

// SRS Client
export default class SRSClient {
  tanker: Tanker
  host: string
  port: number
  tcpClient: TCPMessageClient
  udpClient: UDPVoiceClient

  constructor(tanker: Tanker) {
    this.tanker = tanker
    
    this.host = process.env.SRS_HOST || 'localhost'
    this.port = parseInt(process.env.SRS_PORT!) || 5002

    this.tcpClient = new TCPMessageClient(this)
    this.udpClient = new UDPVoiceClient(this)
  }
}