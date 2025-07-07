// Web Worker for reliable session timeout timing
// This worker runs in a separate thread and is not throttled by browsers in background tabs

let inactivityTimer = null;
let modalTimer = null;

self.onmessage = function(e) {
    const { type, timeoutMs, countdownMs } = e.data;
    
    switch (type) {
        case 'startInactivityCountdown':
            // Clear any existing timers
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
            }
            if (modalTimer) {
                clearTimeout(modalTimer);
            }
            
            // Start the 18-minute inactivity countdown
            inactivityTimer = setTimeout(() => {
                self.postMessage({ type: 'showModal' });
            }, timeoutMs);
            break;
            
        case 'startModalCountdown':
            // Clear inactivity timer since modal is showing
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
                inactivityTimer = null;
            }
            
            // Start the 2-minute modal countdown
            modalTimer = setTimeout(() => {
                self.postMessage({ type: 'autoLogout' });
            }, countdownMs);
            break;
            
        case 'cancelTimers':
            // Cancel all timers (when user renews session)
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
                inactivityTimer = null;
            }
            if (modalTimer) {
                clearTimeout(modalTimer);
                modalTimer = null;
            }
            break;
    }
}; 