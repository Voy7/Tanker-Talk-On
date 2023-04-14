// Tanker-Bot project entry file

import dotenv from 'dotenv'
import 'colors'

import Logger from '#root/classes/Logger'
import SocketServer from '#root/classes/SocketServer'
import packageJSON from '../package.json'  assert { type: 'json' }

// Load .env file
dotenv.config()

// Clean up console and send starting message
console.clear()
Logger.info(`Starting Tanker-Bot v${packageJSON.version}...`)

// Start socket server that talks with DCS hook script
const socketServer = new SocketServer()

// test
socketServer.addTanker(100000001, 2, 'Tanker 1', 251000000)