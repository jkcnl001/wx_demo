import Koa from 'koa';
import Bodyparser from 'koa-bodyparser';
import Router from 'koa-router'
import Logger from "koa-logger";
import G from './wechat/g'
import Moment from "moment";
const app = new Koa()
const router = new Router()
app.use(Logger((str) => { console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str) }))
app.use(Bodyparser());
app.use(G())
app.use(router.routes()); // 将路由与实例挂钩
app.use(router.allowedMethods());
console.log(__dirname)
app.listen(8080)
console.log('listening:8080')