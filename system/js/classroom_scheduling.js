// const OCCUPY_REASONS = ['专业课程', '等级考试', '学术会议', '社团活动', '临时借用'];
// let currentSelectedCell = null;

// document.addEventListener('DOMContentLoaded', () => {
//     const buildingSelect = document.getElementById('building');
//     const dateInput = document.getElementById('date');

//     // 初始化教学楼
//     const buildings = ['第一教学楼', '第二教学楼', '第三教学楼', '第四教学楼', '第五教学楼'];
//     buildings.forEach(building => {
//         const option = document.createElement('option');
//         option.value = building;
//         option.textContent = building;
//         buildingSelect.appendChild(option);
//     });

//     // 教学楼选择事件
//     buildingSelect.addEventListener('change', () => {
//         if (buildingSelect.value) {
//             dateInput.disabled = false;
//             // 初始化日期范围
//             const today = new Date();
//             const maxDate = new Date(today);
//             maxDate.setDate(today.getDate() + 14);
            
//             dateInput.min = today.toISOString().split('T')[0];
//             dateInput.max = maxDate.toISOString().split('T')[0];
//             dateInput.value = today.toISOString().split('T')[0];
            
//             // 立即生成表格
//             updateTable();
//         } else {
//             dateInput.disabled = true;
//             document.getElementById('tableContainer').innerHTML = '';
//         }
//     });

//     // 日期选择事件
//     dateInput.addEventListener('change', updateTable);

//     function updateTable() {
//         if (buildingSelect.value && dateInput.value) {
//             const data = generateMockData(buildingSelect.value, dateInput.value);
//             renderTable(data);
//         }
//     }
// });

// // 生成模拟数据（简化版）
// // function generateMockData(building, date) {
// //     const classrooms = [];
// //     const periods = 10;
    
// //     for (let i = 1; i <= 20; i++) {
// //         const classroom = {
// //             name: `${building} ${i.toString().padStart(2, '0')}室`,
// //             schedule: []
// //         };

// //         for (let j = 1; j <= periods; j++) {
// //             const isOccupied = Math.random() < 0.3;
// //             classroom.schedule.push({
// //                 period: j,
// //                 occupied: isOccupied
// //             });
// //         }
// //         classrooms.push(classroom);
// //     }
// //     return { building, date, classrooms };
// // }

// function generateMockData(building, date) {
//     const classrooms = [];
//     const periods = 10;
    
//     for (let i = 1; i <= 30; i++) {
//         const classroom = {
//             name: `${building} ${i.toString().padStart(2, '0')}室`,
//             schedule: []
//         };

//         for (let j = 1; j <= periods; j++) {
//             const isOccupied = Math.random() < 0.3;
//             const lesson = {
//                 period: j,
//                 occupied: isOccupied
//             };
            
//             if (isOccupied) {
//                 // 添加随机占用原因
//                 lesson.reason = OCCUPY_REASONS[
//                     Math.floor(Math.random() * OCCUPY_REASONS.length)
//                 ];
//             }
            
//             classroom.schedule.push(lesson);
//         }
//         classrooms.push(classroom);
//     }
//     return { building, date, classrooms };
// }

// // 渲染表格（优化版）
// function renderTable(data) {
//     const container = document.getElementById('tableContainer');
//     container.innerHTML = '';

//     const table = document.createElement('table');
//     table.className = 'visible';

//     // 表头
//     const thead = document.createElement('thead');
//     thead.innerHTML = `
//         <tr>
//             <th>教室/节次</th>
//             ${Array.from({length: 10}, (_, i) => `<th>第${i+1}节</th>`).join('')}
//         </tr>
//     `;
//     table.appendChild(thead);

//     // 表格内容
//     const tbody = document.createElement('tbody');
//     data.classrooms.forEach(classroom => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${classroom.name}</td>
//             ${classroom.schedule.map(lesson => `
//                 <td class="${lesson.occupied ? 'occupied' : 'vacant'}" 
//                     ${lesson.occupied ? `data-reason="${lesson.reason}"` : ''}>
//                     ${lesson.occupied ? '占用' : `
//                         <span class="status">空闲</span>
//                         <button class="apply-btn">申请</button>
//                     `}
//                 </td>
//             `).join('')}
//         `;
//         tbody.appendChild(row);
//     });
//     table.appendChild(tbody);
//     container.appendChild(table);

