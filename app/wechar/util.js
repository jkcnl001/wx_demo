'use strict'
const fs = require('fs');
const xml2js = require('xml2js');
class Util {
    constructor() {
    }
    parseXMLAsync(xml) {
        return new Promise(function (resolve, reject) {
            xml2js.parseString(xml, {
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
    formatMessage(result) {
        let message = {}
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
}
module.exports = new Util()