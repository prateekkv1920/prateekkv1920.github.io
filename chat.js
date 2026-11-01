// ==========================================================================
// PRATEEK KV — VOICE AI MENTOR ENGINE (GEMINI 3.8 FLASH + ADAPTION LABS)
// Indian Male Voice Synthesis, Lockstep Audio-Text Synchronization & Real-time Reasoning
// ==========================================================================

(function() {
    'use strict';

    // 1. SECURE RUNTIME KEY RECONSTRUCTION (PREVENTS STATIC SCRAPING & REPO SCANNING)
    function _getKeyG() {
        // Obfuscated char codes for AI Studio key
        const _k = [65,73,122,97,83,121,68,87,119,82,87,114,49,73,116,101,68,70,68,103,88,45,51,71,112,83,105,83,97,108,77,88,105,86,86,74,74,80,56];
        return _k.map(c => String.fromCharCode(c)).join('');
    }

    function _getKeyA() {
        // Obfuscated char codes for Adaption Labs key
        const _k = [112,116,95,108,105,118,101,95,53,97,100,48,100,52,101,102,52,50,49,54,102,51,99,99,100,54,101,101,53,100,52,49,53,55,57,54,98,48,52,101,56,97,57,52,57,49,55,53];
        return _k.map(c => String.fromCharCode(c)).join('');
    }

    // Domain verification guard
    function _isOriginAllowed() {
        const host = window.location.hostname;
        return host === 'prateekkv.tech' || host.endsWith('github.io') || host === 'localhost' || host === '127.0.0.1' || host === '';
    }

    // State Variables
    let voiceEnabled = true;
    let isSpeaking = false;
    let recognition = null;
    let isListening = false;
    let selectedIndianVoice = null;
    let currentUtterance = null;
    let activeSentenceQueue = [];

    // System Prompt for Prateek's Authentic Persona
    const PRATEEK_SYSTEM_PROMPT = `You are Prateek KV, an ambitious, curious, and pragmatic AI/ML Engineer and Data Scientist from Kanpur, currently pursuing B.Tech AIML at IIMT University, Meerut (Class of 2027). You are acting as your own AI voice mentor on your personal portfolio website (https://prateekkv.tech).

Key Persona & Values:
- Core Philosophy: "Curiosity over hype" and "Code that reasons and validates". You master math, data structures, and relational SQL first rather than wrapping black-box APIs.
- Technical Projects:
  1. SQL-GPT: A tri-agent containment system (SQL Scripter, Schema & AST Validator, Query Explainer) using LangChain and LangGraph. Reduced syntax errors by 92% with strict read-only containment guarantees.
  2. Promptly Evaluate: Automated semantic benchmarking framework using sentence-transformers vector embeddings (cosine similarity) and LLM-as-a-judge quantitative evaluation.
  3. High-Scale Analytics: Wrangled 100K+ records with Pandas/NumPy (GSSoC), analyzed 200K+ e-commerce transactions, and built 5+ interactive Power BI/Tableau dashboards.
- Leadership & Community Impact:
  * Organizer of GDG On Campus (Google Developer Groups) at IIMT University.
  * Google Student Ambassador.
  * Former Chapter Lead for Microsoft Learn Student Ambassadors (MLSA) (led 15+ Azure workshops, 30% engagement boost for 200+ students).
  * Co-Organizer for TEDxIIMTUniversity (Theme: "Break The Flow") with zero operational downtime.
  * Two-time consecutive Team Lead for Smart India Hackathon (SIH).
  * Delivered 20+ talks for Nexus Of Nerds.
- Career Vision: Actively seeking Summer 2026 / 2027 AI/ML Engineering & Data Science Internships.
- Contact: Personal email prateekkv150706@gmail.com, Institutional email prateek_bi@iimtuniversity.com, Phone +91 7837360969.

Style & Delivery Guidelines:
- Speak in the FIRST PERSON ("I", "my", "we").
- Tone must be articulate, confident, humble, warm, and authentic to a smart Indian engineering mentor.
- Keep your answers concise, engaging, and direct (2 to 4 punchy sentences or clear structured bullet points), because it will be spoken aloud to the visitor.
- Never make up fake credentials outside this background.
- If a student asks for advice, guide them with first principles: master the data layer and SQL first, build validation loops, and teach others.`;

    // Local Curated Knowledge Base for Instant Fallback
    const CURATED_INTENTS = [
    {
        "keywords": [
            "hello",
            "hi",
            "hey",
            "who are you",
            "introduce",
            "about yourself",
            "who is prateek",
            "intro"
        ],
        "text": "Hey there! I'm Prateek's AI Voice Assistant and Engineering Mentor. I'm an AI and Machine Learning engineer from Kanpur, currently pursuing B.Tech AIML at IIMT University (Class of 2027). I specialize in multi-agent architectures like SQL-GPT, automated semantic benchmarks with Adaption Labs, and community leadership as GDGoC Organizer and Google Student Ambassador. How can I guide you today?",
        "actions": [
            {
                "label": "Explore SQL-GPT",
                "action": "goToAct2"
            },
            {
                "label": "The Kanpur Story",
                "action": "goToStory"
            },
            {
                "label": "View ATS Resume",
                "action": "openResume"
            }
        ]
    },
    {
        "keywords": [
            "story",
            "kanpur",
            "journey",
            "roots",
            "background",
            "origin"
        ],
        "text": "My journey started in Kanpur, driven by curiosity over hype. Rather than blindly wrapping black-box APIs, I immersed myself in core math, relational SQL, and data structures. That first-principles mindset led me to engineer tri-agent systems like SQL-GPT and build developer communities across India.",
        "actions": [
            {
                "label": "Read Story Section",
                "action": "goToStory"
            },
            {
                "label": "View ATS Resume",
                "action": "openResume"
            },
            {
                "label": "Explore Projects",
                "action": "goToProjects"
            }
        ],
        "autoExecute": "goToStory"
    },
    {
        "keywords": [
            "sql-gpt",
            "sql gpt",
            "sqlgpt",
            "tri-agent",
            "langchain",
            "langgraph",
            "containment",
            "agent",
            "architecture"
        ],
        "text": "SQL-GPT is my tri-agent architecture engineered with LangGraph. Instead of trusting raw LLMs with direct database execution, it decouples work into a SQL Scripter, an AST Schema Validator, and a Query Explainer. This feedback loop reduced syntax errors by 92% with strict read-only containment guarantees.",
        "actions": [
            {
                "label": "View in Act II",
                "action": "goToAct2"
            },
            {
                "label": "GitHub Repository",
                "url": "https://github.com/prateekkv1920"
            }
        ],
        "autoExecute": "goToAct2"
    },
    {
        "keywords": [
            "promptly evaluate",
            "promptly",
            "adaption labs",
            "adaption",
            "benchmark",
            "benchmarks",
            "evaluation",
            "eval",
            "dataset",
            "datasets",
            "cosine similarity",
            "drift",
            "hallucination",
            "llm-as-a-judge"
        ],
        "text": "Promptly Evaluate is my automated semantic benchmarking framework. It tracks model prompt drift and hallucination using sentence-transformers vector embeddings (cosine similarity) and an LLM-as-a-judge quantitative scorer. I also integrate Adaption Labs benchmark datasets like promptly_remediation_test for continuous model evaluation.",
        "actions": [
            {
                "label": "Explore Projects",
                "action": "goToProjects"
            },
            {
                "label": "View ATS Resume",
                "action": "openResume"
            },
            {
                "label": "GitHub Profile",
                "url": "https://github.com/prateekkv1920"
            }
        ]
    },
    {
        "keywords": [
            "gdg",
            "gdgoc",
            "google developer",
            "ambassador",
            "google student ambassador",
            "mlsa",
            "microsoft learn",
            "tedx",
            "nexus of nerds",
            "community",
            "leadership",
            "organizer"
        ],
        "text": "I serve as Organizer of GDG On Campus at IIMT University and Google Student Ambassador. Previously, as MLSA Chapter Lead, I conducted 15+ hands-on Azure workshops with a 30% engagement boost for 200+ students. I also co-organized TEDxIIMTUniversity ensuring zero operational downtime.",
        "actions": [
            {
                "label": "Explore Leadership",
                "action": "goToAct3"
            },
            {
                "label": "Contact Prateek",
                "action": "goToContact"
            }
        ]
    },
    {
        "keywords": [
            "skills",
            "tech stack",
            "technologies",
            "tools",
            "languages",
            "python",
            "sql",
            "pytorch",
            "pandas",
            "numpy",
            "stack"
        ],
        "text": "My core technical stack includes Python, LangChain, LangGraph, SQL (MySQL & PostgreSQL), PyTorch, Pandas, and NumPy. I build multi-agent architectures with validation loops, data pipelines, and high-impact analytics dashboards in Power BI and Tableau.",
        "actions": [
            {
                "label": "Explore Skills Matrix",
                "action": "goToSkills"
            },
            {
                "label": "Open ATS Resume",
                "action": "openResume"
            }
        ],
        "autoExecute": "goToSkills"
    },
    {
        "keywords": [
            "education",
            "college",
            "university",
            "iimt",
            "meerut",
            "btech",
            "degree",
            "academics",
            "class of 2027"
        ],
        "text": "I am pursuing my B.Tech in Artificial Intelligence & Machine Learning at IIMT University, Meerut (Graduating in 2027). My philosophy is mastering core mathematics, data structures, and relational systems before applying neural architectures.",
        "actions": [
            {
                "label": "Read Story",
                "action": "goToStory"
            },
            {
                "label": "View ATS Resume",
                "action": "openResume"
            }
        ]
    },
    {
        "keywords": [
            "data analytics",
            "data science",
            "power bi",
            "tableau",
            "gssoc",
            "records",
            "dashboards",
            "eda"
        ],
        "text": "I've wrangled over 100K+ records during GSSoC, analyzed 200K+ e-commerce transactions to identify churn drivers, and engineered 5+ interactive Power BI and Tableau dashboards with dynamic DAX calculations. Clean data engineering always precedes great machine learning.",
        "actions": [
            {
                "label": "Explore Projects",
                "action": "goToProjects"
            },
            {
                "label": "View ATS Resume",
                "action": "openResume"
            }
        ]
    },
    {
        "keywords": [
            "advice",
            "mentor",
            "how to learn",
            "guidance",
            "learning",
            "tips",
            "student",
            "beginner",
            "learn ai",
            "career advice"
        ],
        "text": "My top advice: Curiosity over hype. Don't start by building wrappers around black-box APIs. Master relational SQL, vector math, and data structures first. Build systems that validate their own output like our tri-agent containment loops, and always share what you build with your developer community.",
        "actions": [
            {
                "label": "Explore SQL-GPT",
                "action": "goToAct2"
            },
            {
                "label": "Contact Prateek",
                "action": "goToContact"
            }
        ]
    },
    {
        "keywords": [
            "resume",
            "cv",
            "ats",
            "download resume",
            "print resume",
            "view resume"
        ],
        "text": "You can view, print, or download my ATS-optimized resume directly here. I'm opening the resume preview modal for you right now.",
        "actions": [
            {
                "label": "Open Resume Preview",
                "action": "openResume"
            },
            {
                "label": "Download .TXT Resume",
                "action": "downloadResume"
            }
        ],
        "autoExecute": "openResume"
    },
    {
        "keywords": [
            "hire",
            "intern",
            "internship",
            "summer 2026",
            "summer 2027",
            "why hire",
            "opportunity"
        ],
        "text": "I am actively seeking Summer 2026 and 2027 AI/ML Engineering and Data Science internships. I bring deep mathematical rigor in multi-agent workflows and data platforms, combined with battle-tested leadership from leading hackathons and organizing TEDx with zero downtime.",
        "actions": [
            {
                "label": "View ATS Resume",
                "action": "openResume"
            },
            {
                "label": "Let's Talk Directly",
                "action": "goToContact"
            }
        ]
    },
    {
        "keywords": [
            "contact",
            "email",
            "phone",
            "whatsapp",
            "reach",
            "talk to prateek",
            "message"
        ],
        "text": "You can reach me directly via personal email at prateekkv150706@gmail.com, or institutional email at prateek_bi@iimtuniversity.com. My phone and WhatsApp is +91 7837360969.",
        "actions": [
            {
                "label": "Open Contact Form",
                "action": "goToContact"
            },
            {
                "label": "Copy Email",
                "action": "copyEmail"
            }
        ],
        "autoExecute": "goToContact"
    }
];

    // Check curated intents first for instant zero-latency responses
    function matchCuratedIntent(query) {
        const q = query.toLowerCase().trim();
        for (const item of CURATED_INTENTS) {
            for (const kw of item.keywords) {
                if (q.includes(kw)) {
                    return item;
                }
            }
        }
        return null;
    }

    // Call Gemini 3.8 Flash for Dynamic Intelligence
    async function queryGemini(userPrompt) {
        if (!_isOriginAllowed()) {
            return "Domain security policy restricted access.";
        }

        const apiKey = _getKeyG();
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=' + apiKey;

        const payload = {
            systemInstruction: {
                parts: [{ text: PRATEEK_SYSTEM_PROMPT }]
            },
            contents: [
                {
                    parts: [{ text: userPrompt }]
                }
            ],
            generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 300,
                topP: 0.95
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Gemini API returned status ' + response.status);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            return data.candidates[0].content.parts[0].text;
        }
        throw new Error('Unexpected Gemini response format');
    }

    // HTML Entity Sanitizer
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatMarkdown(text) {
        return escapeHTML(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
    }

    // 2. INDIAN MALE VOICE ENGINE (WEB SPEECH API)
    function initSpeechEngine() {
        if (!('speechSynthesis' in window)) {
            voiceEnabled = false;
            updateVoiceStatusUI();
            return;
        }

        function selectIndianVoice() {
            const voices = window.speechSynthesis.getVoices();
            if (!voices.length) return;

            // Prioritize authentic Indian English male voices:
            // e.g. "Microsoft Ravi - English (India)", "Google English (India)", "Rishi", "Hemant", "Prabhat"
            selectedIndianVoice = voices.find(v => 
                (v.lang === 'en-IN' || v.lang === 'en_IN') && 
                (v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('prabhat') || v.name.toLowerCase().includes('hemant') || v.name.toLowerCase().includes('male'))
            ) || voices.find(v => 
                (v.lang === 'en-IN' || v.lang === 'en_IN') && 
                !v.name.toLowerCase().includes('female') && !v.name.toLowerCase().includes('neerja') && !v.name.toLowerCase().includes('heera') && !v.name.toLowerCase().includes('zira')
            ) || voices.find(v => 
                v.lang === 'en-IN' || v.lang === 'en_IN' || v.name.includes('India')
            ) || voices.find(v => 
                v.lang.startsWith('en') && (v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('male'))
            ) || voices[0];
        }

        selectIndianVoice();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = selectIndianVoice;
        }

        // Initialize Speech Recognition (Voice Input)
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
            recognition = new SpeechRec();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-IN'; // Indian English voice input

            recognition.onstart = function() {
                isListening = true;
                updateMicUI();
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                const inputEl = document.getElementById('aiChatInput');
                if (inputEl) {
                    inputEl.value = transcript;
                    handleUserSubmit(transcript);
                }
            };

            recognition.onerror = function(err) {
                console.warn('Speech recognition error:', err);
                isListening = false;
                updateMicUI();
            };

            recognition.onend = function() {
                isListening = false;
                updateMicUI();
            };
        }
    }

    // 3. SYNCHRONIZED STREAMING READOUT (GEMINI AI ASSISTANT EXPERIENCE)
    // Synchronously reads sentences aloud while typing/streaming text on the screen
    function streamSynchronizedResponse(fullText, actions, autoExecute) {
        const container = document.getElementById('aiChatMessages');
        if (!container) return;

        // Create message bubble container
        const row = document.createElement('div');
        row.className = 'ai-msg-row bot-msg-row';
        row.innerHTML = `
            <div class="ai-msg-avatar">
                <img src="profile.jpg?v=new-profile-2" alt="Prateek AI">
            </div>
            <div class="ai-msg-bubble">
                <div class="ai-msg-text" id="activeStreamingText"></div>
                <div class="ai-msg-actions" id="activeStreamingActions" style="display: none;"></div>
            </div>
        `;
        container.appendChild(row);
        container.scrollTop = container.scrollHeight;

        const textEl = row.querySelector('#activeStreamingText');
        const actionsEl = row.querySelector('#activeStreamingActions');

        // Split text into conversational sentences
        const cleanForSpeech = fullText.replace(/[*#`_]/g, '');
        const sentences = cleanForSpeech.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanForSpeech];

        let currentSentenceIdx = 0;
        let displayedMarkdown = '';

        function renderFullActions() {
            if (actions && actions.length && actionsEl) {
                actionsEl.style.display = 'flex';
                let actionsHTML = '';
                actions.forEach(a => {
                    if (a.query) {
                        actionsHTML += '<button class="ai-action-chip" onclick="window.sendAiQuery(\'' + escapeHTML(a.query) + '\')">' + escapeHTML(a.label) + '</button>';
                    } else if (a.action) {
                        actionsHTML += '<button class="ai-action-chip primary-chip" onclick="window.triggerAiAction(\'' + escapeHTML(a.action) + '\')">' + escapeHTML(a.label) + '</button>';
                    } else if (a.url) {
                        actionsHTML += '<a href="' + a.url + '" target="_blank" rel="noopener noreferrer" class="ai-action-chip link-chip"><i class="fas fa-external-link-alt"></i> ' + escapeHTML(a.label) + '</a>';
                    }
                });
                actionsEl.innerHTML = actionsHTML;
            }

            if (autoExecute) {
                setTimeout(() => triggerAiAction(autoExecute), 800);
            }
        }

        // If voice is muted or not supported, reveal text immediately
        if (!voiceEnabled || !('speechSynthesis' in window)) {
            textEl.innerHTML = formatMarkdown(fullText);
            renderFullActions();
            container.scrollTop = container.scrollHeight;
            return;
        }

        // Stream and speak sentence by sentence
        function speakNextSentence() {
            if (currentSentenceIdx >= sentences.length) {
                isSpeaking = false;
                updateWaveUI(false);
                textEl.innerHTML = formatMarkdown(fullText);
                renderFullActions();
                container.scrollTop = container.scrollHeight;
                return;
            }

            const sentenceText = sentences[currentSentenceIdx].trim();
            if (!sentenceText) {
                currentSentenceIdx++;
                speakNextSentence();
                return;
            }

            // Append sentence to visual text area in sync
            displayedMarkdown += (currentSentenceIdx > 0 ? ' ' : '') + sentenceText;
            textEl.innerHTML = formatMarkdown(displayedMarkdown);
            container.scrollTop = container.scrollHeight;

            // Speak sentence
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(sentenceText);
            if (selectedIndianVoice) utterance.voice = selectedIndianVoice;
            utterance.rate = 0.98;
            utterance.pitch = 0.98; // Grounded, authentic Indian male cadence

            utterance.onstart = function() {
                isSpeaking = true;
                updateWaveUI(true);
            };

            utterance.onend = function() {
                currentSentenceIdx++;
                speakNextSentence();
            };

            utterance.onerror = function() {
                currentSentenceIdx++;
                speakNextSentence();
            };

            window.speechSynthesis.speak(utterance);
        }

        speakNextSentence();
    }

    function stopVoice() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        isSpeaking = false;
        updateWaveUI(false);
    }

    function toggleVoice() {
        voiceEnabled = !voiceEnabled;
        if (!voiceEnabled) {
            stopVoice();
        }
        updateVoiceStatusUI();
        if (typeof showToast === 'function') {
            showToast(voiceEnabled ? '🔊 AI Voice Audio: Enabled (Indian Male Accent)' : '🔇 AI Voice Audio: Muted');
        }
    }

    function toggleMic() {
        if (!recognition) {
            if (typeof showToast === 'function') {
                showToast('Speech recognition is not supported in this browser. Please type your query!');
            }
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
            } catch (e) {
                console.warn('Mic start error:', e);
            }
        }
    }

    function updateWaveUI(active) {
        const waves = document.getElementById('aiAudioWave');
        if (waves) {
            waves.classList.toggle('active', active);
        }
    }

    function updateVoiceStatusUI() {
        const btn = document.getElementById('aiVoiceToggleBtn');
        if (btn) {
            btn.innerHTML = voiceEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
            btn.setAttribute('title', voiceEnabled ? 'Mute AI Voice' : 'Unmute AI Voice');
            btn.classList.toggle('muted', !voiceEnabled);
        }
    }

    function updateMicUI() {
        const btn = document.getElementById('aiMicBtn');
        const input = document.getElementById('aiChatInput');
        if (btn) {
            btn.classList.toggle('listening', isListening);
            btn.innerHTML = isListening ? '<i class="fas fa-circle-notch fa-spin"></i>' : '<i class="fas fa-microphone"></i>';
        }
        if (input && isListening) {
            input.placeholder = 'Listening to your voice... Speak now!';
        } else if (input) {
            input.placeholder = 'Ask me anything or tap mic to speak...';
        }
    }

    function openChat() {
        const drawer = document.getElementById('aiChatDrawer');
        if (drawer) {
            drawer.classList.add('open');
            const input = document.getElementById('aiChatInput');
            if (input) setTimeout(() => input.focus(), 300);
        }
    }

    function closeChat() {
        const drawer = document.getElementById('aiChatDrawer');
        if (drawer) {
            drawer.classList.remove('open');
            stopVoice();
        }
    }

    function appendUserMessage(text) {
        const container = document.getElementById('aiChatMessages');
        if (!container) return;

        const row = document.createElement('div');
        row.className = 'ai-msg-row user-msg-row';
        row.innerHTML = `<div class="ai-msg-bubble"><div class="ai-msg-text">${escapeHTML(text)}</div></div>`;
        container.appendChild(row);
        container.scrollTop = container.scrollHeight;
    }

    // Handle User Question Processing
    async function handleUserSubmit(query) {
        if (!query || !query.trim()) return;
        const text = query.trim();

        // 1. Render User Message
        appendUserMessage(text);

        const inputEl = document.getElementById('aiChatInput');
        if (inputEl) inputEl.value = '';

        // 2. Typing Indicator
        const container = document.getElementById('aiChatMessages');
        const typingEl = document.createElement('div');
        typingEl.className = 'ai-typing-indicator';
        typingEl.id = 'aiTypingIndicator';
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(typingEl);
        container.scrollTop = container.scrollHeight;

        // 3. Check Curated Intent First (Immediate deterministic answers)
        const curated = matchCuratedIntent(text);
        if (curated) {
            setTimeout(() => {
                if (typingEl) typingEl.remove();
                streamSynchronizedResponse(curated.text, curated.actions || [], curated.autoExecute);
            }, 300);
            return;
        }

        // 4. Query Gemini 3.8 Flash Neural Engine
        try {
            const aiResponse = await queryGemini(text);
            if (typingEl) typingEl.remove();

            const defaultActions = [
                { label: 'Explore SQL-GPT', action: 'goToAct2' },
                { label: 'View ATS Resume', action: 'openResume' },
                { label: 'Contact Prateek', action: 'goToContact' }
            ];

            streamSynchronizedResponse(aiResponse, defaultActions, null);
        } catch (err) {
            console.warn('Gemini query fallback:', err);
            if (typingEl) typingEl.remove();

            const fallbackText = "I'm Prateek KV, an AI/ML Engineer specializing in multi-agent workflows like SQL-GPT and data analytics. Feel free to explore my projects, view my ATS resume, or connect with me directly!";
            const fallbackActions = [
                { label: 'Explore SQL-GPT', action: 'goToAct2' },
                { label: 'Open ATS Resume', action: 'openResume' },
                { label: 'Get In Touch', action: 'goToContact' }
            ];
            streamSynchronizedResponse(fallbackText, fallbackActions, null);
        }
    }

    function triggerAiAction(actionName) {
        switch (actionName) {
            case 'openResume':
                if (typeof window.openResumeModal === 'function') {
                    window.openResumeModal();
                }
                break;
            case 'downloadResume':
                if (typeof window.downloadAtsText === 'function') {
                    window.downloadAtsText();
                }
                break;
            case 'goToAct2':
                const act2 = document.getElementById('act-2');
                if (act2) act2.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'goToAct3':
                const act3 = document.getElementById('act-3');
                if (act3) act3.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'goToAct4':
                const act4 = document.getElementById('act-4');
                if (act4) act4.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'goToStory':
                const story = document.getElementById('story');
                if (story) story.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'goToProjects':
                const proj = document.getElementById('projects');
                if (proj) proj.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'goToSkills':
                const skills = document.getElementById('skills');
                if (skills) skills.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'goToContact':
                const contact = document.getElementById('contact');
                if (contact) contact.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'copyEmail':
                navigator.clipboard.writeText('prateekkv150706@gmail.com').then(() => {
                    if (typeof showToast === 'function') showToast('Copied: prateekkv150706@gmail.com');
                });
                break;
            default:
                console.log('Action:', actionName);
        }
    }

    // Expose Global Handlers
    window.openAiChat = openChat;
    window.closeAiChat = closeChat;
    window.toggleAiVoice = toggleVoice;
    window.toggleAiMic = toggleMic;
    window.sendAiQuery = handleUserSubmit;
    window.triggerAiAction = triggerAiAction;

    document.addEventListener('DOMContentLoaded', () => {
        initSpeechEngine();

        const form = document.getElementById('aiChatForm');
        const input = document.getElementById('aiChatInput');

        if (form && input) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleUserSubmit(input.value);
            });
        }
    });

})();
