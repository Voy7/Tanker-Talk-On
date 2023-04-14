import TCPMessageClient from './TCPMessageClient.js'
import UDPVoiceClient from './UDPVoiceClient.js'

// SRS Client
export default class SRSClient {
  tcpClient: TCPMessageClient
  udpClient: UDPVoiceClient

  constructor(unitID: number, coalition: number, callsign: string, frequency: number) {
    
    const host = process.env.SRS_HOST || 'localhost'
    const port = parseInt(process.env.SRS_PORT!) || 5002

    this.tcpClient = new TCPMessageClient(host, port, unitID, coalition, callsign, frequency)
    this.udpClient = new UDPVoiceClient(host, port, unitID, coalition, callsign, frequency)
  }
}