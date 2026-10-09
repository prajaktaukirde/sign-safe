import { useState, useEffect } from "react";
import { 
  Sparkles, Hand, RotateCcw, Trophy, BookOpen, Star, 
  AlertCircle, ShieldAlert, Award, Compass, Heart, Activity, CheckCircle2, RefreshCw,
  Palette, ChevronRight, ChevronLeft, Volume2, Flame, Lock, Trash2, BarChart3, TrendingUp, Check,
  PartyPopper, Hash, MessageSquare, PhoneCall, ShieldCheck, HeartPulse, AlertOctagon, Send,
  Briefcase, Users, HelpCircle
} from "lucide-react";
import { WebcamMock } from "./WebcamMock";
import { TestSection } from "./TestSection";
import { useDemo } from "@/lib/demo-store";
import { useLanguage, Language } from "@/lib/translations";
import { loadProgress, saveProgressRecord, resetProgress, SignRecord } from "@/lib/progress-store";

export interface LocalizedSign {
  name: string;
  desc: string;
  hint?: string;
}

export const SIGN_TRANSLATIONS: Record<string, Record<Language, LocalizedSign>> = {
  // Level 1: Greetings
  "Hello": {
    en: { name: "Hello", desc: "Raise your dominant hand with your open palm facing forward beside your ear/temple and make a gentle greeting wave.", hint: "Open hand up beside your head waving 👋" },
    hi: { name: "नमस्ते / हैलो (Hello)", desc: "अपने मुख्य हाथ की खुली हथेली को कान/कनपटी के पास आगे की ओर उठाएं और धीरे से हिलाकर अभिवादन करें।", hint: "सिर के पास खुला हाथ हिलाएं 👋" },
    mr: { name: "हॅलो / नमस्कार (Hello)", desc: "तुमच्या मुख्य हाताचा खुला तळहात कानाच्या/कपाळाच्या बाजूला पुढे ठेवून हळूवार हलवून अभिवादन करा.", hint: "डोक्याजवळ हात वर करून हलवा 👋" }
  },
  "Namaste": {
    en: { name: "Namaste", desc: "Bring both flat palms together in front of your chest with fingers pointing straight up in the traditional Indian prayer mudra.", hint: "Press both palms together in front of your chest 🙏" },
    hi: { name: "नमस्ते (Namaste)", desc: "पारंपरिक भारतीय प्रार्थना मुद्रा में दोनों हथेलियों को अपनी छाती के सामने जोड़ें और उंगलियां ऊपर रखें।", hint: "छाती के सामने दोनों हथेलियां जोड़ें 🙏" },
    mr: { name: "नमस्कार (Namaste)", desc: "पारंपरिक भारतीय प्रार्थना मुद्रेत दोन्ही तळहात छातीसमोर जोडून बोटे वरच्या दिशेने ठेवा.", hint: "छातीसमोर दोन्ही तळहात जोडा 🙏" }
  },
  "Good Morning": {
    en: { name: "Good Morning", desc: "Show a Thumbs Up (Good) followed by blooming your open hand upward in front of your chest like a rising morning sun.", hint: "Thumbs up 👍 then open hand blooming upwards ☀️" },
    hi: { name: "सुप्रभात (Good Morning)", desc: "पहले थम्स अप (अच्छा) दिखाएं, फिर उगते सूरज की तरह छाती के सामने अपनी खुली हथेली को ऊपर की ओर खिलाएं।", hint: "थम्स अप 👍 फिर हाथ ऊपर की ओर खोलें ☀️" },
    mr: { name: "शुभ सकाळ (Good Morning)", desc: "प्रथम थम्स अप (छान) दाखवा, नंतर उगवत्या सूर्याप्रमाणे छातीसमोर हाताचा तळहात वरच्या दिशेने उमलवा.", hint: "थम्स अप 👍 नंतर हात वर उमलवा ☀️" }
  },
  "Good Afternoon": {
    en: { name: "Good Afternoon", desc: "First make a Thumbs Up (Good), then hold your open flat hand horizontally near chin/mouth level indicating midday sun.", hint: "Thumbs up 👍 then flat open hand at mid-level 🌤️" },
    hi: { name: "शुभ दोपहर (Good Afternoon)", desc: "पहले थम्स अप दिखाएं, फिर दोपहर के सूरज को दर्शाने के लिए खुली सपाट हथेली को ठोड़ी/मुंह के स्तर पर क्षैतिज रखें।", hint: "थम्स अप 👍 फिर मुंह के स्तर पर सपाट हाथ 🌤️" },
    mr: { name: "शुभ दुपार (Good Afternoon)", desc: "प्रथम थम्स अप करा, नंतर दुपारचा सूर्य दर्शवण्यासाठी हनुवटीजवळ सपाट हात आडवा धरा.", hint: "थम्स अप 👍 नंतर हनुवटीजवळ सपाट हात 🌤️" }
  },
  "Good Evening": {
    en: { name: "Good Evening", desc: "First make a Thumbs Up (Good), then sweep your open hand downward across your chest representing the setting sun.", hint: "Thumbs up 👍 then sweep hand downward 🌆" },
    hi: { name: "शुभ संध्या (Good Evening)", desc: "पहले थम्स अप करें, फिर डूबते सूरज को दर्शाने के लिए अपनी खुली हथेली को छाती के सामने नीचे की ओर घुमाएं।", hint: "थम्स अप 👍 फिर हाथ नीचे की ओर ले जाएं 🌆" },
    mr: { name: "शुभ संध्याकाळ (Good Evening)", desc: "प्रथम थम्स अप करा, नंतर मावळता सूर्य दर्शवण्यासाठी हात छातीसमोरून खाली हलवा.", hint: "थम्स अप 👍 नंतर हात खाली फिरवा 🌆" }
  },
  "Good Night": {
    en: { name: "Good Night", desc: "Cross both your wrists or lower your hands gently in front of your chest in the resting evening pose.", hint: "Cross your wrists in front of your chest 🌙" },
    hi: { name: "शुभ रात्रि (Good Night)", desc: "विश्राम मुद्रा में दोनों कलाइयों को एक-दूसरे के ऊपर रखें या छाती के सामने हाथों को धीरे से नीचे लाएं।", hint: "छाती के सामने कलाइयों को क्रॉस करें 🌙" },
    mr: { name: "शुभ रात्री (Good Night)", desc: "विश्रांतीच्या मुद्रेत दोन्ही मनगटे एकमेकांवर ठेवा किंवा हात छातीसमोर हळूवार खाली आणा.", hint: "छातीसमोर मनगटे क्रॉस करा 🌙" }
  },
  "Good Day": {
    en: { name: "Good Day", desc: "Form a clear, distinct Thumbs Up gesture with your dominant hand held in front of your chest.", hint: "Firm thumbs up gesture 👍" },
    hi: { name: "शुभ दिन (Good Day)", desc: "अपनी छाती के सामने अपने मुख्य हाथ से एक स्पष्ट थम्स अप (अंगूठा ऊपर) मुद्रा बनाएं।", hint: "स्पष्ट थम्स अप मुद्रा 👍" },
    mr: { name: "शुभ दिवस (Good Day)", desc: "तुमच्या मुख्य हाताने छातीसमोर स्पष्ट थम्स अप (अंगठा वर) मुद्रा करा.", hint: "स्पष्ट थम्स अप मुद्रा 👍" }
  },
  "How Are You": {
    en: { name: "How Are You", desc: "Extend your index finger pointing gently forward toward the person/camera to ask 'How are you?'.", hint: "Point index finger forward 🙂" },
    hi: { name: "आप कैसे हैं? (How Are You)", desc: "'आप कैसे हैं?' पूछने के लिए अपनी तर्जनी उंगली को सामने कैमरे/व्यक्ति की ओर धीरे से इंगित करें।", hint: "तर्जनी उंगली आगे दिखाएं 🙂" },
    mr: { name: "आपण कसे आहात? (How Are You)", desc: "'तुम्ही कसे आहात?' विचारण्यासाठी तर्जनी बोट समोर कॅमेऱ्याकडे/व्यक्तीकडे निर्देश करा.", hint: "तर्जनी बोट पुढे दाखवा 🙂" }
  },
  "Happy Birthday": {
    en: { name: "Happy Birthday", desc: "Place your open flat hand gently over your chest/heart in the warm ISL birthday greeting.", hint: "Open flat hand touching your chest 🎂" },
    hi: { name: "जन्मदिन मुबारक (Happy Birthday)", desc: "हार्दिक ISL जन्मदिन अभिवादन के लिए अपनी खुली सपाट हथेली को धीरे से अपनी छाती/हृदय पर रखें।", hint: "हथेली छाती पर रखें 🎂" },
    mr: { name: "वाढदिवसाच्या शुभेच्छा (Happy Birthday)", desc: "ISL वाढदिवस अभिवादनासाठी हाताचा खुला तळहात छातीवर/हृदयावर हळूवार ठेवा.", hint: "खुला तळहात छातीवर ठेवा 🎂" }
  },
  "Happy Anniversary": {
    en: { name: "Happy Anniversary", desc: "Bring both hands forward in front of your chest and celebrate/clap with open palms.", hint: "Two open hands celebrating together 💐" },
    hi: { name: "सालगिरह मुबारक (Happy Anniversary)", desc: "दोनों हाथों को छाती के सामने लाएं और खुली हथेलियों से ताली बजाकर उत्सव मनाएं।", hint: "दोनों हाथों से ताली बजाकर उत्सव 💐" },
    mr: { name: "लग्नाच्या वाढदिवसाच्या शुभेच्छा (Happy Anniversary)", desc: "दोन्ही हात छातीसमोर पुढे आणून खुल्या तळहातांनी टाळ्या वाजवून आनंद व्यक्त करा.", hint: "दोन्ही हातांनी टाळ्या वाजवून उत्सव 💐" }
  },

  // Level 2: Colours
  "Black": {
    en: { name: "Black", desc: "Point your index finger towards your eyebrow or forehead.", hint: "Point index finger to forehead ⬛" },
    hi: { name: "काला (Black)", desc: "अपनी तर्जनी उंगली को अपनी भौंह या माथे की ओर इंगित करें।", hint: "तर्जनी उंगली माथे पर लगाएं ⬛" },
    mr: { name: "काळा (Black)", desc: "तुमचे तर्जनी बोट भुवईकडे किंवा कपाळाकडे निर्देश करा.", hint: "तर्जनी बोट कपाळाला लावा ⬛" }
  },
  "Brown": {
    en: { name: "Brown", desc: "Form a B-handshape (flat 4 fingers) moving downward beside your cheek.", hint: "Flat hand on cheek 🟤" },
    hi: { name: "भूरा (Brown)", desc: "गाल के पास सपाट 4 उंगलियों को नीचे की ओर घुमाते हुए B-आकार बनाएं।", hint: "गाल के पास सपाट हाथ 🟤" },
    mr: { name: "तपकिरी (Brown)", desc: "गालाजवळ ४ बोटे सपाट ठेवून हात खाली आणत B-मुद्रा करा.", hint: "गालाजवळ सपाट हात 🟤" }
  },
  "Green": {
    en: { name: "Green", desc: "Form the G handshape shaking gently across your body in ISL.", hint: "G-hand shaking motion 🟢" },
    hi: { name: "हरा (Green)", desc: "ISL में G-हैंडशेप बनाएं और शरीर के सामने धीरे से हिलाएं।", hint: "G-आकार का हाथ हिलाएं 🟢" },
    mr: { name: "हिरवा (Green)", desc: "ISL मध्ये G-मुद्रा करा आणि छातीसमोर हलकेच हलवा.", hint: "G-मुद्रेचा हात हलवा 🟢" }
  },
  "Grey": {
    en: { name: "Grey", desc: "Pass open fingers between each other in front of the chest in ISL.", hint: "Intertwining fingers ⚪" },
    hi: { name: "स्लेटी / ग्रे (Grey)", desc: "छाती के सामने दोनों हाथों की खुली उंगलियों को आपस में क्रॉस करते हुए निकालें।", hint: "उंगलियों को आपस में मिलाएं ⚪" },
    mr: { name: "राखाडी (Grey)", desc: "छातीसमोर दोन्ही हातांची खुली बोटे एकमेकांमधून आरपार फिरवा.", hint: "बोटे एकमेकांत गुंफा ⚪" }
  },
  "Orange": {
    en: { name: "Orange", desc: "Squeeze your hand in front of your mouth/chin like squeezing an orange.", hint: "Squeezing hand at mouth 🍊" },
    hi: { name: "नारंगी (Orange)", desc: "संतरे को निचोड़ने की तरह मुंह/ठोड़ी के सामने हाथ को निचोड़ें।", hint: "मुंह के पास हाथ निचोड़ें 🍊" },
    mr: { name: "केशरी / नारंगी (Orange)", desc: "संत्रा पिळल्यासारखा हनुवटीसमोर/तोंडासमोर हात आकसून पिळा.", hint: "तोंडाजवळ हात पिळणे 🍊" }
  },
  "Pink": {
    en: { name: "Pink", desc: "Brush your middle or index finger downward across your lower lip/chin.", hint: "Touch chin/lower lip 🌸" },
    hi: { name: "गुलाबी (Pink)", desc: "अपनी मध्यमा या तर्जनी उंगली को निचले होंठ/ठोड़ी पर नीचे की ओर स्पर्श करें।", hint: "निचले होंठ या ठोड़ी को छुएं 🌸" },
    mr: { name: "गुलाबी (Pink)", desc: "तुमचे मधले किंवा तर्जनी बोट खालच्या ओठावर/हनुवटीवर हलकेच खाली ओढा.", hint: "हनुवटी किंवा ओठाला स्पर्श करा 🌸" }
  },
  "Red": {
    en: { name: "Red", desc: "Point your index finger to your lips and pull gently downward.", hint: "Index finger touches lip 🔴" },
    hi: { name: "लाल (Red)", desc: "अपनी तर्जनी उंगली को अपने होंठों पर रखें और धीरे से नीचे खींचें।", hint: "तर्जनी उंगली होंठ पर लगाएं 🔴" },
    mr: { name: "लाल (Red)", desc: "तर्जनी बोट ओठांवर ठेवा आणि हलकेच खाली ओढा.", hint: "तर्जनी बोट ओठाला लावा 🔴" }
  },
  "Violet": {
    en: { name: "Violet", desc: "Form a V / Peace handshape (index & middle fingers open) and shake gently.", hint: "V / Peace handshape 💜" },
    hi: { name: "बैंगनी (Violet)", desc: "V / शांति मुद्रा (तर्जनी और मध्यमा खुली) बनाएं और धीरे से हिलाएं।", hint: "V / शांति मुद्रा 💜" },
    mr: { name: "जांभळा (Violet)", desc: "V / शांततेची मुद्रा (तर्जनी आणि मधले बोट उघडे) करा आणि हलकेच हलवा.", hint: "V / पीस मुद्रा 💜" }
  },
  "White": {
    en: { name: "White", desc: "Place a flat hand on your chest and pull outward closing gently.", hint: "Flat hand pulling from chest ⚪" },
    hi: { name: "सफेद (White)", desc: "सपाट हाथ छाती पर रखें और उंगलियों को बंद करते हुए बाहर खींचें।", hint: "छाती से हाथ बाहर खींचें ⚪" },
    mr: { name: "पांढरा (White)", desc: "सपाट हात छातीवर ठेवा आणि बोटे मिटवत बाहेरच्या बाजूला ओढा.", hint: "छातीवरून हात बाहेर ओढा ⚪" }
  },
  "Yellow": {
    en: { name: "Yellow", desc: "Form a Y-handshape (thumb & pinky extended) and shake beside your shoulder.", hint: "Y-hand (thumb+pinky) shaking 💛" },
    hi: { name: "पीला (Yellow)", desc: "कंधे के पास Y-मुद्रा (अंगूठा और छोटी उंगली खुली) बनाकर हिलाएं।", hint: "कंधे के पास Y-हाथ हिलाएं 💛" },
    mr: { name: "पिवळा (Yellow)", desc: "खांद्याजवळ Y-मुद्रा (अंगठा आणि करंगळी उघडी) करून हलवा.", hint: "खांद्याजवळ Y-हात हलवा 💛" }
  },

  // Level 3: Alphabets (A-Z)
  "A": {
    en: { name: "A", desc: "Form a tight fist with your thumb resting upright along the side of your index finger.", hint: "Fist with thumb on side 🅰️" },
    hi: { name: "अक्षर A", desc: "अंगूठे को तर्जनी के बगल में सीधा रखते हुए एक मजबूत मुट्ठी बनाएं।", hint: "बगल में अंगूठे के साथ मुट्ठी 🅰️" },
    mr: { name: "अक्षर A", desc: "अंगठा तर्जनीच्या बाजूला सरळ ठेवून हाताची घट्ट मूठ बनवा.", hint: "बाजूला अंगठ्यासह मूठ 🅰️" }
  },
  "B": {
    en: { name: "B", desc: "Hold all four fingers flat and upright together with your thumb folded across your palm.", hint: "4 fingers straight up, thumb folded 🅱️" },
    hi: { name: "अक्षर B", desc: "चारों उंगलियों को सीधा ऊपर रखें और अंगूठे को हथेली पर मोड़ें।", hint: "4 उंगलियां सीधी ऊपर, अंगूठा मुड़ा 🅱️" },
    mr: { name: "अक्षर B", desc: "सर्व ४ बोटे सरळ वर एकत्र धरा आणि अंगठा तळहातावर दुमडा.", hint: "४ बोटे सरळ वर, अंगठा दुमडलेला 🅱️" }
  },
  "C": {
    en: { name: "C", desc: "Curve all four fingers and thumb forward forming a clear 'C' shape in the air.", hint: "Curved C-handshape 🅲" },
    hi: { name: "अक्षर C", desc: "चारों उंगलियों और अंगूठे को मोड़कर हवा में स्पष्ट 'C' आकार बनाएं।", hint: "C-आकार का हाथ 🅲" },
    mr: { name: "अक्षर C", desc: "सर्व चार बोटे आणि अंगठा वळवून हवेत स्पष्ट 'C' आकार बनवा.", hint: "वक्र C-मुद्रा 🅲" }
  },
  "D": {
    en: { name: "D", desc: "Point your index finger straight up while your thumb and remaining fingers touch to form a circle.", hint: "Index up, others form circle 🅳" },
    hi: { name: "अक्षर D", desc: "तर्जनी उंगली सीधी ऊपर रखें जबकि अंगूठा और अन्य उंगलियां मिलकर वृत्त बनाती हैं।", hint: "तर्जनी ऊपर, बाकी वृत्त बनाएं 🅳" },
    mr: { name: "अक्षर D", desc: "तर्जनी बोट सरळ वर ठेवा आणि अंगठा व इतर बोटे मिळून गोल वर्तुळ करा.", hint: "तर्जनी वर, इतर बोटे वर्तुळ करतात 🅳" }
  },
  "E": {
    en: { name: "E", desc: "Curl all four fingers downward with fingertips resting on your thumb folded tightly underneath.", hint: "Curled fingers resting on thumb 🅴" },
    hi: { name: "अक्षर E", desc: "चारों उंगलियों को नीचे मोड़ें और नीचे मुड़े अंगूठे पर उंगलियों के पोर टिकाएं।", hint: "अंगूठे पर टिकी मुड़ी उंगलियां 🅴" },
    mr: { name: "अक्षर E", desc: "सर्व चार बोटे खाली वळवून अंगठ्यावर बोटांचे शेंडे टेकवा.", hint: "अंगठ्यावर टेकलेली दुमडलेली बोटे 🅴" }
  },
  "F": {
    en: { name: "F", desc: "Touch your index fingertip to your thumb in an 'OK' circle while the other 3 fingers fan straight up.", hint: "OK sign (index touches thumb) 🅵" },
    hi: { name: "अक्षर F", desc: "तर्जनी और अंगूठे को छूकर 'OK' वृत्त बनाएं और बाकी 3 उंगलियां सीधी ऊपर रखें।", hint: "OK संकेत (तर्जनी अंगूठे को छूती है) 🅵" },
    mr: { name: "अक्षर F", desc: "तर्जनी आणि अंगठा जोडून 'OK' चिन्ह करा व इतर ३ बोटे सरळ वर ठेवा.", hint: "OK चिन्ह (तर्जनी अंगठ्याला स्पर्श करते) 🅵" }
  },
  "G": {
    en: { name: "G", desc: "Point your index finger horizontally forward with your thumb parallel just above it.", hint: "Index pointing sideways, thumb parallel 🅶" },
    hi: { name: "अक्षर G", desc: "तर्जनी उंगली को सामने क्षैतिज रखें और अंगूठे को उसके ठीक ऊपर समानांतर रखें।", hint: "तर्जनी आगे, अंगूठा समानांतर 🅶" },
    mr: { name: "अक्षर G", desc: "तर्जनी बोट पुढे आडवे ठेवा आणि अंगठा त्याच्या समांतर वर ठेवा.", hint: "तर्जनी पुढे, अंगठा समांतर 🅶" }
  },
  "H": {
    en: { name: "H", desc: "Extend both your index and middle fingers together horizontally sideways.", hint: "Index + Middle pointing sideways 🅷" },
    hi: { name: "अक्षर H", desc: "तर्जनी और मध्यमा दोनों उंगलियों को एक साथ क्षैतिज रूप से बाहर निकालें।", hint: "तर्जनी + मध्यमा क्षैतिज 🅷" },
    mr: { name: "अक्षर H", desc: "तर्जनी आणि मधले बोट एकत्र आडव्या दिशेने पुढे पसरवा.", hint: "तर्जनी + मधले बोट आडवे 🅷" }
  },
  "I": {
    en: { name: "I", desc: "Make a fist and extend only your pinky finger straight up into the air.", hint: "Pinky finger straight up 🅸" },
    hi: { name: "अक्षर I", desc: "मुट्ठी बनाएं और केवल अपनी छोटी उंगली (पिंकी) को हवा में सीधा ऊपर उठाएं।", hint: "छोटी उंगली सीधी ऊपर 🅸" },
    mr: { name: "अक्षर I", desc: "मूठ बनवा आणि फक्त करंगळी हवेत सरळ वर उचला.", hint: "करंगळी सरळ वर 🅸" }
  },
  "J": {
    en: { name: "J", desc: "Extend your pinky finger and trace the letter 'J' curve in the air.", hint: "Pinky draws a J curve 🅹" },
    hi: { name: "अक्षर J", desc: "छोटी उंगली को बाहर निकालें और हवा में 'J' अक्षर का वक्र रेखांकित करें।", hint: "छोटी उंगली से J बनाएं 🅹" },
    mr: { name: "अक्षर J", desc: "करंगळी वर काढून हवेत 'J' अक्षराचा आकार काढा.", hint: "करंगळीने J आकार काढा 🅹" }
  },
  "K": {
    en: { name: "K", desc: "Index finger points straight up, middle finger angles forward, and thumb touches between them.", hint: "V-shape with thumb in between 🅺" },
    hi: { name: "अक्षर K", desc: "तर्जनी ऊपर, मध्यमा आगे की ओर और अंगूठा दोनों के बीच टिकाएं।", hint: "अंगूठे के साथ V-आकार 🅺" },
    mr: { name: "अक्षर K", desc: "तर्जनी बोट वर, मधले बोट पुढे आणि अंगठा दोघांच्या मध्ये ठेवा.", hint: "अंगठ्यासह V-मुद्रा 🅺" }
  },
  "L": {
    en: { name: "L", desc: "Extend your index finger straight up and your thumb straight out at a 90-degree right angle.", hint: "L-shape (thumb + index at 90°) 🅻" },
    hi: { name: "अक्षर L", desc: "तर्जनी उंगली सीधी ऊपर और अंगूठे को 90 डिग्री के समकोण पर बाहर फैलाएं।", hint: "L-आकार (अंगूठा + तर्जनी 90°) 🅻" },
    mr: { name: "अक्षर L", desc: "तर्जनी बोट सरळ वर आणि अंगठा काटकोनात (90°) बाहेर पसरवून L आकार करा.", hint: "L-आकार (अंगठा + तर्जनी) 🅻" }
  },
  "M": {
    en: { name: "M", desc: "Fold your thumb under your first three fingers (index, middle, ring) resting on your palm.", hint: "Thumb under 3 fingers 🅼" },
    hi: { name: "अक्षर M", desc: "अंगूठे को अपनी पहली तीन उंगलियों के नीचे मोड़ें और हथेली पर टिकाएं।", hint: "3 उंगलियों के नीचे अंगूठा 🅼" },
    mr: { name: "अक्षर M", desc: "अंगठा पहिल्या ३ बोटांच्या (तर्जनी, मधले, अनामिका) खाली दुमडून ठेवा.", hint: "३ बोटांखाली अंगठा 🅼" }
  },
  "N": {
    en: { name: "N", desc: "Fold your thumb under your first two fingers (index, middle) with fingertips resting over it.", hint: "Thumb under 2 fingers 🅽" },
    hi: { name: "अक्षर N", desc: "अंगूठे को अपनी पहली दो उंगलियों के नीचे मोड़ें।", hint: "2 उंगलियों के नीचे अंगूठा 🅽" },
    mr: { name: "अक्षर N", desc: "अंगठा पहिल्या २ बोटांच्या (तर्जनी, मधले) खाली दुमडून ठेवा.", hint: "२ बोटांखाली अंगठा 🅽" }
  },
  "O": {
    en: { name: "O", desc: "Touch all four fingertips to your thumb to form a hollow circle shape ('O').", hint: "All fingertips touching thumb in O 🅾️" },
    hi: { name: "अक्षर O", desc: "गोल 'O' आकार बनाने के लिए चारों उंगलियों के पोर को अंगूठे से मिलाएं।", hint: "अंगूठे से सभी उंगलियां मिलाकर O बनाएं 🅾️" },
    mr: { name: "अक्षर O", desc: "पोकळ वर्तुळ ('O') तयार करण्यासाठी सर्व चार बोटे अंगठ्याला स्पर्श करा.", hint: "अंगठ्याला सर्व बोटे जोडून O करा 🅾️" }
  },
  "P": {
    en: { name: "P", desc: "Point your index finger forward and middle finger downward with thumb between them.", hint: "Downward pointing K-shape 🅿️" },
    hi: { name: "अक्षर P", desc: "तर्जनी को आगे और मध्यमा को नीचे की ओर रखें और अंगूठा बीच में रखें।", hint: "नीचे की ओर इशारा करता K-आकार 🅿️" },
    mr: { name: "अक्षर P", desc: "तर्जनी बोट पुढे आणि मधले बोट खाली निर्देश करा व अंगठा मध्ये ठेवा.", hint: "खाली निर्देशित K-आकार 🅿️" }
  },
  "Q": {
    en: { name: "Q", desc: "Point your index finger and thumb pointing straight downward.", hint: "Index & thumb pointing down 🆀" },
    hi: { name: "अक्षर Q", desc: "अपनी तर्जनी उंगली और अंगूठे को सीधे नीचे की ओर इंगित करें।", hint: "तर्जनी और अंगूठा नीचे 🆀" },
    mr: { name: "अक्षर Q", desc: "तर्जनी बोट आणि अंगठा सरळ खाली निर्देश करा.", hint: "तर्जनी व अंगठा खाली 🆀" }
  },
  "R": {
    en: { name: "R", desc: "Cross your middle finger over the back of your index finger in a luck sign.", hint: "Fingers crossed (middle over index) 🆁" },
    hi: { name: "अक्षर R", desc: "अपनी मध्यमा उंगली को तर्जनी उंगली के ऊपर क्रॉस करें (फिंगर्स क्रॉस्ड)।", hint: "क्रॉस उंगलियां 🆁" },
    mr: { name: "अक्षर R", desc: "मधले बोट तर्जनीच्या पाठीवर क्रॉस करा (फिंगर्स क्रॉस्ड).", hint: "क्रॉस केलेली बोटे 🆁" }
  },
  "S": {
    en: { name: "S", desc: "Make a firm fist with your thumb wrapped tightly across the front of your fingers.", hint: "Fist with thumb across front 🆂" },
    hi: { name: "अक्षर S", desc: "उंगलियों के सामने अंगूठे को लपेटकर एक मजबूत मुट्ठी बनाएं।", hint: "सामने अंगूठे के साथ मुट्ठी 🆂" },
    mr: { name: "अक्षर S", desc: "बोटांवरून अंगठा घट्ट गुंडाळून मजबूत मूठ बनवा.", hint: "बोटांवर अंगठा ठेवून मूठ 🆂" }
  },
  "T": {
    en: { name: "T", desc: "Tuck your thumb between your index and middle fingers inside your fist.", hint: "Thumb tucked between index & middle 🆃" },
    hi: { name: "अक्षर T", desc: "मुट्ठी के अंदर तर्जनी और मध्यमा के बीच अंगूठे को दबाएं।", hint: "तर्जनी और मध्यमा के बीच अंगूठा 🆃" },
    mr: { name: "अक्षर T", desc: "मुठीत तर्जनी आणि मधल्या बोटाच्या मध्ये अंगठा खोचा.", hint: "तर्जनी आणि मधल्या बोटात अंगठा 🆃" }
  },
  "U": {
    en: { name: "U", desc: "Hold both your index and middle fingers straight up together side-by-side.", hint: "Index + Middle together straight up 🆄" },
    hi: { name: "अक्षर U", desc: "तर्जनी और मध्यमा दोनों उंगलियों को एक साथ जोड़कर सीधी ऊपर रखें।", hint: "तर्जनी + मध्यमा साथ में ऊपर 🆄" },
    mr: { name: "अक्षर U", desc: "तर्जनी आणि मधले बोट एकत्र जोडून सरळ वर ठेवा.", hint: "तर्जनी + मधले बोट एकत्र वर 🆄" }
  },
  "V": {
    en: { name: "V", desc: "Hold your index and middle fingers straight up separated in a 'V' / Peace sign.", hint: "Peace / V sign 🆅" },
    hi: { name: "अक्षर V", desc: "तर्जनी और मध्यमा को अलग करके 'V' / शांति मुद्रा में रखें।", hint: "शांति / V मुद्रा 🆅" },
    mr: { name: "अक्षर V", desc: "तर्जनी आणि मधले बोट वेगळे करून 'V' / शांतता मुद्रेत धरा.", hint: "पीस / V मुद्रा 🆅" }
  },
  "W": {
    en: { name: "W", desc: "Hold your index, middle, and ring fingers straight up separated like a 'W'.", hint: "3 fingers spread open (W) 🆆" },
    hi: { name: "अक्षर W", desc: "तर्जनी, मध्यमा और अनामिका तीनों उंगलियों को खोलकर 'W' आकार बनाएं।", hint: "3 खुली उंगलियां (W) 🆆" },
    mr: { name: "अक्षर W", desc: "तर्जनी, मधले आणि अनामिका ३ बोटे उघडी ठेवून 'W' आकार करा.", hint: "३ बोटे पसरलेली (W) 🆆" }
  },
  "X": {
    en: { name: "X", desc: "Make a fist and bend your index finger into a hook shape pointing up.", hint: "Hooked index finger 🆇" },
    hi: { name: "अक्षर X", desc: "मुट्ठी बनाएं और अपनी तर्जनी उंगली को ऊपर हुक की तरह मोड़ें।", hint: "हुक जैसी तर्जनी 🆇" },
    mr: { name: "अक्षर X", desc: "मूठ बनवा आणि तर्जनी बोट हुकसारखे वाकवून वर ठेवा.", hint: "हुकसारखे वाकलेले तर्जनी बोट 🆇" }
  },
  "Y": {
    en: { name: "Y", desc: "Extend your thumb and pinky finger out wide with the middle three fingers closed.", hint: "Thumb and Pinky out (Y) 🆈" },
    hi: { name: "अक्षर Y", desc: "अंगूठा और छोटी उंगली चौड़ी खोलें और बीच की 3 उंगलियां बंद रखें।", hint: "अंगूठा + छोटी उंगली खुली (Y) 🆈" },
    mr: { name: "अक्षर Y", desc: "अंगठा आणि करंगळी बाहेर रुंद उघडा व मधली ३ बोटे बंद ठेवा.", hint: "अंगठा आणि करंगळी बाहेर (Y) 🆈" }
  },
  "Z": {
    en: { name: "Z", desc: "Extend your index finger and trace the letter 'Z' zigzag in the air.", hint: "Index draws Z zigzag in air 🆉" },
    hi: { name: "अक्षर Z", desc: "तर्जनी उंगली को आगे निकालें और हवा में 'Z' का टेढ़ा-मेढ़ा आकार बनाएं।", hint: "तर्जनी से Z आकार बनाएं 🆉" },
    mr: { name: "अक्षर Z", desc: "तर्जनी बोट पुढे काढून हवेत 'Z' असा झिगझॅग आकार काढा.", hint: "तर्जनीने Z झिगझॅग काढा 🆉" }
  },

  // Level 4: Festivals & Celebrations
  "Diwali": {
    en: { name: "Diwali", desc: "Spread both hands outward from the center with fluttering, twinkling fingers like lighting sparkling diyas and fireworks.", hint: "Both hands outward with twinkling fingers 🪔" },
    hi: { name: "दीवाली (Diwali)", desc: "दिये और आतिशबाजी की तरह दोनों हाथों को बाहर फैलाते हुए उंगलियों को टिमटिमाएं।", hint: "दोनों हाथों से दिये जलाने का संकेत 🪔" },
    mr: { name: "दिवाळी (Diwali)", desc: "दिवे आणि फटाक्यांप्रमाणे दोन्ही हात बाहेर पसरवून बोटे लुकलुकावा.", hint: "दोन्ही हातांनी दिवे लावण्याची मुद्रा 🪔" }
  },
  "Holi": {
    en: { name: "Holi", desc: "Throw and sprinkle imaginary vibrant gulal colors with both open palms joyfully dancing in the air.", hint: "Sprinkling colors with both hands 🎨" },
    hi: { name: "होली (Holi)", desc: "दोनों खुले हाथों से हवा में रंग और गुलाल उड़ाने का अभिनय करें।", hint: "दोनों हाथों से रंग उड़ाएं 🎨" },
    mr: { name: "होळी (Holi)", desc: "दोन्ही खुल्या हातांनी हवेत रंग आणि गुलाल उधळण्याची मुद्रा करा.", hint: "दोन्ही हातांनी रंग उधळणे 🎨" }
  },
  "Christmas": {
    en: { name: "Christmas", desc: "Trace a triangular Christmas tree shape downward with both palms joined at the peak.", hint: "Trace triangle tree shape with hands 🎄" },
    hi: { name: "क्रिसमस (Christmas)", desc: "दोनों हाथों को मिलाकर नीचे की ओर त्रिकोणीय क्रिसमस ट्री का आकार बनाएं।", hint: "त्रिकोणीय क्रिसमस ट्री का आकार 🎄" },
    mr: { name: "नाताळ / ख्रिसमस (Christmas)", desc: "दोन्ही हात एकत्र करून खाली त्रिकोणी ख्रिसमस ट्रीचा आकार तयार करा.", hint: "त्रिकोणी ख्रिसमस ट्रीचा आकार 🎄" }
  },
  "Eid": {
    en: { name: "Eid", desc: "Cross arms gently across chest curving outward in the traditional Eid Mubarak warm embrace.", hint: "Embrace greeting pose 🌙" },
    hi: { name: "ईद (Eid)", desc: "पारंपरिक ईद मुबारक अभिवादन में छाती पर हाथ रखकर गले मिलने की मुद्रा बनाएं।", hint: "गले मिलने की मुद्रा 🌙" },
    mr: { name: "ईद (Eid)", desc: "पारंपरिक ईद मुबारक अभिवादनामध्ये छातीसमोर हात ठेवून आलिंगन देण्याची मुद्रा करा.", hint: "ईद आलिंगन मुद्रा 🌙" }
  },
  "Ganesh Chaturthi": {
    en: { name: "Ganesh Chaturthi", desc: "Curve your dominant arm in front of your nose like an elephant trunk representing Lord Ganesha.", hint: "Elephant trunk gesture in front of nose 🐘" },
    hi: { name: "गणेश चतुर्थी (Ganesh Chaturthi)", desc: "भगवान गणेश को दर्शाने के लिए अपनी नाक के सामने सूंड की तरह हाथ घुमाएं।", hint: "नाक के सामने हाथी की सूंड का संकेत 🐘" },
    mr: { name: "गणेशोत्सव (Ganesh Chaturthi)", desc: "गणपती बाप्पाची सोंड दर्शवण्यासाठी नाकासमोर हात वळवून सोंडेसारखा हलवा.", hint: "नाकासमोर गणपतीच्या सोंडेचा आकार 🐘" }
  },
  "Navratri": {
    en: { name: "Navratri", desc: "Hold imaginary Dandiya sticks in both hands and perform the rhythmic Garba cross-clash gesture.", hint: "Dandiya sticks playing gesture 💃" },
    hi: { name: "नवरात्रि (Navratri)", desc: "दोनों हाथों में डांडिया स्टिक पकड़ने और गरबा खेलने की लयबद्ध मुद्रा बनाएं।", hint: "डांडिया खेलने की मुद्रा 💃" },
    mr: { name: "नवरात्री (Navratri)", desc: "दोन्ही हातांत दांडिया काठ्या पकडल्यासारखा गरब्याचा तालबद्ध अभिनय करा.", hint: "दांडिया खेळण्याची मुद्रा 💃" }
  },
  "Durga Puja": {
    en: { name: "Durga Puja", desc: "Hold multiple divine hand gestures with a Trishul blessing pose representing Goddess Durga.", hint: "Trishul blessing pose 🔱" },
    hi: { name: "दुर्गा पूजा (Durga Puja)", desc: "मां दुर्गा को दर्शाने के लिए त्रिशूल और आशीर्वाद की दिव्य मुद्रा बनाएं।", hint: "त्रिशूल और आशीर्वाद मुद्रा 🔱" },
    mr: { name: "दुर्गा पूजा (Durga Puja)", desc: "दुर्गा मातेचे त्रिशूळ आणि आशीर्वाद दर्शवणारी दिव्य मुद्रा करा.", hint: "त्रिशूळ व आशीर्वाद मुद्रा 🔱" }
  },
  "Dussehra": {
    en: { name: "Dussehra", desc: "Draw an imaginary bow and arrow representing Lord Rama's victory over Ravana.", hint: "Pulling bow and arrow gesture 🏹" },
    hi: { name: "दशहरा (Dussehra)", desc: "भगवान राम की रावण पर विजय दर्शाने के लिए धनुष और तीर खींचने की मुद्रा बनाएं।", hint: "धनुष-बाण चलाने की मुद्रा 🏹" },
    mr: { name: "दसरा (Dussehra)", desc: "श्रीरामांचा रावणावरील विजय दर्शवण्यासाठी धनुष्य-बाण चालवण्याची मुद्रा करा.", hint: "धनुष्य-बाण चालवणे 🏹" }
  },
  "Raksha Bandhan": {
    en: { name: "Raksha Bandhan", desc: "Tie an imaginary sacred Rakhi thread around your left wrist with your right fingers.", hint: "Tying Rakhi on wrist 🧵" },
    hi: { name: "रक्षाबंधन (Raksha Bandhan)", desc: "अपनी दाहिनी उंगलियों से बायीं कलाई पर राखी का पवित्र धागा बांधने का अभिनय करें।", hint: "कलाई पर राखी बांधने की मुद्रा 🧵" },
    mr: { name: "रक्षाबंधन (Raksha Bandhan)", desc: "उजव्या हाताच्या बोटांनी डाव्या मनगटावर राखी बांधल्यासारखी मुद्रा करा.", hint: "मनगटावर राखी बांधणे 🧵" }
  },
  "Janmashtami": {
    en: { name: "Janmashtami", desc: "Hold both hands horizontally to your lips as if playing Lord Krishna's divine flute.", hint: "Playing Krishna flute pose 🪈" },
    hi: { name: "जन्माष्टमी (Janmashtami)", desc: "भगवान कृष्ण की दिव्य बांसुरी बजाने की तरह दोनों हाथों को होंठों के पास रखें।", hint: "बांसुरी बजाने की मुद्रा 🪈" },
    mr: { name: "गोकुळाष्टमी / जन्माष्टमी (Janmashtami)", desc: "श्रीकृष्णाची बासरी वाजवल्याप्रमाणे दोन्ही हात ओठांजवळ आडवे धरा.", hint: "बासरी वाजवण्याची मुद्रा 🪈" }
  },
  "Independence Day": {
    en: { name: "Independence Day", desc: "Salute with flat hand at forehead then flutter hand upward like the Indian Tricolor flag.", hint: "Salute then flutter hand like flag 🇮🇳" },
    hi: { name: "स्वतंत्रता दिवस (Independence Day)", desc: "माथे पर सैल्यूट करें फिर तिरंगे झंडे की तरह हाथ को ऊपर लहराएं।", hint: "सैल्यूट और तिरंगा फहराने का संकेत 🇮🇳" },
    mr: { name: "स्वातंत्र्य दिन (Independence Day)", desc: "कपाळावर सॅल्यूट करा आणि नंतर तिरंग्याप्रमाणे हात वर फडकवा.", hint: "सॅल्यूट आणि तिरंगा फडकवणे 🇮🇳" }
  },
  "Republic Day": {
    en: { name: "Republic Day", desc: "Make the firm constitution parade salute with pride representing January 26th.", hint: "Firm patriotic salute 🇮🇳" },
    hi: { name: "गणतंत्र दिवस (Republic Day)", desc: "26 जनवरी के सम्मान में गर्व के साथ संविधान परेड सैल्यूट करें।", hint: "गर्व से सैल्यूट मुद्रा 🇮🇳" },
    mr: { name: "प्रजासत्ताक दिन (Republic Day)", desc: "२६ जानेवारीच्या सन्मानार्थ अभिमानाने संचलन सॅल्यूट मुद्रा करा.", hint: "देशभक्तीची सॅल्यूट मुद्रा 🇮🇳" }
  },

  // Level 5: Numbers (1 to 10, 11 to 15, 25, 50, 100, 1000, etc.)
  "1": { en: { name: "Number 1", desc: "Hold index finger straight up with all other fingers closed in a fist.", hint: "Index finger straight up ☝️" }, hi: { name: "संख्या 1 (One)", desc: "तर्जनी उंगली को सीधा ऊपर रखें और बाकी उंगलियां मुट्ठी में बंद रखें।", hint: "तर्जनी उंगली ऊपर ☝️" }, mr: { name: "अंक १ (One)", desc: "तर्जनी बोट सरळ वर धरा आणि बाकीची बोटे मुठीत बंद ठेवा.", hint: "तर्जनी बोट वर ☝️" } },
  "2": { en: { name: "Number 2", desc: "Hold index and middle fingers straight up in a 'V' shape.", hint: "2 fingers up (Index + Middle) ✌️" }, hi: { name: "संख्या 2 (Two)", desc: "तर्जनी और मध्यमा उंगली को 'V' आकार में ऊपर रखें।", hint: "2 उंगलियां ऊपर (V आकार) ✌️" }, mr: { name: "अंक २ (Two)", desc: "तर्जनी आणि मधले बोट 'V' आकारात सरळ वर धरा.", hint: "२ बोटे वर (V आकार) ✌️" } },
  "3": { en: { name: "Number 3", desc: "Hold thumb, index, and middle fingers extended.", hint: "3 fingers extended 🤟" }, hi: { name: "संख्या 3 (Three)", desc: "अंगूठा, तर्जनी और मध्यमा उंगली को खोलकर सीधा रखें।", hint: "3 उंगलियां खुली 🤟" }, mr: { name: "अंक ३ (Three)", desc: "अंगठा, तर्जनी आणि मधले बोट उघडे सरळ ठेवा.", hint: "३ बोटे उघडी 🤟" } },
  "4": { en: { name: "Number 4", desc: "Hold all four fingers flat upright with thumb folded across palm.", hint: "4 fingers straight up 🖐️" }, hi: { name: "संख्या 4 (Four)", desc: "चारों उंगलियों को सीधा ऊपर रखें और अंगूठे को हथेली पर मोड़ें।", hint: "4 उंगलियां सीधी ऊपर 🖐️" }, mr: { name: "अंक ४ (Four)", desc: "सर्व चार बोटे सरळ वर धरा आणि अंगठा तळहातावर दुमडा.", hint: "४ बोटे सरळ वर 🖐️" } },
  "5": { en: { name: "Number 5", desc: "Open all five fingers wide with palm facing forward.", hint: "All 5 fingers open 🖐️" }, hi: { name: "संख्या 5 (Five)", desc: "हथेली को सामने रखकर पांचों उंगलियां चौड़ी खोलें।", hint: "पांचों उंगलियां खुली 🖐️" }, mr: { name: "अंक ५ (Five)", desc: "तळहात पुढे ठेवून पाचही बोटे रुंद उघडा.", hint: "पाचही बोटे उघडी 🖐️" } },
  "6": { en: { name: "Number 6", desc: "Touch thumb to pinky finger with middle 3 fingers extended upright.", hint: "Thumb touches pinky (6) 👌" }, hi: { name: "संख्या 6 (Six)", desc: "अंगूठे को छोटी उंगली से छुएं और बीच की 3 उंगलियां सीधी रखें।", hint: "अंगूठा छोटी उंगली से मिलाएं 👌" }, mr: { name: "अंक ६ (Six)", desc: "अंगठा करंगळीला लावा आणि मधली ३ बोटे सरळ वर ठेवा.", hint: "अंगठा करंगळीला स्पर्श करतो 👌" } },
  "7": { en: { name: "Number 7", desc: "Touch thumb to ring finger with other fingers extended upright.", hint: "Thumb touches ring finger (7) ✋" }, hi: { name: "संख्या 7 (Seven)", desc: "अंगूठे को अनामिका (रिंग फिंगर) से छुएं।", hint: "अंगूठा अनामिका से मिलाएं ✋" }, mr: { name: "अंक ७ (Seven)", desc: "अंगठा अनामिकेला लावा आणि इतर बोटे सरळ ठेवा.", hint: "अंगठा अनामिकेला स्पर्श करतो ✋" } },
  "8": { en: { name: "Number 8", desc: "Touch thumb to middle finger with remaining fingers extended.", hint: "Thumb touches middle finger (8) ✋" }, hi: { name: "संख्या 8 (Eight)", desc: "अंगूठे को मध्यमा उंगली से छुएं।", hint: "अंगूठा मध्यमा से मिलाएं ✋" }, mr: { name: "अंक ८ (Eight)", desc: "अंगठा मधल्या बोटाला लावा आणि इतर बोटे सरळ ठेवा.", hint: "अंगठा मधल्या बोटाला स्पर्श करतो ✋" } },
  "9": { en: { name: "Number 9", desc: "Touch thumb to index fingertip in a neat circular ring.", hint: "Thumb touches index finger (9) 👌" }, hi: { name: "संख्या 9 (Nine)", desc: "अंगूठे और तर्जनी के पोरों को मिलाकर वृत्त बनाएं।", hint: "अंगूठा और तर्जनी मिलाएं 👌" }, mr: { name: "अंक ९ (Nine)", desc: "अंगठा आणि तर्जनीचे शेंडे एकत्र जोडून गोल करा.", hint: "अंगठा आणि तर्जनी एकत्र 👌" } },
  "10": { en: { name: "Number 10", desc: "Hold a firm thumbs-up and shake or twist your wrist slightly.", hint: "Thumbs up shaking gesture 🔟" }, hi: { name: "संख्या 10 (Ten)", desc: "अंगूठा ऊपर (थम्ब्स अप) करके कलाई को धीरे से हिलाएं।", hint: "थम्ब्स अप हिलाएं 🔟" }, mr: { name: "अंक १० (Ten)", desc: "अंगठा वर करून (थम्स अप) मनगट हलकेच हलवा.", hint: "थम्स अप हलवणे 🔟" } },
  "11": { en: { name: "Number 11", desc: "Flick your index finger upward from your thumb twice.", hint: "Flick index finger up 1️⃣1️⃣" }, hi: { name: "संख्या 11 (Eleven)", desc: "तर्जनी उंगली को अंगूठे से दो बार ऊपर की ओर झटकें।", hint: "तर्जनी ऊपर झटकें 1️⃣1️⃣" }, mr: { name: "अंक ११ (Eleven)", desc: "तर्जनी बोट अंगठ्यावरून दोनदा वर उडवा.", hint: "तर्जनी वर उडवणे 1️⃣1️⃣" } },
  "12": { en: { name: "Number 12", desc: "Flick both index and middle fingers upward together.", hint: "Flick 2 fingers up 1️⃣2️⃣" }, hi: { name: "संख्या 12 (Twelve)", desc: "तर्जनी और मध्यमा दोनों उंगलियों को एक साथ ऊपर झटकें।", hint: "2 उंगलियां ऊपर झटकें 1️⃣2️⃣" }, mr: { name: "अंक १२ (Twelve)", desc: "तर्जनी आणि मधले बोट एकत्र वर उडवा.", hint: "२ बोटे वर उडवणे 1️⃣2️⃣" } },
  "13": { en: { name: "Number 13", desc: "Wiggle index and middle fingers together toward yourself.", hint: "Wiggle 2 fingers in 1️⃣3️⃣" }, hi: { name: "संख्या 13 (Thirteen)", desc: "तर्जनी और मध्यमा उंगलियों को अपनी ओर मोड़कर हिलाएं।", hint: "2 उंगलियां अंदर की ओर मोड़ें 1️⃣3️⃣" }, mr: { name: "अंक १३ (Thirteen)", desc: "तर्जनी आणि मधले बोट स्वतःकडे वाकवून हलवा.", hint: "२ बोटे स्वतःकडे हलवणे 1️⃣3️⃣" } },
  "14": { en: { name: "Number 14", desc: "Wiggle four extended fingers gently toward yourself.", hint: "Wiggle 4 fingers in 1️⃣4️⃣" }, hi: { name: "संख्या 14 (Fourteen)", desc: "चारों उंगलियों को अपनी ओर मोड़कर हिलाएं।", hint: "4 उंगलियां अंदर मोड़ें 1️⃣4️⃣" }, mr: { name: "अंक १४ (Fourteen)", desc: "चारही बोटे स्वतःकडे वाकवून हलवा.", hint: "४ बोटे स्वतःकडे हलवणे 1️⃣4️⃣" } },
  "15": { en: { name: "Number 15", desc: "Wave all five open fingers gently forward and back.", hint: "Wave all 5 fingers 1️⃣5️⃣" }, hi: { name: "संख्या 15 (Fifteen)", desc: "पांचों उंगलियां खोलकर आगे-पीछे हिलाएं।", hint: "5 उंगलियां हिलाएं 1️⃣5️⃣" }, mr: { name: "अंक १५ (Fifteen)", desc: "पाचही बोटे उघडून पुढे-मागे हलवा.", hint: "५ बोटे हलवणे 1️⃣5️⃣" } },
  "25": { en: { name: "Number 25", desc: "Wiggle your middle finger with open 5-handshape.", hint: "Middle finger wiggle 2️⃣5️⃣" }, hi: { name: "संख्या 25 (Twenty Five)", desc: "खुले हाथ के साथ मध्यमा उंगली को हिलाएं।", hint: "मध्यमा उंगली हिलाएं 2️⃣5️⃣" }, mr: { name: "अंक २५ (Twenty Five)", desc: "खुल्या हातासह मधले बोट हलवा.", hint: "मधले बोट हलवणे 2️⃣5️⃣" } },
  "50": { en: { name: "Number 50", desc: "Show 5-handshape followed by 0-handshape (O shape).", hint: "5 followed by 0 5️⃣0️⃣" }, hi: { name: "संख्या 50 (Fifty)", desc: "पहले 5 दिखाएं फिर 0 (शून्य) का आकार बनाएं।", hint: "5 फिर 0 बनाएं 5️⃣0️⃣" }, mr: { name: "अंक ५० (Fifty)", desc: "आधी ५ दाखवा आणि नंतर ० (शून्य) मुद्रा करा.", hint: "५ नंतर ० मुद्रा 5️⃣0️⃣" } },
  "100": { en: { name: "Number 100", desc: "Show number 1 followed by curved C-handshape (Century).", hint: "1 then C-shape 💯" }, hi: { name: "संख्या 100 (Hundred)", desc: "पहले 1 दिखाएं फिर C-आकार बनाकर पीछे खींचें।", hint: "1 और C आकार 💯" }, mr: { name: "अंक १०० (Hundred)", desc: "आधी १ दाखवा आणि नंतर C-मुद्रा करून मागे घ्या.", hint: "१ आणि C आकार 💯" } },
  "1000": { en: { name: "1 Thousand (1,000)", desc: "Show 1-finger then tap open palm indicating Thousand.", hint: "1 followed by Thousand palm tap 1️⃣0️⃣0️⃣0️⃣" }, hi: { name: "1 हजार (1,000)", desc: "1 का संकेत दें और हथेली पर थपथपाकर हजार का संकेत बनाएं।", hint: "1 और हजार का संकेत 1️⃣0️⃣0️⃣0️⃣" }, mr: { name: "१ हजार (1,000)", desc: "१ दाखवून तळहातावर थाप मारून हजार दर्शवा.", hint: "१ आणि हजार चिन्ह 1️⃣0️⃣0️⃣0️⃣" } },
  "10000": { en: { name: "10 Thousand (10,000)", desc: "Show 10 gesture followed by Thousand palm tap.", hint: "10 followed by Thousand tap 🔟0️⃣0️⃣0️⃣" }, hi: { name: "10 हजार (10,000)", desc: "10 का संकेत दें फिर हजार का संकेत बनाएं।", hint: "10 और हजार का संकेत 🔟0️⃣0️⃣0️⃣" }, mr: { name: "१० हजार (10,000)", desc: "१० दाखवून हजार दर्शवा.", hint: "१० आणि हजार चिन्ह 🔟0️⃣0️⃣0️⃣" } },
  "100000": { en: { name: "1 Lakh (1,00,000)", desc: "Show 1 gesture followed by Lakh hand sweep.", hint: "1 followed by Lakh sweep 💰" }, hi: { name: "1 लाख (1,00,000)", desc: "1 दिखाएं और फिर लाख का संकेत बनाएं।", hint: "1 और लाख का संकेत 💰" }, mr: { name: "१ लाख (1,00,000)", desc: "१ दाखवून लाख चिन्ह करा.", hint: "१ आणि लाख चिन्ह 💰" } },
  "1000000": { en: { name: "10 Lakh (1 Million)", desc: "Show 10 gesture followed by Lakh hand sweep.", hint: "10 followed by Lakh sweep 💰" }, hi: { name: "10 लाख (1 Million)", desc: "10 दिखाएं और फिर लाख का संकेत बनाएं।", hint: "10 और लाख का संकेत 💰" }, mr: { name: "१० लाख (1 Million)", desc: "१० दाखवून लाख चिन्ह करा.", hint: "१० आणि लाख चिन्ह 💰" } },
  "10cr": { en: { name: "10 Crore", desc: "Show 10 gesture followed by Crore C-twist curve.", hint: "10 followed by Crore twist 👑" }, hi: { name: "10 करोड़ (10 Crore)", desc: "10 दिखाएं और फिर करोड़ का विशेष C-ट्विस्ट संकेत बनाएं।", hint: "10 और करोड़ का संकेत 👑" }, mr: { name: "१० कोटी (10 Crore)", desc: "१० दाखवून कोटी दर्शवणारी C-ट्विस्ट मुद्रा करा.", hint: "१० आणि कोटी चिन्ह 👑" } },

  // Level 6: Jobs & Professions
  "Teacher": {
    en: { name: "Teacher", desc: "Touch index and middle fingertips to forehead near temple, then move outward indicating sharing wisdom and teaching.", hint: "Fingertips at temple moving outward 👨‍🏫" },
    hi: { name: "शिक्षक / शिक्षिका (Teacher)", desc: "कनपटी/माथे को छूकर छात्रों की ओर ज्ञान प्रसार करते हुए हाथ आगे बढ़ाएं।", hint: "माथे को छूकर हाथ आगे बढ़ाएं 👨‍🏫" },
    mr: { name: "शिक्षक / शिक्षिका (Teacher)", desc: "कपाळाला हात लावून विद्यार्थ्यांकडे ज्ञान प्रसारासाठी हात पुढे न्या.", hint: "कपाळाला हात लावून पुढे नेणे 👨‍🏫" }
  },
  "Doctor": {
    en: { name: "Doctor", desc: "Tap your index and middle fingertips gently on your opposite inner wrist like taking a pulse.", hint: "Two fingers checking wrist pulse 🩺" },
    hi: { name: "डॉक्टर / चिकित्सक (Doctor)", desc: "नाड़ी की जांच करने के लिए अपनी दो उंगलियों (तर्जनी + मध्यमा) से दूसरी कलाई को छुएं।", hint: "कलाई पर नाड़ी की जांच 🩺" },
    mr: { name: "डॉक्टर / वैद्य (Doctor)", desc: "नाडी तपासण्यासाठी तर्जनी व मधल्या बोटाने दुसऱ्या हाताचे मनगट तपासा.", hint: "मनगटावर नाडी तपासणे 🩺" }
  },
  "Driver": {
    en: { name: "Driver", desc: "Hold and steer an imaginary round vehicle steering wheel with both hands.", hint: "Steering wheel motion 🚗" },
    hi: { name: "ड्राइवर / चालक (Driver)", desc: "दोनों हाथों से गाड़ी का गोल स्टीयरिंग व्हील पकड़कर घुमाने का संकेत बनाएं।", hint: "स्टीयरिंग व्हील घुमाने का संकेत 🚗" },
    mr: { name: "चालक / ड्रायव्हर (Driver)", desc: "दोन्ही हातांनी वाहनाचे स्टिअरिंग धरून फिरवल्याचा अभिनय करा.", hint: "स्टिअरिंग फिरवणे 🚗" }
  },
  "Farmer": {
    en: { name: "Farmer", desc: "Sweep your flat open hand across waist level or chin indicating farming and crops.", hint: "Sweep hand across waist level 🌾" },
    hi: { name: "किसान / कृषक (Farmer)", desc: "खेती और फसलों को दर्शाने के लिए खुली सपाट हथेली को घुमाएं।", hint: "कमर के पास सपाट हाथ घुमाएं 🌾" },
    mr: { name: "शेतकरी (Farmer)", desc: "शेती आणि पिके दर्शवण्यासाठी सपाट हात फिरवा.", hint: "सपाट हात फिरवणे 🌾" }
  },
  "Lawyer": {
    en: { name: "Lawyer", desc: "Alternate both flat hands up and down like the balanced scales of justice.", hint: "Scales of justice motion ⚖️" },
    hi: { name: "वकील / अधिवक्ता (Lawyer)", desc: "न्याय के तराजू की तरह दोनों सपाट हाथों को ऊपर-नीचे बारी-बारी से संतुलित करें।", hint: "न्याय का तराजू संतुलित करना ⚖️" },
    mr: { name: "वकील (Lawyer)", desc: "न्यायाच्या पारड्यांप्रमाणे दोन्ही सपाट हात आलटून-पालटून वर-खाली करा.", hint: "न्यायाचे तराजू ⚖️" }
  },
  "Barber": {
    en: { name: "Barber", desc: "Move index and middle fingers in a scissors snipping motion near hair/ears.", hint: "Scissors snipping motion near ear ✂️" },
    hi: { name: "नाई / हज्जाम (Barber)", desc: "बालों या कान के पास कैंची की तरह तर्जनी और मध्यमा उंगलियों को चलाएं।", hint: "कैंची की तरह उंगलियां चलाना ✂️" },
    mr: { name: "न्हावी / केस कापणारा (Barber)", desc: "केसांजवळ किंवा कानाजवळ कात्रीप्रमाणे तर्जनी व मधले बोट चालवा.", hint: "कात्रीसारखी हालचाल ✂️" }
  },
  "Postman": {
    en: { name: "Postman", desc: "Mimic carrying mail bag strap and delivering a letter with thumb and index fingers.", hint: "Letter delivering gesture ✉️" },
    hi: { name: "डाकिया (Postman)", desc: "कंधे पर डाक थैले का पट्टा और हाथ से पत्र देने का संकेत बनाएं।", hint: "पत्र देने का संकेत ✉️" },
    mr: { name: "पोस्टमन / टपालवाला (Postman)", desc: "खांद्यावरील पिशवी आणि हाताने पत्र देण्याचा अभिनय करा.", hint: "पत्र देण्याची मुद्रा ✉️" }
  },
  "Sweeper": {
    en: { name: "Sweeper", desc: "Hold both hands together sweeping downward like holding a broom.", hint: "Broom sweeping motion 🧹" },
    hi: { name: "सफाई कर्मचारी (Sweeper)", desc: "झाड़ू पकड़ने की तरह दोनों हाथों से नीचे की ओर सफाई का संकेत बनाएं।", hint: "झाड़ू लगाने की मुद्रा 🧹" },
    mr: { name: "सफाई कामगार (Sweeper)", desc: "झाडू धरल्याप्रमाणे दोन्ही हातांनी खाली झाडण्याची मुद्रा करा.", hint: "झाडू मारण्याची मुद्रा 🧹" }
  },
  "Writer": {
    en: { name: "Writer", desc: "Hold imaginary pen with fingers and write smoothly across flat open palm.", hint: "Writing with pen on palm ✍️" },
    hi: { name: "लेखक / साहित्यकार (Writer)", desc: "उंगलियों से काल्पनिक कलम पकड़कर हथेली पर लिखने का अभिनय करें।", hint: "हथेली पर कलम से लिखना ✍️" },
    mr: { name: "लेखक (Writer)", desc: "बोटांनी पेन धरून उघड्या तळहातावर लिहिण्याचा अभिनय करा.", hint: "तळहातावर पेन चालवणे ✍️" }
  },

  // Level 7: Family & Relations
  "Father": {
    en: { name: "Father", desc: "Touch your thumb with an open flat hand to your forehead/temple.", hint: "Open hand thumb at forehead 👨" },
    hi: { name: "पिताजी / पापा (Father)", desc: "खुले हाथ के अंगूठे को अपने माथे या कनपटी पर टिकाएं (पुरुष ऊपरी चेहरा संकेत)।", hint: "माथे पर अंगूठा टिकाएं 👨" },
    mr: { name: "वडील / बाबा (Father)", desc: "उघड्या हाताचा अंगठा कपाळावर किंवा कानशिलाजवळ टेकवा.", hint: "कपाळावर अंगठा टेकवणे 👨" }
  },
  "Mother": {
    en: { name: "Mother", desc: "Touch your thumb with an open flat hand to your chin/lower cheek.", hint: "Open hand thumb at chin 👩" },
    hi: { name: "माताजी / माँ (Mother)", desc: "खुले हाथ के अंगूठे को अपनी ठोड़ी या निचले गाल पर टिकाएं (महिला निचला चेहरा संकेत)।", hint: "ठोड़ी पर अंगूठा टिकाएं 👩" },
    mr: { name: "आई / माता (Mother)", desc: "उघड्या हाताचा अंगठा हनुवटीला किंवा खालच्या गालाला स्पर्श करा.", hint: "हनुवटीला अंगठा टेकवणे 👩" }
  },
  "Brother": {
    en: { name: "Brother", desc: "Male forehead tap followed by bringing both index fingers parallel together.", hint: "Forehead tap + parallel index fingers 👦" },
    hi: { name: "भाई (Brother)", desc: "माथे पर पुरुष संकेत देने के बाद दोनों तर्जनी उंगलियों को एक साथ समानांतर लाएं।", hint: "माथा स्पर्श + तर्जनी उंगलियां 👦" },
    mr: { name: "भाऊ (Brother)", desc: "कपाळाला स्पर्श करून दोन्ही तर्जनी बोटे समांतर एकत्र आणा.", hint: "कपाळ स्पर्श + समांतर बोटे 👦" }
  },
  "Daughter": {
    en: { name: "Daughter", desc: "Female chin stroke followed by gentle baby cradle arm movement.", hint: "Chin stroke + baby cradle 👧" },
    hi: { name: "बेटी / पुत्री (Daughter)", desc: "ठोड़ी पर महिला संकेत देने के बाद बाहों में बच्चे को झुलाने का अभिनय करें।", hint: "ठोड़ी स्पर्श + गोद में झुलाना 👧" },
    mr: { name: "मुलगी / कन्या (Daughter)", desc: "हनुवटीला स्पर्श करून बाळाला पाळण्यात थोपटल्याचा अभिनय करा.", hint: "हनुवटी स्पर्श + बाळ थोपटणे 👧" }
  },
  "Husband": {
    en: { name: "Husband", desc: "Male forehead touch followed by clasping both hands together in marriage.", hint: "Male sign + clasp hands 🤵" },
    hi: { name: "पति (Husband)", desc: "माथे पर पुरुष संकेत के बाद विवाह मुद्रा में दोनों हाथों को आपस में जोड़ें।", hint: "पुरुष संकेत + हाथ जोड़ना 🤵" },
    mr: { name: "पती / नवरा (Husband)", desc: "कपाळावर पुरुष चिन्ह करून लग्नाच्या मुद्रेत दोन्ही हात एकत्र जोडा.", hint: "पुरुष चिन्ह + हात जोडणे 🤵" }
  },
  "Wife": {
    en: { name: "Wife", desc: "Female chin touch followed by clasping both hands together in marriage.", hint: "Female sign + clasp hands 👰" },
    hi: { name: "पत्नी (Wife)", desc: "ठोड़ी पर महिला संकेत के बाद विवाह मुद्रा में दोनों हाथों को आपस में जोड़ें।", hint: "महिला संकेत + हाथ जोड़ना 👰" },
    mr: { name: "पत्नी / बायको (Wife)", desc: "हनुवटीवर स्त्री चिन्ह करून लग्नाच्या मुद्रेत दोन्ही हात एकत्र जोडा.", hint: "स्त्री चिन्ह + हात जोडणे 👰" }
  },
  "Married": {
    en: { name: "Marriage / Married", desc: "Clasp right hand gently over left hand forming the marriage bond.", hint: "Clasped hands in marriage 💍" },
    hi: { name: "विवाह / शादीशुदा (Married)", desc: "विवाह का बंधन दर्शाने के लिए दाएं हाथ को बाएं हाथ पर रखकर जोड़ें।", hint: "हाथ जोड़कर विवाह मुद्रा 💍" },
    mr: { name: "विवाह / लग्न (Married)", desc: "लग्नाचे बंधन दर्शवण्यासाठी उजवा हात डाव्या हातावर ठेवून जोडा.", hint: "हात जोडून लग्न मुद्रा 💍" }
  },
  "Grandfather": {
    en: { name: "Grandfather", desc: "Touch thumb to forehead and bounce hand outward two gentle steps forward.", hint: "Father sign blooming forward 👴" },
    hi: { name: "दादाजी / नानाजी (Grandfather)", desc: "पिता के संकेत को माथे पर बनाकर हाथ को दो बार आगे की ओर बढ़ाएं।", hint: "पिता संकेत आगे बढ़ाएं 👴" },
    mr: { name: "आजोबा (Grandfather)", desc: "वडिलांचे कपाळावरील चिन्ह करून हात दोन वेळा पुढे न्या.", hint: "कपाळावरून हात पुढे नेणे 👴" }
  },
  "Grandmother": {
    en: { name: "Grandmother", desc: "Touch thumb to chin and bounce hand outward two gentle steps forward.", hint: "Mother sign blooming forward 👵" },
    hi: { name: "दादीजी / नानीजी (Grandmother)", desc: "माँ के संकेत को ठोड़ी पर बनाकर हाथ को दो बार आगे की ओर बढ़ाएं।", hint: "माँ संकेत आगे बढ़ाएं 👵" },
    mr: { name: "आजी (Grandmother)", desc: "आईचे हनुवटीवरील चिन्ह करून हात दोन वेळा पुढे न्या.", hint: "हनुवटीवरून हात पुढे नेणे 👵" }
  },
  "Family": {
    en: { name: "Family", desc: "Form 'F' shapes with both hands, circling outward to join together in a circle.", hint: "Two hands circling to form family circle 👨‍👩‍👧‍👦" },
    hi: { name: "परिवार / कुटुंब (Family)", desc: "दोनों हाथों से F-आकार बनाकर बाहर की ओर गोल घुमाते हुए आपस में जोड़ें।", hint: "हाथों से गोल परिवार वृत्त बनाना 👨‍👩‍👧‍👦" },
    mr: { name: "कुटुंब / परिवार (Family)", desc: "दोन्ही हातांनी F-मुद्रा करून बाहेरून गोल फिरवून कुटुंब वर्तुळ पूर्ण करा.", hint: "कुटुंब वर्तुळ तयार करणे 👨‍👩‍👧‍👦" }
  },
  "Man": {
    en: { name: "Man", desc: "Formal male sign with thumb/fingers at temple/forehead with proud posture.", hint: "Male indicator at forehead 👨" },
    hi: { name: "पुरुष / आदमी (Man)", desc: "माथे के पास हाथ से पुरुष का मानक सांकेतिक चिन्ह बनाएं।", hint: "माथे पर पुरुष संकेत 👨" },
    mr: { name: "पुरुष / माणूस (Man)", desc: "कपाळाजवळ हाताने पुरुषाचे प्रमाण सांकेतिक चिन्ह करा.", hint: "कपाळावर पुरुष चिन्ह 👨" }
  },
  "Woman": {
    en: { name: "Woman", desc: "Formal female sign with thumb/fingers brushing lower jaw/chin gracefully.", hint: "Female indicator at chin 👩" },
    hi: { name: "महिला / स्त्री (Woman)", desc: "ठोड़ी के पास हाथ से महिला का मानक सांकेतिक चिन्ह बनाएं।", hint: "ठोड़ी पर महिला संकेत 👩" },
    mr: { name: "महिला / स्त्री (Woman)", desc: "हनुवटीजवळ हाताने स्त्रीचे प्रमाण सांकेतिक चिन्ह करा.", hint: "हनुवटीवर स्त्री चिन्ह 👩" }
  },

  // Level 8: Question Words & Concepts
  "What": {
    en: { name: "What", desc: "Hold both open flat palms facing up and shake them gently side-to-side.", hint: "Both open palms up shaking side-to-side ❓" },
    hi: { name: "क्या? (What)", desc: "दोनों खुली हथेलियों को ऊपर की ओर रखकर धीरे से दोनों तरफ हिलाएं।", hint: "खुली हथेलियां ऊपर हिलाएं ❓" },
    mr: { name: "काय? (What)", desc: "दोन्ही उघडे तळहात वरच्या दिशेने ठेवून हळूवार दोन्ही बाजूला हलवा.", hint: "उघडे तळहात वर हलवणे ❓" }
  },
  "Where": {
    en: { name: "Where", desc: "Extend index finger pointing up and shake side-to-side inquiring location.", hint: "Index finger shaking side-to-side 📍" },
    hi: { name: "कहाँ? (Where)", desc: "स्थान पूछने के लिए अपनी तर्जनी उंगली को ऊपर उठाकर दोनों तरफ हिलाएं।", hint: "तर्जनी उंगली दोनों तरफ हिलाएं 📍" },
    mr: { name: "कुठे? (Where)", desc: "ठिकाण विचारण्यासाठी तर्जनी बोट वर करून दोन्ही बाजूला हलवा.", hint: "तर्जनी बोट बाजूला हलवणे 📍" }
  },
  "When": {
    en: { name: "When", desc: "Circle one index finger around the other upright index finger like clock hands.", hint: "Index circling other index finger ⏰" },
    hi: { name: "कब? (When)", desc: "घड़ी की सुइयों की तरह एक तर्जनी उंगली को दूसरी सीधी तर्जनी के चारों ओर घुमाएं।", hint: "तर्जनी को दूसरी उंगली के चारों ओर घुमाएं ⏰" },
    mr: { name: "केव्हा? (When)", desc: "घड्याळाच्या काट्याप्रमाणे एक तर्जनी बोट दुसऱ्या सरळ तर्जनीभोवती गोल फिरवा.", hint: "तर्जनीभोवती दुसरे बोट फिरवणे ⏰" }
  },
  "Which": {
    en: { name: "Which", desc: "Hold both thumbs up and alternate them up and down comparing choices.", hint: "Both thumbs up alternating up and down ⚖️" },
    hi: { name: "कौन सा? (Which)", desc: "विकल्पों की तुलना करने के लिए दोनों अंगूठे ऊपर रखकर बारी-बारी से ऊपर-नीचे करें।", hint: "दोनों अंगूठे ऊपर-नीचे करना ⚖️" },
    mr: { name: "कोणते? (Which)", desc: "पर्याय निवडण्यासाठी दोन्ही अंगठे वर करून आलटून-पालटून वर-खाली करा.", hint: "दोन्ही अंगठे वर-खाली करणे ⚖️" }
  },
  "Who": {
    en: { name: "Who", desc: "Circle index finger in front of lips/chin inquiring identity.", hint: "Index finger circling in front of lips 👤" },
    hi: { name: "कौन? (Who)", desc: "पहचान पूछने के लिए तर्जनी उंगली को अपने होंठों/ठोड़ी के सामने गोल घुमाएं।", hint: "होंठों के सामने तर्जनी घुमाना 👤" },
    mr: { name: "कोण? (Who)", desc: "ओळख विचारण्यासाठी तर्जनी बोट ओठांसमोर/हनुवटीसमोर गोल फिरवा.", hint: "ओठांसमोर बोट फिरवणे 👤" }
  },
  "How": {
    en: { name: "How", desc: "Start with curved hands palms down, roll them upward together to face palms up.", hint: "Both hands rolling upward palms-up 🔄" },
    hi: { name: "कैसे? (How)", desc: "हथेलियों को नीचे रखकर शुरू करें, फिर दोनों हाथों को ऊपर की ओर घुमाकर हथेलियां ऊपर करें।", hint: "हाथों को ऊपर घुमाकर खोलना 🔄" },
    mr: { name: "कसे? (How)", desc: "तळहात खाली ठेवून सुरुवात करा, नंतर दोन्ही हात वर फिरवून तळहात वर करा.", hint: "तळहात वर फिरवणे 🔄" }
  },
  "Question": {
    en: { name: "Question", desc: "Draw an imaginary question mark (?) in the air with your index finger.", hint: "Drawing question mark in air ❓" },
    hi: { name: "प्रश्न / सवाल (Question)", desc: "अपनी तर्जनी उंगली से हवा में प्रश्नवाचक चिन्ह (?) बनाएं।", hint: "हवा में प्रश्न चिन्ह बनाना ❓" },
    mr: { name: "प्रश्न (Question)", desc: "तर्जनी बोटाने हवेत प्रश्नचिन्ह (?) रेखाटा.", hint: "हवेत प्रश्नचिन्ह काढणे ❓" }
  },
  "Answer": {
    en: { name: "Answer", desc: "Place index finger at lips and point forward answering clearly.", hint: "Index finger moving from lips forward 💬" },
    hi: { name: "उत्तर / जवाब (Answer)", desc: "तर्जनी उंगली को होंठों पर रखकर स्पष्ट उत्तर देने के लिए आगे बढ़ाएं।", hint: "होंठों से उंगली आगे बढ़ाना 💬" },
    mr: { name: "उत्तर (Answer)", desc: "तर्जनी बोट ओठांवर ठेवून स्पष्ट उत्तरासाठी पुढे न्या.", hint: "ओठांवरून बोट पुढे नेणे 💬" }
  },
  "Time": {
    en: { name: "Time", desc: "Tap index finger twice on the wrist watch position.", hint: "Tapping watch on wrist ⌚" },
    hi: { name: "समय / वक्त (Time)", desc: "कलाई घड़ी की स्थिति पर अपनी तर्जनी उंगली से दो बार थपथपाएं।", hint: "कलाई पर घड़ी थपथपाना ⌚" },
    mr: { name: "वेळ / समय (Time)", desc: "मनगटावरील घड्याळाच्या जागी तर्जनी बोटाने दोनदा टॅप करा.", hint: "मनगटावर घड्याळ टॅप करणे ⌚" }
  },
  "Place": {
    en: { name: "Place / Location", desc: "Hold open palms flat indicating a geographical area or place.", hint: "Flat palms indicating place 📍" },
    hi: { name: "स्थान / जगह (Place)", desc: "खुली हथेलियों को सपाट रखकर किसी स्थान या क्षेत्र को दर्शाएं।", hint: "स्थान दर्शाने के लिए सपाट हाथ 📍" },
    mr: { name: "जागा / ठिकाण (Place)", desc: "उघडे तळहात सपाट ठेवून विशिष्ट जागा किंवा ठिकाण दर्शवा.", hint: "ठिकाण दर्शवणारे सपाट हात 📍" }
  },
  "Face": {
    en: { name: "Face", desc: "Trace a circular oval around your face with your index finger.", hint: "Tracing face contour 😊" },
    hi: { name: "चेहरा (Face)", desc: "अपनी तर्जनी उंगली से अपने चेहरे के चारों ओर एक अंडाकार वृत्त बनाएं।", hint: "चेहरे की रूपरेखा बनाना 😊" },
    mr: { name: "चेहरा (Face)", desc: "तर्जनी बोटाने आपल्या चेहऱ्याभोवती अंडाकृती वर्तुळ काढा.", hint: "चेहऱ्याभोवती वर्तुळ काढणे 😊" }
  },
  "This": {
    en: { name: "This", desc: "Point index finger firmly downward indicating this object or topic.", hint: "Index pointing down 👇" },
    hi: { name: "यह / यह वाला (This)", desc: "इस वस्तु या विषय को इंगित करने के लिए तर्जनी उंगली को नीचे की ओर रखें।", hint: "तर्जनी उंगली नीचे दिखाना 👇" },
    mr: { name: "हे / हे वाला (This)", desc: "ही वस्तू किंवा विषय दर्शवण्यासाठी तर्जनी बोट खाली दाखवा.", hint: "तर्जनी बोट खाली दाखवणे 👇" }
  },

  // Level 9: Daily Conversation & Sentences
  "Hello Nice To Meet You": {
    en: { name: "Hello, Nice to Meet You", desc: "Wave hello followed by bringing both index fingers together meeting happily.", hint: "Hello wave + meeting gesture 🤝" },
    hi: { name: "नमस्ते, आपसे मिलकर खुशी हुई", desc: "नमस्ते का संकेत दें और फिर दोनों तर्जनी उंगलियों को मिलाकर मिलने की खुशी व्यक्त करें।", hint: "नमस्ते + मिलने का संकेत 🤝" },
    mr: { name: "नमस्कार, तुम्हाला भेटून आनंद झाला", desc: "नमस्कार चिन्ह करून दोन्ही तर्जनी बोटे एकत्र आणून भेटीचा आनंद दर्शवा.", hint: "नमस्कार + भेटणे 🤝" }
  },
  "My Name Is": {
    en: { name: "My Name Is...", desc: "Touch chest with flat hand (My) followed by H-hand fingers tapping together (Name).", hint: "Chest tap (My) + Name tap 📛" },
    hi: { name: "मेरा नाम... है", desc: "छाती पर हाथ रखें (मेरा) और फिर दो उंगलियों को मिलाकर 'नाम' का संकेत बनाएं।", hint: "छाती स्पर्श (मेरा) + नाम संकेत 📛" },
    mr: { name: "माझे नाव... आहे", desc: "छातीवर हात ठेवा (माझे) आणि दोन बोटे एकत्र टॅप करून 'नाव' चिन्ह करा.", hint: "छाती स्पर्श (माझे) + नाव चिन्ह 📛" }
  },
  "I Am Deaf": {
    en: { name: "I Am Deaf", desc: "Touch index finger from ear to mouth indicating deaf identity.", hint: "Ear to mouth touch 🧏" },
    hi: { name: "मैं मूक-बधिर हूँ", desc: "अपनी तर्जनी उंगली को कान से मुंह तक ले जाकर मूक-बधिर पहचान का संकेत दें।", hint: "कान से मुंह तक उंगली छूना 🧏" },
    mr: { name: "मी कर्णबधिर आहे", desc: "तर्जनी बोटाने कानापासून ओठांपर्यंत स्पर्श करून कर्णबधिर ओळख दर्शवा.", hint: "कानापासून ओठांपर्यंत स्पर्श 🧏" }
  },
  "I Know Sign Language": {
    en: { name: "I Know Sign Language", desc: "Touch forehead (Know) followed by rolling both hands in sign language conversation.", hint: "Forehead touch (Know) + signing hands 🤟" },
    hi: { name: "मुझे सांकेतिक भाषा आती है", desc: "माथे को छुएं (जानना) और फिर दोनों हाथों से सांकेतिक भाषा में बात करने का संकेत दें।", hint: "माथा छूना + संकेत करना 🤟" },
    mr: { name: "मला सांकेतिक भाषा येते", desc: "कपाळाला स्पर्श करा (माहिती असणे) आणि दोन्ही हातांनी सांकेतिक संभाषणाची हालचाल करा.", hint: "कपाळ स्पर्श + सांकेतिक संवाद 🤟" }
  },
  "What Is Your Name": {
    en: { name: "What Is Your Name?", desc: "Point forward (Your) + Name fingers tap + What open palms shake.", hint: "Your + Name + What ❓" },
    hi: { name: "आपका नाम क्या है?", desc: "सामने इशारा करें (आपका) + नाम का संकेत + हथेलियां हिलाकर क्या पूछें।", hint: "आपका + नाम + क्या ❓" },
    mr: { name: "तुमचे नाव काय आहे?", desc: "समोर निर्देश (तुमचे) + नाव चिन्ह + काय चे तळहात हलवणे.", hint: "तुमचे + नाव + काय ❓" }
  },
  "Where Are You From": {
    en: { name: "Where Are You From?", desc: "Point forward (You) followed by place & where inquiry gesture.", hint: "You + Where location inquiry 🏡" },
    hi: { name: "आप कहाँ से हैं / आपका घर कहाँ है?", desc: "सामने इशारा करें (आप) और फिर स्थान एवं कहाँ का प्रश्न संकेत बनाएं।", hint: "आप + कहाँ 🏡" },
    mr: { name: "तुम्ही कुठून आहात / तुमचे घर कुठे आहे?", desc: "समोर निर्देश (तुम्ही) आणि ठिकाण व कुठे चे प्रश्न चिन्ह करा.", hint: "तुम्ही + कुठे 🏡" }
  },
  "What Do You Do": {
    en: { name: "What Do You Do? (Work)", desc: "Point forward (You) + Work hammer hands + What inquiring palms.", hint: "You + Work + What 💼" },
    hi: { name: "आप क्या काम करते हैं?", desc: "सामने इशारा करें (आप) + काम/व्यवसाय संकेत + क्या पूछने के लिए हथेलियां खोलें।", hint: "आप + काम + क्या 💼" },
    mr: { name: "तुम्ही काय काम करता?", desc: "समोर निर्देश (तुम्ही) + कामाचे चिन्ह + काय विचारण्यासाठी तळहात उघडणे.", hint: "तुम्ही + काम + काय 💼" }
  },
  "What Is Father Name": {
    en: { name: "What Is Your Father's Name?", desc: "Your + Father (forehead) + Name + What question sign.", hint: "Your + Father + Name + What 👨" },
    hi: { name: "आपके पिता का नाम क्या है?", desc: "आपका + पिता (माथा) + नाम + क्या का संयुक्त सांकेतिक वाक्य बनाएं।", hint: "आपका + पिता + नाम + क्या 👨" },
    mr: { name: "तुमच्या वडिलांचे नाव काय आहे?", desc: "तुमचे + वडील (कपाळ) + नाव + काय चे संयुक्त सांकेतिक वाक्य.", hint: "तुमचे + वडील + नाव + काय 👨" }
  },
  "My Profession": {
    en: { name: "My Profession / Student / Doctor", desc: "Self point followed by role indicator and badge gesture.", hint: "Self + Role gesture 🎓" },
    hi: { name: "मेरा पेशा / मैं विद्यार्थी/डॉक्टर हूँ", desc: "छाती पर इशारा करें और अपनी भूमिका/पेशा का संकेत प्रस्तुत करें।", hint: "स्वयं + पेशा संकेत 🎓" },
    mr: { name: "माझा व्यवसाय / मी विद्यार्थी/डॉक्टर आहे", desc: "स्वतःकडे निर्देश करून आपला व्यवसाय/भूमिका दर्शवा.", hint: "स्वतः + व्यवसाय मुद्रा 🎓" }
  },
  "Healthy And Happy": {
    en: { name: "Hope You Are Healthy & Happy", desc: "Both hands sweep from chest with thumbs up in vibrant wellness.", hint: "Chest sweep + Thumbs up wellness 😊" },
    hi: { name: "आशा है आप स्वस्थ और खुश हैं", desc: "छाती से दोनों हाथ बाहर लाकर थम्स अप दिखाते हुए प्रसन्नता व्यक्त करें।", hint: "स्वास्थ्य + प्रसन्नता संकेत 😊" },
    mr: { name: "आशा आहे तुम्ही निरोगी व आनंदी आहात", desc: "छातीवरून दोन्ही हात बाहेर आणून थम्स अप करून निरोगी व आनंदी भावना दर्शवा.", hint: "आरोग्य + आनंद मुद्रा 😊" }
  },
  "Sign Slowly": {
    en: { name: "Please Sign Slowly", desc: "Flat right hand moving gently and slowly across left forearm.", hint: "Slow gentle glide across arm 🐢" },
    hi: { name: "कृपया धीरे संकेत करें", desc: "धीमी गति दर्शाने के लिए दाहिने हाथ को बाईं बांह पर धीरे-धीरे आगे बढ़ाएं।", hint: "बांह पर धीमा हाथ चलाना 🐢" },
    mr: { name: "कृपया हळू सांकेतिक भाषा वापरा", desc: "हळूवार गती दर्शवण्यासाठी उजवा हात डाव्या हातावरून हळूहळू पुढे न्या.", hint: "हळूवार हात फिरवणे 🐢" }
  },
  "Sign Again": {
    en: { name: "Could You Please Sign Again?", desc: "Curved right hand pivoting into open left palm repeating gesture.", hint: "Pivoting hand repeating in palm 🔁" },
    hi: { name: "कृपया फिर से संकेत दिखाएं", desc: "दोबारा का संकेत देने के लिए दाहिने मुड़े हुए हाथ को बाईं हथेली में दोहराएं।", hint: "पुनः दोहराने का संकेत 🔁" },
    mr: { name: "कृपया पुन्हा करून दाखवाल का?", desc: "पुन्हा दर्शवण्यासाठी उजवा वळवलेला हात डाव्या तळहातावर पुन्हा टेकवा.", hint: "पुन्हा करण्याची मुद्रा 🔁" }
  },
  "Signing Very Fast": {
    en: { name: "You Are Signing Very Fast", desc: "Both hands flutter rapidly side-to-side signaling high speed.", hint: "Rapid flutter hands signaling fast ⚡" },
    hi: { name: "आप बहुत तेज़ संकेत कर रहे हैं", desc: "तीव्र गति का संकेत देने के लिए दोनों हाथों को तेजी से अगल-बगल हिलाएं।", hint: "तेज़ गति से हाथ हिलाना ⚡" },
    mr: { name: "तुम्ही खूप वेगाने सांकेतिक भाषा वापरत आहात", desc: "वेगवान गती दर्शवण्यासाठी दोन्ही हात वेगाने आजूबाजूला हलवा.", hint: "वेगाने हात हलवणे ⚡" }
  },
  "I Understand": {
    en: { name: "Yes, I Understand", desc: "Flick index finger upright from fist near temple (idea lightbulb).", hint: "Index flick near temple 💡" },
    hi: { name: "हाँ, मैं समझ गया", desc: "कनपटी के पास मुट्ठी से तर्जनी उंगली को ऊपर उछालें (विचार चमकना)।", hint: "कनपटी पर उंगली उछालना 💡" },
    mr: { name: "हो, मला समजले", desc: "कपाळाजवळ मुठीतून तर्जनी बोट वर उडवा (कल्पना सुचणे/समजणे).", hint: "कपाळाजवळ बोट वर करणे 💡" }
  },
  "I Dont Understand": {
    en: { name: "I Don't Understand", desc: "Flick index finger near temple while shaking head sideways.", hint: "Index flick with head shake 🤷" },
    hi: { name: "मुझे समझ नहीं आया", desc: "सिर को 'ना' में हिलाते हुए कनपटी के पास तर्जनी उंगली को उछालें।", hint: "सिर हिलाना + उंगली उछालना 🤷" },
    mr: { name: "मला समजले नाही", desc: "मान नकारार्थी हलवून कपाळाजवळ तर्जनी बोट वर करा.", hint: "मान हलवणे + बोट वर करणे 🤷" }
  },

  // Level 10: Emergency & Life Safety
  "Safe": {
    en: { name: "Safe", desc: "Cross arms in front of chest then open them wide outward indicating safety, protection, and security.", hint: "Arms cross and open wide 🛡️" },
    hi: { name: "सुरक्षित (Safe)", desc: "छाती के सामने दोनों हाथों को क्रॉस करें और फिर सुरक्षा दर्शाने के लिए बाहर चौड़ा खोलें।", hint: "हाथ क्रॉस करके चौड़ा खोलें 🛡️" },
    mr: { name: "सुरक्षित (Safe)", desc: "छातीसमोर दोन्ही हात क्रॉस करा आणि नंतर सुरक्षा दर्शवण्यासाठी बाहेर रुंद उघडा.", hint: "हात क्रॉस करून रुंद उघडा 🛡️" }
  },
  "Help": {
    en: { name: "Help", desc: "Rest your closed dominant fist upright on your flat open palm and lift both hands upward together.", hint: "Fist resting on flat palm lifting up 🆘" },
    hi: { name: "मदद / सहायता (Help)", desc: "अपनी बंद मुट्ठी को सपाट हथेली पर रखें और दोनों हाथों को एक साथ ऊपर उठाएं।", hint: "सपाट हथेली पर मुट्ठी रखकर ऊपर उठाएं 🆘" },
    mr: { name: "मदत (Help)", desc: "डाव्या सपाट तळहातावर उजव्या हाताची बंद मूठ ठेवा आणि दोन्ही हात एकत्र वर उचला.", hint: "सपाट तळहातावर मूठ ठेवून वर उचलणे 🆘" }
  },
  "Emergency": {
    en: { name: "Emergency Distress", desc: "Raise both waving hands high above your head signaling urgent distress and evacuation.", hint: "Both hands waving high above head 🚨" },
    hi: { name: "आपातकालीन संकट (Emergency)", desc: "तत्काल सहायता और निकासी के संकेत के लिए दोनों हाथों को सिर के ऊपर उठाएं।", hint: "दोनों हाथ ऊपर उठाकर संकट संकेत 🚨" },
    mr: { name: "आपत्कालीन संकट (Emergency)", desc: "त्वरित मदत आणि बाहेर पडण्यासाठी दोन्ही हात डोक्यावर उंच हलवा.", hint: "दोन्ही हात वर करून संकट इशारा 🚨" }
  }
};

