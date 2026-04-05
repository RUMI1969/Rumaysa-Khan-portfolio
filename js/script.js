document.addEventListener('DOMContentLoaded', () => {
    const authModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const authForm = document.getElementById('authForm');
    const toggleAuth = document.getElementById('toggleAuth');
    const wrapper = document.getElementById('portfolio-wrapper');
    const authZone = document.getElementById('auth-zone'); // Ensure your Navbar button is inside this ID
    
    let isLoginMode = true;

    // --- INITIAL CHECK ---
    // Check if a session exists on page load
    if (localStorage.getItem('isPortfolioAuth') === 'true') {
        showPortfolio();
    } else {
        authModal.show();
    }

    // --- UI TOGGLE (LOGIN vs REGISTER) ---
    toggleAuth.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        document.getElementById('authTitle').innerText = isLoginMode ? "Portal Access" : "Create Account";
        document.getElementById('authBtn').innerText = isLoginMode ? "SIGN IN" : "REGISTER";
        toggleAuth.innerText = isLoginMode ? "Need an account? Register" : "Already have an account? Login";
    });

    // --- AUTHENTICATION LOGIC ---
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        if (isLoginMode) {
            // Check if credentials match stored data
            if (localStorage.getItem(email) === pass) {
                localStorage.setItem('isPortfolioAuth', 'true');
                localStorage.setItem('currentUserEmail', email); // Save the active user
                authModal.hide();
                showPortfolio();
            } else {
                alert("Access Denied. Invalid credentials or account does not exist.");
            }
        } else {
            // Register: Save email as key and password as value
            localStorage.setItem(email, pass);
            alert("Registration successful! You can now Sign In.");
            isLoginMode = true;
            toggleAuth.click(); // Reset modal to login mode
        }
    });

    // --- DOM UPDATES ---
    function showPortfolio() {
        const savedEmail = localStorage.getItem('currentUserEmail');
        
        // Format the name: take part before '@', uppercase it
        const userName = savedEmail ? savedEmail.split('@')[0].toUpperCase() : "DEVELOPER";

        // Update the Navbar: Swap Login button for Name + Logout icon
        if (authZone) {
            authZone.innerHTML = `
                <div class="d-flex align-items-center animate-fade-in">
                    <span class="me-3 small fw-black text-uppercase tracking-widest text-muted">Hi, ${userName}</span>
                    <button class="btn btn-outline-dark btn-sm rounded-pill px-3" onclick="logout()" title="Logout">
                        <i class="fa-solid fa-right-from-bracket"></i>
                    </button>
                </div>
            `;
        }

        // Reveal the portfolio content
        wrapper.style.display = 'block';
        setTimeout(() => { 
            wrapper.style.opacity = '1'; 
        }, 50);
    }
});

// --- LOGOUT FUNCTION (Global scope) ---
function logout() {
    localStorage.removeItem('isPortfolioAuth');
    localStorage.removeItem('currentUserEmail');
    window.location.reload(); // Refresh to lock the screen again
}