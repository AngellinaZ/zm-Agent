<template>
    <div class='setpwd1 childPage' v-cloak>
        <head-top head-title='设置交易密码' :go-back='true'></head-top>
        <div class="module con">
            <input class="input" type="password" placeholder="请输入新密码" v-model="paypassword">
            <input class="input" type="password" placeholder="请再次输入密码" v-model="repaypassword">
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
        name: 'setpwd1',
        data() {
            return {
                paypassword: "",
                repaypassword: ""
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            validate:function () {
                if (!this.paypassword) {
                    Toast("请输入新密码");
                } else if (!pwdValidate(this.paypassword)) {
                    Toast("密码格式错误");
                } else if (this.paypassword != this.repaypassword) {
                    Toast("密码不一致,请重新输入");
                } else {
                    var that = this;
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/user/resetpaypwd.htm',
                        params: {
                            paypassword: that.paypassword,
                            repaypassword: that.repaypassword,
                            step: 2
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
            },
        },
        created () {
            this.$nextTick(() => {
                this.init();
            })
        }
    }
</script>

