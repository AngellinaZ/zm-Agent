//定义常量
const login = r => require.ensure([], () => r(require('../page/login/login')), 'login')
const pwd = r => require.ensure([], () => r(require('../page/pwd/pwd')), 'pwd')
const rest = r => require.ensure([], () => r(require('../page/pwd/children/rest')), 'rest')
const reg = r => require.ensure([], () => r(require('../page/reg/reg')), 'reg')
const regProtocol = r => require.ensure([], () => r(require('../page/reg/children/regProtocol')), 'regProtocol')

const product = r => require.ensure([], () => r(require('../page/product/product')), 'product')
const introduce = r => require.ensure([], () => r(require('../page/product/children/introduce')), 'introduce')
const apply = r => require.ensure([], () => r(require('../page/product/children/apply')), 'apply')
const applySuccess = r => require.ensure([], () => r(require('../page/product/children/applySuccess')), 'applySuccess')

const count = r => require.ensure([], () => r(require('../page/count/count')), 'count')
const totalIncomplete = r => require.ensure([], () => r(require('../page/count/children/totalIncomplete')), 'totalIncomplete')
const totalMortgage = r => require.ensure([], () => r(require('../page/count/children/totalMortgage')), 'totalMortgage')

const orderList = r => require.ensure([], () => r(require('../page/orders/orderList')), 'orderList')


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
    },
    //产品
    {
        path: '/product',
        name: 'product',
        component: product,
        children: [
            //产品介绍
            {
                path: 'introduce',
                name: 'introduce',
                component: introduce
            },
            //申请
            {
                path: 'apply',
                name: 'apply',
                component: apply
            },
            //申请成功
            {
                path: 'applySuccess',
                name: 'applySuccess',
                component: applySuccess
            }
        ]
    },
    //统计
    {
        path: '/count',
        name: 'count',
        component: count,
        children: [
            //资料未齐全
            {
                path: 'totalMortgage',
                name: 'totalMortgage',
                component: totalMortgage
            },
            //抵押未完成
            {
                path: 'totalMortgage',
                name: 'totalMortgage',
                component: totalMortgage
            }
        ]
    },
    //订单
    {
        path: '/orderList',
        name: 'orderList',
        component: orderList
    }
]
