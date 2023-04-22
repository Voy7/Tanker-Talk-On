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

// Development mode code
if (process.env.PROJECT_MODE == 'dev') {
    Logger.info('Running dev mode code...')
    // socketServer.addTanker(1000000, 2, 'Test', 251)
    // const tanker = socketServer.getTanker(1000000)

    setTimeout(() => {
        // Logger.debug('trying audio...')
        // setTimeout(() => tanker?.playAudio('FORWARD_30', true, false), 0)
        // setTimeout(() => tanker?.playAudio('FORWARD_20', true, false), 2000)
        // setTimeout(() => tanker?.playAudio('FORWARD_10', true, false), 5000)
    }, 3000)
}