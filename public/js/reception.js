async function addPatient() {
    const name = document.getElementById('p-name').value.trim();
    const age = document.getElementById('p-age').value.trim();
    const gender = document.getElementById('p-gender').value;
    const phone = document.getElementById('p-phone').value.trim();
    
    if (!name || !age || !gender || !phone) {
        return Swal.fire({
            icon: 'warning',
            title: 'Missing Details',
            html: `Please fill <b>ALL</b> required fields:<br>
                   <div style="text-align:left; margin-top:10px; margin-left:40px;">
                   • Patient Name<br>• Age<br>• Gender<br>• Mobile Number
                   </div>`,
            confirmButtonColor: '#00897b',
            confirmButtonText: 'OK, I will fill it'
        });
    }

    try {
        const res = await fetch('/api/add-patient', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientName: name, age: age, gender: gender, phone: phone })
        });
        
        const data = await res.json();
        document.getElementById('p-name').value = '';
        document.getElementById('p-age').value = '';
        document.getElementById('p-gender').value = '';
        document.getElementById('p-phone').value = '';
        loadRecentPatients();
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
        Toast.fire({
            icon: 'success',
            title: `Token #${data.tokenNumber} Generated!`
        });
    } catch (err) {
        Swal.fire('Error', 'Could not add patient', 'error');
    }
}

async function loadRecentPatients() {
    try {
        const res = await fetch('/api/queue');
        const queue = await res.json();
        const log = document.getElementById('reception-log');
        log.innerHTML = '';
        queue.reverse().forEach(p => {
            const entry = document.createElement('div');
            entry.className = 'queue-item';
            entry.style.cursor = 'default';
            entry.innerHTML = `
                <span><strong>Token #${p.tokenNumber}</strong></span> 
                <span>${p.patientName}</span>
            `;
            log.appendChild(entry);
        });
    } catch (err) {
        console.log("Error loading queue:", err);
    }
}

setInterval(loadRecentPatients, 5000);
loadRecentPatients();