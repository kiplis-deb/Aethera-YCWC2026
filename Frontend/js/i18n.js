/**
 * AETHERA - INTERNATIONALIZATION (i18n) ENGINE
 * Bilingual Translation Engine: English (en) & Bahasa Indonesia (id)
 * Zero-dependency, instant reactive translation, local persistence.
 */

(function () {
  'use strict';

  const TRANSLATIONS = {
    en: {
      // General Navigation
      'nav.home': 'Home',
      'nav.ai_tools': 'AI Tools',
      'nav.calendar': 'Calendar',
      'nav.notes': 'Notes',
      'nav.news': 'Tech News',
      'nav.learn': 'Academy',
      'nav.games': 'Arcade',
      'nav.tool_suite': 'Tool Suite',
      'nav.secops': 'Cyber SecOps',
      'nav.benchmarks': 'Benchmarks',
      'nav.faq': 'FAQ',
      'nav.launch_studio': 'Launch AI Studio',
      'nav.sign_in': 'Sign In',
      'nav.sign_out': 'Sign Out',
      'nav.overview': 'Overview',
      'nav.tools': 'Tools',
      'nav.mobile_nav_title': 'Navigation',
      'nav.mobile_ai': '⚡ AI Tools Suite',
      'nav.mobile_calendar': '📅 Interactive Calendar',
      'nav.mobile_notes': '📝 Smart Notes',
      'nav.mobile_news': '📰 Tech & Business News',
      'nav.mobile_learn': '🎓 Tech & Math Academy',
      'nav.mobile_games': '🕹️ Math & CS Arcade',
      'nav.mobile_tools': '🛠️ Tool Suite Catalog',
      'nav.mobile_secops': '🛡️ Cyber SecOps Suite',
      'nav.mobile_benchmarks': '📊 AI Benchmarks',
      'nav.mobile_faq': '❓ FAQ & Guides',

      // Hero Section (Landing Page)
      'hero.badge': 'NEXT-GEN PERSONAL PRODUCTIVITY SUITE',
      'hero.title_prefix': 'Cognitive AI,',
      'hero.title_highlight': 'For Daily Productivity.',
      'hero.subtitle': '20+ helpful AI tools designed for students, creators, professionals, and everyday problem-solving. Draft polite emails, solve math step-by-step, review code safely, plan your day, and learn with ease.',
      'hero.cta_start': 'Open All 20+ Free Tools →',
      'hero.cta_explore': 'Explore Catalog',
      'hero.live_status': 'SECURE LOCAL ENGINE ACTIVE',

      // Live AI Sandbox / Showcase
      'sandbox.title': 'Live AI Engine Preview',
      'sandbox.subtitle': 'Experience multi-modal generative inference running in real-time.',
      'sandbox.tab_email': 'Email Drafter',
      'sandbox.tab_code': 'Code Explainer',
      'sandbox.tab_study': 'Study Flashcards',
      'sandbox.tab_meeting': 'Meeting Summary',
      'sandbox.input_placeholder': 'Type a prompt or select a preset below...',
      'sandbox.btn_run': 'Run Inference',
      'sandbox.btn_studio': 'Open Full AI Studio',
      'sandbox.output_label': 'AI RESPONSE OUTPUT',

      // macOS AI Studio Showcase Window
      'mac.tab_chat': 'AI Chatbot',
      'mac.tab_email': 'Email Drafter',
      'mac.tab_code': 'Bug Hunter',
      'mac.tab_math': 'Calculus Solver',
      'mac.nav_title': 'POPULAR AI SUITE',
      'mac.nav_cve': 'CVE & SecOps',
      'mac.nav_resume': 'Resume Builder',
      'mac.launch_studio': 'Open AI Studio ↗',
      'mac.bubble_you': 'You',
      'mac.bubble_time': 'Just now',
      'mac.bubble_friend': 'Aethera Friend',
      'mac.input_placeholder': 'Chat freely about anything, brainstorm, or chat like a friend...',

      // Showcase Section (Raw Chaos -> Structured Intelligence)
      'showcase.title': 'Raw Chaos ➔ Structured Intelligence',
      'showcase.subtitle': 'Experience how Aethera transforms messy inputs into crisp, formatted, publication-ready outputs in milliseconds.',
      'showcase.tab_notes': '1. Quick Notes ➔ Clear Team Summary',
      'showcase.tab_math': '2. Calculus Question ➔ Step-by-Step Solution',
      'showcase.tab_code': '3. Buggy Code ➔ Clean & Modern Fix',
      'showcase.tab_cyber': '4. Login Security ➔ Safe & Simple Fix',
      'showcase.raw_label': 'RAW USER INPUT',
      'showcase.ai_label': 'AETHERA STRUCTURED COGNITION',
      'showcase.unstructured': 'UNSTRUCTURED',
      'showcase.ready': 'PUBLICATION READY',
      'showcase.btn_try': 'Try This Live in AI Studio',

      // Core Features & Tools Suite Section
      'features.badge': 'CORE WORKSPACE MODULES',
      'features.title': 'Four Disciplines. One Fluid Ecosystem.',
      'features.subtitle': 'Designed to remove cognitive friction between planning, capturing thoughts, tracking intelligence, and executing tasks.',
      'features.ai_title': 'AI Cortex Studio',
      'features.ai_desc': '14+ specialized daily generative modules spanning code auditing, strategic reporting, podcast scripting, and prompt synthesis.',
      'features.notes_title': 'Smart Notion Workspace',
      'features.notes_desc': 'Block-based rich editor with instant slash commands (/), real-time multi-device cloud database syncing, and AI brainstorming.',
      'features.cal_title': 'Quantum Matrix Calendar',
      'features.cal_desc': 'Time-blocking calendar merged with Eisenhower quadrant prioritization and automated AI daily scheduling.',
      'features.news_title': 'Tech & Business Intelligence',
      'features.news_desc': 'Live auto-aggregating feed filtering deep tech, venture capital, AI breakthroughs, and cybersecurity.',
      'features.btn_explore': 'Explore Module',

      'tools.title': 'Helpful Tools for Work, Study & Daily Life',
      'tools.subtitle': 'Designed to make writing, studying, organizing your schedule, and coding feel simple, friendly, and stress-free.',

      // Bento Grid - Card 01: Email & Message Helper
      'tools.bento.c1_badge': 'WORK & LIFE',
      'tools.bento.c1_title': 'Email & Message Helper',
      'tools.bento.c1_desc': 'Turn rough bullet points into polite, friendly emails, salary talks, client updates, and thoughtful follow-ups.',
      'tools.bento.c1_mock_to_lbl': 'To:',
      'tools.bento.c1_mock_sub_lbl': 'Subject:',
      'tools.bento.c1_mock_sub_val': 'Quick project update & next steps!',
      'tools.bento.c1_mock_body': '"Hi team! Here’s a quick recap of what we finished this week, along with our next steps so everyone stays aligned..."',
      'tools.bento.c1_tag1': 'Friendly Tone',
      'tools.bento.c1_tag2': 'Polite Follow-ups',
      'tools.bento.c1_tag3': 'Clear Updates',
      'tools.bento.c1_tag4': 'Salary Chats',
      'tools.bento.c1_btn': 'Open Email Helper',

      // Bento Grid - Card 02: Step-by-Step Math Tutor
      'tools.bento.c2_badge': 'ACADEMIC & MATH',
      'tools.bento.c2_title': 'Step-by-Step Math Tutor',
      'tools.bento.c2_desc': 'Clear, patient explanations for calculus, algebra, equations, and tricky homework problems formatted neatly so they make sense.',
      'tools.bento.c2_formula_badge': 'Gaussian Integral (Step-by-Step Proof)',
      'tools.bento.c2_tag1': 'Algebra & Calculus',
      'tools.bento.c2_tag2': 'Step-by-Step Proofs',
      'tools.bento.c2_tag3': 'Homework Help',
      'tools.bento.c2_tag4': 'Formulas & Graphs',
      'tools.bento.c2_btn': 'Open Math Tutor',

      // Bento Grid - Card 03: Quick Document Summarizer
      'tools.bento.c3_badge': 'WORK & STUDY',
      'tools.bento.c3_title': 'Quick Document Summarizer',
      'tools.bento.c3_desc': 'Turn long articles, meeting notes, PDFs, or study lectures into friendly, bite-sized takeaways in seconds.',
      'tools.bento.c3_tag1': 'Key Takeaways',
      'tools.bento.c3_tag2': 'Quick Bullet Points',
      'tools.bento.c3_tag3': 'Meeting Notes',
      'tools.bento.c3_tag4': 'Study Guides',
      'tools.bento.c3_btn': 'Open Summarizer',

      // Bento Grid - Card 04: Day & Routine Planner
      'tools.bento.c4_badge': 'PRODUCTIVITY',
      'tools.bento.c4_title': 'Day & Routine Planner',
      'tools.bento.c4_desc': 'Organize your to-dos with calm focus, balanced schedules, and realistic time blocks that keep your days stress-free.',
      'tools.bento.c4_pill1': 'Top Priority Today',
      'tools.bento.c4_pill2': 'Focused Work Time',
      'tools.bento.c4_tag1': 'Daily Priorities',
      'tools.bento.c4_tag2': 'Focus Timer',
      'tools.bento.c4_tag3': 'Time Blocking',
      'tools.bento.c4_tag4': 'Synced Calendar',
      'tools.bento.c4_btn1': 'Open Day Planner',
      'tools.bento.c4_btn2': 'Open Calendar',

      // Bento Grid - Card 05: Code Explainer & App Blueprint
      'tools.bento.c5_badge': 'CODING & APP DESIGN',
      'tools.bento.c5_title': 'Code Explainer & App Blueprint',
      'tools.bento.c5_desc': 'Understand code in plain English, discover how your programs run, and sketch out clean app architectures with simple visual diagrams.',
      'tools.bento.c5_node1': 'User',
      'tools.bento.c5_node2': 'Web App',
      'tools.bento.c5_node3': 'Fast Cache',
      'tools.bento.c5_node4': 'Database',
      'tools.bento.c5_badge2': 'Fast & Scalable • Clean Code',
      'tools.bento.c5_tag1': 'Plain English Explanations',
      'tools.bento.c5_tag2': 'Bug Hunter',
      'tools.bento.c5_tag3': 'Visual Flowcharts',
      'tools.bento.c5_tag4': 'Performance Tips',
      'tools.bento.c5_tag5': 'App Blueprints',
      'tools.bento.c5_btn': 'Open Code & Blueprint Tools',

      // Bento Grid - Card 06: Online Safety & Security Shield
      'tools.bento.c6_badge': 'SAFETY & SECURITY',
      'tools.bento.c6_title': 'Online Safety & Security Shield',
      'tools.bento.c6_desc': 'Friendly safety checkups, phishing alerts, and simple privacy advice to keep your apps and data safe without confusing jargon.',
      'tools.bento.c6_stat1': 'Known Safety Checks',
      'tools.bento.c6_stat2': 'Instant Check Speed',
      'tools.bento.c6_term_title': 'privacy.guard // ACTIVE',
      'tools.bento.c6_term_log1': 'Safety shield and privacy checkup active',
      'tools.bento.c6_term_log2': '1 quick update recommended for best privacy',
      'tools.bento.c6_term_log3': 'Safe, simple fix ready to apply',
      'tools.bento.c6_term_log4': 'Everything is secure and protected',
      'tools.bento.c6_tag1': 'Privacy Checkup',
      'tools.bento.c6_tag2': 'Scam & Phishing Alerts',
      'tools.bento.c6_tag3': 'Easy Safety Tips',
      'tools.bento.c6_btn': 'Open Safety Checkup',

      // Bento Grid - Card 07: Safe Code & Logic Review
      'tools.bento.c7_badge': 'CODE SAFETY',
      'tools.bento.c7_title': 'Safe Code & Logic Review',
      'tools.bento.c7_desc': 'Review your code, login flows, and app logic for common mistakes, helping you protect user data with confidence.',
      'tools.bento.c7_tag1': 'Safe Login Checks',
      'tools.bento.c7_tag2': 'Logic & Bug Review',
      'tools.bento.c7_tag3': 'Data Protection',
      'tools.bento.c7_btn': 'Check Code Safety',

      // Catalog Explorer Strip & Bottom CTA
      'tools.bento.strip_title': 'EXPLORE MORE HELPERS:',
      'tools.bento.strip_pill1': 'Job & Resume Coach',
      'tools.bento.strip_pill2': 'Curious Explorer',
      'tools.bento.strip_pill3': 'Code Safety Review',
      'tools.bento.strip_pill4': 'System & App Blueprint',
      'tools.bento.strip_pill5': '+14 More in Studio',
      'tools.bento.cta_all': 'Explore All 20+ Free AI Tools',

      // Marquee Ticker
      'marquee.free': '100% FREE FOR EVERYONE',
      'marquee.gemini': 'POWERED BY GOOGLE GEMINI',
      'marquee.tools': '20+ HELPFUL DAILY TOOLS',
      'marquee.math': 'STEP-BY-STEP MATH TUTOR',
      'marquee.email': 'CLEAR & POLITE EMAIL HELPER',
      'marquee.fast': 'LIGHTNING-FAST RESPONSES',
      'marquee.secure': 'PRIVATE & SECURE BY DEFAULT',
      'marquee.doc': 'EASY DOCUMENT SUMMARIES',
      'marquee.routine': 'DAILY ROUTINE & FOCUS PLANNER',
      'marquee.code': 'FRIENDLY CODING & BUG HELPER',

      // Quick Access Dock
      'qa.title': 'Quick Access',
      'qa.ai': 'AI Tools Page',
      'qa.calendar': 'Calendar',
      'qa.notes': 'Smart Notes',
      'qa.news': 'Tech News',
      'qa.learn': 'Tech & Math Academy',
      'qa.chat': 'Aethera Chat',

      // Benchmarks
      'benchmarks.badge': 'PERFORMANCE BENCHMARKS',
      'benchmarks.title': 'Accuracy You Can Trust for Study, Work & Code',
      'benchmarks.subtitle': 'Powered by Google Gemini, Aethera delivers clear, reliable answers — whether you\'re solving tough math equations, writing and debugging code, or researching a project.',
      'benchmarks.stat_coding': 'Coding Accuracy',
      'benchmarks.stat_math': 'Math & Science',
      'benchmarks.stat_load': 'First Paint Load',
      'benchmarks.stat_sync': 'Cloud DB Sync',
      'benchmarks.stat_fps': 'Animation Framerate',
      'benchmarks.stat_privacy': 'Client Privacy',

      // FAQ
      'faq.badge': 'QUESTIONS & ANSWERS',
      'faq.title': 'Everything You Need to Know',
      'faq.subtitle': 'Quick, simple answers to help you get the most out of Aethera every day.',
      'faq.q1': 'Is Aethera really completely free to use?',
      'faq.a1': 'Yes, absolutely! Every single tool, our smart notes workspace, live tech news, and our friendly AI assistant are 100% free for everyone. Whether you\'re studying, working, or just exploring, there are zero subscriptions, paywalls, or surprise fees.',
      'faq.q2': 'Can Aethera help me with math problems and homework?',
      'faq.a2': 'Definitely! When you ask a question about algebra, calculus, or physics, Aethera breaks down the solution step by step and displays formulas in neat, textbook-quality math that is super easy to read and understand.',
      'faq.q3': 'Can I use Aethera for everyday work emails and writing?',
      'faq.a3': 'You bet! Aethera is here to make your day easier. It can help you draft clear emails, summarize long articles or class notes, organize your daily schedule, and even polish up your resume and cover letters in seconds.',
      'faq.q4': 'What makes Aethera so fast and helpful?',
      'faq.a4': 'Aethera is powered by Google\'s latest Gemini models, giving you lightning-fast, thoughtful responses whenever you need them — fully connected with your notes, calendar, and live news.',

      // Footer
      'footer.tagline': 'Cognitive Workspace for everyday workers, programmers, and students.',
      'footer.navigation': 'Navigation',
      'footer.modules': 'Modules',
      'footer.resources': 'Resources',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.rights': 'All rights reserved.',
      'footer.col_daily': 'Daily Life & Work',
      'footer.col_study': 'Study & Coding Tools',
      'footer.col_safety': 'Safety & Security',
      'footer.col_community': 'Community Status',
      'footer.desc': '100% Free decentralized cognitive intelligence and daily tools for students, workers, and programmers.',
      'footer.copy': '© 2026 AETHERA OPEN LABS. FREE & OPEN ACCESS.',
      'footer.status': '100% FREE ACCESS // LIVE',

      // Calendar Page
      'cal.overview': 'Overview',
      'cal.ai_studio': 'AI Studio',
      'cal.ai_integrated': 'AI INTEGRATED',
      'cal.today': 'Today',
      'cal.month': 'Month',
      'cal.week': 'Week',
      'cal.matrix': 'Matrix',
      'cal.agenda': 'Agenda',
      'cal.new_event': 'New Event',
      'cal.cortex_planner': 'CORTEX PLANNER',
      'cal.auto_sync': 'AUTO-SYNC',
      'cal.ai_title': 'AI Schedule Assistant',
      'cal.ai_desc': 'Turn messy to-dos or meeting notes into a prioritized Eisenhower schedule with time blocks.',
      'cal.auto_plan': 'Auto-Plan Day with AI',
      'cal.open_studio': 'Open in AI Studio',
      'cal.filters': 'Category Filters',
      'cal.filter_title': 'Filter by Category',
      'cal.eisenhower': 'Eisenhower Priority',
      'cal.all_categories': 'All Categories',
      'cal.cat_all': 'All Categories',
      'cal.cat_deep_work': 'Deep Work',
      'cal.cat_meeting': 'Meetings & Syncs',
      'cal.cat_study': 'Study & Academic',
      'cal.cat_deadline': 'Deadlines & SecOps',
      'cal.cat_personal': 'Personal & Health',
      'cal.cat_work': 'General Work',
      'cal.cat_opt_deep_work': 'Deep Work / Coding',
      'cal.cat_opt_meeting': 'Meeting / Sync',
      'cal.cat_opt_study': 'Study / Academic',
      'cal.cat_opt_deadline': 'Deadline / Deliverable',
      'cal.cat_opt_personal': 'Personal / Wellness',
      'cal.cat_opt_work': 'General Work',
      'cal.day_mon': 'Mon',
      'cal.day_tue': 'Tue',
      'cal.day_wed': 'Wed',
      'cal.day_thu': 'Thu',
      'cal.day_fri': 'Fri',
      'cal.day_sat': 'Sat',
      'cal.day_sun': 'Sun',
      'cal.rate_label': 'COMPLETION RATE',
      'cal.clear_label': 'Schedule Clear',
      'cal.no_tasks': 'No tasks today',
      'cal.reset_btn': 'Reset Calendar',
      'cal.state_clean': 'STATE // CLEAN',
      'cal.day_agenda': 'DAY AGENDA',
      'cal.add_task': 'Add',
      'cal.quick_placeholder': 'Quick add task (e.g. 2pm Team sync)...',
      'cal.matrix_heading': 'Eisenhower Decision Matrix',
      'cal.matrix_desc': 'Organize tasks by urgency and importance to eliminate distractions and maximize high-impact work.',
      'cal.matrix_add_btn': 'Add Task to Matrix',
      'cal.q1_title': 'Urgent & Important',
      'cal.q2_title': 'Important, Not Urgent',
      'cal.q3_title': 'Urgent, Not Important',
      'cal.q4_title': 'Neither Urgent nor Important',
      'cal.q1_action': 'DO FIRST',
      'cal.q2_action': 'SCHEDULE / DEEP WORK',
      'cal.q3_action': 'DELEGATE / BATCH',
      'cal.q4_action': 'ELIMINATE / RECHARGE',
      'cal.modal_create': 'Create New Event',
      'cal.modal_event_title': 'Create Calendar Event',
      'cal.modal_event_label': 'Event Title & Objective',
      'cal.modal_event_ph': 'e.g. Deep Work // Neural Engine Refactoring',
      'cal.modal_title_label': 'Event Title',
      'cal.modal_time_label': 'Time & Date',
      'cal.modal_date': 'Date',
      'cal.modal_start': 'Start Time',
      'cal.modal_end': 'End Time',
      'cal.modal_category_label': 'Category',
      'cal.modal_priority_label': 'Priority Quadrant',
      'cal.modal_quadrant': 'Eisenhower Priority Quadrant',
      'cal.modal_notes': 'Notes & Details',
      'cal.modal_notes_ph': 'Optional notes, deliverables, link, or AI prompt instructions...',
      'cal.modal_save': 'Save Event',
      'cal.modal_cancel': 'Cancel',
      'cal.modal_ai_heading': 'AI Schedule Generator',
      'cal.modal_ai_prompt_lbl': 'Describe your goals, to-dos, or meetings for the day',
      'cal.modal_ai_prompt_ph': 'e.g. I have a client meeting from 10:00 to 11:30, need 2 hours for deep coding, an hour for calculus study, and gym at 5pm...',
      'cal.modal_ai_date_lbl': 'Target Date',
      'cal.modal_ai_gen_btn': 'Generate Schedule',
      'cal.modal_ai_confirm': 'Confirm & Add to Calendar',
      'cal.modal_ai_parsed_lbl': 'Parsed Time Blocks & Priority Quadrants',
      'cal.day_quick_ph': 'Quick add event to this date (e.g. 14:00 System Architecture Review)...',
      'cal.day_events_heading': 'Events on',
      'cal.no_events_on_day': 'No events scheduled for this day',
      'cal.no_events_on_day_desc': 'Your schedule is completely clear for this date. Create a new event or let AI plan it for you.',
      'cal.synced_with_account': 'Synced with account',
      'cal.sync_now_btn': 'Sync Now',
      'cal.syncing_status': 'Syncing with cloud...',
      'cal.guest_sync_hint': 'Local storage (Sign in to sync across devices)',
      'cal.events_count_label': 'events',
      'cal.completed_count_label': 'completed',

      // AI Studio Page
      'studio.overview': 'Overview',
      'studio.calendar': 'Calendar',
      'studio.free_badge': '100% FREE ACCESS',
      'studio.tools': 'Tools',
      'studio.api_status': 'API STATUS:',
      'studio.connected': 'CONNECTED // LIVE',
      'studio.clear_session': 'Clear Session',
      'studio.select_tool': 'Select AI Tool (14+)',
      'studio.generate_btn': 'Generate with AI',
      'studio.stop_btn': 'Stop',
      'studio.input_label': 'PROMPT & INPUT CONTEXT',
      'studio.output_label': 'AI GENERATION OUTPUT',
      'studio.copy_btn': 'Copy',
      'studio.notes_export': 'Save to Notes',
      'studio.cat_conversational': 'CONVERSATIONAL AI',
      'studio.cat_daily': 'DAILY LIFE & WORK',
      'studio.cat_study': 'STUDY & LEARNING',
      'studio.cat_developer': 'CODING & TECH HELP',
      'studio.cat_cybersecurity': 'ONLINE SAFETY & SECURITY',
      'studio.quick_templates': 'QUICK TEMPLATES',
      'studio.tool_chatbot_title': 'Friendly Chat',
      'studio.tool_chatbot_sub': 'Talk about anything on your mind',
      'studio.tool_email_title': 'Email & Message Helper',
      'studio.tool_email_sub': 'Kind, clear messages & quick replies',
      'studio.tool_doc_title': 'Quick Summarizer',
      'studio.tool_doc_sub': 'Turn long reads into easy takeaways',
      'studio.tool_task_title': 'Day & Routine Planner',
      'studio.tool_task_sub': 'Organize your to-dos with calm focus',
      'studio.tool_resume_title': 'Job & Resume Coach',
      'studio.tool_resume_sub': 'Polished resumes & warm cover letters',
      'studio.tool_trans_title': 'Language & Grammar Friend',
      'studio.tool_trans_sub': 'Natural translations & friendly phrasing',
      'studio.tool_math_title': 'Step-by-Step Math Tutor',
      'studio.tool_math_sub': 'Clear explanations that make sense',
      'studio.tool_essay_title': 'Essay & Writing Partner',
      'studio.tool_essay_sub': 'Brainstorm ideas, outlines & drafts',
      'studio.tool_exam_title': 'Study Buddy & Flashcards',
      'studio.tool_exam_sub': 'Bite-sized quizzes & practice cards',
      'studio.tool_research_title': 'Curious Explorer & Research',
      'studio.tool_research_sub': 'Explore any topic in plain language',
      'studio.tool_code_title': 'Code Explainer',
      'studio.tool_code_sub': 'Understand any snippet simply & clearly',
      'studio.tool_bug_title': 'Bug Doctor & Fixer',
      'studio.tool_bug_sub': 'Find and solve errors without stress',
      'studio.tool_converter_title': 'Code Translator',
      'studio.tool_converter_sub': 'Switch between languages smoothly',
      'studio.tool_sql_title': 'Database & SQL Helper',
      'studio.tool_sql_sub': 'Simple queries & organized tables',
      'studio.tool_regex_title': 'Pattern & API Guide',
      'studio.tool_regex_sub': 'Build text patterns & test web calls',
      'studio.tool_arch_title': 'System & App Blueprint',
      'studio.tool_arch_sub': 'Plan clean apps & visual diagrams',
      'studio.tool_vuln_title': 'Security Checkup',
      'studio.tool_vuln_sub': 'Spot safety risks & easy fixes',
      'studio.tool_threat_title': 'Threat & Phishing Shield',
      'studio.tool_threat_sub': 'Analyze suspicious emails & alerts',
      'studio.tool_payload_title': 'Code Safety & Contract Audit',
      'studio.tool_payload_sub': 'Keep web apps & contracts secure',
      'studio.tool_net_title': 'Network & Traffic Guard',
      'studio.tool_net_sub': 'Review traffic & simple firewalls',
      'studio.tool_crypto_title': 'Encryption & Privacy Vault',
      'studio.tool_crypto_sub': 'Keep passwords & private data safe',
      'studio.welcome_author': 'Aethera Assistant // Here to Help',
      'studio.welcome_text': 'Welcome to Aethera Free AI Studio! Pick any helper on the left to get started—whether you want a friendly chat, help writing kind emails & resumes, a patient math tutor & study buddy, quick coding tips & bug fixes, or easy privacy & security checkups. We\'re here to help!',
      'studio.input_ph': 'Type your request, paste notes, or attach/paste an image (diagrams, math formulas, screenshots, homework)...',
      'studio.attach_btn': 'Attach Image',
      'studio.run_btn': 'Run AI',
      'studio.tag_chat': 'FRIENDLY CHAT',
      'studio.tag_vision': 'VISION AI',
      'studio.tag_free': '100% FREE',
      'studio.modal_title': 'Gemini AI Engine & API Key',
      'studio.modal_desc': 'Aethera connects to Google Gemini (Gemini 2.5 Flash & 2.0 Flash) for live multimodal vision, code generation, and LaTeX math. Enter your free Google AI Studio API key below to enable direct live inference.',
      'studio.modal_key_lbl': 'Google AI Studio API Key',
      'studio.modal_saved_hint': 'Saved in local storage on your device',
      'studio.modal_get_key': 'Get Free Key →',
      'studio.modal_model_lbl': 'Target Gemini Model',
      'studio.modal_clear': 'Clear Key',
      'studio.modal_test': 'Test Key',
      'studio.modal_save': 'Save & Apply',

      // Notes Page
      'notes.home': 'Home',
      'notes.recents': 'Recents',
      'notes.private': 'Private',
      'notes.add_page': 'Add a page',
      'notes.search_placeholder': 'Search notes or ask AI...',
      'notes.upcoming_events': 'Upcoming events',
      'notes.upcoming_desc': 'Connect your calendar to see all your events and start meeting notes for them.',
      'notes.quick_search': 'Quick search across all notes (Ctrl+K)',
      'notes.new_note': 'New page',
      'notes.delete_note': 'Delete page',
      'notes.add_cover': 'Add cover',
      'notes.remove_cover': 'Remove cover',
      'notes.change_icon': 'Click to change icon',
      'notes.untitled': 'New page',
      'notes.date_lbl': 'Date:',
      'notes.folder_lbl': 'Folder:',
      'notes.synced_cloud': 'Synced to cloud',
      'notes.saving': 'Saving...',
      'notes.edited_now': 'Edited just now',
      'notes.share': 'Share',
      'notes.empty_starter': 'Get started with',
      'notes.starter_draft': 'Start a draft',
      'notes.starter_brainstorm': 'Brainstorm',
      'notes.starter_research': 'Research a topic',
      'notes.starter_meeting': 'AI Meeting Notes',
      'notes.starter_database': 'Database',
      'notes.slash_basic': 'Basic Blocks',
      'notes.slash_text': 'Text',
      'notes.slash_text_desc': 'Just start writing with plain text.',
      'notes.slash_h1': 'Heading 1',
      'notes.slash_h1_desc': 'Large section heading.',
      'notes.slash_h2': 'Heading 2',
      'notes.slash_h2_desc': 'Medium section heading.',
      'notes.slash_h3': 'Heading 3',
      'notes.slash_h3_desc': 'Small section heading.',
      'notes.slash_todo': 'To-do list',
      'notes.slash_todo_desc': 'Track tasks with a to-do checklist.',
      'notes.slash_bullet': 'Bulleted list',
      'notes.slash_bullet_desc': 'Create a simple bulleted list.',
      'notes.slash_num': 'Numbered list',
      'notes.slash_num_desc': 'Create a list with numbering.',
      'notes.slash_media': 'Media & Advanced',
      'notes.slash_callout': 'Callout',
      'notes.slash_callout_desc': 'Make writing stand out with an icon.',
      'notes.slash_code': 'Code block',
      'notes.slash_code_desc': 'Capture code snippet with syntax styling.',
      'notes.slash_quote': 'Quote',
      'notes.slash_quote_desc': 'Capture a quote or key takeaway.',
      'notes.slash_divider': 'Divider',
      'notes.slash_divider_desc': 'Visually divide blocks with a thin rule.',
      'notes.slash_table': 'Table',
      'notes.slash_table_desc': 'Insert an editable structured grid table.',
      'notes.slash_date': "Today's Date",
      'notes.slash_date_desc': "Insert today's formatted date stamp.",
      'notes.slash_cal_event': 'Calendar Event',
      'notes.slash_cal_event_desc': 'Add an event synced directly to Calendar.',
      'notes.slash_matrix': 'Eisenhower Matrix',
      'notes.slash_matrix_desc': 'Insert a 4-quadrant priority task checklist.',
      'notes.slash_ai_cat': 'AI Assistant',
      'notes.slash_ai': 'Ask Aethera AI',
      'notes.slash_ai_desc': 'Draft, summarize, or brainstorm with AI.',
      'notes.slash_summary': 'AI Note Summary',
      'notes.slash_summary_desc': 'Extract key insights and takeaways with AI.',
      'notes.slash_actions': 'AI Action Items',
      'notes.slash_actions_desc': 'Extract actionable checklist to-dos from this note.',
      'cal.slash_cmd': 'Commands',

      // News Page
      'news.overview': 'Overview',
      'news.brand_title': 'Aethera Tech Pulse',
      'news.breaking': 'Breaking Tech',
      'news.ticker_label': 'Breaking Tech',
      'news.hero_title': 'Tech & Business News',
      'news.hero_desc': 'Continuous intelligence aggregated from TechCrunch, Ars Technica, Hacker News, and Global Markets. Auto-updated every 5 minutes with AI briefings and audio narration.',
      'news.updating_live': 'Updating live feeds...',
      'news.refresh_btn': 'Refresh',
      'news.search_placeholder': 'Search tech news by keyword, company, or topic...',
      'news.sort_lbl': 'Sort by:',
      'news.sort_newest': 'Newest First',
      'news.sort_readtime': 'Reading Time',
      'news.all_stories': 'All Stories',
      'news.cat_all': 'All Stories',
      'news.cat_business': 'Tech Business & VC',
      'news.cat_ai': 'AI & Generative',
      'news.cat_silicon': 'Deep Tech & Silicon',
      'news.cat_security': 'Cybersecurity',
      'news.cat_innovation': 'Innovation & Dev',
      'news.cat_bookmarks': 'Bookmarks',
      'news.tech_business': 'Tech Business & VC',
      'news.ai_ml': 'AI & Machine Learning',
      'news.deep_tech': 'Deep Tech & Silicon',
      'news.cybersec': 'Cybersecurity & Policy',
      'news.innovation': 'Tech Innovation',
      'news.bookmarks': 'Saved Bookmarks',
      'news.refresh': 'Refresh',
      'news.no_articles': 'No matching articles found',
      'news.no_articles_sub': 'Try searching for a different keyword or select another category above.',
      'news.playing_narration': 'Playing narration...',
      'news.ai_briefing_title': 'Aethera AI Executive Briefing',
      'news.modal_done': 'Done',
      'news.read_more': 'Read Story',
      'news.listen': 'Listen',
      'news.ai_summary': 'AI Summary',
      'news.min_read': 'min read',

      // Chatbot Global Component
      'chatbot.title': 'Aethera Assistant',
      'chatbot.status': 'Active // Gemini AI & Vision',
      'chatbot.today': 'Today',
      'chatbot.welcome': 'Hey there! 👋 I\'m Aethera. How\'s your day going? Feel free to chat about anything on your mind, bounce ideas around, share what you\'re working on, or drop a picture!',
      'chatbot.chip_note': '📝 Make a Note',
      'chatbot.chip_plan': '📅 Plan Tomorrow',
      'chatbot.chip_study': '📚 Schedule Study',
      'chatbot.chip_chat': 'How\'s your day going?',
      'chatbot.placeholder': 'Message Aethera...',
      'chatbot.attach_title': 'Attach Image or Screenshot (or paste with Ctrl+V)',

      // Learn Page (Academy)
      'learn.brand_title': 'Aethera Academy',
      'learn.badge': 'CURATED TECH & MATHEMATICS ACADEMY',
      'learn.hero_title': 'Tech & Mathematics Education',
      'learn.hero_desc': 'World-class, high-signal masterclasses in mathematics, algorithms, machine learning, systems architecture, and physics. Ad-free focused learning powered by top educators.',
      'learn.stat_masterclasses': 'Masterclasses',
      'learn.stat_disciplines': 'Key Disciplines',
      'learn.stat_free': 'Free Forever',
      'learn.stat_theater': 'Theater Mode',
      'learn.search_placeholder': 'Search math, algorithms, neural nets, architecture...',
      'learn.lvl_all': 'All Levels',
      'learn.lvl_beginner': 'Beginner',
      'learn.lvl_intermediate': 'Intermediate',
      'learn.lvl_advanced': 'Advanced',
      'learn.tab_all': 'All Lessons',
      'learn.tab_saved': 'Watchlist',
      'learn.cat_all': 'All Topics',
      'learn.cat_math': 'Mathematics & Calculus',
      'learn.cat_cs': 'Computer Science & Algorithms',
      'learn.cat_ai': 'AI & Neural Networks',
      'learn.cat_web': 'Software Architecture',
      'learn.cat_security': 'Cybersecurity',
      'learn.cat_physics': 'Physics & Quantum',
      'learn.theater_badge': 'AETHERA THEATER MODE',
      'learn.watch_on_yt': 'Open on YouTube',
      'learn.take_notes': 'Take Smart Notes',
      'learn.spotlight_badge': "EDITOR'S SPOTLIGHT MASTERCLASS",
      'learn.spotlight_cta': 'Watch Masterclass',
      'learn.play_in_main': 'Play in Main Player',
      'learn.play_inline': 'Watch Inline',
      'learn.close_inline': 'Close Video',
      'learn.now_playing': 'NOW PLAYING ON PAGE',
      'learn.expand_theater': 'Theater Mode',
      'learn.results_showing': 'Showing',
      'learn.results_of': 'of',
      'learn.results_masterclasses': 'masterclasses',
      'learn.reset_filters': 'Reset Filters',
      'learn.copy_link': 'Share',
      'learn.link_copied': 'Copied!',
      'learn.esc_hint': 'ESC to exit',
      'learn.search_shortcut': 'Press / to search',

      // Authentication
      'auth.sign_in': 'Sign In',
      'auth.create_account': 'Create Account',
      'auth.tab_signin': 'Sign In',
      'auth.tab_register': 'Create Account',
      'auth.username': 'Username',
      'auth.password': 'Password',
      'auth.username_label': 'Username',
      'auth.password_label': 'Password',
      'auth.username_placeholder': 'e.g. alex99',
      'auth.password_placeholder': '••••••••',
      'auth.btn_signin': 'Sign In',
      'auth.btn_register': 'Create Account',
      'auth.prompt_no_account': 'Need an account?',
      'auth.link_register': 'Create one',
      'auth.prompt_have_account': 'Already have an account?',
      'auth.link_signin': 'Sign In',
      'auth.confirm_password': 'Confirm Password',
      'auth.display_name': 'Display Name (Optional)',
      'auth.remember_me': 'Keep me signed in on this device',
      'auth.submit_signin': 'Sign In to Workspace',
      'auth.submit_signup': 'Create Free Account',
      'auth.guest_continue': 'Continue as Guest',
      'auth.processing': 'Processing...',
      'auth.signed_in_sync': 'Signed in! Syncing data...',
      'auth.registered_loading': 'Account created! Loading...',
      'auth.err_user_len': 'Username must be at least 3 characters.',
      'auth.err_pass_len': 'Password must be at least 6 characters.',

      // Aethera Academy (Learn / Tech & Math Videos)
      'learn.badge': 'Curated YouTube Masterclasses & Lectures',
      'learn.hero_title': 'Tech & Mathematics Education',
      'learn.hero_desc': 'Handpicked, world-class video lectures in calculus, linear algebra, algorithms, neural networks, and systems engineering from top university professors and creators — ad-free in theater mode.',
      'learn.stat_masterclasses': 'Masterclasses',
      'learn.stat_disciplines': 'Key Disciplines',
      'learn.stat_free': 'Free Forever',
      'learn.stat_theater': 'Theater Mode',
      'learn.daily_label': 'DAILY CURRICULUM DROP:',
      'learn.daily_synced': 'Refreshed daily from YouTube RSS feeds',
      'learn.refresh_btn': "Refresh Today's Videos",
      'learn.search_placeholder': 'Search math, calculus, neural networks, algorithms, or creators...',
      'learn.lvl_all': 'All Levels',
      'learn.lvl_beginner': 'Beginner',
      'learn.lvl_intermediate': 'Intermediate',
      'learn.lvl_advanced': 'Advanced',
      'learn.tab_all': 'All Lessons',
      'learn.tab_saved': 'Watchlist',
      'learn.cat_all': 'All Topics',
      'learn.cat_daily_drop': "Today's Daily Drop",
      'learn.cat_math': 'Mathematics & Calculus',
      'learn.cat_cs': 'Computer Science & Algorithms',
      'learn.cat_ai': 'AI & Neural Networks',
      'learn.cat_web': 'Software Architecture',
      'learn.cat_security': 'Cybersecurity',
      'learn.cat_physics': 'Physics & Quantum',
      'learn.results_showing': 'Showing',
      'learn.results_of': 'of',
      'learn.results_masterclasses': 'masterclasses',
      'learn.reset_filters': 'Reset Filters',
      'learn.daily_badge': '✨ DAILY DROP',
      'learn.refreshed_toast': 'Fresh daily educational videos fetched from YouTube!',

      // Aethera Arcade (Math & Computer Science Games)
      'games.badge': 'Interactive Math & Computer Science Arcade',
      'games.hero_title': 'Master Math & CS Through Play',
      'games.hero_desc': '10 gamified interactive simulators designed to build real computational intuition for binary bit manipulation, digital logic gates, Dijkstra graph traversal, matrix transformations, sorting algorithms, and calculus derivatives.',
      'games.stat_games': 'Interactive Games',
      'games.stat_solved': 'Puzzles Solved',
      'games.stat_mastery': 'Skill Mastery',
      'games.search_placeholder': 'Search binary, logic gates, matrix, sorting, regex, dijkstra, calculus...',
      'games.lvl_all': 'All Levels',
      'games.lvl_beginner': 'Beginner',
      'games.lvl_intermediate': 'Intermediate',
      'games.lvl_advanced': 'Advanced / Master',
      'games.cat_all': 'All 10 Games',
      'games.cat_cs': 'Computer Science',
      'games.cat_math': 'Mathematics & Calculus',
      'games.cat_alg': 'Algorithms & Graphs',
      'games.cat_logic': 'Logic & Puzzles'
    },

    id: {
      // Navigasi Umum
      'nav.home': 'Beranda',
      'nav.ai_tools': 'Alat AI',
      'nav.calendar': 'Kalender',
      'nav.notes': 'Catatan',
      'nav.news': 'Berita Teknologi',
      'nav.learn': 'Akademi',
      'nav.games': 'Arkade',
      'nav.tool_suite': 'Koleksi Alat',
      'nav.secops': 'Operasi Siber',
      'nav.benchmarks': 'Tolok Ukur',
      'nav.faq': 'Tanya Jawab',
      'nav.launch_studio': 'Buka Studio AI',
      'nav.sign_in': 'Masuk',
      'nav.sign_out': 'Keluar',
      'nav.overview': 'Ringkasan',
      'nav.tools': 'Alat',
      'nav.mobile_nav_title': 'Navigasi',
      'nav.mobile_ai': '⚡ Koleksi Alat AI',
      'nav.mobile_calendar': '📅 Kalender Interaktif',
      'nav.mobile_notes': '📝 Catatan Pintar',
      'nav.mobile_news': '📰 Berita Teknologi & Bisnis',
      'nav.mobile_learn': '🎓 Akademi Teknologi & Matematika',
      'nav.mobile_games': '🕹️ Arkade Matematika & CS',
      'nav.mobile_tools': '🛠️ Katalog Koleksi Alat',
      'nav.mobile_secops': '🛡️ Suite Keamanan Siber',
      'nav.mobile_benchmarks': '📊 Tolok Ukur AI',
      'nav.mobile_faq': '❓ Tanya Jawab & Panduan',

      // Bagian Hero (Landing Page)
      'hero.badge': 'SUITE PRODUKTIVITAS PRIBADI GENERASI BARU',
      'hero.title_prefix': 'AI Cerdas,',
      'hero.title_highlight': 'Untuk Produktivitas Harian.',
      'hero.subtitle': '20+ alat AI praktis yang dirancang untuk pelajar, kreator, profesional, dan pemecahan masalah sehari-hari. Tulis email sopan, selesaikan matematika langkah demi langkah, periksa kode dengan aman, rencanakan hari Anda, dan belajar dengan mudah.',
      'hero.cta_start': 'Buka Semua 20+ Alat Gratis →',
      'hero.cta_explore': 'Jelajahi Katalog',
      'hero.live_status': 'MESIN PROKSI LOKAL AKTIF',

      // Live AI Sandbox / Showcase
      'sandbox.title': 'Pratinjau Langsung Mesin AI',
      'sandbox.subtitle': 'Rasakan inferensi generatif multi-modal yang berjalan secara real-time.',
      'sandbox.tab_email': 'Penyusun Email',
      'sandbox.tab_code': 'Penjelas Kode',
      'sandbox.tab_study': 'Kartu Belajar',
      'sandbox.tab_meeting': 'Ringkasan Rapat',
      'sandbox.input_placeholder': 'Ketik prompt atau pilih preset di bawah...',
      'sandbox.btn_run': 'Jalankan Inferensi',
      'sandbox.btn_studio': 'Buka Studio AI Lengkap',
      'sandbox.output_label': 'HASIL RESPONS AI',

      // macOS AI Studio Showcase Window
      'mac.tab_chat': 'Chatbot AI',
      'mac.tab_email': 'Penyusun Email',
      'mac.tab_code': 'Pendeteksi Bug',
      'mac.tab_math': 'Penyelesai Kalkulus',
      'mac.nav_title': 'SUITE AI POPULER',
      'mac.nav_cve': 'CVE & SecOps',
      'mac.nav_resume': 'Pembuat Resume',
      'mac.launch_studio': 'Buka AI Studio ↗',
      'mac.bubble_you': 'Anda',
      'mac.bubble_time': 'Baru saja',
      'mac.bubble_friend': 'Teman Aethera',
      'mac.input_placeholder': 'Bebas mengobrol tentang apa saja, bertukar ide, atau belajar...',

      // Bagian Showcase (Kekacauan Mentah -> Kecerdasan Terstruktur)
      'showcase.title': 'Kekacauan Mentah ➔ Kecerdasan Terstruktur',
      'showcase.subtitle': 'Rasakan bagaimana Aethera mengubah masukan yang berantakan menjadi hasil yang rapi, terformat, dan siap pakai dalam hitungan milidetik.',
      'showcase.tab_notes': '1. Catatan Cepat ➔ Ringkasan Tim Jelas',
      'showcase.tab_math': '2. Soal Kalkulus ➔ Solusi Langkah demi Langkah',
      'showcase.tab_code': '3. Kode Bermasalah ➔ Perbaikan Bersih & Modern',
      'showcase.tab_cyber': '4. Keamanan Login ➔ Solusi Aman & Sederhana',
      'showcase.raw_label': 'MASUKAN MENTAH PENGGUNA',
      'showcase.ai_label': 'KOGNISI TERSTRUKTUR AETHERA',
      'showcase.unstructured': 'TIDAK TERSTRUKTUR',
      'showcase.ready': 'SIAP PUBLIKASI',
      'showcase.btn_try': 'Coba Langsung di Studio AI',

      // Bagian Fitur Utama & Koleksi Alat
      'features.badge': 'MODUL RUANG KERJA UTAMA',
      'features.title': 'Empat Disiplin. Satu Ekosistem Mengalir.',
      'features.subtitle': 'Dirancang untuk menghilangkan friksi kognitif antara perencanaan, penangkapan ide, pemantauan intelijen, dan eksekusi tugas.',
      'features.ai_title': 'Studio AI Cortex',
      'features.ai_desc': '14+ modul generatif harian mencakup audit kode, laporan strategis, skrip podcast, dan sintesis prompt.',
      'features.notes_title': 'Ruang Catatan Notion Pintar',
      'features.notes_desc': 'Editor kaya berbasis blok dengan perintah slash cepat (/), sinkronisasi basis data cloud multi-perangkat real-time, dan curah ide AI.',
      'features.cal_title': 'Kalender Matriks Kuantum',
      'features.cal_desc': 'Kalender pemblokiran waktu dipadukan dengan prioritas kuadran Eisenhower dan penjadwalan harian otomatis AI.',
      'features.news_title': 'Intelijen Teknologi & Bisnis',
      'features.news_desc': 'Umpan langsung agregasi otomatis yang menyaring teknologi mendalam, modal ventura, terobosan AI, dan keamanan siber.',
      'features.btn_explore': 'Jelajahi Modul',

      'tools.title': 'Alat Bermanfaat untuk Kerja, Belajar & Kehidupan Sehari-hari',
      'tools.subtitle': 'Dirancang agar menulis, belajar, mengatur jadwal, dan membuat kode terasa sederhana, ramah, dan bebas stres.',

      // Bento Grid - Kotak 01: Asisten Email & Pesan
      'tools.bento.c1_badge': 'KERJA & HIDUP',
      'tools.bento.c1_title': 'Asisten Email & Pesan',
      'tools.bento.c1_desc': 'Ubah poin-poin kasar menjadi email yang sopan, ramah, negosiasi gaji, kabar klien, dan tindak lanjut bijak.',
      'tools.bento.c1_mock_to_lbl': 'Kepada:',
      'tools.bento.c1_mock_sub_lbl': 'Subjek:',
      'tools.bento.c1_mock_sub_val': 'Pembaruan proyek cepat & langkah selanjutnya!',
      'tools.bento.c1_mock_body': '"Halo tim! Berikut ringkasan singkat yang kami selesaikan minggu ini, beserta langkah selanjutnya agar kita semua selaras..."',
      'tools.bento.c1_tag1': 'Nada Ramah',
      'tools.bento.c1_tag2': 'Tindak Lanjut Sopan',
      'tools.bento.c1_tag3': 'Pembaruan Jelas',
      'tools.bento.c1_tag4': 'Diskusi Gaji',
      'tools.bento.c1_btn': 'Buka Asisten Email',

      // Bento Grid - Kotak 02: Tutor Matematika Bertahap
      'tools.bento.c2_badge': 'AKADEMIK & MATEMATIKA',
      'tools.bento.c2_title': 'Tutor Matematika Bertahap',
      'tools.bento.c2_desc': 'Penjelasan yang jelas dan sabar untuk kalkulus, aljabar, persamaan, dan soal PR rumit yang ditata rapi agar mudah dimengerti.',
      'tools.bento.c2_formula_badge': 'Integral Gauss (Pembuktian Bertahap)',
      'tools.bento.c2_tag1': 'Aljabar & Kalkulus',
      'tools.bento.c2_tag2': 'Pembuktian Bertahap',
      'tools.bento.c2_tag3': 'Bantuan PR',
      'tools.bento.c2_tag4': 'Rumus & Grafik',
      'tools.bento.c2_btn': 'Buka Tutor Matematika',

      // Bento Grid - Kotak 03: Peringkas Dokumen Cepat
      'tools.bento.c3_badge': 'KERJA & BELAJAR',
      'tools.bento.c3_title': 'Peringkas Dokumen Cepat',
      'tools.bento.c3_desc': 'Ubah artikel panjang, catatan rapat, PDF, atau kuliah menjadi poin-poin ringkas dan mudah dipahami dalam hitungan detik.',
      'tools.bento.c3_tag1': 'Poin-Poin Utama',
      'tools.bento.c3_tag2': 'Poin Ringkas Cepat',
      'tools.bento.c3_tag3': 'Catatan Rapat',
      'tools.bento.c3_tag4': 'Panduan Belajar',
      'tools.bento.c3_btn': 'Buka Peringkas',

      // Bento Grid - Kotak 04: Perencana Hari & Rutinitas
      'tools.bento.c4_badge': 'PRODUKTIVITAS',
      'tools.bento.c4_title': 'Perencana Hari & Rutinitas',
      'tools.bento.c4_desc': 'Atur daftar tugas dengan fokus tenang, jadwal seimbang, dan blok waktu realistis yang menjaga hari Anda bebas stres.',
      'tools.bento.c4_pill1': 'Prioritas Utama Hari Ini',
      'tools.bento.c4_pill2': 'Waktu Kerja Fokus',
      'tools.bento.c4_tag1': 'Prioritas Harian',
      'tools.bento.c4_tag2': 'Timer Fokus',
      'tools.bento.c4_tag3': 'Blok Waktu',
      'tools.bento.c4_tag4': 'Kalender Tersinkron',
      'tools.bento.c4_btn1': 'Buka Perencana Hari',
      'tools.bento.c4_btn2': 'Buka Kalender',

      // Bento Grid - Kotak 05: Penjelas Kode & Cetak Biru Aplikasi
      'tools.bento.c5_badge': 'KODING & DESAIN APLIKASI',
      'tools.bento.c5_title': 'Penjelas Kode & Cetak Biru Aplikasi',
      'tools.bento.c5_desc': 'Pahami kode dalam bahasa sederhana, ketahui cara kerja program, dan rancang arsitektur aplikasi bersih dengan diagram visual sederhana.',
      'tools.bento.c5_node1': 'Pengguna',
      'tools.bento.c5_node2': 'Aplikasi Web',
      'tools.bento.c5_node3': 'Cache Cepat',
      'tools.bento.c5_node4': 'Basis Data',
      'tools.bento.c5_badge2': 'Cepat & Skalabel • Kode Bersih',
      'tools.bento.c5_tag1': 'Penjelasan Bahasa Mudah',
      'tools.bento.c5_tag2': 'Pemburu Bug',
      'tools.bento.c5_tag3': 'Bagan Alir Visual',
      'tools.bento.c5_tag4': 'Tips Performa',
      'tools.bento.c5_tag5': 'Cetak Biru Aplikasi',
      'tools.bento.c5_btn': 'Buka Alat Kode & Cetak Biru',

      // Bento Grid - Kotak 06: Perisai Keamanan & Keselamatan Online
      'tools.bento.c6_badge': 'KEAMANAN & KESELAMATAN',
      'tools.bento.c6_title': 'Perisai Keamanan & Keselamatan Online',
      'tools.bento.c6_desc': 'Pemeriksaan keamanan ramah, peringatan phishing, dan saran privasi sederhana untuk menjaga aplikasi serta data Anda aman tanpa istilah membingungkan.',
      'tools.bento.c6_stat1': 'Pemeriksaan Keamanan Dikenal',
      'tools.bento.c6_stat2': 'Kecepatan Periksa Instan',
      'tools.bento.c6_term_title': 'privacy.guard // AKTIF',
      'tools.bento.c6_term_log1': 'Perisai keselamatan & pemeriksaan privasi aktif',
      'tools.bento.c6_term_log2': '1 pembaruan cepat disarankan untuk privasi terbaik',
      'tools.bento.c6_term_log3': 'Solusi aman & sederhana siap diterapkan',
      'tools.bento.c6_term_log4': 'Semua aman dan terlindungi',
      'tools.bento.c6_tag1': 'Pemeriksaan Privasi',
      'tools.bento.c6_tag2': 'Peringatan Penipuan & Phishing',
      'tools.bento.c6_tag3': 'Tips Keamanan Praktis',
      'tools.bento.c6_btn': 'Buka Pemeriksaan Keamanan',

      // Bento Grid - Kotak 07: Tinjauan Kode Aman & Logika
      'tools.bento.c7_badge': 'KEAMANAN KODE',
      'tools.bento.c7_title': 'Tinjauan Kode Aman & Logika',
      'tools.bento.c7_desc': 'Tinjau kode, alur login, dan logika aplikasi Anda dari kesalahan umum, membantu Anda melindungi data pengguna dengan percaya diri.',
      'tools.bento.c7_tag1': 'Pemeriksaan Login Aman',
      'tools.bento.c7_tag2': 'Tinjauan Logika & Bug',
      'tools.bento.c7_tag3': 'Perlindungan Data',
      'tools.bento.c7_btn': 'Periksa Keamanan Kode',

      // Jalur Penjelajah Katalog & CTA Bawah
      'tools.bento.strip_title': 'JELAJAHI LEBIH BANYAK ALAT:',
      'tools.bento.strip_pill1': 'Pelatih Karir & Resume',
      'tools.bento.strip_pill2': 'Penjelajah Pengetahuan',
      'tools.bento.strip_pill3': 'Tinjauan Keamanan Kode',
      'tools.bento.strip_pill4': 'Cetak Biru Sistem & Aplikasi',
      'tools.bento.strip_pill5': '+14 Lainnya di Studio',
      'tools.bento.cta_all': 'Jelajahi Semua 20+ Alat AI Gratis',

      // Marquee Ticker
      'marquee.free': '100% GRATIS UNTUK SEMUA ORANG',
      'marquee.gemini': 'DITENAGAI OLEH GOOGLE GEMINI',
      'marquee.tools': '20+ ALAT HARIAN BERMANFAAT',
      'marquee.math': 'TUTOR MATEMATIKA BERTAHAP',
      'marquee.email': 'ASISTEN EMAIL JELAS & SOPAN',
      'marquee.fast': 'RESPONS SECEPAT KILAT',
      'marquee.secure': 'PRIVAT & AMAN SECARA DEFAULT',
      'marquee.doc': 'RINGKASAN DOKUMEN MUDAH',
      'marquee.routine': 'PERENCANA RUTINITAS & FOKUS HARIAN',
      'marquee.code': 'ASISTEN KODING & BUG RAMAH',

      // Bilah Akses Cepat (Quick Access)
      'qa.title': 'Akses Cepat',
      'qa.ai': 'Halaman Alat AI',
      'qa.calendar': 'Kalender',
      'qa.notes': 'Catatan Pintar',
      'qa.news': 'Berita Teknologi',
      'qa.learn': 'Akademi Teknologi & Matematika',
      'qa.chat': 'Obrolan Aethera',

      // Tolok Ukur (Benchmarks)
      'benchmarks.badge': 'TOLOK UKUR PERFORMA',
      'benchmarks.title': 'Akurasi Terpercaya untuk Belajar, Bekerja & Koding',
      'benchmarks.subtitle': 'Didukung oleh Google Gemini, Aethera memberikan jawaban yang jelas dan andal — baik saat Anda menyelesaikan soal matematika sulit, menulis dan memperbaiki kode, atau meneliti proyek.',
      'benchmarks.stat_coding': 'Akurasi Koding',
      'benchmarks.stat_math': 'Matematika & Sains',
      'benchmarks.stat_load': 'Waktu Muat Pertama',
      'benchmarks.stat_sync': 'Sinkron Basis Data',
      'benchmarks.stat_fps': 'Kecepatan Animasi',
      'benchmarks.stat_privacy': 'Privasi Klien',

      // Tanya Jawab (FAQ)
      'faq.badge': 'PERTANYAAN & JAWABAN',
      'faq.title': 'Semua Hal yang Perlu Anda Ketahui',
      'faq.subtitle': 'Jawaban cepat dan sederhana untuk membantu Anda memaksimalkan Aethera setiap hari.',
      'faq.q1': 'Apakah Aethera benar-benar gratis untuk digunakan?',
      'faq.a1': 'Ya, tentu saja! Setiap alat, ruang catatan pintar kami, berita teknologi langsung, dan asisten AI yang ramah 100% gratis untuk semua orang. Tanpa langganan, paywall, atau biaya tersembunyi.',
      'faq.q2': 'Bisakah Aethera membantu soal matematika dan tugas sekolah?',
      'faq.a2': 'Pasti! Saat Anda bertanya tentang aljabar, kalkulus, atau fisika, Aethera menguraikan solusi langkah demi langkah dan menampilkan rumus matematika yang rapi dan mudah dipahami.',
      'faq.q3': 'Bisakah saya menggunakan Aethera untuk email kerja dan menulis?',
      'faq.a3': 'Tentu saja! Aethera hadir untuk mempermudah hari Anda. Membantu menyusun email yang jelas, merangkum artikel panjang atau catatan kuliah, mengatur jadwal harian, hingga mempercantik resume Anda.',
      'faq.q4': 'Apa yang membuat Aethera begitu cepat dan membantu?',
      'faq.a4': 'Aethera ditenagai model Gemini terbaru dari Google, memberikan respons secepat kilat kapan pun Anda butuhkan — terhubung penuh dengan catatan, kalender, dan berita langsung.',

      // Footer
      'footer.tagline': 'Ruang kerja kognitif untuk pekerja harian, pemrogram, dan pelajar.',
      'footer.navigation': 'Navigasi',
      'footer.modules': 'Modul',
      'footer.resources': 'Sumber Daya',
      'footer.privacy': 'Kebijakan Privasi',
      'footer.terms': 'Syarat Layanan',
      'footer.rights': 'Hak cipta dilindungi undang-undang.',
      'footer.col_daily': 'Kehidupan Sehari-hari & Kerja',
      'footer.col_study': 'Alat Belajar & Koding',
      'footer.col_safety': 'Keamanan & Keselamatan',
      'footer.col_community': 'Status Komunitas',
      'footer.desc': '100% Intelijen kognitif terdesentralisasi gratis dan alat harian untuk pelajar, pekerja, dan pemrogram.',
      'footer.copy': '© 2026 AETHERA OPEN LABS. AKSES GRATIS & TERBUKA.',
      'footer.status': '100% AKSES GRATIS // AKTIF',

      // Halaman Kalender
      'cal.overview': 'Ringkasan',
      'cal.ai_studio': 'Studio AI',
      'cal.ai_integrated': 'AI INTEGRATED',
      'cal.today': 'Hari Ini',
      'cal.month': 'Bulan',
      'cal.week': 'Minggu',
      'cal.matrix': 'Matriks',
      'cal.agenda': 'Agenda',
      'cal.new_event': 'Acara Baru',
      'cal.cortex_planner': 'PERENCANA CORTEX',
      'cal.auto_sync': 'SINKRON OTOMATIS',
      'cal.ai_title': 'Asisten Jadwal AI',
      'cal.ai_desc': 'Ubah to-do berantakan atau catatan rapat menjadi jadwal prioritas Eisenhower dengan blok waktu.',
      'cal.auto_plan': 'Rencanakan Hari dengan AI',
      'cal.open_studio': 'Buka di Studio AI',
      'cal.filters': 'Filter Kategori',
      'cal.filter_title': 'Filter Kategori',
      'cal.eisenhower': 'Prioritas Eisenhower',
      'cal.all_categories': 'Semua Kategori',
      'cal.cat_all': 'Semua Kategori',
      'cal.cat_deep_work': 'Kerja Fokus',
      'cal.cat_meeting': 'Rapat & Sinkronisasi',
      'cal.cat_study': 'Belajar & Akademik',
      'cal.cat_deadline': 'Tenggat Waktu & Keamanan',
      'cal.cat_personal': 'Pribadi & Kesehatan',
      'cal.cat_work': 'Pekerjaan Umum',
      'cal.cat_opt_deep_work': 'Kerja Fokus / Koding',
      'cal.cat_opt_meeting': 'Rapat / Sinkronisasi',
      'cal.cat_opt_study': 'Belajar / Akademik',
      'cal.cat_opt_deadline': 'Tenggat Waktu / Hasil Kerja',
      'cal.cat_opt_personal': 'Pribadi / Kesehatan',
      'cal.cat_opt_work': 'Pekerjaan Umum',
      'cal.day_mon': 'Sen',
      'cal.day_tue': 'Sel',
      'cal.day_wed': 'Rab',
      'cal.day_thu': 'Kam',
      'cal.day_fri': 'Jum',
      'cal.day_sat': 'Sab',
      'cal.day_sun': 'Min',
      'cal.rate_label': 'TINGKAT PENYELESAIAN',
      'cal.clear_label': 'Jadwal Bersih',
      'cal.no_tasks': 'Tidak ada tugas hari ini',
      'cal.reset_btn': 'Atur Ulang Kalender',
      'cal.state_clean': 'STATUS // BERSIH',
      'cal.day_agenda': 'AGENDA HARI INI',
      'cal.add_task': 'Tambah',
      'cal.quick_placeholder': 'Tambah tugas cepat (cth. 14:00 Rapat Tim)...',
      'cal.matrix_heading': 'Matriks Keputusan Eisenhower',
      'cal.matrix_desc': 'Atur tugas berdasarkan urgensi dan kepentingan untuk menghilangkan distraksi dan memaksimalkan hasil kerja.',
      'cal.matrix_add_btn': 'Tambah Tugas ke Matriks',
      'cal.q1_title': 'Mendesak & Penting',
      'cal.q2_title': 'Penting, Tidak Mendesak',
      'cal.q3_title': 'Mendesak, Tidak Penting',
      'cal.q4_title': 'Tidak Mendesak & Tidak Penting',
      'cal.q1_action': 'KERJAKAN DULU',
      'cal.q2_action': 'JADWALKAN / KERJA FOKUS',
      'cal.q3_action': 'DELEGASIKAN / GABUNGKAN',
      'cal.q4_action': 'HAPUS / ISTIRAHAT',
      'cal.modal_create': 'Buat Acara Baru',
      'cal.modal_event_title': 'Buat Acara Kalender',
      'cal.modal_event_label': 'Judul & Tujuan Acara',
      'cal.modal_event_ph': 'cth. Kerja Fokus // Penataan Ulang Kode',
      'cal.modal_title_label': 'Judul Acara',
      'cal.modal_time_label': 'Waktu & Tanggal',
      'cal.modal_date': 'Tanggal',
      'cal.modal_start': 'Waktu Mulai',
      'cal.modal_end': 'Waktu Selesai',
      'cal.modal_category_label': 'Kategori',
      'cal.modal_priority_label': 'Kuadran Prioritas',
      'cal.modal_quadrant': 'Kuadran Prioritas Eisenhower',
      'cal.modal_notes': 'Catatan & Rincian',
      'cal.modal_notes_ph': 'Catatan opsional, hasil tugas, tautan, atau instruksi prompt AI...',
      'cal.modal_save': 'Simpan Acara',
      'cal.modal_cancel': 'Batal',
      'cal.modal_ai_heading': 'Pembuat Jadwal AI',
      'cal.modal_ai_prompt_lbl': 'Jelaskan tujuan, to-do, atau rapat Anda hari ini',
      'cal.modal_ai_prompt_ph': 'cth. Saya ada rapat klien pukul 10:00 - 11:30, butuh 2 jam koding fokus, 1 jam belajar kalkulus, dan gym jam 5 sore...',
      'cal.modal_ai_date_lbl': 'Tanggal Target',
      'cal.modal_ai_gen_btn': 'Buat Jadwal',
      'cal.modal_ai_confirm': 'Konfirmasi & Masukkan ke Kalender',
      'cal.modal_ai_parsed_lbl': 'Blok Waktu & Kuadran Prioritas yang Dihasilkan',
      'cal.day_quick_ph': 'Tambah cepat acara pada tanggal ini (cth. 14:00 Tinjauan Arsitektur)...',
      'cal.day_events_heading': 'Acara pada',
      'cal.no_events_on_day': 'Tidak ada acara terjadwal untuk hari ini',
      'cal.no_events_on_day_desc': 'Jadwal Anda sepenuhnya bersih pada tanggal ini. Buat acara baru atau biarkan AI merencanakannya untuk Anda.',
      'cal.synced_with_account': 'Tersinkronisasi dengan akun',
      'cal.sync_now_btn': 'Sinkronkan Sekarang',
      'cal.syncing_status': 'Menyinkronkan dengan cloud...',
      'cal.guest_sync_hint': 'Penyimpanan lokal (Masuk untuk sinkronisasi antar perangkat)',
      'cal.events_count_label': 'acara',
      'cal.completed_count_label': 'selesai',

      // Halaman Studio AI
      'studio.overview': 'Ringkasan',
      'studio.calendar': 'Kalender',
      'studio.free_badge': '100% AKSES GRATIS',
      'studio.tools': 'Alat',
      'studio.api_status': 'STATUS API:',
      'studio.connected': 'TERHUBUNG // AKTIF',
      'studio.clear_session': 'Hapus Sesi',
      'studio.select_tool': 'Pilih Alat AI (14+)',
      'studio.generate_btn': 'Hasilkan dengan AI',
      'studio.stop_btn': 'Hentikan',
      'studio.input_label': 'PROMPT & KONTEKS MASUKAN',
      'studio.output_label': 'HASIL GENERASI AI',
      'studio.copy_btn': 'Salin',
      'studio.notes_export': 'Simpan ke Catatan',
      'studio.cat_conversational': 'AI PERCAKAPAN',
      'studio.cat_daily': 'KEHIDUPAN SEHARI-HARI & KERJA',
      'studio.cat_study': 'BELAJAR & AKADEMIK',
      'studio.cat_developer': 'BANTUAN KODING & TEKNOLOGI',
      'studio.cat_cybersecurity': 'KEAMANAN & KESELAMATAN ONLINE',
      'studio.quick_templates': 'TEMPLAT CEPAT',
      'studio.tool_chatbot_title': 'Obrolan Santai',
      'studio.tool_chatbot_sub': 'Bebas membicarakan apa pun yang Anda pikirkan',
      'studio.tool_email_title': 'Asisten Email & Pesan',
      'studio.tool_email_sub': 'Pesan ramah, jelas & balasan cepat',
      'studio.tool_doc_title': 'Peringkas Cepat',
      'studio.tool_doc_sub': 'Ubah bacaan panjang jadi poin mudah',
      'studio.tool_task_title': 'Perencana Hari & Rutinitas',
      'studio.tool_task_sub': 'Atur tugas Anda dengan fokus tenang',
      'studio.tool_resume_title': 'Pelatih Karir & Resume',
      'studio.tool_resume_sub': 'Resume memikat & surat lamaran hangat',
      'studio.tool_trans_title': 'Sahabat Bahasa & Tata Bahasa',
      'studio.tool_trans_sub': 'Terjemahan alami & ungkapan luwes',
      'studio.tool_math_title': 'Tutor Matematika Bertahap',
      'studio.tool_math_sub': 'Penjelasan jelas yang mudah dimengerti',
      'studio.tool_essay_title': 'Mitra Menulis & Esai',
      'studio.tool_essay_sub': 'Curah ide, kerangka tulisan & draf',
      'studio.tool_exam_title': 'Teman Belajar & Kartu Latihan',
      'studio.tool_exam_sub': 'Kuis ringkas & kartu latihan belajar',
      'studio.tool_research_title': 'Penjelajah Pengetahuan & Riset',
      'studio.tool_research_sub': 'Jelajahi topik apa pun dengan bahasa santai',
      'studio.tool_code_title': 'Penjelas Kode',
      'studio.tool_code_sub': 'Pahami potongan kode dengan mudah & jelas',
      'studio.tool_bug_title': 'Dokter & Pemecah Bug',
      'studio.tool_bug_sub': 'Temukan & perbaiki eror tanpa stres',
      'studio.tool_converter_title': 'Penerjemah Bahasa Kode',
      'studio.tool_converter_sub': 'Ubah bahasa koding dengan lancar',
      'studio.tool_sql_title': 'Asisten Basis Data & SQL',
      'studio.tool_sql_sub': 'Kueri sederhana & tabel terorganisir',
      'studio.tool_regex_title': 'Panduan Pola & API',
      'studio.tool_regex_sub': 'Susun pola teks & uji panggilan web',
      'studio.tool_arch_title': 'Cetak Biru Sistem & Aplikasi',
      'studio.tool_arch_sub': 'Rancang arsitektur aplikasi & diagram rapi',
      'studio.tool_vuln_title': 'Pemeriksaan Keamanan',
      'studio.tool_vuln_sub': 'Deteksi risiko keamanan & solusi mudah',
      'studio.tool_threat_title': 'Perisai Ancaman & Phishing',
      'studio.tool_threat_sub': 'Analisis email mencurigakan & peringatan',
      'studio.tool_payload_title': 'Keamanan Kode & Audit Kontrak',
      'studio.tool_payload_sub': 'Jaga aplikasi web & kontrak tetap aman',
      'studio.tool_net_title': 'Penjaga Jaringan & Lalu Lintas',
      'studio.tool_net_sub': 'Tinjau lalu lintas & firewall sederhana',
      'studio.tool_crypto_title': 'Brankas Privasi & Enkripsi',
      'studio.tool_crypto_sub': 'Amankan kata sandi & data pribadi Anda',
      'studio.welcome_author': 'Asisten Aethera // Siap Membantu',
      'studio.welcome_text': 'Selamat datang di Studio AI Gratis Aethera! Pilih asisten mana saja di sebelah kiri untuk memulai—baik untuk obrolan santai, bantuan menulis email & resume sopan, tutor matematika & teman belajar yang sabar, tips koding & perbaikan bug, atau pemeriksaan privasi & keamanan. Kami siap membantu!',
      'studio.input_ph': 'Ketik permintaan Anda, tempel catatan, atau lampirkan gambar (diagram, rumus matematika, tangkapan layar, PR)...',
      'studio.attach_btn': 'Lampirkan Gambar',
      'studio.run_btn': 'Jalankan AI',
      'studio.tag_chat': 'OBROLAN SANTAI',
      'studio.tag_vision': 'AI PENGLIHATAN',
      'studio.tag_free': '100% GRATIS',
      'studio.modal_title': 'Mesin AI Gemini & Kunci API',
      'studio.modal_desc': 'Aethera terhubung ke Google Gemini untuk penglihatan multimodal langsung, pembuatan kode, dan matematika LaTeX. Masukkan kunci API Google AI Studio gratis Anda di bawah untuk mengaktifkan inferensi langsung.',
      'studio.modal_key_lbl': 'Kunci API Google AI Studio',
      'studio.modal_saved_hint': 'Tersimpan di penyimpanan lokal perangkat Anda',
      'studio.modal_get_key': 'Dapatkan Kunci Gratis →',
      'studio.modal_model_lbl': 'Pilihan Model Gemini',
      'studio.modal_clear': 'Hapus Kunci',
      'studio.modal_test': 'Uji Kunci',
      'studio.modal_save': 'Simpan & Terapkan',

      // Halaman Catatan (Notes)
      'notes.home': 'Beranda',
      'notes.recents': 'Terbaru',
      'notes.private': 'Pribadi',
      'notes.add_page': 'Tambah halaman',
      'notes.search_placeholder': 'Cari catatan atau tanya AI...',
      'notes.upcoming_events': 'Acara Mendatang',
      'notes.upcoming_desc': 'Hubungkan kalender Anda untuk melihat semua acara dan mencatat notula rapat.',
      'notes.quick_search': 'Pencarian cepat di semua catatan (Ctrl+K)',
      'notes.new_note': 'Halaman baru',
      'notes.delete_note': 'Hapus halaman',
      'notes.add_cover': 'Tambah sampul',
      'notes.remove_cover': 'Hapus sampul',
      'notes.change_icon': 'Klik untuk ubah ikon',
      'notes.untitled': 'Halaman baru',
      'notes.date_lbl': 'Tanggal:',
      'notes.folder_lbl': 'Folder:',
      'notes.synced_cloud': 'Tersinkronisasi ke cloud',
      'notes.saving': 'Menyimpan...',
      'notes.edited_now': 'Baru saja diedit',
      'notes.share': 'Bagikan',
      'notes.empty_starter': 'Mulai cepat dengan',
      'notes.starter_draft': 'Mulai draf',
      'notes.starter_brainstorm': 'Curah ide',
      'notes.starter_research': 'Riset topik',
      'notes.starter_meeting': 'Catatan Rapat AI',
      'notes.starter_database': 'Basis Data',
      'notes.slash_basic': 'Blok Dasar',
      'notes.slash_text': 'Teks',
      'notes.slash_text_desc': 'Mulai menulis dengan teks biasa.',
      'notes.slash_h1': 'Judul 1',
      'notes.slash_h1_desc': 'Judul bagian besar.',
      'notes.slash_h2': 'Judul 2',
      'notes.slash_h2_desc': 'Judul bagian sedang.',
      'notes.slash_h3': 'Judul 3',
      'notes.slash_h3_desc': 'Judul bagian kecil.',
      'notes.slash_todo': 'Daftar tugas',
      'notes.slash_todo_desc': 'Pantau tugas dengan centang checklist.',
      'notes.slash_bullet': 'Daftar berpoin',
      'notes.slash_bullet_desc': 'Buat daftar poin sederhana.',
      'notes.slash_num': 'Daftar bernomor',
      'notes.slash_num_desc': 'Buat daftar dengan urutan angka.',
      'notes.slash_media': 'Media & Tingkat Lanjut',
      'notes.slash_callout': 'Kotak Sorotan',
      'notes.slash_callout_desc': 'Tonjolkan tulisan dengan ikon menarik.',
      'notes.slash_code': 'Blok Kode',
      'notes.slash_code_desc': 'Tulis potongan kode dengan pewarnaan sintaks.',
      'notes.slash_quote': 'Kutipan',
      'notes.slash_quote_desc': 'Simpan kutipan atau poin penting.',
      'notes.slash_divider': 'Garis Pembatas',
      'notes.slash_divider_desc': 'Bagi blok secara visual dengan garis tipis.',
      'notes.slash_table': 'Tabel Kisi',
      'notes.slash_table_desc': 'Sisipkan tabel kisi terstruktur yang dapat diedit.',
      'notes.slash_date': 'Tanggal Hari Ini',
      'notes.slash_date_desc': 'Sisipkan cap tanggal terformat hari ini.',
      'notes.slash_cal_event': 'Acara Kalender',
      'notes.slash_cal_event_desc': 'Tambah acara terhubung langsung ke Kalender.',
      'notes.slash_matrix': 'Matriks Eisenhower',
      'notes.slash_matrix_desc': 'Sisipkan checklist prioritas 4 kuadran.',
      'notes.slash_ai_cat': 'Asisten AI',
      'notes.slash_ai': 'Tanya AI Aethera',
      'notes.slash_ai_desc': 'Tulis draf, rangkum, atau curah ide bersama AI.',
      'notes.slash_summary': 'Ringkasan Catatan AI',
      'notes.slash_summary_desc': 'Ekstrak wawasan dan poin penting bersama AI.',
      'notes.slash_actions': 'Tindakan AI',
      'notes.slash_actions_desc': 'Ekstrak tugas checklist dapat dilakukan dari catatan ini.',
      'cal.slash_cmd': 'Perintah',

      // Halaman Berita (News)
      'news.overview': 'Ringkasan',
      'news.brand_title': 'Aethera Detak Teknologi',
      'news.breaking': 'Kilas Berita Teknologi',
      'news.ticker_label': 'Kilas Berita Teknologi',
      'news.hero_title': 'Berita Teknologi & Bisnis',
      'news.hero_desc': 'Intelijen berkelanjutan teragregasi dari TechCrunch, Ars Technica, Hacker News, dan Pasar Global. Diperbarui otomatis setiap 5 menit dengan ringkasan AI dan narasi suara.',
      'news.updating_live': 'Memperbarui umpan berita...',
      'news.refresh_btn': 'Segarkan',
      'news.search_placeholder': 'Cari berita teknologi, AI, startup, silikon...',
      'news.sort_lbl': 'Urutkan:',
      'news.sort_newest': 'Paling Baru',
      'news.sort_readtime': 'Waktu Baca',
      'news.all_stories': 'Semua Berita',
      'news.cat_all': 'Semua Berita',
      'news.cat_business': 'Bisnis & Modal Ventura',
      'news.cat_ai': 'AI & Generatif',
      'news.cat_silicon': 'Teknologi Mendalam & Silikon',
      'news.cat_security': 'Keamanan Siber',
      'news.cat_innovation': 'Inovasi & Pengembang',
      'news.cat_bookmarks': 'Tersimpan',
      'news.tech_business': 'Bisnis & Modal Ventura',
      'news.ai_ml': 'AI & Pembelajaran Mesin',
      'news.deep_tech': 'Teknologi Mendalam & Silikon',
      'news.cybersec': 'Keamanan Siber & Kebijakan',
      'news.innovation': 'Inovasi Teknologi',
      'news.bookmarks': 'Tersimpan',
      'news.refresh': 'Segarkan',
      'news.no_articles': 'Tidak ada artikel yang cocok',
      'news.no_articles_sub': 'Coba cari dengan kata kunci berbeda atau pilih kategori lain di atas.',
      'news.playing_narration': 'Memutar narasi...',
      'news.ai_briefing_title': 'Ringkasan Eksekutif AI Aethera',
      'news.modal_done': 'Selesai',
      'news.read_more': 'Baca Selengkapnya',
      'news.listen': 'Dengarkan',
      'news.ai_summary': 'Ringkasan AI',
      'news.min_read': 'menit baca',

      // Chatbot Komponen Global
      'chatbot.title': 'Asisten Aethera',
      'chatbot.status': 'Aktif // Gemini AI & Penglihatan',
      'chatbot.today': 'Hari Ini',
      'chatbot.welcome': 'Halo! 👋 Saya Aethera. Bagaimana hari Anda? Bebas mengobrol tentang apa saja, bertukar ide, ceritakan apa yang sedang Anda kerjakan, atau kirim gambar!',
      'chatbot.chip_note': '📝 Buat Catatan',
      'chatbot.chip_plan': '📅 Rencana Besok',
      'chatbot.chip_study': '📚 Jadwal Belajar',
      'chatbot.chip_chat': 'Bagaimana harimu?',
      'chatbot.placeholder': 'Kirim pesan ke Aethera...',
      'chatbot.attach_title': 'Lampirkan Gambar atau Tangkapan Layar (atau tempel dengan Ctrl+V)',

      // Halaman Belajar (Akademi)
      'learn.brand_title': 'Akademi Aethera',
      'learn.badge': 'AKADEMI TEKNOLOGI & MATEMATIKA PILIHAN',
      'learn.hero_title': 'Edukasi Teknologi & Matematika',
      'learn.hero_desc': 'Masterclass kelas dunia dengan materi berbobot tinggi dalam matematika, algoritma, machine learning, arsitektur sistem, dan fisika komputasi. Pembelajaran bebas distraksi dari pendidik terbaik.',
      'learn.stat_masterclasses': 'Masterclass',
      'learn.stat_disciplines': 'Disiplin Utama',
      'learn.stat_free': 'Gratis Selamanya',
      'learn.stat_theater': 'Mode Bioskop',
      'learn.search_placeholder': 'Cari matematika, kalkulus, neural net, arsitektur...',
      'learn.lvl_all': 'Semua Tingkat',
      'learn.lvl_beginner': 'Pemula',
      'learn.lvl_intermediate': 'Menengah',
      'learn.lvl_advanced': 'Lanjutan',
      'learn.tab_all': 'Semua Pelajaran',
      'learn.tab_saved': 'Daftar Simpan',
      'learn.cat_all': 'Semua Topik',
      'learn.cat_math': 'Matematika & Kalkulus',
      'learn.cat_cs': 'Ilmu Komputer & Algoritma',
      'learn.cat_ai': 'AI & Jaringan Saraf',
      'learn.cat_web': 'Arsitektur Perangkat Lunak',
      'learn.cat_security': 'Keamanan Siber',
      'learn.cat_physics': 'Fisika & Kuantum',
      'learn.theater_badge': 'MODE BIOSKOP AETHERA',
      'learn.watch_on_yt': 'Buka di YouTube',
      'learn.take_notes': 'Buat Catatan Pintar',
      'learn.spotlight_badge': 'MASTERCLASS PILIHAN KURATOR',
      'learn.spotlight_cta': 'Tonton Masterclass',
      'learn.play_in_main': 'Putar di Pemutar Utama',
      'learn.play_inline': 'Tonton di Sini',
      'learn.close_inline': 'Tutup Video',
      'learn.now_playing': 'SEDANG DIPUTAR DI HALAMAN',
      'learn.expand_theater': 'Mode Bioskop',
      'learn.results_showing': 'Menampilkan',
      'learn.results_of': 'dari',
      'learn.results_masterclasses': 'masterclass',
      'learn.reset_filters': 'Atur Ulang Filter',
      'learn.copy_link': 'Bagikan',
      'learn.link_copied': 'Tersalin!',
      'learn.esc_hint': 'ESC untuk keluar',
      'learn.search_shortcut': 'Tekan / untuk cari',

      // Autentikasi / Masuk
      'auth.sign_in': 'Masuk',
      'auth.create_account': 'Buat Akun',
      'auth.tab_signin': 'Masuk',
      'auth.tab_register': 'Buat Akun',
      'auth.username': 'Nama Pengguna',
      'auth.password': 'Kata Sandi',
      'auth.username_label': 'Nama Pengguna',
      'auth.password_label': 'Kata Sandi',
      'auth.username_placeholder': 'cth. alex99',
      'auth.password_placeholder': '••••••••',
      'auth.btn_signin': 'Masuk',
      'auth.btn_register': 'Buat Akun',
      'auth.prompt_no_account': 'Belum punya akun?',
      'auth.link_register': 'Daftar sekarang',
      'auth.prompt_have_account': 'Sudah punya akun?',
      'auth.link_signin': 'Masuk',
      'auth.confirm_password': 'Konfirmasi Kata Sandi',
      'auth.display_name': 'Nama Tampilan (Opsional)',
      'auth.remember_me': 'Tetap masuk di perangkat ini',
      'auth.submit_signin': 'Masuk ke Ruang Kerja',
      'auth.submit_signup': 'Buat Akun Gratis',
      'auth.guest_continue': 'Lanjutkan sebagai Tamu',
      'auth.processing': 'Memproses...',
      'auth.signed_in_sync': 'Berhasil masuk! Menyinkronkan data...',
      'auth.registered_loading': 'Akun dibuat! Memuat...',
      'auth.err_user_len': 'Nama pengguna minimal 3 karakter.',
      'auth.err_pass_len': 'Kata sandi minimal 6 karakter.',

      // Aethera Akademi (Pendidikan Video Teknologi & Matematika)
      'learn.badge': 'Masterclass & Kuliah YouTube Terpilih',
      'learn.hero_title': 'Pendidikan Teknologi & Matematika',
      'learn.hero_desc': 'Kuliah video berkelas dunia pilihan dalam kalkulus, aljabar linear, algoritma, jaringan saraf, dan rekayasa sistem dari profesor dan kreator universitas top — bebas iklan dalam mode bioskop.',
      'learn.stat_masterclasses': 'Masterclass',
      'learn.stat_disciplines': 'Disiplin Utama',
      'learn.stat_free': 'Gratis Selamanya',
      'learn.stat_theater': 'Mode Bioskop',
      'learn.daily_label': 'RILIS KURIKULUM HARIAN:',
      'learn.daily_synced': 'Diperbarui setiap hari dari umpan RSS YouTube',
      'learn.refresh_btn': 'Perbarui Video Hari Ini',
      'learn.search_placeholder': 'Cari matematika, kalkulus, jaringan saraf, algoritma, atau kreator...',
      'learn.lvl_all': 'Semua Tingkat',
      'learn.lvl_beginner': 'Pemula',
      'learn.lvl_intermediate': 'Menengah',
      'learn.lvl_advanced': 'Lanjutan',
      'learn.tab_all': 'Semua Pelajaran',
      'learn.tab_saved': 'Daftar Putar',
      'learn.cat_all': 'Semua Topik',
      'learn.cat_daily_drop': 'Rilis Harian Hari Ini',
      'learn.cat_math': 'Matematika & Kalkulus',
      'learn.cat_cs': 'Ilmu Komputer & Algoritma',
      'learn.cat_ai': 'AI & Jaringan Saraf',
      'learn.cat_web': 'Arsitektur Perangkat Lunak',
      'learn.cat_security': 'Keamanan Siber',
      'learn.cat_physics': 'Fisika & Kuantum',
      'learn.results_showing': 'Menampilkan',
      'learn.results_of': 'dari',
      'learn.results_masterclasses': 'masterclass',
      'learn.reset_filters': 'Atur Ulang Filter',
      'learn.daily_badge': '✨ RILIS HARIAN',
      'learn.refreshed_toast': 'Video pendidikan harian terbaru berhasil diperbarui dari YouTube!',

      // Aethera Arcade (Permainan Matematika & Ilmu Komputer)
      'games.badge': 'Arkade Interaktif Matematika & Ilmu Komputer',
      'games.hero_title': 'Kuasai Matematika & CS Lewat Permainan',
      'games.hero_desc': '10 simulator interaktif tergamifikasi yang dirancang untuk membangun intuisi komputasi nyata: manipulasi bit biner, gerbang logika digital, graf Dijkstra, transformasi matriks, algoritma pengurutan, dan turunan kalkulus.',
      'games.stat_games': 'Permainan Interaktif',
      'games.stat_solved': 'Teka-Teki Terpecahkan',
      'games.stat_mastery': 'Penguasaan Keahlian',
      'games.search_placeholder': 'Cari biner, gerbang logika, matriks, sorting, regex, dijkstra, kalkulus...',
      'games.lvl_all': 'Semua Tingkat',
      'games.lvl_beginner': 'Pemula',
      'games.lvl_intermediate': 'Menengah',
      'games.lvl_advanced': 'Lanjutan / Master',
      'games.cat_all': 'Semua 10 Permainan',
      'games.cat_cs': 'Ilmu Komputer',
      'games.cat_math': 'Matematika & Kalkulus',
      'games.cat_alg': 'Algoritma & Graf',
      'games.cat_logic': 'Logika & Teka-Teki'
    }
  };

  class AetheraI18n {
    constructor() {
      this.storageKey = 'aethera_language';
      this.currentLang = this._loadLanguage();
      this.init();
    }

    _loadLanguage() {
      try {
        const saved = localStorage.getItem(this.storageKey) || localStorage.getItem('aethera_lang');
        if (saved === 'id' || saved === 'en') return saved;
      } catch (_) { }
      return 'en';
    }

    init() {
      // Set html lang attribute
      document.documentElement.setAttribute('lang', this.currentLang);

      // Auto-inject language toggle widget on DOM load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.autoInjectSelectors();
          this.applyTranslations();
        });
      } else {
        this.autoInjectSelectors();
        this.applyTranslations();
      }
    }

    getLanguage() {
      return this.currentLang;
    }

    getLang() {
      return this.getLanguage();
    }

    setLanguage(lang) {
      if (lang !== 'en' && lang !== 'id') return;

      this.currentLang = lang;
      try {
        localStorage.setItem(this.storageKey, lang);
        localStorage.setItem('aethera_lang', lang);
      } catch (_) { }

      document.documentElement.setAttribute('lang', lang);

      // Add gentle transition class if body is available
      if (document.body && document.body.classList) {
        document.body.classList.add('i18n-transitioning');
        setTimeout(() => {
          if (document.body && document.body.classList) {
            document.body.classList.remove('i18n-transitioning');
          }
        }, 150);
      }

      this.applyTranslations();
      this.updateSelectorStates();

      // Dispatch event for dynamic sub-components (chatbot, news feed, quick-access, notes)
      if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        window.dispatchEvent(new CustomEvent('aethera:language-change', { detail: { lang } }));
      }
    }

    toggleLanguage() {
      this.setLanguage(this.currentLang === 'en' ? 'id' : 'en');
    }

    t(key, fallback = '') {
      const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
      if (dict && dict[key] !== undefined) {
        return dict[key];
      }
      const fallbackDict = TRANSLATIONS.en;
      return (fallbackDict && fallbackDict[key] !== undefined) ? fallbackDict[key] : (fallback || key);
    }

    applyTranslations(root = document) {
      // 1. Text / innerHTML translation
      const elements = root.querySelectorAll('[data-i18n]');
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = this.t(key);
        if (translated) {
          el.textContent = translated;
        }
      });

      // 2. Placeholders
      const placeholders = root.querySelectorAll('[data-i18n-placeholder]');
      placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translated = this.t(key);
        if (translated) {
          el.setAttribute('placeholder', translated);
        }
      });

      // 3. Titles / Tooltips
      const titles = root.querySelectorAll('[data-i18n-title]');
      titles.forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const translated = this.t(key);
        if (translated) {
          el.setAttribute('title', translated);
        }
      });

      // 4. Aria Labels
      const arias = root.querySelectorAll('[data-i18n-aria]');
      arias.forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        const translated = this.t(key);
        if (translated) {
          el.setAttribute('aria-label', translated);
        }
      });
    }

    createSelectorEl(compact = false) {
      const wrap = document.createElement('div');
      wrap.className = `aethera-lang-toggle ${compact ? 'compact' : ''}`;
      wrap.setAttribute('role', 'group');
      wrap.setAttribute('aria-label', 'Language Selector');

      wrap.innerHTML = `
        <div class="aethera-lang-globe" aria-hidden="true" title="Language">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <button type="button" class="aethera-lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en" aria-label="Switch to English" title="English">EN</button>
        <button type="button" class="aethera-lang-btn ${this.currentLang === 'id' ? 'active' : ''}" data-lang="id" aria-label="Ganti ke Bahasa Indonesia" title="Bahasa Indonesia">ID</button>
      `;

      wrap.querySelectorAll('.aethera-lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetLang = btn.getAttribute('data-lang');
          this.setLanguage(targetLang);
        });
      });

      return wrap;
    }

    autoInjectSelectors() {
      // 1. Explicit slot if provided
      const customSlots = document.querySelectorAll('.navbar-lang-slot, #navbar-lang-slot');
      if (customSlots.length > 0) {
        customSlots.forEach(slot => {
          if (!slot.querySelector('.aethera-lang-toggle')) {
            slot.appendChild(this.createSelectorEl(false));
          }
        });
        return;
      }

      // 2. Landing Page Navigation (.nav-actions right before #theme-toggle)
      const navActions = document.querySelector('.nav-actions');
      if (navActions && !navActions.querySelector('.aethera-lang-toggle')) {
        const themeToggle = navActions.querySelector('#theme-toggle');
        const selector = this.createSelectorEl(false);
        if (themeToggle) {
          navActions.insertBefore(selector, themeToggle);
        } else {
          navActions.appendChild(selector);
        }
      }

      // 3. Calendar Header (.cal-header-right right before #theme-toggle)
      const calHeaderRight = document.querySelector('.cal-header-right');
      if (calHeaderRight && !calHeaderRight.querySelector('.aethera-lang-toggle')) {
        const themeToggle = calHeaderRight.querySelector('#theme-toggle');
        const selector = this.createSelectorEl(false);
        if (themeToggle) {
          calHeaderRight.insertBefore(selector, themeToggle);
        } else {
          calHeaderRight.appendChild(selector);
        }
      }

      // 4. AI Studio Header (.studio-header-right right before #theme-toggle)
      const studioHeaderRight = document.querySelector('.studio-header-right');
      if (studioHeaderRight && !studioHeaderRight.querySelector('.aethera-lang-toggle')) {
        const themeToggle = studioHeaderRight.querySelector('#theme-toggle');
        const selector = this.createSelectorEl(false);
        if (themeToggle) {
          studioHeaderRight.insertBefore(selector, themeToggle);
        } else {
          studioHeaderRight.appendChild(selector);
        }
      }

      // 5. News Header (.news-header-right right before #news-theme-toggle)
      const newsHeaderRight = document.querySelector('.news-header-right');
      if (newsHeaderRight && !newsHeaderRight.querySelector('.aethera-lang-toggle')) {
        const themeToggle = newsHeaderRight.querySelector('#news-theme-toggle');
        const selector = this.createSelectorEl(false);
        if (themeToggle) {
          newsHeaderRight.insertBefore(selector, themeToggle);
        } else {
          newsHeaderRight.appendChild(selector);
        }
      }

      // 6. Notes Sidebar Footer (#notes-sidebar .sidebar-footer right before #theme-toggle-notes)
      const notesSidebarFooter = document.querySelector('#notes-sidebar .sidebar-footer');
      if (notesSidebarFooter && !notesSidebarFooter.querySelector('.aethera-lang-toggle')) {
        const themeToggle = notesSidebarFooter.querySelector('#theme-toggle-notes');
        const selector = this.createSelectorEl(true);
        if (themeToggle) {
          notesSidebarFooter.insertBefore(selector, themeToggle);
        } else {
          notesSidebarFooter.appendChild(selector);
        }
      }

      // 7. Login / Auth Card (.auth-tabs or .auth-card top)
      const authCard = document.querySelector('.auth-card');
      if (authCard && !authCard.querySelector('.aethera-lang-toggle')) {
        const authBrand = authCard.querySelector('.auth-brand');
        const selector = this.createSelectorEl(false);
        selector.style.position = 'absolute';
        selector.style.top = '1.75rem';
        selector.style.right = '1.75rem';
        if (authBrand) {
          authCard.style.position = 'relative';
          authCard.appendChild(selector);
        }
      }

      // 8. Mobile Navigation Drawer (.mobile-nav-top right before #mobile-nav-close)
      const mobileNavTop = document.querySelector('.mobile-nav-top');
      if (mobileNavTop && !mobileNavTop.querySelector('.aethera-lang-toggle')) {
        const closeBtn = mobileNavTop.querySelector('#mobile-nav-close');
        const selector = this.createSelectorEl(true);
        if (closeBtn) {
          mobileNavTop.insertBefore(selector, closeBtn);
        } else {
          mobileNavTop.appendChild(selector);
        }
      }
    }

    updateSelectorStates() {
      const toggles = document.querySelectorAll('.aethera-lang-toggle');
      toggles.forEach(toggle => {
        const btns = toggle.querySelectorAll('.aethera-lang-btn');
        btns.forEach(btn => {
          const lang = btn.getAttribute('data-lang');
          btn.classList.toggle('active', lang === this.currentLang);
        });
      });
    }
  }

  // Global Singleton Instance
  window.aetheraI18n = new AetheraI18n();
  window.AetheraI18n = window.aetheraI18n; // Alias for backward compatibility
})();
