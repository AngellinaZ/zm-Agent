<template>
    <div class='product'>
        <head-top head-title='产品' :go-back='false'></head-top>
        <section class="banner" @click="goto('../operationGuide/list.html')">
            <img :src="src" />
        </section>
        <div class="product-item">
            <ul> 
                <li  @click="gotoAddress('/orderList')">
                    <img src="../../../static/images/icon/icon-11.png" />
                    <span>我的客户</span>
                </li>
                <li  @click="gotoAddress('')">
                    <img src="../../../static/images/icon/icon-9.png" />
                    <span>待办事项</span>
                </li>
                <li  @click="gotoAddress('/count')">
                    <img src="../../../static/images/icon/icon-10.png" />
                    <span>统计</span>
                </li>
            </ul>
        </div>
        <div>
            <ul class="product-list">
                <li>
                    <div>
                        <h3>汽车担保贷</h3>
                        <p>银行合作 安全可靠</p>
                    </div>
                    <div>
                        <span @click="gotoAddress('product/introduce')">产品介绍</span>
                        <span @click="gotoAddress('product/apply?type=1')">立即申请</span>
                    </div>
                </li>
            </ul>
        </div>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view> 
        </transition>
        <vue-foot name='首页'></vue-foot>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import vueFoot from '@/components/footer/foot'
    import { Toast, MessageBox } from 'mint-ui'
    export default {
        name: 'product',
        data() {
            return {
                src: "../../../static/images/test/pic-1.jpg",
                msgNum: '',
                rows: [],
                deptId: '',
                productTypeId: '',
                merchantId: '',
                bankId: '',
                carPrice: '',
                firstPay: '',
                loan: 10,  //贷款额
                isNewMsg: '',   //是否有新消息
            }
        },
        components: {
            'head-top': headTop,
            'vue-foot': vueFoot
        },
        methods: {
            gotoAddress (path) {
                this.$router.push(path);
            },
            toApply (url) {
                var user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                    var idCard = user.idCard,
                        authorityId = (user.authorityId).toString(),
                        status = user.status;

                    if (status == '1') {
                        //账户是业务员或内勤
                        if (authorityId.indexOf(2) >= 0 || authorityId.indexOf(3) >= 0) {
                            if (idCard) {
                                // mySetLocalStorage("draftAddress","/tpl/product/list.html");
                                // myOpenWindow(url, "");
                            } else {
                                let that = this;
                                MessageBox.confirm('您还未实名认证，请先进行实名认证！').then(action => {
                                    that.gotoAddress('/user-info/certigy')
                                })
                                // var btnArr = ['取消', '去认证'];
                            }
                        } else {
                            Toast("抱歉，您没有权限");
                        }
                    } else {
                        Toast("抱歉，您没有权限");
                    }
                }
            }
        }
    }
</script>