document.addEventListener("DOMContentLoaded", function () {
    console.log("这里是学生档案管理页面");
    // 没改完 ，这边要删的话可以全删掉，没什么用处

    // 获取 DOM 元素
    const loginButton = document.getElementById("login_button");

    // const username = "姓名";
    const userProfile = document.getElementById("userProfile");
    const displayName = document.getElementById("displayName");
    const logoutButton = document.getElementById("logoutButton");
    const dropdownMenu = document.getElementById("dropdownMenu");

    // 检查登录状态
    function checkLoginStatus_1() {
        const isLoggedIn_1 = localStorage.getItem("isLoggedIn") === "true";
        const username = localStorage.getItem("username") || "张三";

        if (isLoggedIn_1) {
            displayName.textContent = username;
            loginButton.classList.add("hidden");
            userProfile.classList.remove("hidden");
            dropdownMenu.style.display = "none"; //让“退出登录框在刷新的时候不要出现”

            // 让用户点击用户名区域显示/隐藏下拉菜单，
            displayName.addEventListener("click", (e) => {
                if (isLoggedIn_1) {
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
                    isLoggedIn_1 = false;
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

    checkLoginStatus_1();
});
