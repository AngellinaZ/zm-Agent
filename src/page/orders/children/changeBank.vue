<template>
    <div class='comSheet changeBank childPage' v-cloak>
        <head-top head-title='申请更换银行' :go-back='true'></head-top>
        <section class="module-20">
            <ul class="module userInfo">
                <li>
                   <p class="tit">贷款信息</p>
                </li>
                <li>贷款人: {{ name }}</li>
                <li>配偶: <span v-if='spouseName'>{{ spouseName }}</span><span v-else>暂无</span></li>
                <li>原贷款银行: {{ oldBankName }}</li>
            </ul>
            <p class="moduleNotice" v-if='isBnakNode'><span>*</span>灰色不能选的银行，表示暂停车贷业务</p>
            <ul class="module-list" :class="{module : !isBnakNode}">
                <li>
                   <p class="tit">更换银行</p>
                </li>
                <li>
                    <span>新贷款银行</span>
                    <select name='bank' v-model='loanBankId'>
                        <option v-for='bank in banks' :value='bank.id' :disabled="bank.status == 0">{{ bank.bankname }}</option>
                    </select>
                </li>
            </ul>
            
            <p class="moduleNotice"><span>*</span>需让借款人重新签署新银行的信用查询材料，并上传</p>
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
                        <img src="/static/images/pic/camer.png" />
                    </p>
                </li>
            </ul>
            <div class="module text">
                <textarea placeholder="请输入更换银行原因..." v-model="repeatedChangeBankMemo"></textarea>
            </div>
            <button class="opration" @click="submit()">提交</button>
        </section>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import { Toast, Indicator } from 'mint-ui'
    import { getQueryString } from '@/js/common'
    export default {
        name: 'changeBank',
        data() {
            return {
                id: "",
                webStatus: "",
                warrantPhotoArr: [],
                banks: "",
                // 页面显示
                name: "",
                spouseName: "",
                oldBankName: "",
                isBnakNode: "",
                // 提交字段
                originalBankId: "",
                originalStatus: "",
                loanBankId: "",
                repeatedChangeBankMemo: ""
            }
        },
        components: {
            headTop
        },
        methods: {
            init () {
                var that = this;
                that.id = getQueryString("id");
                that.webStatus = getQueryString("webStatus"); 
                this.$http({
                    method: 'post',
                    url: this.HOST + '/agentLoanApply/user/getLoanApplyById.htm',
                    params: {
                        id: that.id
                    }
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.name = datas.data.userName;
                        that.spouseName = datas.data.spouseName;
                        that.oldBankName = datas.data.loanBankName;
                        that.originalBankId = datas.data.loanBankId;
                        that.loanBankId = datas.data.loanBankId;
                        that.originalStatus = datas.data.status;
                        if (datas.data.warrantPhoto) {
                            var warrantPhoto = datas.data.warrantPhoto.split(',');
                            for(var i = 0; i < warrantPhoto.length; i++) {
                                var obj = {};
                                obj.src = warrantPhoto[i];
                                obj.boldSrc = warrantPhoto[i];
                                that.warrantPhotoArr.push(obj);
                            }
                        }
                        that.repeatedChangeBankMemo = datas.data.repeatedChangeBankMemo;
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            getBanks () {
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
                    } else {
                        Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                })
            },
            handleFiles:function (event) { //图片上传
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
                        fileBold = that.file;
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
                    // console.log('压缩前:' + initSize);
                    // console.log('压缩后:' + ndata.length);
                    // console.log('压缩率:' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
                    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                    return ndata;
                }
                var upload = function (basestr, inputName, bold) { //图片上传，将base64的图片转成二进制对象，上传
                    if(bold) {
                        var URL = window.URL || window.webkitURL;
                        bold = URL.createObjectURL(bold);
                    }
                    // var that = this;
                    var params = new URLSearchParams();
                    params.append('images', basestr);
                    that.$http.post(that.HOST + "/file/images.htm", params)
                    .then(function (response) {
                        if (response.data.success) {
                            var obj = {};
                            obj.src = response.data.data;
                            obj.boldSrc = bold;
                            that.warrantPhotoArr.push(obj);
                        }
                    })
                    .catch(function (error) {
                        Toast(error);
                    });
                }
            },
            deleteBox (index) {
                this.warrantPhotoArr.splice(index, 1);
            },
            // 提交接口
            submit () {
                var that = this;
                // 上传图片格式化
                var warrantPhotoArr = "";
                that.warrantPhotoArr.forEach(function (item, index) {
                    warrantPhotoArr += that.warrantPhotoArr[index].src + ",";
                })
                warrantPhotoArr = warrantPhotoArr.substring(0, warrantPhotoArr.length - 1);

                if (!that.loanBankId) {
                    Toast("请选择新贷款银行");
                } else if (that.loanBankId == that.originalBankId) {
                    Toast("新贷款银行不能与原贷款银行相同");
                } else if(!warrantPhotoArr) {
                    Toast("请上传材料照片");
                } else {
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/agentLoanApply/user/updateChangeBankloanApply.htm',
                        params: {
                            changeBankStatus : 1,
                            salemanIsAgree : 1,
                            id : that.id,
                            originalWebStatus: that.webStatus,
                            loanBankId  : that.loanBankId, //新贷款银行id
                            originalBankId : that.originalBankId, //原贷款银行id
                            originalBankName : that.oldBankName, //原贷款银行name
                            originalStatus : that.originalStatus, //贷款申请状态
                            newWarrantPhoto : warrantPhotoArr, //信用查询材料图片
                            repeatedChangeBankMemo : that.repeatedChangeBankMemo  //备注
                        }
                    }).then(function (response) {
                        var datas = response.data;
                        if (datas.success) {
                            that.$router.push({path: "/orderList"});
                        } else {
                            Toast(datas.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    })
                }
            }
        },
        created () {
            this.init(); 
            this.getBanks();
        }
    }
</script>


