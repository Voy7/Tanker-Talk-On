// Utility functions
export default class Utils {
  // Generate a 22 byte GUID of numbers and letters
  static generateGUID(): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let guid = ''
    for (let i = 0; i < 22; i++) {
      guid += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return guid
  }
  

  // Returns a number with a fixed length by adding zeros to the end
  static fixedLengthNumber(number: number | string, length: number): number {
    const num = number.toString()
    
    // If the number is longer than the length, cut it off
    if (num.length > length) {
      return Number(num.slice(0, length))
    }

    // If the number is shorter than the length, add zeros to the end
    const zeros = '0'.repeat(length - num.length)
    return Number(`${num}${zeros}`)
  }

  // Parse TCP message from DCS script to array of JSON objects
  static parseTCPToJSON(data: string): object | null {
    const command: any = { type: null, dataList: [] }

    data.split(';').forEach(segment => {
      const [key, value] = segment.split('=')
      if (key == 'cmd') command.type = value
      else {
        const obj: any = {}
        segment.split(',').forEach(item => {
          const [key, value] = item.split('=')
          if (key == '' || value == '') return
          obj[key] = value
        })
        command.dataList.push(obj)
      }
    })

    if (command.type) return command
    else return null
  }
}