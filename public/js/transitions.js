document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', e => {
            const target = link.getAttribute('href');
            if (!target || 
                target.startsWith('#') || 
                target.startsWith('javascript') || 
                link.target === '_blank') {
                return;
            }
            e.preventDefault();
            document.body.classList.add('page-exit');
            setTimeout(() => {
                window.location.href = target;
            }, 300); 
        });
    });
});