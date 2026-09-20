import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "hi" | "mr";

export interface Translations {
  // Brand & Nav
  brandTitle: string;
  brandTag: string;
  brandSubtitle: string;
  navHome: string;
  navLearn: string;
  navBadges: string;
  navTeacher: string;
  navSos: string;
  starsCount: string;
  levelBadge: string;

  // Hero Section
  heroBadge: string;
  heroAccuracyBadge: string;
  heroHeadingStart: string;
  heroHeadingGradient: string;
  heroHeadingEnd: string;
  heroDesc: string;
  btnStartLearning: string;
  btnAlphabets: string;
  btnSosDemo: string;
  statTotalSigns: string;
  statTotalSignsDesc: string;
  statFps: string;
  statFpsDesc: string;
  statGps: string;
  statGpsDesc: string;

  // Interactive Preview
  previewTitle: string;
  previewTapPrompt: string;
  previewAiValidated: string;
  previewPracticeBtn: string;
  previewSosBtn: string;

  // Curriculum Levels
  curriculumTitle: string;
  curriculumSubtitle: string;
  curriculumHeading: string;
  openLearningLab: string;
  level1Title: string;
  level1Desc: string;
  level2Title: string;
  level2Desc: string;
  level3Title: string;
  level3Desc: string;
  level4Title: string;
  level4Desc: string;
  btnStartLevel: string;
  btnTestSos: string;

  // Module 2 SOS
  mod2Tag: string;
  mod2Heading: string;
  mod2Desc: string;
  mod2GpsTitle: string;
  mod2GpsDesc: string;
  mod2WhatsappTitle: string;
  mod2WhatsappDesc: string;
  mod2CallTitle: string;
  mod2CallDesc: string;
  btnSimulateFire: string;
  btnOpenSos: string;

  // AI Pipeline
  pipelineTitle: string;
  pipelineSubtitle: string;
  pipelineHeading: string;
  pipe1Title: string;
  pipe1Desc: string;
  pipe2Title: string;
  pipe2Desc: string;
  pipe3Title: string;
  pipe3Desc: string;
  pipe4Title: string;
  pipe4Desc: string;

  // Footer
  footerTitle: string;
  footerAuthor: string;
  footerRights: string;
  footerEmergency: string;

  // Student Practice View
  learningModules: string;
  signsCount: string;
  chooseLesson: string;
  chooseLessonDesc: string;
  backToHome: string;
  backToLessons: string;
  tabLearn: string;
  tabBadges: string;
  tabParent: string;
  officialDemo: string;
  howToPerform: string;
  btnPrev: string;
  btnNext: string;
  btnFinish: string;
  liveAiEvaluator: string;
  performPrompt: string;
  hintLabel: string;
  aiTeacherWatching: string;
  makeSignPrompt: string;
  havingLightingIssue: string;
  markAsMatched: string;
  greatJob: string;
  accuracyStarReward: string;
  almostThere: string;
  checkHandPosition: string;
  tryAgain: string;
  totalStars: string;
  keepLearningStars: string;
  currentLevel: string;
  level2Explorer: string;
  completeLevel2ToUnlock: string;
  unlockedBadges: string;
  progressDashboard: string;
  studentAccuracyHistory: string;
  recentSessionEval: string;
  passedBadge: string;
  practiceBadge: string;
  learningRecommendations: string;
  reinforceSignsTitle: string;
  reinforceSignsDesc: string;
  nextMilestoneTitle: string;
  nextMilestoneDesc: string;

  // SOS Overlay
  sosActiveTitle: string;
  sosSafeTitle: string;
  urgentDistressDetected: string;
  autoGeoDispatcher: string;
  sosLiveGps: string;
  btnRefreshGps: string;
  gpsActiveBadge: string;
  latitudeLabel: string;
  longitudeLabel: string;
  viewGoogleMaps: string;
  emergencyDispatchHeader: string;
  btnWhatsappSos: string;
  btnCellularSms: string;
  btnCallGuardian: string;
  btnCall112: string;
  registeredContacts: string;
  btnAddContact: string;
  addNewContact: string;
  contactNameLabel: string;
  contactPhoneLabel: string;
  contactRelationLabel: string;
  primaryBadge: string;
  nationalHelpline: string;
  call112Btn: string;
  saveContactBtn: string;
  cancelBtn: string;
  btnImSafe: string;
  btnNeedHelp: string;
  btnInDanger: string;
  updateSafetyStatus: string;
  emergencyEventLog: string;
  viewPayload: string;
  copyRawMessage: string;
  copiedNotice: string;

  // Teacher View
  teacherConsoleTitle: string;
  teacherConsoleDesc: string;
  micListening: string;
  voiceTranscription: string;
  broadcastSubtitles: string;
  broadcastPlaceholder: string;
  sendBroadcast: string;
  emergencyEvacOverride: string;
  triggerCampusEmergency: string;
  studentQuestionQueue: string;
  realtimeQuestionsDesc: string;
  noQuestions: string;
  answeredBadge: string;
  typeReply: string;
  answerVocally: string;

  // Demo Panel
  testControls: string;
  testSpeech: string;
  testSign: string;
  testFireAlarm: string;
  switchToTeacher: string;
  switchToStudent: string;

  // Categories & Lessons
  catGreetings: string;
  catGreetingsDesc: string;
  catColours: string;
  catColoursDesc: string;
  catAlphabets: string;
  catAlphabetsDesc: string;
  catEmergency: string;
  catEmergencyDesc: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandTitle: "SignSafe AI",
    brandTag: "ISL FOR KIDS",
    brandSubtitle: "AI ISL Teacher & SafeSOS Safety Platform",
    navHome: "Home",
    navLearn: "Learning Lab",
    navBadges: "Badges",
    navTeacher: "Teacher Panel",
    navSos: "SafeSOS Alert",
    starsCount: "⭐ 350 Stars",
    levelBadge: "🌿 Level 2",

