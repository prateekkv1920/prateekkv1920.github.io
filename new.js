// new.js
console.log("Prateek KV Portfolio Engine Initialized.");

// Safety definitions for ATS Resume Modal actions
if (typeof window.printAtsResume !== 'function') {
    window.printAtsResume = function() {
        var modal = document.getElementById('resumeModal') || document.getElementById('resumeModalBackdrop');
        if (modal && !modal.classList.contains('active')) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        window.print();
    };
}

if (typeof window.downloadAtsText !== 'function') {
    window.downloadAtsText = function() {
        var resumeEl = document.getElementById('printableResume') || document.querySelector('.modal-resume-body') || document.querySelector('.ats-content');
        if (!resumeEl) {
            console.error("Resume content element not found.");
            return;
        }
        var rawText = (resumeEl.innerText || resumeEl.textContent || '')
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        var blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Prateek_KV_ATS_Resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);

        if (typeof showToast === 'function') {
            showToast('ATS Resume (.txt) downloaded successfully!');
        }
    };
}
window.downloadAtsResumeText = window.downloadAtsText;