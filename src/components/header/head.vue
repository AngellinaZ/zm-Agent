<template>
    <header id='head_top' class="header">
        <section @click="$router.go(-1)">
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
        props: ['headTitle', 'goBack']
    }
</script>

<style lang='less'>
    .head_goback {
        left: 0.4rem;
        width: 0.6rem;
        height: 1rem;
        line-height: 2.2rem;
        margin-left: .4rem;
    }
</style>