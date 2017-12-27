<template>
    <footer id='foot'>
        <ul class='footer'>
            <li v-for='(item, index) in footerList' @click="gotoAddress(item.href)" :class="{active: name == item.name, msg: item.clazz == 'msg'}">
                <b v-if="msgNum && item.clazz == 'msg'"></b>
                <i :class="[item.clazz]"></i>
                <span>{{ item.name }}</span>
            </li>
        </ul>
    </footer>
</template>

<script>
    export default {
        name: 'foot',
        data() {
            return {
                msgNum: '',
                footerList : [
                    {
                        name : "首页",
                        href : "/product",
                        clazz : "loan",
                        status : true
                    },
                    {
                        name : "订单",
                        href : "/orderList",
                        clazz : "order",
                        status : false
                    },
                    {
                        name : "消息",
                        href : "/classify",
                        clazz : "msg",
                        status : false
                    },
                    {
                        name : "服务",
                        href : "/user-info",
                        clazz : "user",
                        status : false
                    }
                ]
            }
        },
        props: ['name'],
        methods: {
            gotoAddress (url) {
                this.$router.push(url)
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