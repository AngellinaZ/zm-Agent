<template>
    <div class='totalIncomplete totalMortgage childPage' v-cloak>
        <head-top head-title='抵押未完成' :go-back='true'></head-top>
        <div class="tit">
            <span>客户</span> 
            <em>财务打款日期</em>
        </div>
        <div class="box scroll_container" id="scroll_section">
            <ul class="module-list">
                <li v-for='item in items' :key='item.id'>
                    <span>{{ item.custName }}</span> 
                    <em>{{ item.paymentTime.time | filterTime }}<img src="/static/images/svg/next.svg"></em>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import BScroll from 'better-scroll'
    import headTop from '@/components/header/head'
    import { Toast } from 'mint-ui'
    import { formatDay } from '@/js/common'
    export default {
        name: 'reg',
        data() {
            return {
                items: ''
            }
        },
        components: {
            'head-top': headTop
        },
        methods: {
            init:function () {
                var that = this;
                this.$http({
                    method: 'post',
                     url: this.HOST + '/agentOrderCount/user/getMortgageIncompleteList.htm',
                    params: {}
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.items = datas.data;
                    } else {
                        mui.toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    mui.toast(error);
                });
            },
        },
        filters: {
            filterTime: function(time) {
                return formatDay(time,"MM/dd hh:mm");
            }
        },
        created() {
            this.init();
        },
        mounted(){
            this.$nextTick(() => {
                new BScroll('#scroll_section', {  
                    deceleration: 0.001,
                    bounce: true,
                    swipeTime: 1800,
                    click: true,
                }); 
            })
        }
    }
</script>