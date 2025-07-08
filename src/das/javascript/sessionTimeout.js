

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
    try {
        // Use Web Worker for reliable timing in background tabs
        console.log('[SessionTimeout] Creating Web Worker for background tab support');
        this.worker = new Worker('/js/sessionTimeout.worker.js');
        
        this.worker.onmessage = (e) => {
            console.log('[SessionTimeout] Received message from worker:', e.data.type);
            if (e.data.type === 'showModal') {
                console.log('[SessionTimeout] Showing timeout modal');
                this.showModal();
            } else if (e.data.type === 'autoLogout') {
                console.log('[SessionTimeout] Auto logout triggered by worker');
                this.logout("autoSignOut");
            }
        };
        
        // Add error handling for worker
        this.worker.onerror = (error) => {
            console.error('[SessionTimeout] Web Worker error:', error);
            // Fallback to original setTimeout if worker fails
            console.log('[SessionTimeout] Falling back to setTimeout');
            setTimeout(this.showModal.bind(this), this.inactivityCountdownTime * 60 * 1000);
        };
        
        // Start the 18-minute countdown
        console.log('[SessionTimeout] Starting inactivity countdown via worker');
        this.worker.postMessage({
            type: 'startInactivityCountdown',
            timeoutMs: this.inactivityCountdownTime * 60 * 1000
        });
    } catch (error) {
        console.error('[SessionTimeout] Failed to create Web Worker, falling back to setTimeout:', error);
        // Fallback to original setTimeout if Web Workers are not supported
        setTimeout(this.showModal.bind(this), this.inactivityCountdownTime * 60 * 1000);
    }
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
    if (this.worker) {
        try {
            this.worker.postMessage({
                type: 'startModalCountdown',
                countdownMs: this.modalCountdownTime * 1000
            });
        } catch (error) {
            console.error('Failed to send message to worker:', error);
        }
    }
    
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
                    try {
                        this.worker.postMessage({ type: 'cancelTimers' });
                    } catch (error) {
                        console.error('Failed to cancel worker timers:', error);
                    }
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
        try {
            this.worker.terminate();
        } catch (error) {
            console.error('Failed to terminate worker:', error);
        }
    }
    window.location.href = `${this.urls.logout}${action === "autoSignOut" ? "?autoSignOut=true" : ""}`;
}

document.addEventListener("DOMContentLoaded", function () {
    const sessionTimeOutModal = new SessionTimeOutModal();
    sessionTimeOutModal.init();
});
