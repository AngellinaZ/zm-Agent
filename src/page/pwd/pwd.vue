<template>
    <div class='reg'>
        <head-top head-title='忘记密码' :go-back='true'></head-top>
        <div class="module con">
            <button :class="{'getCode': true, 'btn-disabled': isDisabled}" :disabled='isDisabled' @click="sendMobilecode">{{ message }}</button>
            <input class="input" type="tel" maxlength="11" placeholder="请输入手机号" v-model="mobile">
            <input class="input" type="tel" placeholder="请输入短信验证码" v-model="checkcode">
        </div>
        <div class="module module-btn">
            <button class="btn":class="{'btn-disabled' : !mobile || !checkcode}" :disabled="!mobile || !checkcode" @click="submit()">下一步</button>
        </div>
        <transition name='router-side' mode='out-in'>
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast } from 'mint-ui'
    import { mobileValidate, pwdValidate } from '@/js/common'
    export default {
        name: 'pwd',
        data() {
            return {
                mobile: "",
                checkcode: "",
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
            init () {
                this.mobile = JSON.parse(localStorage.getItem('user')).mobile;
            },
            submit () {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/findPassword/checkCode.htm',
                    params: {
                        mobile: that.mobile,
                        checkcode: that.checkcode
                    }
                }).then(function (response) {
                    var data = response.data;
                    if (data.success) {
                        that.$router.push({ path: '/pwd/rest?mobile='+that.mobile })
                    } else {
                        Toast(data.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            sendMobilecode () {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/findPassword/sendFindPwdCode.htm',
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
            }
        },
        created(){
            this.$nextTick(() => {
                this.init();
            })
        }
    }
</script>

