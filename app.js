// Demo Users Database (No Firebase required)
const demoUsers = {
    'student@college.edu': {
        password: 'student123',
        role: 'student',
        name: 'John Student',
        id: 'S2023001',
        department: 'Computer Science',
        semester: '5th'
    },
    'teacher@college.edu': {
        password: 'teacher123',
        role: 'teacher',
        name: 'Dr. Smith',
        id: 'T2023001',
        department: 'Computer Science',
        designation: 'Professor'
    }
};

// Current User
let currentUser = null;

// Motivational Quotes
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

// Demo Classes Data
const demoClasses = {
    1: ['Mathematics (9:00 AM - Room 101)', 'Physics (11:00 AM - Lab 3)', 'Computer Science (2:00 PM - Room 205)'],
    2: ['Chemistry (10:00 AM - Lab 1)', 'Biology (1:00 PM - Room 103)', 'English (3:00 PM - Room 104)'],
    3: ['Mathematics (9:00 AM - Room 101)', 'Physics Lab (11:00 AM - Lab 3)', 'Programming (2:00 PM - Lab 2)'],
    4: ['Data Structures (10:00 AM - Room 205)', 'Chemistry Lab (2:00 PM - Lab 1)'],
    5: ['Project Work (9:00 AM - All Day)', 'Seminar (3:00 PM - Auditorium)'],
    6: ['No Regular Classes - Self Study'],
    0: ['Weekend - No Classes']
};

// Demo Attendance Data
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

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    displayRandomQuote();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('smartAttendUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
});

// Login Function
function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    const spinner = document.getElementById('login-spinner');
    const loginBtn = document.querySelector('.login-card button');
    const errorElement = document.getElementById('login-error');
    
    // Validation
    if (!email || !password) {
        showError('Please enter email and password');
        return;
    }
    
    if (!email.endsWith('@college.edu')) {
        showError('Please use a valid college email (@college.edu)');
        return;
    }
    
    // Show loading
    spinner.style.display = 'block';
    loginBtn.disabled = true;
    errorElement.style.display = 'none';
    
    // Simulate API call delay
    setTimeout(() => {
        // Check credentials
        if (demoUsers[email]) {
            const user = demoUsers[email];
            
            if (user.password === password && user.role === role) {
                // Login successful
                currentUser = {
                    email: email,
                    role: user.role,
                    name: user.name,
                    id: user.id,
                    department: user.department,
                    ...(user.role === 'student' ? { semester: user.semester } : { designation: user.designation })
                };
                
                // Save to localStorage
                localStorage.setItem('smartAttendUser', JSON.stringify(currentUser));
                
                // Show success animation
                loginBtn.innerHTML = '✓ Login Successful!';
                loginBtn.style.backgroundColor = '#2ecc71';
                
                setTimeout(() => {
                    showDashboard();
                }, 1000);
                
                return;
            }
        }
        
        // If we reach here, login failed
        showError('Invalid email, password, or role. Use demo credentials:<br>Student: student@college.edu / student123<br>Teacher: teacher@college.edu / teacher123');
        
    }, 1500);
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('login-error');
    const spinner = document.getElementById('login-spinner');
    const loginBtn = document.querySelector('.login-card button');
    
    spinner.style.display = 'none';
    loginBtn.disabled = false;
    errorElement.innerHTML = message;
    errorElement.style.display = 'block';
    
    // Reset login button
    loginBtn.innerHTML = 'Login';
    loginBtn.style.backgroundColor = '';
}

// Logout Function
function logout() {
    // Show confirmation
    if (confirm('Are you sure you want to logout?')) {
        // Reset to login state
        currentUser = null;
        localStorage.removeItem('smartAttendUser');
        
        // Reset form
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('role').value = 'student';
        
        showLogin();
    }
}

// Show Dashboard
function showDashboard() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    // Update user info
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-role').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
    
    // Update header with user name
    const header = document.querySelector('header');
    header.innerHTML = `🌸 Smart Attendance & Wellness Portal | Welcome, ${currentUser.name} <button onclick="logout()" class="logout-btn">Logout</button>`;
    
    // Initialize dashboard features
    initializeCharts();
    loadAttendanceData();
    loadTodaysClasses();
    
    // Show welcome message
    setTimeout(() => {
        alert(`Welcome ${currentUser.name}!\nYou have successfully logged in as ${currentUser.role}.`);
    }, 500);
}

// Show Login Page
function showLogin() {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    
    // Reset login button
    const loginBtn = document.querySelector('.login-card button');
    loginBtn.innerHTML = 'Login';
    loginBtn.disabled = false;
    loginBtn.style.backgroundColor = '';
    
    const spinner = document.getElementById('login-spinner');
    spinner.style.display = 'none';
}

