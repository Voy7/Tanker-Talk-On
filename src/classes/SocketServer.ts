import net from 'net'
import Logger from '#root/classes/Logger'
import Utils from '#root/classes/Utils'
import Tanker from '#root/classes/Tanker'
import type AudioFiles from '#root/classes/AudioFiles'

// Socket server & message handler that talks with DCS hooks script
export default class SocketServer {
  audioFiles: AudioFiles
  server: net.Server
  tankers: Tanker[]

  constructor(audioFiles: AudioFiles) {
    this.audioFiles = audioFiles
    this.server = new net.Server()
    this.tankers = []

    // DCS script connects to this server
    this.server.on('connection', socket => {
      Logger.info(`TCP connection established with ${socket.remoteAddress}:${socket.remotePort}`)

      // DCS script sends messages to the server
      socket.on('data', data => {
        // Parse TCP message from DCS script to array of JSON objects
        data.toString().split(';;').forEach(message => {
          const command: any = Utils.parseTCPToJSON(message)
          // console.log(command)
          if (!command) return
          
          // Handle commands
          if (command.type == 'TANKERS_LIST') {
            command.dataList.forEach((tanker: any) => {
              if (!tanker.unitID || !tanker.coalition || !tanker.callsign || !tanker.frequency) return
              const unitID = parseInt(tanker.unitID)
              const coalition = parseInt(tanker.coalition)
              const callsign = tanker.callsign
              const frequency = Utils.fixedLengthNumber(tanker.frequency, 9)

              const existingTanker = this.getTanker(unitID)
              if (!existingTanker) this.addTanker(unitID, coalition, callsign, frequency)
            })
          }
        })

        if (data.toString() == 'cmd=INIT;') {
          console.log('Received INIT command'.green)
        }
      })

      // DCS script disconnects
      socket.on('close', () => {
        Logger.info(`TCP connection closed with ${socket.remoteAddress}:${socket.remotePort}`)
      })
    })

    const port = parseInt(process.env.SOCKET_PORT!) || 8100
    this.server.listen(port, () => {
      Logger.info(`TCP server listening on port: ${port}`)
    })
  }

  // Add a new tanker / SRS client
  addTanker(unitID: number, coalition: number, callsign: string, frequency: number) {
    const tanker = new Tanker(unitID, coalition, callsign, frequency, this)
    this.tankers.push(tanker)
  }

  // Remove a tanker / SRS client
  removeTanker(unitID: number) {
    const index = this.tankers.findIndex(tanker => tanker.unitID == unitID)
    if (index == -1) return

    // this.tankers[index].disconnect()
    this.tankers.splice(index, 1)
  }

  // Get a tanker / SRS client
  getTanker(unitID: number): Tanker | undefined {
    return this.tankers.find(tanker => tanker.unitID == unitID)
  }
}