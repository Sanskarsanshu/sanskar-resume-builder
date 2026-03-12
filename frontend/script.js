// ========== DOM REFERENCES ==========
const form = document.getElementById('resumeForm');
const loadingOverlay = document.getElementById('loadingOverlay');
const achievementsList = document.getElementById('achievementsList');
const projectsList = document.getElementById('projectsList');
const experienceList = document.getElementById('experienceList');
const certificationsList = document.getElementById('certificationsList');
const addAchievementBtn = document.getElementById('addAchievement');
const addProjectBtn = document.getElementById('addProject');
const addExperienceBtn = document.getElementById('addExperience');
const addCertificationBtn = document.getElementById('addCertification');

let projectCounter = 1;
let experienceCounter = 1;

// ========== TEMPLATE SELECTION ==========
const templateCards = document.querySelectorAll('.template-card');
templateCards.forEach(card => {
    card.addEventListener('click', () => {
        templateCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
    });
});

// ========== DYNAMIC ACHIEVEMENTS ==========
addAchievementBtn.addEventListener('click', () => {
    const item = document.createElement('div');
    item.className = 'dynamic-item achievement-item';
    item.innerHTML = `
        <input type="text" name="achievement" placeholder="Describe an achievement…">
        <button type="button" class="btn-remove" onclick="removeItem(this)" title="Remove">✕</button>
    `;
    achievementsList.appendChild(item);
    item.querySelector('input').focus();
});

// ========== DYNAMIC CERTIFICATIONS ==========
addCertificationBtn.addEventListener('click', () => {
    const item = document.createElement('div');
    item.className = 'dynamic-item certification-item';
    item.innerHTML = `
        <input type="text" name="certification" placeholder="Certification name…">
        <button type="button" class="btn-remove" onclick="removeItem(this)" title="Remove">✕</button>
    `;
    certificationsList.appendChild(item);
    item.querySelector('input').focus();
});

function removeItem(btn) {
    const item = btn.closest('.dynamic-item');
    item.style.opacity = '0';
    item.style.transform = 'translateX(20px)';
    item.style.transition = 'all 0.25s ease';
    setTimeout(() => item.remove(), 250);
}

