<template>
    <div class='user childPage' v-cloak>
        <head-top head-title='我的' :go-back='true'></head-top>
        <section class="info">
            <img src="/static/images/pic/pic.png" />
            <p> 
                <span v-if="userName == ''">未实名</span>
                <span v-else>{{ userName }} <img src="/static/images/svg/my-1.svg"></span>
                <span>{{ mobile }}</span>
            </p>
        </section>
        <section class="module">
            <ul class="module-list">
                <li v-if="userName == ''" @click="gotoAddress('../user-info/certify.html')">   
                    <span>实名认证</span>
                    <em >未实名<img src="/static/images/svg/next.svg"></em>
                </li>
                <li v-if="userName != ''">  
                    <span>实名认证</span>
                    <em class="certify"><img src="/static/images/svg/my-2.svg">已实名</em>
                </li>
                <li @click="gotoAddress('/pwd')" >
                    <span>修改登录密码</span>
                    <em><img src="/static/images/svg/next.svg"></em>
                </li>
                <li v-if="!payPwd" @click="setPayPsd('my/setTraderPwd')">
                    <span>设置交易密码</span>
                    <em><img src="/static/images/svg/next.svg"></em>
                </li>
                <li v-if="payPwd" @click="gotoAddress('my/fixTraderPwd')"> 
                    <span>修改交易密码</span>
                    <em><img src="/static/images/svg/next.svg"></em>
                </li>
                <li v-if="payPwd" @click="gotoAddress('my/findTraderPwd')">
                    <span>找回交易密码</span> 
                    <em><img src="/static/images/svg/next.svg"></em>
                </li>
                <li @click="gotoAddress('my/zmInfo')">
                    <span>关于中茗</span>
                    <em><img src="/static/images/svg/next.svg"></em>
                </li>
            </ul>
        </section>
        <section class="module last">
            <p @click="sureLgOut">
                退出当前账号
            </p>
        </section>
        <transition name='router-slid' mode='out-in'>
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast, MessageBox } from 'mint-ui'
    export default {
        name: 'my',
        data() {
            return {
                userName: "",
                mobile: "",
                payPwd: ""
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            gotoAddress (path) {
                this.$router.push(path);
            },
            init () {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/userMerchant/user/getUserInfoSum.htm',
                    params: {
                        isChoose: 1
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.userName = datas.data[0].name;
                        that.mobile = datas.data[0].userCode;
                        that.payPwd = datas.data[0].payPwd;
                        that.identityNo = datas.data[0].identityNo;
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            setPayPsd (url) {
                if (!this.identityNo && !this.userName) {
                    MessageBox.confirm('您还未实名认证，请先进行实名认证！').then(action => {
                        this.gotoAddress("/service/certigy");
                    })
                } else {
                    this.gotoAddress(url);
                }
            },
            sureLgOut () {
                var that = this;
                MessageBox.confirm('确认退出？').then(action => {
                    that.$http({
                        method: 'get',
                         url: that.HOST + '/j_spring_security_logout',
                        params: {}
                    }).then(function (response) {
                       if (response.data.code == 405) {
                            localStorage.clear();
                            that.gotoAddress("/login");
                       } else {
                            // Toast(resultMsg);
                       }
                    }).catch(function (error) {
                        Toast(error);
                    });
                }) 
            }
        },
        created () {
            this.$nextTick(function () {
                this.init();
            })
        }
    }
</script>

