'use strict'
const Koa = require('koa')
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const fs = require('fs');
const g = require('./wechar/g')
const path = require('path')
const wechat_file = path.join(__dirname, 'config', 'wechat.json')
const config = {
    wechat: {
        appID: `wxacfacecf7137bad9`,
        appSecret: `418cb22c07ab143e51ff55229a987ca1`,
        token: `123456`,
        getAccessToken() {
            return new Promise((resolve, reject) => {
                fs.readFile(wechat_file, (err, data) => {
                    if (err) {
                        reject()
                    } else {
                        resolve(data)
                    }
                })
            })
        },
        saveAccessToken(data) {
            return new Promise((resolve, reject) => {
                fs.writeFile(wechat_file, JSON.stringify(data), (err) => {
                    if (err) {
                        return reject()
                    } else {
                        resolve()
                    }
                })
            })
        }
    }
}
const app = new Koa()
const router = new Router()
app.use(bodyParser());
app.use(g(config))
app.use(router.routes()); // 将路由与实例挂钩
app.use(router.allowedMethods());




app.listen(80)
console.log('listening:80')