// 模拟成绩数据
const grades = [
    { term: '2023-2024学年 第一学期', course: '数据结构', credit: 3, score: 92, gpa: 4.0, type: '必修课', studyType: '正常修读', examType: '期末考试' },
    { term: '2023-2024学年 第一学期', course: '大学英语', credit: 2, score: 85, gpa: 3.7, type: '必修课', studyType: '免修', examType: '水平考试' },
    { term: '2023-2024学年 第一学期', course: '人工智能导论', credit: 2, score: 38, gpa: 0.0, type: '选修课', studyType: '正常修读', examType: '课程论文' },
    { term: '2022-2023学年 第一学期', course: '人工智能导论', credit: 2, score: 78, gpa: 3.0, type: '选修课', studyType: '正常修读', examType: '课程论文' },
    { term: '2022-2023学年 第一学期', course: '人工智能导论', credit: 2, score: 78, gpa: 3.0, type: '选修课', studyType: '正常修读', examType: '课程论文' },
    { term: '2022-2023学年 第二学期', course: '人工智能导论', credit: 2, score: 78, gpa: 3.0, type: '选修课', studyType: '正常修读', examType: '课程论文' },
    { term: '2023-2024学年 第一学期', course: '人工智能导论', credit: 2, score: 78, gpa: 3.0, type: '选修课', studyType: '正常修读', examType: '课程论文' },
    { term: '2023-2024学年 第一学期', course: '人工智能导论', credit: 2, score: 78, gpa: 3.0, type: '选修课', studyType: '正常修读', examType: '课程论文' },
    { term: '2023-2024学年 第一学期', course: '人工智能导论', credit: 2, score: 78, gpa: 3.0, type: '选修课', studyType: '正常修读', examType: '课程论文' },
    { term: '2023-2024学年 第一学期', course: '人工智能导论', credit: 2, score: 78, gpa: 3.0, type: '选修课', studyType: '正常修读', examType: '课程论文' },
    { term: '2023-2024学年 第一学期', course: '人工智能导论', credit: 2, score: 78, gpa: 3.0, type: '选修课', studyType: '正常修读', examType: '课程论文' },
    // 更多模拟数据...
];

let currentData = shuffle([...grades]);
let sortKey = null;

// 修改初始化部分
function init() {
// 初始时主动触发筛选
filterData();

// 绑定事件（保持原有代码不变）
document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => sortTable(th.dataset.sort));
});

document.getElementById('term').addEventListener('change', filterData);
document.getElementById('type').addEventListener('change', filterData);
}

// 渲染表格
function renderTable(data) {
    const tbody = document.getElementById('gradeBody');
    tbody.innerHTML = data.map(item => {
        // 判断是否需要标红
        const isLowScore = item.score < 60;
        const isLowGPA = item.gpa < 1.0;
        const rowClass = (isLowScore || isLowGPA) ? 'class="warning-row"' : '';
        const warningReason = [];
        if(item.score < 60) warningReason.push('成绩不及格');
        if(item.gpa < 1.0) warningReason.push('绩点过低');

        return `
            <tr ${rowClass} title="${warningReason.join('，')}">
                <td>${item.term}</td>
                <td>${item.course}</td>
                <td>${item.credit}</td>
                <td>${item.score}</td>
                <td>${item.gpa.toFixed(1)}</td>
                <td>${item.type}</td>
                <td>${item.studyType}</td>
                <td>${item.examType}</td>
            </tr>
        `;
    }).join('');
}

// 排序功能
function sortTable(key) {
    if(sortKey === key) {
        currentData.reverse();
    } else {
        currentData.sort((a, b) => b[key] - a[key]);
        sortKey = key;
    }
    renderTable(currentData);
}

function filterData() {
const term = document.getElementById('term').value;
const type = document.getElementById('type').value;

// 修改后的筛选逻辑
let filtered = grades.filter(item => {
const isCurrentTerm = term === 'current' ? 
    item.term === '2023-2024学年 第一学期' : // 根据实际当前学期修改
    item.term === term;

const isMatchType = type === 'all' ? true : item.type === type;

return isCurrentTerm && isMatchType;
});

currentData = shuffle(filtered); // 保持初始乱序
renderTable(currentData);
updateSummary(currentData);
}

// 计算统计数据
function updateSummary(data) {
    if(data.length === 0) {
        document.getElementById('avgScore').textContent = '-';
        document.getElementById('avgGPA').textContent = '-';
        return;
    }

    const total = data.reduce((acc, cur) => ({
        score: acc.score + cur.score * cur.credit,
        gpa: acc.gpa + cur.gpa * cur.credit,
        credits: acc.credits + cur.credit
    }), { score: 0, gpa: 0, credits: 0 });

    document.getElementById('avgScore').textContent = 
        (total.score / total.credits).toFixed(1);
    
    document.getElementById('avgGPA').textContent = 
        (total.gpa / total.credits).toFixed(2);
}

// 数组随机排序
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// 启动
init();