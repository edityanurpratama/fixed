import re

with open('frontend/src/pages/DashboardPage.jsx', 'r') as f:
    content = f.read()

# 1. Remove FFD_QUESTIONS
content = re.sub(r'const FFD_QUESTIONS = \[.*?\];', '', content, flags=re.DOTALL)

# 2. Replace states
content = re.sub(r'const \[ffdState, setFfdState\].*?const \[ffdAnswers, setFfdAnswers\] = useState\(\{.*?\}\);', 
    '''const [attendance, setAttendance] = useState({ clockedIn: true, clockedOut: true, fatigue_status: null });
    const [showAttendancePopup, setShowAttendancePopup] = useState(false);
    const [showReminderBanner, setShowReminderBanner] = useState(false);''', content, flags=re.DOTALL)

# 3. Replace handleStartCheckIn and handleFfdAnswer
content = re.sub(r'const handleStartCheckIn = \(\) => \{.*?setFfdState\(\'answering\'\);\n    \};', '', content, flags=re.DOTALL)
content = re.sub(r'const handleFfdAnswer = \(questionId, answer\) => \{.*?\};\n', '', content, flags=re.DOTALL)

# 4. Add attendance fetch in fetchDashboardData
content = content.replace("usersPromise", "usersPromise,\n            api.get('/attendance/today').catch(() => ({ data: { clockedIn: false, clockedOut: false } }))")
content = content.replace("usersRes", "usersRes, attendanceRes")
content = content.replace("users: usersRes.data", "users: usersRes.data,\n            attendance: attendanceRes.data")

# 5. Handle attendance status in useEffect
content = content.replace("setTotalUsersCount(dashboardData.users.length);\n                }", '''setTotalUsersCount(dashboardData.users.length);
                }
                
                setAttendance(dashboardData.attendance);
                
                // Show popup if not clocked in
                if (!dashboardData.attendance.clockedIn) {
                    setShowAttendancePopup(true);
                    // Show banner if > 9 AM
                    if (new Date().getHours() >= 9) {
                        setShowReminderBanner(true);
                    }
                }''')

with open('frontend/src/pages/DashboardPage.jsx', 'w') as f:
    f.write(content)
