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

const msg = r => require.ensure([], () => r(require('../page/msg/msgClassify')), 'msg')
const toDoList = r => require.ensure([], () => r(require('../page/msg/children/toDoList')), 'toDoList')
const noticeMsg = r => require.ensure([], () => r(require('../page/msg/children/noticeMsg')), 'noticeMsg')
const sysNotice = r => require.ensure([], () => r(require('../page/msg/children/sysNotice')), 'sysNotice')
const monthlyOver = r => require.ensure([], () => r(require('../page/msg/children/monthlyOver')), 'monthlyOver')

const service = r => require.ensure([], () => r(require('../page/service/service')), 'service')
const operationGuide = r => require.ensure([], () => r(require('../page/service/children/operationGuide')), 'operationGuide')
const operationGuideDetail = r => require.ensure([], () => r(require('../page/service/children/operationGuideDetail')), 'operationGuideDetail')
const bill = r => require.ensure([], () => r(require('../page/service/children/bill')), 'bill')
const bankCard = r => require.ensure([], () => r(require('../page/service/children/bankCard')), 'bankCard')
const bankCardInfo = r => require.ensure([], () => r(require('../page/service/children/bankCardInfo')), 'bankCardInfo')
const activeUser = r => require.ensure([], () => r(require('../page/service/children/activeUser')), 'activeUser')
const my = r => require.ensure([], () => r(require('../page/service/children/my')), 'my')
const zmInfo = r => require.ensure([], () => r(require('../page/service/children/zmInfo')), 'zmInfo')



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
                path: 'totalIncomplete',
                name: 'totalIncomplete',
                component: totalIncomplete
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
    },
    //消息
    {
        path: '/msg',
        name: 'msg',
        component: msg,
        children: [
            //待办事项
            {
                path: 'toDoList',
                name: 'toDoList',
                component: toDoList
            },
            //通知消息
            {
                path: 'noticeMsg',
                name: 'noticeMsg',
                component: noticeMsg,
                children: [
                    //月成交单
                    {
                        path: 'monthlyOver',
                        name: 'monthlyOver',
                        component: monthlyOver
                    }
                ]
            },
            //系统公告
            {
                path: 'sysNotice',
                name: 'sysNotice',
                component: sysNotice
            }
        ]
    },
    //服务
    {
        path: '/service',
        name: 'service',
        component: service,
        children: [
            //操作指导
            {
                path: 'operationGuide',
                name: 'operationGuide',
                component: operationGuide,
                children: [
                    //详细
                    {
                        path: 'operationGuideDetail',
                        name: 'operationGuideDetail',
                        component: operationGuideDetail
                    }
                ]
            },
            //账单
            {
                path: 'bill',
                name: 'bill',
                component: bill
            },
            //银行卡
            {
                path: 'bankCard',
                name: 'bankCard',
                component: bankCard,
                children: [
                    {
                        path: 'bankCardInfo',
                        name: 'bankCardInfo',
                        component: bankCardInfo
                    }
                ]
            },
            //激活用户 
            {
                path: 'activeUser',
                name: 'activeUser',
                component: activeUser
            },
            //我的
            {
                path: 'my',
                name: 'my',
                component: my,
                children: [
                    //关于中茗
                    {
                        path: 'zmInfo',
                        name: 'zmInfo',
                        component: zmInfo
                    }
                ]
            }
        ]
    }
]
