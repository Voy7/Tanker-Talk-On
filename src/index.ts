// Tanker-Talk-On project entry file

import 'colors'
import dotenv from 'dotenv'
import Logger from '#root/classes/Logger'
import SocketServer from '#root/classes/SocketServer'
import packageJSON from '../package.json'  assert { type: 'json' }

// Load .env file
dotenv.config()

// Clean up console and send startup message
console.clear()
Logger.info(`Starting Tanker-Talk-On v${packageJSON.version}...`)

// Start socket server that talks with DCS hooks script
const socketServer = new SocketServer()

// Development mode code
if (process.env.PROJECT_MODE == 'dev') {
    Logger.info('Running dev mode code...')
    socketServer.addTanker(100000000, 1, 'Test', 127.000)
}