//     // 添加事件监听
//     addTableInteractions();
// }

// // 新增交互功能函数
// function addTableInteractions() {
//     const table = document.querySelector('table');
    
//     // 占用单元格提示
//     table.addEventListener('mouseover', (e) => {
//         const cell = e.target.closest('td.occupied');
//         if (cell) {
//             const reason = cell.dataset.reason;
//             showTooltip(cell, `占用原因：${reason}`);
//         }
//     });

//     // 申请按钮处理
//     table.addEventListener('mouseover', (e) => {
//         const btn = e.target.closest('.apply-btn');
//         if (btn) {
//             const cell = btn.closest('td');
//             positionButton(btn, cell);
//         }
//     });

//     table.addEventListener('click', (e) => {
//         const btn = e.target.closest('.apply-btn');
//         if (btn) {
//             currentSelectedCell = btn.closest('td');
//             showApplicationForm();
//         }
//     });

//     // 隐藏提示
//     table.addEventListener('mouseout', (e) => {
//         if (e.target.closest('td.occupied')) {
//             hideTooltip();
//         }
//     });
// }

// // 新增工具函数
// function showTooltip(element, text) {
//     hideTooltip();
//     const tooltip = document.createElement('div');
//     tooltip.className = 'tooltip';
//     tooltip.textContent = text;
//     document.body.appendChild(tooltip);
    
//     const rect = element.getBoundingClientRect();
//     // 调整提示位置到单元格正上方
//     tooltip.style.left = `${rect.left + rect.width/2}px`;
//     tooltip.style.top = `${rect.top - 3}px`; // 减少间距
//     tooltip.classList.add('show');
// }

// function hideTooltip() {
//     const existing = document.querySelector('.tooltip');
//     if (existing) existing.remove();
// }

// function positionButton(button, cell) {
//     const rect = cell.getBoundingClientRect();
//     button.style.left = `${rect.width/2 - 30}px`;
//     button.style.top = `${rect.height/2 - 15}px`;
// }

// function showApplicationForm() {
//     const formHtml = `
//         <div class="modal-overlay">
//             <div class="modal">
//                 <h3>教室借用申请</h3>
//                 <form id="applicationForm">
//                     <div class="form-group">
//                         <label>姓名：</label>
//                         <input type="text" required>
//                     </div>
//                     <div class="form-group">
//                         <label>学号：</label>
//                         <input type="text" pattern="\\d{10}" required>
//                     </div>
//                     <div class="form-group">
//                         <label>班级：</label>
//                         <input type="text" required>
//                     </div>
//                     <div class="form-group">
//                         <label>借用原因：</label>
//                         <textarea required></textarea>
//                     </div>
//                     <div class="button-group">
//                         <button type="submit">提交</button>
//                         <button type="button" class="cancel">取消</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     `;
    
//     document.body.insertAdjacentHTML('beforeend', formHtml);
    
//     const modal = document.querySelector('.modal-overlay');
//     const form = document.getElementById('applicationForm');
    
//     form.addEventListener('submit', (e) => {
//         e.preventDefault();
//         alert('申请已提交，请等待审核');
//         modal.remove();
//     });
    
//     modal.querySelector('.cancel').addEventListener('click', () => {
//         modal.remove();
//     });
// }

