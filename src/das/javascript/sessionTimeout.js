

function SessionTimeOutModal () {
    this.modal = null;
    this.modalId = 'das-session-timeout-modal';
    this.inactivityCountdownTime = document.body.dataset.timeout || 18 // minutes
    this.modalCountdownTime = document.body.dataset.modalcount || 120; // seconds
    this.modalTimeout = null;
    this.urls = {
        renew: '/service/keepalive',
        logout: '/service/signout?autoSignOut=true'
    };
    this.modalHtml = `
        <div class="das-modal" role="dialog" aria-modal="true" id="${this.modalId}">
            <div class="das-modal__body" tabindex="0">
                <h2 class="govuk-heading-m">You’re about to be signed out</h2>
                <p class="govuk-body">For your security, we will sign you out in <strong>${this.formatTime(this.modalCountdownTime)}</strong>.</p>
                <div class="das-modal__actions govuk-button-group">
                    <button class="govuk-button" id="das-timeout-action-renew">Stay signed in</button>
                    <a class="govuk-link" id="das-timeout-action-logout" href="#" role="button">Sign out</a>
                </div>
            </div>
        </div>`;
}

SessionTimeOutModal.prototype.init = function () {
    this.startInactivityCountdown()
}

SessionTimeOutModal.prototype.startInactivityCountdown = function () {
    setTimeout(this.showModal.bind(this), this.inactivityCountdownTime * 60 * 1000);
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
    this.modalTimeout = setInterval(() => {
        countdownTime--;
        countdownDisplay.textContent = `${this.formatTime(countdownTime)}`;
        if (countdownTime <= 0) {
            clearInterval(this.modalTimeout);
            this.logout();
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
                this.startInactivityCountdown();
            } else {
                console.error('Failed to renew session');
            }
        })
        .catch(error => console.error('Error:', error));
}

SessionTimeOutModal.prototype.hideModal = function () {
    clearInterval(this.modalTimeout);
    this.modal.remove();
}

SessionTimeOutModal.prototype.logout = function () {
    window.location.href = this.urls.logout;
}

document.addEventListener("DOMContentLoaded", function () {
    const sessionTimeOutModal = new SessionTimeOutModal();
    sessionTimeOutModal.init();
});
