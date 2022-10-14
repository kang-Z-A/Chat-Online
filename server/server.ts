import koa from 'koa'
import koaBody from 'koa-body'
import http from 'http'
import { Server } from 'socket.io'
import session from 'koa-session'
import Users from './user.js'
import { Socket } from 'socket.io-client'
const UserAll = new Users()

const app = new koa()
const server = http.createServer(app.callback()).listen(3000, () => { console.log("listening on port:3000") })

const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: false, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.keys = ['mySecret']
app.use(session(CONFIG,app))

const main = (async (ctx: koa.Context) => {
    await ctx.session!.save();
    //通过不同的状态码告知客户端昵称是否合理
    if (ctx.request.url === '/login' && ctx.request.method === 'POST') {
        let name: string = ctx.request.body.name
        if (name === '') {
            ctx.response.status = 204
        } else if (UserAll.findInusers(name) === -1) {
            ctx.response.status = 200
            ctx.session!.name = ctx.request.body.name
        } else ctx.response.status = 416 //已经有此昵称了
    } else if (ctx.request.url === '/chat' && ctx.request.method === 'GET') {
        if (ctx.session!.name) {
            let sessionId: string= ctx.cookies.get('koa:sess') as string
            // console.log("sessionId: ", sessionId)
            let userName = ctx.session!.name
            // console.log('sessionName: ', userName)
            if (UserAll.findInusers(sessionId) == -1 && sessionId && userName) {
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
        origin: '*', 
        methods: ['GET', 'POST'],
    },
    cookie:{
        name: "my-cookie",
        httpOnly:false,
    }
})
setTimeout(() => {
    io.on('connection', (socket) => {
        // console.log(socket)
        // console.log(JSON.stringify(socket.request.headers.cookie))
        let sessionId = getSessionId(socket.handshake.query.cookies as string, 'koa:sess') as string;
        UserAll.setusersocket(sessionId, socket);
         
        function getSessionId(cookieString:string, cookieName:string) {
            var matches = new RegExp(cookieName + '=([^;]+);', 'gmi').exec(cookieString);
            if(matches)
                return matches[1] ? matches[1] : null;
        }
    
        let userList = UserAll.getUsers()
        socket.emit('getUserList', userList)
        socket.broadcast.emit('getUserList', userList)
    
        // console.log('UserAll',JSON.stringify(UserAll))
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
            let userList = UserAll.getUsers()
            socket.emit('getUserList', userList)
            socket.broadcast.emit('getUserList', userList)
        })
    })
}, 1000);
