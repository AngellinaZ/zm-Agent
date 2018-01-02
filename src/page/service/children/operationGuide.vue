<template>
    <div class='queList childPage' v-cloak>
        <head-top head-title='问题列表' :go-back='true'></head-top>
        <section v-for='item in list'>
            <p class="module">{{ item.qaClassName }}</p>
            <ul class="module-list">
                <li v-for='que in item.questionAnswer' @click="detail(que)">
                    <span>{{ que.question }}</span>
                    <em>
                        <img src="/static/images/svg/next.svg">
                    </em>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast } from 'mint-ui'
    import { formatDay, getQueryString } from '@/js/common'
    export default {
        name: 'operationGuide',
        data() {
            return {
                list: ""
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            goto:function (url) {
                myOpenWindow(url, "");
                myRemoveLocalStorage("que");
            },
            init: function() {
                var _this = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/operationGuidance/user/getQuestionAnswerClassInfoList.htm',
                    params: {}
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        _this.list = datas.data;
                    } else {
                        // mui.toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    mui.toast(error);
                });
            },
            detail: function (que) {
                console.log(que)
                mySetLocalStorage("que", que);
                myOpenWindow('../operationGuide/detail.html',"");
            }
        },
        created () {
            this.$nextTick(function () {
                this.init();
            })
        }
    }
</script>

