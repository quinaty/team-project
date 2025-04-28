// 模拟数据 - 可根据实际教室设备修改
const mockData = {
    repairTypes: {
        电器类: [
            "投影仪故障",
            "音响设备故障",
            "电子白板故障",
            "空调故障",
            "照明设备故障",
        ],
        水暖类: ["水管漏水", "下水道堵塞", "水龙头损坏"],
        家具类: ["课桌椅损坏", "储物柜故障", "讲台损坏"],
        网络类: ["Wi-Fi连接问题", "网络端口故障", "交换机故障"],
        其他类: ["门窗损坏", "墙面损坏", "地面损坏"],
    },
    campuses: ["大学城校区", "龙洞校区", "东风路校区", "番禺校区"],
};

// 全局变量
let uploadedFiles = [];
let repairRecords = []; // 存储申请记录
let showRecords = false; // 控制显示状态

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", function () {
    initFormOptions();
    setupEventListeners();
    loadRecords(); // 加载记录
});

// 初始化表单选项
function initFormOptions() {
    // 填充报修类别
    const typeSelect = document.getElementById("repairType");
    if (typeSelect) {
        Object.entries(mockData.repairTypes).forEach(([category, items]) => {
            const optgroup = document.createElement("optgroup");
            optgroup.label = category;
            items.forEach((item) => {
                const option = document.createElement("option");
                option.value = `${category}:${item}`; // 使用冒号分隔类别和具体项目
                option.textContent = item;
                optgroup.appendChild(option);
            });
            typeSelect.appendChild(optgroup);
        });
    }

    // 填充校区
    const campusSelect = document.getElementById("campus");
    if (campusSelect) {
        mockData.campuses.forEach((campus) => {
            const option = document.createElement("option");
            option.value = campus;
            option.textContent = campus;
            campusSelect.appendChild(option);
        });
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 图片上传区域点击事件
    const uploadArea = document.getElementById("uploadArea");
    if (uploadArea) {
        uploadArea.addEventListener("click", handleUploadClick);
    }

    // 表单提交事件
    const repairForm = document.getElementById("repairForm");
    if (repairForm) {
        repairForm.addEventListener("submit", handleSubmit);
    }

    // 切换显示按钮事件
    document
        .getElementById("showRecordsBtn")
        .addEventListener("click", function () {
            showRecordsSection(true);
        });

    document
        .getElementById("showFormBtn")
        .addEventListener("click", function () {
            showRecordsSection(false);
        });

    // 退出登录事件
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout);
    }
}

// 显示/隐藏记录部分
function showRecordsSection(show) {
    const isShowingRecords = show;
    document.querySelector(".repair-form").style.display = isShowingRecords
        ? "none"
        : "block";
    document.querySelector(".repair-records").style.display = isShowingRecords
        ? "block"
        : "none";
    document
        .getElementById("showRecordsBtn")
        .classList.toggle("active", isShowingRecords);
    document
        .getElementById("showFormBtn")
        .classList.toggle("active", !isShowingRecords);
}

// 处理图片上传点击
function handleUploadClick() {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";

    input.onchange = (e) => {
        const files = Array.from(e.target.files).slice(
            0,
            6 - uploadedFiles.length
        );
        uploadedFiles = [...uploadedFiles, ...files];
        renderPreviews();
    };

    input.click();
}

// 渲染图片预览
function renderPreviews() {
    const container = document.getElementById("previewContainer");
    if (!container) return;

    container.innerHTML = uploadedFiles
        .map(
            (file, index) => `
            <div class="preview-item">
                <img src="${URL.createObjectURL(file)}" alt="预览图${
                index + 1
            }">
                <button class="remove-btn" data-index="${index}">×</button>
            </div>
        `
        )
        .join("");

    // 添加删除按钮事件
    document.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            uploadedFiles.splice(index, 1);
            renderPreviews();
        });
    });
}

