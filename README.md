# 简介

> A Vue.js project 单页面应用程序

## Build Setup

``` bash
# 克隆到本地
git clone git@github.com:AngellinaZ/zm-Agent.git

# 初始化
npm install

# 打开 localhost:8080
npm run dev

# 发布
npm run build
```

## 路由配置
[路由]()
```
export default [  //顶层路由,对应app.vue
    //登录
    {
        path: '/login',
        name: 'login',
        component: login
    },
    //忘记密码
    {
        path: '/pwd',   
        name: 'pwd',
        component: pwd,
        children: [
            //重置密码
            {
                path: 'rest',   
                name: 'rest', 
                component: rest
            },
        ]
    }
]
```
## vue挂载


