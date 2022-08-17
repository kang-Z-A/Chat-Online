<script setup lang='ts'>
import { ref, nextTick, onMounted, onUpdated, reactive, toRefs, inject, onBeforeMount, onBeforeUnmount } from 'vue';

import { io, Socket } from 'socket.io-client';
import { useRouter } from 'vue-router';

import { chat, disconnect } from "@/api/api"

interface IUser {
    name: string
    session_id: string
    socket: object | null
}
const router = useRouter()
const value = ref('所有人')       //选择的聊天对象

const messages = ref<HTMLUListElement>()

let socket: Socket
let sessionId: string

//挂载前确认是否已经有sessionId了，没有则转向login页面
onBeforeMount(() => {
    chat().then((res) => {
        if (res.status === 226) {
            router.push({ name: 'login' })
        } else if (res.status === 200) {
            sessionId = res.headers.sessionid
            // console.log(sessionId)
        }
    })
})
//与服务端建立socket连接
onMounted(() => {
    //等待sessionId更新
    setTimeout(() => {
        socket = io('http://127.0.0.1:3000', {
            query: {
                session_id: sessionId
            }
        })
        socket.on('getUserList', (list) => {
            data.userList = [...list]
        })
        socket.on('广播', (msg, username) => { data.msgList.push('[ ' + username + ' ] : ' + msg) })
        socket.on('私聊', (msg, username) => { data.msgList.push('[ 私聊 ( ' + username + ' ) ] : ' + msg) })
    }, 500)
    // socket = io('http://127.0.0.1:3000',{
    //     query:{
    //         session_id:sessionId
    //     }
    // })
    // socket.on('getUserList',(list) => { 
    //     data.userList=[...list]
    // })
    // socket.on('广播',(msg,username) => { data.msgList.push('[ ' + username + ' ] : ' + msg) })
    // socket.on('私聊',(msg,username) => { data.msgList.push('[ 私聊 ( ' + username + ' ) ] : ' + msg) })
})

const data = reactive({
    txtMsg: '', //输入框信息
    msgList: [] as string[],
    userList: [] as IUser[]
})

const { txtMsg, msgList, userList } = toRefs(data)

onUpdated(() => {
    nextTick(() => {
        // console.log(messages)
        if (messages.value)
            messages.value.scrollTop = messages.value?.scrollHeight - messages.value?.offsetHeight
    })
})

onBeforeUnmount(() => {
    disconnect()
})

const postMsg = () => {
    if (value.value === '所有人') {
        socket.emit('请求广播', txtMsg)
    } else {
        socket.emit('请求私聊', txtMsg, value)
    }
}

</script>

<template>
    <div class="box">
        <div class="body">
            <ul id="messages" ref="messages">
                <li v-for="(msg, index) in msgList" :key="index">
                    <div class="bubble">
                        {{ msg }}
                    </div>
                </li>
            </ul>
            <div class="contain">
                <el-select v-model="value" class="m-2" placeholder="Select" :teleported=false>
                    <el-option label="所有人" value="所有人" />
                    <el-option v-for="(item, index) in userList" :key="index" :label="item.name"
                        :value="item.session_id" />
                </el-select>
                <input type="text" v-model="txtMsg" @keyup.enter="postMsg">
                <button @click="postMsg">发送</button>
            </div>
        </div>
    </div>

</template>

<style scoped lang="stylus">
@import './index.styl'
</style>