import { useState, useEffect } from "react";
import { 
  Sparkles, Hand, RotateCcw, Trophy, BookOpen, Star, 
  AlertCircle, ShieldAlert, Award, Compass, Heart, Activity, CheckCircle2, RefreshCw,
  Palette, ChevronRight, ChevronLeft, Volume2, Flame
} from "lucide-react";
import { WebcamMock } from "./WebcamMock";
import { useDemo } from "@/lib/demo-store";
import { useLanguage, Language } from "@/lib/translations";

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

  // Level 4: Emergency
  "Help": {
    en: { name: "Help", desc: "Rest your closed right fist on your flat left palm and lift slightly.", hint: "Fist on flat palm 🆘" },
    hi: { name: "मदद / सहायता (Help)", desc: "अपनी बंद दाहिनी मुट्ठी को सपाट बायीं हथेली पर रखें और थोड़ा ऊपर उठाएं।", hint: "सपाट हथेली पर मुट्ठी रखें 🆘" },
    mr: { name: "मदत (Help)", desc: "डाव्या सपाट तळहातावर उजव्या हाताची बंद मूठ ठेवा आणि हलकेच वर उचला.", hint: "सपाट तळहातावर मूठ ठेवा 🆘" }
  },
  "Safe": {
    en: { name: "Safe", desc: "Cross arms in front of chest then open them wide outward.", hint: "Arms cross and open wide 🛡️" },
    hi: { name: "सुरक्षित (Safe)", desc: "छाती के सामने दोनों हाथों को क्रॉस करें और फिर बाहर की ओर चौड़ा खोलें।", hint: "हाथ क्रॉस करके चौड़ा खोलें 🛡️" },
    mr: { name: "सुरक्षित (Safe)", desc: "छातीसमोर दोन्ही हात क्रॉस करा आणि नंतर बाहेरच्या बाजूला रुंद उघडा.", hint: "हात क्रॉस करून रुंद उघडा 🛡️" }
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

interface Sign {
  name: string;
  desc: string;
  mappedGesture: string; // The output string our webcam classifier matches
  videoUrl: string;      // Demonstration URL
  hint?: string;
}

interface Category {
  name: string;
  icon: any;
  level: string;
  description: string;
  signs: Sign[];
}

const CATEGORIES: Record<string, Category> = {
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
  emergency: {
    name: "Emergency & Safety",
    icon: ShieldAlert,
    level: "🚨 Level 4",
    description: "Vital safety and emergency assistance signs",
    signs: [
      { name: "Help", desc: "Rest your closed right fist on your flat left palm and lift slightly.", mappedGesture: "Help", videoUrl: "https://www.youtube.com/embed/0X6dM0Kk1iY", hint: "Fist on flat palm 🆘" },
      { name: "Safe", desc: "Cross arms in front of chest then open them wide outward.", mappedGesture: "Yes", videoUrl: "https://www.youtube.com/embed/rP2t8P6qg5c", hint: "Arms cross and open wide 🛡️" }
    ]
  }
};

const BADGES = [
  { 
    id: "first", 
    name: { en: "First Sign", hi: "पहला संकेत", mr: "पहिले चिन्ह" },
    desc: { en: "Learned your first ISL sign!", hi: "अपना पहला ISL संकेत सीखा!", mr: "तुमचे पहिले ISL चिन्ह शिकलात!" },
    icon: Star, 
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20" 
  },
  { 
    id: "perfect", 
    name: { en: "Perfect Score", hi: "उत्कृष्ट स्कोर", mr: "उत्कृष्ट गुण" },
    desc: { en: "Got 100% accuracy on a sign", hi: "संकेत पर 100% सटीकता प्राप्त की", mr: "चिन्हावर १००% अचूकता मिळवली" },
    icon: Trophy, 
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
  },
  { 
    id: "safety", 
    name: { en: "Safety Hero", hi: "सुरक्षा हीरो", mr: "सुरक्षा हिरो" },
    desc: { en: "Completed Level 4 Emergency Signs", hi: "स्तर 4 आपातकालीन संकेत पूरे किए", mr: "स्तर ४ आपत्कालीन चिन्हे पूर्ण केली" },
    icon: Award, 
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20" 
  }
];

interface StudentViewProps {
  initialCategory?: string | null;
  activeTab?: "learn" | "progress" | "parent";
  onTabChange?: (tab: "learn" | "progress" | "parent") => void;
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
    setActiveSign
  } = useDemo();
  const { language, t } = useLanguage();

  const [internalTab, setInternalTab] = useState<"learn" | "progress" | "parent">("learn");
  const activeTab = externalTab ?? internalTab;
  const setActiveTab = (tab: "learn" | "progress" | "parent") => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const [selectedCat, setSelectedCat] = useState<string | null>(initialCategory);
  const [currentSignIdx, setCurrentSignIdx] = useState(0);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCat(initialCategory);
      setCurrentSignIdx(0);
    }
  }, [initialCategory]);
  const [points, setPoints] = useState(350);
  const [accuracyHistory, setAccuracyHistory] = useState<Record<string, number>>({
    "Hello": 95,
    "Namaste": 98,
    "Good Morning": 92
  });
  
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
    if (key === "emergency") return t.catEmergency;
    return defaultName;
  };

  const getCategoryDesc = (key: string, defaultDesc: string) => {
    if (key === "basic") return t.catGreetingsDesc;
    if (key === "colors") return t.catColoursDesc;
    if (key === "alphabets") return t.catAlphabetsDesc;
    if (key === "emergency") return t.catEmergencyDesc;
    return defaultDesc;
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
      const isDirectMatch = outputNorm === mappedNorm || outputNorm === nameNorm;
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
        (nameNorm === "pink" && outputNorm === "pink");

      if (isDirectMatch || isCompoundMatch) {
        setMatchingStatus("correct");
        const score = 94 + Math.floor(Math.random() * 6);
        setEvaluatedScore(score);
        setPoints((p) => p + 10);
        setAccuracyHistory((prev) => ({
          ...prev,
          [currentSign.name]: score
        }));
      }
    }
  }, [gestureOutput, currentSign, matchingStatus]);

  const forceMatch = () => {
    if (currentSign) {
      setMatchingStatus("correct");
      const score = 96;
      setEvaluatedScore(score);
      setPoints((p) => p + 10);
      setAccuracyHistory(prev => ({
        ...prev,
        [currentSign.name]: score
      }));
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
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("learn")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer ${
            activeTab === "learn"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Compass className="h-4 w-4" /> {t.tabLearn}
        </button>
        <button
          onClick={() => setActiveTab("progress")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer ${
            activeTab === "progress"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trophy className="h-4 w-4" /> {t.tabBadges}
        </button>
        <button
          onClick={() => setActiveTab("parent")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-colors cursor-pointer ${
            activeTab === "parent"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="h-4 w-4" /> {t.tabParent}
        </button>
      </div>

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
                            : accuracyHistory[s.name]
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
            </div>
          )}
        </div>
      )}

      {/* 2. Progress & Achievements Mode */}
      {activeTab === "progress" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="h-4 w-4 text-primary" />
                <span>{t.backToHome}</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab("learn")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer shadow-2xs"
            >
              <Compass className="h-4 w-4" />
              <span>{t.navLearn}</span>
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="glass rounded-2xl p-6 text-center space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.totalStars}</h3>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <Trophy className="h-8 w-8" />
              </div>
              <p className="text-3xl font-black text-foreground">{points} ⭐</p>
              <p className="text-xs text-muted-foreground">{t.keepLearningStars}</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t.currentLevel}</h3>
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Award className="h-8 w-8" />
              </div>
              <p className="text-xl font-bold text-foreground">{t.level2Explorer}</p>
              <p className="text-xs text-muted-foreground">{t.completeLevel2ToUnlock}</p>
            </div>

            <div className="glass rounded-2xl p-6 space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">{t.unlockedBadges}</h3>
              <div className="space-y-2.5">
                {BADGES.map((badge) => {
                  const Icon = badge.icon;
                  const bName = badge.name[language] || badge.name.en;
                  const bDesc = badge.desc[language] || badge.desc.en;
                  return (
                    <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-xl border ${badge.color}`}>
                      <Icon className="h-5 w-5 shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs">{bName}</h4>
                        <p className="text-[11px] text-muted-foreground">{bDesc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Parent/Teacher Dashboard */}
      {activeTab === "parent" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="h-4 w-4 text-primary" />
                <span>{t.backToHome}</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab("learn")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-primary hover:bg-muted transition-colors cursor-pointer shadow-2xs"
            >
              <Compass className="h-4 w-4" />
              <span>{t.navLearn}</span>
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="glass rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
                <Activity className="h-4 w-4 text-primary" /> {t.studentAccuracyHistory}
              </h3>
              <div className="space-y-2.5">
                {Object.entries(accuracyHistory).map(([sign, acc]) => {
                  const signDetails = getSignDetails(sign, language);
                  return (
                    <div key={sign} className="flex items-center justify-between border-b border-border/50 pb-2">
                      <div>
                        <span className="font-bold text-xs text-foreground">{signDetails.name}</span>
                        <p className="text-[11px] text-muted-foreground">{t.recentSessionEval}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${acc >= 90 ? "text-emerald-600" : "text-amber-600"}`}>
                          {acc}%
                        </span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-semibold uppercase">
                          {acc >= 90 ? t.passedBadge : t.practiceBadge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-bold flex items-center gap-2 text-foreground">
                <Heart className="h-4 w-4 text-rose-500" /> {t.learningRecommendations}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Based on gesture accuracy data, here are customized recommendations:
              </p>
              <div className="space-y-3">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{t.reinforceSignsTitle}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {t.reinforceSignsDesc}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-3">
                  <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{t.nextMilestoneTitle}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {t.nextMilestoneDesc}
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
