<template>
    <div class='bankCardInfo childPage' v-cloak>
        <head-top head-title='银行卡' :go-back='true'></head-top>
        <section>
            <p><span>*</span>请绑定您本人的银行卡</p>
            <ul class="module-list">
                <li>
                    <span>持卡人</span>
                    <em>{{ name }}</em>
                </li>
                <li>
                    <span>银行卡号</span>
                    <em>
                        <input type="text" placeholder="请输入" v-model='bankCardReg' v-on:input="formateNum(bankCardReg)">
                    </em>
                </li>
            </ul>
        </section>
        <button class="moduleSubmit" @click='submit'>下一步</button>
        <form action="" method="post" id='LLform'>
            <input type="hidden" name='req_data' value='' id="req_data" />
        </form>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast, MessageBox } from 'mint-ui'
    import { getQueryString } from '@/js/common'
    export default {
        name: 'bankCard',
        data() {
            return {
                name: "",
                bankCardReg:"",
                bankCard: "",
                type: "",
                transactionType: ""
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
                this.name = JSON.parse(localStorage.getItem("user")).realName;
                this.type = getQueryString("type");
                if (this.type == 1) {
                    this.transactionType = 15;
                } else if (this.type == 2) {
                    this.transactionType = 16;
                } 

                var search = window.location.href;
                var code = getQueryString('status');
                if (search != '' && code) {
                    // 连连返回页面状态码
                    if (code != '0000') { // 返回状态错误
                        MessageBox('Notice', '银行卡信息错误，请核对');
                    } else {
                        // 返回状态正确
                        this.gotoAddress('/service');
                    }
                }
            },
            formateNum (reg) {
                this.bankCard = reg;
                this.bankCardReg = reg.replace(/\D/g, '').replace(/....(?!$)/g,'$& ');
            },
            submit () {
                if (!this.bankCard) {
                    Toast("请输入银行卡号码");
                } else {
                    var that = this;
                    axios({
                        method: 'post',
                        url: global.apiURL + '/repayment/user/bindBank.htm',
                        params: {
                            bankCard: that.bankCard,
                            transactionType: that.transactionType
                        }
                    }).then(function (response) {
                        var datas = response.data;
                        if (datas.success) {
                            document.querySelector("#LLform").setAttribute("action", datas.url);
                            document.querySelector("#req_data").setAttribute("value", datas.data);
                            document.querySelector("#LLform").submit();

                            that.init();
                        } else {
                            // Toast(datas.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    });
                }
            }
        },
        created () {
            this.$nextTick(function () {
                this.init();
            })
        }
    }
</script>

