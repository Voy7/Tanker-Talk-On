export default class Logger {
  static log(message: string) {
    console.log(`[LOG]`.gray, message)
  }
  static info(message: string) {
    console.log(`[INFO]`.cyan, message)
  }
  static error(message: string, ...additional: any[]) {
    console.log(`[ERROR]`.red, message, ...additional)
  }
}