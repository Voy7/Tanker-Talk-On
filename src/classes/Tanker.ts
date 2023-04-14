import SRSClient from '#root/classes/SRS/SRSClient'

import type SocketServer from '#root/classes/SocketServer'

export default class Tanker {
  unitID: number
  coalition: number
  callsign: string
  frequency: number
  socketServer: SocketServer
  SRSClient: SRSClient

  constructor(unitID: number, coalition: number, callsign: string, frequency: number, socketServer: SocketServer) {
    this.unitID = unitID
    this.coalition = coalition
    this.callsign = callsign
    this.frequency = frequency
    this.socketServer = socketServer
    this.SRSClient = new SRSClient(this)
  }
}