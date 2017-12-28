<template>
    <div class='count'>
        <head-top head-title='统计' :go-back='true'></head-top>
        <ul class="module-list">
            <li @click="gotoAddress('count/totalIncomplete')">
                <span><i class="material"></i>资料未齐全(单)：<em>{{ totalIncompleteNum }}</em></span>
                <em><img src="/static/images/svg/next.svg"></em>
            </li>
            <li @click="gotoAddress('count/totalMortgage')">
                <span><i class="mortgage"></i>抵押未完成(单)：<em>{{ totalMortgageNum }}</em></span>
                <em><img src="/static/images/svg/next.svg"></em>
            </li>
        </ul>
        <div class="module section">
            <p class="tit">月统计 
                <span @click='openPicker'> {{ showDate }} <img src="/static/images/svg/next.svg"></span>
            </p>
            <ul>
                <li>
                    <span>{{ monthApplyNum }}</span>
                    <em>申请(单）</em>
                </li>
                <li>
                    <span>{{ monthDealNum }}</span>
                    <em>成交(单）</em>
                </li>
                <li>
                    <span>{{ monthFailNum }}</span>
                    <em>失败(单）</em>
                </li>
            </ul>
        </div>
        <div class="module section">
            <p class="tit">总统计</p>
            <ul>
                <li>
                    <span>{{ totalApplyNum }}</span>
                    <em>申请(单）</em>
                </li>
                <li>
                    <span>{{ toatlDealNum }}</span>
                    <em>成交(单）</em>
                </li>
                <li>
                    <span>{{ totalFailNum }}</span>
                    <em>失败(单）</em>
                </li>
            </ul>
        </div>
        <date-time 
            ref='datePicker'
            type='date' 
            year-format='{value} 年'
            month-format='{value} 月'
            date-format='{value} 日'
            :startDate='startDate'
            v-model='currMonth'>
        </date-time>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view> 
        </transition>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast, DatetimePicker } from 'mint-ui'
    export default {
        name: 'count',
        data() {
            return {
                showDate: "",
                currMonth: "",
                monthApplyNum: 0,
                monthDealNum: 0,
                monthFailNum: 0,
                toatlDealNum: 0,
                totalApplyNum: 0,
                totalFailNum: 0,
                totalIncompleteNum: 0,
                totalMortgageNum: 0,
                startDate: new Date()
            }
        },
        components: {
            'head-top': headTop,
            'date-time': DatetimePicker
        },
        methods: {
            gotoAddress (path) {
                this.$router.push(path)
            },
            init () {
                var currDate = JSON.parse(localStorage.getItem('user')).currDate;
                this.currMonth = zjzm.getDay(currDate, 'yyyy/MM/dd').substring(0,4) + zjzm.getDay(currDate, 'yyyy/MM/dd').substring(5,7);
                this.month =  zjzm.getDay(currDate, 'yyyy/MM/dd').substring(0, 4) + "年" + zjzm.getDay(currDate, 'yyyy/MM/dd').substring(5, 7) + "月";
                this.getAgentOrderCount();
            },
            getAgentOrderCount () {  
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentOrderCount/user/getAgentOrderCount.htm',
                    params: {
                        monthy: that.currMonth
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        if(datas.data) {
                            that.monthApplyNum = datas.data.monthApplyNum;
                            that.monthDealNum = datas.data.monthDealNum;
                            that.monthFailNum = datas.data.monthFailNum;
                            that.toatlDealNum = datas.data.toatlDealNum;
                            that.totalApplyNum = datas.data.totalApplyNum;
                            that.totalFailNum = datas.data.totalFailNum;
                            that.totalIncompleteNum = datas.data.totalIncompleteNum;
                            that.totalMortgageNum = datas.data.totalMortgageNum;
                        }
                    } else {
                        Toast(data.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            openPicker () { //日历
                var that = this;
                this.$refs.datePicker.open();
                console.log(this.currMonth)

                this.showDate = this.currMonth.substring(0, 4) + "年" + this.currMonth.substring(5, 7) + "月";

                // dtpicker.show(function(e) {
                //     that.currMonth =  e.value.substring(0, 4) + e.value.substring(5, 7);
                //     that.month =  e.value.substring(0, 4) + "年" + e.value.substring(5, 7) + "月";
                //     that.getAgentOrderCount();
                // }) 
            }
        },
        created(){
            // this.getAgentOrderCount();
        }
    }
</script>