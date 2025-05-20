
const VALID_USER = { username: 'admin', password: 'pass123' };

function isAuthenticated() {
    return localStorage.getItem('loggedIn') === 'true';
}

function logout() {
    localStorage.removeItem('loggedIn');
    location.reload();
}

function checkAuthAndRender() {
    if (!isAuthenticated()) {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('app-section').style.display = 'none';
    } else {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
        renderPatients();
    }
}

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (username === VALID_USER.username && password === VALID_USER.password) {
        localStorage.setItem('loggedIn', 'true');
        checkAuthAndRender();
    } else {
        alert('Invalid credentials');
    }
});

let patients = JSON.parse(localStorage.getItem('patients')) || [];

function savePatients() {
    localStorage.setItem('patients', JSON.stringify(patients));
    renderPatients();
}

function renderPatients() {
    const container = document.getElementById('patients');
    container.innerHTML = '';
    patients.forEach((patient, index) => {
        const div = document.createElement('div');
        div.classList.add('patient-card');
        const detailsId = `details-${index}`;
        div.innerHTML = `
            <strong>${patient.name}</strong> (Age: ${patient.age}) - ${patient.contact}
            <button onclick="toggleDetails('${detailsId}')">View Details</button>
            <div id="${detailsId}" class="details" style="display:none; margin-top: 10px;">
                <p><strong>Diagnosis:</strong> ${patient.diagnosis}</p>
                <p><strong>Medical Record:</strong> ${patient.record}</p>
                <p><strong>Medication:</strong> ${patient.medication}</p>
                <p><strong>Follow-up:</strong> ${patient.followup}</p>
                <p><strong>Notes:</strong> ${patient.notes}</p>
            </div>
            <button onclick="deletePatient(${index})" style="margin-top: 5px;">Delete</button>
            <hr>
        `;
        container.appendChild(div);
    });
}

function toggleDetails(id) {
    const details = document.getElementById(id);
    if (details.style.display === "none") {
        details.style.display = "block";
    } else {
        details.style.display = "none";
    }
}

function deletePatient(index) {
    patients.splice(index, 1);
    savePatients();
}

document.getElementById('patient-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const patient = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        contact: document.getElementById('contact').value,
        diagnosis: document.getElementById('diagnosis').value,
        record: document.getElementById('record').value,
        medication: document.getElementById('medication').value,
        followup: document.getElementById('followup').value,
        notes: document.getElementById('notes').value,
    };
    patients.push(patient);
    savePatients();
    this.reset();
});

document.getElementById('export').addEventListener('click', function() {
    const csv = patients.map(p => 
        `${p.name},${p.age},${p.contact},${p.diagnosis},${p.record},${p.medication},${p.followup},${p.notes}`
    );
    const blob = new Blob(["Name,Age,Contact,Diagnosis,Record,Medication,Followup,Notes\n" + csv.join("\n")], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'patients.csv';
    a.click();
});

checkAuthAndRender();

document.getElementById('import').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n').slice(1); // skip header
        lines.forEach(line => {
            const [name, age, contact, diagnosis, record, medication, followup, notes] = line.split(',');
            if (name) {
                patients.push({ name, age, contact, diagnosis, record, medication, followup, notes });
            }
        });
        savePatients();
    };
    reader.readAsText(file);
});
