<template>
    <header id='head_top'>
        <section @click="$router.go(-1)">
            <img src="../../../static/images/svg/back.svg"/>
        </section>
        <section class="title_head" v-if="headTitle">
            <span class="title_text">{{headTitle}}</span>
        </section>
        <section><i></i></section>
    </header>
    <footer id='foot_bottom'>
        <ul class='footer'>
            <li v-for='(item, index) in footerList' @click="tabFooter(item)" :class="{active : item.status, msg: item.clazz == 'msg'}">
                <b v-if="msgNum && item.clazz == 'msg'"></b>
                <i :class="[item.clazz]"></i>
                <span>{{ item.name }}</span>
            </li>
        </ul>
    </footer>
</template>

<script>
    export default {
        name: 'footBottom',
        data() {
            return {
                msgNum: '',
                footerList : [
                    {
                        name : "首页",
                        href : "product",
                        clazz : "loan",
                        status : true
                    },
                    {
                        name : "订单",
                        href : "orders",
                        clazz : "order",
                        status : false
                    },
                    {
                        name : "消息",
                        href : "classify",
                        clazz : "msg",
                        status : false
                    },
                    {
                        name : "服务",
                        href : "user-info",
                        clazz : "user",
                        status : false
                    }
                ]
            }
        },
        props: ['headTitle', 'goBack'],
        methods: {
            tabFooter (url) {
                this.$router.push({ path: '/url' })
            },
            getMessageCount: function() {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/message/user/getMessageCount.htm',
                    params: {
                        sourceTypeId: 0
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.msgNum = datas.num;
                    } else {
                        alert(datas.resultMsg);
                    }
                }).catch(function (error) {
                    alert(error);
                })
            }
        },
        created() {
            this.getMessageCount();
        }
    }
</script>

<style lang='less'>
    
</style>