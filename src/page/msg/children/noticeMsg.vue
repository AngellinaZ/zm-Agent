<template>
    <div class='noticeMsg msg childPage' v-cloak>
        <head-top head-title='通知消息' :go-back='true'></head-top>
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
        <transition name="router-slid" mode="out-in">
            <router-view></router-view> 
        </transition>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast } from 'mint-ui'
    export default {
        name: 'noticeMsg',
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
            getMessage() {
                var _this = this;
                this.$http({
                    method: 'post',
                     url: this.HOST + '/message/user/getMessage.htm',
                    params: {
                        type: 2,
                        sourceTypeId: 0
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        _this.messages = datas.data;
                    } else {
                        if (datas.code == 'record_not_exsist') {
                            _this.messages = '';
                        }
                        // mui.toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    mui.toast(error);
                })
            },
            updataMsg (item) {
                if (item.detailUrl == "") {
                    this.currId = item.id;
                }
                if (item.detailUrl == "" && item.status == 0) {
                    this.updateMessage(item);
                }
                if(item.title == "月成交单") {
                    var monthly = item.messageDate.substring(0, 4) + (item.messageDate.substring(5, 7) - 1);
                    this.gotoAddress('noticeMsg/monthlyOver?monthly=' + monthly);
                }
            },
            updateMessage (item) {
                var _this = this;
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
                        _this.getMessage();
                    } else {
                        mui.toast(data.resultMsg);
                    }
                }).catch(function (error) {
                    mui.toast(error);
                })
            },
            orderDetail (item) {
                if (!item.status) {
                    this.updateMessage(item);
                }
                if (item.detailUrl) {
                    if (item.detailUrl.indexOf("hangMakeup") && item.handleResult == 1) {
                        mui.toast("数据已提交，无法查看");
                    } else {
                        let path = '/orderList/orderDetail'
                        this.gotoAddress(path + "?id="+ item.loanApplyId);
                    }
                }
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

