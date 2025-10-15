document.addEventListener('DOMContentLoaded', function() {
    // --- Dictionaries and Variables ---
    const translations = {
        en: { schoolName: "Adarsh J.M. Vidya Mandir", progressLogin: "Login", progressLang: "Language", progressClass: "Class", progressForm: "Form", formForClass: "Now filling form for", dobLabel: "Date of Birth", loginStepTitle: "Step 1: Login", loginStepLabel: "Enter Mobile Number or Email", loginPlaceholder: "e.g., 9876543210 or name@example.com", continueBtn: "Continue", backBtn: "Back", langStepTitle: "Step 2: Choose Language", classStepTitle: "Step 3: Select Class", classStepLabel: "Choose Admission Class", selectClassOption: "-- Select a Class --", nextBtn: "Next", formStepTitle: "Step 4: Admission Form", studentDetailsLegend: "Student Details", firstNameLabel: "First Name", lastNameLabel: "Last Name", studentPhotoLabel: "Passport Size Photo", photoPreviewText: "Photo", studentAadharLabel: "Student's Aadhar Number", parentDetailsLegend: "Parent Details", fatherNameLabel: "Father's Name", fatherAadharLabel: "Father's Aadhar Number", motherNameLabel: "Mother's Name", motherAadharLabel: "Mother's Aadhar Number", additionalInfoLegend: "Additional Information", fatherPanLabel: "Father's PAN Card Number", districtLabel: "District", pincodeLabel: "Pin Code", contactDetailsLegend: "Contact Details", addressLabel: "Full Address", submitBtn: "Submit Application", successTitle: "Thank You!", successText: "Your admission form has been submitted successfully. We will contact you shortly.", startAgainBtn: "Start New Application", error_required: "This field is required.", error_class: "Please select a class." },
        hi: { schoolName: "आदर्श जे.एम. विद्या मंदिर", progressLogin: "लॉगिन", progressLang: "भाषा", progressClass: "कक्षा", progressForm: "फॉर्म", formForClass: "अब कक्षा के लिए फॉर्म भरें:", dobLabel: "जन्म तिथि", loginStepTitle: "चरण 1: लॉगिन करें", loginStepLabel: "मोबाइल नंबर या ईमेल दर्ज करें", loginPlaceholder: "उदा., 9876543210 या name@example.com", continueBtn: "जारी रखें", backBtn: "वापस", langStepTitle: "चरण 2: भाषा चुनें", classStepTitle: "चरण 3: कक्षा चुनें", classStepLabel: "प्रवेश कक्षा चुनें", selectClassOption: "-- एक कक्षा चुनें --", nextBtn: "अगला", formStepTitle: "चरण 4: प्रवेश फॉर्म", studentDetailsLegend: "विद्यार्थी का विवरण", firstNameLabel: "पहला नाम", lastNameLabel: "अंतिम नाम", studentPhotoLabel: "पासपोर्ट साइज फोटो", photoPreviewText: "फोटो", studentAadharLabel: "विद्यार्थी का आधार नंबर", parentDetailsLegend: "अभिभावक का विवरण", fatherNameLabel: "पिता का नाम", fatherAadharLabel: "पिता का आधार नंबर", motherNameLabel: "माता का नाम", motherAadharLabel: "माता का आधार नंबर", additionalInfoLegend: "अतिरिक्त जानकारी", fatherPanLabel: "पिता का पैन कार्ड नंबर", districtLabel: "जिला", pincodeLabel: "पिन कोड", contactDetailsLegend: "संपर्क विवरण", addressLabel: "पूरा पता", submitBtn: "आवेदन जमा करें", successTitle: "धन्यवाद!", successText: "आपका प्रवेश फॉर्म सफलतापूर्वक जमा हो गया है। हम आपसे शीघ्र ही संपर्क करेंगे।", startAgainBtn: "नया आवेदन शुरू करें", error_required: "यह फ़ील्ड आवश्यक है।", error_class: "कृपया एक कक्षा चुनें।" }
    };
    let currentLanguage = 'en';
    
    const steps = document.querySelectorAll('.step');
    const progressItems = document.querySelectorAll('#progress-bar .step-item');
    const progressLine = document.getElementById('progress-line');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const admissionForm = document.getElementById('admissionForm');

    // --- Helper Functions ---
    function showStep(stepId) {
        steps.forEach(step => step.classList.add('hidden'));
        document.getElementById(stepId).classList.remove('hidden');

        const stepNumber = Array.from(steps).findIndex(step => step.id === stepId);
        progressItems.forEach((pStep, index) => {
            pStep.classList.toggle('active', index <= stepNumber);
        });
        const progressWidth = (stepNumber / (steps.length - 2)) * 100;
        progressLine.style.width = `${progressWidth}%`;
    }

    function translatePage(lang) {
        currentLanguage = lang;
        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.getAttribute('data-translate-key');
            if (translations[lang][key]) {
                const translation = translations[lang][key];
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') element.placeholder = translation;
                else element.textContent = translation;
            }
        });
    }
    
    function showError(inputId, messageKey) {
        const errorDiv = document.getElementById(inputId + '-error');
        if (errorDiv) {
            errorDiv.textContent = translations[currentLanguage][messageKey];
            errorDiv.style.display = 'block';
        }
    }
    function hideError(inputId) {
        const errorDiv = document.getElementById(inputId + '-error');
        if (errorDiv) errorDiv.style.display = 'none';
    }

    // --- Theme Toggle ---
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
    if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');

    // --- Navigation and Validation ---
    document.getElementById('login-btn').addEventListener('click', () => {
        const loginInput = document.getElementById('login-input');
        if (loginInput.value.trim() === '') showError('login', 'error_required');
        else { hideError('login'); showStep('language-step'); }
    });

    document.getElementById('lang-en-btn').addEventListener('click', () => { translatePage('en'); showStep('class-step'); });
    document.getElementById('lang-hi-btn').addEventListener('click', () => { translatePage('hi'); showStep('class-step'); });

    document.getElementById('class-btn').addEventListener('click', () => {
        const classSelect = document.getElementById('class-select');
        if (classSelect.value === '') {
            showError('class', 'error_class');
        } else {
            hideError('class');
            const selectedClassValue = parseInt(classSelect.value, 10);
            const selectedOptionText = classSelect.options[classSelect.selectedIndex].text;
            
            document.getElementById('selected-class-display').textContent = `${translations[currentLanguage].formForClass} ${selectedOptionText}`;

            document.getElementById('primary-fields').classList.toggle('hidden', !(selectedClassValue >= 1 && selectedClassValue <= 8));
            document.getElementById('photo-upload-field').classList.toggle('hidden', !(selectedClassValue >= 6 && selectedClassValue <= 8));
            showStep('form-step');
        }
    });

    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', (e) => showStep(e.target.closest('.step').previousElementSibling.id));
    });
    
    // --- FINAL FORM SUBMISSION ---
    admissionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Gather form data into an object
        const formData = {
            studentFirstName: document.getElementById('firstName').value,
            studentLastName: document.getElementById('lastName').value,
            dob: document.getElementById('dob').value,
            studentAadhar: document.getElementById('studentAadhar').value,
            fatherName: document.getElementById('fatherName').value,
            fatherAadhar: document.getElementById('fatherAadhar').value,
            motherName: document.getElementById('motherName').value,
            motherAadhar: document.getElementById('motherAadhar').value,
            fatherPan: document.getElementById('fatherPan').value,
            district: document.getElementById('district').value,
            pincode: document.getElementById('pincode').value,
            address: document.getElementById('address').value,
            admissionClass: document.getElementById('class-select').value,
            language: currentLanguage
        };

        // Note: Photo upload needs special handling (multipart/form-data) on the backend
        // For now, we are just sending the text data.

        try {
            // 2. Send data to the backend API
            const response = await fetch('https://school-backend-1-mby3.onrender.com/api/admissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            // 3. Handle the response from the backend
            if (result.success) {
                // If successful, show the success screen
                showStep('success-step');
            } else {
                // If there's a backend error, show it
                alert('Error submitting form: ' + result.message);
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            alert('A network error occurred. Please make sure the backend server is running and try again.');
        }
    });
    
    document.getElementById('start-again-btn').addEventListener('click', () => {
        admissionForm.reset();
        document.getElementById('photo-preview').style.backgroundImage = 'none';
        translatePage('en');
        showStep('login-step');
    });

    // Photo Preview
    document.getElementById('studentPhoto').addEventListener('change', function(event) {
        if (event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => document.getElementById('photo-preview').style.backgroundImage = `url(${e.target.result})`;
            reader.readAsDataURL(event.target.files[0]);
        }
    });

    // Initial setup
    showStep('login-step');
});