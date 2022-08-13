<script setup lang='ts'>
import { reactive,ref,toRefs, watch } from 'vue';
const name=ref('')
const props=defineProps({
    loginSuc:Boolean
})
const {loginSuc}=toRefs(props)

const emit=defineEmits<{
    (e:'getUser',value:string):void
    (e:'changeVisiter',value:boolean):void
}>()

const Login = () => {
    emit('getUser',name.value)
    name.value = ''
}
watch(loginSuc,(val) => {
    if(val)
        emit('changeVisiter',false)
})

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