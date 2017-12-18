//定义常量
const login = r => require.ensure([], () => r(require('../page/login/login')), 'login')
const pwd = r => require.ensure([], () => r(require('../page/pwd/pwd')), 'pwd')
const rest = r => require.ensure([], () => r(require('../page/pwd/children/rest')), 'rest')
const reg = r => require.ensure([], () => r(require('../page/reg/reg')), 'reg')
const regProtocol = r => require.ensure([], () => r(require('../page/reg/children/regProtocol')), 'regProtocol')

//路由配置 -- 路由嵌套
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
    },
    //注册
    {
        path: '/reg',
        name: 'reg',
        component: reg,
        children: [
            //注册协议
            {
                path: 'regProtocol',
                name: 'regProtocol',
                component: regProtocol
            }
        ]
    }
]
