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
            
            console.log('[SessionTimeout Worker] Starting inactivity countdown for', timeoutMs / 1000 / 60, 'minutes');
            
            // Start the 18-minute inactivity countdown
            inactivityTimer = setTimeout(() => {
                console.log('[SessionTimeout Worker] Inactivity timeout reached - showing modal');
                self.postMessage({ type: 'showModal' });
            }, timeoutMs);
            break;
            
        case 'startModalCountdown':
            // Clear inactivity timer since modal is showing
            if (inactivityTimer) {
                clearTimeout(inactivityTimer);
                inactivityTimer = null;
            }
            
            console.log('[SessionTimeout Worker] Starting modal countdown for', countdownMs / 1000, 'seconds');
            
            // Start the 2-minute modal countdown
            modalTimer = setTimeout(() => {
                console.log('[SessionTimeout Worker] Modal countdown expired - auto logout');
                self.postMessage({ type: 'autoLogout' });
            }, countdownMs);
            break;
            
        case 'cancelTimers':
            // Cancel all timers (when user renews session)
            console.log('[SessionTimeout Worker] Cancelling all timers');
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

// Log when worker starts
console.log('[SessionTimeout Worker] Worker initialized and ready'); 