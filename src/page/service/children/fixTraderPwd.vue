<template>
    <div class='setpwd1 reg childPage' v-cloak>
        <head-top head-title='修改交易密码' :go-back='true'></head-top>
        <div class="module con">
            <button class="getCode" @click="countDown(message)" :disabled="message != '获取验证码'">{{ message }}</button>
            <input class="input" type="tel" maxlength="11" placeholder="请输入手机号" v-model="mobile" :disabled="mobile">
            <input class="input" type="tel" placeholder="请输入短信验证码" v-model="checkcode">
        </div>
        <div class="module module-btn">
            <button class="btn" @click="validate()">下一步</button>
        </div>
        <transition name='router-slid' mode='out-in'>
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast } from 'mint-ui'
    import { mobileValidate } from '@/js/common'
    export default {
        name: 'fixpwd',
        data() {
            return {
                mobile: "",
                checkcode: "",
                message: "获取验证码"
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            init:function () {
                this.mobile = JSON.parse(localStorage.getItem("user")).mobile;
            },
            countDown:function (message) {
                if (!this.mobile) {
                    Toast("请输入手机号码");
                } else if (!mobileValidate(this.mobile)) {
                    Toast("手机号格式错误");
                } else {
                    var that = this;
                    this.$http({
                        method: 'post',
                         url: this.HOST+ '/user/sendcode.htm',
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
            },
            validate:function () {
                if (!this.checkcode) {
                    Toast("请输入短信验证码");
                } else {
                    var that = this;
                    this.$http({
                        method: 'post',
                         url: this.HOST+ '/user/resetpaypwd.htm',
                        params: {
                            step: 1,
                            checkcode: that.checkcode
                        }
                    }).then(function (response) {
                        var data = response.data;
                        if (data.success) {
                            that.$router.push({path: "fixTraderPwd/fixTraderPwd1"});
                        } else {
                            Toast(data.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    })
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

