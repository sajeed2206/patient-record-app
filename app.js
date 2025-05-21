
function checkLogin() {
  if (!localStorage.getItem("loggedIn")) {
    window.location.href = "login.html";
  }
}

document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
});

const form = document.getElementById("patient-form");
const list = document.getElementById("patient-list");
let patients = JSON.parse(localStorage.getItem("patients") || "[]");

function savePatients() {
  localStorage.setItem("patients", JSON.stringify(patients));
  renderPatients();
}

function renderPatients() {
  list.innerHTML = "";
  patients.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border px-4 py-2">${p.name}</td>
      <td class="border px-4 py-2">${p.age}</td>
      <td class="border px-4 py-2">${p.contact}</td>
      <td class="border px-4 py-2">${p.diagnosis}</td>
      <td class="border px-4 py-2">${p.record}</td>
      <td class="border px-4 py-2">${p.medication}</td>
      <td class="border px-4 py-2">${p.followup}</td>
      <td class="border px-4 py-2">${p.notes}</td>`;
    list.appendChild(row);
  });
}
renderPatients();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const patient = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    contact: document.getElementById("contact").value,
    diagnosis: document.getElementById("diagnosis").value,
    record: document.getElementById("record").value,
    medication: document.getElementById("medication").value,
    followup: document.getElementById("followup").value,
    notes: document.getElementById("notes").value
  };
  patients.push(patient);
  savePatients();
  form.reset();
});

document.getElementById("export").addEventListener("click", function () {
  let csv = "Name,Age,Contact,Diagnosis,Record,Medication,Followup,Notes\n";
  patients.forEach(p => {
    csv += `${p.name},${p.age},${p.contact},${p.diagnosis},${p.record},${p.medication},${p.followup},${p.notes}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "patients.csv";
  a.click();
});

document.getElementById("import").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split('\n').slice(1);
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
