import koa from 'koa'
import http from 'http'
import { Server } from 'socket.io'
import session from 'koa-session'
// import Router from 'koa-router'
// import path from 'path'
// import fs from 'fs'
import Users from './user.js'
import { Socket } from 'socket.io-client'
const UserAll = new Users()

const app = new koa()
const server = http.createServer(app.callback()).listen(3000, () => { console.log("listening on port:3000") })


/* const router=new Router()
const __dirname=path.resolve()
router.get('/',(ctx, next) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('index.html');
});
app.use(router.routes()); */

const main = (async (ctx:koa.Context) => {
    ctx.response.status = 200
    let uri = ctx.request.href
    console.log(uri)
})

// app.use(koaBody())
app.use(main)

app.keys = ['mySecret']
app.use(session(app))

const io = new Server(server, {
    cors: {
        origin: '*', // from the screenshot you provided
        methods: ['GET', 'POST'],
    }
})

function getSessionId(cookieString: string, cookieName: string): string | null {
    let matches: RegExpExecArray | null = new RegExp(cookieName + '=([^;]+);', 'gmi').exec(cookieString);
    return matches ? matches[1] : null;
}

io.on('connection', (socket) => {
    let sessionId = getSessionId(socket.request.headers.cookie as string, 'koa.sess')
    let userName: string
    console.log('客户端已连接')
    socket.emit('connection', "welcome,my friend!")

    //获得客户端传来的name，添加新用户进用户列表UserAll,广播发送用户列表给客户端
    socket.on("getName", (name:string) => {
        if(UserAll.findInusers(name)===-1){
            socket.emit('nameSuccess')
            userName = name
            UserAll.addUser(name, sessionId as string)
            UserAll.setusersocket(name, socket)
            let nameList=UserAll.getUsersName()
            socket.broadcast.emit("getUsersName", nameList)
            socket.emit('getUsersName',nameList)
        }else{
            socket.emit('nameError')
        }
        
    })
    //广播,将广播信息和广播发起者发给客户端
    socket.on('请求广播', (msg:string) => { socket.broadcast.emit('广播', msg,userName) })
    //私聊，将信息和发送方name发给对方
    socket.on('请求私聊', (msg:string, val:string) => {
        let toUser = UserAll.findUser(val)
        if (toUser) {
            let tosocket = toUser.socket as Socket
            tosocket.emit('私聊', msg,userName)
        }
    })
    //客户端离线后删除列表用户
    socket.on('disconnect',() => { UserAll.delUser(userName) })
})