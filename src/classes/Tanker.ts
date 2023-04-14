import SRSClient from './SRS/SRSClient.js'

export default class Tanker {
  unitID: number
  coalition: number
  callsign: string
  frequency: number
  SRSClient: SRSClient

  constructor(unitID: number, coalition: number, callsign: string, frequency: number) {
    this.unitID = unitID
    this.coalition = coalition
    this.callsign = callsign
    this.frequency = frequency
    this.SRSClient = new SRSClient(unitID, coalition, callsign, frequency)
  }
}