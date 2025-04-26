document.addEventListener("DOMContentLoaded", function () {
    console.log("这里是学生档案管理页面");
    // 没改完 ，这边要删的话可以全删掉，没什么用处

    // 获取 DOM 元素
    const loginButton = document.getElementById("login_button");
    const userProfile = document.getElementById("userProfile");
    const displayName = document.getElementById("displayName");
    const logoutButton = document.getElementById("logoutButton");
    const dropdownMenu = document.getElementById("dropdownMenu");

    // 检查登录状态
    function checkLoginStatus_1() {
        let isLoggedIn_1 = localStorage.getItem("isLoggedIn") === "true";
        const username = localStorage.getItem("username") || "张三";

        if (isLoggedIn_1) {
            displayName.textContent = username;
            loginButton.classList.add("hidden");
            userProfile.classList.remove("hidden");
            dropdownMenu.style.display = "none";

            // 用户名点击事件
            displayName.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdownMenu.style.display =
                    dropdownMenu.style.display === "block" ? "none" : "block";
            });

            // 退出登录事件（修复重点）
            if (!logoutButton.hasAttribute("data-event-set")) {
                logoutButton.addEventListener("click", () => {
                    // 清除登录状态
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("username");

                    // 直接跳转首页（不要同时使用reload）
                    window.location.href = "../html/index.html"; // 根据目录结构调整路径
                });
                logoutButton.setAttribute("data-event-set", "true");
            }
        } else {
            // 未登录状态处理
            displayName.textContent = "姓名";
            loginButton.classList.remove("hidden");
            userProfile.classList.add("hidden");
        }
    }

    checkLoginStatus_1();

    const storageKey = "studentData";
    let studentData = JSON.parse(localStorage.getItem(storageKey)) || {};

    // 初始化可编辑字段
    document.querySelectorAll(".editable").forEach((element) => {
        const key = element.dataset.key;
        if (studentData[key]) element.textContent = studentData[key];

        element.addEventListener("click", function (e) {
            e.stopPropagation();
            if (!this.querySelector("input")) startEdit(this); // 防止重复激活
        });
    });

    function startEdit(element) {
        const key = element.dataset.key;
        const original = element.textContent;

        // 创建编辑组件
        const wrapper = document.createElement("div");
        wrapper.className = "edit-wrapper";

        const input = document.createElement("input");
        input.className = "edit-input";
        input.value = original;

        const saveBtn = document.createElement("button");
        saveBtn.className = "save-btn";
        saveBtn.textContent = "✓";

        // 组装组件
        wrapper.appendChild(input);
        wrapper.appendChild(saveBtn);
        element.innerHTML = "";
        element.appendChild(wrapper);
        input.focus();

        // 保存处理
        const saveHandler = (e) => {
            e.stopPropagation();
            const newValue = input.value.trim();
            if (newValue !== original) {
                studentData[key] = newValue;
                localStorage.setItem(storageKey, JSON.stringify(studentData));
                element.textContent = newValue;
                rebindEvent(element);
            }
            element.textContent = newValue || original;
            rebindEvent(element);
        };

        // 事件绑定
        saveBtn.addEventListener("click", saveHandler);
        input.addEventListener("keyup", (e) => {
            if (e.key === "Enter") saveHandler(e);
        });
    }

    function rebindEvent(element) {
        element.addEventListener("click", function (e) {
            e.stopPropagation();
            if (!this.querySelector("input")) startEdit(this);
        });
    }

    // 全局点击恢复
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".editable")) {
            document.querySelectorAll(".editable").forEach((el) => {
                if (el.children.length > 0) {
                    const original = el.dataset.original || el.textContent;
                    el.textContent = studentData[el.dataset.key] || original;
                    rebindEvent(el);
                }
            });
        }
    });
});