// Display random motivational quote
function displayRandomQuote() {
    const quoteElement = document.getElementById('quoteText');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = randomQuote;
    
    // Change quote every 30 seconds
    setInterval(() => {
        const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.textContent = newQuote;
    }, 30000);
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
    timeElement.textContent = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
}

// Attendance Functions
function markAttendance() {
    if (currentUser.role !== 'student') {
        alert('Only students can mark attendance.');
        return;
    }
    
    const statusElement = document.getElementById('status');
    statusElement.innerHTML = '<span class="loading">Opening QR Scanner...</span>';
    statusElement.style.color = '#667eea';
    
    // Simulate QR scanning process
    setTimeout(() => {
        // Show fake QR scanner
        const scanner = document.createElement('div');
        scanner.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 1000;
            text-align: center;
        `;
        scanner.innerHTML = `
            <h3>📷 QR Code Scanner</h3>
            <div style="width: 200px; height: 200px; background: #f0f0f0; margin: 20px auto; display: flex; align-items: center; justify-content: center;">
                <div style="font-size: 48px;">🔳</div>
            </div>
            <p>Scanning QR code...</p>
            <button onclick="this.parentElement.remove()">Cancel</button>
        `;
        document.body.appendChild(scanner);
        
        // Simulate scanning
        setTimeout(() => {
            scanner.remove();
            
            // 90% success rate
            const success = Math.random() < 0.9;
            
            if (success) {
                // Update attendance
                if (demoAttendance[currentUser.email]) {
                    demoAttendance[currentUser.email].presentCount++;
                    demoAttendance[currentUser.email].totalClasses++;
                    
                    // Add to history
                    const today = new Date().toISOString().split('T')[0];
                    demoAttendance[currentUser.email].attendanceHistory.unshift({
                        date: today,
                        subject: demoClasses[new Date().getDay()]?.[0]?.split('(')[0] || 'Class',
                        status: 'Present'
                    });
                    
                    // Save to localStorage
                    localStorage.setItem('smartAttendDemoData', JSON.stringify(demoAttendance));
                }
                
                statusElement.innerHTML = '✅ <strong>Attendance marked successfully!</strong><br><small>Time: ' + new Date().toLocaleTimeString() + '</small>';
                statusElement.style.color = '#2ecc71';
                
                // Update attendance display
                loadAttendanceData();
                
                // Show success notification
                showNotification('Attendance marked successfully!', 'success');
            } else {
                statusElement.innerHTML = '❌ <strong>Failed to mark attendance</strong><br><small>Please try again or contact administrator</small>';
                statusElement.style.color = '#e74c3c';
                
                showNotification('Failed to mark attendance', 'error');
            }
        }, 2000);
    }, 1000);
}

function getPrediction() {
    const predictionElement = document.getElementById('prediction');
    predictionElement.innerHTML = '<span class="loading">Analyzing attendance patterns...</span>';
    predictionElement.style.color = '#667eea';
    
    setTimeout(() => {
        let risk, message, color;
        
        if (currentUser.role === 'student' && demoAttendance[currentUser.email]) {
            const data = demoAttendance[currentUser.email];
            const percentage = (data.presentCount / data.totalClasses) * 100;
            
            if (percentage >= 85) {
                risk = Math.random() * 15;
                message = `✅ Excellent attendance!<br><small>Current: ${percentage.toFixed(1)}% | Risk: ${risk.toFixed(1)}%</small>`;
                color = '#2ecc71';
            } else if (percentage >= 75) {
                risk = 15 + Math.random() * 20;
                message = `⚠️ Good attendance, but can improve<br><small>Current: ${percentage.toFixed(1)}% | Risk: ${risk.toFixed(1)}%</small>`;
                color = '#f39c12';
            } else if (percentage >= 60) {
                risk = 35 + Math.random() * 25;
                message = `⚠️ Warning: Low attendance<br><small>Current: ${percentage.toFixed(1)}% | Risk: ${risk.toFixed(1)}%</small>`;
                color = '#e74c3c';
            } else {
                risk = 60 + Math.random() * 40;
                message = `🚨 Critical: Very low attendance<br><small>Current: ${percentage.toFixed(1)}% | Risk: ${risk.toFixed(1)}%</small>`;
                color = '#c0392b';
            }
        } else {
            // For teachers or no data
            risk = Math.random() * 100;
            if (risk < 30) {
                message = `✅ Low risk overall<br><small>Predicted risk: ${risk.toFixed(1)}%</small>`;
                color = '#2ecc71';
            } else if (risk < 70) {
                message = `⚠️ Moderate risk detected<br><small>Predicted risk: ${risk.toFixed(1)}%</small>`;
                color = '#f39c12';
            } else {
                message = `🚨 High risk predicted<br><small>Predicted risk: ${risk.toFixed(1)}%</small>`;
                color = '#e74c3c';
            }
        }
        
        predictionElement.innerHTML = message;
        predictionElement.style.color = color;
    }, 1500);
}

function requestCorrection() {
    if (currentUser.role !== 'student') {
        alert('Only students can request corrections.');
        return;
    }
    
    const correctionElement = document.getElementById('correctionStatus');
    correctionElement.innerHTML = '<span class="loading">Submitting request...</span>';
    correctionElement.style.color = '#667eea';
    
    // Show correction form
    const form = document.createElement('div');
    form.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 0 25px rgba(0,0,0,0.3);
        z-index: 1000;
        width: 90%;
        max-width: 400px;
    `;
    
    form.innerHTML = `
        <h3>📝 Request Attendance Correction</h3>
        <div style="margin: 15px 0;">
            <label style="display: block; margin-bottom: 5px;">Date:</label>
            <input type="date" id="correctionDate" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
        </div>
        <div style="margin: 15px 0;">
            <label style="display: block; margin-bottom: 5px;">Subject:</label>
            <select id="correctionSubject" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Computer Science</option>
                <option>Chemistry</option>
                <option>English</option>
            </select>
        </div>
        <div style="margin: 15px 0;">
            <label style="display: block; margin-bottom: 5px;">Reason:</label>
            <textarea id="correctionReason" rows="3" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;" placeholder="Briefly explain why correction is needed..."></textarea>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button onclick="submitCorrection(this.parentElement.parentElement)" style="flex: 1; padding: 10px; background: #2ecc71; color: white; border: none; border-radius: 5px; cursor: pointer;">Submit</button>
            <button onclick="this.parentElement.parentElement.remove()" style="flex: 1; padding: 10px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(form);
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    form.querySelector('#correctionDate').value = today;
}

// Helper function for correction submission
function submitCorrection(formElement) {
    const date = formElement.querySelector('#correctionDate').value;
    const subject = formElement.querySelector('#correctionSubject').value;
    const reason = formElement.querySelector('#correctionReason').value;
    
    if (!date || !subject || !reason) {
        alert('Please fill all fields');
        return;
    }
    
    const correctionElement = document.getElementById('correctionStatus');
    formElement.remove();
    
    // Simulate API call
    setTimeout(() => {
        correctionElement.innerHTML = `✅ <strong>Correction request submitted!</strong><br>
                                      <small>Date: ${date}<br>
                                      Subject: ${subject}<br>
                                      Status: Pending Review</small>`;
        correctionElement.style.color = '#2ecc71';
        
        showNotification('Correction request submitted successfully!', 'success');
        
        // Auto clear after 8 seconds
        setTimeout(() => {
            correctionElement.innerHTML = '';
        }, 8000);
    }, 1000);
}

// Initialize Charts
function initializeCharts() {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    
    function drawChart() {
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
        
        const options = {
            title: 'Weekly Attendance Trend',
            curveType: 'function',
            legend: { position: 'bottom' },
            backgroundColor: 'transparent',
            colors: ['#667eea', '#764ba2'],
            hAxis: { title: 'Days' },
            vAxis: { 
                title: 'Attendance %',
                viewWindow: { min: 0, max: 100 }
            }
        };
        
        const chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
        chart.draw(data, options);
        
        // Redraw on window resize
        window.addEventListener('resize', function() {
            chart.draw(data, options);
        });
    }
}

// Load attendance data
function loadAttendanceData() {
    const summaryElement = document.getElementById('attendance-summary');
    
    if (currentUser.role === 'student' && demoAttendance[currentUser.email]) {
        const data = demoAttendance[currentUser.email];
        const percentage = (data.presentCount / data.totalClasses * 100).toFixed(1);
        
        // Update summary
        document.getElementById('total-classes').textContent = data.totalClasses;
        document.getElementById('present-count').textContent = data.presentCount;
        document.getElementById('attendance-percentage').textContent = percentage + '%';
        
        // Add progress bar
        summaryElement.innerHTML = `
            <div class="progress-container">
                <div class="progress-label">Overall Attendance</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%; background: ${getPercentageColor(percentage)};"></div>
                </div>
                <div class="progress-text">${data.presentCount}/${data.totalClasses} (${percentage}%)</div>
            </div>
            <div class="attendance-details">
                <p><strong>Last 5 Records:</strong></p>
                ${data.attendanceHistory.slice(0, 5).map(record => 
                    `<div class="attendance-record ${record.status.toLowerCase()}">
                        ${record.date}: ${record.subject} - <strong>${record.status}</strong>
                    </div>`
                ).join('')}
            </div>
        `;
    } else {
        // For teachers or no data
        summaryElement.innerHTML = `
            <div class="no-data">
                <p>${currentUser.role === 'teacher' ? 'Teacher Dashboard' : 'No attendance data available'}</p>
                <small>${currentUser.role === 'teacher' ? 'View student attendance reports' : 'Mark attendance to see data'}</small>
            </div>
        `;
    }
}

// Load today's classes
function loadTodaysClasses() {
    const today = new Date().getDay();
    const classesElement = document.getElementById('todays-classes');
    
    if (demoClasses[today]) {
        classesElement.innerHTML = demoClasses[today].map(cls => 
            `<div class="class-item">
                <div class="class-time">${cls.split('(')[1]?.replace(')', '') || 'TBA'}</div>
                <div class="class-name">${cls.split('(')[0]}</div>
                ${currentUser.role === 'student' ? 
                    `<button class="mark-btn" onclick="simulateClassAttendance('${cls.split('(')[0]}')">Mark</button>` : 
                    `<button class="view-btn" onclick="viewClass('${cls.split('(')[0]}')">View</button>`
                }
            </div>`
        ).join('');
    } else {
        classesElement.innerHTML = '<div class="no-classes">No classes scheduled for today</div>';
    }
}

// Helper function for class attendance
function simulateClassAttendance(className) {
    alert(`Would mark attendance for: ${className}\n\nIn real implementation, this would use QR code or location verification.`);
}

// Helper function for teachers to view class
function viewClass(className) {
    alert(`Class: ${className}\n\nViewing student attendance for this class.\n\nDemo students:\n1. John Doe - Present\n2. Jane Smith - Present\n3. Bob Johnson - Absent\n4. Alice Brown - Present`);
}

// Helper function to get color based on percentage
function getPercentageColor(percentage) {
    if (percentage >= 85) return '#2ecc71';
    if (percentage >= 75) return '#f1c40f';
    if (percentage >= 60) return '#e67e22';
    return '#e74c3c';
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for new elements
const style = document.createElement('style');
style.textContent = `
    .loading {
        color: #667eea;
        font-style: italic;
    }
    
    .progress-container {
        margin: 15px 0;
    }
    
    .progress-label {
        margin-bottom: 5px;
        font-weight: 500;
    }
    
    .progress-bar {
        height: 10px;
        background: #f0f0f0;
        border-radius: 5px;
        overflow: hidden;
        margin: 10px 0;
    }
    
    .progress-fill {
        height: 100%;
        transition: width 0.5s ease;
    }
    
    .progress-text {
        text-align: center;
        font-size: 14px;
        color: #666;
        margin-top: 5px;
    }
    
    .attendance-details {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #eee;
    }
    
    .attendance-record {
        padding: 8px 10px;
        margin: 5px 0;
        background: #f9f9f9;
        border-radius: 5px;
        font-size: 14px;
    }
    
    .attendance-record.present {
        border-left: 4px solid #2ecc71;
    }
    
    .attendance-record.absent {
        border-left: 4px solid #e74c3c;
    }
    
    .class-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px;
        margin: 8px 0;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #667eea;
    }
    
    .class-time {
        font-size: 12px;
        color: #666;
        min-width: 80px;
    }
    
    .class-name {
        flex: 1;
        margin: 0 10px;
        font-weight: 500;
    }
    
    .mark-btn, .view-btn {
        padding: 6px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    }
    
    .mark-btn {
        background: #667eea;
        color: white;
    }
    
    .view-btn {
        background: #2ecc71;
        color: white;
    }
    
    .no-data {
        text-align: center;
        padding: 20px;
        color: #666;
    }
    
    .no-classes {
        text-align: center;
        padding: 20px;
        color: #666;
        font-style: italic;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }
    
    .notification.success {
        border-left: 4px solid #2ecc71;
    }
    
    .notification.error {
        border-left: 4px solid #e74c3c;
    }
    
    .notification button {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
        margin-left: 10px;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('login-page').style.display !== 'none') {
        login();
    }
    
    if (e.key === 'Escape' && document.getElementById('dashboard').style.display !== 'none') {
        logout();
    }
    
    // Secret admin shortcut: Ctrl+Shift+D for demo data reset
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        if (confirm('Reset all demo data?')) {
            localStorage.clear();
            location.reload();
        }
    }
});