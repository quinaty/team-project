// script.js
// 初始化DOM元素
const collegeSelect = document.getElementById('college');
const gradeSelect = document.getElementById('grade');
const majorSelect = document.getElementById('major');
const queryBtn = document.getElementById('queryBtn');
const resultContainer = document.getElementById('resultContainer');
const noResultMsg = document.getElementById('noResultMsg');

// 模拟数据存储结构（学院->年级->专业->PDF路径）
const curriculumData = {
    "计算机学院": {
        "2023": {
            "计算机科学与技术": "../images/计算机科学与技术专业培养方案.PDF",
            "软件工程": "../images/软件工程专业培养方案.pdf"
        },
        "2022": {
            "计算机科学与技术": "../images/计算机科学与技术专业培养方案.PDF"
        }
    },
    "机电工程学院": {
        "2023": {
            "机电工程": "../images/机电工程专业培养方案.pdf"
        }
    }
};

/* 初始化学院选项 */
(function initCollegeOptions() {
    // 清空默认选项
    collegeSelect.innerHTML = '<option value="">请选择学院</option>';
    
    // 填充学院数据
    Object.keys(curriculumData).forEach(college => {
        const option = document.createElement('option');
        option.value = college;
        option.textContent = college;
        collegeSelect.appendChild(option);
    });
})();

/* 学院选择事件 */
collegeSelect.addEventListener('change', () => {
    // 重置下级选项
    gradeSelect.disabled = !collegeSelect.value;
    gradeSelect.innerHTML = '<option value="">请选择年级</option>';
    majorSelect.innerHTML = '<option value="">请选择专业</option>';
    majorSelect.disabled = true;

    // 填充年级数据
    if (collegeSelect.value) {
        const grades = Object.keys(curriculumData[collegeSelect.value]);
        grades.forEach(grade => {
            const option = document.createElement('option');
            option.value = grade;
            option.textContent = grade + '级';
            gradeSelect.appendChild(option);
        });
    }
});

/* 年级选择事件 */
gradeSelect.addEventListener('change', () => {
    // 重置专业选项
    majorSelect.disabled = !gradeSelect.value;
    majorSelect.innerHTML = '<option value="">请选择专业</option>';

    // 填充专业数据
    if (collegeSelect.value && gradeSelect.value) {
        const majors = Object.keys(
            curriculumData[collegeSelect.value][gradeSelect.value]
        );
        majors.forEach(major => {
            const option = document.createElement('option');
            option.value = major;
            option.textContent = major;
            majorSelect.appendChild(option);
        });
    }
});

/* 查询按钮点击处理 */
queryBtn.addEventListener('click', () => {
    // 重置显示状态
    resultContainer.style.display = 'none';
    noResultMsg.style.display = 'none';

    // 验证选择完整性
    if (!collegeSelect.value || !gradeSelect.value || !majorSelect.value) {
        alert("请完整选择学院、年级和专业！");
        return;
    }

    // 安全获取PDF路径
    const pdfPath = curriculumData[collegeSelect.value]?.[gradeSelect.value]?.[majorSelect.value];
    
    if (pdfPath) {
        // 更新PDF查看器
        const pdfViewer = document.getElementById('pdfViewer');
        const newViewer = pdfViewer.cloneNode(true);
        // 添加随机参数防止缓存
        newViewer.src = `${pdfPath}?t=${Date.now()}`;
        pdfViewer.parentNode.replaceChild(newViewer, pdfViewer);
        
        // 显示阅读器
        resultContainer.style.display = 'block';
    } else {
        // 显示未找到提示
        noResultMsg.style.display = 'block';
    }
});

/* PDF阅读器交互提示 */
// document.addEventListener('DOMContentLoaded', () => {
//     const controlsTip = document.createElement('div');
//     controlsTip.className = 'controls-tip';
//     controlsTip.innerHTML = `
//         <p>操作提示：</p>
//         <ul>
//             <li>使用鼠标滚轮缩放页面</li>
//             <li>按住空格键拖动查看内容</li>
//             <li>Ctrl+滚轮 微调缩放级别</li>
//         </ul>
//     `;
//     resultContainer.appendChild(controlsTip);
// });