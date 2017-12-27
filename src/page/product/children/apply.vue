<template>
    <div class='orderDetail apply childPage' v-cloak>
        <head-top head-title='贷款申请' :go-back='true'></head-top>
        <div id="scroll_section" class="scroll_container">
            <div>
                <div class="list step-1" v-if='step == 1'>
                    <div class="module-20">
                        <ul class="module-list module">
                            <li>
                                <p>业务部门</p>
                                <select @change='getOptionValue' name='depart'>
                                    <option v-for='depart in UserDepartments' :value='depart.id'>{{ depart.name }}</option>
                                </select>
                            </li>
                            <li>
                                <p>业务员</p>
                                <em v-if='authorityId.indexOf(2) >= 0'>{{ agentName }}</em>
                                <select v-else @change='getOptionValue' name='agent'>
                                    <option v-for='agent in salesmans' :value='agent.id'>{{ agent.name }}</option>
                                </select>
                            </li>
                            <li>
                                <p>贷款银行</p>
                                <select @change='getOptionValue' name='bank'>
                                    <option v-for='bank in banks' :value='bank.id' :disabled="bank.status == 0">{{ bank.bankname }}</option>
                                </select>
                            </li>
                        </ul>
                        <p class="moduleNotice" v-if='isBnakNode'><span>*</span>灰色不能选的银行，表示暂停车贷业务</p>
                        <ul class="module-list" :class="{module: !isBnakNode}">
                            <li>
                                <p>配偶</p>
                                <em><button v-for="mate in mates"  @click='getMate(mate.key)' :class="{'active': mate.key == currMate}">{{ mate.value }}</button></em>
                            </li>
                            <li>
                                <p>担保人</p>
                                <em><button v-for="guarantee in guarantees" @click='getGuarantee(guarantee.key)' :class="{'active': guarantee.key == currGuarantee}">{{ guarantee.value }}</button></em>
                            </li>
                        </ul>
                        <span class="explain" @click="kown(true)">身份证上传声明<i class="icon"></i></span>
                        <ul class="module-list"><!-- 借款人 -->
                            <li>
                                <p class="tit">借款人</p>
                            </li>
                            <li class="uploadImg">
                                <div>
                                    <span>身份证正面</span>
                                    <p>
                                        <img v-if="!idcardFront" src="../../../../static/images/icon/icon-7.png">
                                        <img v-else="idcardFront" :src="idcardFront">
                                        <input type="file" name="idcardFront" @change='handleFiles'>
                                    </p>
                                </div>
                                <div>
                                    <span>身份证反面</span>
                                    <p>
                                        <img v-if="!idcardOpposite" src="../../../../static/images/icon/icon-7.png">
                                        <img v-else="idcardOpposite" :src="idcardOpposite">
                                        <input type="file" name="idcardOpposite" @change='handleFiles'>
                                    </p>
                                </div>
                            </li>
                            <li>
                                <span>姓名</span>
                                <em>
                                    <input type="text" name="" placeholder="请输入姓名" v-model="name" :readonly="typeForm == 2">
                                </em>
                            </li>
                            <li>
                                <span>身份证号</span>
                                <em>
                                    <input type="text" name="" maxlength="18" placeholder="请输入身份证号" v-model="identityNo" :readonly="typeForm == 2">
                                </em>
                            </li>
                            <li>
                                <span>手机号</span>
                                <em>
                                    <input type="tel" name="" maxlength="11" placeholder="请输入手机号" v-model="mobile">
                                </em>
                            </li>
                        </ul>
                        <ul class="module-list module" v-if='ismarried == 1'><!-- 配偶 -->
                            <li>
                                <p class="tit">配偶</p>
                            </li>
                            <li class="uploadImg">
                                <div>
                                    <span>身份证正面</span>
                                    <p>
                                        <img v-if="!spouseIdcardFront" src="../../../../static/images/icon/icon-7.png">
                                        <img v-else="spouseIdcardFront" :src="spouseIdcardFront">
                                        <input type="file" name="spouseIdcardFront" @change='handleFiles'>
                                    </p>
                                </div>
                                <div>
                                    <span>身份证反面</span>
                                    <p>
                                        <img v-if="!spouseIdcardOpposite" src="../../../../static/images/icon/icon-7.png">
                                        <img v-else="spouseIdcardOpposite" :src="spouseIdcardOpposite">
                                        <input type="file" name="spouseIdcardOpposite" @change='handleFiles'>
                                    </p>
                                </div>
                            </li>
                            <li>
                                <span>姓名</span>
                                <em>
                                    <input type="text" name="" placeholder="请输入姓名" v-model="spouseName">
                                </em>
                            </li>
                            <li>
                                <span>身份证号</span>
                                <em>
                                    <input type="text" name="" maxlength="18" placeholder="请输入身份证号" v-model="spouseIdcard">
                                </em>
                            </li>
                            <li>
                                <span>手机号</span>
                                <em>
                                    <input type="tel" maxlength="11" name="" placeholder="请输入手机号（选填）" v-model="spouseMobile">
                                </em>
                            </li>
                        </ul>
                        <ul class="module-list module" v-if='isguarantee1 == 1'><!-- 担保人1 -->
                            <li>
                                <p class="tit">担保人1</p>
                            </li>
                            <li class="uploadImg">
                                <div>
                                    <span>身份证正面</span>
                                    <p>
                                        <img v-if="!guarantor1IdcardFront" src="../../../../static/images/icon/icon-7.png">
                                        <img v-else="guarantor1IdcardFront" :src="guarantor1IdcardFront">
                                        <input type="file" name="guarantor1IdcardFront" @change='handleFiles'>
                                    </p>
                                </div>
                                <div>
                                    <span>身份证反面</span>
                                    <p>
                                        <img v-if="!guarantor1IdcardOpposite" src="../../../../static/images/icon/icon-7.png">
                                        <img v-else="guarantor1IdcardOpposite" :src="guarantor1IdcardOpposite">
                                        <input type="file" name="guarantor1IdcardOpposite" @change='handleFiles'>
                                    </p>
                                </div>
                            </li>
                            <li>
                                <span>姓名</span>
                                <em>
                                    <input type="text" name="" placeholder="请输入姓名" v-model="guarantor1Name">
                                </em>
                            </li>
                            <li>
                                <span>身份证号</span>
                                <em>
                                    <input type="text" name="" maxlength="18" placeholder="请输入身份证号" v-model="guarantor1Idcard">
                                </em>
                            </li>
                            <li>
                                <span>手机号</span>
                                <em>
                                    <input type="tel" maxlength="11" name="" placeholder="请输入手机号（选填）" v-model="guarantor1Mobile">
                                </em>
                            </li>
                        </ul>
                        <ul class="module-list module" v-if='isguarantee2 == 1'><!-- 担保人2 -->
                            <li>
                                <p class="tit">担保人2</p>
                            </li>
                            <li class="uploadImg">
                                <div>
                                    <span>身份证正面</span>
                                    <p>
                                        <img v-if="!guarantor2IdcardFront" src="../../../../static/images/icon/icon-7.png">
                                        <img v-else="guarantor2IdcardFront" :src="guarantor2IdcardFront">
                                        <input type="file" name="guarantor2IdcardFront" @change='handleFiles'>
                                    </p>
                                </div>
                                <div>
                                    <span>身份证反面</span>
                                    <p>
                                        <img v-if="!guarantor2IdcardOpposite" src="../../../../static/images/icon/icon-7.png">
                                        <img v-else="guarantor2IdcardOpposite" :src="guarantor2IdcardOpposite">
                                        <input type="file" name="guarantor2IdcardOpposite" @change='handleFiles'>
                                    </p>
                                </div>
                            </li>
                            <li>
                                <span>姓名</span>
                                <em>
                                    <input type="text" name="" placeholder="请输入姓名" v-model="guarantor2Name">
                                </em>
                            </li>
                            <li>
                                <span>身份证号</span>
                                <em>
                                    <input type="text" name="" maxlength="18" placeholder="请输入身份证号" v-model="guarantor2Idcard">
                                </em>
                            </li>
                            <li>
                                <span>手机号</span>
                                <em>
                                    <input type="tel" maxlength="11" name="" placeholder="请输入手机号（选填）" v-model="guarantor2Mobile">
                                </em>
                            </li>
                        </ul>
                        <p class="module tit warrantPhoto">信用查询授权书<b>(若有配偶或担保人，也需上传)</b></p>
                        <ul class="module-list img-list">
                            <li class="uploadImg" v-for="(item, index) in warrantPhotoArr">
                                <p>
                                    <img :src="item.boldSrc" :data-src="item.src">
                                    <i @click="deleteBox(index)" class="deleteBox"></i>
                                </p>
                            </li>
                            <li class="uploadImg">
                                <p>
                                    <input type="file" name="warrantPhoto" @change="handleFiles"/>
                                    <img src="../../../../static/images/pic/camer.png" />
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="list step-2" v-if='step == 2'>
                    <ul class="module-list module-20">
                        <li>
                            <p class="tit">购车信息</p>
                        </li>
                        <li>
                            <span>车辆属性</span>
                            <em>
                                <button v-for="car in carTypes" @click='getCarTypeId(car.id)' :class="{'active': car.id == currCarTypeId}">{{ car.attributeName }}</button>
                            </em>
                        </li>
                        <li>
                            <span>汽车品牌</span>
                            <em>
                                <input type="text" placeholder="请输入车辆品牌" v-model="carBrand">
                            </em>
                        </li>
                        <li>
                            <span>车型</span>
                            <em>
                                <input type="text" placeholder="请输入车型" v-model="carModel">
                            </em>
                        </li>
                        <li>
                            <span>车价（元）</span>
                            <em>
                                <input type="number" placeholder="请输入车价" v-model="carPrice">
                            </em>
                        </li>
                        <li>
                            <span>经销商</span>
                            <em>
                                <input type="text" placeholder="请输入经销商" v-model="merchant">
                            </em>
                        </li>
                    </ul>
                </div>
                <div class="box" v-if='flag'>
                    <div>
                        <p class="con">
                            <b>拍摄说明</b>
                            <span>将证件置于平面上，手机横向与证件平行拍摄，保证证件的四边全部入境，且内容清晰可见。</span>
                        </p>
                        <img src="../../../../static/images/pic/explain.png">
                        <p class="con">
                            <b>证件说明</b>
                            <span>若身份证遗失或过期，请上传【临时身份证】和【身份证补办申领回单】照片。</span>
                        </p>
                        <p class="kown" @click="kown(false)">知道了</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="opration">
            <button @click="submit('step1',1)">存草稿</button>
            <button @click="submit('step1',2)">下一步</button>
        </div>
        <!-- <div class="opration">
            <button @click="submit('step2',1)">存草稿</button>
            <button @click="submit('step2',2)">上一步</button>
            <button @click="submit('step2',3)">提交</button>
        </div> -->
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast } from 'mint-ui'
    import { mobileValidate, pwdValidate,getQueryString } from '@/js/common'
    export default {
        name: 'introduce',
        data() {
            return {
                webStatus               : "",
                step                    : 1,
                flag                    : false, //控制弹出框
                currMate                : "", //当前配偶
                currGuarantee           : "", //选中的担保人
                maxsize                 : 100 * 1024, //最大尺寸  
                files                   : "",
                file                    : "",
                formData                : "",

                credit                  : 0,
                ismarried               : 0,  //配偶
                isguarantee1            : 0,  //担保人1
                isguarantee2            : 0,  //担保人2
                loanBankId              : "", //贷款银行id
                originatorId            : "", //制单人

                name                    : "",
                identityNo              : "",
                mobile                  : "",
                idcardFront             : "",
                idcardOpposite          : "",

                spouseName              : "",
                spouseIdcard            : "",
                spouseIdcardFront       : "",
                spouseIdcardOpposite    : "",
                spouseMobile            : "",

                guarantor1Name          : "",
                guarantor1Idcard        : "",
                guarantor1IdcardFront   : "",
                guarantor1IdcardOpposite: "",
                guarantor1Mobile        : "",

                guarantor2Name          : "",
                guarantor2Idcard        : "",
                guarantor2IdcardFront   : "",
                guarantor2IdcardOpposite: "",
                guarantor2Mobile        : "",

                warrantPhoto            : "", //信用报告授权书
                warrantPhotoArr         : [],
                guarantees: [   //担保人
                    {key: 2, value:"2个"},
                    {key: 1, value:"1个"},
                    {key: 0, value:"无"}
                ],
                mates: [     //配偶
                    {key: 1, value:"有"},
                    {key: 0, value:"无"}
                ],
                banks: "",
                isBnakNode: false, //银行注释
                UserDepartments          : "",
                salesmans                : "",
                agentId                  : "", 
                loanBankId               : "", 
                loanDepartmentId         : "", //业务部门

                carTypes                 : "",
                currCarTypeId            : "", //车辆属性
                carBrand                 : "", //汽车品牌
                carModel                 : "", //车型
                carPrice                 : "", //车价
                merchant                 : "", //经销商
                loanApplyId              : "", //贷款申请id
                authorityId              : "",
                agentName                : "",
                typeForm                 : "", //判断来自哪里
                verifyType               : "1" 
            }
        },
        components: {
            headTop
        },
        methods: {
            init: function () {
                this.typeForm = getQueryString('type');
                if (this.typeForm == 1) { //从首页进入
                    this.loanApplyId = "";
                } else if (this.typeForm == 2) { //从订单进入
                    // var currRow = JSON.parse(localStorage.getItem("currRow"));
                    console.log(currRow)
                    if (currRow.webStatus == 500) {
                        this.webStatus = currRow.webStatus;
                        this.loanApplyId = currRow.id;
                        this.ismarried = currRow.ismarried;
                        this.name = currRow.user.name;
                        this.identityNo = currRow.user.identityNo;
                        this.mobile = currRow.user.userCode;
                        this.idcardFront = currRow.idcardFront;
                        this.idcardOpposite = currRow.idcardOpposite;
                        //配偶
                        this.spouseName = currRow.spouseName;
                        this.spouseIdcard = currRow.spouseIdcard;
                        this.spouseIdcardFront = currRow.spouseIdcardFront;
                        this.spouseIdcardOpposite = currRow.spouseIdcardOpposite;
                        this.spouseMobile = currRow.spouseMobile;
                        //担保人1
                        this.guarantor1Name = currRow.guarantor1Name;
                        this.guarantor1Idcard = currRow.guarantor1Idcard;
                        this.guarantor1IdcardFront = currRow.guarantor1IdcardFront;
                        this.guarantor1IdcardOpposite = currRow.guarantor1IdcardOpposite;
                        this.guarantor1Mobile = currRow.guarantor1Mobile;
                        //担保人2
                        this.guarantor2Name = currRow.guarantor2Name;
                        this.guarantor2Idcard = currRow.guarantor2Idcard;
                        this.guarantor2IdcardFront = currRow.guarantor2IdcardFront;
                        this.guarantor2IdcardOpposite = currRow.guarantor2IdcardOpposite;
                        this.guarantor2Mobile = currRow.guarantor2Mobile;

                        //配偶、担保人显示
                        if (this.spouseIdcard || this.spouseName || this.spouseMobile || this.spouseIdcardFront || this.spouseIdcardOpposite) {
                            this.ismarried = this.currMate = 1;
                        } else {
                            this.ismarried = this.currMate = 0;
                        }
                        //一个担保人
                        if (this.guarantor1Idcard || this.guarantor1Name || this.guarantor1Mobile || this.guarantor1IdcardFront || this.guarantor1IdcardOpposite) {
                            this.isguarantee1 = 1;
                        } else {
                            this.isguarantee1 = 0;
                        }
                        if (this.guarantor2Idcard || this.guarantor2Name || this.guarantor2Mobile || this.guarantor2IdcardFront || this.guarantor2IdcardOpposite) {
                            this.isguarantee2 = 1;
                        } else {
                            this.isguarantee2 = 0;
                        }

                        if (this.isguarantee2 == 1 && this.isguarantee1 == 0) {
                            //把担保人2的信息转移到担保人1上
                            this.isguarantee1 = 1;
                            this.guarantor1Name = this.guarantor2Name;
                            this.guarantor1Idcard = this.guarantor2Idcard;
                            this.guarantor1IdcardFront = this.guarantor2IdcardFront;
                            this.guarantor1IdcardOpposite = this.guarantor2IdcardOpposite;
                            this.guarantor1Mobile = this.guarantor2Mobile;

                            //清空担保人2
                            this.isguarantee2 = 0;
                            this.guarantor2Name = '';
                            this.guarantor2Idcard = '';
                            this.guarantor2IdcardFront = '';
                            this.guarantor2IdcardOpposite = '';
                            this.guarantor2Mobile = '';
                        }
                        //两个担保人
                        if (!this.isguarantee1 && !this.isguarantee2) {
                            this.currGuarantee = 0;
                        } else if (this.isguarantee1 && this.isguarantee2) {
                            this.currGuarantee = 2;
                        } else {
                            this.currGuarantee = 1;
                        }

                        if (currRow.warrantPhoto) { 
                            var warrantPhoto = currRow.warrantPhoto.split(',');
                            for(var i = 0; i < warrantPhoto.length; i++) {
                                var obj = {};
                                obj.src = warrantPhoto[i];
                                obj.boldSrc = warrantPhoto[i];
                                this.warrantPhotoArr.push(obj);
                            }
                        }
                        if (currRow.loanCarInfo) {
                            this.currCarTypeId = currRow.loanCarInfo.carType; //车辆属性  
                            this.carBrand = currRow.loanCarInfo.carBrand;    //汽车品牌
                            this.carModel = currRow.loanCarInfo.carModel;    //车型
                            this.carPrice = currRow.loanCarInfo.carPrice;    //车价
                            this.merchant = currRow.loanCarInfo.merchant;   //经销商
                            if(this.carPrice == 0){ this.carPrice = "";}
                        }

                    }
                }
            },
            getUserDepartment: function () {  //业务部门
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/area/userDepartment.htm',
                    params: {}
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.UserDepartments = datas.data;
                        that.loanDepartmentId = datas.data[0].id;
                        that.getSalesman();
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getSalesman: function () {  //业务员或内情
                var user = JSON.parse(localStorage.getItem("user"));
                console.log(user)
                var that = this;
                if (user) {
                    this.authorityId = (user.authorityId).toString();
                    var status = user.status;  //判断是否是正常用户
                }
                if (status == '1') {
                    if (this.authorityId.indexOf(2) >= 0) { //业务员
                        this.agentName = JSON.parse(localStorage.getItem("user")).realName;
                        this.agentId = ''
                    } else if (this.authorityId.indexOf(3) >= 0) {  //内勤
                        this.$http({
                            method: 'post',
                            url: this.HOST + '/agentLoanApply/user/salesman.htm',
                            params: {
                                departmentId: that.loanDepartmentId
                            }
                        }).then(function (response) {
                            var datas = response.data;
                            if (datas.success) {
                                that.salesmans = datas.data;
                                that.agentId = datas.data[0].id;
                            } else {
                                Toast(datas.resultMsg);
                            }
                        }).catch(function (error) {
                            Toast(error);
                        })
                    } else {
                        Toast("抱歉，您没有权限");
                    }
                } else {
                    Toast("抱歉，您没有权限");
                }
                
            },
            getBank: function () {  //贷款银行
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/bank/user/creditBankList.htm',
                    params: {}
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.banks = datas.data;
                        for(var i = 0; i < datas.data.length; i++) {
                            if (datas.data[i].status == 0) {
                                that.isBnakNode = true;
                            }
                        }
                        that.loanBankId = datas.data[0].id;
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getCarType: function () {  //车辆属性
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/fileUpLoad/user/getBasic.htm',
                    params: {
                        categoryId : 3
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.carTypes = datas.rows;
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getCarTypeId: function (id) { //车辆属性
                this.currCarTypeId = id;
            },
            getMate:function (key) { //配偶
                this.currMate = this.ismarried = key;
            },
            getGuarantee:function (key) {  //担保人
                this.currGuarantee = key;
                if (key == 1) {
                    this.isguarantee1 = 1; 
                    this.isguarantee2 = 0; 
                } else if (key == 2) {
                    this.isguarantee2 = this.isguarantee1 = 1; 
                } else {
                    this.isguarantee1 = this.isguarantee2 = 0; 
                } 
            }, 
            getOptionValue:function (event) {
                var name = event.target.name;
                if (name === 'depart') {
                    this.loanDepartmentId = event.target.value;
                } else if (name === 'bank') {
                    this.loanBankId = event.target.value;
                } else if (name === 'agent') {
                    this.agentId = event.target.value;
                }
            },
            handleFiles:function (event) { //图片上传
                var that = this;
                var inputName = event.target.name
                var fileBold = "";
                // 预览
                that.files = event.srcElement.files; 
                if (that.files && that.files.length > 0) {
                    that.file = that.files[0];
                    if (that.file.size > 1024 * 1024 * 10) {
                        myAlert("图片大小不能超过10MB!", "提示");
                    } else {
                        var URL = window.URL || window.webkitURL;
                        if (inputName == "idcardFront") {    //借款人
                            that.idcardFront = URL.createObjectURL(that.file);
                        } else if (inputName == "idcardOpposite") {
                            that.idcardOpposite = URL.createObjectURL(that.file);
                        } else if (inputName == "spouseIdcardFront") {  //配偶
                            that.spouseIdcardFront = URL.createObjectURL(that.file);
                        } else if (inputName == "spouseIdcardOpposite") {
                            that.spouseIdcardOpposite = URL.createObjectURL(that.file);
                        } else if (inputName == "guarantor1IdcardFront") {  //担保人1
                            that.guarantor1IdcardFront = URL.createObjectURL(that.file);
                        } else if (inputName == "guarantor1IdcardOpposite") {
                            that.guarantor1IdcardOpposite = URL.createObjectURL(that.file);
                        } else if (inputName == "guarantor2IdcardFront") {   //担保人2
                            that.guarantor2IdcardFront = URL.createObjectURL(that.file);
                        } else if (inputName == "guarantor2IdcardOpposite") {
                            that.guarantor2IdcardOpposite = URL.createObjectURL(that.file);
                        } else if (inputName == "warrantPhoto") {   //信用授权书
                            fileBold = that.file;
                        }
                    }
                }
                // 上传
                var files = Array.prototype.slice.call(that.files);
                files.forEach(function(file, i) {
                    if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
                        var reader = new FileReader();
                        var size = file.size / 1024 > 1024 ? (~~(10 * file.size / 1024 / 1024)) / 10 + "MB" : ~~(file.size / 1024) + "KB";
                        reader.onload = function() {
                            var result = this.result;
                            var img = new Image();
                            img.src = result;
                            //如果图片大小小于100kb，则直接上传
                            if (result.length <= that.maxsize) {
                                img = null;
                                that.upload(result, inputName, fileBold);
                                return;
                            }
                            //图片加载完毕之后进行压缩，然后上传
                            if (img.complete) {
                                callback();
                            } else {
                                img.onload = callback;
                            }
                            function callback() {
                                var data = that.compress(img);
                                that.upload(data, inputName, fileBold);
                                img = null;
                            }
                        };
                        reader.readAsDataURL(file);
                })
            },
            compress:function (img) {  //使用canvas对大图片进行压缩
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext('2d');
                var tCanvas = document.createElement("canvas");
                var tctx = tCanvas.getContext("2d");

                 var initSize = img.src.length;
                var width = img.width;
                var height = img.height;
                //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
                var ratio;
                if ((ratio = width * height / 4000000) > 1) {
                    ratio = Math.sqrt(ratio);
                    width /= ratio;
                    height /= ratio;
                } else {
                    ratio = 1;
                }
                canvas.width = width;
                canvas.height = height;
                //铺底色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                //如果图片像素大于100万则使用瓦片绘制
                var count;
                if ((count = width * height / 1000000) > 1) {
                    count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
                    //计算每块瓦片的宽和高
                    var nw = ~~(width / count);
                    var nh = ~~(height / count);
                    tCanvas.width = nw;
                    tCanvas.height = nh;
                    for (var i = 0; i < count; i++) {
                        for (var j = 0; j < count; j++) {
                            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                        }
                    }
                } else {
                    ctx.drawImage(img, 0, 0, width, height);
                }
                //进行最小压缩
                var ndata = canvas.toDataURL('image/jpeg', 0.1);
                // console.log('压缩前：' + initSize);
                // console.log('压缩后：' + ndata.length);
                // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
                tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                return ndata;
            },
            upload:function (basestr, inputName, bold) {  //图片上传，将base64的图片转成二进制对象，上传
                if (bold) {
                    var URL = window.URL || window.webkitURL;
                    bold = URL.createObjectURL(bold);
                }
                var that = this;
                var params = new URLSearchParams();
                params.append('images', basestr);
                this.$http.post("/file/images.htm", params)
                .then(function (response) {
                    if (response.data.success) {
                        if (inputName == "idcardFront") {    //借款人
                            that.idcardFront = response.data.data;
                        } else if (inputName == "idcardOpposite") {
                            that.idcardOpposite = response.data.data;
                        } else if (inputName == "spouseIdcardFront") {  //配偶
                            that.spouseIdcardFront = response.data.data;
                        } else if (inputName == "spouseIdcardOpposite") {
                            that.spouseIdcardOpposite = response.data.data;
                        } else if (inputName == "guarantor1IdcardFront") {  //担保人1
                            that.guarantor1IdcardFront = response.data.data;
                        } else if (inputName == "guarantor1IdcardOpposite") {
                            that.guarantor1IdcardOpposite = response.data.data;
                        } else if (inputName == "guarantor2IdcardFront") {   //担保人2
                            that.guarantor2IdcardFront = response.data.data;
                        } else if (inputName == "guarantor2IdcardOpposite") {
                            that.guarantor2IdcardOpposite = response.data.data;
                        }  else if (inputName == "warrantPhoto") {   //信用授权书
                            var obj = {};
                            obj.src = response.data.data;
                            obj.boldSrc = bold;
                            that.warrantPhotoArr.push(obj);
                        };
                    } 
                })
                .catch(function (error) {
                    Toast(error);
                });
            },
            deleteBox:function (index) {
                this.warrantPhotoArr.splice(index, 1);
            },
            kown:function (status) {  //身份证上传声明
                this.flag = status;
            },
            deleteDraft: function () { //删除草稿
                var that = this;
                myConfirm("确认删除该申请？", function () {
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/agentLoanApply/user/deleteLoanApplyById.htm',
                        params: {
                            id: that.loanApplyId
                        }
                    }).then(function (response) {
                        var datas = response.data;
                        if (datas.success) {
                            myOpenWindow("../orders/list.html", "");
                        } else {
                            Toast(datas.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    })
                }) 
            },
            submit: function (step, i) {
                //选择无配偶
                if (!this.ismarried) {
                    this.spouseName = '';
                    this.spouseIdcard = '';
                    this.spouseIdcardFront = '';
                    this.spouseIdcardOpposite = '';
                    this.spouseMobile = '';
                }
                //选择无担保人
                if (!this.currGuarantee) {
                    this.guarantor1Name = '';
                    this.guarantor1Idcard = '';
                    this.guarantor1IdcardFront = '';
                    this.guarantor1IdcardOpposite = '';
                    this.guarantor1Mobile = '';

                    this.guarantor2Name = '';
                    this.guarantor2Idcard = '';
                    this.guarantor2IdcardFront = '';
                    this.guarantor2IdcardOpposite = '';
                    this.guarantor2Mobile = '';
                }
                //一个担保人
                if (this.currGuarantee == 1) {  //担保人2没有信息
                    this.guarantor2Name = '';
                    this.guarantor2Idcard = '';
                    this.guarantor2IdcardFront = '';
                    this.guarantor2IdcardOpposite = '';
                    this.guarantor2Mobile = '';
                }

                //步骤
                if (step == 'step1') {
                    if (i == 1) {  //草稿;
                        if (!this.loanDepartmentId) {
                            Toast('请选择业务部门！');
                        } else if (!this.agentId && !this.agentName) {
                            Toast('请选择业务员！');
                        } else if (!this.loanBankId) {
                            Toast('请选择贷款银行！');
                        } else if (!this.name) {
                            Toast('借款人姓名不能为空！');
                        } else if (!this.identityNo) {
                            Toast('借款人身份证不能为空！');
                        } else if (!identification(this.identityNo)) {
                            Toast('借款人身份证格式不正确！');
                        } else if (!this.mobile) {
                            Toast('借款人手机号码不能为空！');
                        } else if (!mobileValidate(this.mobile)) {
                            Toast("借款人手机号格式错误！");
                        } else {
                            this.apply(500);
                        }
                    } else if (i == 2) {
                        if (!this.loanDepartmentId) {
                            Toast('请选择业务部门！');
                        } else if (!this.agentId && !this.agentName) {
                            Toast('请选择业务员！');
                        } else if (!this.loanBankId) {
                            Toast('请选择贷款银行！');
                        } else if (!this.name) {
                            Toast('借款人姓名不能为空！');
                        } else if (!this.identityNo) {
                            Toast('借款人身份证不能为空！');
                        } else if (!identification(this.identityNo)) {
                            Toast('借款人身份证格式不正确！');
                        } else if (!this.mobile) {
                            Toast('借款人手机号码不能为空！');
                        } else if (!mobileValidate(this.mobile)) {
                            Toast("借款人手机号格式错误！");
                        } else if (!this.idcardFront) {
                            Toast("借款人身份证正面照未上传！");
                        } else if (!this.idcardOpposite) {
                            Toast("借款人身份证反面照未上传！");
                        } else if (this.ismarried == 1 && !this.spouseName) {
                            Toast("配偶姓名不能为空！");
                        } else if (this.ismarried == 1 && !this.spouseIdcard) {
                            Toast("配偶身份证不能为空！");
                        } else if (this.ismarried == 1 && !identification(this.spouseIdcard)) {
                            Toast("配偶身份证格式不正确！");
                        } else if (this.ismarried == 1 && this.spouseMobile && !mobileValidate(this.spouseMobile)) {
                            Toast("配偶手机号格式错误！");  
                        } else if (this.isguarantee1 == 1 && !this.guarantor1Name) { 
                            Toast("担保人1姓名不能为空！"); 
                        } else if (this.isguarantee1 == 1 && !this.guarantor1Idcard) {
                            Toast("担保人1身份证不能为空！");
                        } else if (this.isguarantee1 == 1 && !identification(this.guarantor1Idcard)) {
                            Toast("担保人1身份证格式不正确！");
                        } else if (this.isguarantee1 == 1 && this.guarantor1Mobile && !mobileValidate(this.guarantor1Mobile)) {
                            Toast("担保人1手机号格式错误！");
                        } else if (this.isguarantee2 == 1 && !this.guarantor2Name) { 
                            Toast("担保人2姓名不能为空！"); 
                        } else if (this.isguarantee2 == 1 && !this.guarantor2Idcard) {
                            Toast("担保人2身份证不能为空！");
                        } else if (this.isguarantee2 == 1 && !identification(this.guarantor2Idcard)) {
                            Toast("担保人2身份证格式不正确！");
                        } else if (this.isguarantee2 == 1 && this.guarantor2Mobile && !mobileValidate(this.guarantor2Mobile)) {
                            Toast("担保人2手机号格式错误！");
                        } else if (this.warrantPhotoArr.length < 1) {
                            Toast("请上传相关的信用查询授权书！");
                        } else {
                            this.step = 2;
                            this.getCarType();
                        } 
                    }
                } else {
                    if (i == 2) {  //上一步
                        this.step = 1;
                    } else {
                        if (i == 1) {  //草稿
                            this.apply(500);
                        } else if (i == 3){
                            if (!this.currCarTypeId) { 
                                Toast("请选择车辆属性!"); 
                            } else if (!this.carBrand) {
                                Toast("请输入汽车品牌!");
                            } else if (!this.carModel) {
                                Toast("请输入车型!");
                            } else if (!this.carPrice) {
                                Toast("请输入车价!");
                            } else if (!this.merchant) {
                                Toast("请输经销商!");
                            } else {
                                this.apply('');
                            }
                        }
                    }
                }
            },
            apply:function (webStatus) {
                var that = this;
                var warrantPhotoArr = "";
                this.warrantPhotoArr.forEach(function (item, index) {
                    warrantPhotoArr += that.warrantPhotoArr[index].src + ",";
                })
                warrantPhotoArr = warrantPhotoArr.substring(0, warrantPhotoArr.length - 1);
                myLoading();
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentLoanApply/user/agent/apply.htm',
                    params: {
                        id                       : that.loanApplyId,
                        webStatus                : webStatus, 
                        credit                   : that.credit,
                        agentId                  : that.agentId, 
                        loanBankId               : that.loanBankId,
                        ismarried                : that.ismarried,

                        name                     : that.name,
                        identityNo               : that.identityNo.toUpperCase(),
                        mobile                   : that.mobile,
                        idcardFront              : that.idcardFront,
                        idcardOpposite           : that.idcardOpposite,

                        spouseName               : that.spouseName,
                        spouseIdcard             : that.spouseIdcard.toUpperCase(),
                        spouseIdcardFront        : that.spouseIdcardFront,
                        spouseIdcardOpposite     : that.spouseIdcardOpposite,
                        spouseMobile             : that.spouseMobile,

                        guarantor1Name           : that.guarantor1Name,
                        guarantor1Idcard         : that.guarantor1Idcard.toUpperCase(),
                        guarantor1IdcardFront    : that.guarantor1IdcardFront,
                        guarantor1IdcardOpposite : that.guarantor1IdcardOpposite,
                        guarantor1Mobile         : that.guarantor1Mobile,

                        guarantor2Name           : that.guarantor2Name,
                        guarantor2Idcard         : that.guarantor2Idcard.toUpperCase(),
                        guarantor2IdcardFront    : that.guarantor2IdcardFront,
                        guarantor2IdcardOpposite : that.guarantor2IdcardOpposite,
                        guarantor2Mobile         : that.guarantor2Mobile,

                        warrantPhoto             : warrantPhotoArr,
                        loanBankId               : that.loanBankId,   //贷款银行id
                        originator               : that.agentId,      //制单人
                        loanDepartmentId         : that.loanDepartmentId, //业务部门

                        merchant                 : that.merchant,//经销商名称
                        carType                  : that.currCarTypeId,//车辆属性
                        carBrand                 : that.carBrand, //汽车品牌
                        carModel                 : that.carModel, //车型
                        carPrice                 : that.carPrice, //车价
                        verifyType               : that.verifyType
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        if (webStatus == 500) {
                            Toast("保存成功！");
                            setTimeout(function () {
                                myOpenWindow("../orders/list.html", "");
                            }, 1000)
                        } else {
                            myOpenWindow("../product/applySuccess.html", "");
                        }
                    } else {
                        if (datas.code == "user_identity_mobile_error") {
                            myConfirm('主借人姓名身份证号手机号不一致，请确认是否继续？', function () {
                                that.verifyType = 2;
                                if (webStatus == 500) {
                                    that.apply(500);
                                } else {
                                     that.apply();
                                }
                            });
                        } else {
                            that.verifyType = 1;
                            Toast(datas.resultMsg);
                        }
                    }
                    myLoadingOver();
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
            this.getBank();
            this.getUserDepartment();
        }
    }
</script>


