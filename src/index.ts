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

import Utils from '#root/classes/Utils'
// Development mode code
if (process.env.PROJECT_MODE == 'dev') {
    Logger.info('Running dev mode code...')
    socketServer.addTanker(1000000, 2, 'Test', 251000000)
    console.log(socketServer.getTanker(1000000))
}