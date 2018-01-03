<template>
    <div class='myBill childPage' v-cloak>
        <head-top head-title='我的账单' :go-back='true'>
            <em slot='searchBtn' @click='toFilter'>筛选</em>
        </head-top>
        <div class="list scroll_container" id='scroll_section' v-show='bills.length > 0'>
            <ul>
                <li v-for='bill in bills' :key='bill.id'>
                    <p>
                        <span class="status">
                            {{ bill.transactionType | filterStatus }} <em v-if='bill.rewardSource'>{{ bill.rewardSource }}</em>
                        </span>
                        <time>{{ bill.payTime }}</time>
                    </p>
                    <p>
                        <span class="price"><em v-if='bill.transactionAmount > 0'>+</em>{{ bill.transactionAmount }}</span>
                        <span class="balance">余额：{{ bill.remainingFunds }}</span>
                    </p>
                </li>
            </ul>
        </div>
        <div class="mask" v-if='isFilter'>
            <div id="filter">
                <p class="tit">状态筛选</p>
                <ul>
                    <li v-for='item in list' :key='item.id' @click='filter(item.key)' :class="{active: item.key == currKey }" >
                        {{ item.value }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="blankPage" v-if='bills.length < 1'>
            <img src="/static/images/pic/blankPage.png">
            <p>———— 暂无记录 ————</p>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast } from 'mint-ui'
    export default {
        name: 'bill',
        data() {
            return {
                bills: "",
                isFilter: false,
                currKey: "",
                list: [ 
                    {value: '全部', key: 0},
                    {value: '充值', key: 1},
                    {value: '提现', key: 2},
                    {value: '奖励', key: 3},
                    {value: '推荐奖励', key: 4},
                    {value: '购买保险', key: 5},
                    {value: '购买理财', key: 6},
                    {value: '理财回款', key: 7},
                    {value: '商品购买', key: 8},
                    {value: '商品购买退款', key: 9}
                ]
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            init () {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/account/getAccountBalanceType.htm',
                    params: {}
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.bills = datas.data;
                    } else {
                        // Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            toFilter () {
                this.isFilter = true;
                //点击阴影区关闭筛选区域
                if (this.isFilter) {
                    var that = this;
                    setTimeout(function () {
                        var mask = document.querySelector(".mask")
                        var filter = document.querySelector("#filter");
                        var shaowArea = mask.clientWidth - filter.clientWidth;

                        mask.onclick = function (e) {
                            if (e.clientX < shaowArea) {
                                that.isFilter = false;
                            }
                        }
                    },200)
                }
            },
            filter (key) {
                var that = this;
                that.currKey = key;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/account/getAccountBalanceType.htm',
                    params: {
                        type: key
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        setTimeout(function() {that.isFilter = false;}, 500);
                        that.bills = datas.data;
                    } else {
                        setTimeout(function() {that.isFilter = false;}, 500);
                        Toast('请选择其他筛选条件');
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            }
        },
        filters: {
            filterStatus (status) {
                var list = [ 
                    {value: '全部', key: 0},
                    {value: '充值', key: 1},
                    {value: '提现', key: 2},
                    {value: '奖励', key: 3},
                    {value: '推荐奖励', key: 4},
                    {value: '购买保险', key: 5},
                    {value: '购买理财', key: 6},
                    {value: '理财回款', key: 7},
                    {value: '商品购买', key: 8},
                    {value: '商品购买退款', key: 9}
                ];
                for (var i = 0; i < list.length; i ++) {
                    if (list[i].key == status) {
                        return list[i].value;
                    }
                }
            }
        },
        created () {
            this.$nextTick(function () {
                this.init();
            })
        },
        mounted () {
            this.$nextTick(function () {
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

