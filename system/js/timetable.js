const timeSlots = [
    {name: "1-2节", sections: [1, 2], rowspan: 2},
    {name: "3-4节", sections: [3, 4], rowspan: 2},
    {name: "5节", sections: [5], rowspan: 1},
    {name: "6-7节", sections: [6, 7], rowspan: 2},
    {name: "8-9节", sections: [8, 9], rowspan: 2},
    {name: "10-12节", sections: [10, 11, 12], rowspan: 3},
];

const courseData = {
    "2024fall": {
        semester: "2024秋季",
        weeks: Array.from({length: 18}, (_, weekIndex) => ({
            week: weekIndex + 1,
            courses: [
                {
                    time: "1-2",
                    days: [1, 3, 5],
                    name: "高等数学",
                    place: "A201",
                    teacher: "王老师",
                },
                {
                    time: "3-4",
                    days: [2, 4, 5],
                    name: "大学物理",
                    place: "B305",
                    teacher: "李老师",
                },
                {
                    time: "6-7",
                    days: [1, 2, 3],
                    name: "数据结构",
                    place: "C401",
                    teacher: "张老师",
                },
            ],
        })),
    },
    "2025spring": {
        semester: "2025春季",
        weeks: Array.from({length: 18}, (_, weekIndex) => ({
            week: weekIndex + 1,
            courses: [
                {
                    time: "1-2",
                    days: [2, 4],
                    name: "软件工程",
                    place: "教4-310",
                    teacher: "丁国芳",
                },
                {
                    time: "3-4",
                    days: [3],
                    name: "操作系统实验",
                    place: "工1-415",
                    teacher: "谭韵彤",
                },
                {
                    time: "6-7",
                    days: [1, 3, 5],
                    name: "计算机网络",
                    place: "教3-305",
                    teacher: "姜文超",
                },
                {
                    time: "8-9",
                    days: [4],
                    name: "算法设计与分析",
                    place: "教2-316",
                    teacher: "王丽娟",
                },
                {
                    time: "10-12",
                    days: [2, 4],
                    name: "项目实践",
                    place: "实验室",
                    teacher: "陈老师",
                },
            ],
        })),
    },
};

class TimetableRenderer {
    constructor() {
        this.resizeObserver = new ResizeObserver(() => this.adjustLayout());
        this.currentSemester = "2025spring";
        this.currentWeek = "all";
        this.init();
    }

    init() {
        if (document.querySelector(".timetable-container")) {
            this.resizeObserver.observe(
                document.querySelector(".timetable-container")
            );
        }
        this.renderWeekOptions();
        this.setupEventListeners();
        this.renderTable();
    }

    adjustLayout() {
        const container = document.querySelector(".timetable-container");
        if (!container) return;

        const screenWidth = container.offsetWidth;

        const baseFontSize = screenWidth > 768 ? "14px" : "12px";
        document.querySelectorAll(".course-table td").forEach((td) => {
            td.style.fontSize = baseFontSize;
        });

        const timeColumn = document.querySelector(".time-column");
        if (timeColumn) {
            timeColumn.style.width = screenWidth > 768 ? "80px" : "60px";
        }
    }

    renderWeekOptions() {
        const selector = document.getElementById("weekSelect");
        if (!selector) return;

        selector.innerHTML = '<option value="all">全部周数</option>';
        for (let i = 1; i <= 18; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `第${i}周`;
            selector.appendChild(option);
        }
    }

    renderTable() {
        const tbody = document.getElementById("courseBody");
        if (!tbody) return;

        tbody.innerHTML = "";

        timeSlots.forEach((slot) => {
            const row = document.createElement("tr");
            const timeCell = document.createElement("td");
            timeCell.className = "time-column";
            timeCell.textContent = slot.name;
            timeCell.rowSpan = slot.rowspan;
            row.appendChild(timeCell);

            for (let day = 1; day <= 7; day++) {
                const cell = document.createElement("td");
                cell.className = "merged-cell";
                cell.dataset.slot = slot.name;
                cell.dataset.day = day;
                row.appendChild(cell);
            }
            tbody.appendChild(row);

            for (let i = 1; i < slot.rowspan; i++) {
                tbody.appendChild(document.createElement("tr"));
            }
        });

        this.fillCourses();
    }

    fillCourses() {
        const currentData = courseData[this.currentSemester];
        const weekData =
            this.currentWeek === "all"
                ? this.getMergedCourses(currentData.weeks)
                : currentData.weeks.find(
                      (w) => w.week === Number(this.currentWeek)
                  )?.courses || [];

        document
            .querySelectorAll(".course-item")
            .forEach((item) => item.remove());

        weekData.forEach((course) => {
            const [start, end] = course.time.split("-").map(Number);
            const duration = end ? end - start + 1 : 1;
            const slot = timeSlots.find(
                (s) =>
                    s.sections[0] === start &&
                    s.sections[s.sections.length - 1] === (end || start)
            );

            if (slot) {
                course.days.forEach((day) => {
                    const cell = document.querySelector(
                        `td[data-slot="${slot.name}"][data-day="${day}"]`
                    );
                    if (cell && !cell.querySelector(".course-item")) {
                        const item = document.createElement("div");
                        item.className = "course-item";
                        item.innerHTML = `
                            <div>${course.name}</div>
                            <div>${course.teacher}</div>
                            <div>${course.place}</div>
                            ${
                                duration > 1
                                    ? `<div>${duration}节连上</div>`
                                    : ""
                            }
                        `;
                        cell.appendChild(item);
                    }
                });
            }
        });
    }