    heroBadge: "AI-Powered Indian Sign Language & Safety",
    heroAccuracyBadge: "98.85% Deep MLP Accuracy",
    heroHeadingStart: "Empowering Deaf Children with",
    heroHeadingGradient: "Real-Time AI Sign Teaching",
    heroHeadingEnd: "& Smart SOS Safety",
    heroDesc: "SignSafe AI combines interactive Indian Sign Language (ISL) learning with real-time MediaPipe joint tracking across 48+ signs (Greetings, Colours, and A–Z Alphabets) and a dedicated Smart SOS Emergency Alert System.",
    btnStartLearning: "Start Learning (Level 1)",
    btnAlphabets: "🔤 Alphabets (A-Z)",
    btnSosDemo: "Smart SOS Demo",
    statTotalSigns: "48+ Signs",
    statTotalSignsDesc: "Levels 1, 2, 3 & Safety",
    statFps: "30 FPS",
    statFpsDesc: "Zero-Lag In-Browser AI",
    statGps: "Live GPS",
    statGpsDesc: "WhatsApp & SMS Alerts",

    previewTitle: "Interactive Sign Showcase",
    previewTapPrompt: "Tap sign to test",
    previewAiValidated: "AI Validated ✓",
    previewPracticeBtn: "Practice in Video Lab",
    previewSosBtn: "Launch Smart SOS Distress Alert",

    curriculumTitle: "Structured Curriculum",
    curriculumSubtitle: "Comprehensive Curriculum",
    curriculumHeading: "Explore Learning Modules & Safety",
    openLearningLab: "Open Learning Lab",
    level1Title: "Everyday Greetings",
    level1Desc: "Essential foundational greetings: Hello, Namaste, Good Morning, How Are You, Thank You, and more.",
    level2Title: "Vibrant Colours",
    level2Desc: "Colour vocabulary in Indian Sign Language: Red, Yellow, Blue, Green, Black, White, Violet, and Brown.",
    level3Title: "Complete Alphabets (A–Z)",
    level3Desc: "All 26 ISL fingerspelling letters trained on 1,300 MediaPipe landmark samples with 98.85% accuracy.",
    level4Title: "Emergency & Safety",
    level4Desc: "Critical safety gestures (Help, Safe) paired with live GPS WhatsApp alerts and strobe alarms.",
    btnStartLevel: "Start Level",
    btnTestSos: "Test Smart SOS",

    mod2Tag: "Module 2 · Smart SOS Distress & Geolocation",
    mod2Heading: "Protecting Deaf Children During Emergencies",
    mod2Desc: "Deaf children cannot hear standard audible alarm sirens or evacuation announcements. SignSafe AI Module 2 replaces audible alarms with high-visibility visual strobe alerts, captures real-time HTML5 GPS Coordinates, and dispatches a 1-tap WhatsApp and cellular SMS distress message directly to guardians.",
    mod2GpsTitle: "Live GPS Geolocation",
    mod2GpsDesc: "Direct Google Maps link sent to parents",
    mod2WhatsappTitle: "WhatsApp Dispatch",
    mod2WhatsappDesc: "Pre-formatted SOS to Registered Guardians",
    mod2CallTitle: "1-Tap Emergency Call",
    mod2CallDesc: "Direct call to Parent & 112 Helpline",
    btnSimulateFire: "Simulate Strobe Fire Alarm",
    btnOpenSos: "Open Smart SOS Panel",

    pipelineTitle: "Technical Architecture",
    pipelineSubtitle: "Real-Time Machine Learning Pipeline",
    pipelineHeading: "How the Real-Time AI Pipeline Works",
    pipe1Title: "Webcam Input Capture",
    pipe1Desc: "Zero-lag 30 FPS camera streaming running 100% locally inside the browser with complete child privacy.",
    pipe2Title: "3D Landmark Extraction",
    pipe2Desc: "MediaPipe extracts 21 key joint coordinates (X, Y, Z) normalized relative to the wrist anchor.",
    pipe3Title: "Deep MLP Neural Network",
    pipe3Desc: "Multi-Layer Perceptron (63 ➔ 256 ➔ 128 ➔ 26) computes probability distribution with 98.85% accuracy.",
    pipe4Title: "Instant Visual Feedback",
    pipe4Desc: "Real-time confidence ring, mudra accuracy indicator, and dynamic star awards without relying on audio.",

    footerTitle: "SignSafe AI · Assistive ISL Learning & Smart Emergency Platform",
    footerAuthor: "Developed by Prajakta Ukirde · B.Tech Computer Science & Engineering (MGM's JNEC)",
    footerRights: "© 2026 SignSafe AI Platform. Open educational & safety initiative for deaf children.",
    footerEmergency: "Emergency Dispatch: Registered Guardians & 112 Helpline",

