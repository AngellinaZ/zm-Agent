<template>
    <div class='orderDetail apply childPage' v-cloak>
        <head-top head-title='订单详情' :go-back='true'></head-top>
        <div class="protocol-out scroll_container" id="scroll_section">
            <div class="list markdown">
                <section class="topArea">
                    <div class="user marking">
                        <p>
                            <span class="type">贷款</span>
                            <span class="name">{{ userName }}</span>
                            <span class="mobile">{{ userCode }}</span>
                        </p>
                        <p>
                            <img class="call" src="/static/images/svg/call.svg" @click="call">
                        </p>
                    </div>
                    <div class="process">
                        <p class="line"></p>
                        <p class="colorLine" :style="{width: 100/6*(statusCurr-1) + '%'}"></p>
                        <ul>
                            <li :class="{active: statusCurr >= 1}">
                                <i></i>
                                <span>申请</span>
                            </li>
                            <li :class="{active: statusCurr >= 2}">
                                <i></i>
                                <span>征信</span>
                            </li>
                            <li :class="{active: statusCurr >= 3}">
                                <i></i>
                                <span>审核</span>
                            </li>
                            <li :class="{active: statusCurr >= 4}">
                                <i></i>
                                <span>放款</span>
                            </li>
                            <li :class="{active: statusCurr >= 5}">
                                <i></i>
                                <span>抵押</span>
                            </li>
                            <li :class="{active: statusCurr >= 6}">
                                <i></i>
                                <span>还款</span>
                            </li>
                        </ul>
                    </div>
                    <div class="remark">
                        <span>{{ webStatus | filterStatus }}</span>
                        <p>{{ memo }}</p>
                    </div>
                    <div class="demand" v-if="webStatus == 10 || webStatus == 510 || webStatus == 520 || webStatus == 530 || webStatus == 540 || webStatus == 550 || webStatus == 560 || webStatus == 570 || webStatus == 80 || webStatus == 90 || webStatus == 580 || webStatus == 130 || webStatus == 190 || webStatus == 140 || webStatus == 590 || webStatus == 600 || webStatus == 610 ">
                        <ul>
                            <li @click="gotoAddress('/orderList/upload?id='+id)" v-if="webStatus == 10 || webStatus == 510 || webStatus == 520 || webStatus == 530 || webStatus == 540 || webStatus == 550 || webStatus == 560 || webStatus == 570 || webStatus == 80 || webStatus == 90 || webStatus == 580 || webStatus == 130 || webStatus == 190 || webStatus == 140 || webStatus == 590 || webStatus == 600 || webStatus == 610 ">上传材料</li>
                            <li @click="gotoAddress('/orderList/comSheet?id='+id)" v-if="webStatus == 530 || webStatus == 560 || webStatus == 570 || webStatus == 80 || webStatus == 90 || webStatus == 580">沟通单</li>
                            <li @click="gotoAddress('/orderList/changeBank?id='+id+'&webStatus='+webStatus)" v-if="webStatus == 530 || webStatus == 130 || webStatus == 140 || webStatus == 190 || webStatus == 590">更换银行</li>
                            <li @click="gotoAddress('/orderList/hangMakeup?id='+id)" v-if="(webStatus == 530 || webStatus == 130) && (hangup.isHangUp == 1 || hangup.guarantor1IsHangUp == 1 || hangup.guarantor2IsHangUp == 1 || hangup.spouseIsHangUp == 1)">挂起补录</li>
                            <li @click="confirm('1')" v-if="webStatus == 590 || webStatus == 600">理赔申请</li>
                            <li @click="confirm('2')" v-if="webStatus == 590 || webStatus == 600">提前还贷</li>
                        </ul>
                    </div>
                </section>
                <section class="conArea">
                    <div v-if="webStatus == 10 || webStatus == 510"><!-- 征信中  -->
                        <div class="list step-1" v-if="apply.step == 1">
                            <div class="module-20">
                                <ul class="module-list module">
                                    <li>
                                        <p>业务部门</p>
                                        <select name="depart" v-model="apply.loanDepartmentId">
                                            <option v-for="depart in apply.UserDepartments" :value="depart.id">{{ depart.name }}</option>
                                        </select>
                                    </li>
                                    <li>
                                        <p>业务员</p>
                                        <em>{{ apply.agentName }}</em>
                                        <select name="agent" v-if="apply.authorityId == 3">
                                            <option v-for="agent in apply.salesmans" :value="agent.id">{{ agent.name }}</option>
                                        </select>
                                    </li>
                                    <li>
                                        <p>贷款银行</p>
                                        <select name="bank" v-model="apply.loanBankId">
                                            <option v-for="bank in apply.banks" :value="bank.id" :disabled="bank.status == 0">{{ bank.bankname }}</option>
                                        </select>
                                    </li>
                                </ul>
                                <ul class="module-list module">
                                    <li>
                                        <p>配偶</p>
                                        <em><button v-for="mate in apply.mates"  @click='getMate(mate.key)' :class="{'active': mate.key == apply.currMate}">{{ mate.value }}</button></em>
                                    </li>
                                    <li>
                                        <p>担保人</p>
                                        <em><button v-for="guarantee in apply.guarantees" @click='getGuarantee(guarantee.key)' :class="{'active': guarantee.key == apply.currGuarantee}">{{ guarantee.value }}</button></em>
                                    </li>
                                </ul>
                                <p class="explain" @click="kown(true)">身份证上传声明<i class="icon"></i></p>
                                <ul class="module-list"><!-- 借款人 -->
                                    <li>
                                        <p class="tit">借款人</p>
                                    </li>
                                    <li class="uploadImg">
                                        <div>
                                            <span>身份证正面</span>
                                            <p>
                                                <img v-if="!apply.idcardFront" src="/static/images/icon/icon-7.png">
                                                <img v-else="apply.idcardFront" :src="apply.idcardFront">
                                                <input type="file" name="idcardFront" @change="handleFiles">
                                            </p>
                                        </div>
                                        <div>
                                            <span>身份证反面</span>
                                            <p>
                                                <img v-if="!apply.idcardOpposite" src="/static/images/icon/icon-7.png">
                                                <img v-else="apply.idcardOpposite" :src="apply.idcardOpposite">
                                                <input type="file" name="idcardOpposite" @change="handleFiles">
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <span>姓名</span>
                                        <em>
                                            <input type="text" placeholder="请输入姓名" v-model="apply.name">
                                        </em>
                                    </li>
                                    <li>
                                        <span>身份证号</span>
                                        <em>
                                            <input type="text" maxlength="18" placeholder="请输入身份证号" v-model="apply.identityNo">
                                        </em>
                                    </li>
                                    <li>
                                        <span>手机号</span>
                                        <em>
                                            <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="apply.mobile">
                                        </em>
                                    </li>
                                </ul>
                                <ul class="module-list module" v-if='apply.ismarried == 1'><!-- 配偶 -->
                                    <li>
                                        <p class="tit">配偶</p>
                                    </li>
                                    <li class="uploadImg">
                                        <div>
                                            <span>身份证正面</span>
                                            <p>
                                                <img v-if="!apply.spouseIdcardFront" src="/static/images/icon/icon-7.png">
                                                <img v-else="apply.spouseIdcardFront" :src="apply.spouseIdcardFront">
                                                <input type="file" name="spouseIdcardFront" @change="handleFiles">
                                            </p>
                                        </div>
                                        <div>
                                            <span>身份证反面</span>
                                            <p>
                                                <img v-if="!apply.spouseIdcardOpposite" src="/static/images/icon/icon-7.png">
                                                <img v-else="apply.spouseIdcardOpposite" :src="apply.spouseIdcardOpposite">
                                                <input type="file" name="spouseIdcardOpposite" @change="handleFiles">
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <span>姓名</span>
                                        <em>
                                            <input type="text" placeholder="请输入姓名" v-model="apply.spouseName">
                                        </em>
                                    </li>
                                    <li>
                                        <span>身份证号</span>
                                        <em>
                                            <input type="text" maxlength="18" placeholder="请输入身份证号" v-model="apply.spouseIdcard">
                                        </em>
                                    </li>
                                    <li>
                                        <span>手机号</span>
                                        <em>
                                            <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="apply.spouseMobile">
                                        </em>
                                    </li>
                                </ul>
                                <ul class="module-list module" v-if="apply.isguarantee1 == 1"><!-- 担保人1 -->
                                    <li>
                                        <p class="tit">担保人1</p>
                                    </li>
                                    <li class="uploadImg">
                                        <div>
                                            <span>身份证正面</span>
                                            <p>
                                                <img v-if="!apply.guarantor1IdcardFront" src="/static/images/icon/icon-7.png">
                                                <img v-else="apply.guarantor1IdcardFront" :src="apply.guarantor1IdcardFront">
                                                <input type="file" name="guarantor1IdcardFront" @change="handleFiles">
                                            </p>
                                        </div>
                                        <div>
                                            <span>身份证反面</span>
                                            <p>
                                                <img v-if="!apply.guarantor1IdcardOpposite" src="/static/images/icon/icon-7.png">
                                                <img v-else="apply.guarantor1IdcardOpposite" :src="apply.guarantor1IdcardOpposite">
                                                <input type="file" name="guarantor1IdcardOpposite" @change="handleFiles">
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <span>姓名</span>
                                        <em>
                                            <input type="text" placeholder="请输入姓名" v-model="apply.guarantor1Name">
                                        </em>
                                    </li>
                                    <li>
                                        <span>身份证号</span>
                                        <em>
                                            <input type="text" maxlength="18" placeholder="请输入身份证号" v-model="apply.guarantor1Idcard">
                                        </em>
                                    </li>
                                    <li>
                                        <span>手机号</span>
                                        <em>
                                            <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="apply.guarantor1Mobile">
                                        </em>
                                    </li>
                                </ul>
                                <ul class="module-list module" v-if="apply.isguarantee2 == 1"><!-- 担保人2 -->
                                    <li>
                                        <p class="tit">担保人2</p>
                                    </li>
                                    <li class="uploadImg">
                                        <div>
                                            <span>身份证正面</span>
                                            <p>
                                                <img v-if="!apply.guarantor2IdcardFront" src="/static/images/icon/icon-7.png">
                                                <img v-else="apply.guarantor2IdcardFront" :src="apply.guarantor2IdcardFront">
                                                <input type="file" name="guarantor2IdcardFront" @change="handleFiles">
                                            </p>
                                        </div>
                                        <div>
                                            <span>身份证反面</span>
                                            <p>
                                                <img v-if="!apply.guarantor2IdcardOpposite" src="/static/images/icon/icon-7.png">
                                                <img v-else="apply.guarantor2IdcardOpposite" :src="apply.guarantor2IdcardOpposite">
                                                <input type="file" name="guarantor2IdcardOpposite" @change="handleFiles">
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <span>姓名</span>
                                        <em>
                                            <input type="text" placeholder="请输入姓名" v-model="apply.guarantor2Name">
                                        </em>
                                    </li>
                                    <li>
                                        <span>身份证号</span>
                                        <em>
                                            <input type="text" maxlength="18" placeholder="请输入身份证号" v-model="apply.guarantor2Idcard">
                                        </em>
                                    </li>
                                    <li>
                                        <span>手机号</span>
                                        <em>
                                            <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="apply.guarantor2Mobile">
                                        </em>
                                    </li>
                                </ul>
                                <p class="moduleNotice"><span>*</span>请上传与贷款银行一致的信用授权书、授权书签字照等</p>
                                <p class="tit warrantPhoto">信用查询授权书<b>(若有配偶或担保人，也需上传)</b></p>
                                <ul class="module-list img-list">
                                    <li class="uploadImg" v-for="(item, index) in apply.warrantPhotoArr">
                                        <p>
                                            <img :src="item.boldSrc" :data-src="item.src">
                                            <i @click="deleteBox(index)" class="deleteBox"></i>
                                        </p>
                                    </li>
                                    <li class="uploadImg">
                                        <p>
                                            <input type="file" name="warrantPhoto" @change="handleFiles"/>
                                            <img src="/static/images/pic/camer.png" />
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="list step-2" v-if="apply.step == 2">
                            <ul class="module-list module module-20">
                                <li>
                                    <p class="tit">购车信息</p>
                                </li>
                                <li>
                                    <span>车辆属性</span>
                                    <em>
                                        <button v-for="car in apply.carTypes" @click="getCarTypeId(car.id)" :class="{'active': car.id == apply.currCarTypeId}">{{ car.attributeName }}</button>
                                    </em>
                                </li>
                                <li>
                                    <span>汽车品牌</span>
                                    <em>
                                        <input type="text" placeholder="请输入车辆属性" v-model="apply.carBrand">
                                    </em>
                                </li>
                                <li>
                                    <span>车型</span>
                                    <em>
                                        <input type="text" placeholder="请输入车型" v-model="apply.carModel">
                                    </em>
                                </li>
                                <li>
                                    <span>车价（元）</span>
                                    <em>
                                        <input type="tel" placeholder="请输入车价" v-model="apply.carPrice">
                                    </em>
                                </li>
                                <li>
                                    <span>经销商</span>
                                    <em>
                                        <input type="text" placeholder="请输入经销商" v-model="apply.merchant">
                                    </em>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div v-if="webStatus == 520"> <!-- 再申请审核中  不符合要求-->
                        <p class="moduleNotice">同一个客户重复提交申请，需经过人工审核</p>
                    </div>

                    <div v-if="webStatus == 530 || webStatus == 580 || webStatus == 130" class="comSheet"><!-- 征信通过，审核中 -->
                        <p class="moduleNotice"><span>*</span>请及时上传申请材料，以免影响审核进度</p>
                        <ul class="userInfo">
                            <li>
                               <p class="tit">借款人信息</p>
                            </li>
                            <li>配偶:
                                <span v-if="inReview.spouseName">{{ inReview.spouseName }}</span>
                                <span v-else>无</span>
                            </li>
                            <li>担保人:
                                <span v-if="inReview.guarantor1Name">{{ inReview.guarantor1Name }}</span>
                                <span v-if="inReview.guarantor2Name">{{ inReview.guarantor2Name }}</span>
                                <span v-if="!inReview.guarantor1Name && !inReview.guarantor2Name">无</span>
                            </li>
                        </ul>
                        <ul class="module userInfo">
                            <li>
                               <p class="tit">贷款信息</p>
                            </li>
                            <li>车价：
                                <span v-if="inReview.carPrice && inReview.carPrice != 0">{{ inReview.carPrice }}元</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>首付款：
                                <span v-if="inReview.firstPay && inReview.firstPay != 0">{{ inReview.firstPay }}元</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>首付比例：
                                <span v-if="inReview.firstScale && inReview.firstScale != 0">{{ inReview.firstScale }}%</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>贷款额：
                                <span v-if="inReview.debitAmount && inReview.debitAmount != 0">{{ inReview.debitAmount }}元</span>
                                <span v-else>(暂无)</span>
                            </li>
                             <li v-if="webStatus == 130">贷款银行：
                                <span v-if="inReview.loanBankName && inReview.loanBankName != 0">{{ inReview.loanBankName }}</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li v-if="webStatus == 580">原贷款银行：
                                <span v-if="inReview.originalBankName && inReview.originalBankName != 0">{{ inReview.originalBankName }}</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li v-if="webStatus == 580">新贷款银行：
                                <span v-if="inReview.loanBankName && inReview.loanBankName != 0">{{ inReview.loanBankName }}</span>
                                <span v-else>(暂无)</span>
                            </li>
                        </ul>
                        <ul class="module module-list moduleLastUl" v-if="inReview.loanCommunication">
                            <li @click="gotoAddress('../comSheet/detail.html?id='+id)">
                                <span>沟通单详细</span>
                                <em v-if="inReview.comStatus == 0">财务未确认<img src="/static/images/svg/next.svg"></em>
                                <em v-if="inReview.comStatus == 1">财务已确认<img src="/static/images/svg/next.svg"></em>
                            </li>
                        </ul>
                    </div>

                    <div v-if="webStatus == 540 || webStatus == 550">
                        <div class="module-20">
                            <ul class="module-list module">
                                <li>
                                    <p>业务部门</p>
                                    <em v-if="webStatus == 550">{{ add.departName }}</em>
                                    <select v-if="webStatus == 540" name="depart" v-model="apply.loanDepartmentId">
                                        <option v-for="depart in apply.UserDepartments" :value="depart.id">{{ depart.name }}</option>
                                    </select>
                                </li>
                                <li>
                                    <p>业务员</p>
                                    <em v-if="webStatus == 550">{{ add.agentName }}</em>
                                    <em v-if="webStatus == 540">{{ apply.agentName }}</em>
                                    <select name="agent" v-if="apply.authorityId == 3 && webStatus == 540">
                                        <option v-for="agent in apply.salesmans" :value="agent.id">{{ agent.name }}</option>
                                    </select>
                                </li>
                                <li>
                                    <p>贷款银行</p>
                                    <em v-if="webStatus == 550">{{ add.bankName }}</em>
                                    <select v-if="webStatus == 540" name="bank" v-model="apply.loanBankId">
                                        <option v-for="bank in apply.banks" :value="bank.id">{{ bank.bankname }}</option>
                                    </select>
                                </li>
                            </ul>
                            <ul class="module-list module">
                                <li>
                                    <p>配偶</p>
                                    <em>
                                        <button v-for="mate in apply.mates"  @click="getMate(mate.key)" :class="{'active': mate.key == apply.currMate, 'btn-disabled': mate.key < add.currMate}" :disabled="mate.key < add.currMate">{{ mate.value }}</button>
                                    </em>
                                </li>
                                <li>
                                    <p>担保人</p>
                                    <em>
                                        <button v-for="item in apply.guarantees" @click="getGuarantee(item.key)" :class="{'active': item.key == apply.currGuarantee, 'btn-disabled': item.key < add.currGuarantee}" :disabled="item.key < add.currGuarantee">{{ item.value }}</button>
                                    </em>
                                </li>
                            </ul>
                            <p class="explain" @click="kown(true)">身份证上传声明<i class="icon"></i></p>
                            <ul class="module-list"><!-- 借款人 -->
                                <li>
                                    <p class="tit">借款人</p>
                                </li>
                                <li class="uploadImg">
                                    <div>
                                        <span>身份证正面</span>
                                        <p>
                                            <img v-if="!apply.idcardFront" src="/static/images/icon/icon-7.png">
                                            <img v-else="apply.idcardFront" :src="apply.idcardFront">
                                            <input v-if="webStatus == 540" type="file" name="idcardFront" @change="handleFiles">
                                        </p>
                                    </div>
                                    <div>
                                        <span>身份证反面</span>
                                        <p>
                                            <img v-if="!apply.idcardOpposite" src="/static/images/icon/icon-7.png">
                                            <img v-else="apply.idcardOpposite" :src="apply.idcardOpposite">
                                            <input v-if="webStatus == 540" type="file" name="idcardOpposite" @change="handleFiles">
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <span>姓名</span>
                                    <em v-if="webStatus == 550">{{ apply.name }}</em>
                                    <em v-if="webStatus == 540">
                                        <input type="text" placeholder="请输入姓名" v-model="apply.name">
                                    </em>
                                </li>
                                <li>
                                    <span>身份证号</span>
                                    <em v-if="webStatus == 550">{{ apply.identityNo }}</em>
                                    <em v-if="webStatus == 540">
                                        <input type="text" maxlength="18" placeholder="请输入身份证号" v-model="apply.identityNo">
                                    </em>
                                </li>
                                <li>
                                    <span>手机号</span>
                                    <em v-if="webStatus == 550">{{ apply.mobile }}</em>
                                    <em v-if="webStatus == 540">
                                        <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="apply.mobile">
                                    </em>
                                </li>
                            </ul>
                            <ul class="module-list module" v-if="apply.ismarried == 1"><!-- 配偶 -->
                                <li>
                                    <p class="tit">配偶</p>
                                </li>
                                <li class="uploadImg">
                                    <div>
                                        <span>身份证正面</span>
                                        <p>
                                            <img v-if="!apply.spouseIdcardFront" src="/static/images/icon/icon-7.png">
                                            <img v-else="apply.spouseIdcardFront" :src="apply.spouseIdcardFront">
                                            <input v-if="webStatus == 540 || add.canSpouse" type="file" name="spouseIdcardFront" @change="handleFiles">
                                        </p>
                                    </div>
                                    <div>
                                        <span>身份证反面</span>
                                        <p>
                                            <img v-if="!apply.spouseIdcardOpposite" src="/static/images/icon/icon-7.png">
                                            <img v-else="apply.spouseIdcardOpposite" :src="apply.spouseIdcardOpposite">
                                            <input v-if="webStatus == 540 || add.canSpouse" type="file" name="spouseIdcardOpposite" @change="handleFiles">
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <span>姓名</span>
                                    <em v-if="webStatus == 550 && !add.canSpouse">{{ apply.spouseName }}</em>
                                    <em v-if="webStatus == 540 || add.canSpouse">
                                        <input type="text" placeholder="请输入姓名" v-model="apply.spouseName">
                                    </em>
                                </li>
                                <li>
                                    <span>身份证号</span>
                                    <em v-if="webStatus == 550 && !add.canSpouse">{{ apply.spouseIdcard }}</em>
                                    <em v-if="webStatus == 540 || add.canSpouse">
                                        <input type="text" maxlength="18" placeholder="请输入身份证号" v-model="apply.spouseIdcard">
                                    </em>
                                </li>
                                <li>
                                    <span>手机号</span>
                                    <em v-if="webStatus == 550 && !add.canSpouse">{{ apply.spouseMobile }}</em>
                                    <em v-if="webStatus == 540 || add.canSpouse">
                                        <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="apply.spouseMobile">
                                    </em>
                                </li>
                            </ul>
                            <ul class="module-list module" v-if="apply.isguarantee1 == 1"><!-- 担保人1 -->
                                <li>
                                    <p class="tit">担保人1</p>
                                </li>
                                <li class="uploadImg">
                                    <div>
                                        <span>身份证正面</span>
                                        <p>
                                            <img v-if="!apply.guarantor1IdcardFront" src="/static/images/icon/icon-7.png">
                                            <img v-else="apply.guarantor1IdcardFront" :src="apply.guarantor1IdcardFront">
                                            <input v-if="webStatus == 540 || add.canGuarantee1" type="file" name="guarantor1IdcardFront" @change="handleFiles">
                                        </p>
                                    </div>
                                    <div>
                                        <span>身份证反面</span>
                                        <p>
                                            <img v-if="!apply.guarantor1IdcardOpposite" src="/static/images/icon/icon-7.png">
                                            <img v-else="apply.guarantor1IdcardOpposite" :src="apply.guarantor1IdcardOpposite">
                                            <input v-if="webStatus == 540 || add.canGuarantee1" type="file" name="guarantor1IdcardOpposite" @change="handleFiles">
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <span>姓名</span>
                                    <em v-if="webStatus == 550 && !add.canGuarantee1">{{ apply.guarantor1Name }}</em>
                                    <em v-if="webStatus == 540 || add.canGuarantee1">
                                        <input type="text" placeholder="请输入姓名" v-model="apply.guarantor1Name">
                                    </em>
                                </li>
                                <li>
                                    <span>身份证号</span>
                                    <em v-if="webStatus == 550 && !add.canGuarantee1">{{ apply.guarantor1Idcard }}</em>
                                    <em v-if="webStatus == 540 || add.canGuarantee1">
                                        <input type="text" maxlength="18" placeholder="请输入身份证号" v-model="apply.guarantor1Idcard">
                                    </em>
                                </li>
                                <li>
                                    <span>手机号</span>
                                    <em v-if="webStatus == 550 && !add.canGuarantee1">{{ apply.guarantor1Mobile }}</em>
                                    <em v-if="webStatus == 540 || add.canGuarantee1">
                                        <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="apply.guarantor1Mobile">
                                    </em>
                                </li>
                            </ul>
                            <ul class="module-list module" v-if="apply.isguarantee2 == 1"><!-- 担保人2 -->
                                <li>
                                    <p class="tit">担保人2</p>
                                </li>
                                <li class="uploadImg">
                                    <div>
                                        <span>身份证正面</span>
                                        <p>
                                            <img v-if="!apply.guarantor2IdcardFront" src="/static/images/icon/icon-7.png">
                                            <img v-else="apply.guarantor2IdcardFront" :src="apply.guarantor2IdcardFront">
                                            <input v-if="webStatus == 540 || add.canGuarantee2" type="file" name="guarantor2IdcardFront" @change="handleFiles">
                                        </p>
                                    </div>
                                    <div>
                                        <span>身份证反面</span>
                                        <p>
                                            <img v-if="!apply.guarantor2IdcardOpposite" src="/static/images/icon/icon-7.png">
                                            <img v-else="apply.guarantor2IdcardOpposite" :src="apply.guarantor2IdcardOpposite">
                                            <input v-if="webStatus == 540 || add.canGuarantee2" type="file" name="guarantor2IdcardOpposite" @change="handleFiles">
                                        </p>
                                    </div>
                                </li>
                                <li>
                                    <span>姓名</span>
                                    <em v-if="webStatus == 550 && !add.canGuarantee2">{{ apply.guarantor2Name }}</em>
                                    <em v-if="webStatus == 540 || add.canGuarantee2">
                                        <input type="text" placeholder="请输入姓名" v-model="apply.guarantor2Name">
                                    </em>
                                </li>
                                <li>
                                    <span>身份证号</span>
                                    <em v-if="webStatus == 550 && !add.canGuarantee2">{{ apply.guarantor2Idcard }}</em>
                                    <em v-if="webStatus == 540 || add.canGuarantee2">
                                        <input type="text" maxlength="18" placeholder="请输入身份证号" v-model="apply.guarantor2Idcard">
                                    </em>
                                </li>
                                <li>
                                    <span>手机号</span>
                                    <em v-if="webStatus == 550 && !add.canGuarantee2">{{ apply.guarantor2Mobile }}</em>
                                    <em v-if="webStatus == 540 || add.canGuarantee2">
                                        <input type="tel" maxlength="11" placeholder="请输入手机号" v-model="apply.guarantor2Mobile">
                                    </em>
                                </li>
                            </ul>
                            <p class="moduleNotice"><span>*</span>请上传与贷款银行一致的信用授权书、授权书签字照等</p>
                            <p class="tit warrantPhoto">信用查询授权书<b>(若有配偶或担保人，也需上传)</b></p>
                            <ul class="module-list img-list">
                                <li class="uploadImg" v-for="(item, index) in apply.warrantPhotoArr">
                                    <p>
                                        <img :src="item.boldSrc" :data-src="item.src">
                                        <i @click="deleteBox(index)" class="deleteBox"></i>
                                    </p>
                                </li>
                                <li class="uploadImg">
                                    <p>
                                        <input type="file" name="warrantPhoto" @change="handleFiles"/>
                                        <img src="/static/images/pic/camer.png" />
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div v-if="webStatus == 570" class="comSheet"><!-- 待确认：更换银行 -->
                        <p class="moduleNotice"><span>*</span>请及时上传申请材料，以免影响审核进度</p>
                        <ul class="userInfo">
                            <li>
                               <p class="tit">借款人信息</p>
                            </li>
                            <li>配偶:
                                <span v-if="inReview.spouseName">{{ inReview.spouseName }}</span>
                                <span v-else>无</span>
                            </li>
                            <li>担保人:
                                <span v-if="inReview.guarantor1Name">{{ inReview.guarantor1Name }}</span>
                                <span v-else-if="inReview.guarantor2Name">{{ inReview.guarantor2Name }}</span>
                                <span v-else>无</span>
                            </li>
                        </ul>
                        <ul class="module module-list">
                            <li>
                               <p class="tit">更换银行判定</p>
                            </li>
                            <li>
                                <span>原贷款银行</span>
                                <em>{{ sure570.originalBankName }}</em>
                            </li>
                            <li>
                                <span>新贷款银行</span>
                                <em>{{ sure570.loanBankName }}</em>
                            </li>
                        </ul>
                        <div class="module-20">
                            <p class="moduleNotice"><span>*</span>需让借款人重新签署新银行的信用查询材料，并上传</p>
                            <p class="tit warrantPhoto">信用查询授权书<b>(若有配偶或担保人，也需上传)</b></p>
                            <ul class="module-list img-list">
                                <li class="uploadImg" v-for="(item, index) in apply.warrantPhotoArr">
                                    <p>
                                        <img :src="item.boldSrc" :data-src="item.src">
                                        <i @click="deleteBox(index)" class="deleteBox"></i>
                                    </p>
                                </li>
                                <li class="uploadImg">
                                    <p>
                                        <input type="file" name="warrantPhoto" @change="handleFiles"/>
                                        <img src="/static/images/pic/camer.png" />
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div v-if="webStatus == 80" class="module-20"><!-- 待确认：电审关注 --> 
                        <div class="module-list module" v-if="sure80.isAddData == 1">
                            <p class="tit">增补资料</p>
                            <p>{{ sure80.addData }}</p>
                        </div>
                        <ul class="module-list module" v-if="sure80.isSpouse == 1"><!-- 配偶 -->
                            <li>
                                <p class="tit">追加配偶</p>
                                <em>
                                    <i v-if="!sure80.isAgreeSpouse">不</i>同意
                                    <div class="mui-switch mui-active" id="spouse">
                                        <div class="mui-switch-handle"></div>
                                    </div>
                                </em>
                            </li>
                            <li class="uploadImg" v-if="sure80.isAgreeSpouse == 1">
                                <div>
                                    <span>身份证正面</span>
                                    <p>
                                        <img v-if="!apply.spouseIdcardFront" src="/static/images/icon/icon-7.png">
                                        <img v-else="apply.spouseIdcardFront" :src="apply.spouseIdcardFront">
                                        <input type="file" name="spouseIdcardFront" @change="handleFiles">
                                    </p>
                                </div>
                                <div>
                                    <span>身份证反面</span>
                                    <p>
                                        <img v-if="!apply.spouseIdcardOpposite" src="/static/images/icon/icon-7.png">
                                        <img v-else="apply.spouseIdcardOpposite" :src="apply.spouseIdcardOpposite">
                                        <input type="file" name="spouseIdcardOpposite" @change="handleFiles">
                                    </p>
                                </div>
                            </li>
                            <li v-if="sure80.isAgreeSpouse == 1">
                                <span>姓名</span>
                                <em><input type="text" placeholder="请输入姓名" v-model="apply.spouseName"></em>
                            </li>
                            <li v-if="sure80.isAgreeSpouse == 1">
                                <span>身份证号</span>
                                <em><input type="text" maxlength="18" placeholder="请输入身份证号" v-model="apply.spouseIdcard"></em>
                            </li>
                            <li v-if="sure80.isAgreeSpouse == 1">
                                <span>手机号</span>
                                <em><input type="tel" maxlength="11" placeholder="请输入手机号" v-model="apply.spouseMobile"></em>
                            </li>
                        </ul>
                        <ul class="module-list module" v-if="sure80.isGuarantor1 == 1"><!-- 担保人1 -->
                            <li>
                                <p class="tit">追加担保人1</p>
                                <em>
                                    <i v-if="!sure80.isAgreeGuarantee1">不</i>同意
                                    <div class="mui-switch mui-active" id="guarantee1">
                                        <div class="mui-switch-handle"></div>
                                    </div>
                                </em>
                            </li>
                            <li class="uploadImg" v-if="sure80.isAgreeGuarantee1 == 1">
                                <div>
                                    <span>身份证正面</span>
                                    <p>
                                        <img v-if="!apply.guarantor1IdcardFront" src="/static/images/icon/icon-7.png">
                                        <img v-else="apply.guarantor1IdcardFront" :src="apply.guarantor1IdcardFront">
                                        <input type="file" name="guarantor1IdcardFront" @change="handleFiles">
                                    </p>
                                </div>
                                <div>
                                    <span>身份证反面</span>
                                    <p>
                                        <img v-if="!apply.guarantor1IdcardOpposite" src="/static/images/icon/icon-7.png">
                                        <img v-else="apply.guarantor1IdcardOpposite" :src="apply.guarantor1IdcardOpposite">
                                        <input type="file" name="guarantor1IdcardOpposite" @change="handleFiles">
                                    </p>
                                </div>
                            </li>
                            <li v-if="sure80.isAgreeGuarantee1 == 1">
                                <span>姓名</span>
                                <em><input type="text" placeholder="请输入姓名" v-model="apply.guarantor1Name"></em>
                            </li>
                            <li v-if="sure80.isAgreeGuarantee1 == 1">
                                <span>身份证号</span>
                                <em><input type="text" maxlength="18" placeholder="请输入身份证号" v-model="apply.guarantor1Idcard"></em>
                            </li>
                            <li v-if="sure80.isAgreeGuarantee1 == 1">
                                <span>手机号</span>
                                <em><input type="tel" maxlength="11" placeholder="请输入手机号" v-model="apply.guarantor1Mobile"></em>
                            </li>
                        </ul>
                        <ul class="module-list module" v-if="sure80.isGuarantor2 == 1"><!-- 担保人2 -->
                            <li>
                                <p class="tit">追加担保人2</p>
                                <em>
                                    <i v-if="!sure80.isAgreeGuarantee2">不</i>同意
                                    <div class="mui-switch mui-active" id="guarantee2">
                                        <div class="mui-switch-handle"></div>
                                    </div>
                                </em>
                            </li>
                            <li class="uploadImg" v-if="sure80.isAgreeGuarantee2 == 1">
                                <div>
                                    <span>身份证正面</span>
                                    <p>
                                        <img v-if="!apply.guarantor2IdcardFront" src="/static/images/icon/icon-7.png">
                                        <img v-else="apply.guarantor2IdcardFront" :src="apply.guarantor2IdcardFront">
                                        <input type="file" name="guarantor2IdcardFront" @change="handleFiles">
                                    </p>
                                </div>
                                <div>
                                    <span>身份证反面</span>
                                    <p>
                                        <img v-if="!apply.guarantor2IdcardOpposite" src="/static/images/icon/icon-7.png">
                                        <img v-else="apply.guarantor2IdcardOpposite" :src="apply.guarantor2IdcardOpposite">
                                        <input type="file" name="guarantor2IdcardOpposite" @change="handleFiles">
                                    </p>
                                </div>
                            </li>
                            <li v-if="sure80.isAgreeGuarantee2 == 1">
                                <span>姓名</span>
                                <em><input type="text" placeholder="请输入姓名" v-model="apply.guarantor2Name"></em>
                            </li>
                            <li v-if="sure80.isAgreeGuarantee2 == 1">
                                <span>身份证号</span>
                                <em><input type="text" maxlength="18" placeholder="请输入身份证号" v-model="apply.guarantor2Idcard"></em>
                            </li>
                            <li v-if="sure80.isAgreeGuarantee2 == 1">
                                <span>手机号</span>
                                <em><input type="tel" maxlength="11" placeholder="请输入手机号" v-model="apply.guarantor2Mobile"></em>
                            </li>
                        </ul>
                        <p v-if="sure80.isAgreeSpouse || sure80.isAgreeGuarantee2 || sure80.isAgreeGuarantee1 " class="tit warrantPhoto">信用查询授权书<b>(若有配偶或担保人，也需上传)</b></p>
                        <ul v-if="sure80.isAgreeSpouse || sure80.isAgreeGuarantee2 || sure80.isAgreeGuarantee1"  class="module-list img-list">
                            <li class="uploadImg" v-for="(item, index) in apply.warrantPhotoArr">
                                <p>
                                    <img :src="item.boldSrc" :data-src="item.src">
                                    <i @click="deleteBox(index)" class="deleteBox"></i>
                                </p>
                            </li>
                            <li class="uploadImg">
                                <p>
                                    <input type="file" name="warrantPhoto" @change="handleFiles"/>
                                    <img src="/static/images/pic/camer.png" />
                                </p>
                            </li>
                        </ul>
                        <ul class="module-list module" v-if="sure80.isGps == 1">
                            <li>
                                <p class="tit">加装GPS</p>
                                <em>
                                    <i v-if="!sure80.isAgreeGPS">不</i>同意
                                    <div class="mui-switch mui-active" id="gps">
                                        <div class="mui-switch-handle"></div>
                                    </div>
                                </em>
                            </li>
                            <li v-if="sure80.isAgreeGPS == 1">
                                <p>加装个数</p>
                                <em><button v-for="item in sure80.gpsLists" @click="getGps(item.num)" :class="{active: sure80.gpsNum == item.num}">{{ item.num }}</button></em>
                            </li>
                            <li v-if="sure80.isAgreeGPS == 1">
                                <p>收费方式<b>({{ sure80.GPSTotalPrice }}元)</b></p>
                                <em><button v-for="item in sure80.mtc" @click="getMTC(item.value,item.key)" :class="{active: sure80.mtcWay == item.value}">{{ item.value }}</button></em>
                            </li>
                        </ul>
                        <ul class="module-list module" v-if="sure80.isMortgage == 1">
                            <li>
                                <p class="tit">追加抵押押金</p>
                                <em>
                                    <i v-if="!sure80.isAgreeMortgage">不</i>同意
                                    <div class="mui-switch mui-active" id="mortgage">
                                        <div class="mui-switch-handle"></div>
                                    </div>
                                </em>
                            </li>
                            <li v-if="sure80.isAgreeMortgage == 1">
                                <span>标准收费：{{ sure80.isMortgageAmount }}元</span>
                                <em class="notice"><span>*</span>若想调整金额可发起沟通单</em>
                            </li>
                        </ul>
                        <ul class="module-list module" v-if="sure80.isLicense == 1">
                            <li>
                                <p class="tit">追加驾照押金</p>
                                <em>
                                    <i v-if="!sure80.isAgreeDrive">不</i>同意
                                    <div class="mui-switch mui-active" id="drive">
                                        <div class="mui-switch-handle"></div>
                                    </div>
                                </em>
                            </li>
                            <li v-if="sure80.isAgreeDrive == 1">
                                <span>标准收费：2000元</span>
                                <em class="notice"><span>*</span>若想调整金额可发起沟通单</em>
                            </li>
                        </ul>
                        <ul class="module-list module" v-if="sure80.isFirstRate == 1">
                            <li>
                                <p class="tit">调整首付比例</p>
                                <em>
                                    <i v-if="!sure80.isAgreeRatio">不</i>同意
                                    <div class="mui-switch mui-active" id="ratio">
                                        <div class="mui-switch-handle"></div>
                                    </div>
                                </em>
                            </li>
                            <li v-if="sure80.isAgreeRatio == 1">
                                <span>新首付比例：{{ sure80.standardFirstRate }}%</span>
                            </li>
                            <li v-if="sure80.isAgreeRatio == 1">
                                <span>新首付款：{{ sure80.newFirstPay }}元</span>
                            </li>
                            <li v-if="sure80.isAgreeRatio == 1">
                                <span>新贷款额：{{ sure80.newDebitAmount }}元</span>
                            </li>
                            <li v-if="!sure80.isAgreeRatio">
                                <span>新首付比例(%)</span>
                                <em><input type="tel" placeholder="请输入" name="inputFirstRate" @change="autoCalc" v-model="sure80.inputFirstRate"></em>
                            </li>
                            <li v-if="!sure80.isAgreeRatio">
                                <span>期望贷款额(元)</span>
                                <em><input type="tel" placeholder="请输入" name="inputDebitAmount" @change="autoCalc" v-model="sure80.inputDebitAmount"></em>
                            </li>
                            <li v-if="!sure80.isAgreeRatio">
                                <span>期望首付款(元)</span>
                                <em><input type="tel" placeholder="请输入" name="inputFirstPay" @change="autoCalc" v-model="sure80.inputFirstPay"></em>
                            </li>
                        </ul>
                    </div>

                    <div v-if="webStatus == 90" class="comSheet"><!-- 待确认：车价判定 -->
                        <ul class="module userInfo">
                            <li>
                               <p class="tit">原贷款信息</p>   
                            </li>
                            <li>车价：
                                <span v-if="sure90.carPrice && sure90.carPrice != 0">{{ sure90.carPrice }}元</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>首付款：
                                <span v-if="sure90.firstPay && sure90.firstPay != 0">{{ sure90.firstPay }}元</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>首付比例：
                                <span v-if="sure90.firstScale && sure90.firstScale != 0">{{ sure90.firstScale }}%</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>贷款额：
                                <span v-if="sure90.debitAmount && sure90.debitAmount != 0">{{ sure90.debitAmount }}元</span>
                                <span v-else>(暂无)</span>
                            </li>
                        </ul>
                        <ul class="module-list module moduleLastUl">
                            <li>
                                <p class="tit">车价变更判定</p>
                                <em>
                                    <i v-if="sure90.isAgreeCarprice != 1">不</i>同意
                                    <div class="mui-switch mui-active" id="carPrice">
                                        <div class="mui-switch-handle"></div>
                                    </div>
                                </em>
                            </li>
                            <li> 
                                <span>新车价(元)</span>
                                <em>{{ sure90.newCarPrice }}</em>
                            </li>
                            <li>
                                <span>新首付款(元)</span>
                                <em v-if="sure90.isAgreeCarprice == 1">{{ sure90.newFirstPay }}</em>
                                <em v-else>
                                    <input type="tel" name="inputFirstPay" placeholder="请输入" @change="autoCalc" v-model="sure90.inputFirstPay">
                                </em>
                            </li>
                            <li>
                                <span>新首付比例(%)</span>
                                <em v-if="sure90.isAgreeCarprice == 1">{{ sure90.newFirstScale }}</em>
                                <em v-else>
                                    <input type="tel" name="inputFirstScale" placeholder="请输入" @change="autoCalc" v-model="sure90.inputFirstScale">
                                </em>
                            </li>
                            <li>
                                <span>新贷款额(元)</span>
                                <em v-if="sure90.isAgreeCarprice == 1">{{ sure90.newDebitAmount }}</em>
                                <em v-else>
                                    <input type="tel" name="inputDebitAmount" placeholder="请输入" @change="autoCalc" v-model="sure90.inputDebitAmount">
                                </em>
                            </li>
                        </ul>
                    </div>

                    <div v-if="webStatus == 190" class="module-190"><!-- 待收费状态 -->
                        <p class="moduleNotice">
                            <span>*</span>请在打款后{{ charge.timeLimit }}小时内，将购车发票、车险保单、合格证等所需材料上传或寄送，超时将全款退资！
                        </p>
                        <ul class="module-list loanInfo">
                            <li>
                                <p class="tit">放款信息</p>
                            </li>
                            <li><p>贷款金额：{{ charge.debitAmount }} 元</p></li>
                            <li><p>打款日期：{{ charge.paymentTime }}</p></li>
                            <li><p>收款单位：{{ charge.merchantName }}</p></li>
                            <li class="img"><img src="/static/images/pic/seal.png"></li>
                        </ul>
                        <p class="moduleNotice"><span>*</span>请在打款后24小时内，向客户收取费用并转账到中茗</p>
                        <ul class="module-list loanItems">
                            <li>
                                <p class="tit">收费项目</p>
                                <p class="tit">总计(元)：{{ charge.totalReceivable }}</p>
                            </li>
                            <li v-if="charge.guaranteeReceivable != 0">
                                <p>担保费(元)</p>
                                <span>{{ charge.guaranteeReceivable }}</span>
                            </li>
                            <li v-if="charge.mortgageReceivable != 0">
                                <p>公证抵押(元)</p>
                                <span>{{ charge.mortgageReceivable }}</span>
                            </li>
                            <li v-if="charge.gpsReceivable != 0">
                                <p>GPS(元)</p>
                                <span>{{ charge.gpsReceivable }}</span>
                            </li>
                            <li v-if="charge.licenseReceivable != 0">
                                <p>驾照押金(元)</p>
                                <span>{{ charge.licenseReceivable }}</span>
                            </li>
                            <li v-if="charge.depositReceivable != 0">
                                <p>抵押押金(元)</p>
                                <span>{{ charge.depositReceivable }}</span>
                            </li>

                            <li v-if="charge.bondReceivable != 0">
                                <p>履约保证金(元)</p>
                                <span>{{ charge.bondReceivable }}</span>
                            </li>
                            <li v-if="charge.otherReceivable != 0">
                                <p>其他(元)</p>
                                <span>{{ charge.otherReceivable }}</span>
                            </li>
                            <li v-if="charge.otherReceivable > 0 && charge.otherMemo != ''">
                                <span>其他：{{ charge.otherMemo }}</span>
                            </li>
                        </ul>
                        <ul class="module-list module">
                            <li>
                                <p class="tit">转账信息</p>
                            </li>
                            <li>
                                <span>转账金额(元)</span>
                                <em>
                                    <input type="number" placeholder="请输入" v-model="charge.transferAmount">
                                </em>
                            </li>
                            <li class="mui-btn mui-btn-block simulation-select one">
                                <span>转账到中茗日期</span>
                                <em @click="getTime">
                                    {{ charge.transferDate }}<img src="/static/images/svg/next.svg">
                                </em>
                            </li>
                        </ul>
                        <div class="text moduleLastUl">
                            <textarea placeholder="请输入备注信息" v-model='charge.salesmanSubmitRemark'></textarea>
                        </div>
                    </div>

                    <div v-if="webStatus == 140" class="module-140"><!-- 已放款状态 -->
                        <p class="notice">
                            <span>*</span>请在打款后{{ module140.timeLimit }}小时内，将购车发票、车险保单、合格证等所需材料上传或寄送，超时将全款退资！
                        </p>
                        <ul class="module-list loanInfo">
                            <li>
                                <p class="tit">放款信息</p>
                            </li>
                            <li><p>贷款金额：{{ module140.loanAmount }} 元</p></li>
                            <li><p>打款日期：{{ module140.padTime }}</p></li>
                            <li><p>收款单位：{{ module140.accountName }}</p></li>
                            <li class="img"><img src="/static/images/pic/seal.png"></li>
                        </ul>
                        <ul class="module-list loanInfo module" v-if="module140.isBack == 1">
                            <li>
                                <p class="tit">退资信息</p>
                                <span v-if="module140.loanStatus < 4">待退款</span>
                                <span v-else>已退款</span>
                            </li>
                            <li><p>*因发票价格低于原车价，贷款额降低，需退款</p></li>
                            <li><p>应退车款：{{ module140.returnActual }}</p></li>
                            <li><p>新贷款金额：{{ module140.newLoanAmount }}</p></li>
                        </ul>
                        <ul class="module module-list">
                            <li @click="gotoAddress('../orders/chargeDetail.html')">
                                <span>收费详细</span>
                                <em v-if="module140.status == 41">
                                    未确认到账<img src="/static/images/svg/next.svg">
                                </em>
                                <em v-if="module140.status == 5">
                                    已确认到账<img src="/static/images/svg/next.svg">
                                </em>
                            </li>
                        </ul>
                    </div>

                    <div v-if="webStatus == 590" class="module-140"><!-- 待抵押状态 -->
                        <p class="notice" style="padding-bottom: 0"></p>
                        <ul class="module-list loanInfo">
                            <li>
                                <p class="tit">放款信息</p>
                            </li>
                            <li><p>贷款金额：{{ module140.loanAmount }} 元</p></li>
                            <li><p>打款日期：{{ module140.padTime }}</p></li>
                            <li><p>收款单位：{{ module140.accountName }}</p></li>
                            <li class="img"><img src="/static/images/pic/seal.png"></li>
                        </ul>
                        <ul class="module-list loanInfo module" v-if="module140.isBack == 1">
                            <li>
                                <p class="tit">放款信息</p>
                                <span v-if="module140.loanStatus < 4">待退款</span>
                                <span v-else>已退款</span>
                            </li>
                            <li><p>*因发票价格低于原车价，贷款额降低，需退款</p></li>
                            <li><p>应退车款：{{ module140.returnActual }}</p></li>
                            <li><p>新贷款金额：{{ module140.newLoanAmount }}</p></li>
                        </ul>
                        <ul class="module module-list">
                            <li @click="gotoAddress('/orderList/comSheetDetail')">
                                <span>收费详细</span>
                                <em v-if="module140.status == 41">未确认到账<img src="/static/images/svg/next.svg"></em>
                                <em v-if="module140.status == 5">已确认到账<img src="/static/images/svg/next.svg"></em>
                            </li>
                        </ul>
                        <ul class="module-list module">
                            <li>
                                <p class="tit">抵押信息</p>
                            </li>
                            <li>
                                <span>车牌号</span>
                                <em>
                                    <input type="text" placeholder="请输入" maxlength="10" v-model="mortgage.carNum">
                                </em>
                            </li>
                            <li class="mui-btn mui-btn-block simulation-select one">
                                <span>抵押材料寄送日期</span>
                                <em @click="getTime">
                                    {{ mortgage.sendDate }}<img src="/static/images/svg/next.svg">
                                </em>
                            </li>
                        </ul>
                        <div class="text moduleLastUl">
                            <textarea placeholder="请输入备注信息" v-model='charge.salesmanSubmitRemark'></textarea>
                        </div>
                    </div>

                    <div v-if="webStatus == 600 || webStatus == 610 || webStatus == 620" class="comSheet module-140"><!-- 已完成 -->
                        <p class="notice" style="padding-bottom: 0"></p>
                        <ul class="userInfo loanInfo">
                            <li>
                               <p class="tit">放款信息</p>
                            </li>
                            <li>贷款金额：
                                <span v-if="offOrder.debitAmount  && offOrder.debitAmount != 0">{{ offOrder.debitAmount }}元</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>打款日期：
                                <span v-if="offOrder.payTime  && offOrder.payTime != 0">{{ offOrder.payTime }}</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>收款单位：
                                <span v-if="offOrder.merchantName && offOrder.merchantName != 0">{{ offOrder.merchantName }}</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>贷款银行：
                                <span v-if="offOrder.debitBankName && offOrder.debitBankName != 0">{{ offOrder.debitBankName }}</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>贷款期限：
                                <span v-if="offOrder.debitPeriod && offOrder.debitPeriod != 0">{{ offOrder.debitPeriod }}月</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li class="img" v-if="webStatus == 620"><img src="/static/images/pic/paidOff.png"></li>
                        </ul>
                        <ul class="module module-list" v-if="offOrder.loanInfoStatus == 1 && webStatus == 600" >
                            <li @click="gotoAddress('/orderList/orderBill')">
                                <span>客户分期账单</span>
                                <em>查看<img src="/static/images/svg/next.svg"></em>
                            </li>
                        </ul>
                    </div>

                    <div v-if="webStatus == 50 || webStatus == 110 || webStatus == 160 || webStatus == 630" class="comSheet closed"><!-- 已关闭 -->
                        <p v-if="webStatus == 630" class="moduleNotice" style="text-align: center">同一客户重复申请被审核不通过</p>
                        <ul class="userInfo module" v-if="webStatus == 160">
                            <li>
                               <p class="tit">退资信息</p>
                            </li>
                            <li>已退车款:
                                <span v-if="closed.debitAmount && closed.debitAmount != 0">{{ closed.debitAmount }}元</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>退款日期：
                                <span v-if="closed.payTime && closed.payTime != 0">{{ closed.payTime }}</span>
                                <span v-else>(暂无)</span>
                            </li>
                            <li>收款单位：
                                <span v-if="closed.merchantName && closed.merchantName != 0">{{ closed.merchantName }}</span>
                                <span v-else>(暂无)</span>
                            </li>
                        </ul>
                        <img class="closeImg" src="/static/images/pic/fail.png">
                    </div>
                </section>
            </div>
        </div>
        <div class="opration" v-if="webStatus == 10 || webStatus == 510"> <!-- 征信中 -->
            <button v-if="apply.step == 1" @click="setStep(1)">下一步</button>
            <button v-if="apply.step == 2" @click="setStep(2)">上一步</button>
            <button v-if="apply.step == 2" class="submit" @click="btn">提交</button>
        </div>
        <div class="opration" @click="btn" v-if="webStatus == 590 || webStatus == 540 || webStatus == 190 || webStatus == 550 || webStatus == 570 || webStatus == 80 || webStatus == 90">
            <button>{{ btnMsg }}</button>
        </div>
        <div class="box" v-if="apply.flag">
            <div>
                <p class="con">
                    <b>拍摄说明</b>
                    <span>将证件置于平面上，手机横向与证件平行拍摄，保证证件的四边全部入境，且内容清晰可见。</span>
                </p>
                <img src="/static/images/pic/explain.png">
                <p class="con">
                    <b>证件说明</b>
                    <span>若身份证遗失或过期，请上传【临时身份证】和【身份证补办申领回单】照片。</span>
                </p>
                <p class="kown" @click="kown(false)">知道了</p>
            </div>
        </div>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view> 
        </transition>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast, MessageBox, Indicator, Switch } from 'mint-ui'
    import { mobileValidate, identification, getQueryString, formatDay, getWebStatus, formatCurrency1 } from '@/js/common'
    export default {
        name: 'orderDetail',
        data() {
            return {
                hangup: {    //挂起补录
                    isHangUp: "",
                    guarantor1IsHangUp: "",
                    guarantor2IsHangUp: "",
                    spouseIsHangUp: ""
                },

                //对应的流程节点
                statusArr : [
                    {'code': '520', 'status': 2},
                    {'code': '510', 'status': 1},
                    {'code': '10', 'status': 1},
                    {'code': '530', 'status': 2},
                    {'code': '540', 'status': 2},
                    {'code': '550', 'status': 2},
                    {'code': '130', 'status': 3},
                    {'code': '190', 'status': 4},
                    {'code': '140', 'status': 4},
                    {'code': '590', 'status': 5},
                    {'code': '600', 'status': 5},
                    {'code': '610', 'status': 5},
                    {'code': '620', 'status': 5},
                    {'code': '50', 'status': 2},
                    {'code': '110', 'status': 3},
                    {'code': '160', 'status': 4},
                    {'code': '630', 'status': 1},
                    {'code': '560', 'status': 3},
                    {'code': '570', 'status': 3},
                    {'code': '80', 'status': 3},
                    {'code': '90', 'status': 3},
                    {'code': '580', 'status': 3}
                ],
                statusCurr : "",
                webStatus : '',
                btnMsg: "提交",

                //topAera字段
                userName: "",
                userCode: "",
                memo: "",
                id: "",
                userId: "",
                loanDepartmentId: "", //贷款部门id
                status: "",

                //图片上传字段
                maxsize                 : 100 * 1024,
                files                   : "",
                file                    : "",
                formData                : "",

                //apply页面相关
                apply: {
                    flag: false,
                    step: 1,
                    name                    : "", //借款人
                    identityNo              : "",
                    mobile                  : "",
                    idcardFront             : "",
                    idcardOpposite          : "",
                    ismarried               : "",  //配偶
                    isguarantee1            : "",  //担保人1
                    isguarantee2            : "",  //担保人2
                    spouseName              : "", //配偶
                    spouseIdcard            : "",
                    spouseIdcardFront       : "",
                    spouseIdcardOpposite    : "",
                    spouseMobile            : "",
                    guarantor1Name          : "", //担保人1
                    guarantor1Idcard        : "",
                    guarantor1IdcardFront   : "",
                    guarantor1IdcardOpposite: "",
                    guarantor1Mobile        : "",
                    guarantor2Name          : "", //担保人2
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
                    currMate                 : "",
                    currGuarantee            : "",
                    UserDepartments          : "",
                    salesmans                : "",
                    agentId                  : "",
                    loanBankId               : "",
                    loanDepartmentId         : "", //业务部
                    carTypes                 : "",
                    currCarTypeId            : "",
                    carType                  : "", //车辆属性
                    carBrand                 : "", //汽车品牌
                    carModel                 : "", //车型
                    carPrice                 : "", //车价
                    merchant                 : "", //经销商
                    loanApplyId              : "",  //贷款申请id
                    authorityId              : "",
                    agentName                : "",
                    banks                    : "",   //贷款银行
                    version: "",
                    loanCarInfoId: ""
                },

                //待追加 550
                add: {
                    currMate: "",
                    currGuarantee: "",
                    departName: "",
                    bankName: "",
                    agentName: "",
                    canSpouse: false,
                    canGuarantor2: false,
                    canGuarantor1: false,
                },

                //待确认-电审关注80
                sure80: {
                    isAgreeSpouse: "",
                    isAgreeGuarantee1: "",
                    isAgreeGuarantee2: "",
                    isAgreeGPS: "",
                    isAgreeMortgage: "",
                    isAgreeDrive: "",
                    isAgreeRatio: "",
                    isAgreeAddData: "",

                    isAddData: "",   //是否增补资料
                    isFirstRate: "", //业务员期望首付比例
                    isGps: "",
                    isGuarantor1: "",
                    isGuarantor2: "",
                    isLicense: "",  //是否追加驾照押金
                    isMortgage: "", //是否追加抵押金额
                    isSpouse: "",   //是否增加配偶
                    gpsLists:[
                        {'num': 1},
                        {'num': 2}
                    ],
                    mtc:[
                        {'value': '收取现金', 'key': 0},
                        {'value': '调整利率', 'key': 1}
                    ],
                    gpsNum: '',       //gps数目
                    GPSUnitPrice: '', //gps单价
                    GPSTotalPrice: '',//gps总价
                    mtcWay: "",       //收费方式
                    isMortgageAmount: "",  //抵押押金
                    standardFirstRate: "", //新首付比例
                    newFirstPay: "",       //新首付款
                    newDebitAmount: "",    //新贷款额
                    carPrice: "",          //车价

                    debitFirstRate : "",
                    salesmanFeedbackOpinion : "",
                    firstScale : "",
                    addData : "",
                    rateAdjustment : "",

                    inputFirstRate: "",
                    inputDebitAmount: "",
                    inputFirstPay: "",
                },

                //待确认-更换银行 570
                sure570: {
                    originalBankName: "" ,// 原贷款银行
                    loanBankName: "",     // 新贷款银行
                },

                //待确认-车价判定 90
                sure90: {
                    firstPay: "",
                    firstScale: "",
                    carPrice: "",
                    debitAmount: "",
                    newFirstPay: "",
                    newFirstScale: "",
                    newCarPrice: "",
                    newDebitAmount: "",
                    isAgreeCarprice: 1,
                    id: "",
                    loanApplyId: "",
                    salemanIsAgree: 1 ,
                    newActualAmount: "",
                    inputFirstRate: "",
                    inputDebitAmount: "",
                    inputFirstPay: "",
                    newBaseRate: "",
                    newRate: "",
                    newPayMonth: "",
                    newBankInstallmentFee: "",
                    newTotalPayAmount: "",
                    newRebate: ""
                },

                //征信通过，审核中 530
                inReview: {
                    spouseName: "",
                    guarantor1Name: "",
                    guarantor2Name: "",
                    firstPay: "",
                    firstScale: "",
                    carPrice: "",
                    debitAmount: "",
                    loanCommunication: "", //判断是否有沟通单
                    confirmStatus: "", //0-未 1-已
                    loanBankName: "",
                    originalBankName: "",
                    comStatus: "",
                },

                //待收费 190
                charge: {
                    loanApplyId: "",
                    id: "",
                    transferAmount: "",
                    transferDate: "",
                    salesmanSubmitRemark: "",
                    debitAmount: "",
                    paymentTime: "",
                    merchantName: "",
                    guaranteeReceivable: "",
                    mortgageReceivable: "",
                    gpsReceivable: "",
                    depositReceivable: "",
                    bondReceivable: "",
                    otherReceivable: "",
                    licenseReceivable: "",
                    totalReceivable: "",
                    otherMemo: "",
                    timeLimit: ""
                },

                //已放款状态
                module140 : {
                    loanAmount : "",
                    padTime : "",
                    accountName : "",
                    timeLimit: "",
                    status: "",
                    isBack: "",
                    returnActual: "", //应退车款
                    newLoanAmount: "",//新贷款金额
                    loanStatus: ""
                },

                //待抵押
                mortgage: {
                    carNum: "",
                    remark: "",
                    sendDate: ""
                },

                //已完成
                offOrder: {
                    debitAmount: "",
                    payTime: "",
                    merchantName: "",
                    debitBankName: "",
                    debitPeriod:"",
                    repayment: "",
                    loanInfoStatus: "" //判断分期账单是否生成
                },

                //已关闭-160: 全额退资
                closed: {
                    debitAmount: "",
                    payTime: "",
                    merchantName: "", 
                }
            }
        },
        components: {
            headTop
        },
        methods: {
            gotoAddress (path) {
                this.$router.push(path);
            },
            init () {
                var currRow = JSON.parse(localStorage.getItem("currRow"));
                if (currRow) {
                    this.getInfo(currRow);
                } else {  //来自消息
                    var id = getQueryString("id");
                    this.getWebstatus(id);
                }
            },
            getInfo: function (currRow) {
                console.log(currRow)
                //挂起补录 
                this.hangup.isHangUp = currRow.isHangUp;
                this.hangup.guarantor1IsHangUp = currRow.guarantor1IsHangUp;
                this.hangup.guarantor2IsHangUp = currRow.guarantor2IsHangUp;
                this.hangup.spouseIsHangUp = currRow.spouseIsHangUp;

                this.userName = currRow.user.name;
                this.userCode = currRow.user.userCode;
                this.webStatus = currRow.webStatus;
                this.memo = currRow.memo;
                this.id = currRow.id;
                this.userId = currRow.userId;
                this.loanDepartmentId = currRow.loanDepartmentId;
                this.status = currRow.status;
                this.apply.version                  = currRow.version;
                this.apply.name                     = currRow.user.name; //借款人
                this.apply.identityNo               = currRow.user.identityNo;
                this.apply.mobile                   = currRow.user.userCode;
                this.apply.idcardFront              = currRow.idcardFront;
                this.apply.idcardOpposite           = currRow.idcardOpposite;
                this.apply.spouseName               = currRow.spouseName; //配偶
                this.apply.spouseIdcard             = currRow.spouseIdcard;
                this.apply.spouseIdcardFront        = currRow.spouseIdcardFront;
                this.apply.spouseIdcardOpposite     = currRow.spouseIdcardOpposite;
                this.apply.spouseMobile             = currRow.spouseMobile;
                this.apply.guarantor1Name           = currRow.guarantor1Name; //担保人1
                this.apply.guarantor1Idcard         = currRow.guarantor1Idcard;
                this.apply.guarantor1IdcardFront    = currRow.guarantor1IdcardFront;
                this.apply.guarantor1IdcardOpposite = currRow.guarantor1IdcardOpposite;
                this.apply.guarantor1Mobile         = currRow.guarantor1Mobile;
                this.apply.guarantor2Name           = currRow.guarantor2Name; //担保人2
                this.apply.guarantor2Idcard         = currRow.guarantor2Idcard;
                this.apply.guarantor2IdcardFront    = currRow.guarantor2IdcardFront;
                this.apply.guarantor2IdcardOpposite = currRow.guarantor2IdcardOpposite;
                this.apply.guarantor2Mobile         = currRow.guarantor2Mobile;

                if (currRow.warrantPhoto) {
                    var warrantPhoto = currRow.warrantPhoto.split(',');
                    for(var i = 0; i < warrantPhoto.length; i++) {
                        var obj = {};
                        obj.src = warrantPhoto[i];
                        obj.boldSrc = warrantPhoto[i];
                        this.apply.warrantPhotoArr.push(obj);
                    }
                }

                var that = this;
                setTimeout(function () {
                    that.apply.loanBankId = currRow.loanBankId;
                    that.apply.loanDepartmentId = currRow.loanDepartmentId;
                }, 200)

                if (this.apply.spouseIdcard) {
                    this.apply.ismarried = this.apply.currMate = 1;
                    if (this.webStatus == 550) {
                        this.add.currMate = 1;
                    }
                } else {
                    this.apply.ismarried = this.apply.currMate = 0;
                    if (this.webStatus == 550) {
                        this.add.currMate = 0;
                    }
                }
                if (this.apply.guarantor1Idcard) {
                    this.apply.isguarantee1 = 1;
                } else {
                    this.apply.isguarantee1 = 0;
                }
                if (this.apply.guarantor2Idcard) {
                    this.apply.isguarantee2 = 1;
                } else {
                    this.apply.isguarantee2 = 0;
                }
                if (!this.apply.isguarantee1 && !this.apply.isguarantee2) {
                    this.apply.currGuarantee = 0;
                    if (this.webStatus == 550) {
                        this.add.currGuarantee = 0;
                    }
                } else if (this.apply.isguarantee1 && this.apply.isguarantee2) {
                    this.apply.currGuarantee = 2;
                    if (this.webStatus == 550) {
                        this.add.currGuarantee = 2;
                    }
                } else {
                    this.apply.currGuarantee = 1;
                    if (this.webStatus == 550) {
                        this.add.currGuarantee = 1;
                    }
                }

                if (this.webStatus == 10 || this.webStatus == 510) {
                    if (currRow.loanCarInfo) {
                        this.apply.carType = currRow.loanCarInfo.carType;
                        this.apply.carBrand = currRow.loanCarInfo.carBrand;
                        this.apply.carModel = currRow.loanCarInfo.carModel;
                        this.apply.carPrice = currRow.loanCarInfo.carPrice;
                        this.apply.merchant = currRow.loanCarInfo.merchant;
                        this.apply.currCarTypeId = currRow.loanCarInfo.carType;
                        this.apply.loanCarInfoId = currRow.loanCarInfo.id;
                    }
                    this.getUserDepartment();
                    this.getBank();
                } else if (this.webStatus == 160 || this.webStatus == 620 ||this.webStatus == 610 || this.webStatus == 600 || this.webStatus == 570 || this.webStatus == 90|| this.webStatus == 140) {
                    this.operateOrderDetailInfo();
                } else if (this.webStatus == 530 || this.webStatus == 580 || this.webStatus == 130) {
                    this.operateOrderDetailInfo();
                    this.communicate();
                } else if (this.webStatus == 80) {  //待确认
                    this.apply.spouseName               = "";
                    this.apply.spouseIdcard             = "";
                    this.apply.spouseIdcardFront        = "";
                    this.apply.spouseIdcardOpposite     = "";
                    this.apply.spouseMobile             = "";
                    this.apply.guarantor1Name           = "";
                    this.apply.guarantor1Idcard         = "";
                    this.apply.guarantor1IdcardFront    = "";
                    this.apply.guarantor1IdcardOpposite = "";
                    this.apply.guarantor1Mobile         = "";
                    this.apply.guarantor2Name           = "";
                    this.apply.guarantor2Idcard         = "";
                    this.apply.guarantor2IdcardFront    = "";
                    this.apply.guarantor2IdcardOpposite = "";
                    this.apply.guarantor2Mobile         = "";
                    this.operateOrderDetailInfo();
                    this.getGpsPrice();
                } else if (this.webStatus == 540) {
                    this.getUserDepartment();
                    this.getBank();
                } else if (this.webStatus == 550) {
                    this.apply.loanBankId = currRow.loanBankId;
                    this.apply.loanDepartmentId = currRow.loanDepartmentId;
                    this.add.agentName = currRow.agentName;
                    this.add.agentId = currRow.agentId;
                    this.getUserDepartment();
                    this.getBank();
                } else if (this.webStatus == 190) {
                    this.operateOrderDetailInfo();
                    this.btnMsg = "费用已收，提交";
                } else if (this.webStatus == 590) {
                    this.operateOrderDetailInfo();
                    this.btnMsg = "抵押已办理，提交";
                }

                //小圆点是显示
                if (this.webStatus) {
                    for (var i = 0; i < this.statusArr.length; i++) {
                        if (this.webStatus == this.statusArr[i].code) {
                            this.statusCurr = this.statusArr[i].status;
                        }
                    }
                }
            },
            operateOrderDetailInfo () { 
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentLoanApply/user/operateOrderDetailInfo.htm',
                    params: {
                        loanApplyId: that.id,
                        webStatus: that.webStatus
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        if (datas.data.communicationInfo) {
                            that.inReview.spouseName = datas.data.communicationInfo.spouseName;
                            that.inReview.guarantor1Name = datas.data.communicationInfo.guarantor1Name;
                            that.inReview.guarantor2Name = datas.data.communicationInfo.guarantor2Name;
                        }

                        if (that.webStatus == 530 || that.webStatus == 580 || that.webStatus == 130) {
                            if (datas.data.communicationInfo) {
                                that.inReview.firstPay = formatCurrency1(datas.data.communicationInfo.cust.firstPay);
                                that.inReview.firstScale = datas.data.communicationInfo.cust.firstScale;
                                that.inReview.carPrice = formatCurrency1(datas.data.communicationInfo.cust.carPrice);
                                that.inReview.debitAmount = formatCurrency1(datas.data.communicationInfo.cust.debitAmount);
                                that.inReview.loanCommunication = datas.data.communicationInfo.loanCommunication;
                                if (that.inReview.loanCommunication) {
                                    that.inReview.confirmStatus = datas.data.communicationInfo.loanCommunication.status;
                                }
                                that.inReview.originalBankName = datas.data.communicationInfo.originalBankName;
                                that.inReview.loanBankName = datas.data.communicationInfo.loanBankName;
                                var communicationInfo = datas.data.communicationInfo;
                                localStorage.setItem('communicationInfo', communicationInfo);
                            }
                        } else if (that.webStatus == 570) {
                            if (datas.data.communicationInfo) {
                                that.sure570.originalBankName = datas.data.communicationInfo.originalBankName;
                                that.sure570.loanBankName = datas.data.communicationInfo.loanBankName;
                            }
                        } else if (that.webStatus == 80) {
                            if (datas.data.loanApplyVerifyInfo) {
                                that.sure80.isAgreeAddData =that.sure80.isAddData = datas.data.loanApplyVerifyInfo.audit.isAddData;
                                that.sure80.isAgreeRatio =that.sure80.isFirstRate = datas.data.loanApplyVerifyInfo.audit.isFirstRate;
                                that.sure80.isAgreeGPS = that.sure80.isGps = datas.data.loanApplyVerifyInfo.audit.isGps;
                                that.sure80.isAgreeGuarantee1 = that.sure80.isGuarantor1 = datas.data.loanApplyVerifyInfo.audit.isGuarantor1;
                                that.sure80.isAgreeGuarantee2 = that.sure80.isGuarantor2 = datas.data.loanApplyVerifyInfo.audit.isGuarantor2;
                                that.sure80.isAgreeDrive = that.sure80.isLicense = datas.data.loanApplyVerifyInfo.audit.isLicense;
                                that.sure80.isAgreeMortgage = that.sure80.isMortgage = datas.data.loanApplyVerifyInfo.audit.isMortgage;
                                that.sure80.isAgreeSpouse = that.sure80.isSpouse = datas.data.loanApplyVerifyInfo.audit.isSpouse;

                                //为0的项目传空过去
                                if (that.sure80.isFirstRate == 0) { that.sure80.isAgreeRatio = "";} 
                                if (that.sure80.isGps == 0) {  that.sure80.isAgreeGPS = "";}
                                if (that.sure80.isGuarantor1 == 0) { that.sure80.isAgreeGuarantee1 = "";} 
                                if (that.sure80.isGuarantor2 == 0) {that.sure80.isAgreeGuarantee2 = "";} 
                                if (that.sure80.isLicense == 0) {that.sure80.isAgreeDrive = "";} 
                                if (that.sure80.isMortgage == 0) {that.sure80.isAgreeMortgage = "";} 
                                if (that.sure80.isSpouse == 0) {that.sure80.isAgreeSpouse = "";}
                                if (that.sure80.isAgreeAddData == 0) {that.sure80.isAgreeAddData = "";}

                                that.sure80.rateAdjustment = datas.data.loanApplyVerifyInfo.audit.rateAdjustment;
                                that.sure80.debitFirstRate = datas.data.loanApplyVerifyInfo.audit.debitFirstRate;
                                that.sure80.salesmanFeedbackOpinion = datas.data.loanApplyVerifyInfo.audit.salesmanFeedbackOpinion;
                                that.sure80.firstScale = datas.data.loanApplyVerifyInfo.audit.firstScale;
                                that.sure80.addData = datas.data.loanApplyVerifyInfo.audit.addData;
                                that.sure80.isMortgageAmount = datas.data.loanApplyVerifyInfo.audit.isMortgageAmount;
                                that.sure80.standardFirstRate = datas.data.loanApplyVerifyInfo.audit.standardFirstRate;
                                that.sure80.carPrice = datas.data.loanApplyVerifyInfo.audit.carPrice;
                                that.sure80.newFirstPay = (that.sure80.standardFirstRate /100) * that.sure80.carPrice;
                                that.sure80.newDebitAmount = Math.ceil((datas.data.loanApplyVerifyInfo.audit.carPrice - that.sure80.newFirstPay) / 100) * 100;
                                setTimeout(function () {that.btnSwitch();}, 200);
                            }
                        } else if (that.webStatus == 90) {
                            if (datas.data.carPriceJudgeInfo) {
                                that.sure90.id = datas.data.carPriceJudgeInfo.id;
                                that.sure90.loanApplyId = datas.data.carPriceJudgeInfo.loanApplyId;
                                that.sure90.carPrice = datas.data.carPriceJudgeInfo.dataPreliminarily.carPrice;
                                that.sure90.carPriceShow = formatCurrency1(datas.data.carPriceJudgeInfo.dataPreliminarily.carPrice);
                                that.sure90.firstPay = formatCurrency1(datas.data.carPriceJudgeInfo.dataPreliminarily.firstPay);
                                that.sure90.firstScale = datas.data.carPriceJudgeInfo.dataPreliminarily.firstScale;
                                that.sure90.debitAmount = formatCurrency1(datas.data.carPriceJudgeInfo.dataPreliminarily.debitAmount);

                                that.sure90.newBaseRate = datas.data.carPriceJudgeInfo.newBaseRate;
                                that.sure90.newRate = datas.data.carPriceJudgeInfo.newRate;
                                that.sure90.newPayMonth = datas.data.carPriceJudgeInfo.newPayMonth;
                                that.sure90.newBankInstallmentFee = datas.data.carPriceJudgeInfo.newBankInstallmentFee;
                                that.sure90.newTotalPayAmount = datas.data.carPriceJudgeInfo.newTotalPayAmount;
                                that.sure90.newRebate = datas.data.carPriceJudgeInfo.newRebate;
                                that.sure90.newActualAmount = datas.data.carPriceJudgeInfo.newActualAmount;
                                that.sure90.newCarPrice = formatCurrency1(datas.data.carPriceJudgeInfo.newCarPrice);
                                that.sure90.newFirstPay = formatCurrency1(datas.data.carPriceJudgeInfo.newFirstPay);
                                that.sure90.newFirstScale = datas.data.carPriceJudgeInfo.newFirstScale;
                                that.sure90.newDebitAmount = formatCurrency1(datas.data.carPriceJudgeInfo.newDebitAmount);
                                //输入
                                that.sure90.inputFirstPay =datas.data.carPriceJudgeInfo.newFirstPay;
                                that.sure90.inputDebitAmount = datas.data.carPriceJudgeInfo.newDebitAmount;
                                that.sure90.inputFirstScale = datas.data.carPriceJudgeInfo.newFirstScale;
                                setTimeout(function () {that.btnSwitch();}, 200);
                            }
                        } else if (that.webStatus == 190) {
                            if (datas.data.loanExpenseInfo) {
                                that.charge.timeLimit = datas.data.loanExpenseInfo.department.timeLimit;
                                that.charge.debitAmount = formatCurrency1(datas.data.loanExpenseInfo.dataPreliminarily.debitAmount);
                                that.charge.paymentTime = formatDay(datas.data.loanExpenseInfo.paymentTime.time, "yyyy/MM/dd");
                                that.charge.merchantName = datas.data.loanExpenseInfo.merchant.merchantName;
                                that.charge.mortgageReceivable = formatCurrency1(datas.data.loanExpenseInfo.mortgageReceivable);
                                that.charge.gpsReceivable = formatCurrency1(datas.data.loanExpenseInfo.gpsReceivable);
                                that.charge.depositReceivable = formatCurrency1(datas.data.loanExpenseInfo.depositReceivable);
                                that.charge.bondReceivable = formatCurrency1(datas.data.loanExpenseInfo.bondReceivable);
                                that.charge.otherReceivable = formatCurrency1(datas.data.loanExpenseInfo.otherReceivable);
                                that.charge.guaranteeReceivable = formatCurrency1(datas.data.loanExpenseInfo.guaranteeReceivable);
                                that.charge.licenseReceivable = formatCurrency1(datas.data.loanExpenseInfo.licenseReceivable);
                                that.charge.totalReceivable = formatCurrency1(datas.data.loanExpenseInfo.mortgageReceivable + datas.data.loanExpenseInfo.gpsReceivable + datas.data.loanExpenseInfo.depositReceivable + datas.data.loanExpenseInfo.bondReceivable + datas.data.loanExpenseInfo.otherReceivable + datas.data.loanExpenseInfo.guaranteeReceivable + datas.data.loanExpenseInfo.licenseReceivable);
                                that.charge.otherMemo = datas.data.loanExpenseInfo.otherMemo;
                                that.charge.id = datas.data.loanExpenseInfo.id;
                                that.charge.loanApplyId = datas.data.loanExpenseInfo.loanApplyId;
                            }
                        } else if (that.webStatus == 140 || that.webStatus == 590) {
                            if (datas.data.loanExpenseInfo) { 
                                var loanExpenseInfo = datas.data.loanExpenseInfo;
                                localStorage.setItem('loanExpenseInfo', loanExpenseInfo);
                                that.module140.loanAmount = formatCurrency1(datas.data.loanExpenseInfo.dataPreliminarily.debitAmount);
                                that.module140.padTime = formatDay(datas.data.loanExpenseInfo.paymentTime.time, "yyyy/MM/dd");
                                that.module140.accountName = datas.data.loanExpenseInfo.merchantName;
                                that.module140.timeLimit = datas.data.loanExpenseInfo.department.timeLimit;
                                that.module140.status = datas.data.loanExpenseInfo.status;
                                that.module140.isBack = datas.data.loanExpenseInfo.isBack;
                                that.module140.returnActual = formatCurrency1(datas.data.loanExpenseInfo.returnActual);
                                that.module140.newLoanAmount = formatCurrency1(datas.data.loanExpenseInfo.dataPreliminarily.debitAmount - datas.data.loanExpenseInfo.returnActual);
                                if (datas.data.loanExpenseInfo.dataFinalAudit) {
                                    that.module140.loanStatus = datas.data.loanExpenseInfo.dataFinalAudit.loanStatus;
                                }
                            }
                        } else if (that.webStatus == 600 || that.webStatus == 620 || that.webStatus == 610) {
                            if (datas.data.repaymentInfo[0]) {
                                that.offOrder.repayment = datas.data.repaymentInfo[0].repayment;
                                localStorage.setItem('repayment', that.repayment);
                                that.offOrder.debitAmount = formatCurrency1(datas.data.repaymentInfo[0].debitAmount);
                                that.offOrder.payTime = formatDay(datas.data.repaymentInfo[0].paymentTime.time, "yyyy/MM/dd");
                                that.offOrder.merchantName = datas.data.repaymentInfo[0].merchantName;
                                that.offOrder.debitBankName = datas.data.repaymentInfo[0].debitBankName;
                                that.offOrder.debitPeriod = datas.data.repaymentInfo[0].debitPeriod;
                                that.offOrder.loanInfoStatus = datas.data.repaymentInfo[0].loanInfoStatus;//客户分期账单已生成
                            }
                        } else if (that.webStatus == 160) { 
                            if (datas.data.loanExpense) {
                                that.closed.debitAmount = formatCurrency1(datas.data.loanExpense.returnActual);
                                if (datas.data.loanExpense.returnChargeTime) {
                                    that.closed.payTime = formatDay(datas.data.loanExpense.returnChargeTime.time, "yyyy/MM/dd");
                                } 
                                that.closed.merchantName = datas.data.loanExpense.merchantName;
                            }
                        } 
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            getWebstatus: function (id) {
                var that = this;
                this.$http({
                method: 'post',
                url: this.HOST + '/agentLoanApply/user/getMerchantLoanApply.htm',
                params: {
                    id: id
                }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                       that.getInfo(datas.rows[0]);
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
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
                        if (that.webStatus == 550) {
                            for (var i = 0; i < datas.data.length; i++) {
                                if (that.apply.loanDepartmentId == datas.data[i].id) {
                                    return that.add.departName = datas.data[i].name;
                                }
                            }
                        } else {
                            that.apply.UserDepartments = datas.data;
                            that.apply.loanDepartmentId = datas.data[0].id;
                            that.getSalesman();
                        }
                    } else {
                        Toast(data.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getSalesman: function () {  //业务员 or 内勤
                var user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                    this.apply.authorityId = (user.authorityId).toString();
                    var status = user.status;  //判断是否是正常模式
                }
                if (status == '1') {
                    if (this.apply.authorityId.indexOf(2) >= 0) {  //业务员
                        this.apply.agentName = JSON.parse(localStorage.getItem("user")).realName;
                        this.apply.agentId = '';
                    } else if (this.apply.authorityId.indexOf(3) >= 0) {  //内勤
                        var that = this;
                        this.$http({
                            method: 'post',
                            url: this.HOST + '/agentLoanApply/user/salesman.htm',
                            params: {
                                departmentId: that.loanDepartmentId
                            }
                        }).then(function (response) {
                            var datas = response.data;
                            if (datas.success) {
                                that.apply.salesmans = datas.data;
                                that.apply.agentId = datas.data[0].id;
                            } else {
                                Toast(data.resultMsg);
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
                        if (that.webStatus == 550) {
                            for (var i = 0; i < datas.data.length; i++) {
                                if (that.apply.loanBankId == datas.data[i].id) {
                                    console.log(datas.data[i].bankname)
                                    return that.add.bankName = datas.data[i].bankname;
                                }
                            }
                        } else {
                            that.apply.banks = datas.data;
                            that.apply.loanBankId = datas.data[0].id;
                        }
                    } else {
                        Toast(data.resultMsg);
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
                        that.apply.carTypes = datas.rows;
                    } else {
                        Toast(data.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getCarTypeId: function (id) { //车辆属性
                this.apply.currCarTypeId = this.apply.carType = id;
            },
            autoCalc: function (event) {   //自动计算
                var name = event.target.name;
                if (!this.sure80.isAgreeRatio) {
                    if (name == 'inputFirstRate') {
                        this.sure80.inputFirstPay = ((this.sure80.inputFirstRate / 100) * this.sure80.carPrice).toFixed(0);
                        this.sure80.inputDebitAmount = (Math.ceil((this.sure80.carPrice - this.sure80.inputFirstPay) / 100) * 100).toFixed(0);
                    } else if (name == 'inputDebitAmount') {
                        this.sure80.inputFirstPay = this.sure80.carPrice - this.sure80.inputDebitAmount;
                        this.sure80.inputFirstRate = (this.sure80.inputFirstPay / this.sure80.carPrice * 100).toFixed(2);
                    } else if (name == 'inputFirstPay') {
                        this.sure80.inputDebitAmount =  (Math.ceil((this.sure80.carPrice - this.sure80.inputFirstPay) / 100) * 100).toFixed(0);
                        this.sure80.inputFirstRate = (this.sure80.inputFirstPay / this.sure80.carPrice * 100).toFixed(2);
                    }
                    this.sure80.debitFirstRate = this.sure80.inputFirstRate;
                }

                
                if (this.sure90.newCarPrice) {
                    var newCarPrice = this.sure90.newCarPrice.replace(",", "");
                    if (name == 'inputFirstScale') { //新首付比例
                        this.sure90.inputFirstPay = ((this.sure90.inputFirstScale / 100) * newCarPrice).toFixed(0);
                        this.sure90.inputDebitAmount = (Math.ceil((newCarPrice - this.sure90.inputFirstPay) / 100) * 100).toFixed(0);
                    } else if (name == 'inputDebitAmount') { //新贷款额
                        this.sure90.inputFirstPay = newCarPrice - this.sure90.inputDebitAmount;
                        this.sure90.inputFirstScale = (this.sure90.inputFirstPay / newCarPrice * 100).toFixed(2);
                    } else if (name == 'inputFirstPay') {  //新首付款
                        this.sure90.inputDebitAmount = (Math.ceil((newCarPrice - this.sure90.inputFirstPay) / 100) * 100).toFixed(0);
                        this.sure90.inputFirstScale = (this.sure90.inputFirstPay / newCarPrice * 100).toFixed(2);
                    }
                }
            },
            btnSwitch: function (dataName) {
                var that = this;
                //初始化switch开关
                mui('.mui-switch').each(function() {
                    mui(this).switch();
                });

                //配偶
                if (this.sure80.isSpouse == 1) {
                    document.getElementById("spouse").addEventListener("toggle",function(event){
                        if (event.detail.isActive) {
                            that.sure80.isAgreeSpouse = 1;
                        } else {
                            that.sure80.isAgreeSpouse = 0;
                            that.apply.spouseName           = "";
                            that.apply.spouseIdcard         = "";
                            that.apply.spouseIdcardFront    = "";
                            that.apply.spouseIdcardOpposite = "";
                            that.apply.spouseMobile         = "";
                        }
                    })
                }

                //担保人1
                if (this.sure80.isGuarantor1 == 1) {
                    document.getElementById("guarantee1").addEventListener("toggle",function(event){
                        if (event.detail.isActive) {
                            that.sure80.isAgreeGuarantee1 = 1;
                        } else {
                            that.sure80.isAgreeGuarantee1 = 0;
                            that.apply.guarantor1Name           = "";
                            that.apply.guarantor1Idcard         = "";
                            that.apply.guarantor1IdcardFront    = "";
                            that.apply.guarantor1IdcardOpposite = "";
                            that.apply.guarantor1Mobile         = "";
                        }
                    })
                }

                //担保人2
                if (this.sure80.isGuarantor2 == 1) {
                    document.getElementById("guarantee2").addEventListener("toggle",function(event){
                        if (event.detail.isActive) {
                            that.sure80.isAgreeGuarantee2 = 1;
                        } else {
                            that.sure80.isAgreeGuarantee2 = 0;
                            that.apply.guarantor2Name           = "";
                            that.apply.guarantor2Idcard         = "";
                            that.apply.guarantor2IdcardFront    = "";
                            that.apply.guarantor2IdcardOpposite = "";
                            that.apply.guarantor2Mobile         = "";
                        }
                    })
                }

                //GPS
                if (this.sure80.isGps == 1) {
                    document.getElementById("gps").addEventListener("toggle",function(event){
                        if (event.detail.isActive) {
                            that.sure80.isAgreeGPS = 1;
                        } else {
                            that.sure80.isAgreeGPS = 0;
                            that.sure80.gpsNum = "";      //gps数目
                            that.sure80.mtcWay = "";      //收费方式
                        }
                    })
                }

                //抵押押金
                if (this.sure80.isMortgage == 1) {
                    document.getElementById("mortgage").addEventListener("toggle",function(event){
                        if (event.detail.isActive) {
                            that.sure80.isAgreeMortgage = 1;
                        } else {
                            that.sure80.isAgreeMortgage = 0;
                        }
                    })
                }

                //驾照押金
                if (this.sure80.isLicense == 1) {
                    document.getElementById("drive").addEventListener("toggle",function(event){
                        if (event.detail.isActive) {
                            that.sure80.isAgreeDrive = 1;
                        } else {
                            that.sure80.isAgreeDrive = 0;
                        }
                    })
                }

                //调整首付比例
                if (this.sure80.isFirstRate == 1) {
                    document.getElementById("ratio").addEventListener("toggle",function(event){
                        if (event.detail.isActive) {
                            that.sure80.isAgreeRatio = 1;
                        } else {
                            that.sure80.isAgreeRatio = 0;
                            that.sure80.inputFirstPay = "";
                            that.sure80.inputDebitAmount = "";
                            that.sure80.inputFirstRate = "";
                        }
                        
                    })
                }
                
                //车价判定
                if (this.webStatus == 90) {
                    document.getElementById("carPrice").addEventListener("toggle",function(event){
                        if (event.detail.isActive) {
                            that.sure90.isAgreeCarprice = that.sure90.salemanIsAgree = 1;
                        } else {
                            that.sure90.isAgreeCarprice = that.sure90.salemanIsAgree = 0;
                        
                        }
                    })
                }
            },
            kown (status) {  //身份证上传声明
                this.apply.flag = status;
            },
            getGps (num) {        //GPS
                this.sure80.gpsNum = num;
                this.sure80.GPSTotalPrice = this.sure80.gpsNum * this.sure80.GPSUnitPrice;
            },
            getMTC (value, key){  //收费方式
                this.sure80.mtcWay = value;
                this.sure80.rateAdjustment  = key;
            },
            getGpsPrice () {      //GPS单价
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentLoanApply/user/getDepartment.htm',
                    params: {
                        id: that.loanDepartmentId
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.sure80.GPSUnitPrice = datas.data.GPSUnitPrice;
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            getMate (key) { //配偶
                this.apply.currMate = key;
                this.apply.ismarried = key;
                if (key > this.add.currMate) {
                    this.add.canSpouse = true;
                } else {
                    this.add.canSpouse = false;
                }
            },
            getGuarantee (key) {  //担保人
                this.apply.currGuarantee = key;
                if (key == 1) {
                    this.apply.isguarantee1 = 1;
                } else if (key == 2) {
                    this.apply.isguarantee2 = this.apply.isguarantee1 = 1;

                } else {
                    this.apply.isguarantee1 = this.apply.isguarantee2 = 0;
                }
                if (this.add.currGuarantee == 0) {
                    if (key > this.add.currGuarantee) {
                        this.add.canGuarantee1 = this.add.canGuarantee2 = true;
                    }
                } else if (this.add.currGuarantee == 1) {
                    if (key > this.add.currGuarantee) {
                        this.add.canGuarantee2 = true;
                    }
                }
            },
            getOptionValue (event) { //获取select的Value值
                var name = event.target.name;
                if (name === 'depart') {
                    this.apply.loanDepartmentId = event.target.value;
                } else if (name === 'bank') {
                    this.apply.loanBankId = event.target.value;
                } else if (name === 'agent') {
                    this.apply.agentId = event.target.value;
                }
            },
            handleFiles (event) { //图片上传
                var that = this;
                var inputName = event.target.name;
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
                            that.apply.idcardFront = URL.createObjectURL(that.file);
                        } else if (inputName == "idcardOpposite") {
                            that.apply.idcardOpposite = URL.createObjectURL(that.file);
                        } else if (inputName == "spouseIdcardFront") {  //配偶
                            that.apply.spouseIdcardFront = URL.createObjectURL(that.file);
                        } else if (inputName == "spouseIdcardOpposite") {
                            that.apply.spouseIdcardOpposite = URL.createObjectURL(that.file);
                        } else if (inputName == "guarantor1IdcardFront") {  //担保人1
                            that.apply.guarantor1IdcardFront = URL.createObjectURL(that.file);
                        } else if (inputName == "guarantor1IdcardOpposite") {
                            that.apply.guarantor1IdcardOpposite = URL.createObjectURL(that.file);
                        } else if (inputName == "guarantor2IdcardFront") {   //担保人2
                            that.apply.guarantor2IdcardFront = URL.createObjectURL(that.file);
                        } else if (inputName == "guarantor2IdcardOpposite") {
                            that.apply.guarantor2IdcardOpposite = URL.createObjectURL(that.file);
                        }  else if (inputName == "warrantPhoto") {   //信用授权书
                            // that.warrantPhoto = URL.createObjectURL(that.file);
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
                                upload(result, inputName, fileBold);
                                return;
                            }
                            //图片加载完毕之后进行压缩，然后上传
                            if (img.complete) {
                                callback();
                            } else {
                                img.onload = callback;
                            }
                            function callback() {
                                var data = compress(img);
                                upload(data, inputName, fileBold);
                                img = null;
                            }
                        };
                        reader.readAsDataURL(file);
                })

                var compress = function (img) {
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
                }
                var upload = function (basestr, inputName, bold) { //图片上传，将base64的图片转成二进制对象，上传
                    if(bold) {
                        var URL = window.URL || window.webkitURL;
                        bold = URL.createObjectURL(bold);
                    }
                    var params = new URLSearchParams();
                    params.append('images', basestr);
                    this.$http.post("/file/images.htm", params)
                    .then(function (response) {
                        if (response.data.success) {
                            if (inputName == "idcardFront") {    //借款人
                                that.apply.idcardFront = response.data.data;
                            } else if (inputName == "idcardOpposite") {
                                that.apply.idcardOpposite = response.data.data;
                            } else if (inputName == "spouseIdcardFront") {  //配偶
                                that.apply.spouseIdcardFront = response.data.data;
                            } else if (inputName == "spouseIdcardOpposite") {
                                that.apply.spouseIdcardOpposite = response.data.data;
                            } else if (inputName == "guarantor1IdcardFront") {  //担保人1
                                that.apply.guarantor1IdcardFront = response.data.data;
                            } else if (inputName == "guarantor1IdcardOpposite") {
                                that.apply.guarantor1IdcardOpposite = response.data.data;
                            } else if (inputName == "guarantor2IdcardFront") {   //担保人2
                                that.apply.guarantor2IdcardFront = response.data.data;
                            } else if (inputName == "guarantor2IdcardOpposite") {
                                that.apply.guarantor2IdcardOpposite = response.data.data;
                            }  else if (inputName == "warrantPhoto") {   //信用授权书
                                // that.warrantPhoto = response.data.data;
                                var obj = {};
                                obj.src = response.data.data;
                                obj.boldSrc = bold;
                                console.log(obj)
                                that.apply.warrantPhotoArr.push(obj);
                            };
                        }
                    })
                    .catch(function (error) {
                        Toast(error);
                    });
                }
            },
            deleteBox (index) {  //删除选中的图片
                this.apply.warrantPhotoArr.splice(index, 1);
            },
            call () {
                this.$router.push("tel:"+ this.userCode, "");
            },
            getTime () { //日历
                var that = this;
                var dtpicker = new mui.DtPicker({
                    type: "date",//设置日历初始视图模式
                    // beginDate: new Date(2017, 04, 25),//设置开始日期
                    customData: {
                        h: [
                            { value: 'AM', text: 'AM' },
                            { value: 'PM', text: 'PM' }
                        ]
                    }//时间/日期别名
                })
                dtpicker.show(function(e) {
                    if (that.webStatus == 590) {
                        that.mortgage.sendDate =  e.value.substring(0, 4) + "/" + e.value.substring(5, 7) + "/" + e.value.substring(8, 10);
                    } else {
                        that.charge.transferDate =  e.value.substring(0, 4) + "/" + e.value.substring(5, 7) + "/" + e.value.substring(8, 10);
                    }
                })
            },
            communicate: function () {  //沟通单详细 财务是否确认
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/loanCommunicate/getCommunication.htm',
                    params: {
                        loanApplyId: that.id
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        if (datas.data.loanCommunication) {
                            that.inReview.comStatus = datas.data.loanCommunication.status;
                        }
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            }, 
            setStep: function (s) {
                if (!this.apply.ismarried) {
                    this.apply.spouseName = '';
                    this.apply.spouseIdcard = '';
                    this.apply.spouseIdcardFront = '';
                    this.apply.spouseIdcardOpposite = '';
                    this.apply.spouseMobile = '';
                }
                if (!this.apply.currGuarantee) {
                    this.apply.guarantor1Name = '';
                    this.apply.guarantor1Idcard = '';
                    this.apply.guarantor1IdcardFront = '';
                    this.apply.guarantor1IdcardOpposite = '';
                    this.apply.guarantor1Mobile = '';

                    this.apply.guarantor2Name = '';
                    this.apply.guarantor2Idcard = '';
                    this.apply.guarantor2IdcardFront = '';
                    this.apply.guarantor2IdcardOpposite = '';
                    this.apply.guarantor2Mobile = '';
                }
                if (s == 1) {
                    if (!this.apply.loanDepartmentId) {
                        Toast('请选择业务部门！');
                    } else if (!this.apply.agentId && !this.apply.agentName) {
                        Toast('请选择业务员！');
                    } else if (!this.apply.loanBankId) {
                        Toast('请选择贷款银行！');
                    } else if (!this.apply.name) {
                        Toast('借款人姓名不能为空！');
                    } else if (!this.apply.identityNo) {
                        Toast('借款人身份证不能为空！');
                    } else if (!identification(this.apply.identityNo)) {
                        Toast('借款人身份证格式不正确！');
                    } else if (!this.apply.mobile) {
                        Toast('借款人手机号码不能为空！');
                    } else if (!mobileValidate(this.apply.mobile)) {
                        Toast("借款人手机号格式错误！");
                    } else if (!this.apply.idcardFront) {
                        Toast("借款人身份证正面照未上传！");
                    } else if (!this.apply.idcardOpposite) {
                        Toast("借款人身份证反面照未上传！");
                    } else if (this.apply.ismarried == 1 && !this.apply.spouseName) {
                        Toast("配偶姓名不能为空！");
                    } else if (this.apply.ismarried == 1 && !this.apply.spouseIdcard) {
                        Toast("配偶身份证不能为空！");
                    } else if (this.apply.ismarried == 1 && !identification(this.apply.spouseIdcard)) {
                        Toast("配偶身份证格式不正确！");
                    } else if (this.apply.ismarried == 1 && !this.apply.spouseMobile) {
                        Toast("配偶手机号不能为空！");
                    } else if (this.apply.ismarried == 1 && this.apply.spouseMobile && !mobileValidate(this.apply.spouseMobile)) {
                        Toast("配偶手机号格式错误！");
                    } else if (!this.apply.spouseIdcardFront && this.apply.ismarried == 1) {
                        Toast("配偶身份证正面照未上传！");
                    } else if (!this.apply.spouseIdcardOpposite && this.apply.ismarried == 1) {
                        Toast("配偶身份证反面照未上传！");
                    } else if (this.apply.isguarantee1 == 1 && !this.apply.guarantor1Name) {
                        Toast("担保人1姓名不能为空！");
                    } else if (this.apply.isguarantee1 == 1 && !this.apply.guarantor1Idcard) {
                        Toast("担保人1身份证不能为空！");
                    } else if (this.apply.isguarantee1 == 1 && !identification(this.apply.guarantor1Idcard)) {
                        Toast("担保人1身份证格式不正确！");
                    } else if (this.apply.isguarantee1 == 1 && !this.apply.guarantor1Mobile) {
                        Toast("担保人1手机号不能为空！");
                    } else if (this.apply.isguarantee1 == 1 && this.apply.guarantor1Mobile && !mobileValidate(this.apply.guarantor1Mobile)) {
                        Toast("担保人1手机号格式错误！");
                    } else if (!this.apply.guarantor1IdcardFront && this.apply.isguarantee1 == 1) {
                        Toast("担保人1身份证正面照未上传！");
                    } else if (!this.apply.guarantor1IdcardOpposite && this.apply.isguarantee1 == 1) {
                        Toast("担保人1身份证反面照未上传！");
                    } else if (this.apply.isguarantee2 == 1 && !this.apply.guarantor2Name) {
                        Toast("担保人2姓名不能为空！");
                    } else if (this.apply.isguarantee2 == 1 && !this.apply.guarantor2Idcard) {
                        Toast("担保人2身份证不能为空！");
                    } else if (this.apply.isguarantee2 == 1 && !identification(this.apply.guarantor2Idcard)) {
                        Toast("担保人2身份证格式不正确！");
                    } else if (!this.apply.guarantor2IdcardFront && this.apply.isguarantee2 == 1) {
                        Toast("担保人2身份证正面照未上传！");
                    } else if (!this.apply.guarantor2IdcardOpposite && this.apply.isguarantee2 == 1) {
                        Toast("担保人2身份证反面照未上传！");
                    } else if (this.apply.isguarantee2 == 1 && !this.apply.guarantor2Mobile) {
                        Toast("担保人2手机号不能为空！");
                    } else if (this.apply.isguarantee2 == 1 && this.apply.guarantor2Mobile && !mobileValidate(this.apply.guarantor2Mobile)) {
                        Toast("担保人2手机号格式错误！");
                    } else if (this.apply.warrantPhotoArr.length < 1) {
                        Toast("请上传相关的信用查询授权书！");
                    } else {
                        this.apply.step = 2;
                        this.getCarType();
                    }
                } else if (s == 2) {
                    this.apply.step = 1;
                } else if (s == 3) {
                    if (!this.apply.carType) {
                        Toast("请选择车辆属性!");
                    } else if (!this.apply.carBrand) {
                        Toast("请输入汽车品牌!");
                    } else if (!this.apply.carModel) {
                        Toast("请输入车型!");
                    } else if (!this.apply.carPrice) {
                        Toast("请输入车价!");
                    } else if (!this.apply.merchant) {
                        Toast("请输经销商!");
                    } else {
                        this.btn();
                    }
                }
            },
            confirm: function (t) {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentLoanApply/user/settleApply.htm',
                    params: {
                        loanApplyId: that.id,
                        userId: that.userId
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        var loanApplyId = datas.data[0].id,
                            userId = datas.data[0].user.id,
                            custId = datas.data[0].custId;
                        // var btnArray = ['取消','确定'];
                        if (t == 1) {
                            mui.confirm('客户"' + that.userName + '"确定要申请理赔？', function(e){
                                if(e.index == 1){
                                    settleApply(loanApplyId, userId, custId);
                                }
                            })
                        } else {
                            mui.confirm('客户"' + that.userName + '"确定要申请提前还贷？', function(e){
                                if(e.index == 1){
                                    advancePay(loanApplyId, userId, custId);
                                }
                            })
                        }
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });

                //申请理赔
                var settleApply = function (loanApplyId, userId, custId) {
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/advance/getApplyCount.htm',
                        params: {
                            loanApplyId : loanApplyId,
                            userId:userId
                        }
                    }).then(function (response) {
                        var datas = response.data;
                        if (datas.success) {
                            if (datas.applyCount > 0) {
                                myAlert("该客户的理赔申请正在处理中，请耐心等待。");
                            } else {
                                this.$http({
                                    method: 'post',
                                    url: this.HOST + '/settle/insertSettleApply.htm',
                                    params: {
                                        loanApplyId : loanApplyId,
                                        custId : custId,
                                        userId:userId
                                    }
                                }).then(function (response) {
                                    if (datas.success) {
                                            myAlert("理赔申请成功，工作人员将会在1-2个工作日内联系客户。");
                                        } else {
                                            myToast(datas.resultMsg);
                                        }
                                }).catch(function (error) {
                                    Toast(error);
                                });
                            }
                        } else {
                            Toast(datas.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    });
                }

                //申请提前还款
                var advancePay = function (loanApplyId, userId, custId) {
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/advance/getApplyCount.htm',
                        params: {
                            loanApplyId : loanApplyId,
                            userId:userId
                        }
                    }).then(function (response) {
                        var datas = response.data;
                        if (datas.success) {
                            if (datas.applyCount > 0) {
                                myAlert("该客户的提前还贷申请正在处理中，请耐心等待。");
                            } else {
                                this.$http({
                                    method: 'post',
                                    url: this.HOST + '/advance/insertAdvanceLoanApply.htm',
                                    params: {
                                        loanApplyId : loanApplyId,
                                        custId : custId,
                                        userId: userId
                                    }
                                }).then(function (response) {
                                    var datas = response.data;
                                    if (datas.success) {
                                            myAlert("提前还贷申请成功，工作人员将会在1-2个工作日内联系客户。");
                                        } else {
                                            myToast(datas.resultMsg);
                                        }
                                }).catch(function (error) {
                                    Toast(error);
                                });
                            }
                        } else {
                            Toast(datas.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    });
                }
            },
            newWebStatus () {    //获取新的webStatus
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentLoanApply/user/getLoanApplyById.htm',
                    params: {
                        id: that.id
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.webStatus = datas.webStatus;
                        that.gotoAddress("/orderList");
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            btn () { //不同状态下提交不同的接口
                var s = this.webStatus;
                if (s == 10 || s == 510) { //征信中 不符合要求
                    this.toApply(s);
                } else if (s == 540) {
                    this.toApply(s);
                } else if (s == 550) {
                    this.toApply(s);
                } else if (s == 80) {  //待确认 电审关注
                    this.updMobileVerify();
                } else if (s == 570) { //待确认 更换银行
                    this.updChangeBank();
                } else if (s == 90) {  //待确认 车价判定
                    this.updJudgeCarPrice();
                } else if (s == 190) { //待收费
                    this.updCharges();
                } else if (s == 590) { //待抵押
                    this.updMortgage();
                } 
            },
            toApply (webStatus) {
                var that = this;
                var warrantPhotoArr = "";
                this.apply.warrantPhotoArr.forEach(function (item, index) {
                    warrantPhotoArr += that.apply.warrantPhotoArr[index].src + ",";
                })
                warrantPhotoArr = warrantPhotoArr.substring(0, warrantPhotoArr.length - 1);
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentLoanApply/user/agent/reapply.htm',
                    params: {
                        id: that.id,
                        loanCarInfoId            : that.apply.loanCarInfoId,
                        webStatus                : webStatus,
                        credit                   : 0,
                        agentId                  : that.apply.agentId,
                        loanBankId               : that.apply.loanBankId,
                        ismarried                : that.apply.ismarried,

                        name                     : that.apply.name,
                        identityNo               : that.apply.identityNo.toUpperCase(),
                        mobile                   : that.apply.mobile,
                        idcardFront              : that.apply.idcardFront,
                        idcardOpposite           : that.apply.idcardOpposite,

                        spouseName               : that.apply.spouseName,
                        spouseIdcard             : that.apply.spouseIdcard.toUpperCase(),
                        spouseIdcardFront        : that.apply.spouseIdcardFront,
                        spouseIdcardOpposite     : that.apply.spouseIdcardOpposite,
                        spouseMobile             : that.apply.spouseMobile,

                        guarantor1Name           : that.apply.guarantor1Name,
                        guarantor1Idcard         : that.apply.guarantor1Idcard.toUpperCase(),
                        guarantor1IdcardFront    : that.apply.guarantor1IdcardFront,
                        guarantor1IdcardOpposite : that.apply.guarantor1IdcardOpposite,
                        guarantor1Mobile         : that.apply.guarantor1Mobile,

                        guarantor2Name           : that.apply.guarantor2Name,
                        guarantor2Idcard         : that.apply.guarantor2Idcard.toUpperCase(),
                        guarantor2IdcardFront    : that.apply.guarantor2IdcardFront,
                        guarantor2IdcardOpposite : that.apply.guarantor2IdcardOpposite,
                        guarantor2Mobile         : that.apply.guarantor2Mobile,

                        warrantPhoto             : warrantPhotoArr,
                        loanBankId               : that.apply.loanBankId,   //贷款银行id
                        originator               : that.apply.originatorId, //制单人
                        loanDepartmentId         : that.apply.loanDepartmentId, //业务部门

                        carType                  : that.apply.carType,//车辆属性
                        carBrand                 : that.apply.carBrand, //汽车品牌
                        carModel                 : that.apply.carModel, //车型
                        carPrice                 : that.apply.carPrice, //车价
                        merchant                 : that.apply.merchant,//经销商名称
                        version                  : that.apply.version
                    }
                }).then(function (response) {
                    var data = response.data;
                    if (data.success) {
                        that.newWebStatus();
                    } else {
                        Toast(data.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            updMobileVerify () {
                if (this.sure80.isAgreeSpouse == 1 && !this.apply.spouseName) {
                    Toast("配偶姓名不能为空！");
                } else if (this.sure80.isAgreeSpouse == 1 && !this.apply.spouseIdcard) {
                    Toast("配偶身份证不能为空！");
                } else if (this.sure80.isAgreeSpouse == 1 && !identification(this.apply.spouseIdcard)) {
                    Toast("配偶身份证格式不正确！");
                } else if (this.sure80.isAgreeSpouse == 1 && !this.apply.spouseMobile) {
                    Toast("配偶手机号不能为空！");
                } else if (this.sure80.isAgreeSpouse == 1 && this.apply.spouseMobile && !mobileValidate(this.apply.spouseMobile)) {
                    Toast("配偶手机号格式错误！");
                } else if (this.sure80.isAgreeSpouse == 1 && !this.apply.spouseIdcardFront) {
                    Toast("配偶身份证正面照未上传！");
                } else if (this.sure80.isAgreeSpouse == 1 && !this.apply.spouseIdcardOpposite) {
                    Toast("配偶身份证反面照未上传！");
                } else if (this.sure80.isAgreeGuarantee1 == 1 && !this.apply.guarantor1Name) {
                    Toast("担保人1姓名不能为空！");
                } else if (this.sure80.isAgreeGuarantee1 == 1 && !this.apply.guarantor1Idcard) {
                    Toast("担保人1身份证不能为空！");
                } else if (this.sure80.isAgreeGuarantee1 == 1 && !identification(this.apply.guarantor1Idcard)) {
                    Toast("担保人1身份证格式不正确！");
                } else if (this.sure80.isAgreeGuarantee1 == 1 && !this.apply.guarantor1Mobile) {
                    Toast("担保人1手机号不能为空！");
                } else if (this.sure80.isAgreeGuarantee1 == 1 && this.apply.guarantor1Mobile && !mobileValidate(this.apply.guarantor1Mobile)) {
                    Toast("担保人1手机号格式错误！");
                } else if (this.sure80.isAgreeGuarantee1 == 1 && !this.apply.guarantor1IdcardFront) {
                    Toast("担保人1身份证正面照未上传！");
                } else if (this.sure80.isAgreeGuarantee1 == 1 && !this.apply.guarantor1IdcardOpposite) {
                    Toast("担保人1身份证反面照未上传！");
                }else if (this.sure80.isAgreeGuarantee2 == 1 && !this.apply.guarantor2Name) {
                    Toast("担保人2姓名不能为空！");
                } else if (this.sure80.isAgreeGuarantee2 == 1 && !this.apply.guarantor2Idcard) {
                    Toast("担保人2身份证不能为空！");
                } else if (this.sure80.isAgreeGuarantee2 == 1 && !identification(this.apply.guarantor2Idcard)) {
                    Toast("担保人2身份证格式不正确！");
                } else if (this.sure80.isAgreeGuarantee2 == 1 && !this.apply.guarantor2Mobile) {
                    Toast("担保人2手机号不能为空！");
                } else if (this.sure80.isAgreeGuarantee2 == 1 && this.apply.guarantor2Mobile && !mobileValidate(this.apply.guarantor2Mobile)) {
                    Toast("担保人2手机号格式错误！");
                } else if (this.sure80.isAgreeGuarantee2 == 1 && !this.apply.guarantor2IdcardFront) {
                    Toast("担保人2身份证正面照未上传！");
                } else if (this.sure80.isAgreeGuarantee2 == 1 && !this.apply.guarantor2IdcardOpposite) {
                    Toast("担保人2身份证反面照未上传！");
                } else if ((this.apply.isAgreeSpouse == 1 || this.apply.isAgreeGuarantee1 == 1 || this.apply.isAgreeGuarantee2 == 1) && this.apply.warrantPhotoArr.length < 1) {
                    Toast("请上传相关的信用查询授权书！");
                } else if (this.sure80.isAgreeGPS == 1 && !this.sure80.gpsNum) {
                    Toast('请选择GPS加装个数');
                } else if(this.sure80.isAgreeGPS == 1 && !this.sure80.mtcWay) {
                    Toast('请选择收费方式');
                } else {
                    var that = this;
                    var warrantPhotoStr = "";
                    that.apply.warrantPhotoArr.forEach(function (item, index) {
                        warrantPhotoStr += that.apply.warrantPhotoArr[index].src + ",";
                    })
                    warrantPhotoStr = warrantPhotoStr.substring(0, warrantPhotoStr.length - 1);

                    this.$http({
                        method: 'post',
                        url: this.HOST + '/agentLoanApply/user/updMobileVerify.htm',
                        params: {
                            spouseName              : that.apply.spouseName,
                            spouseIdcard            : that.apply.spouseIdcard,
                            spouseIdcardFront       : that.apply.spouseIdcardFront,
                            spouseIdcardOpposite    : that.apply.spouseIdcardOpposite,
                            spouseMobile            : that.apply.spouseMobile,

                            guarantor1Name           : that.apply.guarantor1Name,
                            guarantor1Idcard         : that.apply.guarantor1Idcard,
                            guarantor1IdcardFront    : that.apply.guarantor1IdcardFront,
                            guarantor1IdcardOpposite : that.apply.guarantor1IdcardOpposite,
                            guarantor1Mobile         : that.apply.guarantor1Mobile,

                            guarantor2Name           : that.apply.guarantor2Name,
                            guarantor2Idcard         : that.apply.guarantor2Idcard,
                            guarantor2IdcardFront    : that.apply.guarantor2IdcardFront,
                            guarantor2IdcardOpposite : that.apply.guarantor2IdcardOpposite,
                            guarantor2Mobile         : that.apply.guarantor2Mobile,

                            warrantPhoto            : warrantPhotoStr,
                            id                      : that.id,
                            isAddData               : that.sure80.isAgreeAddData,  //增补资料
                            isSpouse                : that.sure80.isAgreeSpouse,
                            isGuarantor1            : that.sure80.isAgreeGuarantee1,
                            isGuarantor2            : that.sure80.isAgreeGuarantee2,
                            isFirstRate             : that.sure80.isAgreeRatio,
                            isGps                   : that.sure80.isAgreeGPS,
                            isLicense               : that.sure80.isAgreeDrive,
                            isMortgage              : that.sure80.isAgreeMortgage,
                            gpsNumber               : that.sure80.gpsNum,
                            isMortgageAmount        : that.sure80.isMortgageAmount, //抵押押金
                            standardFirstRate       : that.sure80.standardFirstRate, //新首付比例
                            isDebitMortgageAmount   : 2000,
                            driveLicensePrice       : 2000,
                            debitFirstRate          : that.sure80.debitFirstRate,
                            salesmanFeedbackOpinion : that.sure80.salesmanFeedbackOpinion,
                            firstScale              : that.sure80.firstScale,
                            addData                 : that.sure80.addData,
                            rateAdjustment          : that.sure80.rateAdjustment,  //收费方式
                            status                  : that.status 
                        },
                    }).then(function (response) {
                        var datas = response.data;
                        if (datas.success) {
                            that.newWebStatus();
                        } else {
                            Toast(datas.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    });
                }
            },
            updJudgeCarPrice: function () {   
                var that = this;
                var newCarPrice = that.sure90.newCarPrice.replace(",", "");
                var newDebitAmount = that.sure90.newDebitAmount.replace(",", "");
                var newFirstPay = that.sure90.newFirstPay.replace(",", "");
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentLoanApply/user/updateManagerCarPriceJudgeById.htm',
                    params: {
                        id: that.sure90.id,
                        loanApplyId: that.sure90.loanApplyId,
                        salemanIsAgree: that.sure90.salemanIsAgree,
                        newActualAmount: that.sure90.newActualAmount,
                        newCarPrice: newCarPrice,
                        newFirstScale: that.sure90.newFirstScale,
                        newBaseRate : that.sure90.newBaseRate,
                        newDebitAmount : newDebitAmount,
                        newRate : that.sure90.newRate,
                        newFirstPay : newFirstPay,
                        newPayMonth : that.sure90.newPayMonth,
                        newBankInstallmentFee : that.sure90.newBankInstallmentFee,
                        newTotalPayAmount : that.sure90.newTotalPayAmount,
                        newRebate : that.sure90.newRebate 
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.newWebStatus();
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            updChangeBank () {   
                var that = this;
                var warrantPhotoArr = "";
                this.apply.warrantPhotoArr.forEach(function (item, index) {
                    warrantPhotoArr += that.apply.warrantPhotoArr[index].src + ",";
                })
                warrantPhotoArr = warrantPhotoArr.substring(0, warrantPhotoArr.length - 1);
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentLoanApply/user/updateChangeBankloanApply.htm',
                    params: {
                        salemanIsAgree: 1,
                        id: that.id,
                        changeBankStatus: 4,
                        warrantPhoto: warrantPhotoArr
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.newWebStatus();
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            updCharges () {
                var that = this;
                if (!this.charge.transferAmount) {
                    Toast("请输入转账金额");
                } else if (!this.charge.transferDate) {
                    Toast("请选择日期");
                } else {
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/agentLoanApply/user/chargesSubmit.htm',
                        params: {
                            id: that.charge.id,
                            loanApplyId: that.charge.loanApplyId,
                            transferAmount: that.charge.transferAmount,
                            transferDate: that.charge.transferDate,
                            salesmanSubmitRemark: that.charge.salesmanSubmitRemark
                        }
                    }).then(function (response) {
                        var datas = response.data;
                        if (datas.success) {
                            that.newWebStatus();
                        } else {
                            Toast(datas.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    });
                }
            },
            updMortgage () {
                var that = this;
                if (!this.mortgage.carNum) {
                    Toast("请输入车牌号");
                } else if (!this.mortgage.sendDate) {
                    Toast("请选择抵押材料寄送日期");
                } else {
                    var mortgageMessage = this.mortgage.carNum + "," + this.mortgage.sendDate + "。" + this.mortgage.remark;
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/agentLoanApply/user/mortgageSubmit.htm',
                        params: {
                            loanApplyId: that.id,
                            mortgageMessage: mortgageMessage 
                        }
                    }).then(function (response) {
                        var datas = response.data;
                        if (datas.success) {
                            that.newWebStatus();
                        } else {
                            Toast(datas.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    });
                }
            }
        },
        filters: {
            filterStatus: function(webStatus) {
                return getWebStatus(webStatus);
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


