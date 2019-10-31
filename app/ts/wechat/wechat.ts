import Axios from "axios"
import Fs from 'fs'
import Util from './../Util'
import tpl from './tpl'
const wechat_dynamic_info: string = Util.resolvePath('config', 'token.json')
const wechat_static_info: string = Util.resolvePath('config', 'account.json')
const static_info = JSON.parse(Fs.readFileSync(wechat_static_info).toString())
const prefix = `https://api.weixin.qq.com/cgi-bin/`
const api = {
    accessToken: `${prefix}token?grant_type=client_credential`,
}
export default class Wechat {
    mAppID: string = ''
    mAppSecret: string = ''
    mAccessToken: string = ''
    mExpiresIn: string = ''
    mToken: string = ''
    constructor() {
        this.mAppID = static_info["appID"]
        this.mAppSecret = static_info["appSecret"]
        this.mToken = static_info['token']
        this.getAccessToken().then((data: Buffer | any) => {
            try {
                data = JSON.parse(data.toString())
            } catch{
                return this.updateAccessToke()
            }
            if (this.isValidAccessToken(data)) {
                return Promise.resolve(data)
            } else {
                return this.updateAccessToke()
            }
        }).then((data: any) => {
            this.mAccessToken = data['access_token']
            this.mExpiresIn = data['expires_in']
            this.saveAccessToken(data)
        })
    }
    getAccessToken() {
        return new Promise((resolve, reject) => {
            Fs.readFile(wechat_dynamic_info, (err: NodeJS.ErrnoException | null, data: Buffer) => {
                if (err) {
                    return reject()
                } else {
                    resolve(data)
                }
            })
        })
    }
    saveAccessToken(data: Object) {
        return new Promise((resolve, reject) => {
            Fs.writeFile(wechat_dynamic_info, JSON.stringify(data), (err) => {
                if (err) {
                    return reject()
                } else {
                    resolve()
                }
            })
        })
    }
    isValidAccessToken(data: any) {
        if (!data || !data.access_token || !data.expires_in) {
            return false
        }
        const expires_in = data.expires_in
        const now = new Date().getTime()
        if (now < expires_in) {
            return true
        } else {
            return false
        }
    }
    updateAccessToke() {
        const appID = this.mAppID
        const appSecret = this.mAppSecret
        const url = `${api.accessToken}&appid=${appID}&secret=${appSecret}`
        return new Promise((resolve, reject) => {
            Axios.get(url).then((responst) => {
                const data = responst.data
                const now = new Date().getTime()
                const expires_in = now + (data.expires_in - 20) * 1000 //提前20 秒刷新
                data.expires_in = expires_in
                resolve(data)
            })
        })
    }
}