<template>
    <div class='rule childPage' v-cloak>
        <head-top head-title='操作指导' :go-back='true'></head-top>
        <div class="scroll_container detail" id="scroll_section">
            <section>
                <p>{{ title }}</p>
                <div v-html='answer'></div>
            </section>
        </div>
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
                que: "",
                title: "",
                answer: ""
            }
        },
        components: {
            'head-top':headTop
        },
        methods: {
            init () {
                var que = JSON.parse(localStorage.getItem("que"));
                if (que) {
                    this.title = que.question;
                    this.answer = que.answer;
                }
            }
        },
        created () {
            this.$nextTick(() => {
                this.init();
            })
        },
        mounted (){
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

