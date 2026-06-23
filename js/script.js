document.addEventListener('DOMContentLoaded', () => {
    const loginModalEl = document.getElementById('loginModal');
    if (!loginModalEl) return; // Exit if modal doesn't exist on this page

    const authModal = new bootstrap.Modal(loginModalEl);
    const authForm = document.getElementById('authForm');
    const toggleAuth = document.getElementById('toggleAuth');
    const wrapper = document.getElementById('portfolio-wrapper');
    const authZone = document.getElementById('auth-zone');
    
    let isLoginMode = true;

    // --- INITIAL CHECK ---
    if (localStorage.getItem('isPortfolioAuth') === 'true') {
        showPortfolio();
    } else {
        authModal.show();
    }

    // --- UI TOGGLE (LOGIN vs REGISTER) ---
    if (toggleAuth) {
        toggleAuth.addEventListener('click', () => {
            isLoginMode = !isLoginMode;
            document.getElementById('authTitle').innerText = isLoginMode ? "Portal Access" : "Create Account";
            document.getElementById('authBtn').innerText = isLoginMode ? "SIGN IN" : "REGISTER";
            toggleAuth.innerText = isLoginMode ? "Need an account? Register" : "Already have an account? Login";
        });
    }

    // --- AUTHENTICATION LOGIC ---
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const pass = document.getElementById('password').value;

            if (isLoginMode) {
                if (localStorage.getItem(email) === pass) {
                    localStorage.setItem('isPortfolioAuth', 'true');
                    localStorage.setItem('currentUserEmail', email);
                    authModal.hide();
                    showPortfolio();
                } else {
                    alert("Access Denied. Invalid credentials.");
                }
            } else {
                localStorage.setItem(email, pass);
                alert("Registration successful! You can now Sign In.");
                isLoginMode = true;
                toggleAuth.click();
            }
        });
    }

    // --- DOM UPDATES ---
    function showPortfolio() {
        const savedEmail = localStorage.getItem('currentUserEmail');
        const userName = savedEmail ? savedEmail.split('@')[0].toUpperCase() : "DEVELOPER";

        if (authZone) {
            authZone.innerHTML = `
                <div class="d-flex align-items-center animate-fade-in">
                    <span class="me-3 small fw-bold text-uppercase text-muted">Hi, ${userName}</span>
                    <button class="btn btn-outline-dark btn-sm rounded-pill px-3" onclick="logout()" title="Logout">
                        <i class="fa-solid fa-right-from-bracket"></i>
                    </button>
                </div>
            `;
        }

        if (wrapper) {
            wrapper.style.display = 'block';
            setTimeout(() => { 
                wrapper.style.opacity = '1'; 
            }, 50);
        }
    }
});

// --- LOGOUT FUNCTION (Global scope) ---
function logout() {
    localStorage.removeItem('isPortfolioAuth');
    localStorage.removeItem('currentUserEmail');
    window.location.reload();
}
