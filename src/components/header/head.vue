<template>
    <header id='head_top' class="header">
        <i v-show='!goBack'></i>
        <section v-show='goBack' @click="$router.go(-1)">
            <img src="../../../static/images/svg/back.svg"/>
        </section>
        <section class="title_head" v-if="headTitle">
            <span class="title_text">{{headTitle}}</span>
        </section>
        <section><i></i></section>
    </header>
</template>

<script>
    export default {
        name: 'headTop',
        data() {
            return {
            }
        },
        props: {
            goBack: {
                type: Boolean
            },
            headTitle: {
                type: String
            }
        },
        watch: {
            goBack(val) {
                console.log()
            }
        }
    }
</script>
