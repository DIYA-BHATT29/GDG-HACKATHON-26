// ===================== DEMO USERS =====================
const demoUsers = {
    'student@college.edu': {
        password: 'student123',
        role: 'student',
        name: 'DIYA KRISHNA Student',
        id: 'S2023001',
        department: 'DSP',
        semester: '5th'
    },
    'teacher@college.edu': {
        password: 'teacher123',
        role: 'teacher',
        name: 'Dr. ANITHA S',
        id: 'T2023001',
        department: 'DSP',
        designation: 'Professor'
    }
};

let currentUser = null;

// ===================== DEMO DATA =====================
const quotes = [
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The secret of getting ahead is getting started. - Mark Twain"
];

const demoClasses = {
    1: ['Mathematics (9:00 AM - Room 101)', 'Physics (11:00 AM - Lab 3)', 'Computer Science (2:00 PM - Room 205)'],
    2: ['Chemistry (10:00 AM - Lab 1)', 'Biology (1:00 PM - Room 103)', 'English (3:00 PM - Room 104)'],
    3: ['Mathematics (9:00 AM - Room 101)', 'Physics Lab (11:00 AM - Lab 3)', 'Programming (2:00 PM - Lab 2)'],
    4: ['Data Structures (10:00 AM - Room 205)', 'Chemistry Lab (2:00 PM - Lab 1)'],
    5: ['Project Work (9:00 AM - All Day)', 'Seminar (3:00 PM - Auditorium)'],
    6: ['No Regular Classes - Self Study'],
    0: ['Weekend - No Classes']
};

const demoAttendance = {
    'student@college.edu': {
        totalClasses: 45,
        presentCount: 38,
        attendanceHistory: [
            { date: '2024-01-15', subject: 'Mathematics', status: 'Present' },
            { date: '2024-01-16', subject: 'Physics', status: 'Present' },
            { date: '2024-01-17', subject: 'Computer Science', status: 'Absent' },
            { date: '2024-01-18', subject: 'Chemistry', status: 'Present' },
            { date: '2024-01-19', subject: 'English', status: 'Present' }
        ]
    }
};

// ===================== PROJECT WORK =====================
let projectWorkSubmissions = {}; // store submissions in-memory

// ===================== INITIALIZATION =====================
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    displayRandomQuote();
    
    const savedUser = localStorage.getItem('smartAttendUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
});

// ===================== LOGIN =====================
function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    const spinner = document.getElementById('login-spinner');
    const loginBtn = document.querySelector('.login-card button');
    const errorElement = document.getElementById('login-error');
    
    if (!email || !password) {
        showError('Please enter email and password');
        return;
    }
    
    if (!email.endsWith('@college.edu')) {
        showError('Please use a valid college email (@college.edu)');
        return;
    }
    
    spinner.style.display = 'block';
    loginBtn.disabled = true;
    errorElement.style.display = 'none';
    
    setTimeout(() => {
        if (demoUsers[email]) {
            const user = demoUsers[email];
            if (user.password === password && user.role === role) {
                currentUser = {
                    email: email,
                    role: user.role,
                    name: user.name,
                    id: user.id,
                    department: user.department,
                    ...(user.role === 'student' ? { semester: user.semester } : { designation: user.designation })
                };
                
                localStorage.setItem('smartAttendUser', JSON.stringify(currentUser));
                
                loginBtn.innerHTML = '✓ Login Successful!';
                loginBtn.style.backgroundColor = '#2ecc71';
                
                setTimeout(() => { showDashboard(); }, 1000);
                return;
            }
        }
        showError('Invalid credentials. Use demo accounts:<br>Student: student@college.edu / student123<br>Teacher: teacher@college.edu / teacher123');
    }, 1500);
}

function showError(message) {
    const errorElement = document.getElementById('login-error');
    const spinner = document.getElementById('login-spinner');
    const loginBtn = document.querySelector('.login-card button');
    
    spinner.style.display = 'none';
    loginBtn.disabled = false;
    errorElement.innerHTML = message;
    errorElement.style.display = 'block';
    
    loginBtn.innerHTML = 'Login';
    loginBtn.style.backgroundColor = '';
}

// ===================== LOGOUT =====================
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('smartAttendUser');
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('role').value = 'student';
        showLogin();
    }
}

function showLogin() {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    
    const loginBtn = document.querySelector('.login-card button');
    loginBtn.innerHTML = 'Login';
    loginBtn.disabled = false;
    loginBtn.style.backgroundColor = '';
    document.getElementById('login-spinner').style.display = 'none';
}

// ===================== DASHBOARD =====================
function showDashboard() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-role').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    
    document.querySelector('header').innerHTML = `🌸 Smart Attendance & Wellness Portal | Welcome, ${currentUser.name} <button onclick="logout()" class="logout-btn">Logout</button>`;
    
    initializeCharts();
    loadAttendanceData();
    loadTodaysClasses();
    
    if (currentUser.role === 'teacher') {
        document.getElementById('teacher-projects-card').style.display = 'block';
        loadProjectSubmissions();
    } else {
        document.getElementById('student-project-card').style.display = 'block';
    }
}

// ===================== MOTIVATION =====================
function displayRandomQuote() {
    const quoteElement = document.getElementById('quoteText');
    quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    setInterval(() => {
        quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }, 30000);
}

function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
    timeElement.textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
}

