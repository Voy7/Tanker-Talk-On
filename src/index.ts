// Tanker-Talk-On project entry file

import 'colors'
import dotenv from 'dotenv'
import Logger from '#root/classes/Logger'
import AudioFiles from '#root/classes/AudioFiles'
import SocketServer from '#root/classes/SocketServer'
import packageJSON from '../package.json'  assert { type: 'json' }

// Load .env file
dotenv.config()

// Clean up console and send startup message
console.clear()
Logger.info(`Starting Tanker-Talk-On v${packageJSON.version}...`)

// Compile audio files messages
const audioFiles = new AudioFiles()
audioFiles.compile()

// Start socket server that talks with DCS hooks script
const socketServer = new SocketServer(audioFiles)

import Utils from '#root/classes/Utils'
// Development mode code
if (process.env.PROJECT_MODE == 'dev') {
    Logger.info('Running dev mode code...')
    socketServer.addTanker(10000000, 2, 'Test', 251000000)
    // console.log()
    const tanker = socketServer.getTanker(10000000)

    setTimeout(() => {
        Logger.debug('trying audio...')
        setTimeout(() => tanker?.playAudio('FORWARD_30'), 0)
        setTimeout(() => tanker?.playAudio('FORWARD_20'), 2000)
        setTimeout(() => tanker?.playAudio('FORWARD_10'), 5000)
    }, 3000)
}