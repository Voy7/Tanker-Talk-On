// Utility functions
export default class Utils {
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
}