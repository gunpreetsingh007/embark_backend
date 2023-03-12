
class Config {


   logConfig = {
    logFileSize: '10m',
    logMaxFiles: 5,
    logDirectory: 'logs'
  }

  /**
   * Can also be treated as current microservice name 
   */
   currentLocation = process.cwd().split('/').pop();

  constructor() {
  }

}
module.exports.config = new Config();