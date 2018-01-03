<template>
    <div class='queList childPage' v-cloak>
        <head-top head-title='问题列表' :go-back='true'></head-top>
        <div class="scroll_container" id="scroll_section">
            <div>
                <section class="que" v-for='item in list' :key='item.id'>
                    <p class="module">{{ item.qaClassName }}</p>
                    <ul class="module-list">
                        <li v-for='que in item.questionAnswer' :key='que.id' @click="detail(que)">
                            <span>{{ que.question }}</span>
                            <em>
                                <img src="/static/images/svg/next.svg">
                            </em>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
        <transition name='router-slid' mode='out-in'>
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import BScroll from 'better-scroll'
    import { Toast } from 'mint-ui'
    export default {
        name: 'operationGuide',
        data() {
            return {
                list: []
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
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.HOST + '/operationGuidance/user/getQuestionAnswerClassInfoList.htm',
                    params: {}
                }).then(function (response) {
                    var datas = response.data;
                    if (datas.success) {
                        that.list = datas.data;
                    } else {
                        // Toast(datas.resultMsg);
                    }
                }).catch(function (error) {
                    Toast(error);
                });
            },
            detail (que) {
                localStorage.setItem("que", JSON.stringify(que));
                this.gotoAddress('/service/operationGuide/operationGuideDetail');
            }
        },
        created () {
            this.init();
        },
        mounted(){
            this.$nextTick(() => {
                new BScroll('#scroll_section', {  
                    deceleration: 0.001,
                    bounce: true,
                    swipeTime: 1800,
                    click: true,
                }); 
            })
        }
    }
</script>

