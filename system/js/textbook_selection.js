console.log("这里是教材选用页面");

// 模拟数据
const courseData = [
    {
        term: "2025春季",
        code: "TMP0147",
        name: "JAVA程序设计",
        hours: "软件工程23(1),软件36",
        category: "专业基础课",
        type: "征订",
        status: false,
    },
    {
        term: "2025春季",
        code: "TMP0596",
        name: "操作系统",
        hours: "软件工程23(1),软件48",
        category: "专业基础课",
        type: "征订",
        status: true,
    },
    {
        term: "2025秋季",
        code: "TMP3012",
        name: "数据库原理",
        hours: "软件工程23(1),软件48",
        category: "专业基础课",
        type: "征订",
        status: false,
    },
    {
        term: "2026春季",
        code: "TMP4015",
        name: "人工智能基础",
        hours: "软件工程23(1),软件48",
        category: "专业选修课",
        type: "征订",
        status: true,
    },
    {
        term: "2023秋季",
        code: "TMP11240",
        name: "劳动教育",
        hours: "计算机类23(1),计算32",
        category: "公共选修课",
        type: "不使用教材",
        status: false,
    },
];

// 初始化学期选择器
function initTermSelector() {
    const select = document.getElementById("termSelect");
    const terms = [...new Set(courseData.map((c) => c.term))].sort();

    terms.forEach((term) => {
        const option = document.createElement("option");
        option.value = term;
        option.textContent = term;
        select.appendChild(option);
    });
}

// 过滤课程函数
function filterCourses() {
    const selectedTerm = document.getElementById("termSelect").value;
    const searchText = document
        .getElementById("searchInput")
        .value.toLowerCase();

    // 更新当前学期显示
    document.getElementById("currentTerm").textContent =
        selectedTerm === "all" ? "全部学期" : selectedTerm;

    // 复合筛选逻辑
    const filtered = courseData.filter((c) => {
        const matchTerm = selectedTerm === "all" || c.term === selectedTerm;
        const matchSearch = c.name.toLowerCase().includes(searchText);
        return matchTerm && matchSearch;
    });

    renderCourseList(filtered);
}

// 渲染课程列表
function renderCourseList(data = courseData) {
    const tbody = document.getElementById("courseList");

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="color:#999; padding:40px 0">
                    没有找到匹配的课程
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data
        .map(
            (course) => `
                <tr>
                    <td>${course.term}</td>
                    <td>${course.code}</td>
                    <td>${course.name}</td>
                    <td>${course.hours}</td>
                    <td>${course.category}</td>
                    <td>${course.type}</td>
                    <td>${course.type === "征订" ? "需要征订" : "无需处理"}</td>
                    <td>
                        <button class="action-btn ${
                            course.status ? "selected" : ""
                        }" 
                                onclick="toggleSelection(this, '${
                                    course.code
                                }')">
                            ${course.status ? "已选定" : "选定教材"}
                        </button>
                    </td>
                </tr>
            `
        )
        .join("");
}

// 切换选定状态
function toggleSelection(btn, code) {
    const course = courseData.find((c) => c.code === code);
    course.status = !course.status;
    btn.classList.toggle("selected");
    btn.textContent = course.status ? "已选定" : "选定教材";
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
    initTermSelector();
    filterCourses();
});
