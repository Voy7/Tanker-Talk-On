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
  lastMessage: string | null

  constructor(unitID: number, coalition: number, callsign: string, frequency: number, socketServer: SocketServer) {
    this.guid = Utils.generateGUID()
    this.unitID = unitID
    this.coalition = coalition
    this.callsign = callsign
    this.frequency = Utils.fixedLengthNumber(frequency, 9)
    this.socketServer = socketServer
    this.SRSClient = new SRSClient(this)
    this.lastMessage = null
  }

  // Play audio message category/file
  playAudio(category: string, noRepeat: boolean, force: boolean) {
    if (noRepeat && this.lastMessage == category) return
    this.lastMessage = category
    this.SRSClient.udpClient.playAudioFile(category)
  }
}