document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = localStorage.getItem('smartOpdAuth');
    if (!isAuthenticated) {
        window.location.href = 'login.html';
    }
});

function logout() {
    localStorage.removeItem('smartOpdAuth');
    window.location.href = 'login.html';
}