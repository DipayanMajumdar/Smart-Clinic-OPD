function moveSlider(targetBtn) {
    const slider = document.getElementById('tab-slider');
    if (slider && targetBtn) {
        slider.style.width = targetBtn.offsetWidth + "px";
        slider.style.left = targetBtn.offsetLeft + "px";
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const activeBtn = document.querySelector('.tab-btn.active');
    if (activeBtn) moveSlider(activeBtn);
});
window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('.tab-btn.active');
    if (activeBtn) moveSlider(activeBtn);
});

function switchTab(event, tabName) {
    const clickedBtn = event.currentTarget;
    moveSlider(clickedBtn);
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active'));
    if (tabName === 'booking') {
        document.getElementById('booking-view').classList.add('active');
    } else {
        document.getElementById('queue-view').classList.add('active');
        fetchLiveQueue();
    }
}

async function bookToken() {
    const name = document.getElementById('p-name').value.trim();
    const age = document.getElementById('p-age').value;
    const gender = document.getElementById('p-gender').value;
    const phone = document.getElementById('p-phone').value;
    if (!name || !age || !gender || !phone) return Swal.fire('Missing Details', 'Please fill all fields.', 'warning');
    try {
        const res = await fetch('/api/add-patient', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientName: name, age, gender, phone })
        });
        const data = await res.json();
        document.getElementById('booking-form').classList.add('hidden');
        document.getElementById('success-msg').classList.remove('hidden');
        document.getElementById('user-token-display').innerText = "#" + data.tokenNumber;
        const audio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
        audio.play();
    } catch (e) {
        Swal.fire('Error', 'Connection failed', 'error');
    }
}

function resetForm() {
    document.getElementById('booking-form').classList.remove('hidden');
    document.getElementById('success-msg').classList.add('hidden');
    document.getElementById('p-name').value = '';
    document.getElementById('p-age').value = '';
    document.getElementById('p-phone').value = '';
}

async function fetchLiveQueue() {
    try {
        const res = await fetch('/api/queue');
        const queue = await res.json();
        const serving = queue.find(p => p.status === 'Serving');
        const waiting = queue.filter(p => p.status === 'Waiting');

        if (serving) {
            document.getElementById('serving-token').innerText = "#" + serving.tokenNumber;
            document.getElementById('serving-name').innerText = serving.patientName;
        } else {
            document.getElementById('serving-token').innerText = "--";
            document.getElementById('serving-name').innerText = "Doctor is on break / No Patients";
        }

        const listContainer = document.getElementById('queue-list-container');
        listContainer.innerHTML = '';

        if (waiting.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; padding:30px; color:#aaa;"><i class="fa-solid fa-mug-hot" style="font-size:2rem; margin-bottom:10px;"></i><br>No patients waiting</div>';
        } else {
            waiting.forEach((p, index) => {
                const waitTime = (index + 1) * 10;
                const div = document.createElement('div');
                div.className = 'queue-item-row';
                div.innerHTML = `
                            <div>
                                <div class="q-token">Token #${p.tokenNumber}</div>
                                <div style="font-size:clamp(0.85rem, 2.5vw, 0.95rem); color:#555;">${p.patientName}</div>
                            </div>
                            <div class="q-time">
                                <i class="fa-regular fa-clock"></i> ~${waitTime} min
                            </div>
                        `;
                listContainer.appendChild(div);
            });
        }
    } catch (e) {
        console.error("Queue Fetch Error", e);
    }
}
setInterval(() => {
    if (document.getElementById('queue-view').classList.contains('active')) {
        fetchLiveQueue();
    }
}, 5000);