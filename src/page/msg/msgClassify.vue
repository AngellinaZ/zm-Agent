<template>
    <div class='calssify'>
        <head-top head-title='消息' :go-back='false'></head-top>
        <ul class="msgList">
            <li class="module">
                <i class="msg1"><b v-if='msgCount1'>{{ msgCount1 }}</b></i>
                <div @click="gotoAddress('/msg/toDoList')">
                    <p class="title">
                        <span class="tit">待办事项</span>
                        <span class="time">{{ time1 }}</span>
                    </p>
                    <p class="con">{{ content1 }}</p>
                </div>
            </li>
            <li>
                <i class="msg2"><b v-if='msgCount2'>{{ msgCount2 }}</b></i>
                <div @click="gotoAddress('/msg/noticeMsg')">
                    <p class="title">
                        <span class="tit">通知消息</span>
                        <span class="time">{{ time2 }}</span>
                    </p>
                    <p class="con">{{ content2 }}</p>
                </div>
            </li>
            <li class="module">
                <i class="msg3"><b v-if='msgCount3'>{{ msgCount3 }}</b></i>
                <div @click="gotoAddress('/msg/sysNotice')">
                    <p class="title">
                        <span class="tit">系统公告</span>
                        <span class="time">{{ time3 }}</span>
                    </p>
                    <p class="con">{{ content3 }}</p>
                </div>
            </li>
        </ul>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view> 
        </transition>
        <vue-foot name='消息'></vue-foot>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import vueFoot from '@/components/footer/foot'
    import { Toast } from 'mint-ui'
    import { mobileValidate, pwdValidate } from '@/js/common'
    export default {
        name: 'msg',
        data() {
            return {
                content1: '',
                content2: '',
                content3: '',
                time1: '',
                time2: '',
                time3: '',
                msgCount1: '',
                msgCount2: '',
                msgCount3: '',
            }
        },
        components: {
            'head-top': headTop,
            'vue-foot': vueFoot
        },
        methods: {
            gotoAddress (path) {
                this.$router.push(path);
            },
            getMessage (type) {
                this.getMessageCount(type);
                var params = [type, 0, 0];
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/message/user/getMessage.htm',
                    params: {
                        type: params[0],
                        sourceTypeId: params[1],
                        handleResult: params[2]
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        if (type == 1) {
                            that.content1 = datas.data[0].context;
                            that.time1 = datas.data[0].messageDate.substring(5, 10);
                        } else if (type == 2)  {
                            that.content2 = datas.data[0].context;
                            that.time2 = datas.data[0].messageDate.substring(5, 10);
                        } else if (type == 3) {
                            that.content3 = datas.data[0].context;
                            that.time3 = datas.data[0].messageDate.substring(5, 10);
                        }
                    } else {
                        if (datas.code == '405') {
                            againLogin(calssify.getMessage, params);
                        } else {
                            // Toast(datas.resultMsg);
                        }
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getMessageCount (type) {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/message/user/getMessageCount.htm',
                    params: {
                        sourceTypeId: 0,
                        type: type
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        if (type == 1) {
                            that.msgCount1 = datas.num;
                        } else if (type == 2){
                            that.msgCount2 = datas.num;
                        } else if (type == 3){
                            that.msgCount3 = datas.num;
                        }
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            }
        },
        created () {
            this.getMessage(1);
            this.getMessage(2);
            this.getMessage(3);
        }
    }
</script>