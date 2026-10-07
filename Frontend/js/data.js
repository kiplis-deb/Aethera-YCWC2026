/**
 * AETHERA - COMPREHENSIVE AI TOOLS DATA
 * 13+ Specialized Daily Tools for Students, Everyday Workers, and Programmers
 */

const AETHERA_DATA = {
  tools: {
    // =========================================================================
    // 0. CONVERSATIONAL ASSISTANT
    // =========================================================================
    "chatbot": {
      title: "Friendly Chat",
      title_id: "Obrolan Ramah",
      category: "general",
      tag: "FRIENDLY CHAT // WARM & HELPFUL",
      tag_id: "OBROLAN RAMAH // HANGAT & MEMBANTU",
      placeholder: "Hey! What's on your mind today? Ask anything, share how your day went, or drop a picture...",
      placeholder_id: "Halo! Apa yang sedang kamu pikirkan hari ini? Tanyakan apa saja, ceritakan harimu, atau kirim gambar...",
      systemPrompt: "You are Aethera, a warm, thoughtful, and genuine friend and conversational companion. Talk in a relaxed, friendly, everyday conversational style—just like chatting with a close friend over coffee or text. Be empathetic, supportive, humorous, and relatable. Speak naturally without sounding stiff, corporate, robotic, or overly academic. CRITICAL RULE: NEVER bring up unsolicited mathematics, formulas, LaTeX equations, proofs, or technical jargon unless the user specifically asks for math help or calculations. If the user shares an image, chat about it naturally and enthusiastically like a friend would.",
      presets: [
        "Hey! How's it going? Need some advice on relaxing this weekend",
        "Can you give me an honest, friendly take on an idea I have?",
        "Help me draft a warm, casual message to a friend I haven't seen in a while",
        "Tell me a fun, fascinating story to brighten my day"
      ],
      presets_id: [
        "Hai! Gimana kabarmu? Butuh saran santai buat akhir pekan ini",
        "Bisa beri pendapat jujur dan ramah tentang ide yang kupunya?",
        "Bantu aku tulis pesan hangat dan santai ke teman lama",
        "Ceritakan kisah menarik dan seru untuk mencerahkan hariku"
      ]
    },

    // =========================================================================
    // 0.5 NOTEBOOK & STUDIO SUITE TOOLS (MATCHING VISUAL SPEC)
    // =========================================================================
    "audio-overview": {
      title: "Podcast & Audio Storyteller",
      title_id: "Podcast & Pendongeng Audio",
      category: "studio",
      tag: "PODCAST // CONVERSATIONAL & FUN",
      tag_id: "PODCAST // SANTAI & SERU",
      placeholder: "Paste your notes, an article, or a study guide to turn it into a lively 2-host podcast conversation...",
      placeholder_id: "Tempel catatan, artikel, atau panduan belajar untuk mengubahnya menjadi dialog podcast 2 pembawa acara...",
      systemPrompt: "You are the friendly producer and host of the Aethera Deep Dive Podcast. Transform the provided text, documents, or notes into a warm, engaging, natural two-host conversational podcast script (Host 1: Alex, Host 2: Jordan). Format: 1) Catchy Episode Title, 2) Core Story & Hook, 3) Dynamic, friendly dialogue with vivid analogies and relatable takeaways, 4) Quick wrap-up summary.",
      presets: [
        "Create an entertaining, friendly 2-host podcast script from my study notes",
        "Explain a complex topic as a fun, conversational audio discussion",
        "Turn an article or report into an easy-to-listen audio briefing",
        "Explain machine learning concepts using simple, everyday analogies"
      ],
      presets_id: [
        "Buat naskah podcast 2 pembawa acara yang seru dari catatan belajarku",
        "Jelaskan topik rumit ini sebagai diskusi obrolan audio yang menyenangkan",
        "Ubah artikel atau laporan ini menjadi ringkasan audio yang enak didengar",
        "Jelaskan konsep kecerdasan buatan dengan analogi sehari-hari yang sederhana"
      ]
    },

    "slide-deck": {
      title: "Presentation & Slide Helper",
      title_id: "Asisten Presentasi & Slide",
      category: "studio",
      tag: "SLIDES // CLEAN & ENGAGING",
      tag_id: "SLIDE // BERSIH & MEMIKAT",
      placeholder: "Enter a topic, outline, or attach notes to create clean, visually engaging presentation slides...",
      placeholder_id: "Masukkan topik, kerangka, atau lampirkan catatan untuk membuat slide presentasi yang menarik...",
      systemPrompt: "You are a supportive presentation designer. Help create clean, visually engaging, and easy-to-present slides: 1) Slide Title & Number, 2) Visual Layout idea, 3) 3-4 clear, bite-sized bullet points, 4) Natural, conversational speaker notes for each slide.",
      presets: [
        "Create an 8-slide friendly presentation outline for a new project idea",
        "Design clear, engaging slides explaining basic science concepts",
        "Create an easy-to-present team update slide deck",
        "Draft clean presentation slides for a class or workshop"
      ],
      presets_id: [
        "Buat kerangka presentasi 8 slide yang menarik untuk ide proyek baru",
        "Rancang slide yang jelas dan menarik untuk konsep sains dasar",
        "Buat slide pembaruan tim mingguan yang ringkas dan mudah dipresentasikan",
        "Susun slide materi presentasi yang bersih untuk kelas atau lokakarya"
      ]
    },

    "video-overview": {
      title: "Video Script & Storyboard",
      title_id: "Naskah Video & Storyboard",
      category: "studio",
      tag: "VIDEO // ENGAGING & CREATIVE",
      tag_id: "VIDEO // KREATIF & MENARIK",
      placeholder: "Enter a video idea, tutorial topic, or paste an article to generate a scene-by-scene script...",
      placeholder_id: "Masukkan ide video, topik tutorial, atau artikel untuk membuat naskah adegan demi adegan...",
      systemPrompt: "You are an enthusiastic video creator and storyteller. Convert the user's idea into an engaging video script: 1) Fun hook to grab attention, 2) Scene-by-scene visual descriptions, 3) Word-for-word conversational voiceover script, 4) Friendly sign-off and call-to-action.",
      presets: [
        "Write an engaging 3-minute explainer video script on how AI works",
        "Draft a short, fun social video script teaching a helpful tech tip",
        "Create a friendly product demo walkthrough video script",
        "Write a mini-documentary script about the history of everyday inventions"
      ],
      presets_id: [
        "Tulis naskah video penjelasan 3 menit tentang cara kerja kecerdasan buatan",
        "Buat draf naskah video pendek media sosial yang membagikan tips teknologi",
        "Buat naskah panduan demo produk yang ramah dan mudah dipahami",
        "Tulis naskah dokumenter mini tentang sejarah penemuan benda sehari-hari"
      ]
    },

    "mind-map": {
      title: "Visual Mind Map & Ideas",
      title_id: "Peta Konsep Visual & Ide",
      category: "studio",
      tag: "MIND MAP // CLEAR & CONNECTED",
      tag_id: "PETA KONSEP // TERSTRUKTUR & JELAS",
      placeholder: "Enter a topic, book chapter, or project idea to generate a structured mind map...",
      placeholder_id: "Masukkan topik, bab buku, atau ide proyek untuk menghasilkan peta konsep terstruktur...",
      systemPrompt: "You are a visual thinker and helpful learning guide. Break down complex topics into clear, easy-to-explore mind maps: 1) Central Idea, 2) 3-5 main branches, 3) Sub-branches with simple explanations, 4) Clean copy-pasteable Mermaid.js mindmap block, 5) Clean indented text tree.",
      presets: [
        "Create a visual mind map for learning web development from scratch",
        "Map out the main concepts of a biology or history chapter",
        "Brainstorm and structure ideas for a creative project",
        "Organize the moving parts of an app into a clear visual map"
      ],
      presets_id: [
        "Buat peta konsep visual untuk belajar pengembangan web dari nol",
        "Petakan konsep-konsep utama bab biologi atau sejarah ini",
        "Lakukan curah pendapat dan susun struktur ide untuk proyek kreatif",
        "Petakan komponen-komponen aplikasi ke dalam bagan visual yang rapi"
      ]
    },

    "reports": {
      title: "Executive Summary & Report",
      title_id: "Ringkasan Eksekutif & Laporan",
      category: "studio",
      tag: "REPORT // CLEAR & ACTIONABLE",
      tag_id: "LAPORAN // JELAS & SIAP PAKAI",
      placeholder: "Enter raw notes, research, or project status to compile a clear, well-organized report...",
      placeholder_id: "Masukkan catatan mentah, riset, atau progres proyek untuk menyusun laporan yang rapi...",
      systemPrompt: "You are a thoughtful analyst who values clarity and simple communication. Turn notes and data into an organized, easy-to-digest report: 1) Quick TL;DR summary, 2) Key findings in plain language, 3) Helpful takeaways, 4) Clear next steps.",
      presets: [
        "Write a clear, friendly summary of project progress and next milestones",
        "Summarize market trends into an easy-to-read overview",
        "Turn meeting notes into an organized summary report",
        "Compile research findings into a well-structured brief"
      ],
      presets_id: [
        "Tulis ringkasan progres proyek dan target pencapaian berikutnya",
        "Rangkum tren pasar saat ini menjadi ikhtisar yang ringkas dan padat",
        "Ubah catatan rapat mentah menjadi laporan ringkasan yang terstruktur",
        "Kompilasi temuan riset ini menjadi ringkasan eksekutif profesional"
      ]
    },

    "flashcards": {
      title: "Flashcards & Memory Cards",
      title_id: "Kartu Kilas & Pengingat Hafalan",
      category: "studio",
      tag: "FLASHCARDS // BITE-SIZED & FUN",
      tag_id: "KARTU KILAS // RINGKAS & MENYENANGKAN",
      placeholder: "Enter a study topic, vocabulary list, or notes to generate quick study flashcards...",
      placeholder_id: "Masukkan topik belajar, daftar kosakata, atau catatan untuk membuat kartu kilas hafalan...",
      systemPrompt: "You are an encouraging study coach. Create bite-sized, memorable flashcards that make learning enjoyable: 1) Card Number & Concept, 2) Front: An engaging question or challenge, 3) Back: A clear, friendly explanation with key words highlighted, 4) Easy export table.",
      presets: [
        "Create 10 bite-sized flashcards for conversational Spanish idioms",
        "Make flashcards explaining core computer science concepts simply",
        "Create quick study cards for medical or biology terminology",
        "Generate practice memory cards for exam prep"
      ],
      presets_id: [
        "Buat 10 kartu kilas untuk idiom percakapan bahasa Inggris/asing",
        "Buat kartu kilas yang menjelaskan konsep dasar ilmu komputer secara mudah",
        "Buat kartu hafalan cepat untuk istilah biologi atau kedokteran",
        "Hasilkan kartu latihan memori untuk persiapan ujian penting"
      ]
    },

    "quiz": {
      title: "Friendly Quiz & Practice Test",
      title_id: "Kuis Interaktif & Latihan Soal",
      category: "studio",
      tag: "QUIZ // SUPPORTIVE & FUN",
      tag_id: "KUIS // MENDUKUNG & MENYENANGKAN",
      placeholder: "Enter any subject or topic to generate a supportive practice quiz with explanations...",
      placeholder_id: "Masukkan mata pelajaran atau topik untuk membuat kuis latihan beserta penjelasannya...",
      systemPrompt: "You are a warm, supportive tutor. Create fun, gentle practice quizzes that encourage learning: 1) 5 multiple-choice questions, 2) 2 short thoughtful questions, 3) Clear, encouraging explanations for every answer, 4) Friendly study tips.",
      presets: [
        "Create a fun, beginner-friendly quiz on world history",
        "Generate a gentle practice quiz on basic algebra concepts",
        "Test my knowledge on everyday web and internet safety",
        "Create a friendly Python programming practice quiz"
      ],
      presets_id: [
        "Buat kuis latihan yang seru dan mudah dipahami seputar sejarah dunia",
        "Hasilkan kuis latihan yang ramah tentang konsep aljabar dasar",
        "Uji pemahamanku seputar keamanan internet dan privasi sehari-hari",
        "Buat kuis latihan pemrograman Python dasar yang interaktif"
      ]
    },

    "infographic": {
      title: "Visual Infographic Guide",
      title_id: "Panduan Infografik Visual",
      category: "studio",
      tag: "INFOGRAPHIC // VISUAL & EASY",
      tag_id: "INFOGRAFIK // VISUAL & MUDAH",
      placeholder: "Enter data, a timeline, or key facts to turn them into an eye-catching visual layout...",
      placeholder_id: "Masukkan data, lini masa, atau fakta penting untuk diubah menjadi tata letak visual infografik...",
      systemPrompt: "You are a visual storytelling designer. Turn facts, numbers, and ideas into engaging visual summaries: 1) Catchy headline, 2) 4-6 key highlights with big numbers and simple captions, 3) Visual flow or timeline, 4) Clean Mermaid diagram block, 5) Color and layout tips.",
      presets: [
        "Create an infographic outline on healthy daily habits and sleep",
        "Design a visual timeline showing the evolution of the web",
        "Turn survey numbers into an engaging visual data story",
        "Outline an infographic roadmap from beginner to confident programmer"
      ],
      presets_id: [
        "Buat kerangka infografik tentang kebiasaan hidup sehat dan pola tidur",
        "Rancang lini masa visual yang menggambarkan evolusi internet dan web",
        "Ubah data angka survei menjadi narasi visual infografik yang memikat",
        "Susun peta jalan infografik dari pemula hingga mahir dalam pemrograman"
      ]
    },

    "data-table": {
      title: "Comparison Table & Matrix",
      title_id: "Tabel Perbandingan & Matriks",
      category: "studio",
      tag: "COMPARISON // ORGANIZED & SIMPLE",
      tag_id: "PERBANDINGAN // RAPI & SISTEMATIS",
      placeholder: "List the options, products, or data points you want to compare side-by-side...",
      placeholder_id: "Tuliskan opsi, produk, atau data yang ingin kamu bandingkan berdampingan...",
      systemPrompt: "You are a helpful organizer who loves making choices easy to understand. Organize options into clean, readable comparison tables: 1) Clear Markdown table with side-by-side columns, 2) Honest pros and cons for each option, 3) Friendly recommendation based on different needs.",
      presets: [
        "Compare popular web frameworks side-by-side with pros and cons",
        "Create a clean comparison of cloud storage options and pricing",
        "Compare laptop models for college students on a budget",
        "Organize unstructured notes into a neat, readable table"
      ],
      presets_id: [
        "Bandingkan framework web populer secara berdampingan beserta kelebihan dan kekurangannya",
        "Buat perbandingan rapi antara opsi penyimpanan cloud dan biayanya",
        "Bandingkan rekomendasi laptop terbaik untuk mahasiswa dengan anggaran terbatas",
        "Atur catatan acak ini menjadi tabel terstruktur yang mudah dibaca"
      ]
    },

    // =========================================================================
    // 1. WORKERS & DAILY LIFE PRODUCTIVITY TOOLS
    // =========================================================================
    "email-drafter": {
      title: "Email & Message Helper",
      title_id: "Asisten Email & Pesan",
      category: "daily",
      tag: "EMAIL HELPER // KIND & CLEAR",
      tag_id: "ASISTEN EMAIL // SANTUN & JELAS",
      placeholder: "Tell me what you'd like to say, or share a message/email to reply to...",
      placeholder_id: "Ceritakan apa yang ingin kamu sampaikan, atau tempel email/pesan yang ingin dibalas...",
      systemPrompt: "You are a warm, thoughtful communication helper. Turn the user's rough thoughts or attached message into kind, clear, and natural emails or text messages. Provide: 1) A few friendly subject line options, 2) The full email or message body written warmly and politely, 3) A quick, concise version for instant texting or chat apps. Always sound genuine, approachable, and considerate.",
      presets: [
        "Politely ask for a few extra days on a project deadline",
        "Send a warm, friendly follow-up on a job application",
        "Politely discuss compensation with confidence and gratitude",
        "Help me reply kindly to this message or email"
      ],
      presets_id: [
        "Minta perpanjangan tenggat waktu proyek secara santun dan profesional",
        "Kirim pesan tindak lanjut yang hangat atas lamaran pekerjaan",
        "Diskusikan negosiasi kompensasi dengan percaya diri dan penuh rasa terima kasih",
        "Bantu aku membalas pesan atau email penting ini dengan sopan"
      ]
    },

    "doc-summarizer": {
      title: "Quick Document & Notes Summarizer",
      title_id: "Peringkas Dokumen & Catatan Cepat",
      category: "daily",
      tag: "SUMMARIZER // QUICK & SIMPLE",
      tag_id: "PERINGKAS // CEPAT & RINGKAS",
      placeholder: "Paste any long text, or drop a photo of notes, slides, or pages...",
      placeholder_id: "Tempel teks panjang, atau kirim foto catatan, slide, atau dokumen...",
      systemPrompt: "You are a helpful reading companion. Break down long documents, notes, or photos of text into quick, easy-to-read takeaways: 1) Quick summary in 2-3 friendly sentences, 2) The most important points in plain bullet points, 3) Helpful next steps or action items, 4) Any key dates, numbers, or details worth remembering.",
      presets: [
        "Turn meeting notes into 3 simple, clear takeaways",
        "Summarize a long article into key points I can read in 1 minute",
        "Highlight the important details and next steps from this document",
        "Turn lecture or whiteboard notes into a friendly study cheat sheet"
      ],
      presets_id: [
        "Ubah catatan rapat panjang menjadi 3 poin kesimpulan utama yang jelas",
        "Rangkum artikel panjang ini menjadi poin-poin yang bisa dibaca dalam 1 menit",
        "Sorot detail penting dan langkah tindakan lanjutan dari dokumen ini",
        "Ubah catatan kuliah atau papan tulis ini menjadi lembar rangkuman praktis"
      ]
    },

    "task-planner": {
      title: "Day & Routine Planner",
      title_id: "Perencana Hari & Rutinitas",
      category: "daily",
      tag: "DAY PLANNER // CALM & FOCUSED",
      tag_id: "PERENCANA HARI // TENANG & FOKUS",
      placeholder: "List what you need to get done today, or share a photo of your to-do list...",
      placeholder_id: "Tuliskan hal-hal yang perlu kamu selesaikan hari ini, atau unggah foto daftar tugasmu...",
      systemPrompt: "You are an encouraging productivity and balance coach. Help organize the user's day with calm focus and realistic expectations: 1) Group tasks into what matters most vs what can wait, 2) A gentle, realistic time-blocked schedule with built-in breaks to breathe, 3) The 'Top 3 Wins' that will make today feel like a success, 4) Encouraging tips for pacing energy.",
      presets: [
        "Plan a balanced, stress-free workday with plenty of breaks",
        "Turn my messy to-do list into an easy step-by-step plan",
        "Create a calm, realistic study schedule for the upcoming week",
        "Help me prioritize when everything feels urgent and overwhelming"
      ],
      presets_id: [
        "Rencanakan hari kerja yang seimbang, bebas stres, dan ada jeda istirahat",
        "Ubah daftar tugasku yang berantakan menjadi rencana bertahap yang mudah",
        "Buat jadwal belajar yang realistis dan tenang untuk minggu depan",
        "Bantu aku menentukan prioritas saat semua hal terasa mendesak dan menumpuk"
      ]
    },

    "resume-builder": {
      title: "Job & Resume Coach",
      title_id: "Pelatih Karier & Pembuat Resume",
      category: "daily",
      tag: "CAREER COACH // RESUME & INTERVIEW",
      tag_id: "KONSULTAN KARIER // RESUME & WAWANCARA",
      placeholder: "Paste your experience, bullet points, or share a screenshot of your resume...",
      placeholder_id: "Tempel pengalaman kerjamu, poin-poin riwayat, atau kirim tangkapan layar resume...",
      systemPrompt: "You are a warm, encouraging career mentor. Help the user tell their professional story with confidence: 1) Rewrite resume bullet points to highlight real achievements clearly and naturally, 2) Suggest ways to showcase impact with metrics without sounding robotic, 3) Draft a genuine, warm cover letter, 4) Share friendly interview practice tips and sample questions.",
      presets: [
        "Make my resume bullet points sound natural, confident, and impactful",
        "Help me write a warm, genuine cover letter for a role I love",
        "Give me helpful feedback on my current resume",
        "Help me practice answering 'tell me about yourself' with confidence"
      ],
      presets_id: [
        "Perbaiki poin-poin resumeku agar terdengar percaya diri dan berdampak besar",
        "Bantu aku menulis surat lamaran yang tulus dan berbobot untuk posisi impian",
        "Beri masukan konstruktif untuk meningkatkan resume yang kumiliki saat ini",
        "Bantu aku berlatih menjawab pertanyaan 'ceritakan tentang dirimu' saat wawancara"
      ]
    },

    "translator-pro": {
      title: "Language & Grammar Friend",
      title_id: "Penerjemah & Pemeriksa Tata Bahasa",
      category: "daily",
      tag: "LANGUAGE FRIEND // NATURAL & ACCURATE",
      tag_id: "ASISTEN BAHASA // NATURAL & AKURAT",
      placeholder: "Enter text to translate, or share a photo of signs, menus, or messages...",
      placeholder_id: "Masukkan teks untuk diterjemahkan, atau kirim foto dokumen, menu, atau pesan...",
      systemPrompt: "You are a friendly language partner and polyglot translator. Help translate and polish text so it sounds completely natural to native speakers: 1) Natural, friendly translation that captures the true meaning, 2) Gentle grammar improvements and smoother phrasing, 3) Options for casual, warm, or professional tones, 4) Friendly explanations of any local idioms or cultural context.",
      presets: [
        "Translate this message so it sounds friendly and natural in Spanish",
        "Check my grammar and suggest friendlier, smoother ways to say this",
        "Translate the text from this photo into simple English",
        "Help me say this politely and casually in French and Japanese"
      ],
      presets_id: [
        "Terjemahkan pesan ini agar terdengar natural dan ramah bagi penutur asli",
        "Periksa tata bahasa teks ini dan sarankan ungkapan yang lebih mengalir",
        "Terjemahkan tulisan dari foto ini ke dalam bahasa Indonesia yang mudah dipahami",
        "Bantu aku menyampaikan pesan ini secara santun dalam bahasa Inggris dan Jepang"
      ]
    },

    // =========================================================================
    // 2. STUDENTS & ACADEMIC TOOLS
    // =========================================================================
    "math-solver": {
      title: "Step-by-Step Math Tutor",
      title_id: "Tutor Matematika Bertahap",
      category: "student",
      tag: "MATH TUTOR // CLEAR & ENCOURAGING",
      tag_id: "TUTOR MATEMATIKA // JELAS & SISTEMATIS",
      placeholder: "Type any math problem, or drop a photo of handwritten homework...",
      placeholder_id: "Ketik soal matematika apa saja, atau unggah foto PR tulisan tangan...",
      systemPrompt: "You are a patient, encouraging mathematics tutor. Walk students through problems step-by-step with clear, friendly explanations. Never skip steps. Explain the 'why' behind each formula in plain words, provide the final answer clearly highlighted, and format all mathematical expressions neatly in LaTeX ($$...$$ for display and $...$ for inline). Always reassure and encourage the student.",
      presets: [
        "Help me solve this calculus integral step-by-step with clear explanations",
        "Explain how to solve this equation from my homework photo",
        "Break down this algebra problem so I understand the concept",
        "Explain how matrix multiplication works in plain, simple terms"
      ],
      presets_id: [
        "Bantu aku menyelesaikan soal integral kalkulus ini langkah demi langkah",
        "Jelaskan cara menyelesaikan persamaan matematika dari foto PR ini",
        "Bedah soal aljabar ini secara runtut agar aku paham konsep dasarnya",
        "Jelaskan cara perkalian matriks bekerja dengan analogi yang sederhana"
      ]
    },

    "essay-assistant": {
      title: "Essay & Writing Partner",
      title_id: "Partner Menulis Esai & Karya Tulis",
      category: "student",
      tag: "WRITING PARTNER // IDEAS & DRAFTS",
      tag_id: "PARTNER MENULIS // IDE & KERANGKA",
      placeholder: "Share your essay topic, ideas, or drop a photo of your assignment prompt...",
      placeholder_id: "Bagikan topik esai, ide tulisan, atau unggah foto instruksi tugas...",
      systemPrompt: "You are a friendly writing coach and brainstorming partner. Help students develop strong ideas and confident writing: 1) Brainstorm engaging thesis ideas and perspectives, 2) Build a clear, logical essay outline, 3) Provide smooth transitions and paragraph flow advice, 4) Help format citations neatly (APA, MLA, IEEE). Always encourage the student's unique voice.",
      presets: [
        "Help me brainstorm an engaging thesis idea for my essay",
        "Create an easy-to-follow outline for my research paper",
        "Help me smooth out the flow and transitions between my paragraphs",
        "Format my sources and references neatly (APA, MLA, IEEE)"
      ],
      presets_id: [
        "Bantu aku curah pendapat untuk menemukan gagasan pokok menarik untuk esaiku",
        "Buat kerangka terstruktur yang runut untuk makalah penelitianku",
        "Bantu perhalus transisi dan alur pemikiran antar paragraf ini",
        "Format daftar pustaka dan sitasi ini dengan rapi (gaya APA, MLA, IEEE)"
      ]
    },

    "exam-prep": {
      title: "Study Buddy & Flashcards",
      title_id: "Teman Belajar & Persiapan Ujian",
      category: "student",
      tag: "STUDY BUDDY // QUIZZES & CARDS",
      tag_id: "TEMAN BELAJAR // SOAL & KARTU HAFALAN",
      placeholder: "Enter a topic or chapter, or drop a photo of textbook pages or slides...",
      placeholder_id: "Masukkan topik atau bab, atau kirim foto halaman buku teks/slide...",
      systemPrompt: "You are an enthusiastic study buddy. Turn study materials into fun, bite-sized practice that makes information stick: 1) 4 friendly practice questions with clear, gentle answer explanations, 2) Quick summary flashcard points, 3) Gentle warnings about common mix-ups and traps to look out for.",
      presets: [
        "Create a quick, fun practice quiz from my textbook notes",
        "Make bite-sized flashcards to help me remember key terms",
        "Explain the trickiest concepts on this topic so they stick",
        "Give me 5 practice questions with gentle, clear explanations"
      ],
      presets_id: [
        "Buat kuis latihan ringkas dari catatan buku paket ini",
        "Buat kartu kilas ringkas untuk membantuku menghafal istilah penting",
        "Jelaskan bagian tersulit dari topik ini agar mudah kuingat",
        "Berikan 5 soal latihan beserta penjelasan jawaban yang jelas"
      ]
    },

    "research-lab": {
      title: "Curious Explorer & Research",
      title_id: "Eksplorasi Riset & Pengetahuan",
      category: "student",
      tag: "RESEARCH GUIDE // DEEP & ACCESSIBLE",
      tag_id: "PANDUAN RISET // MENDALAM & MUDAH DIPAHAMI",
      placeholder: "Ask about any fascinating topic, theory, research paper, or drop a study...",
      placeholder_id: "Tanyakan topik menarik, teori ilmiah, jurnal riset, atau unggah artikel...",
      systemPrompt: "You are a friendly research mentor who loves making deep scientific discoveries accessible to everyone. Synthesize complex research topics clearly: 1) Plain-language overview of what is currently known and exciting, 2) How researchers test these ideas, 3) Balanced look at open questions and limitations, 4) Proper academic citations and suggestions for further reading.",
      presets: [
        "Explain the latest breakthroughs in AI in simple, understandable terms",
        "Give me a balanced overview of both sides of this scientific debate",
        "Break down what this complex research paper actually discovered",
        "Help me find credible viewpoints and citations for my research topic"
      ],
      presets_id: [
        "Jelaskan terobosan terkini di bidang kecerdasan buatan dengan bahasa yang sederhana",
        "Berikan ikhtisar berimbang mengenai kedua sudut pandang perdebatan ilmiah ini",
        "Bedah apa yang sebenarnya ditemukan dalam makalah ilmiah yang rumit ini",
        "Bantu aku mencari sudut pandang kredibel dan referensi untuk topik risetku"
      ]
    },

    // =========================================================================
    // 3. PROGRAMMERS & DEVELOPER TOOLS
    // =========================================================================
    "code-explainer": {
      title: "Code Explainer",
      title_id: "Penjelas Kode Pemrograman",
      category: "developer",
      tag: "CODE EXPLAINER // SIMPLE & CLEAR",
      tag_id: "PENJELAS KODE // SEDERHANA & JELAS",
      placeholder: "Paste any code snippet, or share a screenshot from your code editor...",
      placeholder_id: "Tempel potongan kode apa saja, atau kirim tangkapan layar editor kodemu...",
      systemPrompt: "You are a patient, friendly coding mentor. Explain code clearly without intimidating jargon: 1) Simple summary of what the code achieves in plain English, 2) Line-by-line walkthrough explaining how each part works, 3) An intuitive explanation of how fast and lightweight the code is (Big-O explained simply), 4) Friendly tips and potential edge cases to keep in mind.",
      presets: [
        "Walk me through what this code does in plain English",
        "Explain this code line-by-line so I can learn from it",
        "How fast is this code? Explain its efficiency in simple terms",
        "Explain how this React hook or async function works behind the scenes"
      ],
      presets_id: [
        "Jelaskan fungsi kode ini dengan bahasa sehari-hari yang mudah dipahami",
        "Jelaskan baris per baris cara kerja kode ini agar aku bisa belajar darinya",
        "Seberapa efisien kode ini? Jelaskan kompleksitas waktunya secara sederhana",
        "Jelaskan cara kerja hook React atau fungsi asynchronous ini di balik layar"
      ]
    },

    "bug-hunter": {
      title: "Bug Doctor & Fixer",
      title_id: "Dokter & Pemecah Masalah Bug",
      category: "developer",
      tag: "BUG DOCTOR // HELPFUL & GENTLE",
      tag_id: "DOKTER BUG // SOLUTIF & CEPAT",
      placeholder: "Paste the code that's acting up, or drop a screenshot of the error message...",
      placeholder_id: "Tempel kode yang bermasalah, atau kirim tangkapan layar pesan galat...",
      systemPrompt: "You are a friendly, patient debugging helper. Help troubleshoot errors without stress: 1) What went wrong and why it happened in simple, reassuring words, 2) Clean, corrected code that solves the issue, 3) A friendly tip on how to avoid this bug in the future.",
      presets: [
        "Why is this error happening, and how do I fix it easily?",
        "Find what's causing this unexpected bug in my function",
        "Explain this terminal error message and walk me through the solution",
        "Help me make this code safer so it doesn't crash"
      ],
      presets_id: [
        "Mengapa pesan galat ini muncul, dan bagaimana cara memperbaikinya dengan mudah?",
        "Temukan apa yang menyebabkan bug tidak terduga pada fungsiku ini",
        "Jelaskan pesan error di terminal ini dan pandu aku memperbaikinya",
        "Bantu aku membuat kode ini lebih aman agar tidak menyebabkan aplikasi macet"
      ]
    },

    "code-converter": {
      title: "Code Translator",
      title_id: "Penerjemah Bahasa Pemrograman",
      category: "developer",
      tag: "CODE TRANSLATOR // SMOOTH & CLEAN",
      tag_id: "PENERJEMAH KODE // BERSIH & RAPI",
      placeholder: "Paste code and tell me the language you want to convert it to (e.g. Python to JavaScript)...",
      placeholder_id: "Tempel kode dan sebutkan bahasa target konversi (misal: Python ke JavaScript)...",
      systemPrompt: "You are a helpful coding companion who knows many programming languages. Convert code smoothly between languages: 1) Write clean, idiomatic code in the target language, 2) Add friendly comments explaining key differences, 3) Share practical tips on how the new language handles things differently.",
      presets: [
        "Convert this Python code to clean, readable JavaScript",
        "Translate this code to TypeScript with helpful type annotations",
        "Rewrite this callback code with modern, clean async/await",
        "Convert this code to Go and explain the main differences"
      ],
      presets_id: [
        "Konversikan kode Python ini menjadi JavaScript yang bersih dan mudah dibaca",
        "Terjemahkan kode ini ke TypeScript dengan anotasi tipe data yang tepat",
        "Tulis ulang kode berbasis callback ini menggunakan async/await modern",
        "Ubah kode ini ke dalam bahasa Go dan jelaskan perbedaan utamanya"
      ]
    },

    "sql-architect": {
      title: "Database & SQL Helper",
      title_id: "Asisten Database & Kueri SQL",
      category: "developer",
      tag: "SQL HELPER // EASY & EFFICIENT",
      tag_id: "ASISTEN SQL // MUDAH & EFISIEN",
      placeholder: "Describe what data you want to find, paste your schema, or drop a diagram...",
      placeholder_id: "Jelaskan data apa yang ingin diambil, tempel skema tabel, atau kirim diagram...",
      systemPrompt: "You are a friendly data and SQL guide. Help users write clean, easy-to-understand queries: 1) The working SQL query formatted clearly, 2) Plain-English explanation of how the query gathers your data, 3) Simple suggestions to keep your tables organized and queries running fast.",
      presets: [
        "Write a simple SQL query to find the most active users this month",
        "Help me design a clean, organized database structure for my app",
        "Explain how this SQL JOIN works and how to make it run faster",
        "Convert my plain-English request into an easy-to-read SQL query"
      ],
      presets_id: [
        "Tulis kueri SQL sederhana untuk menemukan pengguna paling aktif bulan ini",
        "Bantu aku merancang struktur skema basis data yang teratur untuk aplikasiku",
        "Jelaskan bagaimana operasi SQL JOIN ini bekerja dan cara mengoptimalkannya",
        "Ubah permintaan dalam bahasa sehari-hari ini menjadi kueri SQL yang rapi"
      ]
    },

    "regex-tester": {
      title: "Pattern & API Guide",
      title_id: "Panduan Pola Regex & API",
      category: "developer",
      tag: "PATTERN GUIDE // SIMPLE & TESTED",
      tag_id: "PANDUAN REGEX // TERUJI & JELAS",
      placeholder: "Describe what text pattern you want to match, or paste an API endpoint to test...",
      placeholder_id: "Jelaskan pola teks yang ingin dicocokkan, atau tempel endpoint API untuk diuji...",
      systemPrompt: "You are a friendly guide for regular expressions and web APIs. Demystify tricky patterns: 1) The exact regex pattern, 2) A plain-English breakdown of what each symbol means, 3) Friendly examples of text that will match and won't match, 4) Ready-to-use code snippets in JavaScript or Python to fetch data easily.",
      presets: [
        "Create a simple regex pattern to match email addresses or phone numbers",
        "Explain what this cryptic regular expression actually does in plain English",
        "Show me how to fetch data from this API in JavaScript or Python",
        "Help me extract dates and prices from messy text with regex"
      ],
      presets_id: [
        "Buat pola regex sederhana untuk mencocokkan format alamat email atau nomor telepon",
        "Jelaskan arti dari simbol-simbol dalam regular expression yang rumit ini",
        "Tunjukkan cara mengambil data dari API ini menggunakan JavaScript atau Python",
        "Bantu aku mengekstrak tanggal dan nominal harga dari teks acak dengan regex"
      ]
    },

    "system-architect": {
      title: "System & App Blueprint",
      title_id: "Cetak Biru Sistem & Arsitektur Aplikasi",
      category: "developer",
      tag: "SYSTEM BLUEPRINT // VISUAL & CLEAR",
      tag_id: "CETAK BIRU SISTEM // VISUAL & JELAS",
      placeholder: "Describe the app or service you're building, or share a whiteboard sketch...",
      placeholder_id: "Jelaskan aplikasi atau layanan yang sedang kamu bangun, atau kirim sketsa...",
      systemPrompt: "You are an encouraging software architect who loves explaining how systems connect. Help plan apps and services clearly: 1) Easy-to-understand overview of the components, 2) Clean, visual Mermaid.js diagram showing how data moves, 3) Simple advice on choosing databases and hosting, 4) Thoughtful tips on keeping things reliable and simple.",
      presets: [
        "Draw a simple flowchart diagram showing how a modern web app connects together",
        "How would you design a simple, scalable photo-sharing app like Instagram?",
        "Help me choose the right database and cache for my new project",
        "Explain microservices vs monolith in plain terms for my team"
      ],
      presets_id: [
        "Gambarkan diagram alur sederhana yang menunjukkan koneksi komponen aplikasi web modern",
        "Bagaimana cara merancang arsitektur aplikasi berbagi foto yang andal dan terukur?",
        "Bantu aku memilih basis data dan sistem cache yang paling sesuai untuk proyek baru",
        "Jelaskan perbedaan arsitektur microservices vs monolith secara ringkas untuk tim"
      ]
    },

    // =========================================================================
    // 4. CYBERSECURITY & SECOPS MATRIX TOOLS (CYBER THEME)
    // =========================================================================
    "vuln-scanner": {
      title: "Security Checkup",
      title_id: "Pemeriksaan Keamanan & Kerentanan",
      category: "cybersecurity",
      tag: "SECURITY CHECKUP // SAFE & PROTECTED",
      tag_id: "PEMERIKSAAN KEAMANAN // AMAN & TERLINDUNGI",
      placeholder: "Paste code, package names, or a security notice to check for safety risks...",
      placeholder_id: "Tempel kode, nama paket dependensi, atau laporan keamanan untuk dicek...",
      systemPrompt: "You are a friendly security advisor. Help identify potential safety risks in code or software in a supportive, reassuring way: 1) Plain-English explanation of the security risk and why it matters, 2) Simple risk level rating, 3) Clear, copy-pasteable fix or patch that makes the code safe, 4) Everyday best practices to prevent similar issues.",
      presets: [
        "Check this code for common security oversights and show how to fix them",
        "Explain this vulnerability in plain English so I know if I'm at risk",
        "How do I protect my website forms from common security traps?",
        "Check this configuration file to make sure it follows safe best practices"
      ],
      presets_id: [
        "Periksa kode ini dari potensi celah keamanan umum dan tunjukkan cara memperbaikinya",
        "Jelaskan kerentanan keamanan ini dengan bahasa sederhana agar aku tahu risikonya",
        "Bagaimana cara melindungi formulir website dari celah keamanan umum seperti XSS atau CSRF?",
        "Periksa file konfigurasi ini untuk memastikan telah mengikuti standar keamanan terbaik"
      ]
    },

    "threat-intel": {
      title: "Threat & Phishing Shield",
      title_id: "Perisai Ancaman & Anti-Phishing",
      category: "cybersecurity",
      tag: "SECURITY SHIELD // VIGILANT & HELPFUL",
      tag_id: "PERISAI KEAMANAN // WASPADA & MEMBANTU",
      placeholder: "Paste suspicious email text, a weird link, or server alerts to investigate...",
      placeholder_id: "Tempel teks email mencurigakan, tautan aneh, atau peringatan server untuk diperiksa...",
      systemPrompt: "You are a reassuring digital safety guardian. Help users inspect suspicious activity with calm guidance: 1) What the suspicious message or alert actually means, 2) Red flags to look out for, 3) Immediate, reassuring steps to protect your accounts and devices, 4) A simple checklist for staying safe online.",
      presets: [
        "Is this email a phishing attempt? Help me inspect the red flags",
        "What should I do if an account or API key might be compromised?",
        "Help me understand these strange server access logs",
        "Give me a simple checklist to respond to a suspicious activity alert"
      ],
      presets_id: [
        "Apakah email ini terindikasi phishing? Bantu aku memeriksa tanda-tanda bahayanya",
        "Apa langkah darurat jika akun atau kunci API milikku diduga bocor?",
        "Bantu aku menganalisis catatan log akses server yang mencurigakan ini",
        "Berikan daftar periksa langkah cepat untuk merespons peringatan aktivitas mencurigakan"
      ]
    },

    "payload-generator": {
      title: "Code Safety & Contract Audit",
      title_id: "Audit Keamanan Kode & Smart Contract",
      category: "cybersecurity",
      tag: "SAFETY AUDIT // SECURE & RELIABLE",
      tag_id: "AUDIT KEAMANAN // AMAN & ANDAL",
      placeholder: "Paste your smart contract or web authentication flow to check for safety flaws...",
      placeholder_id: "Tempel smart contract atau alur autentikasi web untuk memeriksa celah keamanan...",
      systemPrompt: "You are a supportive code safety reviewer. Review smart contracts and authentication logic to help make them rock solid: 1) Friendly summary of any potential logic flaws or oversights, 2) Clear explanation of what could go wrong if unaddressed, 3) Clean, corrected code that keeps user funds and data safe, 4) Tips for confident, secure releases.",
      presets: [
        "Review this smart contract for common safety issues before launching",
        "Check my login and authentication flow to make sure user data stays safe",
        "Explain how reentrancy works and how to easily prevent it",
        "Help me review access permissions to ensure only authorized users can enter"
      ],
      presets_id: [
        "Tinjau smart contract ini dari potensi celah keamanan sebelum dirilis",
        "Periksa alur login dan autentikasi ini agar data pengguna tetap terlindungi aman",
        "Jelaskan bagaimana serangan reentrancy terjadi dan cara mudah mencegahnya",
        "Bantu aku memeriksa izin hak akses guna memastikan hanya pengguna berwenang yang bisa masuk"
      ]
    },

    "network-forensics": {
      title: "Network & Traffic Guard",
      title_id: "Pemantau Jaringan & Lalu Lintas Data",
      category: "cybersecurity",
      tag: "NETWORK GUARD // CLEAR & SAFE",
      tag_id: "PENJAGA JARINGAN // AMAN & TRANSPARAN",
      placeholder: "Paste network logs, open port lists, or firewall rules to review...",
      placeholder_id: "Tempel log jaringan, daftar port terbuka, atau aturan firewall untuk diperiksa...",
      systemPrompt: "You are a friendly network guide. Help demystify network traffic, open ports, and connection security: 1) Plain-language breakdown of what the network data shows, 2) Advice on which ports should stay private, 3) Simple, easy-to-copy firewall rules for everyday protection, 4) Practical tips for keeping your network safe.",
      presets: [
        "Look at these open network ports and tell me what is safe to close",
        "Help me set up simple, friendly firewall rules to protect my server",
        "Explain what unusual network traffic looks like in plain words",
        "How can I tell if my connection is being monitored or intercepted?"
      ],
      presets_id: [
        "Lihat daftar port jaringan yang terbuka ini dan beri tahu port mana yang aman ditutup",
        "Bantu aku menyusun aturan firewall sederhana untuk melindungi server dari serangan",
        "Jelaskan seperti apa bentuk anomali lalu lintas data jaringan yang mencurigakan",
        "Bagaimana cara mengetahui apakah koneksi internet sedang dipantau atau disadap?"
      ]
    },

    "crypto-vault": {
      title: "Encryption & Privacy Vault",
      title_id: "Brankas Enkripsi & Privasi Data",
      category: "cybersecurity",
      tag: "PRIVACY VAULT // SECURE & CONFIDENTIAL",
      tag_id: "BRANKAS PRIVASI // AMAN & RAHASIA",
      placeholder: "Enter a hash, cipher text, or ask how to encrypt and protect private data...",
      placeholder_id: "Masukkan nilai hash, teks terenkripsi, atau tanyakan cara mengamankan data privat...",
      systemPrompt: "You are a patient privacy and cryptography mentor. Explain how encryption and private security work in simple, approachable ways: 1) Plain-English explanation of how the cipher or hash functions, 2) Modern recommendations for safely storing passwords and user data, 3) Clear guidance on encryption best practices for apps, 4) Friendly explanations of advanced privacy concepts like zero-knowledge proofs.",
      presets: [
        "What is the safest way to store passwords in my database today?",
        "Explain how end-to-end encryption works like I'm five",
        "Help me understand which encryption algorithm is best for my app",
        "How do zero-knowledge proofs protect my privacy without revealing data?"
      ],
      presets_id: [
        "Apa metode teraman untuk mengenkripsi dan menyimpan kata sandi di database saat ini?",
        "Jelaskan bagaimana enkripsi end-to-end bekerja dengan perumpamaan sederhana",
        "Bantu aku memahami algoritma enkripsi mana yang paling tepat untuk aplikasiku",
        "Bagaimana prinsip zero-knowledge proof menjaga privasi data tanpa perlu membocorkan isinya?"
      ]
    }
  },

  benchmarks: [
    { name: "Logic & Problem Solving (MMLU-Pro)", aethera: 94.2, gpt4o: 88.6 },
    { name: "Code Writing & Debugging (HumanEval-X)", aethera: 96.8, gpt4o: 90.2 },
    { name: "Math & Step-by-Step Calculus (MATH-500)", aethera: 92.4, gpt4o: 83.1 },
    { name: "Science & In-Depth Research (GPQA)", aethera: 78.6, gpt4o: 68.4 },
    { name: "Everyday Productivity Tools (ToolBench)", aethera: 95.1, gpt4o: 89.0 }
  ]
};

window.AETHERA_DATA = AETHERA_DATA;

/* ==========================================================================
   GLOBAL CINEMATIC THEME TRANSITION CONTROLLER (DARK <-> LIGHT DISSOLVE)
   Smoothly coordinates a slow 1.6s dissolve across all pages, cards, and canvas
   ========================================================================== */
(function() {
  let isInitialLoad = true;
  let themeTransitionTimeout = null;
  const THEME_TRANSITION_MS = 800; // Silky smooth 800ms transition

  window.triggerAetheraThemeTransition = function(durationMs = THEME_TRANSITION_MS) {
    const ms = Math.min(durationMs, 800);
    document.documentElement.classList.add('theme-transitioning');
    clearTimeout(themeTransitionTimeout);
    themeTransitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, ms);
  };

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'data-theme') {
        if (isInitialLoad) {
          return;
        }
        window.triggerAetheraThemeTransition(THEME_TRANSITION_MS);
        return;
      }
    }
  });

  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Disarm initial load bypass once DOM is settled
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => { isInitialLoad = false; }, 120);
    });
  } else {
    setTimeout(() => { isInitialLoad = false; }, 120);
  }
})();