export function getSignDetails(signName: string, lang: Language): LocalizedSign {
  const item = SIGN_TRANSLATIONS[signName];
  if (item && item[lang]) {
    return item[lang];
  }
  return {
    name: signName,
    desc: "Perform the standardized ISL gesture for this sign.",
    hint: ""
  };
}

export interface Sign {
  name: string;
  desc: string;
  mappedGesture: string;
  videoUrl: string;
  hint?: string;
}

export interface Category {
  name: string;
  icon: any;
  level: string;
  description: string;
  signs: Sign[];
}

export const CATEGORIES: Record<string, Category> = {
  basic: {
    name: "Greetings",
    icon: Compass,
    level: "🌱 Level 1",
    description: "Essential everyday greetings in Indian Sign Language",
    signs: [
      { name: "Hello", desc: "Raise your dominant hand with your open palm facing forward beside your ear/temple and make a gentle greeting wave.", mappedGesture: "Hello", videoUrl: "/level1-greeting/hello.mp4", hint: "Open hand up beside your head waving" },
      { name: "Namaste", desc: "Bring both flat palms together in front of your chest with fingers pointing straight up in the traditional Indian prayer mudra.", mappedGesture: "Namaste", videoUrl: "/level1-greeting/namaste.mp4", hint: "Press both palms together in front of your chest" },
      { name: "Good Morning", desc: "Show a Thumbs Up (Good) followed by blooming your open hand upward in front of your chest like a rising morning sun.", mappedGesture: "Good Morning", videoUrl: "/level1-greeting/goodmorning.mp4", hint: "Thumbs up 👍 then open hand blooming upwards ☀️" },
      { name: "Good Afternoon", desc: "First make a Thumbs Up (Good), then hold your open flat hand horizontally near chin/mouth level indicating midday sun.", mappedGesture: "Good Afternoon", videoUrl: "/level1-greeting/goodafternoon.mp4", hint: "Thumbs up 👍 then flat open hand at mid-level 🌤️" },
      { name: "Good Evening", desc: "First make a Thumbs Up (Good), then sweep your open hand downward across your chest representing the setting sun.", mappedGesture: "Good Evening", videoUrl: "/level1-greeting/goodevening.mp4", hint: "Thumbs up 👍 then sweep hand downward 🌆" },
      { name: "Good Night", desc: "Cross both your wrists or lower your hands gently in front of your chest in the resting evening pose.", mappedGesture: "Good Night", videoUrl: "/level1-greeting/goodnight.mp4", hint: "Cross your wrists in front of your chest 🌙" },
      { name: "Good Day", desc: "Form a clear, distinct Thumbs Up gesture with your dominant hand held in front of your chest.", mappedGesture: "Good Day", videoUrl: "/level1-greeting/goodDay.mp4", hint: "Firm thumbs up gesture 👍" },
      { name: "How Are You", desc: "Extend your index finger pointing gently forward toward the person/camera to ask 'How are you?'.", mappedGesture: "How Are You", videoUrl: "/level1-greeting/howareyou.mp4", hint: "Point index finger forward 🙂" },
      { name: "Happy Birthday", desc: "Place your open flat hand gently over your chest/heart in the warm ISL birthday greeting.", mappedGesture: "Happy Birthday", videoUrl: "/level1-greeting/happybirthday.mp4", hint: "Open flat hand touching your chest 🎂" },
      { name: "Happy Anniversary", desc: "Bring both hands forward in front of your chest and celebrate/clap with open palms.", mappedGesture: "Happy Anniversary", videoUrl: "/level1-greeting/happyaniversary.mp4", hint: "Two open hands celebrating together 💐" }
    ]
  },
  colors: {
    name: "Colours",
    icon: Palette,
    level: "🎨 Level 2",
    description: "Vibrant colour words and expressions in ISL",
    signs: [
      { name: "Black", desc: "Point your index finger towards your eyebrow or forehead.", mappedGesture: "Black", videoUrl: "/level2-colour/black.mp4", hint: "Point index finger to forehead ⬛" },
      { name: "Brown", desc: "Form a B-handshape (flat 4 fingers) moving downward beside your cheek.", mappedGesture: "Brown", videoUrl: "/level2-colour/brown.mp4", hint: "Flat hand on cheek 🟤" },
      { name: "Green", desc: "Form the G handshape shaking gently across your body in ISL.", mappedGesture: "Green", videoUrl: "/level2-colour/green.mp4", hint: "G-hand shaking motion 🟢" },
      { name: "Grey", desc: "Pass open fingers between each other in front of the chest in ISL.", mappedGesture: "Grey", videoUrl: "/level2-colour/grey.mp4", hint: "Intertwining fingers ⚪" },
      { name: "Orange", desc: "Squeeze your hand in front of your mouth/chin like squeezing an orange.", mappedGesture: "Orange", videoUrl: "/level2-colour/orange.mp4", hint: "Squeezing hand at mouth 🍊" },
      { name: "Pink", desc: "Brush your middle or index finger downward across your lower lip/chin.", mappedGesture: "Pink", videoUrl: "/level2-colour/pink.mp4", hint: "Touch chin/lower lip 🌸" },
      { name: "Red", desc: "Point your index finger to your lips and pull gently downward.", mappedGesture: "Red", videoUrl: "/level2-colour/red.mp4", hint: "Index finger touches lip 🔴" },
      { name: "Violet", desc: "Form a V / Peace handshape (index & middle fingers open) and shake gently.", mappedGesture: "Violet", videoUrl: "/level2-colour/violet.mp4", hint: "V / Peace handshape 💜" },
      { name: "White", desc: "Place a flat hand on your chest and pull outward closing gently.", mappedGesture: "White", videoUrl: "/level2-colour/white.mp4", hint: "Flat hand pulling from chest ⚪" },
      { name: "Yellow", desc: "Form a Y-handshape (thumb & pinky extended) and shake beside your shoulder.", mappedGesture: "Yellow", videoUrl: "/level2-colour/yellow.mp4", hint: "Y-hand (thumb+pinky) shaking 💛" }
    ]
  },
  alphabets: {
    name: "Alphabets (A-Z)",
    icon: BookOpen,
    level: "🔤 Level 3",
    description: "Complete A–Z Indian Sign Language fingerspelling vocabulary",
    signs: [
      { name: "A", desc: "Form a tight fist with your thumb resting upright along the side of your index finger.", mappedGesture: "A", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Fist with thumb on side 🅰️" },
      { name: "B", desc: "Hold all four fingers flat and upright together with your thumb folded across your palm.", mappedGesture: "B", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "4 fingers straight up, thumb folded 🅱️" },
      { name: "C", desc: "Curve all four fingers and thumb forward forming a clear 'C' shape in the air.", mappedGesture: "C", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Curved C-handshape 🅲" },
      { name: "D", desc: "Point your index finger straight up while your thumb and remaining fingers touch to form a circle.", mappedGesture: "D", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Index up, others form circle 🅳" },
      { name: "E", desc: "Curl all four fingers downward with fingertips resting on your thumb folded tightly underneath.", mappedGesture: "E", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Curled fingers resting on thumb 🅴" },
      { name: "F", desc: "Touch your index fingertip to your thumb in an 'OK' circle while the other 3 fingers fan straight up.", mappedGesture: "F", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "OK sign (index touches thumb) 🅵" },
      { name: "G", desc: "Point your index finger horizontally forward with your thumb parallel just above it.", mappedGesture: "G", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Index pointing sideways, thumb parallel 🅶" },
      { name: "H", desc: "Extend both your index and middle fingers together horizontally sideways.", mappedGesture: "H", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Index + Middle pointing sideways 🅷" },
      { name: "I", desc: "Make a fist and extend only your pinky finger straight up into the air.", mappedGesture: "I", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Pinky finger straight up 🅸" },
      { name: "J", desc: "Extend your pinky finger and trace the letter 'J' curve in the air.", mappedGesture: "J", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Pinky draws a J curve 🅹" },
      { name: "K", desc: "Index finger points straight up, middle finger angles forward, and thumb touches between them.", mappedGesture: "K", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "V-shape with thumb in between 🅺" },
      { name: "L", desc: "Extend your index finger straight up and your thumb straight out at a 90-degree right angle.", mappedGesture: "L", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "L-shape (thumb + index at 90°) 🅻" },
      { name: "M", desc: "Fold your thumb under your first three fingers (index, middle, ring) resting on your palm.", mappedGesture: "M", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Thumb under 3 fingers 🅼" },
      { name: "N", desc: "Fold your thumb under your first two fingers (index, middle) with fingertips resting over it.", mappedGesture: "N", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Thumb under 2 fingers 🅽" },
      { name: "O", desc: "Touch all four fingertips to your thumb to form a hollow circle shape ('O').", mappedGesture: "O", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "All fingertips touching thumb in O 🅾️" },
      { name: "P", desc: "Point your index finger forward and middle finger downward with thumb between them.", mappedGesture: "P", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Downward pointing K-shape 🅿️" },
      { name: "Q", desc: "Point your index finger and thumb pointing straight downward.", mappedGesture: "Q", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Index & thumb pointing down 🆀" },
      { name: "R", desc: "Cross your middle finger over the back of your index finger in a luck sign.", mappedGesture: "R", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Fingers crossed (middle over index) 🆁" },
      { name: "S", desc: "Make a firm fist with your thumb wrapped tightly across the front of your fingers.", mappedGesture: "S", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Fist with thumb across front 🆂" },
      { name: "T", desc: "Tuck your thumb between your index and middle fingers inside your fist.", mappedGesture: "T", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Thumb tucked between index & middle 🆃" },
      { name: "U", desc: "Hold both your index and middle fingers straight up together side-by-side.", mappedGesture: "U", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Index + Middle together straight up 🆄" },
      { name: "V", desc: "Hold your index and middle fingers straight up separated in a 'V' / Peace sign.", mappedGesture: "V", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Peace / V sign 🆅" },
      { name: "W", desc: "Hold your index, middle, and ring fingers straight up separated like a 'W'.", mappedGesture: "W", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "3 fingers spread open (W) 🆆" },
      { name: "X", desc: "Make a fist and bend your index finger into a hook shape pointing up.", mappedGesture: "X", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Hooked index finger 🆇" },
      { name: "Y", desc: "Extend your thumb and pinky finger out wide with the middle three fingers closed.", mappedGesture: "Y", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Thumb and Pinky out (Y) 🆈" },
      { name: "Z", desc: "Extend your index finger and trace the letter 'Z' zigzag in the air.", mappedGesture: "Z", videoUrl: "/level3-Alphabets/ndian-Sign-Language-Alphabets-24.png", hint: "Index draws Z zigzag in air 🆉" }
    ]
  },
  festivals: {
    name: "Festivals & Celebrations",
    icon: Sparkles,
    level: "🎉 Level 4",
    description: "Auspicious Indian festivals and cultural celebrations in ISL",
    signs: [
      { name: "Diwali", desc: "Spread both hands outward from the center with fluttering, twinkling fingers like lighting sparkling diyas and fireworks.", mappedGesture: "Diwali", videoUrl: "/level4-Festivals/diwali.mp4", hint: "Twinkling fingers outward 🪔" },
      { name: "Holi", desc: "Throw and sprinkle imaginary vibrant gulal colors with both open palms joyfully dancing in the air.", mappedGesture: "Holi", videoUrl: "/level4-Festivals/holi.mp4", hint: "Sprinkling colors with both hands 🎨" },
      { name: "Christmas", desc: "Trace a triangular Christmas tree shape downward with both palms joined at the peak.", mappedGesture: "Christmas", videoUrl: "/level4-Festivals/christmas.mp4", hint: "Trace triangle tree shape 🎄" },
      { name: "Eid", desc: "Cross arms gently across chest curving outward in the traditional Eid Mubarak warm embrace.", mappedGesture: "Eid", videoUrl: "/level4-Festivals/eid.mp4", hint: "Warm embrace pose 🌙" },
      { name: "Ganesh Chaturthi", desc: "Curve your dominant arm in front of your nose like an elephant trunk representing Lord Ganesha.", mappedGesture: "Ganesh Chaturthi", videoUrl: "/level4-Festivals/ganesh.mp4", hint: "Elephant trunk gesture 🐘" },
      { name: "Navratri", desc: "Hold imaginary Dandiya sticks in both hands and perform the rhythmic Garba cross-clash gesture.", mappedGesture: "Navratri", videoUrl: "/level4-Festivals/navratri.mp4", hint: "Dandiya sticks playing gesture 💃" },
      { name: "Durga Puja", desc: "Hold multiple divine hand gestures with a Trishul blessing pose representing Goddess Durga.", mappedGesture: "Durga Puja", videoUrl: "/level4-Festivals/durgapoja.mp4", hint: "Trishul blessing pose 🔱" },
      { name: "Dussehra", desc: "Draw an imaginary bow and arrow representing Lord Rama's victory over Ravana.", mappedGesture: "Dussehra", videoUrl: "/level4-Festivals/dussehrea.mp4", hint: "Pulling bow and arrow 🏹" },
      { name: "Raksha Bandhan", desc: "Tie an imaginary sacred Rakhi thread around your left wrist with your right fingers.", mappedGesture: "Raksha Bandhan", videoUrl: "/level4-Festivals/rakshabadhan.mp4", hint: "Tying Rakhi on wrist 🧵" },
      { name: "Janmashtami", desc: "Hold both hands horizontally to your lips as if playing Lord Krishna's divine flute.", mappedGesture: "Janmashtami", videoUrl: "/level4-Festivals/janmashtami.mp4", hint: "Playing Krishna flute pose 🪈" },
      { name: "Independence Day", desc: "Salute with flat hand at forehead then flutter hand upward like the Indian Tricolor flag.", mappedGesture: "Independence Day", videoUrl: "/level4-Festivals/independenceday.mp4", hint: "Salute & flutter flag 🇮🇳" },
      { name: "Republic Day", desc: "Make the firm constitution parade salute with pride representing January 26th.", mappedGesture: "Republic Day", videoUrl: "/level4-Festivals/republic day.mp4", hint: "Firm parade salute 🇮🇳" }
    ]
  },
  numbers: {
    name: "Numbers & Counting",
    icon: Award,
    level: "🔢 Level 5",
    description: "Counting and number signs from 1 to 15, 100, 1000 up to Crores",
    signs: [
      { name: "1", desc: "Hold index finger straight up with all other fingers closed in a fist.", mappedGesture: "1", videoUrl: "/level5-numbers/1.png", hint: "Index finger up ☝️" },
      { name: "2", desc: "Hold index and middle fingers straight up in a 'V' shape.", mappedGesture: "2", videoUrl: "/level5-numbers/2.png", hint: "2 fingers up (V shape) ✌️" },
      { name: "3", desc: "Hold thumb, index, and middle fingers extended.", mappedGesture: "3", videoUrl: "/level5-numbers/3.png", hint: "3 fingers extended 🤟" },
      { name: "4", desc: "Hold all four fingers flat upright with thumb folded across palm.", mappedGesture: "4", videoUrl: "/level5-numbers/4.png", hint: "4 fingers straight up 🖐️" },
      { name: "5", desc: "Open all five fingers wide with palm facing forward.", mappedGesture: "5", videoUrl: "/level5-numbers/5.png", hint: "All 5 fingers open 🖐️" },
      { name: "6", desc: "Touch thumb to pinky finger with middle 3 fingers extended upright.", mappedGesture: "6", videoUrl: "/level5-numbers/6.mp4", hint: "Thumb touches pinky 👌" },
      { name: "7", desc: "Touch thumb to ring finger with other fingers extended upright.", mappedGesture: "7", videoUrl: "/level5-numbers/7.png", hint: "Thumb touches ring finger ✋" },
      { name: "8", desc: "Touch thumb to middle finger with remaining fingers extended.", mappedGesture: "8", videoUrl: "/level5-numbers/8.png", hint: "Thumb touches middle finger ✋" },
      { name: "9", desc: "Touch thumb to index fingertip in a neat circular ring.", mappedGesture: "9", videoUrl: "/level5-numbers/9.png", hint: "Thumb touches index finger 👌" },
      { name: "10", desc: "Hold a firm thumbs-up and shake or twist your wrist slightly.", mappedGesture: "10", videoUrl: "/level5-numbers/10.mp4", hint: "Thumbs up shaking gesture 🔟" },
      { name: "11", desc: "Flick your index finger upward from your thumb twice.", mappedGesture: "11", videoUrl: "/level5-numbers/11.mp4", hint: "Flick index finger up 1️⃣1️⃣" },
      { name: "12", desc: "Flick both index and middle fingers upward together.", mappedGesture: "12", videoUrl: "/level5-numbers/12.mp4", hint: "Flick 2 fingers up 1️⃣2️⃣" },
      { name: "13", desc: "Wiggle index and middle fingers together toward yourself.", mappedGesture: "13", videoUrl: "/level5-numbers/13.mp4", hint: "Wiggle 2 fingers in 1️⃣3️⃣" },
      { name: "14", desc: "Wiggle four extended fingers gently toward yourself.", mappedGesture: "14", videoUrl: "/level5-numbers/14.mp4", hint: "Wiggle 4 fingers in 1️⃣4️⃣" },
      { name: "15", desc: "Wave all five open fingers gently forward and back.", mappedGesture: "15", videoUrl: "/level5-numbers/15.mp4", hint: "Wave all 5 fingers 1️⃣5️⃣" },
      { name: "25", desc: "Wiggle your middle finger with open 5-handshape.", mappedGesture: "25", videoUrl: "/level5-numbers/25.mp4", hint: "Middle finger wiggle 2️⃣5️⃣" },
      { name: "50", desc: "Show 5-handshape followed by 0-handshape (O shape).", mappedGesture: "50", videoUrl: "/level5-numbers/50.mp4", hint: "5 followed by 0 5️⃣0️⃣" },
      { name: "100", desc: "Show number 1 followed by curved C-handshape (Century).", mappedGesture: "100", videoUrl: "/level5-numbers/100.mp4", hint: "1 then C-shape 💯" },
      { name: "1000", desc: "Show 1-finger then tap open palm indicating Thousand.", mappedGesture: "1000", videoUrl: "/level5-numbers/1000.mp4", hint: "1 followed by Thousand palm tap 1️⃣0️⃣0️⃣0️⃣" },
      { name: "10000", desc: "Show 10 gesture followed by Thousand palm tap.", mappedGesture: "10000", videoUrl: "/level5-numbers/10000.mp4", hint: "10 followed by Thousand tap 🔟0️⃣0️⃣0️⃣" },
      { name: "100000", desc: "Show 1 gesture followed by Lakh hand sweep.", mappedGesture: "100000", videoUrl: "/level5-numbers/100000.mp4", hint: "1 followed by Lakh sweep 💰" },
      { name: "1000000", desc: "Show 10 gesture followed by Lakh hand sweep.", mappedGesture: "1000000", videoUrl: "/level5-numbers/1000000.mp4", hint: "10 followed by Lakh sweep 💰" },
      { name: "10cr", desc: "Show 10 gesture followed by Crore C-twist curve.", mappedGesture: "10cr", videoUrl: "/level5-numbers/10cr.mp4", hint: "10 followed by Crore twist 👑" }
    ]
  },
  jobs: {
    name: "Jobs & Professions",
    icon: Briefcase,
    level: "💼 Level 6",
    description: "Important occupations, community helpers, and workplace professions in ISL",
    signs: [
      { name: "Teacher", desc: "Touch index and middle fingertips to forehead near temple, then move outward indicating sharing wisdom and teaching.", mappedGesture: "Teacher", videoUrl: "/level6-jobs/teacher.mp4", hint: "Fingertips at temple moving outward 👨‍🏫" },
      { name: "Doctor", desc: "Tap your index and middle fingertips gently on your opposite inner wrist like taking a pulse.", mappedGesture: "Doctor", videoUrl: "/level6-jobs/docter.mp4", hint: "2 fingers tapping inner wrist (pulse) 🩺" },
      { name: "Driver", desc: "Hold imaginary steering wheel with both fists and steer gently left and right.", mappedGesture: "Driver", videoUrl: "/level6-jobs/driver.mp4", hint: "Both hands holding steering wheel 🚗" },
      { name: "Farmer", desc: "Swipe open flat hand across waist level or chin indicating farming and crops.", mappedGesture: "Farmer", videoUrl: "/level6-jobs/framer.mp4", hint: "Sweep hand across waist level 🌾" },
      { name: "Lawyer", desc: "Hold one flat palm horizontal and balance the other hand on it like the scales of justice.", mappedGesture: "Lawyer", videoUrl: "/level6-jobs/lawyer.mp4", hint: "Hands balancing scales of justice ⚖️" },
      { name: "Barber", desc: "Move index and middle fingers in a scissors snipping motion near hair/ears.", mappedGesture: "Barber", videoUrl: "/level6-jobs/barber.mp4", hint: "Scissors cutting hair near ear ✂️" },
      { name: "Postman", desc: "Mimic carrying mail bag strap and delivering a letter with thumb and index fingers.", mappedGesture: "Postman", videoUrl: "/level6-jobs/postman.mp4", hint: "Letter delivering gesture ✉️" },
      { name: "Sweeper", desc: "Hold both hands together sweeping downward like holding a broom.", mappedGesture: "Sweeper", videoUrl: "/level6-jobs/sweeper.mp4", hint: "Broom sweeping motion 🧹" },
      { name: "Writer", desc: "Hold imaginary pen with fingers and write smoothly across flat open palm.", mappedGesture: "Writer", videoUrl: "/level6-jobs/writer.mp4", hint: "Writing with pen on palm ✍️" }
    ]
  },
  relations: {
    name: "Family & Relations",
    icon: Users,
    level: "👨‍👩‍👧‍👦 Level 7",
    description: "Close family members, kinship, relationships, and loved ones in ISL",
    signs: [
      { name: "Father", desc: "Place thumb of open 5-hand on forehead with fingers upright, indicating male elder.", mappedGesture: "Father", videoUrl: "/level7-relations/father.mp4", hint: "Thumb at forehead with open hand 👨" },
      { name: "Mother", desc: "Place thumb of open 5-hand on chin with fingers upright, indicating female elder.", mappedGesture: "Mother", videoUrl: "/level7-relations/mother.mp4", hint: "Thumb at chin with open hand 👩" },
      { name: "Brother", desc: "Sign Father (forehead) followed by bringing both index fingers parallel together in brotherhood.", mappedGesture: "Brother", videoUrl: "/level7-relations/brother'.mp4", hint: "Forehead touch + parallel index fingers 👦" },
      { name: "Daughter", desc: "Touch chin down into cradling arm gesture indicating baby girl.", mappedGesture: "Daughter", videoUrl: "/level7-relations/daughter.mp4", hint: "Chin touch to baby cradle 👧" },
      { name: "Husband", desc: "Male forehead touch followed by clasping both hands together in marriage.", mappedGesture: "Husband", videoUrl: "/level7-relations/husband.mp4", hint: "Male sign + clasp hands 🤵" },
      { name: "Wife", desc: "Female chin touch followed by clasping both hands together in marriage.", mappedGesture: "Wife", videoUrl: "/level7-relations/wife.mp4", hint: "Female sign + clasp hands 👰" },
      { name: "Married", desc: "Clasp right hand gently over left hand forming the marriage bond.", mappedGesture: "Married", videoUrl: "/level7-relations/married.mp4", hint: "Clasped hands in marriage 💍" },
      { name: "Grandfather", desc: "Touch thumb to forehead and bounce forward in two gentle arcs representing generations.", mappedGesture: "Grandfather", videoUrl: "/level7-relations/grandfather.mp4", hint: "Thumb at forehead bouncing forward 👴" },
      { name: "Grandmother", desc: "Touch thumb to chin and bounce forward in two gentle arcs representing generations.", mappedGesture: "Grandmother", videoUrl: "/level7-relations/grandmother.mp4", hint: "Thumb at chin bouncing forward 👵" },
      { name: "Family", desc: "Form 'F' hands with thumbs and index fingers touching, circling outward and meeting together.", mappedGesture: "Family", videoUrl: "/level7-relations/family.mp4", hint: "Both hands circle outward and meet 👨‍👩‍👦" },
      { name: "Man", desc: "Formal male sign with thumb/fingers at temple/forehead with proud posture.", mappedGesture: "Man", videoUrl: "/level7-relations/main.png", hint: "Male indicator at forehead 👨" },
      { name: "Woman", desc: "Formal female sign with thumb/fingers brushing lower jaw/chin gracefully.", mappedGesture: "Woman", videoUrl: "/level7-relations/women.png", hint: "Female indicator at chin 👩" }
    ]
  },
  questions: {
    name: "Question Words",
    icon: HelpCircle,
    level: "❓ Level 8",
    description: "Essential Wh-questions (What, Where, When, Why, Who, How, Which, Time, Place, etc.) in ISL",
    signs: [
      { name: "What", desc: "Hold both open palms facing upward in front of you and shake side-to-side with questioning expression.", mappedGesture: "What", videoUrl: "/level8-questions/what.mp4", hint: "Both palms facing up shaking side-to-side 🤷" },
      { name: "Where", desc: "Hold index finger pointing straight up and wave or shake it side to side inquiring location.", mappedGesture: "Where", videoUrl: "/level8-questions/where.mp4", hint: "Index finger wagging side to side 📍" },
      { name: "When", desc: "Circle right index finger around stationary left index finger tip representing the passage of time.", mappedGesture: "When", videoUrl: "/level8-questions/when.mp4", hint: "Index finger circles around other index ⏰" },
      { name: "Which", desc: "Hold both 'A' fist thumbs-up hands in front and alternate moving them up and down like weighing choices.", mappedGesture: "Which", videoUrl: "/level8-questions/which.mp4", hint: "Alternating thumbs up up and down 🔀" },
      { name: "Who", desc: "Place index finger near chin/lips and wiggle or circle index finger asking identity.", mappedGesture: "Who", videoUrl: "/level8-questions/who.mp4", hint: "Index finger wiggling at chin 👤" },
      { name: "How", desc: "Place curved backs of fingers together with palms facing down, then roll palms facing up.", mappedGesture: "How", videoUrl: "/level8-questions/how.mp4", hint: "Hands roll over from palms-down to palms-up 🔄" },
      { name: "Question", desc: "Draw an imaginary question mark (?) in the air with your index finger.", mappedGesture: "Question", videoUrl: "/level8-questions/question.mp4", hint: "Drawing question mark in air ❓" },
      { name: "Answer", desc: "Place index finger at lips and point forward answering clearly.", mappedGesture: "Answer", videoUrl: "/level8-questions/answer.mp4", hint: "Index finger moving from lips forward 💬" },
      { name: "Time", desc: "Tap index finger twice on the wrist watch position.", mappedGesture: "Time", videoUrl: "/level8-questions/time.mp4", hint: "Tapping watch on wrist ⌚" },
      { name: "Place", desc: "Hold open palms flat indicating a geographical area or place.", mappedGesture: "Place", videoUrl: "/level8-questions/place.mp4", hint: "Flat palms indicating place 📍" },
      { name: "Face", desc: "Trace a circular oval around your face with your index finger.", mappedGesture: "Face", videoUrl: "/level8-questions/face.mp4", hint: "Tracing face contour 😊" },
      { name: "This", desc: "Point index finger firmly downward indicating this object or topic.", mappedGesture: "This", videoUrl: "/level8-questions/This.mp4", hint: "Index pointing down 👇" }
    ]
  },
  sentences: {
    name: "Daily Conversation & Sentences",
    icon: MessageSquare,
    level: "💬 Level 9",
    description: "Practical daily dialogues, polite phrases, and conversation sentences in ISL",
    signs: [
      { name: "Hello Nice To Meet You", desc: "Wave hello followed by bringing both index fingers together meeting happily.", mappedGesture: "Hello Nice To Meet You", videoUrl: "/level9-sentences/hello_nice_to_meet_u.mp4", hint: "Hello wave + meeting gesture 🤝" },
      { name: "My Name Is", desc: "Touch chest with flat hand (My) followed by H-hand fingers tapping together (Name).", mappedGesture: "My Name Is", videoUrl: "/level9-sentences/my_name_is_priya.mp4", hint: "Chest tap (My) + Name tap 📛" },
      { name: "I Am Deaf", desc: "Touch index finger from ear to mouth indicating deaf identity.", mappedGesture: "I Am Deaf", videoUrl: "/level9-sentences/iamdeaf.mp4", hint: "Ear to mouth touch 🧏" },
      { name: "I Know Sign Language", desc: "Touch forehead (Know) followed by rolling both hands in sign language conversation.", mappedGesture: "I Know Sign Language", videoUrl: "/level9-sentences/i_know_little_sign_language.mp4", hint: "Forehead touch (Know) + signing hands 🤟" },
      { name: "What Is Your Name", desc: "Point forward (Your) + Name fingers tap + What open palms shake.", mappedGesture: "What Is Your Name", videoUrl: "/level9-sentences/what_is_ur_name.mp4", hint: "Your + Name + What ❓" },
      { name: "Where Are You From", desc: "Point forward (You) followed by place & where inquiry gesture.", mappedGesture: "Where Are You From", videoUrl: "/level9-sentences/where r u from_or_where is ur house.mp4", hint: "You + Where location inquiry 🏡" },
      { name: "What Do You Do", desc: "Point forward (You) + Work hammer hands + What inquiring palms.", mappedGesture: "What Do You Do", videoUrl: "/level9-sentences/what_do_u_do.mp4", hint: "You + Work + What 💼" },
      { name: "What Is Father Name", desc: "Your + Father (forehead) + Name + What question sign.", mappedGesture: "What Is Father Name", videoUrl: "/level9-sentences/what_is_urs_father_name.mp4", hint: "Your + Father + Name + What 👨" },
      { name: "My Profession", desc: "Self point followed by role indicator and badge gesture.", mappedGesture: "My Profession", videoUrl: "/level9-sentences/i_amstudent,doctor,engineer,homemaker,stay at home.mp4", hint: "Self + Role gesture 🎓" },
      { name: "Healthy And Happy", desc: "Both hands sweep from chest with thumbs up in vibrant wellness.", mappedGesture: "Healthy And Happy", videoUrl: "/level9-sentences/friends_hope_u_r_healthy_and happy.mp4", hint: "Chest sweep + Thumbs up wellness 😊" },
      { name: "Sign Slowly", desc: "Flat right hand moving gently and slowly across left forearm.", mappedGesture: "Sign Slowly", videoUrl: "/level9-sentences/please_sign_slow.mp4", hint: "Slow gentle glide across arm 🐢" },
      { name: "Sign Again", desc: "Curved right hand pivoting into open left palm repeating gesture.", mappedGesture: "Sign Again", videoUrl: "/level9-sentences/please_could_sign _again.mp4", hint: "Pivoting hand repeating in palm 🔁" },
      { name: "Signing Very Fast", desc: "Both hands flutter rapidly side-to-side signaling high speed.", mappedGesture: "Signing Very Fast", videoUrl: "/level9-sentences/u_r_signing_very_fast.mp4", hint: "Rapid flutter hands signaling fast ⚡" },
      { name: "I Understand", desc: "Flick index finger upright from fist near temple (idea lightbulb).", mappedGesture: "I Understand", videoUrl: "/level9-sentences/Yes_i_understand.mp4", hint: "Index flick near temple 💡" },
      { name: "I Dont Understand", desc: "Flick index finger near temple while shaking head sideways.", mappedGesture: "I Dont Understand", videoUrl: "/level9-sentences/I_dont_understand.mp4", hint: "Index flick with head shake 🤷" }
    ]
  },
  emergency: {
    name: "Emergency & Safety",
    icon: ShieldAlert,
    level: "🚨 Level 10",
    description: "Vital safety and emergency assistance signs with 1-tap live status dispatch",
    signs: [
      { name: "Safe", desc: "Cross arms in front of chest then open them wide outward indicating safety, protection, and security.", mappedGesture: "Safe", videoUrl: "/emergencyModule/safe.mp4", hint: "Arms cross and open wide 🛡️" },
      { name: "Help", desc: "Rest your closed dominant fist upright on your flat open palm and lift both hands upward together.", mappedGesture: "Help", videoUrl: "/emergencyModule/help.mp4", hint: "Fist on flat palm lifting up 🆘" },
      { name: "Emergency", desc: "Raise both waving hands high above your head signaling urgent distress and evacuation.", mappedGesture: "Emergency", videoUrl: "/emergencyModule/emergency.mp4", hint: "Both hands waving high above head 🚨" }
    ]
  }
};

const BADGES_CONFIG = [
  { 
    id: "first", 
    name: { en: "First Sign", hi: "पहला संकेत", mr: "पहिले चिन्ह" },
    desc: { en: "Learned your first ISL sign!", hi: "अपना पहला ISL संकेत सीखा!", mr: "तुमचे पहिले ISL चिन्ह शिकलात!" },
    icon: Star,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    check: (history: Record<string, SignRecord>) => Object.keys(history).length >= 1,
    progress: (history: Record<string, SignRecord>) => `${Math.min(Object.keys(history).length, 1)} / 1 Sign`
  },
  { 
    id: "perfect", 
    name: { en: "Precision Master", hi: "उत्कृष्ट सटीकता", mr: "अचूकता तज्ज्ञ" },
    desc: { en: "Achieved 98%+ accuracy on a sign", hi: "संकेत पर 98%+ सटीकता प्राप्त की", mr: "चिन्हावर ९८%+ अचूकता मिळवली" },
    icon: Trophy, 
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    check: (history: Record<string, SignRecord>) => Object.values(history).some(r => r.accuracy >= 98),
    progress: (history: Record<string, SignRecord>) => Object.values(history).some(r => r.accuracy >= 98) ? "Completed (98%+)" : "Aim for 98%+ Match"
  },
  { 
    id: "greetings", 
    name: { en: "Greetings Master", hi: "अभिवादन विशेषज्ञ", mr: "अभिवादन तज्ज्ञ" },
    desc: { en: "Completed all 10 Level 1 Greetings", hi: "स्तर 1 के सभी 10 अभिवादन संकेत पूरे किए", mr: "स्तर १ मधील सर्व १० अभिवादन चिन्हे पूर्ण केली" },
    icon: Compass, 
    color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    check: (history: Record<string, SignRecord>) => Object.values(history).filter(r => r.category === "basic").length >= 10,
    progress: (history: Record<string, SignRecord>) => `${Object.values(history).filter(r => r.category === "basic").length} / 10 Greetings`
  },
  { 
    id: "colors", 
    name: { en: "Colour Virtuoso", hi: "रंग पारंगत", mr: "रंग तज्ज्ञ" },
    desc: { en: "Completed all 10 Level 2 Colour signs", hi: "स्तर 2 के सभी 10 रंग संकेत पूरे किए", mr: "स्तर २ मधील सर्व १० रंग चिन्हे पूर्ण केली" },
    icon: Palette, 
    color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
    check: (history: Record<string, SignRecord>) => Object.values(history).filter(r => r.category === "colors").length >= 10,
    progress: (history: Record<string, SignRecord>) => `${Object.values(history).filter(r => r.category === "colors").length} / 10 Colours`
  },
  { 
    id: "alphabets", 
    name: { en: "Alphabet Scholar", hi: "वर्णमाला अभ्यासक", mr: "मुळाक्षरे तज्ज्ञ" },
    desc: { en: "Mastered at least 10 A–Z fingerspelled letters", hi: "कम से कम 10 A–Z फिंगरस्पेलिंग अक्षर सीखे", mr: "किमान १० A–Z फिंगरस्पेलिंग अक्षरे शिकली" },
    icon: BookOpen, 
    color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    check: (history: Record<string, SignRecord>) => Object.values(history).filter(r => r.category === "alphabets").length >= 10,
    progress: (history: Record<string, SignRecord>) => `${Object.values(history).filter(r => r.category === "alphabets").length} / 10 Letters`
  },
  { 
    id: "festivals", 
    name: { en: "Cultural Festival Champion", hi: "सांस्कृतिक त्यौहार चैंपियन", mr: "सांस्कृतिक सण चॅम्पियन" },
    desc: { en: "Completed all 12 auspicious Indian Festival signs", hi: "सभी 12 भारतीय त्यौहार संकेत पूरे किए", mr: "सर्व १२ भारतीय सणांची चिन्हे पूर्ण केली" },
    icon: Sparkles, 
    color: "text-pink-500 bg-pink-500/10 border-pink-500/30",
    check: (history: Record<string, SignRecord>) => Object.values(history).filter(r => r.category === "festivals").length >= 12,
    progress: (history: Record<string, SignRecord>) => `${Object.values(history).filter(r => r.category === "festivals").length} / 12 Festivals`
  },
  { 
    id: "numbers", 
    name: { en: "Math & Numbers Wizard", hi: "संख्या एवं गणित विजार्ड", mr: "संख्या व गणित विझार्ड" },
    desc: { en: "Mastered at least 10 counting number signs", hi: "कम से कम 10 संख्या संकेत सीखे", mr: "किमान १० संख्या चिन्हे शिकली" },
    icon: Award, 
    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30",
    check: (history: Record<string, SignRecord>) => Object.values(history).filter(r => r.category === "numbers").length >= 10,
    progress: (history: Record<string, SignRecord>) => `${Object.values(history).filter(r => r.category === "numbers").length} / 10 Numbers`
  },
  { 
    id: "jobs", 
    name: { en: "Career Champion", hi: "करियर चैंपियन", mr: "करिअर चॅम्पियन" },
    desc: { en: "Mastered all 9 career & job profession signs", hi: "सभी 9 करियर एवं व्यवसाय संकेत सीखे", mr: "सर्व ९ करिअर व व्यवसाय चिन्हे शिकली" },
    icon: Briefcase, 
    color: "text-teal-500 bg-teal-500/10 border-teal-500/30",
    check: (history: Record<string, SignRecord>) => Object.values(history).filter(r => r.category === "jobs").length >= 9,
    progress: (history: Record<string, SignRecord>) => `${Object.values(history).filter(r => r.category === "jobs").length} / 9 Jobs`
  },
  { 
    id: "relations", 
    name: { en: "Family Guardian", hi: "पारिवारिक संरक्षक", mr: "कौटुंबिक रक्षक" },
    desc: { en: "Mastered all 12 family & relation signs", hi: "सभी 12 पारिवारिक एवं रिश्ते संकेत सीखे", mr: "सर्व १२ कौटुंबिक नातेसंबंध चिन्हे शिकली" },
    icon: Users, 
    color: "text-fuchsia-500 bg-fuchsia-500/10 border-fuchsia-500/30",
    check: (history: Record<string, SignRecord>) => Object.values(history).filter(r => r.category === "relations").length >= 12,
    progress: (history: Record<string, SignRecord>) => `${Object.values(history).filter(r => r.category === "relations").length} / 12 Relations`
  },
  { 
    id: "questions", 
    name: { en: "Inquiry Master", hi: "जिज्ञासा मास्टर", mr: "जिज्ञासू तज्ज्ञ" },
    desc: { en: "Mastered all 12 question words & concept signs", hi: "सभी 12 प्रश्नवाचक संकेत सीखे", mr: "सर्व १२ प्रश्न विचारण्याची चिन्हे शिकली" },
    icon: HelpCircle, 
    color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    check: (history: Record<string, SignRecord>) => Object.values(history).filter(r => r.category === "questions").length >= 12,
    progress: (history: Record<string, SignRecord>) => `${Object.values(history).filter(r => r.category === "questions").length} / 12 Questions`
  },
  { 
    id: "sentences", 
    name: { en: "Dialogue Virtuoso", hi: "संवाद पारंगत", mr: "संवाद तज्ज्ञ" },
    desc: { en: "Mastered all 15 daily conversation sentences", hi: "सभी 15 दैनिक वार्तालाप वाक्य सीखे", mr: "सर्व १५ दैनंदिन संभाषण वाक्ये शिकली" },
    icon: MessageSquare, 
    color: "text-sky-500 bg-sky-500/10 border-sky-500/30",
    check: (history: Record<string, SignRecord>) => Object.values(history).filter(r => r.category === "sentences").length >= 15,
    progress: (history: Record<string, SignRecord>) => `${Object.values(history).filter(r => r.category === "sentences").length} / 15 Phrases`
  },
  { 
    id: "safety", 
    name: { en: "Life Safety Hero", hi: "जीवन सुरक्षा हीरो", mr: "जीवन सुरक्षा हिरो" },
    desc: { en: "Completed Level 10 Emergency Safety Signs (Safe, Help, Emergency)", hi: "स्तर 10 आपातकालीन संकेत पूरे किए", mr: "स्तर १० आपत्कालीन चिन्हे पूर्ण केली" },
    icon: ShieldAlert, 
    color: "text-rose-500 bg-rose-500/10 border-rose-500/30",
    check: (history: Record<string, SignRecord>) => Object.values(history).filter(r => r.category === "emergency").length >= 3,
    progress: (history: Record<string, SignRecord>) => `${Object.values(history).filter(r => r.category === "emergency").length} / 3 Emergency`
  }
];

interface StudentViewProps {
  initialCategory?: string | null;
  activeTab?: "learn" | "test" | "progress" | "parent";
  onTabChange?: (tab: "learn" | "test" | "progress" | "parent") => void;
  onBackToHome?: () => void;
}

export function StudentView({
  initialCategory = null,
  activeTab: externalTab,
  onTabChange,
  onBackToHome
}: StudentViewProps) {
  const {
    transcript,
    liveWords,
    gestureStatus,
    gestureOutput,
    simulateSpeech,
    setActiveSign,
    safety,
    setSafety,
    triggerEmergency,
    addLog,
    room
  } = useDemo();
  const { language, t } = useLanguage();

  const [internalTab, setInternalTab] = useState<"learn" | "test" | "progress" | "parent">("learn");
  const activeTab = externalTab ?? internalTab;
  const setActiveTab = (tab: "learn" | "test" | "progress" | "parent") => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const [selectedCat, setSelectedCat] = useState<string | null>(initialCategory);
  const [currentSignIdx, setCurrentSignIdx] = useState(0);
  const [safetyFeedbackToast, setSafetyFeedbackToast] = useState<string | null>(null);

  // Persistent student progress store
  const [progressHistory, setProgressHistory] = useState<Record<string, SignRecord>>({});

  useEffect(() => {
    const syncProgress = () => {
      setProgressHistory(loadProgress());
    };
    syncProgress();
    window.addEventListener("signsafe_progress_updated", syncProgress);
    return () => window.removeEventListener("signsafe_progress_updated", syncProgress);
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCat(initialCategory);
      setCurrentSignIdx(0);
    }
  }, [initialCategory]);

  // Derived progress statistics
  const masteredCount = Object.keys(progressHistory).length;
  const points = masteredCount * 10;

  const basicCount = Object.values(progressHistory).filter(p => p.category === "basic").length;
  const colorsCount = Object.values(progressHistory).filter(p => p.category === "colors").length;
  const alphabetsCount = Object.values(progressHistory).filter(p => p.category === "alphabets").length;
  const festivalsCount = Object.values(progressHistory).filter(p => p.category === "festivals").length;
  const numbersCount = Object.values(progressHistory).filter(p => p.category === "numbers").length;
  const jobsCount = Object.values(progressHistory).filter(p => p.category === "jobs").length;
  const relationsCount = Object.values(progressHistory).filter(p => p.category === "relations").length;
  const questionsCount = Object.values(progressHistory).filter(p => p.category === "questions").length;
  const sentencesCount = Object.values(progressHistory).filter(p => p.category === "sentences").length;
  const emergencyCount = Object.values(progressHistory).filter(p => p.category === "emergency").length;

  const totalPracticeReps = Object.values(progressHistory).reduce((sum, p) => sum + (p.count || 1), 0);
  const avgAccuracy = masteredCount > 0 
    ? Math.round(Object.values(progressHistory).reduce((sum, p) => sum + p.accuracy, 0) / masteredCount)
    : 0;

  // Dynamic Level determination across all 10 levels
  const getCurrentLevel = () => {
    if (masteredCount === 0) {
      return {
        title: language === "mr" ? "स्तर १ · शिकाऊ" : language === "hi" ? "स्तर 1 · नौसिखिया" : "Level 1 · Beginner",
        desc: language === "mr" ? "पहिले स्टार मिळवण्यासाठी अभिवादन चिन्हे सुरू करा!" : language === "hi" ? "अपना पहला सितारा अर्जित करने के लिए अभिवादन शुरू करें!" : "Start with Greetings to earn your first star!",
        nextGoal: language === "mr" ? "१० अभिवादन चिन्हे पूर्ण करा" : language === "hi" ? "10 अभिवादन संकेत पूरे करें" : "Complete Level 1 Greetings (0 / 10)"
      };
    }
    if (basicCount < 10) {
      return {
        title: language === "mr" ? "स्तर १ · अभिवादन सराव" : language === "hi" ? "स्तर 1 · अभिवादन अभ्यास" : "Level 1 · Greetings Explorer",
        desc: `${basicCount} / 10 ${language === "mr" ? "अभिवादन चिन्हे पूर्ण" : language === "hi" ? "अभिवादन संकेत पूर्ण" : "Greetings mastered"}`,
        nextGoal: language === "mr" ? `स्तर २ उघडण्यासाठी अजून ${10 - basicCount} चिन्हे पूर्ण करा` : language === "hi" ? `स्तर 2 अनलॉक करने के लिए और ${10 - basicCount} संकेत पूरे करें` : `Complete ${10 - basicCount} more Greetings to unlock Level 2 Colours!`
      };
    }
    if (colorsCount < 10) {
      return {
        title: language === "mr" ? "स्तर २ · रंग कलाकार" : language === "hi" ? "स्तर 2 · रंग कलाकार" : "Level 2 · Colour Artist",
        desc: `${colorsCount} / 10 ${language === "mr" ? "रंग चिन्हे पूर्ण" : language === "hi" ? "रंग संकेत पूर्ण" : "Colours mastered"}`,
        nextGoal: language === "mr" ? `स्तर ३ उघडण्यासाठी अजून ${10 - colorsCount} रंग चिन्हे पूर्ण करा` : language === "hi" ? `स्तर 3 अनलॉक करने के लिए और ${10 - colorsCount} रंग पूरे करें` : `Complete ${10 - colorsCount} more Colours to unlock Level 3 Alphabets!`
      };
    }
    if (alphabetsCount < 26) {
      return {
        title: language === "mr" ? "स्तर ३ · AI मुळाक्षरे अभ्यासक" : language === "hi" ? "स्तर 3 · AI वर्णमाला विद्वान" : "Level 3 · Deep Learning Scholar",
        desc: `${alphabetsCount} / 26 ${language === "mr" ? "अक्षरे पूर्ण" : language === "hi" ? "अक्षर पूर्ण" : "Letters mastered"}`,
        nextGoal: language === "mr" ? `स्तर ४ उघडण्यासाठी अजून ${26 - alphabetsCount} अक्षरे पूर्ण करा` : language === "hi" ? `स्तर 4 अनलॉक करने के लिए और ${26 - alphabetsCount} अक्षर पूरे करें` : `Complete ${26 - alphabetsCount} more Letters to unlock Level 4 Festivals!`
      };
    }
    if (festivalsCount < 12) {
      return {
        title: language === "mr" ? "स्तर ४ · सण व संस्कृती चॅम्पियन" : language === "hi" ? "स्तर 4 · त्यौहार व संस्कृति चैंपियन" : "Level 4 · Festival Champion",
        desc: `${festivalsCount} / 12 ${language === "mr" ? "सणांची चिन्हे पूर्ण" : language === "hi" ? "त्यौहार संकेत पूर्ण" : "Festivals mastered"}`,
        nextGoal: language === "mr" ? `स्तर ५ उघडण्यासाठी अजून ${12 - festivalsCount} सणांची चिन्हे पूर्ण करा` : language === "hi" ? `स्तर 5 अनलॉक करने के लिए और ${12 - festivalsCount} संकेत पूरे करें` : `Complete ${12 - festivalsCount} more Festivals to unlock Level 5 Numbers!`
      };
    }
    if (numbersCount < 23) {
      return {
        title: language === "mr" ? "स्तर ५ · संख्या व गणित विझार्ड" : language === "hi" ? "स्तर 5 · संख्या व गणित विजार्ड" : "Level 5 · Numbers Wizard",
        desc: `${numbersCount} / 23 ${language === "mr" ? "संख्या चिन्हे पूर्ण" : language === "hi" ? "संख्या संकेत पूर्ण" : "Numbers mastered"}`,
        nextGoal: language === "mr" ? `स्तर ६ उघडण्यासाठी अजून ${23 - numbersCount} संख्या चिन्हे पूर्ण करा` : language === "hi" ? `स्तर 6 अनलॉक करने के लिए और ${23 - numbersCount} संख्याएं पूरी करें` : `Complete ${23 - numbersCount} more Numbers to unlock Level 6 Jobs!`
      };
    }
    if (jobsCount < 9) {
      return {
        title: language === "mr" ? "स्तर ६ · करिअर व व्यवसाय तज्ज्ञ" : language === "hi" ? "स्तर 6 · करियर व व्यवसाय विशेषज्ञ" : "Level 6 · Career Champion",
        desc: `${jobsCount} / 9 ${language === "mr" ? "व्यवसाय चिन्हे पूर्ण" : language === "hi" ? "व्यवसाय संकेत पूर्ण" : "Job signs mastered"}`,
        nextGoal: language === "mr" ? `स्तर ७ उघडण्यासाठी अजून ${9 - jobsCount} व्यवसाय चिन्हे पूर्ण करा` : language === "hi" ? `स्तर 7 अनलॉक करने के लिए और ${9 - jobsCount} संकेत पूरे करें` : `Complete ${9 - jobsCount} more Jobs to unlock Level 7 Relations!`
      };
    }
    if (relationsCount < 12) {
      return {
        title: language === "mr" ? "स्तर ७ · कौटुंबिक रक्षक" : language === "hi" ? "स्तर 7 · पारिवारिक संरक्षक" : "Level 7 · Family Guardian",
        desc: `${relationsCount} / 12 ${language === "mr" ? "नातेसंबंध चिन्हे पूर्ण" : language === "hi" ? "रिश्ते संकेत पूर्ण" : "Family signs mastered"}`,
        nextGoal: language === "mr" ? `स्तर ८ उघडण्यासाठी अजून ${12 - relationsCount} कौटुंबिक चिन्हे पूर्ण करा` : language === "hi" ? `स्तर 8 अनलॉक करने के लिए और ${12 - relationsCount} संकेत पूरे करें` : `Complete ${12 - relationsCount} more Relations to unlock Level 8 Questions!`
      };
    }
    if (questionsCount < 12) {
      return {
        title: language === "mr" ? "स्तर ८ · जिज्ञासू तज्ज्ञ" : language === "hi" ? "स्तर 8 · जिज्ञासा मास्टर" : "Level 8 · Inquiry Master",
        desc: `${questionsCount} / 12 ${language === "mr" ? "प्रश्न चिन्हे पूर्ण" : language === "hi" ? "प्रश्न संकेत पूर्ण" : "Question signs mastered"}`,
        nextGoal: language === "mr" ? `स्तर ९ उघडण्यासाठी अजून ${12 - questionsCount} प्रश्न चिन्हे पूर्ण करा` : language === "hi" ? `स्तर 9 अनलॉक करने के लिए और ${12 - questionsCount} संकेत पूरे करें` : `Complete ${12 - questionsCount} more Questions to unlock Level 9 Sentences!`
      };
    }
    if (sentencesCount < 15) {
      return {
        title: language === "mr" ? "स्तर ९ · संभाषण पारंगत" : language === "hi" ? "स्तर 9 · संवाद पारंगत" : "Level 9 · Dialogue Virtuoso",
        desc: `${sentencesCount} / 15 ${language === "mr" ? "संभाषण वाक्ये पूर्ण" : language === "hi" ? "वार्तालाप वाक्य पूर्ण" : "Conversation sentences mastered"}`,
        nextGoal: language === "mr" ? `स्तर १० उघडण्यासाठी अजून ${15 - sentencesCount} संभाषण वाक्ये पूर्ण करा` : language === "hi" ? `स्तर 10 अनलॉक करने के लिए और ${15 - sentencesCount} वाक्य पूरे करें` : `Complete ${15 - sentencesCount} more Phrases to unlock Level 10 Safety!`
      };
    }
    if (emergencyCount < 3) {
      return {
        title: language === "mr" ? "स्तर १० · जीवन सुरक्षा हिरो" : language === "hi" ? "स्तर 10 · जीवन सुरक्षा हीरो" : "Level 10 · Safety Guardian",
        desc: `${emergencyCount} / 3 ${language === "mr" ? "सुरक्षा चिन्हे पूर्ण" : language === "hi" ? "सुरक्षा संकेत पूर्ण" : "Emergency signs mastered"}`,
        nextGoal: language === "mr" ? "सर्व आपत्कालीन चिन्हे पूर्ण करा" : language === "hi" ? "सभी आपातकालीन संकेत पूरे करें" : "Complete all Emergency signs for full safety certification!"
      };
    }
    return {
      title: language === "mr" ? "स्तर १० · ISL ग्रँड मास्टर" : language === "hi" ? "स्तर 10 · ISL ग्रैंड मास्टर" : "Level 10 · ISL Grand Master",
      desc: language === "mr" ? "सर्व अभ्यासक्रम यशस्वीपणे पूर्ण! 🏆" : language === "hi" ? "सभी पाठ्यक्रम सफलतापूर्वक पूर्ण! 🏆" : "All curriculum levels mastered! 🏆",
      nextGoal: language === "mr" ? "सर्वोच्च प्राविण्य प्राप्त झाले!" : language === "hi" ? "सर्वोच्च दक्षता प्राप्त हुई!" : "Full Mastery Achieved!"
    };
  };

  const currentLevelInfo = getCurrentLevel();
  
  // Real-time gesture validation states
  const [matchingStatus, setMatchingStatus] = useState<"waiting" | "correct" | "incorrect">("waiting");
  const [evaluatedScore, setEvaluatedScore] = useState<number | null>(null);

  const category = selectedCat ? CATEGORIES[selectedCat] : null;
  const currentSign = category ? category.signs[currentSignIdx] : null;
  const localizedSign = currentSign ? getSignDetails(currentSign.name, language) : null;

  const getCategoryName = (key: string, defaultName: string) => {
    if (key === "basic") return t.catGreetings;
    if (key === "colors") return t.catColours;
    if (key === "alphabets") return t.catAlphabets;
    if (key === "festivals") return t.catFestivals;
    if (key === "numbers") return t.catNumbers;
    if (key === "jobs") return t.catJobs;
    if (key === "relations") return t.catRelations;
    if (key === "questions") return t.catQuestions;
    if (key === "sentences") return t.catSentences;
    if (key === "emergency") return t.catEmergency;
    return defaultName;
  };

  const getCategoryDesc = (key: string, defaultDesc: string) => {
    if (key === "basic") return t.catGreetingsDesc;
    if (key === "colors") return t.catColoursDesc;
    if (key === "alphabets") return t.catAlphabetsDesc;
    if (key === "festivals") return t.catFestivalsDesc;
    if (key === "numbers") return t.catNumbersDesc;
    if (key === "jobs") return t.catJobsDesc;
    if (key === "relations") return t.catRelationsDesc;
    if (key === "questions") return t.catQuestionsDesc;
    if (key === "sentences") return t.catSentencesDesc;
    if (key === "emergency") return t.catEmergencyDesc;
    return defaultDesc;
  };

  // Safety status update dispatcher
  const handleUpdateSafety = (status: "ok" | "help" | "trapped") => {
    setSafety(status);
    if (status === "ok") {
      addLog("Student", `[SAFE] Student confirmed safe in ${room}`);
      setSafetyFeedbackToast(t.safeStatusUpdatedMsg || "✅ Status: SAFE NOW! Guardian WhatsApp notification sent.");
      try {
        const msg = encodeURIComponent(`[SIGN-SAFE UPDATE] Student is SAFE NOW in ${room}. Location & status verified.`);
        window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
      } catch (e) {
        console.warn(e);
      }
    } else if (status === "help") {
      addLog("Student", `[ASSISTANCE] Student requested assistance in ${room}`);
      setSafetyFeedbackToast(t.helpStatusUpdatedMsg || "🟡 Status: ASSISTANCE REQUESTED! Staff & support team dispatched.");
      try {
        const msg = encodeURIComponent(`[SIGN-SAFE ASSIST] Student needs assistance in ${room}. Immediate attention required.`);
        window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
      } catch (e) {
        console.warn(e);
      }
    } else if (status === "trapped") {
      triggerEmergency(`Distress reported from ${room}`);
      addLog("Student", `[SOS DANGER] Student marked IN DANGER in ${room}`);
      setSafetyFeedbackToast(t.dangerStatusUpdatedMsg || "🚨 Status: IN DANGER! Smart SOS triggered & GPS coordinates dispatched.");
    }
  };

  // Whenever we select a sign, reset validation state, register active target sign, and simulate teacher speech
  useEffect(() => {
    if (currentSign) {
      setActiveSign(currentSign.name);
      const localized = getSignDetails(currentSign.name, language);
      let speechPrompt = `Let's learn: ${localized.name}. ${localized.desc}`;
      if (language === "hi") {
        speechPrompt = `आइए सीखें: ${localized.name}. ${localized.desc}`;
      } else if (language === "mr") {
        speechPrompt = `चला शिकूया: ${localized.name}. ${localized.desc}`;
      }
      simulateSpeech(speechPrompt);
      setMatchingStatus("waiting");
      setEvaluatedScore(null);
    } else {
      setActiveSign(null);
    }
    return () => {
      setActiveSign(null);
    };
  }, [selectedCat, currentSignIdx, currentSign, language, simulateSpeech, setActiveSign]);

  // Hook up real-time gesture evaluation
  useEffect(() => {
    if (matchingStatus === "correct" || !currentSign) return;

    if (gestureOutput && gestureOutput !== "—" && gestureOutput !== "…") {
      const outputNorm = gestureOutput.trim().toLowerCase();
      const mappedNorm = currentSign.mappedGesture.trim().toLowerCase();
      const nameNorm = currentSign.name.trim().toLowerCase();

      // Check if user's gesture matches the required sign
      const isDirectMatch = 
        outputNorm === mappedNorm || 
        outputNorm === nameNorm || 
        outputNorm.replace("letter ", "") === nameNorm || 
        outputNorm.replace("letter ", "") === mappedNorm;
      const isCompoundMatch = 
        (nameNorm === "good morning" && (outputNorm === "good morning" || outputNorm === "morning")) ||
        (nameNorm === "good afternoon" && (outputNorm === "good afternoon" || outputNorm === "afternoon")) ||
        (nameNorm === "good evening" && (outputNorm === "good evening" || outputNorm === "evening")) ||
        (nameNorm === "good night" && (outputNorm === "good night" || outputNorm === "night")) ||
        (nameNorm === "good day" && (outputNorm === "good day" || outputNorm === "good")) ||
        (nameNorm === "namaste" && outputNorm === "namaste") ||
        (nameNorm === "hello" && outputNorm === "hello") ||
        (nameNorm === "how are you" && outputNorm === "how are you") ||
        (nameNorm.includes("anniversary") && outputNorm.includes("anniversary")) ||
        (nameNorm.includes("birthday") && outputNorm.includes("birthday")) ||
        (nameNorm === "black" && outputNorm === "black") ||
        (nameNorm === "red" && outputNorm === "red") ||
        (nameNorm === "yellow" && outputNorm === "yellow") ||
        (nameNorm === "violet" && outputNorm === "violet") ||
        (nameNorm === "brown" && outputNorm === "brown") ||
        (nameNorm === "white" && outputNorm === "white") ||
        (nameNorm === "green" && outputNorm === "green") ||
        (nameNorm === "grey" && outputNorm === "grey") ||
        (nameNorm === "orange" && outputNorm === "orange") ||
        (nameNorm === "pink" && outputNorm === "pink") ||
        (nameNorm === "diwali" && (outputNorm === "diwali" || outputNorm.includes("diwali"))) ||
        (nameNorm === "holi" && (outputNorm === "holi" || outputNorm.includes("holi"))) ||
        (nameNorm === "christmas" && (outputNorm === "christmas" || outputNorm.includes("christmas"))) ||
        (nameNorm === "eid" && (outputNorm === "eid" || outputNorm.includes("eid"))) ||
        (nameNorm === "ganesh chaturthi" && (outputNorm === "ganesh chaturthi" || outputNorm === "ganesh" || outputNorm.includes("ganesh"))) ||
        (nameNorm === "navratri" && (outputNorm === "navratri" || outputNorm.includes("navratri") || outputNorm.includes("dandiya"))) ||
        (nameNorm === "durga puja" && (outputNorm === "durga puja" || outputNorm === "durga" || outputNorm.includes("durga"))) ||
        (nameNorm === "dussehra" && (outputNorm === "dussehra" || outputNorm.includes("dussehra") || outputNorm.includes("bow"))) ||
        (nameNorm === "raksha bandhan" && (outputNorm === "raksha bandhan" || outputNorm === "rakhi" || outputNorm.includes("raksha"))) ||
        (nameNorm === "janmashtami" && (outputNorm === "janmashtami" || outputNorm.includes("janmashtami") || outputNorm.includes("flute"))) ||
        (nameNorm === "independence day" && (outputNorm === "independence day" || outputNorm === "flag" || outputNorm.includes("independence"))) ||
        (nameNorm === "republic day" && (outputNorm === "republic day" || outputNorm === "salute" || outputNorm.includes("republic"))) ||
        (nameNorm === "1000" && (outputNorm === "1000" || outputNorm.includes("thousand") || outputNorm.includes("1000"))) ||
        (nameNorm === "10000" && (outputNorm === "10000" || outputNorm.includes("10000") || outputNorm.includes("10 thousand"))) ||
        (nameNorm === "100000" && (outputNorm === "100000" || outputNorm.includes("lakh") || outputNorm.includes("100000"))) ||
        (nameNorm === "1000000" && (outputNorm === "1000000" || outputNorm.includes("million") || outputNorm.includes("10 lakh"))) ||
        (nameNorm === "10cr" && (outputNorm === "10cr" || outputNorm.includes("crore") || outputNorm.includes("10cr"))) ||
        (nameNorm === "teacher" && (outputNorm === "teacher" || outputNorm.includes("teach"))) ||
        (nameNorm === "doctor" && (outputNorm === "doctor" || outputNorm === "docter" || outputNorm.includes("doc"))) ||
        (nameNorm === "driver" && (outputNorm === "driver" || outputNorm.includes("drive") || outputNorm.includes("car"))) ||
        (nameNorm === "farmer" && (outputNorm === "farmer" || outputNorm === "framer" || outputNorm.includes("farm"))) ||
        (nameNorm === "lawyer" && (outputNorm === "lawyer" || outputNorm.includes("law") || outputNorm.includes("court"))) ||
        (nameNorm === "barber" && (outputNorm === "barber" || outputNorm.includes("cut") || outputNorm.includes("hair"))) ||
        (nameNorm === "postman" && (outputNorm === "postman" || outputNorm.includes("post") || outputNorm.includes("letter"))) ||
        (nameNorm === "sweeper" && (outputNorm === "sweeper" || outputNorm.includes("sweep") || outputNorm.includes("clean"))) ||
        (nameNorm === "writer" && (outputNorm === "writer" || outputNorm.includes("write") || outputNorm.includes("pen"))) ||
        (nameNorm === "father" && (outputNorm === "father" || outputNorm.includes("father") || outputNorm === "dad")) ||
        (nameNorm === "mother" && (outputNorm === "mother" || outputNorm.includes("mother") || outputNorm === "mom")) ||
        (nameNorm === "brother" && (outputNorm === "brother" || outputNorm.includes("brother"))) ||
        (nameNorm === "daughter" && (outputNorm === "daughter" || outputNorm.includes("daughter"))) ||
        (nameNorm === "husband" && (outputNorm === "husband" || outputNorm.includes("husband"))) ||
        (nameNorm === "wife" && (outputNorm === "wife" || outputNorm.includes("wife"))) ||
        (nameNorm === "married" && (outputNorm === "married" || outputNorm === "marry" || outputNorm.includes("marri"))) ||
        (nameNorm === "grandfather" && (outputNorm === "grandfather" || outputNorm.includes("grandfa"))) ||
        (nameNorm === "grandmother" && (outputNorm === "grandmother" || outputNorm.includes("grandmo"))) ||
        (nameNorm === "family" && (outputNorm === "family" || outputNorm.includes("family"))) ||
        (nameNorm === "man" && (outputNorm === "man" || outputNorm === "main" || outputNorm.includes("man"))) ||
        (nameNorm === "woman" && (outputNorm === "woman" || outputNorm === "women" || outputNorm.includes("wom"))) ||
        (nameNorm === "what" && (outputNorm === "what" || outputNorm.includes("what"))) ||
        (nameNorm === "where" && (outputNorm === "where" || outputNorm.includes("where"))) ||
        (nameNorm === "when" && (outputNorm === "when" || outputNorm.includes("when"))) ||
        (nameNorm === "which" && (outputNorm === "which" || outputNorm.includes("which"))) ||
        (nameNorm === "who" && (outputNorm === "who" || outputNorm.includes("who"))) ||
        (nameNorm === "how" && (outputNorm === "how" || outputNorm.includes("how"))) ||
        (nameNorm === "question" && (outputNorm === "question" || outputNorm.includes("quest"))) ||
        (nameNorm === "answer" && (outputNorm === "answer" || outputNorm.includes("ans"))) ||
        (nameNorm === "time" && (outputNorm === "time" || outputNorm.includes("time") || outputNorm.includes("watch"))) ||
        (nameNorm === "place" && (outputNorm === "place" || outputNorm.includes("place") || outputNorm.includes("locat"))) ||
        (nameNorm === "face" && (outputNorm === "face" || outputNorm.includes("face"))) ||
        (nameNorm === "this" && (outputNorm === "this" || outputNorm.includes("this"))) ||
        (nameNorm.includes("meet") && (outputNorm.includes("meet") || outputNorm.includes("hello"))) ||
        (nameNorm.includes("my name") && (outputNorm.includes("name") || outputNorm.includes("priya"))) ||
        (nameNorm.includes("deaf") && (outputNorm.includes("deaf") || outputNorm.includes("ear"))) ||
        (nameNorm.includes("sign language") && (outputNorm.includes("sign") || outputNorm.includes("language"))) ||
        (nameNorm.includes("your name") && (outputNorm.includes("name") || outputNorm.includes("what"))) ||
        (nameNorm.includes("where") && outputNorm.includes("where")) ||
        (nameNorm.includes("what do you do") && (outputNorm.includes("work") || outputNorm.includes("do"))) ||
        (nameNorm.includes("father name") && (outputNorm.includes("father") || outputNorm.includes("name"))) ||
        (nameNorm.includes("profession") && (outputNorm.includes("student") || outputNorm.includes("doctor") || outputNorm.includes("profession"))) ||
        (nameNorm.includes("healthy") && (outputNorm.includes("healthy") || outputNorm.includes("happy"))) ||
        (nameNorm.includes("slow") && (outputNorm.includes("slow") || outputNorm.includes("please"))) ||
        (nameNorm.includes("again") && (outputNorm.includes("again") || outputNorm.includes("repeat"))) ||
        (nameNorm.includes("fast") && (outputNorm.includes("fast") || outputNorm.includes("quick"))) ||
        (nameNorm.includes("understand") && outputNorm.includes("understand")) ||
        (nameNorm === "safe" && outputNorm === "safe") ||
        (nameNorm === "help" && outputNorm === "help") ||
        (nameNorm === "emergency" && (outputNorm === "emergency" || outputNorm === "danger"));

      if (isDirectMatch || isCompoundMatch) {
        setMatchingStatus("correct");
        const score = 94 + Math.floor(Math.random() * 6);
        setEvaluatedScore(score);
        saveProgressRecord(currentSign.name, (selectedCat as any) || "basic", score);
        if (currentSign.name.toLowerCase() === "safe") {
          handleUpdateSafety("ok");
        } else if (currentSign.name.toLowerCase() === "help") {
          handleUpdateSafety("help");
        } else if (currentSign.name.toLowerCase() === "emergency") {
          handleUpdateSafety("trapped");
        }
      }
    }
  }, [gestureOutput, currentSign, matchingStatus, selectedCat]);

  const forceMatch = () => {
    if (currentSign) {
      setMatchingStatus("correct");
      const score = 96;
      setEvaluatedScore(score);
      saveProgressRecord(currentSign.name, (selectedCat as any) || "basic", score);
      if (currentSign.name.toLowerCase() === "safe") {
        handleUpdateSafety("ok");
      } else if (currentSign.name.toLowerCase() === "help") {
        handleUpdateSafety("help");
      } else if (currentSign.name.toLowerCase() === "emergency") {
        handleUpdateSafety("trapped");
      }
    }
  };

  const handleNext = () => {
    if (category && currentSignIdx < category.signs.length - 1) {
      setCurrentSignIdx(currentSignIdx + 1);
    } else {
      setSelectedCat(null);
      setCurrentSignIdx(0);
    }
  };

  const handlePrev = () => {
    if (category && currentSignIdx > 0) {
      setCurrentSignIdx(currentSignIdx - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation tabs */}
      <div className="flex border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("learn")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer shrink-0 ${
            activeTab === "learn"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Compass className="h-4 w-4" /> {t.tabLearn}
        </button>
        <button
          onClick={() => setActiveTab("test")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer shrink-0 ${
            activeTab === "test"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="h-4 w-4 text-primary" /> {t.tabTest}
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer shrink-0 ${
            activeTab === "progress"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trophy className="h-4 w-4" /> {t.tabBadges}
        </button>
        <button
          onClick={() => setActiveTab("parent")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer shrink-0 ${
            activeTab === "parent"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="h-4 w-4" /> {t.tabParent}
        </button>
      </div>

      {/* Test Arena Mode */}
      {activeTab === "test" && (
        <TestSection
          onBackToHome={onBackToHome}
          onBackToLearn={() => setActiveTab("learn")}
        />
      )}

      {/* 1. Learn Mode */}
      {activeTab === "learn" && (
        <div>
          {!selectedCat ? (
            /* Category Selection Grid */
            <div className="space-y-6 py-2">
              <div className="flex items-center justify-between">
                {onBackToHome && (
                  <button
                    onClick={onBackToHome}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="h-4 w-4 text-primary" />
                    <span>{t.backToHome}</span>
                  </button>
                )}
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{t.learningModules}</span>
              </div>

              <div className="text-center max-w-xl mx-auto space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">{t.chooseLesson}</h2>
                <p className="text-sm text-muted-foreground">
                  {t.chooseLessonDesc}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(CATEGORIES).map(([key, cat]) => {
                  const Icon = cat.icon;
                  const localizedTitle = getCategoryName(key, cat.name);
                  const localizedDescription = getCategoryDesc(key, cat.description);
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedCat(key);
                        setCurrentSignIdx(0);
                      }}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 text-left transition-all hover:border-primary/40 hover:shadow-md cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{cat.level}</span>
                          <h3 className="text-lg font-bold text-foreground mt-0.5">{localizedTitle}</h3>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{localizedDescription}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs font-semibold text-primary">
                        <span>{cat.signs.length} {t.signsCount}</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Learning & Practice Interface */
            <div className="space-y-4">
              {/* Top Lesson Header & Sign Carousel */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  {onBackToHome && (
                    <button
                      onClick={onBackToHome}
                      className="flex h-9 items-center gap-1 px-2.5 rounded-xl border border-border bg-muted/40 text-foreground hover:bg-muted transition-colors text-xs font-bold cursor-pointer"
                      title={t.backToHome}
                    >
                      <span>🏠 {t.navHome}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedCat(null)}
                    className="flex h-9 items-center gap-1 px-2.5 rounded-xl border border-border bg-muted/40 text-foreground hover:bg-muted transition-colors text-xs font-bold cursor-pointer"
                    title={t.backToLessons}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{t.backToLessons}</span>
                  </button>
                  <div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      {category?.level} · {getCategoryName(selectedCat || "", category?.name || "")}
                    </span>
                    <h2 className="text-lg font-bold text-foreground">
                      {currentSignIdx + 1} / {category?.signs.length}: <span className="text-primary">{localizedSign?.name}</span>
                    </h2>
                  </div>
                </div>

                {/* Quick Switch Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {category?.signs.map((s, idx) => {
                    const pillDetails = getSignDetails(s.name, language);
                    return (
                      <button
                        key={s.name}
                        onClick={() => setCurrentSignIdx(idx)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          idx === currentSignIdx
                            ? "bg-primary text-primary-foreground"
                            : progressHistory[s.name]
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : "bg-muted/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {pillDetails.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Workspace Split: Video on Left, Webcam & AI on Right */}
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Left: Video Demonstration & Instructions */}
                <div className="glass rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t.officialDemo}
                    </span>
                    {localizedSign?.hint && (
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
                        {t.hintLabel}: {localizedSign.hint}
                      </span>
                    )}
                  </div>

                  {currentSign?.videoUrl?.endsWith(".png") || currentSign?.videoUrl?.endsWith(".webp") || currentSign?.videoUrl?.endsWith(".jpg") || currentSign?.videoUrl?.endsWith(".jpeg") ? (
                    <div className="relative w-full h-[520px] overflow-hidden rounded-2xl border border-border bg-white shadow-xs flex items-center justify-center p-2">
                      <img
                        src={currentSign.videoUrl}
                        alt={`ISL sign chart for ${localizedSign?.name}`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-sm">
                      {currentSign?.videoUrl ? (
                        currentSign.videoUrl.startsWith("http") ? (
                          <iframe
                            src={currentSign.videoUrl}
                            className="absolute inset-0 h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`ISL sign for ${localizedSign?.name}`}
                          />
                        ) : (
                          <video
                            key={currentSign.videoUrl}
                            src={currentSign.videoUrl}
                            className="absolute inset-0 h-full w-full object-contain"
                            controls
                            autoPlay
                            loop
                            muted
                          />
                        )
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-indigo-950/50 via-background to-purple-950/50">
                          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 border-2 border-primary/30 text-5xl font-black text-primary shadow-inner">
                            {localizedSign?.name}
                          </div>
                          <p className="mt-3 text-sm font-bold text-foreground">
                            ISL: {localizedSign?.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                            {localizedSign?.hint}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Instruction description */}
                  <div className="rounded-xl border border-border/80 bg-muted/40 p-4 space-y-1 shadow-2xs">
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground">{t.howToPerform}</p>
                    <p className="text-sm font-medium leading-relaxed text-foreground">{localizedSign?.desc}</p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handlePrev}
                      disabled={currentSignIdx === 0}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" /> {t.btnPrev}
                    </button>
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      {currentSignIdx === (category?.signs.length ?? 0) - 1 ? t.btnFinish : t.btnNext} <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Right: Live Webcam & AI Verification */}
                <div className="glass rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <Hand className="h-4 w-4 text-primary" /> {t.liveAiEvaluator}
                      </h3>
                      <p className="text-xs text-muted-foreground">{t.performPrompt}</p>
                    </div>
                  </div>

                  <WebcamMock active={!!selectedCat} />

                  {/* Evaluation Result Feedback */}
                  <div className="space-y-3">
                    {matchingStatus === "waiting" && (
                      <div className="rounded-xl border border-border bg-muted/40 p-4 text-center space-y-2">
                        <div className="h-3 w-3 mx-auto animate-ping rounded-full bg-primary" />
                        <p className="text-sm font-bold text-foreground">{t.aiTeacherWatching}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.makeSignPrompt} <span className="font-bold text-primary">"{localizedSign?.name}"</span>
                        </p>
                        {localizedSign?.hint && (
                          <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs text-primary font-semibold">
                            💡 {localizedSign.hint}
                          </div>
                        )}
                        <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-muted-foreground">{t.havingLightingIssue}</span>
                          <button
                            onClick={forceMatch}
                            className="text-[11px] font-bold text-primary hover:underline px-2 py-1 rounded bg-muted/70 hover:bg-muted transition-colors cursor-pointer"
                          >
                            {t.markAsMatched}
                          </button>
                        </div>
                      </div>
                    )}

                    {matchingStatus === "correct" && (
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3 text-emerald-950 dark:text-emerald-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-600 font-bold">
                            <CheckCircle2 className="h-5 w-5" />
                            <span>{t.greatJob}</span>
                          </div>
                          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                            {evaluatedScore}% Match
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
                          {localizedSign?.name} · {t.accuracyStarReward}
                        </p>
                        <button
                          onClick={handleNext}
                          className="w-full bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {currentSignIdx === (category?.signs.length ?? 0) - 1 ? t.btnFinish : t.btnNext} <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {matchingStatus === "incorrect" && (
                      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-2.5 text-rose-950 dark:text-rose-200">
                        <div className="flex items-center gap-2 text-rose-600 font-bold">
                          <AlertCircle className="h-5 w-5" />
                          <span>{t.almostThere}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-rose-900/80 dark:text-rose-200/80">
                          {t.checkHandPosition}
                        </p>
                        <button
                          onClick={() => setMatchingStatus("waiting")}
                          className="w-full bg-white/80 border border-rose-200 text-rose-700 font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> {t.tryAgain}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Interactive Live Safety Status Suite (Only in Level 6 Emergency & Safety module) */}
              {selectedCat === "emergency" && (
                <div className="rounded-2xl border-2 border-border/80 bg-card p-5 space-y-3 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-bold text-sm uppercase tracking-wide text-foreground">
                          Update Your Safety Status
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Deaf-accessible 1-tap live emergency dispatcher · {room}
                        </p>
                      </div>
                    </div>
                    {safety !== "unknown" && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        safety === "ok" ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30" :
                        safety === "help" ? "bg-amber-500/20 text-amber-600 border border-amber-500/30" :
                        "bg-rose-500/20 text-rose-600 border border-rose-500/30 animate-pulse"
                      }`}>
                        Status: {safety.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {/* 🟢 I AM SAFE NOW */}
                    <button
                      onClick={() => handleUpdateSafety("ok")}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95 ${
                        safety === "ok"
                          ? "bg-emerald-700 text-white ring-2 ring-emerald-400"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>I AM SAFE NOW</span>
                    </button>

                    {/* 🟡 I NEED ASSISTANCE */}
                    <button
                      onClick={() => handleUpdateSafety("help")}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95 ${
                        safety === "help"
                          ? "bg-amber-600 text-white ring-2 ring-amber-300"
                          : "bg-amber-500 hover:bg-amber-600 text-white"
                      }`}
                    >
                      <HeartPulse className="h-4 w-4" />
                      <span>I NEED ASSISTANCE</span>
                    </button>

                    {/* 🔴 I AM IN DANGER (Room 103) */}
                    <button
                      onClick={() => handleUpdateSafety("trapped")}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95 ${
                        safety === "trapped"
                          ? "bg-rose-700 text-white ring-2 ring-rose-400 animate-pulse"
                          : "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                      }`}
                    >
                      <AlertOctagon className="h-4 w-4" />
                      <span>I AM IN DANGER ({room})</span>
                    </button>
                  </div>

                  {safetyFeedbackToast && (
                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-bold flex items-center justify-between">
                      <span>{safetyFeedbackToast}</span>
                      <button
                        onClick={() => setSafetyFeedbackToast(null)}
                        className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-black px-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Progress & Achievements Mode */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                {t.tabBadges}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Track your milestone badges and level advancement across Indian Sign Language.
              </p>
            </div>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="h-4 w-4 text-primary" />
                <span>{t.backToHome}</span>
              </button>
            )}
          </div>

          {/* Key Milestone Status Cards */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="glass rounded-3xl p-6 text-center space-y-3 border border-border">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.totalStars}</h3>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <Trophy className="h-8 w-8 animate-pulse" />
              </div>
              <p className="text-3xl font-black text-foreground">{points} ⭐</p>
              <p className="text-xs text-muted-foreground">
                {masteredCount} / 84 {t.signsCount} {language === "mr" ? "यशस्वीपणे शिकली" : language === "hi" ? "सफलतापूर्वक सीखे गए" : "mastered so far"} (+10 ⭐ per sign)
              </p>
            </div>

            <div className="glass rounded-3xl p-6 text-center space-y-3 border border-border">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.currentLevel}</h3>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Award className="h-8 w-8" />
              </div>
              <p className="text-xl font-bold text-foreground">{currentLevelInfo.title}</p>
              <p className="text-xs font-semibold text-primary">{currentLevelInfo.desc}</p>
              <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                🎯 {currentLevelInfo.nextGoal}
              </div>
            </div>
          </div>

          {/* Badges Arena */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> {t.unlockedBadges}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BADGES_CONFIG.map((badge) => {
                const Icon = badge.icon;
                const isUnlocked = badge.check(progressHistory);
                const progressText = badge.progress(progressHistory);
                const bName = badge.name[language] || badge.name.en;
                const bDesc = badge.desc[language] || badge.desc.en;

                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                      isUnlocked
                        ? `${badge.color} shadow-xs ring-1 ring-primary/20 scale-[1.01]`
                        : "border-border/60 bg-muted/20 opacity-60 grayscale hover:grayscale-0"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          isUnlocked ? "bg-white shadow-2xs" : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            <Check className="h-3 w-3" /> Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                            <Lock className="h-3 w-3" /> Locked
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-foreground">{bName}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{bDesc}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className={isUnlocked ? "text-emerald-600" : "text-foreground"}>
                        {progressText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Parent/Teacher Progress Dashboard */}
      {activeTab === "parent" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                {t.tabParent}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Real-time analytics, gesture accuracy history, and curriculum mastery data.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("test")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Award className="h-4 w-4" />
                <span>{t.tabTest}</span>
              </button>

              {masteredCount > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to reset your practice progress?")) {
                      resetProgress();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-all cursor-pointer shadow-2xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Reset Progress</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 Key Performance Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass rounded-2xl p-4 border border-border space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase">{t.totalStars}</span>
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-foreground">{points} ⭐</p>
              <p className="text-[11px] text-muted-foreground">+10 per validated gesture</p>
            </div>

            <div className="glass rounded-2xl p-4 border border-border space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase">Average Accuracy</span>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-emerald-600">{avgAccuracy}%</p>
              <p className="text-[11px] text-muted-foreground">Across {masteredCount} mastered signs</p>
            </div>

            <div className="glass rounded-2xl p-4 border border-border space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase">Curriculum Mastered</span>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-black text-foreground">{masteredCount} / 84</p>
              <p className="text-[11px] text-muted-foreground">{Math.round((masteredCount / 84) * 100)}% of ISL syllabus</p>
            </div>

            <div className="glass rounded-2xl p-4 border border-border space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-bold uppercase">Practice Evaluations</span>
                <Activity className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-2xl font-black text-foreground">{totalPracticeReps}</p>
              <p className="text-[11px] text-muted-foreground">Total camera validations</p>
            </div>
          </div>

          {/* Curriculum Category Completion Progress Bars */}
          <div className="glass rounded-3xl p-6 border border-border space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> Curriculum Levels Breakdown
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Level 1 Greetings */}
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-blue-700">🌱 Level 1: Greetings</span>
                  <span>{basicCount} / 10</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${(basicCount / 10) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{Math.round((basicCount / 10) * 100)}% Completed</p>
              </div>

              {/* Level 2 Colours */}
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-purple-700">🎨 Level 2: Colours</span>
                  <span>{colorsCount} / 10</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${(colorsCount / 10) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{Math.round((colorsCount / 10) * 100)}% Completed</p>
              </div>

              {/* Level 3 Alphabets */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-700">🔤 Level 3: Alphabets</span>
                  <span>{alphabetsCount} / 26</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full transition-all duration-500" style={{ width: `${(alphabetsCount / 26) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{Math.round((alphabetsCount / 26) * 100)}% Completed</p>
              </div>

              {/* Level 4 Festivals */}
              <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-pink-700">🎉 Level 4: Festivals</span>
                  <span>{festivalsCount} / 12</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-pink-600 rounded-full transition-all duration-500" style={{ width: `${(festivalsCount / 12) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{Math.round((festivalsCount / 12) * 100)}% Completed</p>
              </div>

              {/* Level 5 Numbers */}
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-indigo-700">🔢 Level 5: Numbers</span>
                  <span>{numbersCount} / 23</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${(numbersCount / 23) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{Math.round((numbersCount / 23) * 100)}% Completed</p>
              </div>

              {/* Level 6 Emergency */}
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-rose-700">🚨 Level 6: Safety</span>
                  <span>{emergencyCount} / 3</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full transition-all duration-500" style={{ width: `${(emergencyCount / 3) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{Math.round((emergencyCount / 3) * 100)}% Completed</p>
              </div>
            </div>
          </div>

          {/* Gesture Accuracy & History Table */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="glass rounded-3xl p-6 border border-border lg:col-span-7 space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
                <Activity className="h-4 w-4 text-primary" /> {t.studentAccuracyHistory}
              </h3>

              {masteredCount === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center space-y-3 bg-muted/10">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Hand className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">No Gesture History Yet</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
                      Start practicing in the <strong>Learn & Practice</strong> tab or test your skills in the <strong>Exam Arena</strong> to record your real-time accuracy data here!
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("learn")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <Compass className="h-3.5 w-3.5" /> Start First Lesson
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {Object.values(progressHistory).map((record) => {
                    const signDetails = getSignDetails(record.signName, language);
                    return (
                      <div key={record.signName} className="flex items-center justify-between border-b border-border/50 pb-2.5 pt-1">
                        <div>
                          <span className="font-bold text-xs text-foreground">{signDetails.name}</span>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                            <span className="capitalize">{record.category}</span>
                            <span>·</span>
                            <span>{record.count} reps</span>
                            <span>·</span>
                            <span>{record.lastPracticed}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${record.accuracy >= 90 ? "text-emerald-600" : "text-amber-600"}`}>
                            {record.accuracy}%
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            record.accuracy >= 90
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}>
                            {record.accuracy >= 90 ? t.passedBadge : t.practiceBadge}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Learning Recommendations */}
            <div className="glass rounded-3xl p-6 border border-border lg:col-span-5 space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
                <Heart className="h-4 w-4 text-rose-500" /> {t.learningRecommendations}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Adaptive AI suggestions based on your live camera gesture precision:
              </p>

              <div className="space-y-3">
                {basicCount < 10 && (
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Master Foundation Greetings</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Complete {10 - basicCount} remaining greeting signs to build everyday conversational fluency.
                      </p>
                    </div>
                  </div>
                )}

                {basicCount >= 10 && colorsCount < 10 && (
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 flex items-start gap-3">
                    <Palette className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Explore Level 2 Colours</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Expand your visual vocabulary by learning ISL signs for Red, Green, Yellow, and Blue.
                      </p>
                    </div>
                  </div>
                )}

                {colorsCount >= 10 && alphabetsCount < 26 && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-start gap-3">
                    <BookOpen className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Deep Learning A–Z Fingerspelling</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Practice {26 - alphabetsCount} remaining alphabet signs to test our 98.85% neural network in real time.
                      </p>
                    </div>
                  </div>
                )}

                {alphabetsCount >= 26 && festivalsCount < 12 && (
                  <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-3.5 flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Celebrate Level 4 Festivals</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Learn signs for Diwali, Holi, Eid, Christmas, Ganesh Chaturthi, and Independence Day!
                      </p>
                    </div>
                  </div>
                )}

                {festivalsCount >= 12 && numbersCount < 23 && (
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 flex items-start gap-3">
                    <Award className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Master Level 5 Numbers</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Learn counting from 1 to 15, 25, 50, 100, 1000, 10,000 up to Crores.
                      </p>
                    </div>
                  </div>
                )}

                {emergencyCount < 3 && (
                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 flex items-start gap-3">
                    <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Complete Level 6 Life Safety</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                        Master the 3 life-saving signs: Safe, Help, and Emergency Distress.
                      </p>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3">
                  <Award className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Take an Assessment Exam</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Visit the <strong>Exam Arena</strong> to test your skills under timed conditions and earn a Certificate of Proficiency!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
