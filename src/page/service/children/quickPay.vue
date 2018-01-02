<template>
    <div class='monthly childPage' v-cloak>
        <head-top head-title='月成交单' :go-back='true'></head-top>
        <section class="total"> 
            <div>
                <h3>{{ year }}年{{ month }}月 成交单</h3>
                <p>统计周期：{{ month }}月1日~{{ month }}月{{ date }}日</p>
            </div>
            <ul class="tit">
                <li>业务</li>
                <li>申请(单)</li>
                <li>成交(单)</li>
            </ul>
            <ul class="con">
                <li>贷款</li>
                <li>{{ totalOrderNum }}</li>
                <li>{{ toatlDealNum }}</li>
            </ul>
        </section>

        <section class="list module">
            <p class="tit">以下是您在上月成交的订单</p>
            <ul>
                <li v-for="(item,index) in list">
                    <p><span>{{ index + 1 }}</span>{{ item.custName }}，{{ item.loanAmount | filterPrice }}万/{{ item.debitPeriod }}期</p>
                    <time>{{ item.paymentTime.time | filterTime }}</time>
                </li>
            </ul>
            <p class="notice">统计可能有偏差，以实际结算为准。</br>感谢您对中茗的谅解</p>
        </section>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast } from 'mint-ui'
    import { formatDay, getQueryString } from '@/js/common'
    export default {
        name: 'monthlyOver',
        data() {
            return {
                totalOrderNum: "",
                toatlDealNum: "",
                list: "",
                year: "",
                month: "",
                date: "",
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            init (type) {
                var monthy = getQueryString("monthly");
                this.year = monthy.substring(0,4);
                this.month = monthy.substring(4,6);
                
                if (this.month == 4 || this.month == 6 || this.month == 9 || this.month == 11) {
                    this.date = '30';
                } else if (this.month == 2) {
                    if ((this.year % 4 == 0 && this.year % 100 == 0) || this.year % 400 == 0) { //判断是否是闰年
                        this.date = '29';
                    } else {
                        this.date = '28';
                    }
                } else {
                    this.date = '31';
                }
                
                this.getMonthlyTurnOver(monthy);
                this.getDealDetail(monthy);
            },
            getMonthlyTurnOver(monthy) {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentOrderCount/user/getMonthlyTurnOver.htm',
                    params: {
                        monthy: monthy
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.totalOrderNum = datas.data.totalOrderNum;
                        that.toatlDealNum = datas.data.toatlDealNum;
                    } else {
                        // Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getDealDetail (monthy) {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentOrderCount/user/getDealDetail.htm',
                    params: {
                        monthy: monthy
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.list = datas.data;
                    } else {
                        // Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })

            }
        },
        filters:{
            filterPrice (price) {
                return  price/10000;
            },
            filterTime (time) {
                return formatDay(time, 'MM-dd');
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

