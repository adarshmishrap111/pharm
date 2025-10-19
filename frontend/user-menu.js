// User Menu Toggle with Language Support and Features

// Translations for 10 Indian Languages
const translations = {
    english: {
        myAccount: 'My Account',
        profile: 'Profile',
        orders: 'My Orders',
        transactions: 'Transaction History',
        language: 'Language',
        logout: 'Logout',
        login: 'Login / Register',
        welcome: 'Welcome'
    },
    hindi: {
        myAccount: 'मेरा खाता',
        profile: 'प्रोफ़ाइल',
        orders: 'मेरे ऑर्डर',
        transactions: 'लेनदेन इतिहास',
        language: 'भाषा',
        logout: 'लॉगआउट',
        login: 'लॉगिन / रजिस्टर',
        welcome: 'स्वागत'
    },
    bengali: {
        myAccount: 'আমার অ্যাকাউন্ট',
        profile: 'প্রোফাইল',
        orders: 'আমার অর্ডার',
        transactions: 'লেনদেন ইতিহাস',
        language: 'ভাষা',
        logout: 'লগআউট',
        login: 'লগইন / রেজিস্টার',
        welcome: 'স্বাগতম'
    },
    telugu: {
        myAccount: 'నా ఖాతా',
        profile: 'ప్రొఫైల్',
        orders: 'నా ఆర్డర్లు',
        transactions: 'లావాదేవీ చరిత్ర',
        language: 'భాష',
        logout: 'లాగౌట్',
        login: 'లాగిన్ / నమోదు',
        welcome: 'స్వాగతం'
    },
    marathi: {
        myAccount: 'माझे खाते',
        profile: 'प्रोफाइल',
        orders: 'माझे ऑर्डर',
        transactions: 'व्यवहार इतिहास',
        language: 'भाषा',
        logout: 'लॉगआउट',
        login: 'लॉगिन / नोंदणी',
        welcome: 'स्वागत'
    },
    tamil: {
        myAccount: 'எனது கணக்கு',
        profile: 'சுயவிவரம்',
        orders: 'எனது ஆர்டர்கள்',
        transactions: 'பரிவர்த்தனை வரலாறு',
        language: 'மொழி',
        logout: 'வெளியேறு',
        login: 'உள்நுழை / பதிவு',
        welcome: 'வரவேற்பு'
    },
    gujarati: {
        myAccount: 'મારું ખાતું',
        profile: 'પ્રોફાઇલ',
        orders: 'મારા ઓર્ડર',
        transactions: 'ટ્રાન્ઝેક્શન ઈતિહાસ',
        language: 'ભાષા',
        logout: 'લોગઆઉટ',
        login: 'લોગિન / નોંધણી',
        welcome: 'સ્વાગત'
    },
    kannada: {
        myAccount: 'ನನ್ನ ಖಾತೆ',
        profile: 'ಪ್ರೊಫೈಲ್',
        orders: 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು',
        transactions: 'ವಹಿವಾಟು ಇತಿಹಾಸ',
        language: 'ಭಾಷೆ',
        logout: 'ಲಾಗ್ಔಟ್',
        login: 'ಲಾಗಿನ್ / ನೋಂದಣಿ',
        welcome: 'ಸ್ವಾಗತ'
    },
    malayalam: {
        myAccount: 'എന്റെ അക്കൗണ്ട്',
        profile: 'പ്രൊഫൈൽ',
        orders: 'എന്റെ ഓർഡറുകൾ',
        transactions: 'ഇടപാട് ചരിത്രം',
        language: 'ഭാഷ',
        logout: 'ലോഗൗട്ട്',
        login: 'ലോഗിൻ / രജിസ്റ്റർ',
        welcome: 'സ്വാഗതം'
    },
    punjabi: {
        myAccount: 'ਮੇਰਾ ਖਾਤਾ',
        profile: 'ਪ੍ਰੋਫਾਈਲ',
        orders: 'ਮੇਰੇ ਆਰਡਰ',
        transactions: 'ਲੈਣ-ਦੇਣ ਇਤਿਹਾਸ',
        language: 'ਭਾਸ਼ਾ',
        logout: 'ਲਾੱਗਆਊਟ',
        login: 'ਲਾੱਗਇਨ / ਰਜਿਸਟਰ',
        welcome: 'ਸੁਆਗਤ ਹੈ'
    }
};

// Get current language
function getCurrentLanguage() {
    return localStorage.getItem('pharm_language') || 'english';
}

// Set language
function setLanguage(lang) {
    localStorage.setItem('pharm_language', lang);
    updateMenuText();
    window.dispatchEvent(new Event('languageChanged'));
}

// Update menu text based on language
function updateMenuText() {
    const lang = getCurrentLanguage();
    const t = translations[lang];
    
    // Update menu items
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        if (t[key]) elem.textContent = t[key];
    });
}

