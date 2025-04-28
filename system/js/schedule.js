// 更新后的模拟数据
const courses = [
    {
        department: '计算机学院',
        grade: '2025',
        courseName: '数据结构',
        courseType: '专业必修',
        classHours: 64,
        teacher: '王伟/张丽',
        time: ['周一1-2节 教二221', '周三3-4节 工一415'],
        class: ['软件工程1班', '软件工程2班', '软件工程3班'],
        students: 135
    },
    {
        department: '计算机学院',
        grade: '2024',
        courseName: '软件工程导论',
        courseType: '专业选修',
        classHours: 32,
        teacher: '李建国',
        time: ['周二3-4节 教三202'],
        class: ['软件工程卓越班'],
        students: 40
    },
    {
        department: '机电工程学院',
        grade: '2024',
        courseName: '机电工程专业导论',
        courseType: '学科基础',
        classHours: 32,
        teacher: '张磊',
        time: ['周三5-6节 教三305', '周五7-8节 教三305'],
        class: ['机电工程1班', '机电工程2班'],
        students: 85
    },
    {
        department: '物理与光电学院',
        grade: '2023',
        courseName: '大学物理',
        courseType: '专业必修',
        classHours: 56,
        teacher: '王翠兰',
        time: ['周三5-6节 教一320', '周五7-8节 教一320'],
        class: ['物理1班', '物理2班'],
        students: 85
    }
];

// 初始化筛选选项（增加部门课程联动）
function initFilterOptions() {
    const departments = [...new Set(courses.map(c => c.department))];
    const grades = [...new Set(courses.map(c => c.grade))];
    const courseTypes = [...new Set(courses.map(c => c.courseType))];

    // 初始化固定选项
    const addOptions = (selectId, values) => {
        const select = document.getElementById(selectId);
        // 清空原有选项（保留第一个默认选项）
        while(select.options.length > 1) {
            select.remove(1);
        }
        values.forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    };

    addOptions('departmentSelect', departments);
    addOptions('gradeSelect', grades);
    addOptions('courseTypeSelect', courseTypes);
    
    // 初始化课程选项（全部课程）
    updateCourseOptions();
}

// 根据当前院系更新课程选项
function updateCourseOptions() {
    const department = document.getElementById('departmentSelect').value;
    const courseSelect = document.getElementById('courseSelect');
    
    // 保留"全部课程"选项
    while(courseSelect.options.length > 1) {
        courseSelect.remove(1);
    }

    // 获取对应院系的课程
    const filteredCourses = department ? 
        courses.filter(c => c.department === department) : 
        courses;
    
    const courseNames = [...new Set(filteredCourses.map(c => c.courseName))];
    
    courseNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        courseSelect.appendChild(option);
    });

    // 如果当前选择的课程不在新列表中，重置选择
    const currentSelected = courseSelect.value;
    if(currentSelected && !courseNames.includes(currentSelected)) {
        courseSelect.value = '';
    }
}

// 修改筛选课程方法
function filterCourses() {
    const department = document.getElementById('departmentSelect').value;
    const grade = document.getElementById('gradeSelect').value;
    const courseType = document.getElementById('courseTypeSelect').value;
    const courseName = document.getElementById('courseSelect').value;

    const filtered = courses.filter(course => {
        return (!department || course.department === department) &&
               (!grade || course.grade === grade) &&
               (!courseType || course.courseType === courseType) &&
               (!courseName || course.courseName === courseName);
    });

    updateTable(filtered);
}

// 更新表格显示
function updateTable(filteredCourses) {
    const tbody = document.getElementById('courseTable');
    const table = document.querySelector('table');
    tbody.innerHTML = '';

    if (filteredCourses.length === 0) {
        table.classList.remove('show');
        return;
    }

    filteredCourses.forEach(course => {
        const row = document.createElement('tr');
        
        // 处理多值字段
        const timeContent = course.time.map(t => t.replace(' ', '\n')).join('\n');
        const classContent = course.class.join('\n');

        row.innerHTML = `
            <td>${course.department}</td>
            <td>${course.grade}</td>
            <td class="course-name" title="${course.courseName}">${course.courseName}</td>
            <td>${course.courseType}</td>
            <td>${course.classHours}</td>
            <td class="teacher" title="${course.teacher}">${course.teacher}</td>
            <td class="time" title="${course.time.join('\n')}">${course.time.join(' / ')}</td>
            <td class="class" title="${course.class.join('\n')}">${course.class.join(' / ')}</td>
            <td>${course.students}</td>
        `;

        tbody.appendChild(row);
    });

    table.classList.add('show');
}

// 修改初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    initFilterOptions();
    
    // 绑定事件监听（增加院系变化时的课程更新）
    document.getElementById('departmentSelect').addEventListener('change', () => {
        updateCourseOptions();
        filterCourses();
    });
    
    document.getElementById('gradeSelect').addEventListener('change', filterCourses);
    document.getElementById('courseTypeSelect').addEventListener('change', filterCourses);
    document.getElementById('courseSelect').addEventListener('change', filterCourses);
});