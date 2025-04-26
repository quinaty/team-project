 // 模拟数据
 const departmentData = {
    '计算机学院': ['计算机科学与技术', '软件工程', '网络工程'],
    '文学院': ['汉语言文学', '历史学', '哲学'],
    '管理学院': ['工商管理', '市场营销', '会计学']
};

const classData = {
    '计算机科学与技术': ['1班', '2班', '3班', '伏羲班'],
    '软件工程': ['1班', '2班', '卓越班'],
    '网络工程': ['1班', '2班', '3班'],
    '汉语言文学': ['1班', '2班', '国学班'],
    '历史学': ['1班', '文献研究班'],
    '哲学': ['1班', '2班'],
    '工商管理': ['1班', '2班', '国际班'],
    '市场营销': ['1班', '创业班'],
    '会计学': ['1班', '2班', 'ACCA班']
};

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    const departmentSelect = document.getElementById('department');
    const majorSelect = document.getElementById('major');
    const classSelect = document.getElementById('class');

    // 院系选择事件
    departmentSelect.addEventListener('change', function() {
        const selectedDept = this.value;
        
        // 重置后续选项
        majorSelect.innerHTML = '<option value="">请选择专业</option>';
        classSelect.innerHTML = '<option value="">请选择班级</option>';
        majorSelect.disabled = !selectedDept;
        classSelect.disabled = true;

        if (selectedDept) {
            // 填充专业选项
            departmentData[selectedDept].forEach(major => {
                const option = new Option(major, major);
                majorSelect.add(option);
            });
            majorSelect.disabled = false;
        }
    });

    // 专业选择事件
    majorSelect.addEventListener('change', function() {
        const selectedMajor = this.value;
        
        // 重置班级选项
        classSelect.innerHTML = '<option value="">请选择班级</option>';
        classSelect.disabled = !selectedMajor;

        if (selectedMajor && classData[selectedMajor]) {
            // 填充班级选项
            classData[selectedMajor].forEach(className => {
                const option = new Option(`${selectedMajor} ${className}`, className);
                classSelect.add(option);
            });
            classSelect.disabled = false;
        }
    });

    // 表单提交验证
    document.getElementById('changeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            alert('提交成功！');
            this.reset();
            // 重置状态
            majorSelect.innerHTML = '<option value="">请先选择院系</option>';
            classSelect.innerHTML = '<option value="">请先选择专业</option>';
            majorSelect.disabled = true;
            classSelect.disabled = true;
        }
    });

    function validateForm() {
        let isValid = true;
        const requiredFields = document.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '#ddd';
            }
        });
        
        return isValid;
    }
});