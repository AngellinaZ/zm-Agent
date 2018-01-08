<template>
    <div class='reg setpwd1 childPage' v-cloak>
        <head-top head-title='修改交易密码' :go-back='true'></head-top>
        <div class="module con">
            <input class="input" type="password" placeholder="请输入原交易密码" v-model="password">
            <input class="input module" type="password" placeholder="请输入新密码" v-model="repassword1">
            <input class="input" type="password" placeholder="请再次输入密码" v-model="repassword2">
            <p class="prompt"><i class="icon warn"></i>密码由6-20位英文字母／数字组成</p>
        </div>
        <div class="module module-btn">
            <button class="btn" @click="validate">提交</button>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast } from 'mint-ui'
    import { pwdValidate } from '@/js/common'
    export default {
        name: 'fixpwd1',
        data() {
            return {
                repassword1: "",
                repassword2: "",
                password: ""
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            validate:function () {
                if (!this.password) {
                    Toast("请输入原密码");
                } else if (!pwdValidate(this.repassword1)) {
                    Toast("密码格式错误");
                } else if (this.repassword1 != this.repassword2) {
                    Toast("密码不一致,请重新输入");
                } else {
                    this.submit();
                }
            },
            submit:function () {
                var that = this;
                this.$http({
                    method: 'post',
                     url: this.HOST + '/user/resetpaypwd.htm',
                    params: {
                        step: 2,
                        password: that.password,
                        repassword1: that.repassword1,
                        repassword2: that.repassword2
                    }
                }).then(function (response) {
                    var data = response.data;
                    if (data.success) {
                        Toast('密码修改成功');
                        setTimeout(function () {
                            that.$router.push({path: '/service'})
                        }, 2000);
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