    getMergedCourses(weeks) {
        const courseMap = new Map();
        weeks
            .flatMap((w) => w.courses)
            .forEach((course) => {
                const key = `${course.time}-${course.days.join(",")}-${
                    course.name
                }`;
                if (!courseMap.has(key)) {
                    courseMap.set(key, course);
                }
            });
        return Array.from(courseMap.values());
    }

    setupEventListeners() {
        const semesterSelect = document.getElementById("semesterSelect");
        if (semesterSelect) {
            semesterSelect.addEventListener("change", (e) => {
                this.currentSemester = e.target.value;
                this.currentWeek = "all";
                this.renderTable();
            });
        }

        const weekSelect = document.getElementById("weekSelect");
        if (weekSelect) {
            weekSelect.addEventListener("change", (e) => {
                this.currentWeek = e.target.value;
                this.renderTable();
            });
        }
    }
}

class MemoManager {
    constructor() {
        this.username = localStorage.getItem("username") || "default";
        this.memos = [];
        this.currentEditIndex = -1;
        this.init();
    }

    init() {
        this.loadMemos();
        this.setupGlobalListeners();
    }

    setupGlobalListeners() {
        const memoList = document.getElementById("memoList");
        if (memoList) {
            memoList.addEventListener("keypress", (e) => {
                if (
                    e.target.classList.contains("memo-input") &&
                    e.key === "Enter"
                ) {
                    const index = parseInt(
                        e.target.closest(".memo-item").dataset.index
                    );
                    this.saveEdit(index);
                }
            });
        }
    }

    loadMemos() {
        const data = JSON.parse(localStorage.getItem("memoData") || "{}");
        this.memos = data[this.username]?.memos || [];
        this.renderMemos();
    }

    saveMemos() {
        const data = JSON.parse(localStorage.getItem("memoData") || "{}");
        data[this.username] = {memos: this.memos};
        localStorage.setItem("memoData", JSON.stringify(data));
    }

    renderMemos() {
        const container = document.getElementById("memoList");
        if (!container) return;

        container.innerHTML = this.memos
            .map(
                (memo, index) => `
            <div class="memo-item ${
                memo.done ? "done" : ""
            }" data-index="${index}">
                <input class="memo-input" value="${memo.content}" 
                    ${index === this.currentEditIndex ? "" : "readonly"}>
                <div class="memo-actions">
                    <button class="done-btn" onclick="memoManager.toggleDone(${index})">
                        ${memo.done ? "取消完成" : "完成"}
                    </button>
                    ${
                        index === this.currentEditIndex
                            ? `<button class="save-btn" onclick="memoManager.saveEdit(${index})">保存</button>`
                            : `<button class="edit-btn" onclick="memoManager.startEdit(${index})">编辑</button>`
                    }
                    <button class="delete-btn" onclick="memoManager.deleteMemo(${index})">删除</button>
                </div>
            </div>
        `
            )
            .join("");
    }

    addMemo(content = "") {
        this.memos.unshift({
            content: content || "新备忘",
            done: false,
        });
        this.saveMemos();
        this.renderMemos();
        this.startEdit(0); // 自动进入编辑模式
    }

    toggleDone(index) {
        this.memos[index].done = !this.memos[index].done;
        this.saveMemos();
        this.renderMemos();
    }

    startEdit(index) {
        this.currentEditIndex = index;
        this.renderMemos();
        const input = document.querySelector(
            `.memo-item[data-index="${index}"] .memo-input`
        );
        if (input) {
            input.focus();
            input.select();
        }
    }

    saveEdit(index) {
        const input = document.querySelector(
            `.memo-item[data-index="${index}"] .memo-input`
        );
        if (input) {
            this.memos[index].content = input.value;
            this.currentEditIndex = -1;
            this.saveMemos();
            this.renderMemos();
        }
    }

    deleteMemo(index) {
        if (confirm("确定要删除这个备忘吗？")) {
            this.memos.splice(index, 1);
            this.saveMemos();
            this.renderMemos();
        }
    }

    resetBackground() {
        document.body.style.backgroundImage = "";
        const memoData = JSON.parse(localStorage.getItem("memoData") || "{}");
        if (this.username in memoData) {
            delete memoData[this.username].background;
        }
        localStorage.setItem("memoData", JSON.stringify(memoData));
    }

    saveBackground(url) {
        const memoData = JSON.parse(localStorage.getItem("memoData") || "{}");
        if (!(this.username in memoData)) {
            memoData[this.username] = {memos: []};
        }
        memoData[this.username].background = url;
        localStorage.setItem("memoData", JSON.stringify(memoData));
    }
}

// Initialize components
let timetable;
let memoManager;

document.addEventListener("DOMContentLoaded", function () {
    timetable = new TimetableRenderer();
    memoManager = new MemoManager();

    // Set up background reset function in global scope
    window.resetBackground = function () {
        if (memoManager && typeof memoManager.resetBackground === "function") {
            memoManager.resetBackground();
        }
    };

    // Set up add memo function in global scope
    window.addNewMemo = function () {
        const newContent = prompt("请输入备忘内容：");
        if (newContent) {
            memoManager.addMemo(newContent);
        }
    };
});

// For the background upload button (if it exists)
document.addEventListener("DOMContentLoaded", function () {
    const bgUpload = document.getElementById("bgUpload");
    if (bgUpload) {
        bgUpload.addEventListener("change", function (e) {
            const reader = new FileReader();
            reader.onload = function () {
                document.body.style.backgroundImage = `url(${this.result})`;
                if (
                    memoManager &&
                    typeof memoManager.saveBackground === "function"
                ) {
                    memoManager.saveBackground(this.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        });
    }
});
