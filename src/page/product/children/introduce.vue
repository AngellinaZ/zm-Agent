<template>
    <div class='pro-detail childPage' v-cloak>
        <head-top head-title='产品介绍' :go-back='true'></head-top>
        <div id="scroll_section" class="scroll_container">
            <div>
                <section class="tit">
                    <h3> 
                        <img src="../../../../static/images/pic/car.png">汽车担保贷
                    </h3>
                    <p>&nbsp;&nbsp;汽车担保贷是茗发担保公司与银行合作推出的汽车 分期贷款。<br/>&nbsp;&nbsp;由茗发担保公司为购车人提供担保，向银行借款购买汽车，之后购车人将汽车抵押给茗发担保公司，直至购车人将汽车贷款还清。汽车抵押期间，汽车使用权属于购车人。</p>
                </section>
                <section class="module">
                    <div class="detail">
                        <h2><img src="../../../../static/images/icon/icon-5.png" /><span>申请条件</span></h2>
                        <ul>
                            <li><i></i>适用车辆：新车、二手车、商用车</li>
                            <li><i></i>购车首付：20%起</li>
                            <li><i></i>可贷金额：2~100万</li>
                            <li><i></i>年龄要求：18~60周岁，未婚人士需担保人</li>
                        </ul>
                    </div>
                </section>
                <section class="module">
                    <div class="detail">
                        <h2><img src="../../../../static/images/icon/icon-5.png" /><span>申请材料</span></h2>
                        <ul>
                            <li><i></i>申请贷款：借款人、配偶、担保人身份证、信用查 询授权书</li>
                            <li><i></i>签署合同：根据车辆和贷款金额，提供不同的材料</li>
                        </ul>
                    </div>
                </section> 
                <section class="module">
                    <div class="detail step">
                        <h2><img src="../../../../static/images/icon/icon-5.png" /><span>贷款流程</span></h2>
                        <ul>
                            <li>
                                <b>申请</b>
                                <span><i class="icon"></i>&nbsp;&nbsp;&nbsp;&nbsp;提供身份证、信用查询授权书</span>
                            </li>
                            <li>
                                <b>征信查询</b>
                                <span><i class="icon"></i>&nbsp;&nbsp;&nbsp;&nbsp;工作日仅需20分钟即可获知征信结果</span>
                            </li>
                            <li>
                                <b>客服电访</b>
                                <span><i class="icon"></i>&nbsp;&nbsp;&nbsp;&nbsp;征信通过后，客服将对借款人进行电访</span>
                            </li>
                            <li>
                                <b>签约并提交材料</b>
                                <span><i class="icon"></i>&nbsp;&nbsp;&nbsp;&nbsp;客户签署借款合同，并提供贷款要求材料</span>
                            </li>
                            <li>
                                <b>放款</b>
                                <span><i class="icon"></i>&nbsp;&nbsp;&nbsp;&nbsp;签约后1~3个工作日内放款给汽车销售商</span>
                            </li>
                            <li>
                                <b>车辆抵押</b>
                                <span><i class="icon"></i>&nbsp;&nbsp;&nbsp;&nbsp;代理人为客户办理车辆抵押程序</span>
                            </li>
                            <li>
                                <b>还款</b>
                                <span><i style="height: 0"></i>&nbsp;&nbsp;&nbsp;&nbsp;客户每月按时还款银行</span>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    export default {
        name: 'introduce',
        data() {
            return {
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
        components: {
            headTop
        }
    }
</script>


