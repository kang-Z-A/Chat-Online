import { createRouter,createWebHashHistory} from "vue-router";

const login=()=>import("@/components/Login/Login.vue")
const chat=()=>import("@/components/Chat/index.vue")

const routes=[
    {
        path:"/login",
        name:"login",
        component:login
    },
    {
        path:"/chat",
        name:"chat",
        component:chat
    },
    {
        path:'/',
        redirect:'login'
    }
]
export default createRouter({
    history:createWebHashHistory(),
    routes:routes
})