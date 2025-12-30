function updateClock() {
    const now = new Date();
    document.getElementById('live-date').innerText = now.toLocaleDateString();
    document.getElementById('live-time').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

setInterval(updateClock, 1000);
updateClock();

async function fetchQueue() {
    try {
        const res = await fetch('/api/queue');
        const queue = await res.json();
        const currentTokenEl = document.getElementById('current-token');
        const currentNameEl = document.getElementById('current-name');
        const listEl = document.getElementById('queue-list');
        const missedContainer = document.getElementById('missed-container');
        const missedListEl = document.getElementById('missed-list');
        listEl.innerHTML = '';
        missedListEl.innerHTML = '';
        const servingPatient = queue.find(p => p.status === 'Serving');
        const waitingPatients = queue.filter(p => p.status === 'Waiting');
        const skippedPatients = queue.filter(p => p.status === 'Skipped');

        if (servingPatient) {
            currentTokenEl.innerText = servingPatient.tokenNumber;
            currentNameEl.innerText = servingPatient.patientName;
        } else {
            currentTokenEl.innerText = "--";
            currentNameEl.innerText = "Please Wait...";
        }

        if (waitingPatients.length > 0) {
            waitingPatients.forEach((p, index) => {
                const waitTime = (index + 1) * 10;
                const div = document.createElement('div');
                div.className = 'queue-card';
                div.innerHTML = `
                    <div class="q-left">
                        <span class="q-token">Token #${p.tokenNumber}</span>
                        <span class="q-name">${p.patientName}</span>
                    </div>
                    <div class="q-right">
                        <span class="q-wait">Est. Wait: ${waitTime} mins</span>
                    </div>
                `;
                listEl.appendChild(div);
            });
        } else {
            if (!servingPatient) listEl.innerHTML = "<p style='text-align:center; color:#777; padding:20px;'>Queue is empty</p>";
        }

        if (skippedPatients.length > 0) {
            missedContainer.classList.remove('hidden');

            skippedPatients.forEach(p => {
                const span = document.createElement('span');
                span.className = 'missed-token';
                span.innerText = `#${p.tokenNumber} ${p.patientName}`;
                missedListEl.appendChild(span);
            });
        } else {
            missedContainer.classList.add('hidden');
        }
    } catch (err) {
        console.error("Connection Error", err);
    }
}

setInterval(fetchQueue, 5000);
fetchQueue();