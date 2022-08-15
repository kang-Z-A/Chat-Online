<script setup lang='ts'>
import { reactive,ref,toRefs, watch } from 'vue';
import {login} from "@/api/api"

const name=ref('')

const Login = () => {
    login(name.value).then((response) => { 
        console.log(response)
     })
    name.value = ''
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