// Create User Menu
function createUserMenu() {
    const lang = getCurrentLanguage();
    const t = translations[lang];
    const userName = localStorage.getItem('user_name');
    const userEmail = localStorage.getItem('user_email');
    const isLoggedIn = userName && userEmail;
    
    const menuHTML = `
        <div class="user-menu-backdrop" id="userMenuBackdrop" onclick="closeUserMenu()"></div>
        <div class="user-menu-panel" id="userMenuPanel">
            <div class="user-menu-header">
                ${isLoggedIn ? `
                    <div class="user-avatar">
                        <span>${userName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div class="user-info">
                        <h3>${userName}</h3>
                        <p>${userEmail}</p>
                    </div>
                ` : `
                    <div class="user-avatar">
                        <span>👤</span>
                    </div>
                    <div class="user-info">
                        <h3 data-i18n="welcome">${t.welcome}</h3>
                        <p data-i18n="login">${t.login}</p>
                    </div>
                `}
            </div>
            
            ${isLoggedIn ? `
                <div class="menu-section">
                    <a href="profile.html" class="menu-item">
                        <span class="menu-icon">👤</span>
                        <span data-i18n="profile">${t.profile}</span>
                    </a>
                    <a href="my-orders.html" class="menu-item">
                        <span class="menu-icon">📦</span>
                        <span data-i18n="orders">${t.orders}</span>
                    </a>
                    <a href="transaction-history.html" class="menu-item">
                        <span class="menu-icon">💳</span>
                        <span data-i18n="transactions">${t.transactions}</span>
                    </a>
                </div>
            ` : `
                <div class="menu-section">
                    <a href="login.html" class="menu-item">
                        <span class="menu-icon">🔐</span>
                        <span data-i18n="login">${t.login}</span>
                    </a>
                </div>
            `}
            
            <div class="menu-section">
                <div class="menu-item" onclick="toggleLanguageMenu()">
                    <span class="menu-icon">🌐</span>
                    <span data-i18n="language">${t.language}</span>
                    <span class="menu-arrow">›</span>
                </div>
                
                <div class="language-submenu" id="languageSubmenu">
                    <div class="language-option" onclick="selectLanguage('english')">English</div>
                    <div class="language-option" onclick="selectLanguage('hindi')">हिंदी (Hindi)</div>
                    <div class="language-option" onclick="selectLanguage('bengali')">বাংলা (Bengali)</div>
                    <div class="language-option" onclick="selectLanguage('telugu')">తెలుగు (Telugu)</div>
                    <div class="language-option" onclick="selectLanguage('marathi')">मराठी (Marathi)</div>
                    <div class="language-option" onclick="selectLanguage('tamil')">தமிழ் (Tamil)</div>
                    <div class="language-option" onclick="selectLanguage('gujarati')">ગુજરાતી (Gujarati)</div>
                    <div class="language-option" onclick="selectLanguage('kannada')">ಕನ್ನಡ (Kannada)</div>
                    <div class="language-option" onclick="selectLanguage('malayalam')">മലയാളം (Malayalam)</div>
                    <div class="language-option" onclick="selectLanguage('punjabi')">ਪੰਜਾਬੀ (Punjabi)</div>
                </div>
            </div>
            
            ${isLoggedIn ? `
                <div class="menu-section">
                    <a href="#" class="menu-item logout-item" onclick="logoutUser()">
                        <span class="menu-icon">🚪</span>
                        <span data-i18n="logout">${t.logout}</span>
                    </a>
                </div>
            ` : ''}
        </div>
    `;
    
    // Remove existing menu
    const existing = document.getElementById('userMenuContainer');
    if (existing) existing.remove();
    
    // Add new menu
    const container = document.createElement('div');
    container.id = 'userMenuContainer';
    container.innerHTML = menuHTML;
    document.body.appendChild(container);
}

// Toggle User Menu
function toggleUserMenu() {
    const backdrop = document.getElementById('userMenuBackdrop');
    const panel = document.getElementById('userMenuPanel');
    
    if (!backdrop || !panel) {
        createUserMenu();
        setTimeout(toggleUserMenu, 10);
        return;
    }
    
    const isOpen = backdrop.classList.contains('active');
    
    if (isOpen) {
        closeUserMenu();
    } else {
        backdrop.classList.add('active');
        panel.classList.add('active');
    }
}

// Close User Menu
function closeUserMenu() {
    const backdrop = document.getElementById('userMenuBackdrop');
    const panel = document.getElementById('userMenuPanel');
    if (backdrop) backdrop.classList.remove('active');
    if (panel) panel.classList.remove('active');
}

// Toggle Language Menu
function toggleLanguageMenu() {
    const submenu = document.getElementById('languageSubmenu');
    if (submenu) {
        submenu.classList.toggle('active');
    }
}

// Select Language
function selectLanguage(lang) {
    setLanguage(lang);
    closeUserMenu();
    // Reload to apply language
    setTimeout(() => window.location.reload(), 300);
}

// Logout User
async function logoutUser() {
    try {
        await fetch('/api/user/logout', {
            method: 'POST',
            credentials: 'same-origin'
        });
    } catch (err) {
        console.error('Logout error:', err);
    }
    
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    
    closeUserMenu();
    window.location.href = '/index.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    createUserMenu();
    updateMenuText();
});
