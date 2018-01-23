<template>
    <div class='comSheet childPage' v-cloak>
        <head-top head-title='沟通单详细' :go-back='true'></head-top>
        <div class='protocol-out scroll_container' id='scroll_section'>
            <section class="markdown">
                <ul class="module userInfo">
                    <li>
                       <p class="tit">贷款信息</p> 
                    </li>
                    <li>贷款人:  <span v-if="custName"> {{ custName }}</span> <span v-else>(暂无)</span></li>
                    <li>车价:   <span v-if="carPrice && carPrice != 0"> {{ carPrice }}元</span> <span v-else>(暂无)</span></li>
                    <li>贷款额:  <span v-if="debitAmount && debitAmount != 0"> {{ debitAmount }}元</span> <span v-else>(暂无)</span></li>
                </ul>
                <table class="module">
                    <thead>
                        <tr>
                            <th>沟通项目</th>
                            <th>期望值</th>
                            <th>财务确认</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>执行利率(%)</td>
                            <td>{{ expectExecutionRate }}</td>
                            <td>{{ confirmExecutionRate }}</td>
                        </tr>
                        <tr>
                            <td>返点(%)</td>
                            <td>{{ expectRebate }}</td>
                            <td>{{ confirmRebate }}</td>
                        </tr>
                        <tr>
                            <td>担保费(元)</td>
                            <td>{{ expectGuarantee }}</td>
                            <td>{{ confirmGuarantee }}</td>
                        </tr>
                        <tr>
                            <td>公证抵押(元)</td>
                            <td>{{ expectMortgage }}</td>
                            <td>{{ confirmMortgage }}</td>
                        </tr>
                        <tr>
                            <td>履约保证金(元)</td>
                            <td>{{ expectBond }}</td>
                            <td>{{ confirmBond }}</td>
                        </tr>
                        <tr>
                            <td>抵押押金(元)</td>
                            <td>{{ expectMortgageDeposit }}</td>
                            <td>{{ confirmMortgageDeposit }}</td>
                        </tr>
                        <tr>
                            <td>驾照押金(元)</td>
                            <td>{{ expectLicense }}</td>
                            <td>{{ confirmLicense }}</td>
                        </tr>
                    </tbody>
                </table>  
            </section>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast } from 'mint-ui'
    import { formatCurrency1, getQueryString } from '@/js/common'
    export default {
        name: 'comSheetDetail',
        data() {
            return {
                custName: "",
                debitAmount: "",
                carPrice: "",
                expectExecutionRate: "",
                expectRebate: "",
                expectGuarantee: "",
                expectMortgage: "",
                expectBond: "",
                expectMortgageDeposit: "",
                expectLicense: "",
                confirmExecutionRate: "",
                confirmRebate: "",
                confirmGuarantee: "",
                confirmMortgage: "",
                confirmBond: "",
                confirmMortgageDeposit: "",
                confirmLicense: "",
            }
        },
        components: {
            headTop
        },
        methods: {
            init: function () {
                var id = getQueryString("id");
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/loanCommunicate/getCommunication.htm',
                    params: {
                        loanApplyId: id
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.expectExecutionRate = datas.data.loanCommunication.expectExecutionRate;
                        that.expectRebate = datas.data.loanCommunication.expectRebate;
                        that.expectGuarantee = datas.data.loanCommunication.expectGuarantee;
                        that.expectMortgage = datas.data.loanCommunication.expectMortgage;
                        that.expectBond = datas.data.loanCommunication.expectBond;
                        that.expectMortgageDeposit = datas.data.loanCommunication.expectMortgageDeposit;
                        that.expectLicense = datas.data.loanCommunication.expectLicense;

                        that.confirmExecutionRate = datas.data.loanCommunication.confirmExecutionRate;
                        that.confirmRebate = datas.data.loanCommunication.confirmRebate;
                        that.confirmGuarantee = datas.data.loanCommunication.confirmGuarantee;
                        that.confirmMortgage = datas.data.loanCommunication.confirmMortgage;
                        that.confirmBond = datas.data.loanCommunication.confirmBond;
                        that.confirmMortgageDeposit = datas.data.loanCommunication.confirmMortgageDeposit;
                        that.confirmLicense = datas.data.loanCommunication.confirmLicense;

                        that.custName = datas.data.custName;
                        that.debitAmount = formatCurrency1(datas.data.cust.debitAmount);
                        that.carPrice = formatCurrency1(datas.data.cust.carPrice);
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
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
        }
    }
</script>


