// Full 850 ISL Dictionary from text_to_isl
export const ISL_AVAILABLE_SIGML_WORDS = new Set(["0", "1", "10", "100", "11", "12", "13", "1month", "2", "2-3fingerbent", "2months", "3", "4", "5", "6", "7", "8", "9", "a", "about", "above", "absorb", "accept", "access", "accident", "accuse", "achakan", "across", "act", "acting", "active", "actor", "actress", "add", "advice", "advise", "aeroplane", "afraid", "africa", "after", "afternoon", "age", "agree", "alive", "all", "allah", "allday", "allover", "allow", "almirah", "alone", "always", "ambulance", "america", "among", "andhrapradesh", "angel", "angry", "announce", "anothertime", "anothertime2", "answer", "antartica", "any", "anything", "appear", "apple", "appointment", "april", "are", "area", "argue", "around", "arrange", "arrest", "arrive", "art", "asia", "askanything", "askquestion", "assam", "associate", "at", "atlast", "attend", "audiologist", "auditorium", "australia", "austria", "autorickshaw", "available", "avoid", "awful", "axe", "b", "bad", "badminton", "bag", "bake", "ball", "ballon", "bandage", "bangali", "basketball", "bat", "bath", "beak", "bearwithit", "beat", "beautiful", "become", "before", "begin", "behind", "belgium", "bell", "below", "bench", "bend", "benefit", "bent-hand", "berth", "best", "better", "between", "bhagat", "bhangra", "bible", "big", "bird", "black", "blackboard", "blow", "blue", "boat", "body", "bogies", "boil", "book", "borrow", "bowl", "boxing", "boy", "break", "break-in", "bridge", "brighton", "bring", "britain", "broom", "brown", "brush", "bsl", "buddha", "budhpoornima", "build", "building", "bulb", "bullockcart", "busy", "bye", "c", "c-x", "cabbage", "calculator", "call", "calm-down", "can", "cancel", "cannot", "canyousign", "car", "carpenter", "carrom", "carrot", "carry", "catch", "catch-2", "cauliflower", "cement", "center", "certificate", "chair", "chalk", "changeback", "changemind", "chase", "check", "chemistry", "cheque", "chess", "child", "children", "chilly", "christian", "christmas", "church", "cinema", "circle", "circus", "clap", "class", "classroom", "clerk", "click", "climb", "climbdown", "climbup", "clinic", "close", "closedhand", "cloud", "clown", "cobbler", "coin", "collect", "college", "colour", "colours", "come", "comeover", "cometoyou", "communicate", "communication", "compare", "compass", "complain", "complaint", "computer", "concentrate", "confuse", "congratulations", "contact", "contact(pointhand)", "continue", "control", "cook", "coolie", "copy", "correct", "council", "count", "cover", "crash", "cream", "cricket", "criticize", "crow", "cry", "cucumber", "cup", "cut", "cycle", "d", "dance", "date", "day", "deaf", "decrease", "delete", "dept", "desk", "detail", "develop", "differences", "different", "difficult", "discuss", "divide", "doctor", "doctor1", "donotunderstand", "down", "draw", "dream", "drinking", "e", "easy", "eat", "education", "educationalterms", "eid", "eight", "eighteen", "eighthundred", "eightoclock", "electrician", "electricity", "eleven", "elevenoclock", "email", "embroidry", "empty", "encourage", "engine", "engineer", "england", "english", "enjoy", "enter", "equal", "equator", "eraser", "escape", "essay", "evening", "every", "everyday", "everyyear", "exam", "examination", "examine", "example", "expensive", "experience", "eyelash", "f", "factory", "fail-loser", "fall", "far", "farmer", "fat", "father", "fear", "february", "feed", "feel", "few", "fifteen", "fight", "fill", "fill-in", "fingerspell", "finish", "five", "fivehundred", "fiveoclock", "flood", "floor", "fly", "food", "forever", "forgive", "form", "four", "fourhundred", "fouroclock", "fourteen", "france", "friday", "fruit", "g", "germany", "get", "girl", "give-form", "give-me", "go", "go-with-you", "gold", "good", "greece", "green", "grey", "h", "half-past", "halfpast", "hang", "hardofhearing", "havealook", "he", "health", "hearing", "heartbeat", "hello", "help-me", "help-you", "her", "hers", "hill", "him", "himself", "hindi", "hindu", "hire", "his", "hockey", "hold", "holland", "home", "how", "howareyou", "howmany", "howmuch", "hun", "hundred", "hungry", "i", "idea", "ignore", "important", "impossible", "improve", "in", "increase", "index", "informus", "infrontof", "injection", "intelligent", "interesting", "internet", "interpreter", "issues", "iunderstand", "iv", "ix-down", "ix-left", "j", "jain", "january", "jealous", "jeep", "jesus", "join", "jug", "jump", "june", "justamoment", "k", "kannada", "kanpur", "karate", "keep", "kerala", "key", "keyboard", "kite", "know", "knowledge", "knowwell", "koli", "l", "la", "laboratory", "ladder", "lakhnow", "languages", "late", "later", "laugh", "lead", "leafy-vegetables", "leak", "learn", "leave", "lecturer", "lend", "less", "letmeknow", "letter", "level", "library", "lick", "light-house", "like", "line", "link", "list", "litter", "little-fingerhand", "livewhere", "lock", "long", "lorry", "lose", "loss", "loss1", "lotus", "loud", "love", "m", "man", "mango", "manner", "many", "march", "married", "may", "maybe", "me", "meet", "mind", "minicom", "mistake", "monday", "money", "more", "morning", "mother", "my", "n", "n-n(norfolk)", "nagpur", "nails", "name", "namewhat", "national", "near", "need", "needle", "never", "new", "news", "next", "nextyear", "nice", "night", "nine", "ninehundred", "nineoclock", "nineteen", "no", "none", "north-pole", "note-book", "note-money", "now", "number", "nurse", "o", "offer", "office", "officer", "often", "old", "olympics", "on", "one", "onehundred", "oneoclock", "onerupee", "onetoone", "onion", "ooty", "open", "opendoors", "openhand", "operation", "opraise-clap(deaf)", "or", "orange", "order", "organise", "oriya", "our", "ourself", "out", "over", "own", "p", "paranoid", "parts", "past", "pay", "pay-me", "pen", "person", "phone", "phoneme", "phoneyou", "pick", "pink", "plan", "please", "pooryou", "possible", "pot", "pound", "power", "practice", "prayer", "pretend", "print", "problem", "profit", "provide", "purple", "put-on-letter", "putonleft", "q", "quarterpast", "quarterto", "question", "quick", "quiet", "quote", "quran", "r", "rain", "reach", "read", "ready", "receive", "reception", "rectangle", "red", "regions", "regular", "relate", "relation", "remind", "remove", "repeat", "research", "responsibility", "responsible", "resting_position", "result", "roof", "round-hand", "run", "s", "sad", "same", "save", "say", "science", "scotland", "screen", "search", "see", "semi-roundhand", "send", "send-me", "seven", "sevenhundred", "sevenoclock", "seventeen", "sewingmachine", "shake", "short", "sign", "silver", "sitandmeet", "six", "sixhundred", "sixoclock", "sixteen", "slow", "soft", "sorry", "spelling", "stay", "stubborn", "stupid", "sunday", "switzerland", "t", "tabla", "table-tennis", "table.aus", "tablet", "tailor", "take", "talk", "tall", "tamil", "tap", "taste", "taxi", "teach", "teacher", "teachme", "teachyou", "tear", "tease", "teat", "technical", "teeth", "telgu", "temperature", "temple", "ten", "tennis", "tenoclock", "thankyou", "that", "theif", "their", "them", "themselves", "then", "there", "thermometer", "thermus", "these", "they", "think", "thirsty", "thirteen", "this", "thorn", "those", "thread", "three", "threehundred", "threeoclock", "throw", "thumb", "thumb-little-finger", "thumbup", "thursday", "ticket", "ticketchecker", "tie", "tiffinbox", "tight", "tighten", "time", "tippi", "today", "together", "tomato", "tomorrow", "tools", "touch", "toward", "town", "track", "trade-equipment", "train", "transport", "travel", "tree", "trophy", "truck", "truth", "try", "tub", "tuesday", "turn", "turnip", "turnleft", "tv", "twelveclock", "twenty", "two", "twohundred", "twooclock", "typewriter", "typist", "u", "ugly", "umbrella", "under", "understand", "uniform", "university", "until", "up", "urdu", "us", "v", "vadodara", "van", "vapour", "vegetable", "vegetables", "velvet", "very", "veryverydifficult", "video", "visit", "volleyball", "vomit", "vote", "w", "wait", "wales", "walkacross", "wall-clock", "want", "was", "wash", "waste", "water", "water-bottle", "water1", "we", "weapon", "weaver", "weewee", "weigh", "weight", "welcome", "well", "west", "what", "wheat", "when", "where", "which", "whistle", "white", "who", "why", "wide", "will", "win", "wipe", "wipe-off", "wire", "wish", "with", "without", "woman", "word", "work", "worn(warn)", "worry", "worse", "worst", "wrestling", "write", "writedown", "writesend", "wrong", "x", "x-ray", "y", "yeah", "yellow", "yes", "yesterday", "you", "youfillinwipe-off", "youhowold", "your", "yourhobbieswhat", "yournamewhat", "yours", "yourself", "yourselves", "z", "zebra-crossing", "zero", "zoo"]);


