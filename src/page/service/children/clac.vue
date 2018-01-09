<template>
    <div class='clac childPage' v-cloak>
        <head-top head-title='贷款计算器' :go-back='true'></head-top>
        <section class="condition">
            <ul class="module-list">
                <li>
                    <span>业务部门</span>
                    <select @change='getOptionValue' name='userDepartment' v-if='userDepartment'>
                        <option v-for='item in userDepartment' :value='item.id'>{{ item.name }}</option>
                    </select>
                    <em v-else>暂无</em>
                </li>
                <li>
                    <span>产品大类</span>
                    <select @change='getOptionValue' name='productLines' v-if='productLines'>
                        <option v-for='item in productLines' :value='item.id'>{{ item.name }}</option>
                    </select>
                    <em v-else>暂无</em>
                </li>
                <li>
                    <span>贷款银行</span>
                    <select @change='getOptionValue' name='BankList' v-if='BankList'>
                        <option v-for='item in BankList' :value="item.id">{{ item.bankname }}</option>
                    </select>
                    <em v-else>暂无</em>
                </li>
                <li>
                    <span>车辆属性</span>
                    <select @change='getOptionValue' name='carAttr' v-if='carAttr'>
                        <option v-for='item in carAttr' :value="item.carType + ',' + item.upcardType + ',' + item.plateColor">{{ item.carTypeName + '-' + item.plateColorName + '-' + item.upcardTypeName }}</option>
                    </select>
                    <em v-else>暂无</em>
                </li>
                <li>
                    <span>贷款期限</span>
                    <select @change='getOptionValue' name='loanTime' v-model='debitPeriod' v-if='loanTime'>
                        <option v-for='item in loanTime' :value="item.loanLimit" :id="item.benchmarkRate">{{ item.loanLimit }}</option>
                    </select>
                    <em v-else>暂无</em>
                </li>
            </ul>
        </section>
        <section class="module clacPrice">
            <ul class="module-list">
                <li>
                    <span>车价</span> 
                    <em><input type="number" v-model='carPrice' placeholder="请输入">元</em>
                </li>
                <li>
                    <span>贷款额</span> 
                    <em><input type="number" v-model='debitAmount' placeholder="请输入">元</em>
                </li>
                <li>
                    <span>利率</span> 
                    <em><input type="number" v-model='rate' placeholder="请输入">%</em>
                </li>
            </ul>
        </section>
        <button class="moduleSubmit" @click='submit'>计算</button>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view> 
        </transition>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast } from 'mint-ui'
    export default {
        name: 'clac',
        data() {
            return {
                userDepartment: '',
                productLines: '',
                productLineId: '',
                BankList: '',
                carAttr: '',
                loanTime: '',
                bankId: '',
                deptId: '',
                carType: '',
                upcardType: '',
                plateColor: '',
                carPrice: '',
                debitAmount: '',
                baseRate: '', //执行利率
                rate: '',     //利率 输入的
                debitPeriod: ''
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            init () {
                this.getUserDepartment();
                this.getProductLines();
                var clacPrice = JSON.parse(localStorage.getItem("clacPrice"));
                var that = this;
                if (clacPrice) {
                    setTimeout(function () {
                        that.carPrice = clacPrice.carPrice;
                        that.debitAmount = clacPrice.debitAmount;
                        that.rate = clacPrice.rate;
                        that.debitPeriod = clacPrice.debitPeriod;
                    }, 200)
                }
            },
            getOptionValue (event) {
                var name = event.target.name;
                var value = event.target.value;
                if (name === 'userDepartment') {
                    this.deptId = value;
                } else if (name === 'productLines') {
                    this.productLineId = value;
                    this.getBankList();
                } else if (name === 'BankList') {
                    this.bankId = value;
                    this.getBankList();
                } else if (name === 'carAttr') {
                    var carArr = value.split(',');
                    this.carType = carArr[0];
                    this.upcardType = carArr[1];
                    this.plateColor = carArr[2];
                    this.getLoanTime();
                } else if (name === 'loanTime') {
                    this.debitPeriod = value;
                    this.baseRate =  event.target.options[event.target.options.selectedIndex].id;
                }
            },
            getUserDepartment () {  //业务部门
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/area/userDepartment.htm',
                    params: {}
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.userDepartment = datas.data;
                        that.deptId = datas.data[0].id;
                    } else {
                        that.userDepartment = "";
                        //Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getProductLines () {  //产品大类
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/loanCalculator/user/getProductLines.htm',
                    params: {}
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.productLines = datas.rows;
                        that.productLineId = datas.rows[0].id;
                        that.getBankList();
                    } else {
                        that.productLines = "";
                        //Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getBankList () {  //贷款银行
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/bank/user/creditBankList.htm',
                    params: {
                        productLineId: that.productLineId
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.BankList = datas.data;
                        that.bankId = datas.data[0].id;
                        that.getCarAttr();
                    } else {
                        that.BankList = "";
                        //Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getCarAttr () {  //车辆属性
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/loanCalculator/user/getBankRate.htm',
                    params: {
                        bankId: that.bankId,
                        productLineId: that.productLineId,
                        deptId: that.deptId,
                        isGroupBy: 1
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.carAttr = datas.data;
                        that.carType = datas.data[0].carType;
                        that.upcardType = datas.data[0].upcardType;
                        that.plateColor = datas.data[0].plateColor;
                        that.getLoanTime();
                    } else {
                        that.carAttr = "";
                        if (datas.code == 'record_not_exsist') {
                            Toast("暂无车辆可选，请重新选择贷款银行");
                        }
                        //Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getLoanTime () {  //贷款期限
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/loanCalculator/user/getBankRate.htm',
                    params: {
                        bankId: that.bankId,
                        carType: that.carType,
                        upcardType: that.upcardType,
                        plateColor: that.plateColor,
                        productLineId: that.productLineId,
                        isGroupBy: 2
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.loanTime = datas.data;
                        that.debitPeriod = datas.data[0].loanLimit;
                    } else {
                        that.loanTime = "";
                        //Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            submit () {  //计算
                if (!this.debitPeriod) {
                    Toast("请选择贷款期限");
                } else if (!this.carPrice) {
                    Toast("请输入车价");
                } else if (!this.debitAmount) {
                    Toast("请输入贷款额");
                } else if (!this.rate) {
                    Toast("请输入利率");
                } else {
                    var that = this;
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/loanCalculator/user/calculatorLoanResult.htm',
                        params: {
                            carPrice: that.carPrice,
                            debitAmount: that.debitAmount,
                            rate: that.rate,
                            debitPeriod: that.debitPeriod,
                            baseRate: that.baseRate
                        }
                    }).then(function (response) {
                        var datas = response.data;
                        if (datas.success) {
                            localStorage.setItem('clacPrice',JSON.stringify({
                                "carPrice": that.carPrice,
                                "debitAmount": that.debitAmount,
                                "rate": that.rate,
                                "debitPeriod": that.debitPeriod
                            }));
                            localStorage.setItem('clacResult',datas.data); 
                            that.$router.push({path: 'clac/clacResult'})
                        } else {
                            //Toast(datas.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    })
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

