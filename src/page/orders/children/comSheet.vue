<template>
    <div class='comSheet childPage' v-cloak>
        <head-top head-title='沟通单' :go-back='true'></head-top>
        <div class="protocol-out scroll_container" id="scroll_section">
            <section class="markdown">
                <ul class="module userInfo">
                    <li>
                       <p class="tit">贷款信息</p>
                    </li>
                    <li>贷款人: <span v-if="name"> {{ name }}</span> <span v-else>(暂无)</span></li>
                    <li>车价:  <span v-if="carPrice && carPrice != 0"> {{ carPrice }}元</span> <span v-else>(暂无)</span></li>
                    <li>贷款额: <span v-if="debitAmount && debitAmount != 0"> {{ debitAmount }}元</span> <span v-else>(暂无)</span></li>
                </ul>
                <ul class="module module-list">
                    <li>    
                       <p class="tit">沟通项目</p>
                    </li>
                    <li>
                        <span>执行利率(%)</span>
                        <em><input type="number" placeholder="请输入执行利率" v-model="expectExecutionRate"></em>
                    </li>
                    <li>
                        <span>返点(%)</span>
                        <em><input type="number" placeholder="请输入返点" v-model="expectRebate"></em>
                    </li>
                    <li>
                        <span>担保费(元)</span>
                        <em><input type="number" placeholder="请输入担保费" v-model="expectGuarantee"></em>
                    </li>
                    <li>
                        <span>公证抵押(元)</span>
                        <em><input type="number" placeholder="请输入公证抵押" v-model="expectMortgage"></em>
                    </li>
                    <li>
                        <span>履约保证金(元)</span>
                        <em><input type="number" placeholder="请输入履约保证金" v-model="expectBond"></em>
                    </li>
                    <li>
                        <span>抵押押金(元)</span>
                        <em><input type="number" placeholder="请输入抵押押金" v-model="expectMortgageDeposit"></em>
                    </li>
                    <li>
                        <span>驾照押金(元)</span>
                        <em><input type="number" placeholder="请输入驾照押金" v-model="expectLicense"></em>
                    </li>
                </ul>
                <div class="module text">
                    <textarea placeholder="请输入备注信息" v-model='comment'></textarea>
                </div>
            </section>
        </div>
        <button class="opration" @click='submit'>提交</button>
    </div>
</template>
<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast, Indicator } from 'mint-ui'
    import { getQueryString, formatCurrency1 } from '@/js/common'
    export default {
        name: 'comSheet',
        data() {
            return {
                id: "",
                version: "",
                loanApplyId: "",
                expectExecutionRate: "",
                expectRebate: "",
                expectGuarantee: "",
                expectMortgage: "",
                expectBond: "",
                expectMortgageDeposit: "",
                expectLicense: "",
                comment: "",
                name : "",
                debitAmount : "",
                carPrice : ""
            }
        },
        components: {
            headTop
        },
        methods: {
            init: function () {
                var that = this;
                that.loanApplyId = getQueryString("id");
                this.$http({
                    method: 'post',
                    url: this.HOST + '/loanCommunicate/getCommunication.htm',
                    params: {
                        loanApplyId: that.loanApplyId
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        if (datas.data) {
                            if (datas.data.loanCommunication) {
                                that.id = datas.data.loanCommunication.id;
                                that.version = datas.data.loanCommunication.version;
                            }
                            that.name = datas.data.custName;
                            that.debitAmount = formatCurrency1(datas.data.cust.debitAmount);
                            that.carPrice = formatCurrency1(datas.data.cust.carPrice);
                        }
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            submit: function () {
                if(this.expectExecutionRate || this.expectRebate || this.expectGuarantee || this.expectMortgage || this.expectBond || this.expectMortgageDeposit || this.expectLicense) {
                    var that = this;
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/loanCommunicate/operCommunication.htm',
                        params: {
                            id: that.id,
                            version: that.version,
                            loanApplyId: that.loanApplyId,
                            expectExecutionRate: that.expectExecutionRate,
                            expectRebate: that.expectRebate,
                            expectGuarantee: that.expectGuarantee,
                            expectMortgage: that.expectMortgage,
                            expectBond: that.expectBond,
                            expectMortgageDeposit: that.expectMortgageDeposit,
                            expectLicense: that.expectLicense,
                            comment: that.comment,
                        }
                    }).then(function (response) {
                        var datas = response.data;
                        if (datas.success) {
                            that.$router.push('/orderList');
                        } else {
                            // Toast(datas.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    })
                } else {
                    Toast("至少填写一项")
                }
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


