<script setup lang='ts'>
import { reactive } from 'vue';
import { User } from '../../pageJs/index'
const data = reactive(new User())
const emit=defineEmits<{
    (e:'getUser',value:string):void
    (e:'changeVisiter',value:boolean):void
}>()

const Login = () => {
    emit('getUser',data.name)
    data.name = ''
    emit('changeVisiter',false)
}


</script>

<template>
    <div>
        <div class="body">
            <div class="input-box">
                <label>请选择一个昵称</label>
                <input type="text" v-model="data.name">
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