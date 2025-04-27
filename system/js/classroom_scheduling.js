// 初始化数据
const classrooms = {
    'A': ['A101', 'A102', 'A201', 'A202'],
    'B': ['B101', 'B102', 'B103', 'B201'],
    'C': ['C301', 'C302', 'C401', 'C402']
};

const mockData = {
    'A101': [
        { 
            status: 1,
            type: 'class',
            course: '高等数学',
            teacher: '王教授',
            classes: ['计算机1班', '软件2班']
        },
        {
            status: 1,
            type: 'exam',
            examName: '期中考试'
        },
        { status: 0 },
        // ...其他节次数据
    ],
    // 其他教室数据类似...
};

// 教学楼选择事件
document.getElementById('building').addEventListener('change', function() {
    if (!this.value) {
        document.getElementById('tableContainer').innerHTML = '';
        return;
    }
    
    const selectedRooms = classrooms[this.value];
    const container = document.getElementById('tableContainer');
    container.innerHTML = '';
    container.appendChild(createScheduleTable(selectedRooms));
});

// 创建课表
function createScheduleTable(classrooms) {
    const table = document.createElement('table');
    table.className = 'classroom-table';
    
    // 创建表头
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    headerRow.insertCell().textContent = '教室';
    for (let i = 1; i <= 8; i++) {
        const th = document.createElement('th');
        th.textContent = i;
        headerRow.appendChild(th);
    }

    // 创建表格内容
    const tbody = table.createTBody();
    classrooms.forEach(room => {
        const row = tbody.insertRow();
        row.insertCell().textContent = room;
        
        const schedule = mockData[room] || Array(8).fill({ status: 0 });
        schedule.forEach((lesson, index) => {
            const cell = row.insertCell();
            cell.className = lesson.status ? 'occupied' : 'available';
            
            // 基础状态显示
            const statusText = document.createElement('div');
            statusText.className = 'status-text';
            statusText.textContent = lesson.status ? '占用' : '空闲';
            cell.appendChild(statusText);

            // 动态悬浮元素
            const hoverLayer = document.createElement('div');
            hoverLayer.className = 'hover-layer';
            
            // 占用时显示详情
            if (lesson.status) {
                const tooltip = createTooltip(lesson);
                hoverLayer.appendChild(tooltip);
            }
            // 空闲时显示按钮
            else {
                const btn = createBorrowButton(room, index);
                hoverLayer.appendChild(btn);
            }
            
            cell.appendChild(hoverLayer);
        });
    });

    return table;
}

// 创建提示信息
function createTooltip(lesson) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    
    let content = '';
    switch(lesson.type) {
        case 'class':
            content = `课程：${lesson.course}\n教师：${lesson.teacher}\n班级：${lesson.classes.join('、')}`;
            break;
        case 'exam':
            content = `考试：${lesson.examName}\n主办：${lesson.department}`;
            break;
        case 'borrowed':
            content = `已借用\n原因：${lesson.reason}`;
            break;
    }
    
    tooltip.innerHTML = content.replace(/\n/g, '<br>');
    return tooltip;
}

// 创建借用按钮
function createBorrowButton(room, lessonIndex) {
    const btn = document.createElement('button');
    btn.className = 'borrow-btn';
    btn.textContent = '申请';
    btn.onclick = () => openForm(room, lessonIndex + 1);
    return btn;
}

// 表单控制逻辑
const modal = document.getElementById('borrowForm');
const form = document.getElementById('applicationForm');

function openForm(room, lesson) {
    document.getElementById('applyRoom').value = room;
    document.getElementById('applyLesson').value = lesson;
    modal.style.display = 'block';
}

function closeForm() {
    modal.style.display = 'none';
    form.reset();
}

// 关闭模态框事件
document.querySelector('.close').onclick = closeForm;
window.onclick = (e) => {
    if (e.target == modal) closeForm();
}

// 表单提交处理
form.onsubmit = (e) => {
    e.preventDefault();
    
    const application = {
        room: document.getElementById('applyRoom').value,
        lesson: document.getElementById('applyLesson').value,
        name: document.getElementById('name').value,
        class: document.getElementById('class').value,
        studentId: document.getElementById('studentId').value,
        reason: document.getElementById('reason').value
    };

    if (validateForm(application)) {
        alert(`申请已提交：
        教室：${application.room}
        节次：第${application.lesson}节课
        姓名：${application.name}
        班级：${application.class}
        学号：${application.studentId}
        原因：${application.reason}`);
        closeForm();
    }
}

function validateForm(data) {
    if (!data.name || !data.class || !data.studentId || !data.reason) {
        alert('请填写所有必填项');
        return false;
    }
    if (!/^\d{10}$/.test(data.studentId)) {
        alert('学号格式不正确');
        return false;
    }
    return true;
}

// 初始化示例数据
function initMockData() {
    // 课程选项池
    const courses = ['高等数学', '大学英语', '数据结构', '计算机原理', '软件工程'];
    const teachers = ['王教授', '李老师', '张副教授', '陈讲师', '赵院士'];
    const examTypes = ['期中考试', '期末考试', '随堂测验', '等级考试', '补考'];
    
    Object.keys(classrooms).forEach(building => {
        classrooms[building].forEach(room => {
            if (!mockData[room]) {
                mockData[room] = Array.from({length: 8}, (_, index) => {
                    const rand = Math.random();
                    
                    // 40%概率生成占用数据
                    if (rand < 0.4) {
                        const typeRand = Math.random();
                        let baseData = {
                            status: 1,
                            type: typeRand < 0.7 ? 'class' : // 70%上课
                                   typeRand < 0.9 ? 'exam' : // 20%考试
                                   'borrowed' // 10%已被借用
                        };

                        // 添加具体类型信息
                        switch(baseData.type) {
                            case 'class':
                                return {
                                    ...baseData,
                                    course: courses[Math.floor(Math.random()*courses.length)],
                                    teacher: teachers[Math.floor(Math.random()*teachers.length)],
                                    classes: (() => {
                                        const classCount = Math.floor(Math.random() * 2) + 1; // 1-2个班级
                                        const grade = Math.floor(Math.random() * 4) + 1; // 1-4年级
                                        return Array.from({length: classCount}, () => 
                                            `计算机${grade}年${String.fromCharCode(65 + Math.floor(Math.random()*3))}班`
                                        );
                                    })()
                                };
                                
                            case 'exam':
                                return {
                                    ...baseData,
                                    examName: examTypes[Math.floor(Math.random()*examTypes.length)],
                                    department: '计算机学院'
                                };
                                
                            case 'borrowed':
                                return {
                                    ...baseData,
                                    reason: ['社团活动', '学术讲座', '学生会议', '竞赛准备'][Math.floor(Math.random()*4)]
                                };
                        }
                    }
                    
                    // 60%概率空闲
                    return { status: 0 };
                });
            }
        });
    });
}
initMockData();