// ===================== ATTENDANCE =====================
function markAttendance() {
    if (currentUser.role !== 'student') { alert('Only students can mark attendance.'); return; }
    const statusElement = document.getElementById('status');
    statusElement.innerHTML = '<span class="loading">Opening QR Scanner...</span>';
    statusElement.style.color = '#667eea';
    setTimeout(() => {
        if (demoAttendance[currentUser.email]) {
            demoAttendance[currentUser.email].presentCount++;
            demoAttendance[currentUser.email].totalClasses++;
            const today = new Date().toISOString().split('T')[0];
            demoAttendance[currentUser.email].attendanceHistory.unshift({ date: today, subject: demoClasses[new Date().getDay()]?.[0]?.split('(')[0] || 'Class', status: 'Present' });
            localStorage.setItem('smartAttendDemoData', JSON.stringify(demoAttendance));
        }
        statusElement.innerHTML = '✅ Attendance marked successfully!';
        statusElement.style.color = '#2ecc71';
        loadAttendanceData();
        showNotification('Attendance marked successfully!', 'success');
    }, 2000);
}

function getPrediction() {
    const predictionElement = document.getElementById('prediction');
    predictionElement.innerHTML = '<span class="loading">Analyzing attendance patterns...</span>';
    setTimeout(() => {
        if (currentUser.role === 'student' && demoAttendance[currentUser.email]) {
            const data = demoAttendance[currentUser.email];
            const percentage = (data.presentCount / data.totalClasses) * 100;
            predictionElement.innerHTML = `📊 Attendance Risk: ${percentage.toFixed(1)}%`;
        } else {
            predictionElement.innerHTML = '📊 Attendance prediction available for students only.';
        }
    }, 1000);
}

function requestCorrection() {
    if (currentUser.role !== 'student') { alert('Only students can request corrections.'); return; }
    alert('Correction request popup opens here.');
}

// ===================== PROJECT WORK =====================
function submitProjectWork() {
    const projectName = prompt('Enter Project Title:');
    if (!projectName) return;
    
    const submission = {
        studentEmail: currentUser.email,
        studentName: currentUser.name,
        title: projectName,
        submittedAt: new Date().toLocaleString(),
        status: 'Pending'
    };
    
    if (!projectWorkSubmissions[currentUser.email]) projectWorkSubmissions[currentUser.email] = [];
    projectWorkSubmissions[currentUser.email].push(submission);
    
    showNotification('Project submitted successfully!', 'success');
}

function loadProjectSubmissions() {
    const container = document.getElementById('project-submissions');
    container.innerHTML = '';
    
    Object.values(projectWorkSubmissions).flat().forEach((proj, index) => {
        const div = document.createElement('div');
        div.className = 'project-item';
        div.innerHTML = `
            <span>${proj.studentName}: ${proj.title} - ${proj.status}</span>
            <button onclick="approveProject('${proj.studentEmail}', ${index})">Approve</button>
            <button onclick="rejectProject('${proj.studentEmail}', ${index})">Reject</button>
        `;
        container.appendChild(div);
    });
}

function approveProject(email, index) {
    projectWorkSubmissions[email][index].status = 'Approved';
    loadProjectSubmissions();
    showNotification('Project approved', 'success');
}

function rejectProject(email, index) {
    projectWorkSubmissions[email][index].status = 'Rejected';
    loadProjectSubmissions();
    showNotification('Project rejected', 'error');
}

// ===================== CHARTS =====================
function initializeCharts() {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => {
        const data = google.visualization.arrayToDataTable([
            ['Day', 'Attendance %', { role: 'style' }],
            ['Mon', 85, '#667eea'],
            ['Tue', 92, '#667eea'],
            ['Wed', 78, '#667eea'],
            ['Thu', 95, '#667eea'],
            ['Fri', 88, '#667eea'],
            ['Sat', 65, '#764ba2'],
            ['Sun', 0, '#764ba2']
        ]);
        const options = { title: 'Weekly Attendance Trend', curveType: 'function', legend: { position: 'bottom' }, backgroundColor: 'transparent', hAxis: { title: 'Days' }, vAxis: { viewWindow: { min:0, max:100 } } };
        const chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);
        window.addEventListener('resize', () => chart.draw(data, options));
    });
}

// ===================== HELPER FUNCTIONS =====================
function loadAttendanceData() {
    const summaryElement = document.getElementById('attendance-summary');
    if (currentUser.role === 'student' && demoAttendance[currentUser.email]) {
        const data = demoAttendance[currentUser.email];
        const percentage = (data.presentCount / data.totalClasses * 100).toFixed(1);
        summaryElement.innerHTML = `
            <p>Total Classes: ${data.totalClasses}</p>
            <p>Present: ${data.presentCount}</p>
            <p>Percentage: ${percentage}%</p>
        `;
    } else {
        summaryElement.innerHTML = `<p>Teacher dashboard: View student attendance records</p>`;
    }
}

function loadTodaysClasses() {
    const today = new Date().getDay();
    const classesElement = document.getElementById('todays-classes');
    if (demoClasses[today]) {
        classesElement.innerHTML = demoClasses[today].map(cls => `<div>${cls}</div>`).join('');
    } else {
        classesElement.innerHTML = 'No classes today';
    }
}

// ===================== NOTIFICATIONS =====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">×</button>`;
    document.body.appendChild(notification);
    setTimeout(() => { if(notification.parentElement) notification.remove(); }, 5000);
}
