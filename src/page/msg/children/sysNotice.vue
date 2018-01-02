<template>
    <div class='sysNotice msg childPage' v-cloak>
        <head-top head-title='系统公告' :go-back='true'></head-top>
        <div class="list scroll_container" id='scroll_section' v-show='messages.length > 0'>
            <ul>
                <li v-for="item in messages" @click='updataMsg(item)'>
                    <p class="tit">
                        <span class="notice"><em v-if= "item.status == 0"></em>{{ item.title }}</span>
                        <span class="time">{{ item.messageDate }}</span>
                    </p>
                    <p :class="{con: currId == item.id, conOver : currId != item.id}">{{ item.context }}</p>
                    <p class="detail" v-if='item.detailUrl' @click="orderDetail(item)">
                        <span>查看详情</span>
                        <i class="icon next"></i>
                    </p>
                </li>
            </ul>
        </div>
        <div class="blankPage" v-if='messages.length < 1'>
            <img src="/static/images/pic/blankPage.png">
            <p>———— 暂无数据 ————</p>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast } from 'mint-ui'
    export default {
        name: 'sysNotice',
        data() {
            return {
                messages: [],
                currId: ""
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            gotoAddress (path) {
                this.$router.push(path);
            },
            getMessage: function() {
                var that = this;
                this.$http({
                    method: 'post',
                     url: this.HOST + '/message/user/getMessage.htm',
                    params: {
                        type: 3,
                        sourceTypeId: 1
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.messages = datas.data;
                    } else {
                        if (datas.code == 'record_not_exsist') {
                            that.messages = '';
                        }
                        // Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            updataMsg: function (item) {
                if (item.detailUrl == "") {
                    this.currId = item.id;
                }
                if (item.detailUrl == "" && item.status == 0) {
                    this.updateMessage(item);
                }
            },
            updateMessage: function (item) {
                var that = this;
                this.$http({
                    method: 'post',
                     url: this.HOST + '/message/user/updateMessage.htm',
                    params: {
                        id: item.id,
                        status: 1
                    }
                }).then(function (response) {
                    var data = response.data;
                    if (data.success) {
                        that.getMessage();
                    } else {
                        Toast(data.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            orderDetail:function (item) {
                // let path = '/orders/detail'
                // this.gotoAddress(path + "?id="+ item.loanApplyId);
                this.gotoAddress(item.detailUrl + "?id="+ item.loanApplyId);
            }
        },
        created () {
            this.$nextTick(function () {
                this.getMessage();
            })
        },
        mounted () {
            new BScroll('#scroll_section', {  
                deceleration: 0.001,
                bounce: true,
                swipeTime: 1800,
                click: true,
            }); 
        }
    }
</script>

