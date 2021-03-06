import Xml2js from 'xml2js'
import Log4js from 'log4js'
import Path from 'path'

class Util {
    mLogger: Log4js.Logger
    constructor() {
        Log4js.configure({
            appenders: { cheese: { type: 'file', filename: 'cheese.txt' } },
            categories: { default: { appenders: ['cheese'], level: 'error' } }
        });
        this.mLogger = Log4js.getLogger('cheese');
        this.mLogger.level = 'debug';
    }
    resolvePath(...pathparams: string[]) {
        return Path.resolve(__dirname, '../', ...pathparams)
    }
    parseXMLAsync(xml: Xml2js.convertableToString) {
        return new Promise(function (resolve, reject) {
            Xml2js.parseString(xml, {
                trim: true,
                explicitArray: false
            }, function (err, content) {
                if (err) {
                    reject(err);
                }
                resolve(content);
            });
        })
    }
    formatMessage(result: any) {
        let message: any = {}
        if (typeof result === 'object') {
            let keys = Object.keys(result)
            for (let i = 0, length = keys.length; i < length; i++) {
                let item = result[keys[i]]
                for (let key in item) {
                    message[key] = item[key]
                }

                // if (item instanceof Array || item.length === 0) {
                //     continue
                // }
                // if (item.length === 1) {
                //     let val = item[0]
                //     if (typeof val === 'object') {
                //         message[key] = this.formatMessage(val)
                //     } else {
                //         message[key] === (val || '').trim()
                //     }
                // } else {
                //     message[key] = []
                //     for (let i = 0, length = item.length; i < length; ++i) {
                //         message[key].push(this.formatMessage(item[j]))
                //     }
                // }
            }
        }
        return message
    }
    trace(message: any, ...args: any[]) {
        this.mLogger.trace(message, ...args)
    }

    debug(message: any, ...args: any[]) {
        this.mLogger.debug(message, ...args)
    }

    info(message: any, ...args: any[]) {
        this.mLogger.info(message, ...args)
    }

    warn(message: any, ...args: any[]) {
        this.mLogger.warn(message, ...args)
    }

    error(message: any, ...args: any[]) {
        this.mLogger.error(message, ...args)
    }

    fatal(message: any, ...args: any[]) {
        this.mLogger.fatal(message, ...args)
    }
}
export default new Util()