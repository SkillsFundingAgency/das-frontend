let inactivityTimer;
let modalTimer;

self.onmessage = function(e) {
    const { type, timeout } = e.data;
    
    if (type === 'startInactivityTimer') {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            self.postMessage({ type: 'showModal' });
        }, timeout);
    } else if (type === 'startModalTimer') {
        let remainingTime = timeout;
        clearInterval(modalTimer);
        modalTimer = setInterval(() => {
            remainingTime--;
            self.postMessage({ type: 'updateCountdown', remainingTime });
            if (remainingTime <= 0) {
                clearInterval(modalTimer);
                self.postMessage({ type: 'logout' });
            }
        }, 1000);
    } else if (type === 'clear') {
        clearTimeout(inactivityTimer);
        clearInterval(modalTimer);
    }
}; 