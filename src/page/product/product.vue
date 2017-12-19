<template>
    <div class='reg'>
        <head-top head-title='产品' go-back='true'></head-top>
        <section class="banner" @click="goto('../operationGuide/list.html')">
            <img :src="src" />
        </section>
        <div class="product-item">
            <ul>
                <li>
                    <img src="../../../static/images/icon/icon-11.png" />
                    <span>我的客户</span>
                </li>
                <li>
                    <img src="../../../static/images/icon/icon-9.png" />
                    <span>待办事项</span>
                </li>
                <li>
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
                        <span>产品介绍</span>
                        <span>立即申请</span>
                    </div>
                </li>
            </ul>
        </div>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view> 
        </transition>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast } from 'mint-ui'
    import { mobileValidate, pwdValidate } from '@/js/common'
    export default {
        name: 'reg',
        data() {
            return {
                src: "../../../static/images/test/pic-1.jpg",
                msgNum: "",
                rows: [],
                deptId: "",
                productTypeId: "",
                merchantId: "",
                bankId: "",
                carPrice: "",
                firstPay: "",
                loan: 10,  //贷款额
                isNewMsg: '',   //是否有新消息
            }
        },
        components: {
            'head-top': headTop
        },
        methods: {
            goto: function (url, name) {
                if (name == 'msg') {
                    mySetLocalStorage('toDoList', '/tpl/product/list.html');
                    myOpenWindow(url, "");
                } else {
                    myOpenWindow(url, "");
                }
            },
            tabFooter:function (item) {
                myOpenWindow(item.href, "");
            },
            toApply: function (url) {
                var user = JSON.parse(myGetLocalStorage("user"));
                if (user) {
                    var idCard = user.idCard,
                        authorityId = (user.authorityId).toString(),
                        status = user.status;

                    if (status == '1') {
                        //账户是业务员或内勤
                        if (authorityId.indexOf(2) >= 0 || authorityId.indexOf(3) >= 0) {
                            if (idCard) {
                                mySetLocalStorage("draftAddress","/tpl/product/list.html");
                                myOpenWindow(url, "");
                            } else {
                                var btnArr = ['取消', '去认证'];
                                mui.confirm('您还未实名认证，请先进行实名认证！','', btnArr, function(e) {
                                    if (e.index == 1) {
                                        myOpenWindow("/tpl/user-info/certigy.html", "");
                                    }
                                })
                            }
                        } else {
                            mui.toast("抱歉，您没有权限");
                        }
                    } else {
                        mui.toast("抱歉，您没有权限");
                    }
                }
            },
            getMessageCount: function() {
                var _this = this;
                var params = [0];
                this.$http({
                    method: 'post',
                     url: this.HOST + '/message/user/getMessageCount.htm',
                    params: {
                        sourceTypeId: params[0]
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        _this.msgNum = datas.num;
                    } else {
                        if (datas.code == '405') {
                            againLogin(product.getMessageCount, params);
                        } else {
                            mui.toast(datas.resultMsg);
                        }
                    }
                }).catch(function (error) {
                    mui.toast(error);
                })
            }
        },
        created(){
            this.getMessageCount();
        }
    }
</script>