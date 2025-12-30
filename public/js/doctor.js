let currentPatientId = null;
let prescribedMeds = [];

async function loadQueue() {
    try {
        const res = await fetch('/api/queue');
        const queue = await res.json();
        const list = document.getElementById('doctor-queue-list');
        list.innerHTML = '';

        if (queue.length === 0) {
            list.innerHTML = "<p style='text-align:center; color:#777; padding:10px;'>No patients waiting.</p>";
            return;
        }

        const activePatient = queue.find(p => p.status === 'Serving');
        if (activePatient && !currentPatientId) {
            currentPatientId = activePatient._id;
        }

        queue.forEach(p => {
            const div = document.createElement('div');
            div.className = 'queue-item';
            let statusBadge = '';
            
            if (p.status === 'Serving') {
                statusBadge = '<small style="color:#28a745; font-weight:bold;">● Serving</small>';
                div.style.background = '#e8f5e9';
                div.style.borderLeftColor = '#28a745';
            
            } else if (p.status === 'Skipped') {
                statusBadge = '<small style="color:#d39e00; font-weight:bold;">⚠️ Absent</small>';
                div.style.background = '#fff3cd'; 
                div.style.borderLeftColor = '#ffc107';
                div.style.opacity = '0.8';
            
            } else {
                statusBadge = '<small style="color:#007bff; font-weight:bold;">● In Queue</small>';
            }

            div.innerHTML = `
                <div>
                    <span style="font-size:1.1em; font-weight:bold;">#${p.tokenNumber}</span>
                    <br><span style="font-size:0.9em;">${p.patientName}</span>
                </div>
                ${statusBadge}
            `;
            
            div.onclick = () => startConsultation(p);
            list.appendChild(div);
        });
    } catch (error) {
        console.error("Error loading queue");
    }
}

function startConsultation(patient) {
    currentPatientId = patient._id;

    fetch('/api/visit-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentPatientId })
    }).catch(err => console.error(err));

    fillPatientData(patient);
    loadQueue(); 
}

function fillPatientData(patient) {
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('prescription-pad').classList.remove('hidden');
    document.getElementById('pres-name').innerText = patient.patientName;
    document.getElementById('pres-age').innerText = patient.age;
    document.getElementById('pres-gender').innerText = patient.gender || '--';
    document.getElementById('pres-token').innerText = patient.tokenNumber;
    document.getElementById('pres-date').innerText = new Date().toLocaleDateString();

    prescribedMeds = [];
    renderMeds();
}

async function markAbsent() {
    if (!currentPatientId) {
        return Swal.fire({ 
            icon: 'info', 
            title: 'Select a Patient', 
            text: 'Please select a patient from the queue first.' 
        });
    }

    const result = await Swal.fire({
        title: 'Mark Absent?',
        text: "This will skip the current patient and call the next one.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Skip'
    });

    if (result.isConfirmed) {
        await fetch('/api/visit-skip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentPatientId })
        });

        currentPatientId = null;
        callNextPatient();
        
        Swal.fire({
            toast: true,
            position: 'bottom-end',
            icon: 'warning',
            title: 'Patient Marked Absent',
            showConfirmButton: false,
            timer: 2000
        });
    }
}

async function callNextPatient() {
    if (currentPatientId) {
        const result = await Swal.fire({
            title: 'Finish & Call Next?',
            text: "This will save the prescription and call the next patient.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Finish'
        });

        if (!result.isConfirmed) return;

        await completeVisit(false); 
    }

    const res = await fetch('/api/queue');
    const queue = await res.json();
    const nextPatient = queue.find(p => p.status === 'Waiting');

    if (nextPatient) {
        startConsultation(nextPatient);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
        Toast.fire({
            icon: 'success',
            title: `Calling Token #${nextPatient.tokenNumber}`
        });

    } else {
        Swal.fire({
            icon: 'success',
            title: 'All Caught Up!',
            text: 'No more patients in the waiting queue.',
            confirmButtonColor: '#28a745'
        });
        takeBreak();
    }
}

async function takeBreak() {
    await fetch('/api/visit-stop', { method: 'POST' });
    currentPatientId = null;
    document.getElementById('prescription-pad').classList.add('hidden');
    document.getElementById('empty-state').classList.remove('hidden');
    loadQueue();
}

async function completeVisit(showAlert = true) {
    if (!currentPatientId) return;

    try {
        await fetch('/api/prescribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: currentPatientId,
                medicines: prescribedMeds,
                status: 'Done'
            })
        });

        if(showAlert) {
            takeBreak(); 
        }
    } catch (err) {
        Swal.fire('Error', 'Could not save prescription', 'error');
    }
}

function addMedicine() {
    const name = document.getElementById('med-name').value;
    const dose = document.getElementById('med-dose').value;
    const days = document.getElementById('med-days').value;

    if(!name) {
        return Swal.fire({
            icon: 'warning',
            title: 'Medicine Name Required',
            text: 'Please type a medicine name before adding.',
            timer: 2000,
            showConfirmButton: false
        });
    }

    prescribedMeds.push({ name, dose: dose || '--', days: days || '--' });
    renderMeds();
    
    document.getElementById('med-name').value = '';
    document.getElementById('med-dose').value = '';
    document.getElementById('med-days').value = '';
    document.getElementById('med-name').focus(); 
}

function deleteMedicine(index) {
    prescribedMeds.splice(index, 1);
    renderMeds();
}

function renderMeds() {
    const tbody = document.getElementById('med-list-body');
    tbody.innerHTML = prescribedMeds.map((m, i) => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">${i + 1}. <strong>${m.name}</strong></td>
            <td style="padding: 10px;">${m.dose}</td>
            <td style="padding: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <span>${m.days} Days</span>
                    <button onclick="deleteMedicine(${i})" class="btn-delete no-print" title="Remove">❌</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function printPrescription() {
    window.print();
}

document.getElementById('med-days').addEventListener("keypress", function (event) {
    if (event.key === "Enter") addMedicine();
});

window.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem('clinic_doctor_name');
    if (savedName) {
        const displayEl = document.getElementById('doctor-name-text');
        if (displayEl) displayEl.innerText = savedName;
        const printEl = document.getElementById('print-doc-name');
        if (printEl) printEl.innerText = savedName;
    }
});

function editDoctorName() {
    const nameEl = document.getElementById('doctor-name-text');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = nameEl.innerText;
    input.style.fontSize = '1.1rem'; 
    input.style.fontWeight = 'bold';
    input.className = 'no-print';
    nameEl.innerHTML = '';
    nameEl.appendChild(input);
    input.focus();
    
    input.onblur = () => {
        const val = input.value || "Dr. Smith (MBBS, MD)";
        nameEl.innerText = val;
        const printEl = document.getElementById('print-doc-name');
        if (printEl) printEl.innerText = val;
        localStorage.setItem('clinic_doctor_name', val);
    };
    input.onkeypress = (e) => { if (e.key === 'Enter') input.blur(); };
}

setInterval(loadQueue, 5000);
loadQueue();