export async function getSigmlXmlForWord(word: string): Promise<string | null> {
  const clean = word.toLowerCase().trim();
  let filename = clean;

  if (ISL_AVAILABLE_SIGML_WORDS.has(clean)) {
    filename = clean;
  } else if (clean.length === 1 && clean >= "a" && clean <= "z") {
    filename = clean.toUpperCase();
  } else if (/^\d+$/.test(clean) && ISL_AVAILABLE_SIGML_WORDS.has(clean)) {
    filename = clean;
  } else {
    return null;
  }

  try {
    const res = await fetch(`/SignFiles/${filename}.sigml`);
    if (!res.ok) return null;
    const text = await res.text();
    return text;
  } catch (err) {
    console.warn(`Failed to load sigml for ${word}:`, err);
    return null;
  }
}

export async function buildCompoundSigmlXml(tokens: string[]): Promise<string> {
  let combinedSigns = "";

  for (const token of tokens) {
    const clean = token.toLowerCase().trim();
    if (ISL_AVAILABLE_SIGML_WORDS.has(clean)) {
      const xml = await getSigmlXmlForWord(clean);
      if (xml) {
        // Extract inner <hns_sign>...</hns_sign>
        const match = xml.match(/<hns_sign[\s\S]*?<\/hns_sign>/i);
        if (match) {
          combinedSigns += "\n" + match[0];
        }
      }
    } else {
      // Fingerspell letters
      for (const char of clean) {
        if (char >= "a" && char <= "z") {
          const letterXml = await getSigmlXmlForWord(char);
          if (letterXml) {
            const match = letterXml.match(/<hns_sign[\s\S]*?<\/hns_sign>/i);
            if (match) {
              combinedSigns += "\n" + match[0];
            }
          }
        }
      }
    }
  }

  return `<?xml version="1.0" encoding="utf-8"?>\n<sigml>\n${combinedSigns}\n</sigml>`;
}
