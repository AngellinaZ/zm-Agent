<template>
    <div class='user'>
        <head-top head-title='服务' :go-back='false'></head-top>
        <section class="info">
            <img src="/static/images/pic/pic.png" />
            <p>
                <span>{{ userName }}</span>
                <span>{{ mobile }}</span>
            </p>
            <em @click="gotoAddress('service/my')">
                <img src="/static/images/svg/next.svg">
            </em>
        </section>
        <section class="funList">
            <ul>
                <li @click="gotoAddress('service/clac')">
                    <img src="/static/images/svg/server1.svg" />
                    <span>贷款计算器</span>
                </li>
                <li @click="gotoAddress('service/activeUser')">
                    <img src="/static/images/svg/server2.svg" />
                    <span>激活用户</span>
                </li>
                <li @click="gotoPay('service/quickPay')">
                    <img src="/static/images/svg/server3.svg" />
                    <span>代理还款</span>
                </li>
                <li @click="gotoPay('service/withholdPay')">
                    <img src="/static/images/svg/server4.svg" />
                    <span>开通代扣</span>
                </li>
            </ul>
        </section>
        <section class="module">
            <ul class="module-list">
                <li @click="gotoAddress('service/bill')">
                    <span>账单</span>
                    <em><img src="/static/images/svg/next.svg"></em>
                </li>
                <li @click="addBankCard('service/bankCard')">
                    <span>银行卡</span>
                    <em><img src="/static/images/svg/next.svg"></em>
                </li>
            </ul>
        </section>
        <section class="module">
            <ul class="module-list">
                <!-- <li @click="gotoAddress('service/fileDownload')">
                    <span>文件下载</span>
                    <em><img src="/static/images/svg/next.svg"></em>
                </li> -->
                <li @click="gotoAddress('service/operationGuide')">
                    <span>操作指导</span>
                    <em><img src="/static/images/svg/next.svg"></em>
                </li>
            </ul>
        </section>
        <vue-foot name='服务'></vue-foot>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import vueFoot from '@/components/footer/foot'
    import { Toast, MessageBox } from 'mint-ui'
    export default {
        name: 'msg',
        data() {
            return {
                payPwd: "",
                identityNo: "",
                msgNum: "",
                userName: "",
                mobile: ""
            }
        },
        components: {
            'head-top': headTop,
            'vue-foot': vueFoot
        },
        methods: {
            gotoAddress (path) {
                this.$router.push(path);
            },
            addBankCard: function (url) {
                if (!this.identityNo && !this.userName) {
                    MessageBox.confirm('您还未实名认证，请先进行实名认证！').then(action => {
                        that.gotoAddress("/tpl/user-info/certigy");
                    })
                } else {
                    this.gotoAddress(url);
                }
            },
            gotoPay: function (url) {
                if (!this.identityNo && !this.userName) {
                    MessageBox.confirm('您还未实名认证，请先进行实名认证！').then(action => {
                        that.gotoAddress("service/my/certigy");
                    })
                } else if (!this.bankcard){
                    MessageBox.confirm('您还未绑定银行卡，请先绑定').then(action => {
                        that.gotoAddress("service/bankCard");
                    })
                } else if (!this.payPwd) {
                    MessageBox.confirm('您还未设置交易密码，请先设置！').then(action => {
                        that.gotoAddress("service/set-pwd");
                    })
                } else {
                    this.gotoAddress(url);
                }
            },
            init () {
                var that = this;
                var params = [1];
                this.$http({
                    method: 'post',
                    url: this.HOST + '/userMerchant/user/getUserInfoSum.htm',
                    params: {
                        isChoose: params[0]
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.userName = datas.data[0].name;
                        that.mobile = datas.data[0].userCode;
                        that.identityNo = datas.data[0].identityNo;
                    } else {
                        if (datas.code == '405') {
                            againLogin(login.init, params);
                        } else {
                            // Toast(datas.resultMsg);
                        }
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            getUserBankPwdIdno: function() {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/user/getUserBankPwdIdno.htm',
                    params: {}
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.bankcard = datas.data.bankCard.bankcard;
                        that.payPwd = datas.data.payPwd;
                        localStorage.setItem('bankUser', datas.data.bankCard);
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getMessageCount: function() {
                var that = this;
                this.$http({
                    method: 'post',
                     url: this.HOST + '/message/user/getMessageCount.htm',
                    params: {
                        sourceTypeId: 0
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.msgNum = datas.num;
                    } else {
                        // Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            }
        },
        created: function () {
            this.$nextTick(function () {
                this.init();
                this.getMessageCount();
                this.getUserBankPwdIdno();
            })
        }
    }
</script>