import { createRouter,createWebHashHistory} from "vue-router";
import { chat } from "@/api/api"

const routes=[
    {
        path:"/login",
        name:'login',
        component:()=>import("@/components/Login/Login.vue"),
    },
    {
        path:"/chat",
        name:'chat',
        component:()=>import("@/components/Chat/index.vue"),
        beforeEnter: (to: any, from: any, next: any) => {
            if(document.cookie) next()
            else    next({name:'login'})
        }
    },
    {
        path:'/',
        redirect:'login'
    }
]
const router =  createRouter({
    history:createWebHashHistory(),
    routes:routes
})

export default router;