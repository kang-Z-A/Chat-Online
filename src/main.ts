import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// import VueSocketIO from 'vue-3-socket.io'
// import SocketIO from "socket.io-client";

const app=createApp(App)
app.use(ElementPlus)
// app.use(new VueSocketIO({
//     debug:true,
//     connection:SocketIO('http://127.0.0.1:3000')
// }))
app.mount('#app')