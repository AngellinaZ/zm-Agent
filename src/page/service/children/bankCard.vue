<template>
    <div class='bankCard childPage' v-cloak>
        <head-top head-title='银行卡' :go-back='true'></head-top>
        <section>
            <p><span>*</span>银行卡绑定后，可用于还贷或代理还款，不能转账</p>
            <div v-if="bankcard == ''" class="addCard" @click="gotoAddress('bankCard/bankCardInfo?type=1')">
                <img src="/static/images/pic/add.png">
                <span>添加银行卡</span>
            </div>
            <div v-if="bankcard != ''" class="card">
                <p><img src="/static/images/icon/bankcard.png"></p>
                <div>
                    <span>{{ bank }}</span>
                    <span>借记卡</span>
                    <span>{{ bankcard }}</span>
                </div>
                <span class="deleteCard" @click="gotoAddress('bankCard/bankCardInfo?type=2')">更换银行卡</span>
            </div>
        </section>
        <transition name='router-slid' mode='out-in'>
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast } from 'mint-ui'
    export default {
        name: 'bankCard',
        data() {
            return {
                bankcard: "",
                bank: "",
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
                var _this = this;
                this.$http({
                    method: 'post',
                     url: this.HOST + '/bank/bankQuery.htm',
                    params: {}
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        _this.bank = datas.data.bank
                        _this.bankcard = datas.data.bankcard;
                    } else {
                        // Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            }
        },
        created () {
            this.$nextTick(function () {
                this.init();
            })
        }
    }
</script>

