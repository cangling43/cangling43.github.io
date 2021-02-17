<template>
    <div class="content-bg">
        <div class="tab-title" >
            <div class="tabTitle-item" v-for="(item,index) in menu" :key="index" :class="activeName==item.name?'active':''" @click="goRouter(item.path,item.name)">{{item.title}}</div>

        </div>

        <div class="tab-item">
            <router-view/>
        </div>
    </div>
</template>

<script>
import "../../../assets/less/my_tab.less"

export default {
    name:"MyMessage",
    data() {
        return {
            activeName: 'Inboxes',

            menu:[
                {title:"收信箱",path:"/main/myMessage/inboxes",name:"Inboxes"},
                {title:"发送消息",path:"/main/myMessage/sendMessage",name:"SendMessage"}
            ]
        };
    },
    created(){
        this.activeName=this.$route.name

    },
    methods: {
        //路由跳转
        goRouter(path,name){
            if(this.activeName==name){
                return
            }
            this.activeName=name
            this.$router.push(path)
        },
    }
}
</script>
