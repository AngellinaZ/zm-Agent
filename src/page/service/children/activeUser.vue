<template>
    <div class='active childPage' v-cloak>
        <head-top head-title='激活用户' :go-back='true'></head-top>
        <div class="list scroll_container" id='scroll_section' v-show='users.length > 0'>
            <ul class="module">
                <li v-for='item in users' :key='item.id'>
                    <p>
                        <span class="name">{{ item.name }}</span>
                        <span class="idCard">{{ item.identityNo }}</span>
                    </p>
                    <p>
                        <span class="active" @click='actveUser(item)' v-if='item.status == 3'>激活</span>
                        <span class="active" v-if='item.status == 1'>已激活</span>
                        <span class="active" v-if='item.status == 0'>冻结</span>
                        <span class="active" v-if='item.status == 2'>注销</span>
                        <span class="mobile">{{ item.userCode }}</span>
                    </p>
                </li>
            </ul>
        </div>
        <div class="blankPage" v-if='users.length < 1'>
            <img src="/static/images/pic/blankPage.png">
            <p>———— 暂无数据 ————</p>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast, MessageBox } from 'mint-ui'
    export default {
        name: 'sysNotice',
        data() {
            return {
                users: ""
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            gotoAddress (path) {
                this.$router.push(path);
            },
            init () {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/user/getToActiveUser.htm',
                    params: {}
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.users = datas.rows;
                    } else {
                        // mui.toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    mui.toast(error);
                })
            },
            actveUser (item) {
                var that = this;
                MessageBox.confirm('是否激活用户？').then(action => {
                    that.$http({
                        method: 'post',
                        url: that.HOST + '/user/activateUser.htm',
                        params: {
                            id: item.id,
                            version: item.version
                        }
                    }).then(function (response) {
                        var datas = response.data;
                        if (datas.success) {
                            that.init();
                        } else {
                            if (datas.code == 'record_not_exsist') {
                                that.users = '';
                            }
                            mui.toast(datas.resultMsg);
                        }
                    }).catch(function (error) {
                        mui.toast(error);
                    })
                })
            }
        },
        created () {
            this.$nextTick(function () {
                this.init();
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

