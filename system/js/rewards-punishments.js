const records = [
    {
        date: "2024-03-15",
        type: "reward",
        reason: "校级三好学生",
        detail: "荣获2023-2024学年校级三好学生称号",
        status: "approved"
    },
    {
        date: "2024-03-15",
        type: "punishment",
        reason: "考试作弊",
        detail: "期末考试携带手机作弊",
        status: "approved"
    },
    {
        date: "2024-03-15",
        type: "reward",
        reason: "学科竞赛获奖",
        detail: "荣获数学建模竞赛一等奖",
        status: "approved"
    },
    {
        date: "2024-02-28",
        type: "punishment",
        reason: "旷课处分",
        detail: "累计旷课超过10课时，给予警告处分",
        status: "approved"
    }
];

function initTable() {
    const tbody = document.getElementById('records-body');
    tbody.innerHTML = '';

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td class="${record.type}">${record.type === 'reward' ? '奖励' : '惩处'}</td>
            <td>${record.reason}</td>
            <td>${record.detail}</td>
            <td class="status-${record.status}">${record.status === 'approved' ? '已审核' : '未审核'}</td>
        `;
        tbody.appendChild(row);
    });
}

function filterRecords() {
    const filterType = document.getElementById('type-filter').value;
    const rows = document.querySelectorAll('#records-body tr');

    rows.forEach(row => {
        const typeCell = row.querySelector('td:nth-child(2)');
        const statusCell = row.querySelector('td:last-child');
        
        let shouldShow = false;
        
        switch(filterType) {
            case 'all':
                shouldShow = statusCell.classList.contains('status-approved');
                break;
            case 'reward':
                shouldShow = typeCell.classList.contains('reward') && 
                            statusCell.classList.contains('status-approved');
                break;
            case 'punishment':
                shouldShow = typeCell.classList.contains('punishment') && 
                            statusCell.classList.contains('status-approved');
                break;
            case 'unapproved':
                shouldShow = statusCell.classList.contains('status-pending');
                break;
            default:
                shouldShow = statusCell.classList.contains('status-approved');
        }
        
        row.style.display = shouldShow ? '' : 'none';
    });
}

const modal = document.getElementById('modal');
const addBtn = document.getElementById('add-record');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.querySelector('.cancel-btn');

addBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

function closeModal() {
    modal.style.display = 'none';
    document.getElementById('record-form').reset();
}

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.getElementById('record-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;
    const reason = document.getElementById('reason').value.trim();
    const detail = document.getElementById('detail').value.trim();
    const attachment = document.getElementById('attachment').files[0];

    if (!date || !reason || !detail) {
        alert('请填写所有必填字段！');
        return;
    }

    const newRecord = {
        date,
        type,
        reason,
        detail,
        attachment: attachment ? attachment.name : null,
        status: "pending"
    };

    records.unshift(newRecord);
    
    initTable();
    filterRecords();
    closeModal();
    showAlert('记录提交成功！当前状态：未审核。');
});

function showAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

document.getElementById('type-filter').addEventListener('change', filterRecords);

window.addEventListener('DOMContentLoaded', () => {
    initTable();
    filterRecords();
});