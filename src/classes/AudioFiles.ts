import Logger from '#root/classes/Logger'
import fs from 'fs'

interface StringIndexable {
  [key: string]: any
}

// Handle audio files fetching & utilities
export default class AudioFiles {
  messages: StringIndexable

  constructor() {
    this.messages = []
  }

  // Compile all audio files messages from /audio/ folder
  compile(): StringIndexable {
    let fileCount = 0
    const folders = fs.readdirSync('src/audio')
    folders.forEach(folder => {
      const files = fs.readdirSync(`src/audio/${folder}`)
      files.forEach(file => {
        if (!this.messages[folder]) this.messages[folder] = []
        this.messages[folder].push(file)
        fileCount++
      })
    })
    Logger.info(`Compiled ${Object.keys(this.messages).length} message categories with ${fileCount} audio files.`)
    return this.messages
  }

  // Get a random audio file from specified folder/category
  random(folder: string): string | null {
    const files = this.messages[folder]
    if (!files) return null
    const randomFile = files[Math.floor(Math.random() * files.length)]
    return randomFile
  }
}