    learningModules: "Learning Modules",
    signsCount: "Signs",
    chooseLesson: "Choose a Lesson",
    chooseLessonDesc: "Select a category to watch official video demonstrations and verify your signs with the real-time AI camera.",
    backToHome: "Back to Home",
    backToLessons: "All Lessons",
    tabLearn: "Learn & Practice",
    tabBadges: "Achievements & Badges",
    tabParent: "Progress Dashboard",
    officialDemo: "Official ISLRTC Demonstration",
    howToPerform: "How to perform this sign",
    btnPrev: "Previous",
    btnNext: "Next Sign",
    btnFinish: "Finish Lesson",
    liveAiEvaluator: "Live AI Evaluator",
    performPrompt: "Perform the sign in front of your camera",
    hintLabel: "Hint",
    aiTeacherWatching: "AI Teacher is watching...",
    makeSignPrompt: "Make the sign for",
    havingLightingIssue: "Having camera lighting issues?",
    markAsMatched: "Mark as Matched ✓",
    greatJob: "Great Job! Sign Matched",
    accuracyStarReward: "accurately! +10 Stars added to your score.",
    almostThere: "Almost there!",
    checkHandPosition: "Please verify your hand position against the demonstration video and try again.",
    tryAgain: "Try Again",
    totalStars: "Total Stars",
    keepLearningStars: "Keep completing lessons to earn more stars!",
    currentLevel: "Current Level",
    level2Explorer: "Level 2 · Explorer",
    completeLevel2ToUnlock: "Complete Level 2 Colours to unlock Level 3!",
    unlockedBadges: "Unlocked Badges",
    progressDashboard: "Progress Dashboard",
    studentAccuracyHistory: "Student Accuracy History",
    recentSessionEval: "Recent session evaluation",
    passedBadge: "Passed",
    practiceBadge: "Practice",
    learningRecommendations: "Learning Recommendations",
    reinforceSignsTitle: "Reinforce Two-Handed Compound Signs",
    reinforceSignsDesc: "Practice transitioning from Thumbs Up into Morning/Afternoon bloom gestures.",
    nextMilestoneTitle: "Next Milestone: Level 2 Colours",
    nextMilestoneDesc: "Ready to practice Black, Red, Yellow, and Violet signs.",

    sosActiveTitle: "SMART SOS EMERGENCY ACTIVE",
    sosSafeTitle: "STATUS CONFIRMED: SAFE",
    urgentDistressDetected: "Urgent distress detected",
    autoGeoDispatcher: "Automated Geolocation Dispatcher",
    sosLiveGps: "Live GPS Geolocation",
    btnRefreshGps: "Refresh GPS",
    gpsActiveBadge: "GPS Active",
    latitudeLabel: "Latitude",
    longitudeLabel: "Longitude",
    viewGoogleMaps: "View on Google Maps",
    emergencyDispatchHeader: "One-Tap Emergency Contacts Dispatch",
    btnWhatsappSos: "WhatsApp SOS (Online)",
    btnCellularSms: "Cellular SMS (Offline GSM)",
    btnCallGuardian: "Call Guardian",
    btnCall112: "Call Emergency (112)",
    registeredContacts: "Registered Emergency Contacts",
    btnAddContact: "Add Phone Number",
    addNewContact: "Add New Emergency Contact",
    contactNameLabel: "Contact Name",
    contactPhoneLabel: "Mobile Phone (10 Digits)",
    contactRelationLabel: "Relationship",
    primaryBadge: "Primary",
    nationalHelpline: "National Emergency Response Service (India)",
    call112Btn: "Call 112 ➔",
    saveContactBtn: "Save Contact",
    cancelBtn: "Cancel",
    btnImSafe: "I AM SAFE NOW",
    btnNeedHelp: "I NEED ASSISTANCE",
    btnInDanger: "I AM IN DANGER",
    updateSafetyStatus: "Update Your Safety Status",
    emergencyEventLog: "Emergency Event Log",
    viewPayload: "View Formatted Distress Message Payload",
    copyRawMessage: "Copy Raw Message",
    copiedNotice: "Copied to Clipboard!",

    teacherConsoleTitle: "Teacher Classroom Console",
    teacherConsoleDesc: "Broadcast lectures directly to student screens with instant ISL signing & subtitles",
    micListening: "Listening…",
    voiceTranscription: "Voice Transcription",
    broadcastSubtitles: "Broadcast text directly to subtitles",
    broadcastPlaceholder: "e.g. Please open Chapter 3 and review the photosynthesis diagram.",
    sendBroadcast: "Send Broadcast",
    emergencyEvacOverride: "Emergency Evacuation Override",
    triggerCampusEmergency: "Trigger Campus Emergency Protocol",
    studentQuestionQueue: "Student Question Queue",
    realtimeQuestionsDesc: "Real-time ISL questions arriving from student webcams",
    noQuestions: "No pending questions. Student signs will appear here automatically.",
    answeredBadge: "Answered",
    typeReply: "Type Reply",
    answerVocally: "Answer",

    testControls: "Test Controls",
    testSpeech: "Test Lecture Speech",
    testSign: "Test ISL Sign",
    testFireAlarm: "Test Fire Alarm",
    switchToTeacher: "Switch to Teacher View",
    switchToStudent: "Switch to Student View",

