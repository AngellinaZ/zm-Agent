<template>
    <div class='zmInfo childPage' v-cloak>
        <head-top head-title='关于中茗' :go-back='true'></head-top>
        <section class="logo">
            <img src="/static/images/pic/logo.png">
            <span>中茗商户 V1.0.0</span>
            <em>让金融唾手可得，让信用改变生活</em>
        </section>
        <ul class="module-list">
            <li @click="gotoAddress('/reg/regProtocol')">
                <span>中茗金融注册协议</span> 
                <em><img src="/static/images/svg/next.svg"></em>
            </li>
        </ul>
        <p>
            <span>客服电话</span> 
            <a href="tel: 0571-85831036">0571-85831036</a>
        </p>
    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    export default {
        name: 'zmInfo',
        data() {
            return {
            }
        },
        methods: {
            gotoAddress (path) {
                this.$router.push(path)
            }
        },
        components: {
            'head-top':headTop
        }
    }
</script>

