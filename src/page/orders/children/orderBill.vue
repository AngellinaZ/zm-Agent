<template>
    <div class='bill childPage' v-cloak>
        <head-top head-title='分期账单' :go-back='true'></head-top>
        <div class='protocol-out scroll_container' id='scroll_section'>
            <div class="markdown">
                <ul class="module-list">
                    <li>
                        <p>{{ name }}<b>{{ identityNo }}</b></p>
                    </li>
                    <li>
                        <p>贷款金额<b>{{ actualCredit }}元</b></p>
                        <em>总还金额<span>{{ actualTotleRepayment }}元</span></em>
                    </li>
                </ul>
                <p class="moduleNotice"><span>*</span>还款将于次工作日到账，请在还款截止日前按时还款</p>
                <p class="moduleNotice"><span>*</span>每月具体所需还款金额以银行提醒短信为准</p>
                <table class="module" v-if="list.length > 0">
                    <thead>
                        <tr>
                            <td>期次</td>
                            <td>应还金额</td>
                            <td>到期还款日期</td>
                            <td>还款状态</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for='(item, index) in list'>
                            <td>{{ index + 1}}</td>
                            <td>{{ item.repaymentMoney }}元</td>
                            <td>{{ item.repaymentDate }}</td>
                            <td v-if="item.repaymentStatus == 1">已还</td>
                            <td v-else>未还</td>
                        </tr>
                    </tbody>
                </table>
                <div class="blankPage" v-if='list.length < 1'>
                    <img src="/static/images/pic/blankPage.png">
                    <p>———— 暂无记录 ————</p>
                </div>
            </div>
        </div>
        <button class="btn btn-fixed" @click='insertFileList'>提交</button>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast, Indicator } from 'mint-ui'
    import { getQueryString } from '@/js/common'
    export default {
        name: 'upload',
        data() {
            return {
                id: '',
                productId: '',
                webStatus: '',
                name : "",
                identityNo: "",
                actualCredit: "",
                actualTotleRepayment: "",
                list: []
            }
        },
        components: {
            headTop
        },
        methods: {
            init:function () {
                var currRow = JSON.parse(localStorage.getItem("currRow"));
                this.webStatus = currRow.webStatus;
                this.id = currRow.id;
                this.productId = currRow.productId;
            },
            operateInfo:function () {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentLoanApply/user/operateOrderDetailInfo.htm',
                    params: {
                        loanApplyId: that.id,
                        departProductId: that.productId,
                        webStatus: that.webStatus
                    }
                }).then(function (response) {
                    var data = response.data.data.repaymentInfo[0];
                    if (response.data.success) {
                        that.name = data.user.name;
                        that.identityNo = data.user.identityNo;
                        that.actualCredit = data.actualCredit;
                        that.actualTotleRepayment = data.actualTotleRepayment;
                        that.list = data.repayment;
                    } else {
                        // Toast(response.data.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            }
        },
        mounted(){
            // this.$nextTick() 在数据修改之后，立即使用它对新的数据进行操作，然后等待DOM更新
            this.$nextTick(() => {
                new BScroll('#scroll_section', {  
                    deceleration: 0.001,
                    bounce: true,
                    swipeTime: 1800,
                    click: true,
                }); 
            })
        },
        created () {
            this.init(); 
            this.operateInfo();
        }
    }
</script>


