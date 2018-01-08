<template>
    <div class='setPwd reg childPage' v-cloak>
        <head-top head-title='设置交易密码' :go-back='true'></head-top>
        <div class="module con">
            <input class="input" type="tel" maxlength="18" placeholder="请输入您的身份证号" v-model="IDcard">
            <button class="getCode" @click="countDown(message)" :disabled="message != '获取验证码'">{{ message }}</button>
            <input class="input" type="tel" maxlength="11" placeholder="请输入手机号" v-model="mobile" :disabled="mobile">
            <input class="input" type="tel" placeholder="请输入短信验证码" v-model="checkcode">
        </div>
        <div class="module module-btn">
            <button class="btn" @click="validate">下一步</button>
        </div>
        <transition name='router-slid' mode='out-in'>
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast } from 'mint-ui'
    import { identification, mobileValidate } from '@/js/common'
    export default {
        name: 'setPwd',
        data() {
            return {
                IDcard: "",
                mobile: "",
                checkcode: "",
                message: "获取验证码"
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            init () {
                this.mobile = JSON.parse(localStorage.getItem("user")).mobile;
            },
            validate () {
                if (!this.IDcard) {
                    Toast("请输入您的身份证号");
                } else if (!identification(this.IDcard)) {
                    Toast("身份证格式错误");
                } else if (!this.checkcode) {
                    Toast("请输入短信验证码");
                } else {
                    var that = this;
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/user/setpaypwd.htm',
                        params: {
                            step: 1,
                            IDcard: that.IDcard,
                            checkcode: that.checkcode
                        }
                    }).then(function (response) {
                        var data = response.data;
                        if (data.success) {
                            that.$router.push({path: "setTraderPwd/setTraderPwd1"});
                        } else {
                            Toast(data.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    })
                }
            },
            countDown (message) {
                if (!this.mobile) {
                    Toast("请输入手机号码");
                } else if (!mobileValidate(this.mobile)) {
                    Toast("手机号格式错误");
                } else {
                    var that = this;
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/user/paycode.htm',
                        params: {
                            type: 2
                        }
                    }).then(function (response) {
                        var data = response.data;
                        if (data.success) {
                            var time = 60, //设置倒数时间
                                i = 1,
                                start = setInterval(function() {
                                    var countDownTime = time - i;
                                    if (i > time - 1) {
                                        i = 1;
                                        that.message = "获取验证码";
                                        clearInterval(start);
                                    } else {
                                        that.message = countDownTime + "秒后重发";
                                        i++;
                                    }
                                }, 1000);
                        } else {
                            Toast(data.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    });
                }
            }
        },
        created () {
            this.$nextTick(() => {
                this.init();
            })
        }
    }
</script>

