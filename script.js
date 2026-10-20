/**
 * PRATEEK KV - MASTER PORTFOLIO INTERACTION ENGINE
 * Zero-dependency, performant, modern vanilla JavaScript
 */

// Global modal helpers for instant HTML onclick access
function openResumeModal() {
    var modal = document.getElementById('resumeModal') || document.getElementById('resumeModalBackdrop');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}
window.openResumeModal = openResumeModal;

function closeResumeModal() {
    var modal = document.getElementById('resumeModal') || document.getElementById('resumeModalBackdrop');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
window.closeResumeModal = closeResumeModal;

function closeResumeModalOnBackdrop(event) {
    if (event && (event.target.id === 'resumeModal' || event.target.id === 'resumeModalBackdrop' || event.target.classList.contains('modal-overlay'))) {
        closeResumeModal();
    }
}
window.closeResumeModalOnBackdrop = closeResumeModalOnBackdrop;


function downloadAtsResumeText() {
    var atsEl = document.querySelector('.ats-content');
    if (!atsEl) return;
    var rawText = atsEl.innerText;
    var blob = new Blob([rawText], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Prateek_KV_ATS_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (typeof showToast === 'function') {
        showToast('ATS Resume (.txt) downloaded successfully!');
    }
}
window.downloadAtsResumeText = downloadAtsResumeText;

window.openResumeModal = openResumeModal;
window.closeResumeModal = closeResumeModal;

document.addEventListener('DOMContentLoaded', function() {
    initNeuralCanvas();
    initTypewriter();
    initCounters();
    initNavbar();
    initProjectFilters();
    initCopyTriggers();
    initContactForm();
    initResumeModal();
    initBackToTop();
});

// 1. NEURAL PARTICLE CANVAS
function initNeuralCanvas() {
    var canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var width, height;
    var particles = [];
    var mouse = { x: null, y: null, maxDist: 180 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    function Particle() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1.2;
    }

    Particle.prototype.update = function() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
            var dx = mouse.x - this.x;
            var dy = mouse.y - this.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                var force = (120 - dist) / 120 * 0.02;
                this.vx -= dx * force;
                this.vy -= dy * force;
            }
        }
    };

    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
        ctx.fill();
    };

    var particleCount = Math.min(75, Math.floor((window.innerWidth * window.innerHeight) / 16000));
    for (var i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    var alpha = (1 - dist / 150) * 0.16;
                    ctx.strokeStyle = 'rgba(0, 240, 255, ' + alpha + ')';
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        if (mouse.x !== null && mouse.y !== null) {
            for (var k = 0; k < particles.length; k++) {
                var mdx = mouse.x - particles[k].x;
                var mdy = mouse.y - particles[k].y;
                var mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mdist < mouse.maxDist) {
                    var malpha = (1 - mdist / mouse.maxDist) * 0.22;
                    ctx.strokeStyle = 'rgba(139, 92, 246, ' + malpha + ')';
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[k].x, particles[k].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }

        for (var p = 0; p < particles.length; p++) {
            particles[p].update();
            particles[p].draw();
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// 2. DYNAMIC TYPEWRITER ANIMATION
function initTypewriter() {
    var el = document.getElementById('typedRole');
    if (!el) return;

    var roles = [
        "GDGoC Mentor",
        "AI/ML Engineer",
        "Google Student Ambassador",
        "Multi-Agent Systems Architect",
        "TEDx Co-Organizer",
        "Data Analytics & BI Developer",
        "Open Source Contributor"
    ];

    var roleIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typingSpeed = 85;
    var deleteSpeed = 40;
    var holdTime = 2000;

    function type() {
        var currentRole = roles[roleIndex];

        if (isDeleting) {
            el.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        var delay = isDeleting ? deleteSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            delay = holdTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 350;
        }

        setTimeout(type, delay);
    }
    type();
}

// 3. STAT NUMBER COUNTERS
function initCounters() {
    var counters = document.querySelectorAll('.stat-count');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var target = +entry.target.getAttribute('data-target');
                animateCount(entry.target, target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(function(c) { observer.observe(c); });

    function animateCount(element, targetVal) {
        var current = 0;
        var duration = 1600;
        var stepTime = 25;
        var totalSteps = duration / stepTime;
        var increment = targetVal / totalSteps;

        var timer = setInterval(function() {
            current += increment;
            if (current >= targetVal) {
                element.textContent = targetVal;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }
}

// 4. NAVBAR & MOBILE DRAWER
function initNavbar() {
    var navbar = document.getElementById('navbar');
    var mobileToggle = document.getElementById('mobileToggle');
    var navMenu = document.getElementById('navMenu');
    var navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('open');
        });

        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('open');
            });
        });
    }

    // Scroll spy
    var sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        var scrollY = window.pageYOffset;
        sections.forEach(function(sec) {
            var secHeight = sec.offsetHeight;
            var secTop = sec.offsetTop - 120;
            var secId = sec.getAttribute('id');

            if (scrollY > secTop && scrollY <= secTop + secHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + secId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// 5. PROJECT FILTER TABS
function initProjectFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');

            projectCards.forEach(function(card) {
                var category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(function() { card.style.opacity = '1'; }, 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(function() { card.style.display = 'none'; }, 200);
                }
            });
        });
    });
}

