<template>
    <div class='restPwd childPage'>
        <head-top head-title='重置密码' go-back='true'></head-top>
        <div class="module con">
            <input class="input" type="password" placeholder="请输入新密码" v-model="password">
            <input class="input" type="password" placeholder="请再次输入密码" v-model="pwd">
            <p class="prompt"><i class="icon warn"></i>密码由6-20位英文字母／数字组成</p>
        </div>
        <div class="module module-btn">
            <button class="btn" :class="{'btn-disabled' : !password || !pwd}" :disabled="!password || !pwd" @click="validate">提交</button>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast } from 'mint-ui'
    import { pwdValidate, getQueryString } from '@/js/common'
    export default {
        name: 'rest',
        data() {
            return {
                password: "",
                pwd: ""
            }
        },
        components: {
            'head-top': headTop
        },
        methods: {
            validate:function () {
                if (!pwdValidate(this.password)) {
                    Toast("密码格式错误");
                } else if (this.password != this.pwd) {
                    Toast("密码不一致,请重新输入");
                } else {
                    this.submit();
                }
            },
            submit:function () {
                var that = this,
                    mobile = getQueryString("mobile");

                console.log(getQueryString)
                console.log(mobile)
                this.$http({
                    method: 'post',
                     url: this.HOST + '/findPassword/repassword.htm',
                    params: {
                        password: that.password,
                        pwd: that.pwd,
                        mobile: mobile
                    }
                }).then(function (response) {
                    var data = response.data;
                    if (data.success) {
                        Toast('密码修改成功');
                    } else {
                        Toast(data.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            }
        },
        created(){
        }
    }
</script>

<style lang='less'>
    .restPwd {
        height: 100%;
        width: 100%;
        background: #f2f2fc;
    }
</style>