// 处理表单提交
function handleSubmit(e) {
    e.preventDefault();

    // 表单验证
    const repairType = document.getElementById("repairType").value;
    const campus = document.getElementById("campus").value;
    const building = document.getElementById("building").value;
    const roomNumber = document.getElementById("roomNumber").value;
    const location = document.getElementById("location").value;
    const phone = document.getElementById("phone").value;
    const description = document.getElementById("description").value;

    if (
        !repairType ||
        !campus ||
        !building ||
        !roomNumber ||
        !location ||
        !phone ||
        !description
    ) {
        alert("请填写所有必填项（带*的字段）");
        return;
    }

    // 格式化报修类型数据
    const [category, item] = repairType.split(":");

    // 获取当前用户名
    const username = getCurrentUsername();
    if (!username) {
        alert("请先登录后再提交报修申请");
        return;
    }

    // 构建提交数据
    const formData = {
        id: Date.now().toString(), // 使用时间戳作为唯一ID
        username: username, // 关联用户名
        repairType: {
            category: category,
            item: item,
        },
        campus: campus,
        building: building,
        roomNumber: roomNumber,
        location: location,
        phone: phone,
        description: description,
        images: uploadedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            url: URL.createObjectURL(file),
        })),
        status: "已申请",
        submitTime: new Date().toISOString(),
    };

    console.log("提交数据:", formData);
    alert("报修申请已提交！");

    // 添加到记录
    addRepairRecord(formData);

    // 重置表单
    document.getElementById("repairForm").reset();
    uploadedFiles = [];
    renderPreviews();

    // 切换到记录页面
    showRecordsSection(true);
}

// 添加维修记录
function addRepairRecord(record) {
    // 获取现有记录
    let records = JSON.parse(localStorage.getItem("repairRecords")) || [];

    // 添加新记录
    records.unshift({...record});

    // 保存到本地存储
    localStorage.setItem("repairRecords", JSON.stringify(records));

    // 更新表格
    updateRecordsTable();
}

// 更新记录表格
function updateRecordsTable() {
    const username = getCurrentUsername();
    if (!username) {
        const tableBody = document.getElementById("recordsBody");
        if (tableBody) {
            tableBody.innerHTML =
                "<tr><td colspan='7' style='text-align: center;'>请登录后查看记录</td></tr>";
        }
        return;
    }

    const records = JSON.parse(localStorage.getItem("repairRecords")) || [];
    // 精确过滤当前用户的记录
    const userRecords = records.filter((r) => r.username === username);

    const tableBody = document.getElementById("recordsBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (userRecords.length === 0) {
        tableBody.innerHTML =
            "<tr><td colspan='7' style='text-align: center;'>暂无申请记录</td></tr>";
        return;
    }

    userRecords.forEach((record) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${formatDate(record.submitTime)}</td>
            <td>${record.repairType.category}:${record.repairType.item}</td>
            <td>${record.campus}</td>
            <td>${record.building} ${record.roomNumber} ${record.location}</td>
            <td>${record.phone}</td>
            <td>${getStatusText(record.status)}</td>
            <td>
                <button class="view-btn" data-id="${record.id}">查看</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // 添加查看按钮事件
    document.querySelectorAll(".view-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            viewRecord(this.getAttribute("data-id"));
        });
    });
}

// 查看记录详情
function viewRecord(id) {
    const records = JSON.parse(localStorage.getItem("repairRecords")) || [];
    const record = records.find((r) => r.id == id);
    if (record) {
        alert(`查看记录详情:\n\n${JSON.stringify(record, null, 2)}`);
    } else {
        alert("未找到该记录");
    }
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
        date.getDate()
    )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
}

function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        已申请: "待处理",
        受理中: "处理中",
        已派工: "维修中",
        已完成: "已完成",
        已评价: "已结束",
    };
    return statusMap[status] || status;
}

// 获取当前登录用户的用户名
function getCurrentUsername() {
    // 检查localStorage中是否有用户名
    const username = localStorage.getItem("username");
    if (username) return username;

    // 如果没有，检查是否有旧版登录状态（不推荐）
    const oldUsername = localStorage.getItem("oldUsername");
    if (oldUsername) {
        console.warn("检测到旧版登录状态，建议升级为使用username");
        return oldUsername;
    }

    return null;
}

// 处理退出登录
function handleLogout() {
    const username = getCurrentUsername();
    if (username) {
        // 清除该用户的记录
        clearUserRecords(username);

        // 清除登录状态
        localStorage.removeItem("username");

        // 显示提示
        // alert(`用户 ${username} 已退出登录`);

        // 刷新页面以更新UI
        window.location.reload();
    }
}

// 清除特定用户的所有记录
function clearUserRecords(username) {
    if (!username) return;

    // 获取所有记录
    const allRecords = JSON.parse(localStorage.getItem("repairRecords")) || [];
    // 过滤掉当前用户的记录
    const filteredRecords = allRecords.filter(
        (record) => record.username !== username
    );

    // 更新存储
    localStorage.setItem("repairRecords", JSON.stringify(filteredRecords));
}

// 页面加载时加载记录
function loadRecords() {
    updateRecordsTable();
}
