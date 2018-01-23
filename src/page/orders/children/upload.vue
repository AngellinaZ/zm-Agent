<template>
    <div class='upload childPage' v-cloak>
        <head-top head-title='上传资料' :go-back='true'></head-top>
        <div class='protocol-out scroll_container' id='scroll_section'>
            <div class="markdown">
                <div class="module">
                    <p>资料类型</p>
                    <ul class="tag">
                        <li v-for='type in typeList' @click='typeName(type.attributeId)' :class="{active: attributeId == type.attributeId}"  v-if="type.attributeId == 3 || type.attributeId == 4">
                            {{ type.attributeName }}
                        </li>
                    </ul>
                </div>
                <div class="module">
                    <p>资料名称</p>
                    <ul class="tag">
                        <li v-for="name in nameList" @click="getfileId(name.id)" :class="{active: fileId == name.id}">
                            {{ name.fileName }}
                        </li>
                    </ul>
                </div>
                <form style="padding-bottom: 2.3rem">
                    <div class="module">
                        <ul class="img-list">
                            <li>
                                <input type="file" name="" @change="fileUpLoad"/>
                                <img src="/static/images/pic/camer.png" />
                            </li>
                            <li v-for="(item, index) in imgList">
                                <i @click="deleteBox(index)"></i>
                                <img :src="item" />
                            </li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
        <button class="btn btn-fixed" @click='insertFileList'>提交</button>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast, Indicator } from 'mint-ui'
    import { getQueryString } from '@/js/common'
    export default {
        name: 'upload',
        data() {
            return {
                typeList: [],
                nameList: [],
                imgList: [],
                imgLists: '',
                attributeId: 3,
                fileId: '',
                fileIds: [],
                fileNames: [],
                files: '',
                fileType: '' //判断文件上传的类型
            }
        },
        components: {
            headTop
        },
        methods: {
            init () {
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/fileUpLoad/user/getBasic.htm',
                    params: {
                        categoryId : 19
                    }
                }).then(function (response) {
                    var data = response.data;
                    if (data.success) {
                        that.typeList = data.rows;
                        that.typeName(3);
                    } else {
                        Toast(data.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            typeName (id) {
                var that = this;
                that.attributeId = id;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/fileUpLoad/user/getLoanBasicFileList.htm',
                    params: {
                        fileType: id
                    }
                }).then(function (response) {
                    var data = response.data;
                    if (data.success) {
                        that.nameList = data.rows;
                        that.fileId = data.rows[0].id;
                    } else {
                        Toast(data.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            fileUpLoad (event) {
                var that = this;
                that.files = event.target.files[0];
                Indicator.open();
                var formData = new FormData();
                formData.append("fileAddress", that.files);
                this.$http.post(this.HOST + "/fileUpLoad/user/fileUpLoad.htm", formData)
                .then(function (response) {
                    if (response.data.success) {
                        that.imgSrc = response.data.data[0];
                        that.imgList.push(that.imgSrc);
                        that.fileIds.push(that.fileId);
                        that.fileNames.push(that.files.name);
                    } 
                    Indicator.close();
                })
                .catch(function (error) {
                    Toast(error);
                });
            },
            getfileId (name) {
                this.fileId = name;
            },
            deleteBox (index) {
                this.imgList.splice(index, 1);
                this.fileIds.splice(index, 1);
                this.fileNames.splice(index, 1);
            },
            insertFileList () {
                var that = this;
                var fileIds = that.fileIds.join(',');
                var imgLists = that.imgList.join(',');
                var fileNames = that.fileNames.join(',');
                var id = getQueryString("id");
                console.log(id)
                if (!imgLists) {
                    Toast("请上传需要的照片");
                } else {
                    this.$http({
                        method: 'post',
                        url: this.HOST + '/fileUpLoad/user/insertFileList.htm',
                        params: {
                            fileId: fileIds,
                            sourceType: 0,
                            fileName: fileNames,
                            fileUrl: imgLists,
                            loanApplyId: id  
                        }
                    }).then(function (response) {
                        var data = response.data;
                        if (data.success) {
                            myConfirm('上传成功，是否继续上传！', function () {
                                that.imgList = [];
                                that.fileIds = [];
                                that.fileNames = [];
                                that.init();
                            },function () {
                                myOpenWindow('../orders/detail.html',"");
                            })
                        } else {
                            Toast(data.resultMsg);
                        }
                    }).catch(function (error) {
                        Toast(error);
                    });
                }
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


