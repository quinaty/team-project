document.addEventListener("DOMContentLoaded", function () {
    console.log("这里是学生档案管理页面");

    // 模拟学生档案数据
    const studentArchive = {
        basicInfo: {
            studentId: "20230001",
            department: "计算机学院",
            className: "软件工程1班",
            campus: "主校区",
            namePinyin: "Zhang San",
            englishName: "John Smith",
            gender: "女",
            major: "软件工程",
            grade: "2023级",
            status: "在读",
            phone: "13800138000",
            qq: "123456789",
            email: "student@example.com",
            enrollmentYear: "2023",
            foreignLanguage: "英语",
            minor: "无",
            bankAccount: "6222021234567890",
        },
        sourceInfo: {
            candidateNumber: "2023BJ001",
            formerName: "无",
            gender: "女",
            birthDate: "2005-03-15",
            enrollmentDate: "2023-09-01",
            ethnicity: "汉族",
            politicalStatus: "共青团员",
            idType: "居民身份证",
            departureStation: "北京站",
            homeAddress: "北京市海淀区中关村大街1号",
            province: "北京市",
            homePhone: "010-12345678",
            idNumber: "110101200503150012",
            destinationStation: "上海虹桥站",
        },
    };

    // 点击“教务系统”返回首页
    document.getElementById("homeLink").addEventListener("click", function (e) {
        e.stopPropagation(); // 阻止事件冒泡
        window.location.href = "../html/index.html";
        console.log("已返回首页");
    });

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

    // 初始化数据展示
    function initDataDisplay() {
        // 填充基本信息
        Object.entries(studentArchive.basicInfo).forEach(([key, value]) => {
            const element = document.querySelector(`[data-key="${key}"]`);
            if (element) element.textContent = value;
        });

        // 填充生源信息
        Object.entries(studentArchive.sourceInfo).forEach(([key, value]) => {
            const element = document.querySelector(`[data-key="${key}"]`);
            if (element) element.textContent = value;
        });
    }

    const storageKey = "studentData";
    let studentData = JSON.parse(localStorage.getItem(storageKey)) || {};

    // 初始化可编辑字段
    function initEditFunctionality() {
        document.querySelectorAll(".editable").forEach((element) => {
            const key = element.dataset.key;
            if (studentData[key]) element.textContent = studentData[key];

            element.addEventListener("click", function (e) {
                e.stopPropagation();
                if (!this.querySelector("input")) startEdit(this); // 防止重复激活
            });
        });
    }

    checkLoginStatus_1();
    initDataDisplay();
    initEditFunctionality();

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
