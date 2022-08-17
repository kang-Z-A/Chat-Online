<script setup lang='ts'>
import {  onBeforeMount, ref } from 'vue';
import { login,ask } from "@/api/api"
import { useRouter } from 'vue-router';

import { ElMessage, ElMessageBox } from 'element-plus'

const name = ref('')
const router = useRouter()

onBeforeMount(() => { 
    ask().then((res) => { if(res.status===226) router.push({name:'chat'})})
})

const Login = () => {
    login(name.value).then((response) => {
        // console.log(response)
        if (response.status === 200) {
            console.log(router)
            router.push({
                name: "chat",
            })
        }
        else if (response.status === 204) nameEmpty()
        else if (response.status === 416) nameRepeat()
        else if (response.status === 226) router.push({ name: 'chat' })
    })
    name.value = ''
}
//输入昵称为空
const nameEmpty = () => {
    ElMessage('昵称不能为空')
}
//输入昵称已重复
const nameRepeat = () => {
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

</script>

<template>
    <div>
        <div class="body">
            <div class="input-box">
                <label>请选择一个昵称</label>
                <input type="text" v-model="name">
            </div>
            <div class="btn-box">
                <button @click="Login">确定</button>
            </div>
        </div>
        <div class="cover"></div>
    </div>
</template>

<style scoped lang="stylus">
@import './Login.styl' 

</style>