// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'  // 路由
import App from './App'              // 入口页面
import './style/common.less'

// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(VueRouter)

// 1. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
    routes
}) 

// 2.创建和挂载根实例 注意：id = 'app'的根页面是哪一个, 选择哪个页面作为根实例
new Vue({
    router,
    template: '<App/>',
    components: { App }
}).$mount('#app')
