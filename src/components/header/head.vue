<template>
    <header id='head_top' class="header">
        <section v-show='goBack' @click="$router.go(-1)">
            <img src="../../../static/images/svg/back.svg"/>
        </section>
        <i v-show='!goBack'></i>
        <section v-if="headTitle" class="title_head">
            <span class="title_text">{{headTitle}}</span>
        </section>
        <section v-if="headTitle"><i></i></section>

        <slot name='searchDiv'></slot>
        <slot name='searchBtn'></slot>
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
