document.addEventListener("DOMContentLoaded", function () {
    console.log("这里是首页");

    // 点击“教务系统”返回首页
    document.getElementById("homeLink").addEventListener("click", function (e) {
        e.stopPropagation(); // 阻止事件冒泡
        window.location.href = "../html/index.html";
        console.log("已返回首页");
    });

    // 点击头部栏返回页面顶部
    document.getElementById("goToTop").addEventListener("click", function (e) {
        e.stopPropagation(); // 阻止事件冒泡
        window.scrollTo({top: 0, behavior: "smooth"});
        console.log("已返回页面顶部");
    });

    // 获取 DOM 元素
    const loginButton = document.getElementById("login_button");
    const loginModal = document.getElementById("login_modal");
    const closeModal = document.getElementById("close_modal");
    const submitLogin = document.getElementById("submit_login");
    const userIdInput = document.getElementById("userId");
    const passwordInput = document.getElementById("password");
    // const username = "姓名";
    const userProfile = document.getElementById("userProfile");
    const displayName = document.getElementById("displayName");
    const logoutButton = document.getElementById("logoutButton");
    const dropdownMenu = document.getElementById("dropdownMenu");

    let isLoggedIn = false;

    // 点击登录按钮，显示登录栏并添加遮罩层
    loginButton.addEventListener("click", (e) => {
        if (!isLoggedIn) {
            loginModal.classList.remove("hidden");
            document.body.style.overflow = "hidden"; // 禁止页面滚动
            createOverlay(); // 创建遮罩层
        }
        e.stopPropagation(); // 阻止事件冒泡
    });

    // 点击关闭按钮，隐藏登录栏并移除遮罩层
    closeModal.addEventListener("click", () => {
        loginModal.classList.add("hidden");
        document.body.style.overflow = ""; // 恢复页面滚动
        removeOverlay(); // 移除遮罩层
    });

    // 点击遮罩层，隐藏登录栏并移除遮罩层
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal_overlay")) {
            loginModal.classList.add("hidden");
            document.body.style.overflow = "";
            removeOverlay();
        }
    });

    // 提交登录表单
    submitLogin.addEventListener("click", () => {
        const userId = userIdInput.value;
        const password = passwordInput.value;

        // 简单验证（实际项目中应使用后端验证）
        if (userId === "admin" && password === "123456") {
            // 登录成功
            loginModal.classList.add("hidden");
            document.body.style.overflow = "";
            removeOverlay();

            //设置登录状态
            isLoggedIn = true;
            const username = "张三"; // 这里可以改为从登录表单获取
            displayName.textContent = username;

            //切换显示登录按钮和用户信息
            loginButton.classList.add("hidden");
            userProfile.classList.remove("hidden");

            // 存储登录状态到localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", username);
            checkLoginStatus();
        } else {
            alert("用户名或密码错误！");
        }
    });

    // 点击退出登录
    logoutButton.addEventListener("click", () => {
        isLoggedIn = false;
        displayName.textContent = "姓名";

        // 切换显示登录按钮和用户信息
        loginButton.classList.remove("hidden");
        userProfile.classList.add("hidden");

        // 清除登录状态
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");

        console.log("已退出登录");
    });

    // 点击用户名区域显示/隐藏下拉菜单
    displayName.addEventListener("click", (e) => {
        if (isLoggedIn) {
            e.stopPropagation(); // 阻止事件冒泡
            dropdownMenu.style.display =
                dropdownMenu.style.display === "block" ? "none" : "block";
        }
    });

    // 点击页面其他区域关闭下拉菜单
    document.addEventListener("click", () => {
        dropdownMenu.style.display = "none";
    });

    // 创建遮罩层（用于暗化背景）
    function createOverlay() {
        const overlay = document.createElement("div");
        overlay.classList.add("modal_overlay");
        overlay.addEventListener("click", () => {
            loginModal.classList.add("hidden");
            document.body.style.overflow = "";
            removeOverlay();
        });
        document.body.appendChild(overlay);
    }

    // 移除遮罩层
    function removeOverlay() {
        const overlay = document.querySelector(".modal_overlay");
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }

    // 检查登录状态
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const username = localStorage.getItem("username") || "张三";

        if (isLoggedIn) {
            displayName.textContent = username;
            loginButton.classList.add("hidden");
            userProfile.classList.remove("hidden");
            dropdownMenu.style.display = "none"; //让“退出登录框在刷新的时候不要出现”

            // 让用户点击用户名区域显示/隐藏下拉菜单，
            displayName.addEventListener("click", (e) => {
                if (isLoggedIn) {
                    e.stopPropagation(); // 阻止事件冒泡
                    dropdownMenu.style.display =
                        dropdownMenu.style.display === "block"
                            ? "none"
                            : "block";
                }
            });

            // 设置点击事件
            if (!logoutButton.hasAttribute("data-event-set")) {
                logoutButton.addEventListener("click", () => {
                    isLoggedIn = false;
                    displayName.textContent = "姓名";

                    loginButton.classList.remove("hidden");
                    userProfile.classList.add("hidden");

                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("username");
                });

                logoutButton._clickEventBound = true;
            }
        } else {
            displayName.textContent = "姓名";
            loginButton.classList.remove("hidden");
            userProfile.classList.add("hidden");
        }
    }
    // 确保在页面加载时调用 checkLoginStatus
    checkLoginStatus();
});
