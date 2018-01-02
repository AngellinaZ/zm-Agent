<template>
    <div class='login'>
        <img src='../../../static/images/pic/logo.png' class='logo' />
        <div class='con'>
            <input type='tel' maxlength='11' placeholder='请输入手机号' class='input input-login' v-model='mobile' />
            <input v-if='!flag' type='password' placeholder='请输入密码'  class='input input-login' v-model='password' />
            <input v-else='flag' type='text' placeholder='请输入密码'  class='input input-login' v-model='password' />
            <i class='icon eye' :class='{active : flag}' @click='seePwd'></i>
        </div>
        <div class='module'>
            <button class='btn' @click='validate()'>登录</button>
        </div>
        <div class='module'>
            <div class='login-href'>
                <router-link to='/reg'>注册账号</router-link>
                <router-link to='/pwd'>忘记密码</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui'
    import { mobileValidate, pwdValidate } from '@/js/common'
    export default {
        name: 'login',
        data() {
            return {
                mobile: '',
                password: '',
                flag: false
            }
        },
        methods: {
            validate () {
                if (!this.mobile) {
                    Toast('请输入手机号');
                } else if (!mobileValidate(this.mobile)) {
                    Toast('手机号格式错误');
                } else if (!pwdValidate(this.password)) {
                    Toast('密码格式错误');
                } else {
                    this.submit();
                }
            },
            submit () {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/yztz_user_login_check.htm',
                    params: {
                        username : this.mobile,
                        password : this.password
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        localStorage.setItem("user",  JSON.stringify({
                            "mobile"        : datas.userName,
                            "springtoken"   : datas.springtoken,
                            "authorityId"   : datas.authorityId,
                            "idCard"        : datas.idCard,
                            "currDate"      : datas.currDate,
                            "realName"      : datas.realName,
                            "status"        : datas.status
                        }));
                        that.$router.push({ path: '/product' })
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            seePwd () {
                this.flag = !(this.flag);
            }
        }
    }
</script>

