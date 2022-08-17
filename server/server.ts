import koa from 'koa'
import koaBody from 'koa-body'
import http from 'http'
import { Server } from 'socket.io'
import session from 'koa-session'
// import Router from '@koa/router'
// import path from 'path'
// import fs from 'fs'
import Users from './user.js'
import { Socket } from 'socket.io-client'
const UserAll = new Users()

const app = new koa()
const server = http.createServer(app.callback()).listen(3000, () => { console.log("listening on port:3000") })
let sessionId: string

app.keys = ['mySecret']
app.use(session(app))

// const router = new Router()

// const __dirname=path.resolve()
// router.get('/',(ctx, next) => {
//     ctx.type = 'html';
//     ctx.body = fs.createReadStream('index.html');
// });

// router
//     .post('/login', async (ctx: Router.RouterContext) => {
//         await ctx.session!.save();
//         console.log(ctx.session)
//         if (ctx.session!.isNew) {
//             let name: string = ctx.request.body.name
//             if (name === '') {
//                 ctx.response.status = 204
//             } else if (UserAll.findInusers(name) === -1) {
//                 ctx.response.status = 200
//                 ctx.session!.name = ctx.request.body.name
//                 // ctx.session.manuallyCommit()
//             } else ctx.response.status = 416
//         } else ctx.response.status = 226
//     })
//     .get('/chat', async (ctx: Router.RouterContext) => {
//         await ctx.session!.save();
//         if (!ctx.session!.isNew) {
//             let sessionId: string | undefined = ctx.cookies.get('koa.sess')
//             console.log("sessionId: ", sessionId)
//             let userName = ctx.session!.name
//             console.log(userName)
//             if (sessionId && userName) {
//                 UserAll.addUser(userName, sessionId)
//             }
//             ctx.response.status = 200
//         } else ctx.response.status = 226
//     })
//     .get('/ask', async (ctx: Router.RouterContext) => {
//         await ctx.session!.save();
//         if (ctx.session!.isNew) ctx.response.status === 200
//         else ctx.response.status === 226
//     })
//     .get('disconnect', async (ctx: Router.RouterContext) => {
//         ctx.cookies.set('koa.sess', '', { signed: false, maxAge: 0 })
//         ctx.cookies.set('koa.sess.sig', '', { signed: false, maxAge: 0 })
//     })
// app.use(router.routes())
// app.use(router.allowedMethods())

const main = (async (ctx: koa.Context) => {
    await ctx.session!.save();
    //通过不同的状态码告知客户端昵称是否合理
    if (ctx.request.url === '/login' && ctx.request.method === 'POST') {
        if (!ctx.session!.name) {
            let name: string = ctx.request.body.name
            if (name === '') {
                ctx.response.status = 204
            } else if (UserAll.findInusers(name) === -1) {
                ctx.response.status = 200
                ctx.session!.name = ctx.request.body.name
                // ctx.session.manuallyCommit()
            } else ctx.response.status = 416
        } else ctx.response.status = 226
    } else if (ctx.request.url === '/ask' && ctx.request.method === 'GET') {
        if (ctx.session!.name) ctx.response.status = 200
        else ctx.response.status = 226
    } else if (ctx.request.url === '/chat' && ctx.request.method === 'GET') {
        if (ctx.session!.name) {
            let sessionId: string | undefined = ctx.cookies.get('koa.sess')
            // console.log("sessionId: ", sessionId)
            let userName = ctx.session!.name
            // console.log('sessionName: ', userName)
            if (sessionId && userName) {
                UserAll.addUser(userName, sessionId)
            }
            ctx.response.append('sessionId',sessionId as string)
            ctx.response.status = 200
        } else {
            ctx.response.status = 226
        }
    } else if (ctx.request.url === '/disconnect' && ctx.request.method === 'GET') {
        ctx.cookies.set('koa.sess', '', { signed: false, maxAge: 0 })
        ctx.cookies.set('koa.sess.sig', '', { signed: false, maxAge: 0 })
        ctx.response.status = 200
    }
})

app.use(koaBody())
app.use(main)


const io = new Server(server, {
    cors: {
        origin: '*', // from the screenshot you provided
        methods: ['GET', 'POST'],
    }
})

io.on('connection', (socket) => {
    // console.log(socket)
    sessionId = socket.handshake.query['session_id'] as string
    // console.log('sessionId', sessionId)
    //前端其实已经处理了
    if (sessionId) {
        UserAll.setusersocket(sessionId, socket)
    }
    let userList = UserAll.otherusers(sessionId)
    socket.emit('getUserList', userList)


    let userName: string = UserAll.findUser(sessionId as string)!.name
    console.log('客户端已连接')

    //广播,将广播信息和广播发起者发给客户端
    socket.on('请求广播', (msg: string) => { socket.broadcast.emit('广播', msg, userName) })
    //私聊，将信息和发送方name发给对方
    socket.on('请求私聊', (msg: string, val: string) => {
        let toUser = UserAll.findUser(val)
        if (toUser) {
            let tosocket = toUser.socket as Socket
            tosocket.emit('私聊', msg, userName)
        }
    })
    //客户端离线后删除列表用户
    socket.on('disconnect', () => {
        UserAll.delUser(sessionId as string)

    })
})