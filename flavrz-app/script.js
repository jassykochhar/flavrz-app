/* --- 1. FIREBASE CONFIGURATION (Aapki Keys) --- */
const firebaseConfig = {
    apiKey: "AIzaSyCfcBjt0rcO3utl1i8rkIyrNreBama0ch8",
    authDomain: "flavrz-app.firebaseapp.com",
    databaseURL: "https://flavrz-app-default-rtdb.firebaseio.com", // Maine ye banaya hai
    projectId: "flavrz-app",
    storageBucket: "flavrz-app.firebasestorage.app",
    messagingSenderId: "478215522754",
    appId: "1:478215522754:web:7179bfd09f9593f8dd2e5b",
    measurementId: "G-WT3C5DN49G"
};

// Firebase Start
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
console.log("🔥 FLAVRZ Firebase Connected!");

/* --- 2. ADMIN TRIGGER (Hidden - 5 Taps) --- */
let tapCount = 0;
const secretTrigger = document.getElementById('secret-trigger');
const adminModal = document.getElementById('admin-modal');
const closeModal = document.querySelector('.close-modal');

if(secretTrigger) {
    secretTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        tapCount++;
        if (tapCount === 5) {
            openAdminPanel();
            tapCount = 0;
        }
        setTimeout(() => { tapCount = 0; }, 2000);
    });
}

function openAdminPanel() {
    adminModal.classList.remove('hidden');
    if (navigator.vibrate) navigator.vibrate(200);
}

if(closeModal) {
    closeModal.addEventListener('click', () => {
        adminModal.classList.add('hidden');
    });
}
const addFoodBtn = document.getElementById('add-food-btn');
if(addFoodBtn) {
    addFoodBtn.addEventListener('click', () => {
        const name = document.getElementById('new-food-name').value;
        const price = document.getElementById('new-food-price').value;
        const img = document.getElementById('new-food-img').value;

        if(name === "" || price === "") { alert("Naam aur Price likho!"); return; }

        db.ref('menuItems').push({
            name: name, price: price, image: img || "https://via.placeholder.com/150", id: Date.now()
        }).then(() => { alert("? Item Live!"); });
    });
}
window.addEventListener('click', (e) => {
    if (e.target == adminModal) adminModal.classList.add('hidden');
});

/* --- 3. LOGIN & DASHBOARD LOGIC --- */
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginBtn = document.getElementById('login-btn');
const adminPass = document.getElementById('admin-pass');
const loginMsg = document.getElementById('login-msg');

const editTaglineInput = document.getElementById('edit-tagline');
const saveTaglineBtn = document.getElementById('save-tagline-btn');
const mainTagline = document.getElementById('main-tagline');

// Login Check
if(loginBtn) {
    loginBtn.addEventListener('click', () => {
        const code = adminPass.value;
        if(code === "1234") { 
            loginView.classList.add('hidden');
            dashboardView.classList.remove('hidden');
            // Current value load karein
            editTaglineInput.value = mainTagline.innerText;
        } else {
            loginMsg.innerText = "⛔ Access Denied";
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
    });
}

/* --- 4. REAL-TIME DATABASE (Read & Write) --- */

// A. READ: Website load hote hi database se text laye
const taglineRef = db.ref('websiteData/tagline');

taglineRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        mainTagline.innerText = data; // Screen par update
        console.log("Live Update:", data);
    }
});

// B. WRITE: Jab Admin Save kare
if(saveTaglineBtn) {
    saveTaglineBtn.addEventListener('click', () => {
        const newText = editTaglineInput.value;
        if(newText) {
            taglineRef.set(newText)
            .then(() => {
                alert("✅ Saved Successfully!");
            })
            .catch((error) => {
                alert("Error: Permission Denied? Check Rules.");
                console.error(error);
            });
        }
    });
}