// export default {
    
    // 验证手机号
    function mobileValidate (mobile) {
        var mobileReg = /^1[3|4|5|7|8|][0-9]{9}$/;
        if (!mobileReg.test(mobile)) {
            return false;
        } else {
            return true;
        }
    }
    // // 验证email
    // emailValidate (email) {
    //     var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    //     if (!emailReg.test(email)) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // },
    // // 验证密码
    // pwdValidate (pwd) {
    //     var pwdReg = /^([0-9a-zA-Z_]|[~!@#$%^&*\(\)\_\+\=\{\}\[\]\?\/\,\.]){6,20}$/;
    //     if (!pwdReg.test(pwd)) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // },
    // // 验证card
    // pwdValidate (pwd) {
    //     var cardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    //     if (!cardReg.test(pwd)) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }
// }

export { mobileValidate }