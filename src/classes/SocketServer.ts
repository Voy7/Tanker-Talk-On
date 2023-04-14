import net from 'net'

import Tanker from './Tanker.js'

// Socket server & message handler
export default class SocketServer {
  tankers: Tanker[]

  constructor() {
    this.tankers = []

    const server = net.createServer()

    server.on('connection', socket => {
      console.log(`TCP connection established with ${socket.remoteAddress}:${socket.remotePort}`.gray)

      socket.on('data', data => {
        console.log(`Received data: ${data}`.gray)

        if (data.toString() == 'cmd=INIT;') {
          console.log('Received INIT command'.green)
        }

        else {
          console.log('received:', data.toString())
        }
      })

      socket.on('close', () => {
          console.log(`TCP connection closed with ${socket.remoteAddress}:${socket.remotePort}`.gray)
      })
    })

    const port = parseInt(process.env.SOCKET_PORT!) || 8100
    server.listen(port, () => {
      console.log(`TCP server listening on port ${port}`.gray)
    })
  }

  // unitID is number with a length of 9
  addTanker(unitID: number, coalition: number, callsign: string, frequency: number) {
    const tanker = new Tanker(unitID, coalition, callsign, frequency)
    this.tankers.push(tanker)
  }
}