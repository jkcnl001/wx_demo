import Sha1 from "sha1"
import Wechat from './wechat'
import getRawBody from 'raw-body'
import Util from "../Util"

const prefix = `https://api.weixin.qq.com/cgi-bin/`
const api = {
    accessToken: `${prefix}token?grant_type=client_credential`,
}

export default function g() {
    const wechat = new Wechat()
    return async (ctx: any, next: any) => {
        const token = wechat.mToken
        const signature = ctx.query.signature
        const nonce = ctx.query.nonce
        const timestamp = ctx.query.timestamp
        const echostr = ctx.query.echostr
        const str = [token, timestamp, nonce].sort().join('')
        const sha = Sha1(str)
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
                let data: any = await getRawBody(ctx.req, {
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
                            <Content><![CDATA[你好！]]></Content>
                        </xml>
                        `
                    }
                } else if (data.MsgType == 'text') {
                    let now = new Date().getTime()
                    ctx.status = 200
                    ctx.type = 'application/xml'
                    ctx.body = `
                    <xml>
                        <ToUserName><![CDATA[${data.FromUserName}]]></ToUserName>
                        <FromUserName><![CDATA[${data.ToUserName}]]></FromUserName>
                        <CreateTime>${now}</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[你好222！]]></Content>
                    </xml>
                    `
                }
                Util.logger.info(JSON.stringify(data))
            }
        }
    }
}