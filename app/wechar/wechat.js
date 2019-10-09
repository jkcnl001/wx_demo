'use strict'
const sha1 = require("sha1")
const axios = require ("axios")
const prefix = `https://api.weixin.qq.com/cgi-bin/`
const api = {
    accessToken :`${prefix}token?grant_type=client_credential`,
}
class Wechat{
    constructor(opts){
            this.appID= opts.wechat.appID
            this.appSecret = opts.wechat.appSecret
            this.getAccessToken = opts.wechat.getAccessToken
            this.saveAccessToken = opts.wechat.saveAccessToken
            this.getAccessToken().then((data)=>{
                try{
                    data = JSON.parse(data)
                }catch{
                    return this.updateAccessToke(data)
                }
                if(this.isValidAccessToken(data)){
                   return Promise.resolve(data)
                }else{
                    return this.updateAccessToke(data)
                }
            }).then((data)=>{
                this.access_token = data.access_token
                this.expires_in = data.expires_in
                this.saveAccessToken(data)
            })
    }
    isValidAccessToken(data){
        if(!data||!data.access_token || !data.expires_in){
            return false
        }
        const access_token  = data.access_token
        const expires_in = data.expires_in 
        const now = new Date().getTime()
        if(now < expires_in){
            return true
        }else{
            return false
        }

    }
    updateAccessToke(){
        const appID = this.appID
        const appSecret = this.appSecret
        const url = `${api.accessToken}&appid=${appID}&secret=${appSecret}`
        return new Promise((resolve,reject)=>{
            axios.get(url).then((responst)=>{
                const data = responst.data
                const now = new Date().getTime()
                const expires_in = now + (data.expires_in-20)*1000 //提前20 秒刷新
                data.expires_in = expires_in
                resolve(data)
            })
        })
    }
}
module.exports = Wechat