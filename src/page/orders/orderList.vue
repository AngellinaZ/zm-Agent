<template>
    <div class='orders filter'>
        <head-top :go-back='false'>
            <div slot='searchDiv'>
                <input type="text" name="" placeholder="输入客户姓名或手机号码" v-model='filterMsg'>
                <i class="icon search"></i>
                <span class="x" v-if='filterMsg' @click="clearInput">X</span>
            </div>
            <em slot='searchBtn' @click='query()'>搜索</em>
        </head-top>
        <div class="list">
            <ul class="tabs">
                <li :class="{'active': flag == 0}" @click="tabClick(webStatus[0], '0')">全部</li>
                <li :class="{'active': flag == 1}" @click="tabClick(webStatus[1], '1')">进行中</li>
                <li :class="{'active': flag == 2}" @click="tabClick(webStatus[2], '2')">已完成</li>
                <li :class="{'active': flag == 3}" @click="tabClick(webStatus[3], '3')">已关闭</li>
                <li @click='toFilter'>筛选<img src="/static/images/icon/filter.png"></li>
            </ul>
            <ul class="con" id="con">
                <li class="module" v-for="row in rows" :key='row.id' @click="SetLocalStorage(row)">
                    <div class="marking">
                        <div>
                            <p>{{ row.user.name }}
                                <span v-if='row.sourceTypeId == 0'>贷款</span>
                                <span v-if='row.sourceTypeId == 1'>保险</span>
                            </p>
                            <em>{{ row.user.userCode }}</em>
                        </div>
                        <div>
                            <p><span :class='row.clazz'>{{ row.webStatus | filterStatus}}</span>{{ row.registerTime }}</p>
                            <i class="icon next"></i>
                        </div>
                    </div>
                    <div class="memo" v-if="row.memo.trim()">{{ row.memo }}</div>
                </li>
                <li class="bottomLine" v-if='totalPage == page && totalPage > 1'>-- No more data --</li>
            </ul>
        </div>
        <div class="mask" v-if='isFilter'>
            <div id='filter'>
                <p class="tit">状态筛选</p>
                <ul v-for='row in webList'>
                    <li class="tit">{{ row.tit }}</li>
                    <li v-for='item in row.con' @click='statusFilter(item.key)' :class="{active: item.key == currStatus}">{{ item.value }}</li>
                </ul>
            </div>
        </div>
        <div class="blankPage" v-if='rows.length < 1'>
            <img src="/static/images/pic/blankPage.png">
            <p>———— 暂无记录 ————</p>
        </div>
        <vue-foot name='订单'></vue-foot>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import vueFoot from '@/components/footer/foot'
    import { Toast } from 'mint-ui'
    import { getWebStatus } from '@/js/common'
    export default {
        name: 'orderList',
        data() {
            return {
                msgNum: "",
                page: 1,
                row: 20,  // 每页条数
                totalPage: "",
                loadFlag: true,
                isFilter: false,
                isQuery: false,
                queryResult: '', //保存查询返回结果
                flag: "",
                filterMsg: '',
                rows: [],
                resultMsg: "",
                currStatus: "",
                currWebStatus: "",
                type: [
                    {'key': 1, 'value':'贷款'},
                    {'key': 2, 'value':'保险'}
                ],
                colorArr: [
                    {"code": "500", "color" : "orange"},
                    {"code": "10", "color" : "blue"},
                    {"code": "510", "color" : "orange"},
                    {"code": "520", "color" : "blue"},
                    {"code": "530", "color" : "blue"},
                    {"code": "540", "color" : "orange"},
                    {"code": "550", "color" : "orange"},
                    {"code": "560", "color" : "orange"},
                    {"code": "570", "color" : "orange"},
                    {"code": "80", "color" : "orange"},
                    {"code": "90", "color" : "orange"},
                    {"code": "580", "color" : "blue"},
                    {"code": "130", "color" : "blue"},
                    {"code": "190", "color" : "orange"},
                    {"code": "140", "color" : "blue"},
                    {"code": "590", "color" : "orange"},
                    {"code": "600", "color" : "green"},
                    {"code": "610", "color" : "green"},
                    {"code": "620", "color" : "green"},
                    {"code": "50", "color" : "red"},
                    {"code": "110", "color" : "red"},
                    {"code": "160", "color" : "red"},
                    {"code": "630", "color" : "red"},
                ],
                webList: [
                    {
                        'tit': '进行中',
                        'con': [
                            {'key': '500', 'value': '草稿'},
                            {'key': '520', 'value': '再申请审核中'},
                            {'key': '510', 'value': '不符合要求'},
                            {'key': '10', 'value': '征信中'},
                            {'key': '530', 'value': '征信通过，审核中'},
                            {'key': '540', 'value': '待更新'},
                            {'key': '550', 'value': '待追加'},
                            {'key': '560,570,80,90', 'value': '待确认'},
                            {'key': '130', 'value': '待放款'},
                            {'key': '580', 'value': '更换银行审核'},
                            {'key': '190', 'value': '待收费'},
                            {'key': '140', 'value': '已放款'},
                            {'key': '590', 'value': '待抵押'},
                        ]
                    },
                    {
                        'tit': '已完成',
                        'con': [
                            {'key': '600', 'value': '还款中'},
                            {'key': '610', 'value': '结清中'},
                            {'key': '620', 'value': '还款完成'}
                        ]
                    },
                    {
                        'tit': '已关闭',
                        'con': [
                            {'key': '50', 'value': '征信未通过'},
                            {'key': '110', 'value': '审核未通过'},
                            {'key': '160', 'value': '已全额退资'},
                            {'key': '630', 'value': '拒绝再申请'}
                        ]
                    }
                ],
                webStatus: ['500,520,510,10,530,540,550,560,570,80,90,130,580,190,140,590,600,610,620,50,110,160,630','500,520,510,10,530,540,550,560,570,80,90,130,580,190,140,590', '600,610,620', '50,110,160,630'],
            }
        },
        components: {
            'head-top': headTop,
            'vue-foot': vueFoot
        },
       methods: {
            clearInput () {
                this.filterMsg = '';
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
            query:function(){ //搜索
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentLoanApply/user/getMerchantLoanApply.htm',
                    params: {
                        rows: 800,
                        page: 1,
                        queryParams: that.filterMsg
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.rows = [];
                        that.isQuery = true;
                        that.queryResult = datas.rows;
                        for (var i = 0; i < datas.rows.length; i++) {
                            for (var j = 0; j < that.colorArr.length; j++) {
                                if (datas.rows[i].webStatus == that.colorArr[j].code) {
                                    datas.rows[i].clazz = that.colorArr[j].color;
                                }
                            }
                        }
                        if (datas.rows.length == 1) {
                            for (var i = 0; i < that.webStatus.length; i++) {
                                for (var j = 0; j < that.webStatus[i].split(',').length; j++) {
                                    if (that.webStatus[i].split(',')[j] == datas.rows[0].webStatus) {
                                        that.rows = datas.rows;
                                        that.flag = i;
                                    }
                                }
                            }
                        } else {
                            that.tabClick(that.webStatus[0], '0');
                        }
                    } else {
                        if (datas.code == 'record_not_exsist') {
                            that.rows = [];
                        }
                    }
                }).catch(function (error) {
                    mui.toast(error);
                });
            },
            tabClick (webStatus, flag) {  //切换不同状态的订单
                this.currWebStatus = webStatus;
                this.flag = flag;
                this.page = 1;
                this.rows = [];
                if (!this.isQuery) {
                    this.getMerchantLoanApply();
                } else {
                    var currRows = this.rows = [];  //不同状态下的搜索结果
                    for (var j = 0; j < this.queryResult.length; j++) {
                        for(var i = 0; i < webStatus.split(',').length; i++) {
                            if (webStatus.split(',')[i] == this.queryResult[j].webStatus) {
                                currRows.push(this.queryResult[j]);
                                this.rows = currRows;
                            }
                        }
                    }
                }
            },
            statusFilter (s) {  //侧滑依据单一状态搜索
                this.currWebStatus = this.currStatus = s;
                this.getMerchantLoanApply('single');
            },
            getMerchantLoanApply (type) {
                this.loadFlag = false;
                var params = [this.row, this.page, this.currWebStatus];
                var that = this;
                this.$http({
                method: 'post',
                url: this.HOST + '/agentLoanApply/user/getMerchantLoanApply.htm',
                params: {
                    rows: params[0],
                    page: params[1],
                    webStatusLst: params[2]
                }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        //状态筛选
                        if (type == 'single') {  
                            that.rows = [];  //每次筛选状态清空之前的数据
                            for (var i = 0; i < that.webStatus.length; i++) {
                                for (var j = 0; j < that.webStatus[i].split(',').length; j++) {
                                    if (params[2] == that.webStatus[i].split(',')[j]) {
                                        that.flag = i;
                                    }
                                }
                            }
                            setTimeout(function () {that.isFilter = false}, 100);
                        }

                        that.totalPage = Math.ceil(datas.total / that.row);
                        that.rows = that.rows.concat(datas.rows);
                        //添加list对应的文字颜色
                        for (var i = 0; i < that.rows.length; i++) {
                            for (var j = 0; j < that.colorArr.length; j++) {
                                if (that.rows[i].webStatus == that.colorArr[j].code) {
                                    that.rows[i].clazz = that.colorArr[j].color;
                                }
                            }
                        }

                        that.loadFlag = true;
                    } else {
                        if (datas.code == 'record_not_exsist') {
                            that.rows = [];
                            that.resultMsg = datas.resultMsg;
                            for (var i = 0; i < that.webStatus.length; i++) {
                                for (var j = 0; j < that.webStatus[i].split(',').length; j++) {
                                    if (params[2] == that.webStatus[i].split(',')[j]) {
                                        that.flag = i;
                                    }
                                }
                            }
                            setTimeout(function () {that.isFilter = false}, 100);
                        } else if (datas.code == '405') {
                            againLogin(orders.getMerchantLoanApply, params);
                        } else {
                            mui.toast(datas.resultMsg);
                        }
                    }
                }).catch(function (error) {
                    mui.toast(error);
                });
            },
            SetLocalStorage (currRow) {
                mySetLocalStorage('currRow', currRow);
                if (currRow.webStatus == 500) {
                    mySetLocalStorage("draftAddress","/tpl/orders/list.html");
                    myOpenWindow('../product/apply.html?type=2', "");
                } else {
                    myOpenWindow('../orders/detail.html', "");
                }
            }
        },
        filters: {
            filterStatus (webStatus) {
                var status = getWebStatus(webStatus);
                return status;
            }
        },
        mounted() {
            var headerHeight = document.querySelector(".header").clientHeight;
            var footerHeight = document.querySelector(".footer").clientHeight;
            var tabsHeight = document.querySelector(".tabs").clientHeight;
            var scrollHeight = document.body.clientHeight - headerHeight - footerHeight - tabsHeight; //区域高度
            var that = this;
            document.addEventListener('scroll', function (e) {
                var conHeight = document.getElementById("con").clientHeight; //总高度
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                if (scrollHeight + scrollTop >= conHeight) {
                    if (that.loadFlag && that.totalPage > that.page) {
                        that.page++;
                        that.getMerchantLoanApply();
                    }
                } 
            }, false)
        },
        created() {
            this.getMerchantLoanApply('');
        }
    }
</script>