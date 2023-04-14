import net from 'net'
import Logger from '#root/classes/Logger'
import Utils from '#root/classes/Utils'
import Tanker from '#root/classes/Tanker'

// Socket server & message handler that talks with DCS hooks script
export default class SocketServer {
  server: net.Server
  tankers: Tanker[]

  constructor() {
    this.server = new net.Server()
    this.tankers = []

    // DCS script connects to this server
    this.server.on('connection', socket => {
      Logger.info(`TCP connection established with ${socket.remoteAddress}:${socket.remotePort}`)

      // DCS script sends messages to the server
      socket.on('data', data => {
        // Parse TCP message from DCS script to array of JSON objects
        const commands = []
        data.toString().split(';').forEach(message => {
          const msg = Utils.parseTCPToJSON(message)
          if (!msg) return
          commands.push(msg)
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
}