export default class Logger {
  static log(message: string) {
    console.log(`[LOG]`.gray, message)
  }
  static info(message: string) {
    console.log(`[INFO]`.cyan, message)
  }
  static warn(message: string) {
    console.log(`[WARN]`.yellow, message)
  }
  static error(message: string, ...additional: any[]) {
    console.log(`[ERROR]`.red, message, ...additional)
  }
  static debug(message: string) {
    if (process.env.PROJECT_MODE != 'dev') return
    console.log(`[DEBUG]`.magenta, message)
  }
}