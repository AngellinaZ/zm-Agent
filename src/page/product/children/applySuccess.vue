<template>
    <div class='childPage applySuccess' v-cloak>
        <img src="/static/images/pic/smile.png">
        <p>申请成功！</p>
        <span>稍后征信结果将通过消息告知您，</span>
        <span> 您也可到“订单”查看进度</span>
        <router-link to='/orderList'>确定</router-link>
    </div>
</template>

<script>
    export default {
        name: 'applySuccess',
        data() {
            return {
            }
        }
    }
</script>


