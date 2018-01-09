<template>
    <div class='clacResult childPage' v-cloak>
        <head-top head-title='贷款计算器' :go-back='true'></head-top>
        <section class="condition">
            <p class="tit">计算结果</p>
            <ul class="module-list">
                <li>
                    <span>首付款</span>
                    <em>{{ firstPay }}</em>
                </li>
                <li>
                    <span>贷款额</span>
                    <em>{{ debitAmount }}</em>
                </li>
                <li>
                    <span>贷款期限</span>
                    <em>{{ debitPeriod }}</em>
                </li>
                <li>
                    <span>月还款</span>
                    <em>{{ payMonth }}</em>
                </li>
                <li>
                    <span>总还款额</span>
                    <em>{{ totalPayAmount }}</em>
                </li>
            </ul>
        </section>
        <button class="moduleSubmit" @click="goto('../clac/list.html')">重新计算</button>
        <p class="remark">计算结果仅供参考，以银行审核为准</p>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast } from 'mint-ui'
    export default {
        name: 'clac',
        data() {
            return {
                firstPay: '',
                debitAmount: '',
                debitPeriod: '',
                payMonth: '',
                totalPayAmount: ''
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            init () {
                var clacResult = JSON.parse(localStorage.getItem("clacResult"));
                this.firstPay = formatCurrency1(clacResult.firstPay) + "元";
                this.debitAmount = formatCurrency1(clacResult.debitAmount) + "元";
                this.debitPeriod = clacResult.debitPeriod + "月";
                this.payMonth = formatCurrency1(clacResult.payMonth) + "元";
                this.totalPayAmount = formatCurrency1(clacResult.totalPayAmount) + "元";
            }
        },
        created () {
            this.$nextTick(function () {
                this.init();
            })
        }
    }
</script>

