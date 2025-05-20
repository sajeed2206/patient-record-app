
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
        div.innerHTML = `
            <strong>${patient.name}</strong> (Age: ${patient.age}) - ${patient.contact}<br>
            Diagnosis: ${patient.diagnosis}<br>
            Notes: ${patient.notes}<br>
            Follow-up: ${patient.followup}<br>
            <button onclick="deletePatient(${index})">Delete</button>
            <hr>
        `;
        container.appendChild(div);
    });
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
    const blob = new Blob(["Name,Age,Contact,Diagnosis,Record,Medication,Followup,Notes
" + csv.join("\n")], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'patients.csv';
    a.click();
});

renderPatients();
