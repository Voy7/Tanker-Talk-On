import dgram from 'dgram'
import ffmpeg from 'fluent-ffmpeg'
import Logger from '#root/classes/Logger'

import type SRSClient from '#root/classes/SRS/SRSClient'

// UDP Voice Client
export default class UDPVoiceClient {
  srsClient: SRSClient
  client: dgram.Socket
  ready: boolean

  constructor(srsClient: SRSClient) {
    this.srsClient = srsClient
    this.client = dgram.createSocket({ type: 'udp4', reuseAddr: true })
    this.ready = false

    this.client.connect(5002, 'localhost', () => {
      // if (err) throw err

      Logger.info('SRS UDP client connected.')
  
      this.client.send(this.srsClient.tanker.guid, err => {
        if (err) throw err
        Logger.info('SRS UDP client sent GUID sync.')
        this.ready = true
      })
  
      // Listen for UDP messages from SRS server on port 5002
      this.client.on('message', (msg, rinfo) => {
        console.log(`UDP message received from ${rinfo.address}:${rinfo.port}`.cyan)
      })
    })
  }

  // Encode audio file with FFMPEG and play it over UDP radio
  playAudioFile(category: string) {
    const audioFile = this.srsClient.tanker.socketServer.audioFiles.random(category)
    if (audioFile) {
      Logger.debug(`Playing audio file: ${category}/${audioFile}`)

      let datasIndex = 0
      ffmpeg(`src/audio/${category}/${audioFile}`)
        .audioCodec('libopus')
        .format('opus')
        .audioBitrate(256)
        .audioChannels(1)
        .audioFilters('volume=0.4')
        .inputOptions([
          '-re'
        ])
        .outputOptions([
          '-bufsize 100',
          '-f s16le',
        ])

        .on('error', err => Logger.error('An error occurred in ffmpeg stream', err))
        .on('end', () => Logger.debug(`Done processing audio file: ${category}/${audioFile}`))
        .pipe() // Pipe data to .on('data')

        .on('data', (data) => {
          try {
            datasIndex++
      
            const audioData = data.toString('binary')
            const audioLength = audioData.length
      
            const dataBuffer = Buffer.alloc(6 + audioLength + 10 + 13 + 22 + 22)
            // Header
            dataBuffer.writeUInt16LE(6 + audioLength + 10 + 13 + 22 + 22) // UInt16 Packet Length - 2 bytes
            dataBuffer.writeUInt16LE(audioLength, 2) // UInt16 Audio Part Length - 2 bytes
            dataBuffer.writeUInt16LE(10, 4) // UInt16 FrequencyPart Length - 2 bytes
            // Audio part
            // write the data audio buffer into the buffer at position 6
            dataBuffer.write(audioData, 6, audioLength, 'binary') // Bytes Audio Part - variable bytes
            // Frequency part
            dataBuffer.writeDoubleLE(this.srsClient.tanker.frequency, audioLength + 6) // UInt64 Frequency - 8 bytes
            dataBuffer.writeUInt8(0, audioLength + 14) // UInt8 Modulation - 1 byte
            dataBuffer.writeUInt8(0, audioLength + 15) // UInt8 Encryption - 1 byte
            const frequencyLength = 10
            // Fixed part
            dataBuffer.writeUInt32LE(this.srsClient.tanker.unitID, 6 + audioLength + frequencyLength) // UInt32 UnitId - 4 bytes
            dataBuffer.writeBigUint64LE(BigInt(datasIndex + 1), 6 + audioLength + frequencyLength + 4) // UInt64 PackedId - 8 bytes
            dataBuffer.writeUInt8(0, 6 + audioLength + frequencyLength + 12) // UInt8 Retransmit - 1 byte
            dataBuffer.write(this.srsClient.tanker.guid, 6 + audioLength + frequencyLength + 13, 22, 'ascii') // Bytes RetransmitGuid - 22 bytes
            dataBuffer.write(this.srsClient.tanker.guid, 6 + audioLength + frequencyLength + 13 + 22, 22, 'ascii') // Bytes ClientGuid - 22 bytes
      
            this.client.send(dataBuffer, err => {
              if (err) console.log(err)
              // else console.log('sent buffer')
            })
          }
          catch (err) {
            console.log('[?]'.red + ` Error while writing or sending: ${err}`.gray)
          }
        })
    }
    else Logger.error(`No audio files found for category: ${category}`)
  }
}