<template>
    <div class='reg'>
        <head-top head-title='注册' :go-back='true'></head-top>
        <div class="module con">
            <i class="icon eye" :class="{'active': flag}" @click="seePwd()"></i>
            <button :class="{'getCode': true, 'btn-disabled': isDisabled}" :disabled='isDisabled' @click="sendMobilecode">{{ message }}</button>

            <input class="input" type="tel" maxlength="11"  placeholder="请输入手机号" v-model="mobile">
            <input class="input" type="tel" placeholder="请输入短信验证码" v-model="checkcode">
            <input v-if="!flag" class="input" type="password" placeholder="请输入登录密码" v-model="password">
            <input v-else="flag" class="input" type="text" placeholder="请输入登录密码" v-model="password">
            <p class="prompt">
                <i class="icon warn"></i>密码由6-20位英文字母／数字组成
            </p>
        </div>
        <div class="module module-btn">
            <button class="btn" @click="validate()">注册</button>
            <p class="prompt">注册即表示您已同意 <router-link to="/reg/regProtocol">《中茗金融注册协议》</router-link></p>
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
                mobile: '',
                checkcode: '',
                password: '',
                flag: false,
                message: "获取验证码",
                isDisabled: true
            }
        },
        components: {
            'head-top': headTop
        },
        watch: {
            mobile (val, oldVal) {
                this.isDisabled = mobileValidate(val) ? false : true;
            }
        },
        methods: {
            sendMobilecode () {  //获取验证码
                var that = this;
                this.$http({
                    method: 'post',
                     url: this.HOST + '/merchant/sendMobilecode.htm',
                    params: {
                        mobile: that.mobile,
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
            },
            seePwd () {
                this.flag = !this.flag;
            },
            validate () {  
                if (!this.checkcode){
                    Toast("请填写验证码");
                } else if (!pwdValidate(this.password)) {
                    Toast("密码格式错误");
                } else {
                    this.submit();
                }
            },
            submit () {
                var that = this;
                this.$http({
                    method: 'post',
                     url: this.HOST + '/merchant/registerMerchantUser.htm',
                    params: {
                        mobile: that.mobile,
                        checkcode: that.checkcode,
                        password: that.password 
                    }
                }).then(function (response) {
                    var data = response.data;
                    if (data.success) {
                        that.$router.push({ path: 'login' })
                    } else {
                        Toast(data.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            }
        }
    }
</script>