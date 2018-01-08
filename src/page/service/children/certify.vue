<template>
    <div class='certifyPage childPage' v-cloak>
        <head-top head-title='实名认证' :go-back='true'></head-top>
        <section>
            <p><span>*</span>请绑定您本人的身份信息，提交后不可修改</p>
            <ul class="module-list">
                <li>
                    <span>您的真实姓名</span> 
                    <em><input type="text" placeholder="请输入" v-model='name'></em>
                </li>
                <li>
                    <span>您的身份证号</span> 
                    <em><input type="text" placeholder="请输入" v-model='idNum'></em>
                </li>
            </ul>
        </section>
        <button class="moduleSubmit" @click='submit'>提交</button>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast } from 'mint-ui'
    export default {
        name: 'certify',
        data() {
            return {
                name: "",
                idNum: ""
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            submit:function () {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/user/setuser.htm',
                    params: {
                        name: that.name,
                        IDcard: that.idNum
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        Toast("实名认证成功");
                        setTimeout(function() {
                            that.$router.push({path: '/service/my'})
                        }, 1000);
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            }
        }
    }
</script>

