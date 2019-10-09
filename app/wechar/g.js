'use strict'
const sha1 = require("sha1")
const axios = require("axios")
const Wechat = require('./wechat')
const prefix = `https://api.weixin.qq.com/cgi-bin/`
const fs = require('fs')
const getRawBody = require('raw-body')
const Util = require("./util")
const api = {
    accessToken: `${prefix}token?grant_type=client_credential`,
}
module.exports = (config) => {
    const wechat = new Wechat(config)
    return async (ctx, next) => {
        const token = config.wechat.token
        const signature = ctx.query.signature
        const nonce = ctx.query.nonce
        const timestamp = ctx.query.timestamp
        const echostr = ctx.query.echostr
        const str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str)
        if (ctx.method == 'GET') {
            if (sha === signature) {
                ctx.body = echostr + ''
            } else {
                ctx.body = 'wrong'
            }
        } else if (ctx.method == 'POST') {
            if (sha !== signature) {
                ctx.body = 'wrong'
                return false
            } else {
                let data = await getRawBody(ctx.req, {
                    length: ctx.request.headers['content-length'],
                    limit: '1mb',
                    encoding: ctx.request.charset
                })
                data = await Util.parseXMLAsync(data)
                data = Util.formatMessage(data)
                if (data.MsgType === 'event') {
                    if (data.Event === 'subscribe') {
                        let now = new Date().getTime()
                        ctx.status = 200
                        ctx.type = 'application/xml'
                        ctx.body = `
                        <xml>
                            <ToUserName><![CDATA[${data.FromUserName}]]></ToUserName>
                            <FromUserName><![CDATA[${data.ToUserName}]]></FromUserName>
                            <CreateTime>${now}</CreateTime>
                            <MsgType><![CDATA[text]]></MsgType>
                            <Content><![CDATA[童鞋你好！]]></Content>
                        </xml>
                        `
                    }
                }
                fs.writeFile('temp.json', JSON.stringify(data), () => { })
            }
        }
    }
}
