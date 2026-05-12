import "@fortawesome/fontawesome-free/css/all.min.css";

const form = document.getElementById('login-form');
const password = document.getElementById('password');
const toggle = document.getElementById('toggle-password');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === 'admin@site.com' && password ==='12345') {
        window.location.href = '/admin.html'
    } else {
        alert('Invalid email or password. Please try again.');
    }
})

// функција за да се види/скрие лозинката
toggle.addEventListener('click', () => {
    if (password.type === 'password') {
        password.type = 'text'
        // console.log('Password type switched to text');
    } else {
        password.type = "password";
        // console.log('Password type switched to password');
    };
})