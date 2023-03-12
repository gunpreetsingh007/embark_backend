let { LogScheme } =  require("./log-scheme.class.js");

class LogClass {

    info(...args) {

        return LogScheme.info(args);
    }

    warn(...args) {

        return LogScheme.warn(args);
    }

    error(...args) {

        return LogScheme.error(args);
    }
}

module.exports.log = new LogClass();