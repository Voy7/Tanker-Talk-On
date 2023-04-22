import Utils from '#root/classes/Utils'
import SRSClient from '#root/classes/SRS/SRSClient'

import type SocketServer from '#root/classes/SocketServer'

export default class Tanker {
  guid: string
  unitID: number
  coalition: number
  callsign: string
  frequency: number
  socketServer: SocketServer
  SRSClient: SRSClient

  constructor(unitID: number, coalition: number, callsign: string, frequency: number, socketServer: SocketServer) {
    this.guid = Utils.generateGUID()
    this.unitID = unitID
    this.coalition = coalition
    this.callsign = callsign
    this.frequency = frequency
    this.socketServer = socketServer
    this.SRSClient = new SRSClient(this)
  }

  // Play audio category/file
  playAudio(category: string) {
    this.SRSClient.udpClient.playAudioFile(category)
  }
}