document.addEventListener('DOMContentLoaded', () => {
    const buildingSelect = document.getElementById('building');
    const dateInput = document.getElementById('date');
    const OCCUPY_REASONS = ['专业课程', '等级考试', '学术会议', '社团活动', '临时借用'];
    
    // 初始化教学楼选项
    const buildings = ['第一教学楼', '第二教学楼', '第三教学楼', '第四教学楼', '第五教学楼'];
    buildings.forEach(building => {
        const option = document.createElement('option');
        option.value = building;
        option.textContent = building;
        buildingSelect.appendChild(option);
    });

    // 教学楼选择事件
    buildingSelect.addEventListener('change', () => {
        if (buildingSelect.value) {
            dateInput.disabled = false;
            initDatePicker();
            updateTable();
        } else {
            dateInput.disabled = true;
            document.getElementById('tableContainer').innerHTML = '';
        }
    });

    // 日期选择事件
    dateInput.addEventListener('change', updateTable);

    function initDatePicker() {
        const today = new Date();
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 14);
        dateInput.min = today.toISOString().split('T')[0];
        dateInput.max = maxDate.toISOString().split('T')[0];
        dateInput.value = today.toISOString().split('T')[0];
    }

    function updateTable() {
        if (buildingSelect.value && dateInput.value) {
            const data = generateMockData(buildingSelect.value, dateInput.value);
            renderTable(data);
        }
    }

    function generateMockData(building, date) {
        const classrooms = [];
        const periods = 10;
        
        for (let i = 1; i <= 30; i++) {
            const classroom = {
                name: `${building} ${i.toString().padStart(2, '0')}室`,
                schedule: []
            };

            for (let j = 1; j <= periods; j++) {
                const isOccupied = Math.random() < 0.3;
                const lesson = {
                    period: j,
                    occupied: isOccupied
                };
                
                if (isOccupied) {
                    lesson.reason = OCCUPY_REASONS[Math.floor(Math.random() * OCCUPY_REASONS.length)];
                }
                
                classroom.schedule.push(lesson);
            }
            classrooms.push(classroom);
        }
        return { building, date, classrooms };
    }

    function renderTable(data) {
        const container = document.getElementById('tableContainer');
        container.innerHTML = '';

        const table = document.createElement('table');
        table.className = 'visible';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>教室/节次</th>
                    ${Array.from({length: 10}, (_, i) => `<th>第${i+1}节</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${data.classrooms.map(classroom => `
                    <tr>
                        <td>${classroom.name}</td>
                        ${classroom.schedule.map(lesson => `
                            <td class="${lesson.occupied ? 'occupied' : 'vacant'}" 
                                ${lesson.occupied ? `data-reason="${lesson.reason}"` : ''}>
                                ${lesson.occupied ? '占用' : `
                                    <span class="status">空闲</span>
                                    <button class="apply-btn">申请</button>
                                `}
                            </td>
                        `).join('')}
                    </tr>
                `).join('')}
            </tbody>
        `;
        container.appendChild(table);
        addTableInteractions();
    }

    function addTableInteractions() {
        const table = document.querySelector('table');
        
        // 占用提示处理
        table.addEventListener('mouseover', (e) => {
            const cell = e.target.closest('td.occupied');
            if (cell) {
                showTooltip(cell, `占用原因：${cell.dataset.reason}`);
            }
        });

        table.addEventListener('mouseout', (e) => {
            if (e.target.closest('td.occupied')) {
                hideTooltip();
            }
        });

        // 申请按钮处理
        table.addEventListener('click', (e) => {
            const btn = e.target.closest('.apply-btn');
            if (btn) {
                showApplicationForm(btn.closest('td'));
            }
        });
    }

    function showTooltip(element, text) {
        hideTooltip();
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width/2}px`;
        tooltip.style.top = `${rect.top - 3}px`;
        tooltip.classList.add('show');
    }

    function hideTooltip() {
        const existing = document.querySelector('.tooltip');
        if (existing) existing.remove();
    }

    function showApplicationForm(cell) {
        const formHtml = `
            <div class="modal-overlay">
                <div class="modal">
                    <h3>教室借用申请</h3>
                    <form id="applicationForm">
                        <div class="form-group">
                            <label>姓名：</label>
                            <input type="text" required>
                        </div>
                        <div class="form-group">
                            <label>学号：</label>
                            <input type="text" pattern="\\d{10}" required>
                        </div>
                        <div class="form-group">
                            <label>班级：</label>
                            <input type="text" required>
                        </div>
                        <div class="form-group">
                            <label>借用原因：</label>
                            <textarea required></textarea>
                        </div>
                        <div class="button-group">
                            <button type="submit">提交</button>
                            <button type="button" class="cancel">取消</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', formHtml);
        
        const modal = document.querySelector('.modal-overlay');
        modal.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            modal.remove();
            cell.innerHTML = `
                <span class="status">空闲</span>
                <button class="apply-btn">申请</button>
                <div class="pending">审核中</div>
            `;
        });
        
        modal.querySelector('.cancel').addEventListener('click', () => modal.remove());
    }
});