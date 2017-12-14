/**
 * init font-size 初始化根元素的font-size -- rem: 依据根元素的fs计算
 **/
function initFontSize (viewWidth) {
    var viewWidth = viewWidth || document.body.scrollWidth;
    var fontSize = viewWidth / 750 * 50;
    document.getElementsByTagName("html")[0].style.fontSize = fontSize + "px"; 
}
initFontSize()

window.addEventListener("resize", function () {
    var viewWidth = document.documentElement.clientWidth;
    initFontSize(viewWidth);
});

