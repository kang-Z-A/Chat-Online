<script setup lang="ts">
import Login from './components/Login/Login.vue'
import Chat from './components/Chat/index.vue'
import { onMounted } from 'vue';
import { io, Socket } from 'socket.io-client';
import { computed,reactive, toRef, toRefs } from '@vue/reactivity';

import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

let socket: Socket
//构造响应式参数visiter
const data = reactive({
  visiter: true,
  success:false,
  userName:'',
  List: [] as string[],
  msgList:[] as string[],
})
//socket建立连接，后续可以优化，在得到用户名后再请求连接服务器(有待考虑)
onMounted(() => {
  socket = io('http://127.0.0.1:3000')
  socket.on('connection', (msg: string) => { console.log(socket.id, msg) })
  socket.on('nameEmpty',() => { nameEmpty() })
  socket.on('nameSuccess',() => { data.success=true })
  socket.on('nameError',() => { nameRepeat() })
  socket.on("getUsersName", (list: string[]) => { data.List = [...list] })
  socket.on('广播', (msg: string,name:string) => { data.msgList.push('[ '+name+' ] : '+msg) 
    })
  socket.on('私聊',(msg: string,name: string) => { data.msgList.push('[ 私聊 ( '+name+' ) ] : '+msg) })
})
//得到用户名并传给服务器
const getUser = (val: string) => {
  data.userName = val
  socket.emit("getName", data.userName)//上传name
}

const changeVisiter = (val: boolean) => { data.visiter = val }

//接受聊天对象与信息
const getMsg = (msg: string, val: string) => {
  if (val === '所有人'){
    data.msgList.push('[ 我 ] : '+msg)
    socket.emit('请求广播', msg)
  }   
  else{
    data.msgList.push('[ 私聊 ('+val+' ) ] : '+msg)
    socket.emit('请求私聊', msg, val)
  }
}

//将后端传来的初始选项列表加工，删掉自己的选项返回最终的选项列表
const selectList=computed(():string[] => { 
  let i:number,index:number=-1
  for(i=0;i<data.List.length;i++){
    if(data.List[i]===data.userName){
      index=i
      break
    }
  }
  if(index>-1){
    console.log(index)
    data.List.splice(index,1)
    console.log(data.List)
  }
  return data.List
 })

 const nameRepeat=() => {
  ElMessageBox.alert('该姓名已存在', '操作失败', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: '确认',
    // callback: (action: Action) => {
    //   ElMessage({
    //     type: 'info',
    //     message: `请重新输入昵称`,
    //   })
    // },
  })
}

const nameEmpty=() => {
  ElMessageBox.alert('昵称不能为空', '错误', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: '确认',
    // callback: (action: Action) => {
    //   ElMessage({
    //     type: 'info',
    //     message: `请重新输入昵称`,
    //   })
    // },
  })
}

</script>

<template>
  <Login v-if=data.visiter @getUser="getUser" @change-visiter="changeVisiter" :loginSuc="data.success"></Login>
  <Chat :selected="data.visiter" :nameList="selectList" @post-msg="getMsg" :msg-list="data.msgList"></Chat>
</template>

<style scope>
</style>