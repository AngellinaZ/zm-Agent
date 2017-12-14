// 导入模块
import Login from '../page/login/login'
import Reg from '../page/login/reg'
import Pwd from '../page/login/pwd'

//路由配置 -- 路由嵌套
export default [
    {
        path: '/',
        name: 'login',
        component: Login
        // children: [     // 子路由
        //     {    
        //         path: 'pwd',
        //         name: 'pwd',
        //         component: Pwd,
        //         // component: r => require.ensure([], () => r(require('../page/login')), 'login')
        //     },
        //     {    
        //         path: 'reg',
        //         name: 'reg',
        //         component: Reg,
        //         // component: r => require.ensure([], () => r(require('../page/login')), 'login')
        //     }
        // ]
    },
    {
        path: '/pwd',
        name: 'pwd',
        component: Pwd
    },{
        path: '/reg',
        name: 'reg',
        component: Reg
    }
]
