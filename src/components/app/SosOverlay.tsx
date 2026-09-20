import { useState, useEffect, useCallback } from "react";
import { 
  AlertOctagon, HeartPulse, ShieldCheck, X, 
  MapPin, PhoneCall, MessageCircle, MessageSquare, ExternalLink, 
  Clock, Compass, AlertTriangle, Radio, RefreshCw, CheckCircle2, 
  Smartphone, Copy, Check, ChevronDown, ChevronUp, UserPlus, Trash2,
  Users, User, Phone, Plus, Star
} from "lucide-react";
import { useDemo } from "@/lib/demo-store";
import { useLanguage } from "@/lib/translations";

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary?: boolean;
}

const INITIAL_CONTACTS: EmergencyContact[] = [
  { id: "1", name: "Prajakta's Guardian", relation: "Primary Guardian", phone: "9112480174", isPrimary: true },
  { id: "2", name: "Prof. Sharma (Special Educator)", relation: "Class Teacher", phone: "9876543210" },
  { id: "3", name: "Campus Security & First Aid", relation: "Campus Medical", phone: "9123456780" },
];

export function SosOverlay() {
  const { emergencyReason, safety, setSafety, logs, room, clearEmergency, addLog } = useDemo();
  const { language, t } = useLanguage();
  const safe = safety === "ok";

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>("Locating device...");
  const [locLoading, setLocLoading] = useState(true);
  const [locError, setLocError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  // Emergency Contacts state with localStorage persistence
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("signsafe_emergency_contacts");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved contacts:", e);
        }
      }
    }
    return INITIAL_CONTACTS;
  });

  // New Contact form inputs
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRelation, setNewRelation] = useState("Parent / Family");

  const studentName = "Prajakta Ukirde";
  const primaryContact = contacts.find(c => c.isPrimary) || contacts[0] || { phone: "9112480174", name: "Guardian" };

  // Save contacts to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("signsafe_emergency_contacts", JSON.stringify(contacts));
    }
  }, [contacts]);

  // Function to fetch real device GPS or IP fallback
  const fetchLocation = useCallback(() => {
    setLocLoading(true);
    setLocError(false);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(5));
          const lng = Number(position.coords.longitude.toFixed(5));
          setCoords({ lat, lng });
          setLocationName(`GPS Live: ${lat}, ${lng}`);
          setLocLoading(false);
        },
        async (error) => {
          console.warn("Browser GPS failed or blocked, attempting IP geolocation...", error);
          try {
            const res = await fetch("https://ipapi.co/json/");
            if (res.ok) {
              const data = await res.json();
              if (data.latitude && data.longitude) {
                const lat = Number(Number(data.latitude).toFixed(5));
                const lng = Number(Number(data.longitude).toFixed(5));
                setCoords({ lat, lng });
                setLocationName(`${data.city || ""}, ${data.region || ""}`);
                setLocLoading(false);
                return;
              }
            }
          } catch (ipErr) {
            console.warn("IP location fallback failed:", ipErr);
          }
          setCoords({ lat: 19.8762, lng: 75.3433 });
          setLocationName("Campus Coordinates (MGM JNEC)");
          setLocError(true);
          setLocLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setCoords({ lat: 19.8762, lng: 75.3433 });
      setLocationName("Campus Coordinates (MGM JNEC)");
      setLocLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const mapsUrl = coords 
    ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
    : `https://maps.google.com/?q=19.8762,75.3433`;

  // Safe ASCII-encoded distress message template
  const distressMessage = `[EMERGENCY SOS DISTRESS ALERT]

*Student Name:* ${studentName}
*Location / Room:* ${room} (${locationName})
*Status:* ${safety === "trapped" ? "CRITICAL (TRAPPED)" : safety === "help" ? "URGENT ASSISTANCE NEEDED" : "EMERGENCY ALARM ACTIVE"}
*Reason:* ${emergencyReason || "Immediate help needed"}

*Live GPS Google Maps Location:*
${mapsUrl}

*Time:* ${new Date().toLocaleTimeString()}
_Sent via SignSafe AI Assistive Platform_`;

  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Send WhatsApp to specific phone number
  const handleSendWhatsApp = (phone: string, contactName?: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(distressMessage)}`;
    setStatusNotification(`Opening WhatsApp Distress to ${contactName || phone}...`);
    window.open(url, "_blank");
    addLog?.("System", `WhatsApp SOS Alert dispatched to ${contactName || phone} (+${formattedNumber})`);
  };

  // Send SMS to specific phone number
  const handleSendSms = (phone: string, contactName?: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedNumber = cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`;
    navigator.clipboard.writeText(distressMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    const smsUrl = `sms:${formattedNumber}${isIOS ? "&" : "?"}body=${encodeURIComponent(distressMessage)}`;
    window.location.href = smsUrl;
    setStatusNotification(`SMS Alert Triggered to ${contactName || phone} & Copied to Clipboard!`);
    addLog?.("System", `Cellular SMS Alert dispatched to ${contactName || phone} (${formattedNumber})`);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(distressMessage);
    setCopied(true);
    setStatusNotification("Distress message copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  // Add new contact
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newPhone.replace(/[^0-9]/g, "");
    if (!newName.trim() || cleanPhone.length < 10) {
      alert("Please enter a valid Name and 10-digit Phone Number.");
      return;
    }

    const newEntry: EmergencyContact = {
      id: Math.random().toString(36).slice(2, 9),
      name: newName.trim(),
      phone: cleanPhone,
      relation: newRelation,
      isPrimary: false
    };

    setContacts(prev => [...prev, newEntry]);
    setNewName("");
    setNewPhone("");
    setShowAddContact(false);
    setStatusNotification(`Added ${newEntry.name} (${newEntry.phone}) to Emergency Contacts!`);
  };

  // Delete contact
  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setStatusNotification("Contact removed from directory.");
  };

  // Set primary contact
  const handleSetPrimary = (id: string) => {
    setContacts(prev => prev.map(c => ({ ...c, isPrimary: c.id === id })));
    setStatusNotification("Updated primary emergency contact.");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Soft translucent backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-6 sm:py-8">
        {/* Header Bar */}
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="rounded-3xl bg-white p-5 sm:p-6 border border-rose-200 shadow-xl flex-1">
            <div className="flex items-center gap-3">
              <span className="flex h-3.5 w-3.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
              </span>
              <h1 className="text-xl font-black tracking-tight sm:text-2xl text-slate-900 flex items-center gap-2.5">
                <AlertOctagon className="h-6 w-6 text-rose-500 shrink-0" />
                {safe ? t.sosSafeTitle : t.sosActiveTitle}
              </h1>
            </div>
            <p className="mt-1.5 text-xs text-slate-600 font-medium">
              {emergencyReason || t.urgentDistressDetected} · {room} · {t.autoGeoDispatcher}
            </p>
          </div>

          <button
            onClick={clearEmergency}
            className="rounded-full bg-white p-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200 shadow-lg shrink-0"
            aria-label="Dismiss emergency overlay"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Grid: Location & Contacts on Left, Safety Controls on Right */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left Column: Live Location & Multi-Contact Dispatch */}
          <div className="space-y-4 lg:col-span-3">
            {/* Live GPS Card */}
            <div className="rounded-3xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
                  <MapPin className="h-4 w-4" /> {t.sosLiveGps}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchLocation}
                    disabled={locLoading}
                    className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                    title={t.btnRefreshGps}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${locLoading ? "animate-spin" : ""}`} />
                    <span>{t.btnRefreshGps}</span>
                  </button>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold flex items-center gap-1">
                    <Radio className="h-3 w-3 animate-pulse text-emerald-600" /> {t.gpsActiveBadge}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 space-y-2">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">{t.latitudeLabel}</span>
                    <span className="text-slate-900 font-mono font-bold text-sm">
                      {locLoading ? "Detecting..." : coords?.lat}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">{t.longitudeLabel}</span>
                    <span className="text-slate-900 font-mono font-bold text-sm">
                      {locLoading ? "Detecting..." : coords?.lng}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200/60">
                  <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {locationName}
                  </span>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-bold text-xs"
                  >
                    {t.viewGoogleMaps} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Status notification toast */}
              {statusNotification && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-800 flex items-center justify-between animate-fadeIn">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {statusNotification}
                  </span>
                  <button
                    onClick={() => setStatusNotification(null)}
                    className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* 1-Tap Emergency Contacts Directory */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-rose-500" /> {t.registeredContacts} ({contacts.length})
                  </span>
                  <button
                    onClick={() => setShowAddContact(!showAddContact)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{showAddContact ? t.cancelBtn : t.btnAddContact}</span>
                  </button>
                </div>

                {/* Add Contact Form Drawer */}
                {showAddContact && (
                  <form onSubmit={handleAddContact} className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <UserPlus className="h-4 w-4 text-emerald-600" /> {t.addNewContact}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">{t.contactNameLabel}</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Father, Mother, Doctor"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary outline-none shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">{t.contactPhoneLabel}</label>
                        <div className="flex items-center gap-1">
                          <span className="rounded-xl bg-slate-200 px-2.5 py-2 text-xs font-mono text-slate-700 font-bold border border-slate-300">+91</span>
                          <input
                            type="tel"
                            required
                            placeholder="9876543210"
                            maxLength={10}
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            className="flex-1 rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-primary outline-none shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <select
                        value={newRelation}
                        onChange={(e) => setNewRelation(e.target.value)}
                        className="rounded-xl bg-white border border-slate-300 px-3 py-2 text-xs text-slate-900 outline-none cursor-pointer shadow-2xs"
                      >
                        <option value="Parent / Guardian">Parent / Guardian</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Class Teacher">Class Teacher</option>
                        <option value="Doctor / First Aid">Doctor / First Aid</option>
                        <option value="Campus Warden">Campus Warden</option>
                        <option value="Friend / Peer">Friend / Peer</option>
                      </select>

                      <button
                        type="submit"
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Plus className="h-3.5 w-3.5" /> {t.saveContactBtn}
                      </button>
                    </div>
                  </form>
                )}

                {/* Contacts List with Instant Dispatch */}
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{contact.name}</span>
                          <span className="rounded-lg bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            {contact.relation}
                          </span>
                          {contact.isPrimary && (
                            <span className="rounded-lg bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 text-[10px] font-bold flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {t.primaryBadge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-mono text-slate-500 mt-0.5 font-medium">+91 {contact.phone}</p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* WhatsApp Dispatch */}
                        <button
                          onClick={() => handleSendWhatsApp(contact.phone, contact.name)}
                          className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          title={`Send WhatsApp Alert to ${contact.name}`}
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        {/* Cellular SMS Dispatch */}
                        <button
                          onClick={() => handleSendSms(contact.phone, contact.name)}
                          className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          title={`Send Cellular SMS to ${contact.name}`}
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>SMS</span>
                        </button>

                        {/* Direct Call */}
                        <a
                          href={`tel:+91${contact.phone}`}
                          className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white p-2 transition-colors shadow-xs"
                          title={`Call ${contact.name}`}
                        >
                          <PhoneCall className="h-3.5 w-3.5" />
                        </a>

                        {/* Delete contact (only if not default primary) */}
                        {contacts.length > 1 && (
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 p-2 transition-colors cursor-pointer"
                            title="Delete Contact"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 112 National Emergency Helpline Strip */}
                <div className="pt-1">
                  <a
                    href="tel:112"
                    className="flex items-center justify-between rounded-2xl bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold py-3 px-4 transition-all text-xs shadow-md"
                  >
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{t.nationalHelpline}</span>
                    </span>
                    <span className="rounded-xl bg-black/20 px-3 py-1 text-xs font-mono font-black">
                      {t.call112Btn}
                    </span>
                  </a>
                </div>

                {/* Copy Distress Message Accordion */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center justify-between w-full rounded-2xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors cursor-pointer border border-slate-200"
                  >
                    <span>{t.viewPayload}</span>
                    {showPreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {showPreview && (
                    <div className="mt-2 rounded-2xl bg-slate-100 p-4 border border-slate-200 space-y-2 animate-fadeIn">
                      <pre className="text-[11px] font-mono text-slate-800 whitespace-pre-wrap max-h-36 overflow-y-auto bg-white p-3 rounded-xl border border-slate-200">
                        {distressMessage}
                      </pre>
                      <button
                        onClick={handleCopyMessage}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-800 transition-colors cursor-pointer shadow-2xs"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-600" />}
                        <span>{copied ? t.copiedNotice : t.copyRawMessage}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Safety Status Selection & Logs */}
          <div className="space-y-4 lg:col-span-2">
            <div className="grid gap-2.5 rounded-3xl bg-white p-5 border border-slate-200/80 shadow-md">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 block">
                {t.updateSafetyStatus}
              </span>

              <button
                onClick={() => setSafety("ok")}
                className={`rounded-2xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  safety === "ok" ? "bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                <ShieldCheck className="h-4 w-4" /> {t.btnImSafe}
              </button>

              <button
                onClick={() => setSafety("help")}
                className={`rounded-2xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  safety === "help" ? "bg-amber-500 text-white shadow-md ring-2 ring-amber-300" : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                <HeartPulse className="h-4 w-4" /> {t.btnNeedHelp}
              </button>

              <button
                onClick={() => setSafety("trapped")}
                className={`rounded-2xl px-4 py-3.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  safety === "trapped"
                    ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-300"
                    : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                <AlertOctagon className="h-4 w-4" /> {t.btnInDanger} ({room})
              </button>
            </div>

            {/* Emergency Logs */}
            <div className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-md">
              <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> {t.emergencyEventLog}
              </p>
              <ul className="max-h-44 space-y-2 overflow-y-auto pr-1">
                {logs.length === 0 && (
                  <li className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded-xl border border-slate-100">
                    Emergency alert triggered. Dispatching coordinates...
                  </li>
                )}
                {logs.map((l) => (
                  <li key={l.id} className="rounded-xl bg-slate-50 px-3.5 py-2 text-xs text-slate-700 border border-slate-200/60">
                    <span className="font-bold text-slate-900">{l.source}:</span> {l.text}
                    <span className="ml-2 text-[10px] text-slate-400">{l.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