// ========== DYNAMIC PROJECTS ==========
addProjectBtn.addEventListener('click', () => {
    projectCounter++;
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-header">
            <span class="project-label">Project ${projectCounter}</span>
            <button type="button" class="btn-remove" onclick="removeProject(this)" title="Remove project">✕</button>
        </div>
        <div class="grid-3">
            <div class="field">
                <label>Project Name <span class="req">*</span></label>
                <input type="text" name="project_name" placeholder="AI Chatbot">
            </div>
            <div class="field">
                <label>Tech Stack</label>
                <input type="text" name="project_tech" placeholder="Python, Flask, GPT-4">
            </div>
            <div class="field">
                <label>Year</label>
                <input type="text" name="project_year" placeholder="2024">
            </div>
        </div>
        <div class="bullets-container">
            <label>Description Bullets</label>
            <div class="bullets-list">
                <div class="bullet-item">
                    <input type="text" name="project_bullet" placeholder="Describe what you built or achieved…">
                    <button type="button" class="btn-remove btn-sm" onclick="removeBullet(this)" title="Remove">✕</button>
                </div>
            </div>
            <button type="button" class="btn-add btn-add-sm" onclick="addBullet(this)">+ Add Bullet</button>
        </div>
    `;
    projectsList.appendChild(card);
    card.querySelector('input').focus();
});

function removeProject(btn) {
    const card = btn.closest('.project-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(-10px)';
    card.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        card.remove();
        renumberItems(projectsList, '.project-card', 'Project');
    }, 300);
}

// ========== DYNAMIC EXPERIENCE ==========
addExperienceBtn.addEventListener('click', () => {
    experienceCounter++;
    const card = document.createElement('div');
    card.className = 'project-card experience-card';
    card.innerHTML = `
        <div class="project-header">
            <span class="project-label">Experience ${experienceCounter}</span>
            <button type="button" class="btn-remove" onclick="removeExperience(this)" title="Remove">✕</button>
        </div>
        <div class="grid-2">
            <div class="field">
                <label>Company <span class="req">*</span></label>
                <input type="text" name="exp_company" placeholder="Google">
            </div>
            <div class="field">
                <label>Location</label>
                <input type="text" name="exp_location" placeholder="Mountain View, CA">
            </div>
            <div class="field">
                <label>Role</label>
                <input type="text" name="exp_role" placeholder="Software Engineer Intern">
            </div>
            <div class="field">
                <label>Year</label>
                <input type="text" name="exp_year" placeholder="Jun 2024 – Aug 2024">
            </div>
        </div>
        <div class="bullets-container">
            <label>Description Bullets</label>
            <div class="bullets-list">
                <div class="bullet-item">
                    <input type="text" name="exp_bullet" placeholder="Describe your responsibilities…">
                    <button type="button" class="btn-remove btn-sm" onclick="removeBullet(this)" title="Remove">✕</button>
                </div>
            </div>
            <button type="button" class="btn-add btn-add-sm" onclick="addBullet(this)">+ Add Bullet</button>
        </div>
    `;
    experienceList.appendChild(card);
    card.querySelector('input').focus();
});

function removeExperience(btn) {
    const card = btn.closest('.experience-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(-10px)';
    card.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        card.remove();
        renumberItems(experienceList, '.experience-card', 'Experience');
    }, 300);
}

// ========== RENUMBER HELPER ==========
function renumberItems(container, selector, prefix) {
    const cards = container.querySelectorAll(selector);
    cards.forEach((card, i) => {
        card.querySelector('.project-label').textContent = `${prefix} ${i + 1}`;
    });
    if (prefix === 'Project') projectCounter = cards.length;
    if (prefix === 'Experience') experienceCounter = cards.length;
}

// ========== DYNAMIC BULLETS ==========
function addBullet(btn) {
    const bulletsList = btn.previousElementSibling;
    const item = document.createElement('div');
    item.className = 'bullet-item';
    item.innerHTML = `
        <input type="text" name="${bulletsList.closest('.experience-card') ? 'exp_bullet' : 'project_bullet'}" placeholder="Describe what you did…">
        <button type="button" class="btn-remove btn-sm" onclick="removeBullet(this)" title="Remove">✕</button>
    `;
    bulletsList.appendChild(item);
    item.querySelector('input').focus();
}

function removeBullet(btn) {
    const item = btn.closest('.bullet-item');
    item.style.opacity = '0';
    item.style.transform = 'translateX(20px)';
    item.style.transition = 'all 0.25s ease';
    setTimeout(() => item.remove(), 250);
}

// ========== FORM VALIDATION ==========
function validateForm() {
    let valid = true;

    // Clear previous errors
    document.querySelectorAll('input.invalid').forEach(el => el.classList.remove('invalid'));

    // Required fields
    const required = ['name', 'email', 'phone', 'location', 'college', 'degree'];
    required.forEach(id => {
        const input = document.getElementById(id);
        if (!input.value.trim()) {
            input.classList.add('invalid');
            valid = false;
        }
    });

    // Email format
    const email = document.getElementById('email');
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('invalid');
        valid = false;
    }

    if (!valid) {
        showToast('Please fill in all required fields.', 'error');
        const first = document.querySelector('input.invalid');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return valid;
}

// ========== COLLECT FORM DATA ==========
function collectFormData() {
    const getValue = id => document.getElementById(id).value.trim();

    // Achievements
    const achievements = [];
    achievementsList.querySelectorAll('.achievement-item input').forEach(input => {
        const val = input.value.trim();
        if (val) achievements.push(val);
    });

    // Certifications
    const certifications = [];
    certificationsList.querySelectorAll('.certification-item input').forEach(input => {
        const val = input.value.trim();
        if (val) certifications.push(val);
    });

    // Projects
    const projects = [];
    projectsList.querySelectorAll('.project-card').forEach(card => {
        const name = card.querySelector('input[name="project_name"]').value.trim();
        const tech = card.querySelector('input[name="project_tech"]').value.trim();
        const year = card.querySelector('input[name="project_year"]').value.trim();
        const bullets = [];
        card.querySelectorAll('.bullet-item input').forEach(bInput => {
            const val = bInput.value.trim();
            if (val) bullets.push(val);
        });
        if (name) {
            projects.push({ name, tech_stack: tech, year, bullets });
        }
    });

    // Experiences
    const experiences = [];
    experienceList.querySelectorAll('.experience-card').forEach(card => {
        const company = card.querySelector('input[name="exp_company"]').value.trim();
        const location = card.querySelector('input[name="exp_location"]').value.trim();
        const role = card.querySelector('input[name="exp_role"]').value.trim();
        const year = card.querySelector('input[name="exp_year"]').value.trim();
        const bullets = [];
        card.querySelectorAll('.bullet-item input').forEach(bInput => {
            const val = bInput.value.trim();
            if (val) bullets.push(val);
        });
        if (company) {
            experiences.push({ company, location, role, year, bullets });
        }
    });

    return {
        name: getValue('name'),
        email: getValue('email'),
        phone: getValue('phone'),
        location: getValue('location'),
        linkedin: getValue('linkedin'),
        github: getValue('github'),
        leetcode: getValue('leetcode'),
        college: getValue('college'),
        college_location: getValue('college_location'),
        degree: getValue('degree'),
        minor: getValue('minor'),
        cgpa: getValue('cgpa'),
        year: getValue('year'),
        programming: getValue('programming'),
        computer_vision: getValue('computer_vision'),
        deep_learning: getValue('deep_learning'),
        deployment: getValue('deployment'),
        tools: getValue('tools'),
        web_technologies: getValue('web_technologies'),
        achievements,
        certifications,
        projects,
        experiences,
        languages: getValue('languages'),
    };
}

// ========== FORM SUBMISSION ==========
// Render backend URL
const BACKEND_URL = 'https://sanskar-resume-builder.onrender.com';

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = collectFormData();
    
    // Get selected template_id
    const selectedTemplate = document.querySelector('input[name="template_id"]:checked');
    data.template_id = selectedTemplate ? selectedTemplate.value : 'template';

    // Show loading
    loadingOverlay.classList.remove('hidden');

    try {
        const response = await fetch(`${BACKEND_URL}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to generate resume');
        }

        // Download the PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        showToast('Resume downloaded successfully!', 'success');
    } catch (err) {
        console.error(err);
        showToast(err.message || 'Something went wrong.', 'error');
    } finally {
        loadingOverlay.classList.add('hidden');
    }
});

// ========== TOAST NOTIFICATION ==========
function showToast(message, type = 'error') {
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3200);
}
