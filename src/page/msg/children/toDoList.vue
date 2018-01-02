<template>
    <div class='toDoList msg childPage' v-cloak>
        <head-top head-title='待办事项' :go-back='true'></head-top>
        <ul class="tabs">
            <li :class="{'active': flag == 0}" @click="getMessage(0)">待处理</li>
            <li :class="{'active': flag == 1}" @click="getMessage(1)">已处理</li>
        </ul>
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
        name: 'toDoList',
        data() {
            return {
                messages: [],
                flag: 0,
                currId: "",
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            gotoAddress (path) {
                this.$router.push(path);
            },
            getMessage (type) {
                var that = this;
                that.flag = type;
                this.$http({
                    method: 'post',
                     url: this.HOST + '/message/user/getMessage.htm',
                    params: {
                        type: 1,
                        sourceTypeId: 0,
                        handleResult: type
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.messages = datas.data;
                    } else {
                        if (datas.code == 'record_not_exsist') {
                            that.messages = '';
                        }
                        //Toast(datas.resultMsg);
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
            updateMessage (item) {
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
                        that.getMessage(item.handleResult);
                    } else {
                        //Toast(data.resultMsg);
                    }
                }).catch(function (error) {
                   Toast(error);
                })
            },
            orderDetail (item) {
                //是否更新消息
                if (!item.status) {
                    this.updateMessage(item);
                }
                if (item.detailUrl) {
                    localStorage.setItem('handleResult', item.handleResult);
                    let path = '/orders/detail'
                    this.gotoAddress(path + "?id="+ item.loanApplyId);
                }
            }
        },
        created () {
            this.$nextTick(function () {
                var handleResult = localStorage.getItem("handleResult") || 0;
                this.getMessage(handleResult);
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