// 6. COPY TO CLIPBOARD & TOAST
function initCopyTriggers() {
    document.addEventListener('click', function(e) {
        var trigger = e.target.closest('.copy-trigger, .copy-btn');
        if (!trigger) return;
        var val = trigger.getAttribute('data-copy') || trigger.closest('[data-copy]').getAttribute('data-copy');
        if (!val) return;
        navigator.clipboard.writeText(val).then(function() {
            showToast('Copied to clipboard: ' + val);
        }).catch(function() {
            showToast('Copied: ' + val);
        });
    });
}

function showToast(message) {
    var toast = document.getElementById('toastNotification');
    var msg = document.getElementById('toastMsg');
    if (!toast || !msg) return;

    msg.textContent = message;
    toast.classList.add('show');

    setTimeout(function() {
        toast.classList.remove('show');
    }, 3200);
}

// 7. CONTACT FORM SUBMISSION
function initContactForm() {
    var form = document.getElementById('contactForm');
    var submitBtn = document.getElementById('formSubmitBtn');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var nameEl = document.getElementById('senderName');
        var emailEl = document.getElementById('senderEmail');
        var subjectEl = document.getElementById('senderSubject');
        var messageEl = document.getElementById('senderMessage');

        var name = nameEl ? nameEl.value.trim() : '';
        var email = emailEl ? emailEl.value.trim() : '';
        var subject = subjectEl ? subjectEl.value.trim() : 'Portfolio Contact Inquiry';
        var message = messageEl ? messageEl.value.trim() : '';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Delivering to Prateek...';
        }

        var payload = {
            name: name,
            email: email,
            _subject: '[Portfolio Inquiry] ' + subject + ' - from ' + name,
            message: message,
            _replyto: email,
            _cc: 'prateek_bi@iimtuniversity.com',
            _template: 'table',
            _captcha: 'false'
        };

        fetch('https://formsubmit.co/ajax/prateekkv150706@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(function(res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function(data) {
            showToast('Thank you ' + name + '! Your message has been sent directly to Prateek.');
            form.reset();
        })
        .catch(function(err) {
            console.warn('Fallback to mailto:', err);
            var nl = String.fromCharCode(10) + String.fromCharCode(10);
            var mailtoBody = 'From: ' + name + ' (' + email + ')' + nl + message;
            var mailtoUrl = 'mailto:prateekkv150706@gmail.com?cc=prateek_bi@iimtuniversity.com&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(mailtoBody);
            window.location.href = mailtoUrl;
            showToast('Opening your email client to send message...');
            form.reset();
        })
        .finally(function() {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span><i class="fas fa-paper-plane"></i> Send Message Directly to My Email</span>';
            }
        });
    });
}

// 8. ATS RESUME MODAL
function initResumeModal() {
    var modal = document.getElementById('resumeModal');

    // Direct button event bindings
    var openBtn1 = document.getElementById('openResumeModal');
    var openBtn2 = document.getElementById('heroResumeBtn');
    var openBtn3 = document.getElementById('floatingResumeBtn');
    var closeBtn = document.getElementById('closeResumeModal');

    if (openBtn1) openBtn1.addEventListener('click', function(e) { e.preventDefault(); openResumeModal(); });
    if (openBtn2) openBtn2.addEventListener('click', function(e) { e.preventDefault(); openResumeModal(); });
    if (openBtn3) openBtn3.addEventListener('click', function(e) { e.preventDefault(); openResumeModal(); });
    if (closeBtn) closeBtn.addEventListener('click', function(e) { e.preventDefault(); closeResumeModal(); });

    // Global document event delegation
    document.addEventListener('click', function(e) {
        if (e.target.closest('#openResumeModal, #heroResumeBtn, #floatingResumeBtn, .open-resume-btn, [data-modal="resume"]')) {
            e.preventDefault();
            openResumeModal();
        }
        if (e.target.closest('#closeResumeModal, .modal-close-btn')) {
            e.preventDefault();
            closeResumeModal();
        }
        if (e.target === modal) {
            closeResumeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeResumeModal();
        }
    });
}

// 9. BACK TO TOP
function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 450) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// ==========================================================================
// STORY CHAPTER NAVIGATION & SCROLL OBSERVER
// ==========================================================================
function jumpToStoryAct(actNum) {
    const actEl = document.getElementById('act-' + actNum);
    if (actEl) {
        actEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const pills = document.querySelectorAll('.story-nav-pill');
    pills.forEach((p, idx) => {
        if (idx + 1 === actNum) {
            p.classList.add('active');
        } else {
            p.classList.remove('active');
        }
    });
}
window.jumpToStoryAct = jumpToStoryAct;

// Observe story acts to highlight nav pills on scroll
function initStoryObserver() {
    const acts = [1, 2, 3, 4, 5].map(n => document.getElementById('act-' + n)).filter(Boolean);
    const pills = document.querySelectorAll('.story-nav-pill');
    if (!acts.length || !pills.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const actNum = parseInt(id.replace('act-', ''), 10);
                pills.forEach((p, idx) => {
                    p.classList.toggle('active', idx + 1 === actNum);
                });
            }
        });
    }, {
        threshold: 0.35,
        rootMargin: "-80px 0px -20% 0px"
    });

    acts.forEach(act => observer.observe(act));
}

document.addEventListener('DOMContentLoaded', () => {
    initStoryObserver();
});
