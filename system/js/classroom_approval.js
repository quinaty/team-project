// 可以在此添加后续需要的交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查PDF是否加载成功
    const pdfEmbed = document.querySelector('embed');
    
    pdfEmbed.addEventListener('error', function() {
        alert('PDF加载失败，请检查文件路径或联系管理员');
    });
    
    // 按钮悬停动画
    const button = document.querySelector('.action-button');
    
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});