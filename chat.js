// ==========================================================================
// PRATEEK KV — AI VOICE & MENTOR CHATBOT ENGINE
// Authentic persona, Web Speech API (TTS & STT), deterministic knowledge base
// ==========================================================================

(function() {
    'use strict';

    let voiceEnabled = true;
    let isSpeaking = false;
    let recognition = null;
    let isListening = false;
    let selectedVoice = null;

    const PRATEEK_KNOWLEDGE = [
        {
            keywords: ['hello', 'hi', 'hey', 'who are you', 'introduce', 'about yourself', 'start'],
            voiceText: "Hey there! I'm Prateek's AI Voice Assistant and Engineering Mentor. I'm a B.Tech AIML student at IIMT University from Kanpur. I specialize in multi-agent workflows like SQL-GPT, automated LLM evaluation, and large-scale data analytics. How can I guide you today?",
            replyText: "Hey there! I'm **Prateek's AI Voice Assistant & Engineering Mentor**.\n\nI'm an **AI/ML Engineer & Data Scientist** (B.Tech AIML at IIMT University, Class of 2027) rooted in Kanpur. My focus is on **curiosity over hype** — engineering deterministic multi-agent architectures (like **SQL-GPT**), rigorous LLM benchmarking (**Promptly Evaluate**), and scaling developer communities as **GDG On Campus Organizer** and **Google Student Ambassador**.\n\nHow can I help you today? You can type or tap the **microphone button** to ask me anything!",
            actions: [
                { label: 'Explore SQL-GPT', action: 'goToAct2' },
                { label: 'Read My Story', action: 'goToStory' },
                { label: 'View ATS Resume', action: 'openResume' }
            ]
        },
        {
            keywords: ['sql-gpt', 'sql gpt', 'agent', 'multi-agent', 'langchain', 'langgraph', 'containment'],
            voiceText: "SQL-GPT is my tri-agent architecture built on LangChain and LangGraph. Instead of trusting raw LLMs with database execution, it decouples work into a SQL Scripter, a SQL Validator with AST compilation, and a Query Explainer. This feedback loop reduced syntax errors by 92% with strict read-only containment guarantees.",
            replyText: "**SQL-GPT — Tri-Agent Containment Architecture**\n\nIn 2024, I noticed many developers hooking LLMs directly to relational databases with brittle zero-shot prompts — leading to hallucinated columns, syntax breakdowns, and unsafe execution.\n\nI built **SQL-GPT** using **LangChain & LangGraph**:\n1. **Agent 1 (SQL Scripter)**: Interprets natural language queries into preliminary SQL.\n2. **Agent 2 (Schema & AST Validator)**: Parses abstract syntax trees, validates table schemas, and compiles queries with strict read-only containment.\n3. **Agent 3 (Query Explainer)**: Formats human-readable business context and telemetry.\n\n**Key Result:** Syntax execution errors plummeted by **92%** while guaranteeing read-only safety.",
            actions: [
                { label: 'View Architecture in Act II', action: 'goToAct2' },
                { label: 'GitHub Profile', url: 'https://github.com/prateekkv1920' }
            ]
        },
        {
            keywords: ['promptly evaluate', 'evaluation', 'benchmark', 'judge', 'sentence-transformers', 'cosine similarity'],
            voiceText: "Promptly Evaluate is my quantitative benchmarking suite for LLMs. Rather than relying on intuition, it uses vector space embeddings and LLM-as-a-judge scoring to measure semantic cosine similarity against golden dataset benchmarks.",
            replyText: "**Promptly Evaluate — LLM Semantic Benchmarking Framework**\n\nRather than evaluating generative AI through intuition or vibe checks, **Promptly Evaluate** enforces rigorous empirical validation:\n- **Embedding Analysis**: Computes cosine semantic similarity using `sentence-transformers` vector embeddings.\n- **LLM-as-a-Judge**: Employs structured multi-criteria rubric evaluations (relevance, faithfulness, tone).\n- **Automated Regression Testing**: Prevents prompt drift during production deployments.",
            actions: [
                { label: 'View in Projects', action: 'goToProjects' },
                { label: 'GitHub Repository', url: 'https://github.com/prateekkv1920' }
            ]
        },
        {
            keywords: ['gdg', 'google', 'community', 'mentor', 'ambassador', 'leadership', 'mlsa', 'nexus of nerds'],
            voiceText: "Community leadership is about multiplying impact. As GDGoC Organizer at IIMT University and Google Student Ambassador, I've mobilized over 500 developers and trained more than 100 students in Gemini API integrations. As former MLSA Chapter Lead, I conducted over 15 workshops on Microsoft Azure.",
            replyText: "**Community Leadership & Developer Mobilization**\n\nTrue engineering isn't isolated behind screens; it's about elevating your peers:\n- **GDG On Campus Organizer (IIMT University)**: Built and directed student developer chapters; trained **100+ students** in Google Gemini API integrations and agentic prototyping.\n- **Google Student Ambassador**: Represented campus engineering cohorts and bridged Google developer technologies to student innovators.\n- **MLSA Former Chapter Lead**: Directed 10+ campus initiatives and **15+ workshops on Microsoft Azure**, boosting technical engagement by 30% for 200+ students.\n- **Nexus Of Nerds**: Delivered **20+ technical talks** on AI/ML and predictive analytics.",
            actions: [
                { label: 'View Community Chronicle (Act III)', action: 'goToAct3' },
                { label: 'Connect on LinkedIn', url: 'https://www.linkedin.com/in/prateek-kv-613822281/' }
            ]
        },
        {
            keywords: ['tedx', 'break the flow', 'hackathon', 'sih', 'smart india hackathon', 'gssoc'],
            voiceText: "As Co-Organizer for TEDxIIMTUniversity under the theme Break The Flow, I managed cross-functional operations and technical hospitality for national thought leaders with zero downtime. I was also Team Lead for Smart India Hackathon for two consecutive editions.",
            replyText: "**The Crucible: High-Stakes Prototyping & Live Conferences**\n\n- **TEDxIIMTUniversity Co-Organizer (Theme: *Break The Flow*)**: Managed live stage pipelines, speaker hospitality, and audiovisual operations for national thought leaders with **zero operational downtime**. Verified on [TED.com](https://www.ted.com/profiles/50187164).\n- **Smart India Hackathon Team Lead (2x Consecutive Nominations)**: Led 6-person engineering squads across 36-hour non-stop hackathon sprints solving public administration challenges.\n- **GSSoC Data Analytics Contributor**: Preprocessed and wrangled **100,000+ noisy records** using Pandas and NumPy, delivering 5+ interactive Power BI/Tableau dashboards.",
            actions: [
                { label: 'View Crucible Chronicle (Act IV)', action: 'goToAct4' },
                { label: 'TEDx Profile', url: 'https://www.ted.com/profiles/50187164' }
            ]
        },
        {
            keywords: ['hire', 'intern', 'internship', 'summer 2026', 'summer 2027', 'why hire', 'recruiter', 'job', 'role'],
            voiceText: "I am actively seeking Summer 2026 and 2027 AI/ML Engineering and Data Science internships. I bring deep mathematical rigor in multi-agent systems and analytics, combined with battle-tested leadership from leading hackathons and TEDx conferences.",
            replyText: "**Why Bring Prateek KV to Your Engineering Team?**\n\nI graduate in **August 2027** from IIMT University and am actively seeking **Summer 2026 / 2027 AI/ML Engineering & Data Science Internships**.\n\n**Three Core Differentiators:**\n1. **Mathematical & Agentic Rigor**: I don't just wrap black-box APIs. I architect deterministic agent containment (SQL-GPT), automated LLM evaluation, and relational SQL modeling.\n2. **Proven Ownership & Grit**: Selected as SIH Team Lead twice in a row, organized TEDx with zero downtime, and handled 100K+ data wrangling pipelines.\n3. **High Communication & Mentorship**: As GDGoC Organizer and Google Ambassador, I explain complex technical concepts cleanly and bring infectious energy to every team.",
            actions: [
                { label: 'Open ATS Resume', action: 'openResume' },
                { label: 'Let\'s Connect Directly', action: 'goToContact' }
            ]
        },
        {
            keywords: ['resume', 'cv', 'curriculum vitae', 'ats', 'download resume', 'print resume'],
            voiceText: "You can view, print, or download my ATS-optimized resume directly on the site. I'll open the resume preview modal for you right now.",
            replyText: "Here is my **ATS-Parsed Executive Resume**. It highlights my core skills, multi-agent projects, leadership achievements, and contact information.\n\nYou can also export it as a clean text file or print it directly to PDF!",
            actions: [
                { label: 'Open Resume Preview', action: 'openResume' },
                { label: 'Download .TXT Resume', action: 'downloadResume' }
            ],
            autoExecute: 'openResume'
        },
        {
            keywords: ['contact', 'email', 'phone', 'reach', 'talk', 'linkedin', 'message', 'call'],
            voiceText: "You can reach me directly via email at prateekkv150706@gmail.com, or through my institutional email at prateek_bi@iimtuniversity.com. My phone and WhatsApp is +91 7837360969.",
            replyText: "**Direct Contact Coordinates for Prateek KV:**\n\n- **Personal Email**: [prateekkv150706@gmail.com](mailto:prateekkv150706@gmail.com)\n- **Institutional Email**: [prateek_bi@iimtuniversity.com](mailto:prateek_bi@iimtuniversity.com)\n- **Phone / WhatsApp**: [+91 7837360969](tel:+917837360969)\n- **LinkedIn**: [linkedin.com/in/prateek-kv-613822281](https://www.linkedin.com/in/prateek-kv-613822281/)\n- **GitHub**: [github.com/prateekkv1920 (gitGOAT)](https://github.com/prateekkv1920)\n\nFeel free to send a message using the form below!",
            actions: [
                { label: 'Open Contact Form', action: 'goToContact' },
                { label: 'Copy Email', action: 'copyEmail' }
            ]
        },
        {
            keywords: ['advice', 'learn', 'student', 'guide', 'mentor', 'how to learn', 'tips', 'study', 'roadmap'],
            voiceText: "My advice to any aspiring engineer is simple: curiosity over hype. Master foundational math, relational databases, and data structures before rushing into shiny libraries. Understand why code executes, not just how to copy an API call.",
            replyText: "**Prateek's Engineering Mentorship Playbook:**\n\n1. **Curiosity Over Hype**: Don't just paste code from tutorials. Ask yourself: *\"When code executes, why does it work — and why do we trust it?\"*\n2. **Master the Data Layer First**: Relational SQL, data cleaning, and exploratory data analysis (EDA) will give you 10x more intuition than jumping blindly into deep neural networks.\n3. **Build Deterministic Constraints**: When working with LLMs, build validation loops (AST checking, JSON schemas, cosine evaluation) so your software behaves predictably.\n4. **Speak and Lead**: Step up in your college community. Organize workshops, speak at meetups, and mentor younger students. Teaching is the ultimate test of understanding.",
            actions: [
                { label: 'Read The Story Chronicle', action: 'goToStory' },
                { label: 'Ask About SQL-GPT', query: 'Tell me about SQL-GPT' }
            ]
        },
        {
            keywords: ['skills', 'tech stack', 'python', 'tools', 'languages', 'databases', 'power bi'],
            voiceText: "My core technical stack includes Python, SQL, C++, LangChain, LangGraph, Pandas, NumPy, Scikit-Learn, Power BI, Tableau, and vector space embeddings.",
            replyText: "**Prateek KV — Core Technical Stack:**\n\n- **AI & Agentic Systems**: Multi-Agent Workflows, Tool Calling, Vector Space Embeddings (sentence-transformers), Prompt Engineering, LangChain, LangGraph, LLM-as-a-Judge Evaluation, Hugging Face.\n- **Data Analytics & Applied Statistics**: Exploratory Data Analysis (EDA), Data Wrangling, KPI Dashboards, Power BI, Tableau, SQL (PostgreSQL, MySQL, SQLite), Excel (lookups, pivots), ETL Pipelines.\n- **Languages & Frameworks**: Python (Advanced OOP, Scikit-Learn), SQL, C++, HTML5, CSS3, JavaScript.\n- **Engineering Practices**: Git/GitHub Version Control, Docker, Benchmarking, Agile Timelines.",
            actions: [
                { label: 'View Skills Matrix', action: 'goToSkills' },
                { label: 'Open ATS Resume', action: 'openResume' }
            ]
        }
    ];

    function getFallbackResponse(query) {
        return {
            voiceText: "That's an interesting question! While my knowledge base focuses on my AI systems, data analytics projects, community leadership at Google Developer Groups, and internship vision, I'd love to discuss that with you directly. You can leave me a message or check out my projects.",
            replyText: "That's an insightful question!\n\nWhile my autonomous knowledge base specializes in my **AI/ML projects (SQL-GPT, Promptly Evaluate)**, **Data Analytics**, **GDGoC Leadership**, and **Summer 2026/27 Internship plans**, I'd love to explore this with you in detail.\n\nFeel free to pick one of these areas or drop me a note directly:",
            actions: [
                { label: 'Ask About SQL-GPT', query: 'Tell me about SQL-GPT' },
                { label: 'Community Leadership', query: 'Tell me about your GDG leadership' },
                { label: 'Why Hire Prateek?', query: 'Why hire you for an AI internship?' },
                { label: 'Contact Prateek', action: 'goToContact' }
            ]
        };
    }

    function queryKnowledgeBase(rawQuery) {
        const query = rawQuery.toLowerCase().trim();
        let bestMatch = null;
        let highestScore = 0;

        for (const item of PRATEEK_KNOWLEDGE) {
            let score = 0;
            for (const kw of item.keywords) {
                if (query.includes(kw)) {
                    score += kw.length;
                }
            }
            if (score > highestScore) {
                highestScore = score;
                bestMatch = item;
            }
        }

        if (bestMatch && highestScore > 0) {
            return bestMatch;
        }
        return getFallbackResponse(query);
    }

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

    function initSpeechEngine() {
        if (!('speechSynthesis' in window)) {
            voiceEnabled = false;
            updateVoiceStatusUI();
            return;
        }

        function loadVoices() {
            const voices = window.speechSynthesis.getVoices();
            if (!voices.length) return;

            selectedVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Male') || v.name.includes('David') || v.name.includes('Daniel')) && v.lang.startsWith('en')) 
                         || voices.find(v => v.lang.startsWith('en')) 
                         || voices[0];
        }

        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
            recognition = new SpeechRec();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

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

    function speakVoice(text) {
        if (!voiceEnabled || !('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();

        const cleanText = text.replace(/[*#`_\[\]()]/g, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);

        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.rate = 1.02;
        utterance.pitch = 1.04;

        utterance.onstart = function() {
            isSpeaking = true;
            updateWaveUI(true);
        };

        utterance.onend = function() {
            isSpeaking = false;
            updateWaveUI(false);
        };

        utterance.onerror = function() {
            isSpeaking = false;
            updateWaveUI(false);
        };

        window.speechSynthesis.speak(utterance);
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
            showToast(voiceEnabled ? '🔊 AI Voice Audio: Enabled' : '🔇 AI Voice Audio: Muted');
        }
    }

    function toggleMic() {
        if (!recognition) {
            if (typeof showToast === 'function') {
                showToast('Speech recognition not supported in this browser. Please type your query!');
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

    function appendMessage(sender, htmlContent, actions) {
        const container = document.getElementById('aiChatMessages');
        if (!container) return;

        const row = document.createElement('div');
        row.className = 'ai-msg-row ' + (sender === 'user' ? 'user-msg-row' : 'bot-msg-row');

        let avatarHTML = '';
        if (sender === 'bot') {
            avatarHTML = '<div class="ai-msg-avatar"><img src="profile.jpg?v=new-profile-2" alt="Prateek AI"></div>';
        }

        let actionsHTML = '';
        if (actions && actions.length) {
            actionsHTML = '<div class="ai-msg-actions">';
            actions.forEach(a => {
                if (a.query) {
                    actionsHTML += '<button class="ai-action-chip" onclick="window.sendAiQuery(\'' + escapeHTML(a.query) + '\')">' + escapeHTML(a.label) + '</button>';
                } else if (a.action) {
                    actionsHTML += '<button class="ai-action-chip primary-chip" onclick="window.triggerAiAction(\'' + escapeHTML(a.action) + '\')">' + escapeHTML(a.label) + '</button>';
                } else if (a.url) {
                    actionsHTML += '<a href="' + a.url + '" target="_blank" rel="noopener noreferrer" class="ai-action-chip link-chip"><i class="fas fa-external-link-alt"></i> ' + escapeHTML(a.label) + '</a>';
                }
            });
            actionsHTML += '</div>';
        }

        row.innerHTML = avatarHTML + '<div class="ai-msg-bubble"><div class="ai-msg-text">' + htmlContent + '</div>' + actionsHTML + '</div>';

        container.appendChild(row);
        container.scrollTop = container.scrollHeight;
    }

    function handleUserSubmit(query) {
        if (!query || !query.trim()) return;
        const text = query.trim();

        appendMessage('user', escapeHTML(text));

        const inputEl = document.getElementById('aiChatInput');
        if (inputEl) inputEl.value = '';

        const container = document.getElementById('aiChatMessages');
        const typingEl = document.createElement('div');
        typingEl.className = 'ai-typing-indicator';
        typingEl.id = 'aiTypingIndicator';
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(typingEl);
        container.scrollTop = container.scrollHeight;

        setTimeout(() => {
            const indicator = document.getElementById('aiTypingIndicator');
            if (indicator) indicator.remove();

            const response = queryKnowledgeBase(text);
            const formattedHTML = formatMarkdown(response.replyText);

            appendMessage('bot', formattedHTML, response.actions || []);

            if (response.voiceText) {
                speakVoice(response.voiceText);
            }

            if (response.autoExecute) {
                setTimeout(() => triggerAiAction(response.autoExecute), 800);
            }
        }, 450);
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
                console.log('Unknown AI action:', actionName);
        }
    }

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
