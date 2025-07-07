

function SessionTimeOutModal () {
    this.modal = null;
    this.modalId = 'das-session-timeout-modal';
    this.inactivityCountdownTime = document.body.dataset.timeout || 18 // minutes
    this.modalCountdownTime = document.body.dataset.modalcount || 120; // seconds
    this.modalTimeout = null;
    this.worker = null;
    this.urls = {
        renew: '/service/keepalive',
        logout: '/service/signout'
    };
    this.modalHtml = `
        <div class="das-modal" role="dialog" aria-modal="true" id="${this.modalId}">
            <div class="das-modal__body" tabindex="0">
                <h2 class="govuk-heading-m">You're about to be signed out</h2>
                <p class="govuk-body">For your security, we will sign you out in <strong>${this.formatTime(this.modalCountdownTime)}</strong>.</p>
                <div class="das-modal__actions govuk-button-group">
                    <button class="govuk-button" id="das-timeout-action-renew">Stay signed in</button>
                    <a class="govuk-link" id="das-timeout-action-logout" href="#" role="button">Sign out</a>
                </div>
            </div>
        </div>`;
}

SessionTimeOutModal.prototype.init = function () {
    this.startInactivityCountdown();
}

SessionTimeOutModal.prototype.startInactivityCountdown = function () {
    // Use Web Worker for reliable timing in background tabs
    this.worker = new Worker('/js/sessionTimeout.worker.js');
    
    this.worker.onmessage = (e) => {
        if (e.data.type === 'showModal') {
            this.showModal();
        } else if (e.data.type === 'autoLogout') {
            this.logout("autoSignOut");
        }
    };
    
    // Start the 18-minute countdown
    this.worker.postMessage({
        type: 'startInactivityCountdown',
        timeoutMs: this.inactivityCountdownTime * 60 * 1000
    });
}

SessionTimeOutModal.prototype.formatTime = function (seconds) {
    if (seconds < 60) {
        return `${seconds} seconds`;
    }
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

SessionTimeOutModal.prototype.showModal = function () {
    document.body.insertAdjacentHTML('beforeend', this.modalHtml);
    this.modal = document.getElementById(this.modalId);
    this.modal.firstElementChild.focus();
    this.modalEvents();
    this.startModalCountdown();
}

SessionTimeOutModal.prototype.modalEvents = function () {
    const renewButton = document.getElementById("das-timeout-action-renew");
    const logoutButton = document.getElementById("das-timeout-action-logout");
    renewButton.addEventListener("click", this.renewSession.bind(this));
    logoutButton.addEventListener("click", this.logout.bind(this));
}

SessionTimeOutModal.prototype.startModalCountdown = function () {
    let countdownTime = this.modalCountdownTime;
    let countdownDisplay = this.modal.getElementsByTagName('strong')[0];
    
    // Use Web Worker for modal countdown too
    this.worker.postMessage({
        type: 'startModalCountdown',
        countdownMs: this.modalCountdownTime * 1000
    });
    
    // Update display every second (this can be throttled in background, but worker handles the actual timeout)
    this.modalTimeout = setInterval(() => {
        countdownTime--;
        if (countdownDisplay) {
            countdownDisplay.textContent = `${this.formatTime(countdownTime)}`;
        }
        if (countdownTime <= 0) {
            clearInterval(this.modalTimeout);
        }
    }, 1000);
}

SessionTimeOutModal.prototype.renewSession = function (e) {
    e.preventDefault();

    const button = e.target;
    button.disabled = true;

    fetch(this.urls.renew, {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => {
            if (response.ok) {
                this.hideModal();
                // Cancel existing timers and restart countdown
                if (this.worker) {
                    this.worker.postMessage({ type: 'cancelTimers' });
                }
                this.startInactivityCountdown();
            } else {
                console.error('Failed to renew session');
            }
        })
        .catch(error => console.error('Error:', error));
}

SessionTimeOutModal.prototype.hideModal = function () {
    clearInterval(this.modalTimeout);
    if (this.modal) {
        this.modal.remove();
    }
    // Restart the inactivity countdown
    this.startInactivityCountdown();
}

SessionTimeOutModal.prototype.logout = function (action) {
    if (this.worker) {
        this.worker.terminate();
    }
    window.location.href = `${this.urls.logout}${action === "autoSignOut" ? "?autoSignOut=true" : ""}`;
}

document.addEventListener("DOMContentLoaded", function () {
    const sessionTimeOutModal = new SessionTimeOutModal();
    sessionTimeOutModal.init();
});
