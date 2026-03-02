// admin.js (Integrated with Filtering & Details Page)
document.addEventListener('DOMContentLoaded', () => {
    
    // --- API and DOM Elements ---
    const API_URL = "https://school-backend-1-mby3.onrender.com"; 
    
    const loginScreen = document.getElementById('login-screen');
    const dashboard = document.getElementById('dashboard');
    const loginBtn = document.getElementById('login-btn-admin');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('login-error-msg');

    // Naye UI Elements (Updated for Details Page)
    const classFilter = document.getElementById('class-filter');
    const studentDetailsPage = document.getElementById('student-details-page');
    const detailsPageBody = document.getElementById('details-page-body');
    const backToTableBtn = document.getElementById('back-to-table-btn');

    let allStudentsData = []; // Local storage for filtering

    // --- 1. Check if token exists ---
    const token = localStorage.getItem('schoolAdminToken');
    if (token) {
        loginScreen.style.display = 'none';
        dashboard.classList.remove('hidden');
        fetchData(token);
    } else {
        loginScreen.style.display = 'flex';
    }

    // --- 2. Login Logic ---
    loginBtn.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            errorMsg.textContent = "Please enter both email and password.";
            errorMsg.style.display = 'block';
            return;
        }
        
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await res.json();

            if (result.success) {
                localStorage.setItem('schoolAdminToken', result.token);
                loginScreen.style.display = 'none';
                dashboard.classList.remove('hidden');
                fetchData(result.token);
            } else {
                errorMsg.textContent = result.message || "Login failed!";
                errorMsg.style.display = 'block';
            }
        } catch (err) {
            errorMsg.textContent = "Network error. Server might be down.";
            errorMsg.style.display = 'block';
        }
    });

    // --- 3. Render Table Function ---
    function renderTable(data) {
        document.getElementById('total-count').innerText = data.length;
        const tbody = document.getElementById('student-table-body');
        tbody.innerHTML = ''; 

        data.forEach(student => {
            const row = `
                <tr>
                    <td><b>${student.admissionClass?.toUpperCase() || 'N/A'}</b></td>
                    <td>${student.studentFirstName} ${student.studentLastName}</td>
                    <td>${student.fatherName}</td>
                    <td>${student.motherName || 'N/A'}</td>
                    <td>${student.studentAadhar || 'N/A'}</td>
                    <td>${student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</td>
                    <td>${student.loginInput || 'N/A'}</td>
                    <td>${student.address}</td>
                    <td>${new Date(student.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="view-btn" data-id="${student._id}" style="padding:5px 10px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer;">
                            View
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    // --- 4. Fetch Data ---
    async function fetchData(token) {
        try {
            await fetch(API_URL); 
            const res = await fetch(`${API_URL}/api/admissions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await res.json();
            
            if(result.success) {
                allStudentsData = result.data;
                renderTable(allStudentsData);
            } else {
                alert("Session expired.");
                localStorage.removeItem('schoolAdminToken');
                location.reload();
            }
        } catch (err) {
            console.error(err);
        }
    }

    // --- 5. Filtering Logic ---
    classFilter.addEventListener('change', (e) => {
        const selected = e.target.value;
        const filtered = selected === 'all' 
            ? allStudentsData 
            : allStudentsData.filter(s => s.admissionClass === selected);
        renderTable(filtered);
    });

    // --- 6. Naya Page / View Details Logic ---
    document.getElementById('student-table-body').addEventListener('click', (e) => {
        if (e.target.classList.contains('view-btn')) {
            const id = e.target.getAttribute('data-id');
            const student = allStudentsData.find(s => s._id === id);
            if (student) showStudentPage(student);
        }
    });

    function showStudentPage(student) {
        // Table wale dashboard ko chhupao
        dashboard.classList.add('hidden');

        // Naye page mein data dalo (Thoda aur sundar UI ke sath)
        detailsPageBody.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; text-align:left; font-size: 1.1rem; padding: 20px; background: var(--container-bg); border-radius: 8px; border: 1px solid var(--border-color);">
                <p><strong>Name:</strong> ${student.studentFirstName} ${student.studentLastName}</p>
                <p><strong>Class:</strong> ${student.admissionClass}</p>
                <p><strong>Student Aadhar:</strong> ${student.studentAadhar || 'N/A'}</p>
                <p><strong>DOB:</strong> ${student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</p>
                
                <h3 style="grid-column:span 2; margin-top:15px; border-bottom:1px solid var(--border-color); color: var(--primary-color); padding-bottom: 5px;">Parent Details</h3>
                <p><strong>Father's Name:</strong> ${student.fatherName}</p>
                <p><strong>Father's Aadhar:</strong> ${student.fatherAadhar || 'N/A'}</p>
                <p><strong>Mother's Name:</strong> ${student.motherName || 'N/A'}</p>
                <p><strong>Mother's Aadhar:</strong> ${student.motherAadhar || 'N/A'}</p>
                <p><strong>Father's PAN:</strong> ${student.fatherPan || 'N/A'}</p>
                
                <h3 style="grid-column:span 2; margin-top:15px; border-bottom:1px solid var(--border-color); color: var(--primary-color); padding-bottom: 5px;">Contact Details</h3>
                <p><strong>Contact:</strong> ${student.loginInput || 'N/A'}</p>
                <p><strong>District:</strong> ${student.district || 'N/A'}</p>
                <p><strong>Pincode:</strong> ${student.pincode || 'N/A'}</p>
                <p style="grid-column:span 2;"><strong>Address:</strong> ${student.address}</p>
            </div>
        `;
        // Naye details page ko dikhao
        studentDetailsPage.classList.remove('hidden');
    }

    // Back button dabane par wapas Table par aane ka logic
    backToTableBtn.addEventListener('click', () => {
        studentDetailsPage.classList.add('hidden'); // Details page chhupao
        dashboard.classList.remove('hidden');       // Wapas Table dikhao
    });
});