    catGreetings: "Greetings",
    catGreetingsDesc: "Essential everyday greetings in Indian Sign Language",
    catColours: "Colours",
    catColoursDesc: "Vibrant colour words and expressions in ISL",
    catAlphabets: "Alphabets (A-Z)",
    catAlphabetsDesc: "Complete A–Z Indian Sign Language fingerspelling vocabulary",
    catEmergency: "Emergency & Safety",
    catEmergencyDesc: "Vital safety and emergency assistance signs",
  },

  hi: {
    brandTitle: "साइनसेफ AI",
    brandTag: "बच्चों के लिए ISL",
    brandSubtitle: "AI भारतीय सांकेतिक भाषा शिक्षक और SafeSOS सुरक्षा मंच",
    navHome: "होम",
    navLearn: "लर्निंग लैब",
    navBadges: "उपलब्धियां",
    navTeacher: "शिक्षक पैनल",
    navSos: "SafeSOS अलर्ट",
    starsCount: "⭐ 350 सितारे",
    levelBadge: "🌿 स्तर 2",

    heroBadge: "AI-संचालित भारतीय सांकेतिक भाषा एवं बाल सुरक्षा",
    heroAccuracyBadge: "98.85% डीप MLP सटीकता",
    heroHeadingStart: "मूक-बधिर बच्चों को सशक्त बनाएं",
    heroHeadingGradient: "रियल-टाइम AI सांकेतिक शिक्षक",
    heroHeadingEnd: "और स्मार्ट SOS सुरक्षा के साथ",
    heroDesc: "SignSafe AI मूक-बधिर बच्चों के लिए इंटरैक्टिव भारतीय सांकेतिक भाषा (ISL) और 48+ संकेतों (अभिवादन, रंग, और A-Z वर्णमाला) के साथ रियल-टाइम AI कैमरा फीडबैक और स्मार्ट आपातकालीन SOS प्रणाली प्रदान करता है।",
    btnStartLearning: "सीखना शुरू करें (स्तर 1)",
    btnAlphabets: "🔤 वर्णमाला (A-Z)",
    btnSosDemo: "स्मार्ट SOS डेमो",
    statTotalSigns: "48+ संकेत",
    statTotalSignsDesc: "स्तर 1, 2, 3 और सुरक्षा",
    statFps: "30 FPS",
    statFpsDesc: "बिना रुकावट ब्राउज़र AI",
    statGps: "लाइव GPS",
    statGpsDesc: "व्हाट्सएप और SMS अलर्ट",

    previewTitle: "इंटरैक्टिव संकेत पूर्वावलोकन",
    previewTapPrompt: "जांचने के लिए संकेत चुनें",
    previewAiValidated: "AI सत्यापित ✓",
    previewPracticeBtn: "वीडियो लैब में अभ्यास करें",
    previewSosBtn: "स्मार्ट SOS अलर्ट भेजें",

    curriculumTitle: "संरचित पाठ्यक्रम",
    curriculumSubtitle: "व्यापक पाठ्यक्रम",
    curriculumHeading: "पाठ्यक्रम स्तर और सुरक्षा का अन्वेषण करें",
    openLearningLab: "लर्निंग लैब खोलें",
    level1Title: "दैनिक अभिवादन",
    level1Desc: "ज़रूरी अभिवादन: नमस्ते, हैलो, सुप्रभात, आप कैसे हैं, धन्यवाद आदि।",
    level2Title: "रंग और अभिव्यक्तियां",
    level2Desc: "ISL में रंगों के नाम: लाल, पीला, नीला, हरा, काला, सफेद, बैंगनी और भूरा।",
    level3Title: "संपूर्ण वर्णमाला (A–Z)",
    level3Desc: "सभी 26 ISL फिंगरस्पेलिंग अक्षर 1,300 लैंडमार्क नमूनों पर 98.85% सटीकता से प्रशिक्षित।",
    level4Title: "आपातकालीन एवं जीवन सुरक्षा",
    level4Desc: "महत्वपूर्ण सुरक्षा संकेत (मदद, सुरक्षित) लाइव GPS व्हाट्सएप अलर्ट के साथ।",
    btnStartLevel: "स्तर शुरू करें",
    btnTestSos: "SOS का परीक्षण करें",

    mod2Tag: "मॉड्यूल 2 · स्मार्ट SOS आपातकालीन अलर्ट एवं भू-स्थान",
    mod2Heading: "आपातकाल के दौरान मूक-बधिर बच्चों की सुरक्षा",
    mod2Desc: "मूक-बधिर बच्चे आग के सायरन या लाउडस्पीकर की घोषणाएं नहीं सुन सकते। साइनसेफ AI मॉड्यूल 2 तेज विजुअल स्ट्रोब लाइट अलर्ट, लाइव GPS लोकेशन और अभिभावकों को 1-टैप व्हाट्सएप/SMS संदेश भेजता है।",
    mod2GpsTitle: "लाइव GPS लोकेशन",
    mod2GpsDesc: "अभिभावकों को गूगल मैप्स लिंक",
    mod2WhatsappTitle: "व्हाट्सएप अलर्ट",
    mod2WhatsappDesc: "अभिभावकों को पूर्व-स्वरूपित SOS",
    mod2CallTitle: "1-टैप आपातकालीन कॉल",
    mod2CallDesc: "अभिभावक एवं 112 हेल्पलाइन को कॉल",
    btnSimulateFire: "फायर अलार्म स्ट्रोब अनुकरण करें",
    btnOpenSos: "स्मार्ट SOS पैनल खोलें",

    pipelineTitle: "तकनीकी संरचना",
    pipelineSubtitle: "रियल-टाइम मशीन लर्निंग पाइपलाइन",
    pipelineHeading: "रियल-टाइम AI विज़न कैसे काम करता है",
    pipe1Title: "वेबकैम वीडियो इनपुट",
    pipe1Desc: "100% ब्राउज़र में सुरक्षित और गोपनीय रूप से चलने वाली 30 FPS कैमरा स्ट्रीमिंग।",
    pipe2Title: "3D लैंडमार्क निष्कर्षण",
    pipe2Desc: "MediaPipe कलाई के सापेक्ष 21 मुख्य संयुक्त निर्देशांक (X, Y, Z) निकालता है।",
    pipe3Title: "डीप MLP न्यूरल नेटवर्क",
    pipe3Desc: "मल्टी-लेयर परसेप्ट्रॉन (63 ➔ 256 ➔ 128 ➔ 26) 98.85% सटीकता के साथ वर्गीकरण करता है।",
    pipe4Title: "तुरंत दृश्य प्रतिक्रिया",
    pipe4Desc: "ध्वनि के बिना रियल-टाइम सटीकता रिंग, मुद्रा संकेतक और स्टार पुरस्कार।",

    footerTitle: "साइनसेफ AI · सहायक ISL शिक्षण एवं बाल सुरक्षा मंच",
    footerAuthor: "विकासकर्ता: प्राजक्ता उकिरडे · बी.टेक कंप्यूटर साइंस (MGM's JNEC)",
    footerRights: "© 2026 साइनसेफ AI. मूक-बधिर बच्चों के लिए खुला शैक्षिक एवं सुरक्षा मंच।",
    footerEmergency: "आपातकालीन संपर्क: पंजीकृत अभिभावक एवं 112 हेल्पलाइन",

    learningModules: "लर्निंग मॉड्यूल्स",
    signsCount: "संकेत",
    chooseLesson: "एक पाठ चुनें",
    chooseLessonDesc: "आधिकारिक वीडियो प्रदर्शन देखने और AI कैमरे से अपने संकेतों को सत्यापित करने के लिए श्रेणी चुनें।",
    backToHome: "होम पर वापस जाएं",
    backToLessons: "सभी पाठ",
    tabLearn: "सीखें और अभ्यास करें",
    tabBadges: "उपलब्धियां और बैज",
    tabParent: "प्रगति डैशबोर्ड",
    officialDemo: "आधिकारिक ISLRTC प्रदर्शन",
    howToPerform: "यह संकेत कैसे करें",
    btnPrev: "पिछला संकेत",
    btnNext: "अगला संकेत",
    btnFinish: "पाठ पूरा करें",
    liveAiEvaluator: "लाइव AI मूल्यांकनकर्ता",
    performPrompt: "अपने कैमरे के सामने संकेत प्रदर्शित करें",
    hintLabel: "संकेत",
    aiTeacherWatching: "AI शिक्षक देख रहा है...",
    makeSignPrompt: "कैमरे के सामने संकेत बनाएं:",
    havingLightingIssue: "क्या कैमरे में प्रकाश की समस्या है?",
    markAsMatched: "सत्यापित के रूप में चिह्नित करें ✓",
    greatJob: "शाबाश! संकेत मेल खा गया",
    accuracyStarReward: "सटीक संकेत! +10 सितारे आपके स्कोर में जोड़े गए।",
    almostThere: "लगभग सही!",
    checkHandPosition: "कृपया वीडियो देखकर अपने हाथ की स्थिति जांचें और पुनः प्रयास करें।",
    tryAgain: "पुनः प्रयास करें",
    totalStars: "कुल सितारे",
    keepLearningStars: "अधिक सितारे अर्जित करने के लिए पाठ पूरा करते रहें!",
    currentLevel: "वर्तमान स्तर",
    level2Explorer: "स्तर 2 · एक्सप्लोरर",
    completeLevel2ToUnlock: "स्तर 3 अनलॉक करने के लिए स्तर 2 पूरा करें!",
    unlockedBadges: "अनलॉक किए गए बैज",
    progressDashboard: "प्रगति डैशबोर्ड",
    studentAccuracyHistory: "छात्र सटीकता इतिहास",
    recentSessionEval: "हालिया सत्र मूल्यांकन",
    passedBadge: "उत्तीर्ण",
    practiceBadge: "अभ्यास",
    learningRecommendations: "सीखने की सिफारिशें",
    reinforceSignsTitle: "दो हाथों के संयुक्त संकेतों का अभ्यास करें",
    reinforceSignsDesc: "थम्स अप से सुप्रभात/दोपहर के संकेतों में बदलने का अभ्यास करें।",
    nextMilestoneTitle: "अगला मील का पत्थर: स्तर 2 रंग",
    nextMilestoneDesc: "काला, लाल, पीला और बैंगनी रंगों के संकेतों के लिए तैयार रहें।",

    sosActiveTitle: "स्मार्ट SOS आपातकालीन अलर्ट सक्रिय",
    sosSafeTitle: "स्थिति की पुष्टि: सुरक्षित",
    urgentDistressDetected: "तत्काल संकट का पता चला",
    autoGeoDispatcher: "स्वचालित भू-स्थान प्रेषक",
    sosLiveGps: "लाइव GPS भू-स्थान",
    btnRefreshGps: "GPS रीफ्रेश करें",
    gpsActiveBadge: "GPS सक्रिय",
    latitudeLabel: "अक्षांश (Latitude)",
    longitudeLabel: "देशांतर (Longitude)",
    viewGoogleMaps: "गूगल मैप्स पर देखें",
    emergencyDispatchHeader: "वन-टैप आपातकालीन संपर्क प्रेषण",
    btnWhatsappSos: "व्हाट्सएप SOS (ऑनलाइन)",
    btnCellularSms: "सेल्युलर SMS (ऑफलाइन GSM)",
    btnCallGuardian: "अभिभावक को कॉल करें",
    btnCall112: "आपातकालीन कॉल (112)",
    registeredContacts: "पंजीकृत आपातकालीन संपर्क",
    btnAddContact: "फोन नंबर जोड़ें",
    addNewContact: "नया आपातकालीन संपर्क जोड़ें",
    contactNameLabel: "संपर्क नाम",
    contactPhoneLabel: "मोबाइल फोन (10 अंक)",
    contactRelationLabel: "संबंध",
    primaryBadge: "प्राथमिक",
    nationalHelpline: "राष्ट्रीय आपातकालीन प्रतिक्रिया सेवा (भारत)",
    call112Btn: "112 पर कॉल करें ➔",
    saveContactBtn: "संपर्क सहेजें",
    cancelBtn: "रद्द करें",
    btnImSafe: "मैं अब सुरक्षित हूँ",
    btnNeedHelp: "मुझे सहायता चाहिए",
    btnInDanger: "मैं खतरे में हूँ",
    updateSafetyStatus: "अपनी सुरक्षा स्थिति अपडेट करें",
    emergencyEventLog: "आपातकालीन घटना लॉग",
    viewPayload: "स्वरूपित संकट संदेश देखें",
    copyRawMessage: "संदेश कॉपी करें",
    copiedNotice: "क्लिपबोर्ड पर कॉपी किया गया!",

    teacherConsoleTitle: "शिक्षक कक्षा कंसोल",
    teacherConsoleDesc: "छात्रों की स्क्रीन पर तत्काल ISL सांकेतिक भाषा और उपशीर्षक प्रसारित करें",
    micListening: "सुन रहा है…",
    voiceTranscription: "आवाज प्रतिलेखन",
    broadcastSubtitles: "टेक्स्ट सीधे उपशीर्षक में प्रसारित करें",
    broadcastPlaceholder: "उदा. कृपया अध्याय 3 खोलें और प्रकाश संश्लेषण चित्र देखें।",
    sendBroadcast: "प्रसारण भेजें",
    emergencyEvacOverride: "आपातकालीन निकासी ओवरराइड",
    triggerCampusEmergency: "परिसर आपातकालीन प्रोटोकॉल सक्रिय करें",
    studentQuestionQueue: "छात्र प्रश्न कतार",
    realtimeQuestionsDesc: "छात्रों के वेबकैम से आने वाले रियल-टाइम ISL प्रश्न",
    noQuestions: "कोई लंबित प्रश्न नहीं। छात्रों के संकेत स्वचालित रूप से यहां दिखाई देंगे।",
    answeredBadge: "उत्तर दिया गया",
    typeReply: "टाइप करके उत्तर दें",
    answerVocally: "उत्तर दें",

    testControls: "परीक्षण नियंत्रण",
    testSpeech: "व्याख्यान भाषण परीक्षण",
    testSign: "ISL संकेत परीक्षण",
    testFireAlarm: "फायर अलार्म परीक्षण",
    switchToTeacher: "शिक्षक दृश्य में बदलें",
    switchToStudent: "छात्र दृश्य में बदलें",

    catGreetings: "दैनिक अभिवादन",
    catGreetingsDesc: "भारतीय सांकेतिक भाषा में बुनियादी दैनिक अभिवादन",
    catColours: "रंग और अभिव्यक्तियां",
    catColoursDesc: "ISL में जीवंत रंगों के नाम और संकेत",
    catAlphabets: "वर्णमाला (A-Z)",
    catAlphabetsDesc: "संपूर्ण 26 ISL फिंगरस्पेलिंग वर्णमाला",
    catEmergency: "आपातकालीन एवं सुरक्षा",
    catEmergencyDesc: "महत्वपूर्ण सुरक्षा और सहायता संकेत",
  },

  mr: {
    brandTitle: "साइनसेफ AI",
    brandTag: "मुलांसाठी ISL",
    brandSubtitle: "AI भारतीय सांकेतिक भाषा शिक्षक व SafeSOS सुरक्षा मंच",
    navHome: "मुख्यपृष्ठ",
    navLearn: "लर्निंग लॅब",
    navBadges: "बॅजेस व यश",
    navTeacher: "शिक्षक पॅनेल",
    navSos: "SafeSOS अलर्ट",
    starsCount: "⭐ ३५० स्टार्स",
    levelBadge: "🌿 स्तर २",

    heroBadge: "AI-आधारित भारतीय सांकेतिक भाषा व बाल सुरक्षा",
    heroAccuracyBadge: "९८.८५% डीप MLP अचूकता",
    heroHeadingStart: "मूकबधिर बालकांसाठी प्रगत",
    heroHeadingGradient: "रियल-टाइम AI सांकेतिक शिक्षक",
    heroHeadingEnd: "आणि स्मार्ट SOS सुरक्षा",
    heroDesc: "SignSafe AI मूकबधिर बालकांसाठी परस्परसंवादी भारतीय सांकेतिक भाषा (ISL) शिक्षण आणि ४८+ चिन्हांसाठी (अभिवादन, रंग, आणि A-Z मुळाक्षरे) रियल-टाइम AI कॅमेरा फीडबॅक आणि स्मार्ट SOS आपत्कालीन सुरक्षा प्रणाली प्रदान करते.",
    btnStartLearning: "शिकायला सुरुवात करा (स्तर १)",
    btnAlphabets: "🔤 मुळाक्षरे (A-Z)",
    btnSosDemo: "स्मार्ट SOS डेमो",
    statTotalSigns: "४८+ चिन्हे",
    statTotalSignsDesc: "स्तर १, २, ३ आणि सुरक्षा",
    statFps: "३० FPS",
    statFpsDesc: "विना-विलंब इन-ब्राउझर AI",
    statGps: "थेट GPS",
    statGpsDesc: "व्हॉट्सॲप व SMS अलर्ट",

    previewTitle: "परस्परसंवादी चिन्ह पूर्वावलोकन",
    previewTapPrompt: "तपासण्यासाठी चिन्ह निवडा",
    previewAiValidated: "AI सत्यापित ✓",
    previewPracticeBtn: "व्हिडिओ लॅबमध्ये सराव करा",
    previewSosBtn: "स्मार्ट SOS आपत्कालीन अलर्ट पाठवा",

    curriculumTitle: "रचनात्मक अभ्यासक्रम",
    curriculumSubtitle: "सर्वसमावेशक अभ्यासक्रम",
    curriculumHeading: "शिकण्याचे स्तर आणि सुरक्षा जाणून घ्या",
    openLearningLab: "लर्निंग लॅब उघडा",
    level1Title: "दैनंदिन अभिवादन",
    level1Desc: "अत्यावश्यक अभिवादन: नमस्कार, हॅलो, शुभ सकाळ, आपण कसे आहात, धन्यवाद इत्यादी.",
    level2Title: "रंग व छटा",
    level2Desc: "ISL मध्ये रंगांची नावे: लाल, पिवळा, निळा, हिरवा, काळा, पांढरा, जांभळा आणि तपकिरी.",
    level3Title: "संपूर्ण मुळाक्षरे (A–Z)",
    level3Desc: "सर्व २६ ISL फिंगरस्पेलिंग अक्षरे १,३०० लँडमार्क नमुन्यांवर ९८.८५% अचूकतेसह प्रशिक्षित.",
    level4Title: "आपत्कालीन व जीवन सुरक्षा",
    level4Desc: "महत्त्वाची सुरक्षा चिन्हे (मदत, सुरक्षित) थेट GPS व्हॉट्सॲप अलर्टसह.",
    btnStartLevel: "स्तर सुरू करा",
    btnTestSos: "SOS तपासा",

    mod2Tag: "मॉड्यूल २ · स्मार्ट SOS आपत्कालीन अलर्ट व थेट स्थान",
    mod2Heading: "आपत्कालीन परिस्थितीत मूकबधिर बालकांचे रक्षण",
    mod2Desc: "मूकबधिर मुले आगीचे सायरन किंवा ध्वनिक्षेपकावरील घोषणा ऐकू शकत नाहीत. साइनसेफ AI मॉड्यूल २ प्रखर व्हिज्युअल स्ट्रोब लाइट अलर्ट, थेट GPS स्थान आणि पालकांना १-टॅप व्हॉट्सॲप/SMS संदेश पाठवते.",
    mod2GpsTitle: "थेट GPS स्थान",
    mod2GpsDesc: "पालकांना थेट गुगल मॅप्स लिंक",
    mod2WhatsappTitle: "व्हॉट्सॲप अलर्ट",
    mod2WhatsappDesc: "नोंदणीकृत पालकांना तयार SOS संदेश",
    mod2CallTitle: "१-टॅप आपत्कालीन कॉल",
    mod2CallDesc: "पालक व ११२ हेल्पलाइनला थेट कॉल",
    btnSimulateFire: "फायर अलार्म स्ट्रोब तपासा",
    btnOpenSos: "स्मार्ट SOS पॅनेल उघडा",

    pipelineTitle: "तांत्रिक रचना",
    pipelineSubtitle: "रियल-टाइम मशीन लर्निंग पाइपलाइन",
    pipelineHeading: "रियल-टाइम AI व्हिजन कसे कार्य करते",
    pipe1Title: "वेबकॅम व्हिडिओ इनपुट",
    pipe1Desc: "१००% ब्राउझरमध्ये सुरक्षितपणे चालणारी ३० FPS कॅमेरा स्ट्रीमिंग.",
    pipe2Title: "3D लँडमार्क विश्लेषण",
    pipe2Desc: "MediaPipe हाताच्या मनगटाच्या सापेक्ष २१ मुख्य सांधे निर्देशांक (X, Y, Z) काढते.",
    pipe3Title: "डीप MLP न्यूरल नेटवर्क",
    pipe3Desc: "मल्टी-लेयर परसेप्ट्रॉन (६३ ➔ २५६ ➔ १२८ ➔ २६) ९८.८५% अचूकतेसह वर्गीकरण करते.",
    pipe4Title: "त्वरित दृश्य प्रतिसाद",
    pipe4Desc: "आवाजाशिवाय रियल-टाइम अचूकता रिंग, मुद्रा सूचक आणि स्टार बक्षिसे.",

    footerTitle: "साइनसेफ AI · मूकबधिर बालकांसाठी सांकेतिक भाषा व सुरक्षा व्यासपीठ",
    footerAuthor: "विकासक: प्राजक्ता उकिरडे · बी.टेक कॉम्प्युटर सायन्स (MGM's JNEC)",
    footerRights: "© २०२६ साइनसेफ AI. मूकबधिर बालकांसाठी शैक्षणिक व सुरक्षा उपक्रम.",
    footerEmergency: "आपत्कालीन संपर्क: नोंदणीकृत पालक व ११२ हेल्पलाइन",

    learningModules: "लर्निंग मॉड्यूल्स",
    signsCount: "चिन्हे",
    chooseLesson: "एक धडा निवडा",
    chooseLessonDesc: "अधिकृत व्हिडिओ प्रात्यक्षिक पाहण्यासाठी आणि AI कॅमेऱ्याद्वारे चिन्हे तपासण्यासाठी श्रेणी निवडा.",
    backToHome: "मुख्यपृष्ठावर परत जा",
    backToLessons: "सर्व धडे",
    tabLearn: "शिका आणि सराव करा",
    tabBadges: "यश आणि बॅजेस",
    tabParent: "प्रगती डॅशबोर्ड",
    officialDemo: "अधिकृत ISLRTC प्रात्यक्षिक",
    howToPerform: "हे चिन्ह कसे करावे",
    btnPrev: "मागील चिन्ह",
    btnNext: "पुढील चिन्ह",
    btnFinish: "धडा पूर्ण करा",
    liveAiEvaluator: "थेट AI मूल्यमापन",
    performPrompt: "आपल्या कॅमेऱ्यासमोर चिन्ह सादर करा",
    hintLabel: "टीप",
    aiTeacherWatching: "AI शिक्षक पाहत आहे...",
    makeSignPrompt: "कॅमेऱ्यासमोर चिन्ह दाखवा:",
    havingLightingIssue: "कॅमेऱ्यात प्रकाशाची समस्या आहे का?",
    markAsMatched: "सत्यापित म्हणून चिन्हांकित करा ✓",
    greatJob: "छान! चिन्ह अचूक जुळले",
    accuracyStarReward: "अचूक सादरीकरण! +१० स्टार्स तुमच्या खात्यात जोडले गेले.",
    almostThere: "जवळपास अचूक!",
    checkHandPosition: "कृपया व्हिडिओ पाहून आपल्या हाताची स्थिती तपासा आणि पुन्हा प्रयत्न करा.",
    tryAgain: "पुन्हा प्रयत्न करा",
    totalStars: "एकूण स्टार्स",
    keepLearningStars: "अधिक स्टार्स मिळवण्यासाठी धडे पूर्ण करत राहा!",
    currentLevel: "सध्याचा स्तर",
    level2Explorer: "स्तर २ · एक्सप्लोरर",
    completeLevel2ToUnlock: "स्तर ३ उघडण्यासाठी स्तर २ चे रंग पूर्ण करा!",
    unlockedBadges: "मिळवलेले बॅजेस",
    progressDashboard: "प्रगती डॅशबोर्ड",
    studentAccuracyHistory: "विद्यार्थी अचूकता इतिहास",
    recentSessionEval: "नुकत्याच झालेल्या सत्राचे मूल्यमापन",
    passedBadge: "उत्तीर्ण",
    practiceBadge: "सराव",
    learningRecommendations: "शिकण्याच्या शिफारसी",
    reinforceSignsTitle: "दोन हातांच्या संयुक्त चिन्हांचा सराव करा",
    reinforceSignsDesc: "थम्स अप वरून सकाळ/दुपारच्या उमलणाऱ्या चिन्हांमध्ये बदलण्याचा सराव करा.",
    nextMilestoneTitle: "पुढील टप्पा: स्तर २ रंग",
    nextMilestoneDesc: "काळा, लाल, पिवळा आणि जांभळा रंगांच्या चिन्हांसाठी तयार राहा.",

    sosActiveTitle: "स्मार्ट SOS आपत्कालीन संकट अलर्ट सक्रिय",
    sosSafeTitle: "स्थिती पुष्टी: सुरक्षित",
    urgentDistressDetected: "तातडीचे संकट आढळले",
    autoGeoDispatcher: "स्वयंचलित थेट स्थान प्रेषक",
    sosLiveGps: "थेट GPS स्थान",
    btnRefreshGps: "GPS रिफ्रेश करा",
    gpsActiveBadge: "GPS सक्रिय",
    latitudeLabel: "अक्षांश (Latitude)",
    longitudeLabel: "रेखांश (Longitude)",
    viewGoogleMaps: "गुगल मॅप्सवर पहा",
    emergencyDispatchHeader: "१-टॅप आपत्कालीन संपर्क प्रेषण",
    btnWhatsappSos: "व्हॉट्सॲप SOS (ऑनलाइन)",
    btnCellularSms: "सेल्युलर SMS (ऑफलाइन GSM)",
    btnCallGuardian: "पालकांना कॉल करा",
    btnCall112: "आपत्कालीन कॉल (११२)",
    registeredContacts: "नोंदणीकृत आपत्कालीन संपर्क",
    btnAddContact: "फोन नंबर जोडा",
    addNewContact: "नवीन आपत्कालीन संपर्क जोडा",
    contactNameLabel: "संपर्काचे नाव",
    contactPhoneLabel: "मोबाईल फोन (१० अंक)",
    contactRelationLabel: "नाते",
    primaryBadge: "प्राथमिक",
    nationalHelpline: "राष्ट्रीय आपत्कालीन प्रतिसाद सेवा (भारत)",
    call112Btn: "११२ वर कॉल करा ➔",
    saveContactBtn: "संपर्क सेव्ह करा",
    cancelBtn: "रद्द करा",
    btnImSafe: "मी आता सुरक्षित आहे",
    btnNeedHelp: "मला मदतीची गरज आहे",
    btnInDanger: "मी धोक्यात आहे",
    updateSafetyStatus: "आपली सुरक्षा स्थिती अपडेट करा",
    emergencyEventLog: "आपत्कालीन घटना नोंद",
    viewPayload: "तयार संकट संदेश पहा",
    copyRawMessage: "संदेश कॉपी करा",
    copiedNotice: "क्लिपबोर्डवर कॉपी केले!",

    teacherConsoleTitle: "शिक्षक वर्ग कन्सोल",
    teacherConsoleDesc: "विद्यार्थ्यांच्या स्क्रीनवर थेट ISL सांकेतिक भाषा व उपशीर्षके प्रक्षेपित करा",
    micListening: "ऐकत आहे…",
    voiceTranscription: "आवाज लिप्यंतरण",
    broadcastSubtitles: "मजकूर थेट उपशीर्षकांमध्ये प्रसारित करा",
    broadcastPlaceholder: "उदा. कृपया प्रकरण ३ उघडा आणि प्रकाशसंश्लेषण आकृती पहा.",
    sendBroadcast: "प्रक्षेपित करा",
    emergencyEvacOverride: "आपत्कालीन बाहेर पडणे ओव्हरराइड",
    triggerCampusEmergency: "परिसर आपत्कालीन प्रोटोकॉल सक्रिय करा",
    studentQuestionQueue: "विद्यार्थी प्रश्न रांग",
    realtimeQuestionsDesc: "विद्यार्थ्यांच्या वेबकॅमवरून येणारे थेट ISL प्रश्न",
    noQuestions: "कोणतेही प्रलंबित प्रश्न नाहीत. विद्यार्थ्यांची चिन्हे आपोआप येथे दिसतील.",
    answeredBadge: "उत्तर दिले",
    typeReply: "टाइप करून उत्तर द्या",
    answerVocally: "उत्तर द्या",

    testControls: "चाचणी नियंत्रणे",
    testSpeech: "व्याख्यान भाषण चाचणी",
    testSign: "ISL चिन्ह चाचणी",
    testFireAlarm: "फायर अलार्म चाचणी",
    switchToTeacher: "शिक्षक दृश्यात बदला",
    switchToStudent: "विद्यार्थी दृश्यात बदला",

    catGreetings: "दैनंदिन अभिवादन",
    catGreetingsDesc: "भारतीय सांकेतिक भाषेतील मूलभूत दैनंदिन अभिवादन",
    catColours: "रंग व छटा",
    catColoursDesc: "ISL मधील रंगांची नावे व चिन्हे",
    catAlphabets: "मुळाक्षरे (A-Z)",
    catAlphabetsDesc: "सर्व २६ ISL फिंगरस्पेलिंग मुळाक्षरे",
    catEmergency: "आपत्कालीन व जीवन सुरक्षा",
    catEmergencyDesc: "अत्यावश्यक सुरक्षा आणि मदत चिन्हे",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("signsafe_language") as Language;
      if (saved && (saved === "en" || saved === "hi" || saved === "mr")) {
        return saved;
      }
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("signsafe_language", lang);
    }
  };

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
