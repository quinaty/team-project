document.addEventListener("DOMContentLoaded", function () {
    console.log("这里是首页");

    // 点击“教务系统”返回首页
    document.getElementById("homeLink").addEventListener("click", function () {
        window.location.href = "../html/index.html";
        console.log("已返回首页");
    });

    // 点击头部栏返回页面顶部
    document.getElementById("goToTop").addEventListener("click", function () {
        window.scrollTo({top: 0, behavior: "smooth"});
        console.log("已返回页面顶部");
    });
});
