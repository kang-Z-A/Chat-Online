<script setup lang='ts'>
import { nextTick, onMounted, onUpdated, reactive, Ref, toRefs, VNodeRef } from 'vue';

import { ref } from 'vue'

const value = ref('所有人')       //选择的聊天对象

const messages=ref<HTMLUListElement>()

// const options = [
//   {
//     value: 'Option1',
//     label: '所有人',
//   },
//   {
//     value: 'Option2',
//     label: 'Option2',
//   },
//   {
//     value: 'Option3',
//     label: 'Option3',
//   },
//   {
//     value: 'Option4',
//     label: 'Option4',
//   },
//   {
//     value: 'Option5',
//     label: 'Option5',
//   },
// ]

onUpdated(() => {
    nextTick(() => { 
        // console.log(messages)
        if(messages.value)
            messages.value.scrollTop=messages.value?.scrollHeight-messages.value?.offsetHeight
    })
})

const props=defineProps({
    selected:Boolean,
    nameList:Array<string>,
    msgList:Array<string>,
})

const emit=defineEmits<{
    (e:'postMsg',msg:string,value:string):void
}>()

const data = reactive({
    txtMsg: ''  //输入框信息
})

const {selected,nameList}=toRefs(props)


const postMsg=()=>{
    emit('postMsg',data.txtMsg,value.value)
    data.txtMsg=''
}

</script>

<template>
    <div class="box">
        <div class="body">
            <ul id="messages" ref="messages">
                <li v-for="(msg,index) in msgList" :key="index">
                    <div class="bubble">
                        {{msg}}
                    </div>
                </li>
            </ul>
            <div class="contain">
                <el-select v-model="value" class="m-2" placeholder="Select" :teleported=false :disabled=selected>
                    <el-option label="所有人" value="所有人" />
                    <el-option v-for="(item,index) in nameList" :key="index" :label="item" :value="item" />
                </el-select>
                <input type="text" v-model="data.txtMsg" @keyup.enter="postMsg">
                <button @click="postMsg">发送</button>
            </div>
        </div>
    </div>

</template>

<style scoped lang="stylus">
@import './index.styl'
</style>