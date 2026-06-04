'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ur' | 'bilingual';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
  mounted: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    tagline: 'Get Trusted Household Help Anytime, Anywhere',
    search_placeholder: "Search for 'Maid', 'Water' or 'Driver'",
    home: 'Home',
    jobs: 'My Jobs',
    post_job: 'Post a Job',
    messages: 'Chats',
    profile: 'Profile',
    feed: 'Feed',
    my_jobs: 'My Jobs',
    chats: 'Chats',
    chat: 'Chat',
    call: 'Call',
    settings: 'Settings',
    app_language: 'App Language',
    verified_pros: 'Verified Pros',
    instant_matching: 'Instant Matching',
    get_started: 'Get Started',
    already_account: 'I already have an account',
    how_can_i_help: 'Aapki Muaawinat kesay karain?',
    location: 'Your Location',
    top_rated: 'Top Rated Pros Nearby',
    service_providers: 'Service Providers',
    local_vendors: 'Local Vendors',
    featured_ads: 'Featured Ads',
    ongoing: 'Ongoing',
    upcoming: 'Upcoming',
    history: 'History',
    my_requests: 'My Requests',
    no_active_jobs: 'No active requests found.',
    view_details: 'View Details',
    account_mgmt: 'Account Management',
    personal_info: 'Personal Information',
    payment_methods: 'Payment Methods',
    security_privacy: 'Security & Privacy',
    help_center: 'Help Center',
    app_settings: 'App Settings',
    log_out: 'Log Out',
    banner_title: 'Verified Household Helpers',
    banner_sub: 'Trusted Maids, Drivers, Cooks & more.',
    new_requests: 'New Requests',
    available: 'Available',
    urgent: 'High Priority',
    decline: 'Decline',
    accept_job: 'Accept Job',
    negotiate: 'Negotiate',
    business_mgmt: 'Business Management',
    prof_profile: 'Professional Profile',
    earnings_payouts: 'Earnings & Payouts',
    job_history: 'Job History',
    lang_settings: 'Language Settings',
    acc_security: 'Account Security',
    help_support: 'Help & Support',
    sos_emergency: 'SOS Emergency',
    sos_desc: 'Send live location to emergency contacts',
    emergency_contacts: 'Emergency Contacts',
    manage_contacts: 'Manage Contacts',
    add_contact: 'Add Contact',
    sos_sent_title: 'SOS Alert Sent!',
    sos_sent_desc: 'Your live location has been shared with your emergency contacts.',
    no_contacts_error: 'Please add emergency contacts first.',
    active: 'Active',
    in_progress: 'In Progress',
    completed: 'Completed',
    register_complaint: 'Register Complaint',
    complaint_submitted: 'Complaint Submitted',
    complaint_desc: 'We will review your feedback and get back to you shortly.',
    mark_completed: 'Mark as Completed',
    scheduled: 'Scheduled',
    no_jobs_found: 'No jobs found.',
    type_message: 'Type a message...',
    send: 'Send',
    dark_mode: 'Dark Mode',
    dashboard: 'Dashboard',
    orders: 'Orders',
    inventory: 'Inventory',
    sales: 'Sales',
    app_language_urdu: 'اردو'
  },
  ur: {
    welcome: 'خوش آمدید',
    tagline: 'کسی بھی وقت، کہیں بھی قابل اعتماد گھریلو مدد حاصل کریں',
    search_placeholder: "'میڈ'، 'پانی' یا 'ڈرائیور' تلاش کریں",
    home: 'ہوم',
    jobs: 'میرے کام',
    post_job: 'کام پوسٹ کریں',
    messages: 'چیٹس',
    profile: 'پروفائل',
    feed: 'فیڈ',
    my_jobs: 'میرے کام',
    chats: 'چیٹس',
    chat: 'چیٹ',
    call: 'کال',
    settings: 'ترتیبات',
    app_language: 'ایپ کی زبان',
    verified_pros: 'تصدیق شدہ ماہرین',
    instant_matching: 'فوری میچنگ',
    get_started: 'شروع کریں',
    already_account: 'میرا پہلے سے اکاؤنٹ ہے',
    how_can_i_help: 'آج میں آپ کی کیا مدد کر سکتا ہوں؟',
    location: 'آپ کا مقام',
    top_rated: 'قریبی بہترین ماہرین',
    service_providers: 'سروس پرووائیڈرز',
    local_vendors: 'مقامی دکاندار',
    featured_ads: 'نمایاں اشتہارات',
    ongoing: 'جاری ہے',
    upcoming: 'آنے والا',
    history: 'تاریخ',
    my_requests: 'میری درخواستیں',
    no_active_jobs: 'کوئی فعال درخواست نہیں ملی۔',
    view_details: 'تفصیلات دیکھیں',
    account_mgmt: 'اکاؤنٹ مینجمنٹ',
    personal_info: 'ذاتی معلومات',
    payment_methods: 'ادائیگی کے طریقے',
    security_privacy: 'سیکیورٹی اور پرائیویسی',
    help_center: 'مدد مرکز',
    app_settings: 'ایپ ترتیبات',
    log_out: 'لاگ آؤٹ',
    banner_title: 'تصدیق شدہ گھریلو مددگار',
    banner_sub: 'بھروسہ مند میڈز، ڈرائیورز، باورچی اور بہت کچھ۔',
    new_requests: 'نئی درخواستیں',
    available: 'دستیاب',
    urgent: 'اعلی ترجیح',
    decline: 'مسترد کریں',
    accept_job: 'کام قبول کریں',
    negotiate: 'بات چیت',
    business_mgmt: 'کاروباری مینجمنٹ',
    prof_profile: 'پروفیشنل پروفائل',
    earnings_payouts: 'آمدنی اور ادائیگیاں',
    job_history: 'کام کی تاریخ',
    lang_settings: 'زبان کی ترتیبات',
    acc_security: 'اکاؤنٹ سیکیورٹی',
    help_support: 'مدد اور تعاون',
    sos_emergency: 'ایس او ایس ایمرجنسی',
    sos_desc: 'ایمرجنسی رابطوں کو لائیو لوکیشن بھیجیں',
    emergency_contacts: 'ایمرجنسی رابطے',
    manage_contacts: 'رابطوں کا انتظام کریں',
    add_contact: 'رابطہ شامل کریں',
    sos_sent_title: 'ایس او ایس الرٹ بھیج دیا گیا!',
    sos_sent_desc: 'آپ کی لائیو لوکیشن آپ کے ایمرجنسی رابطوں کے ساتھ شیئر کر دی گئی ہے۔',
    no_contacts_error: 'براہ کرم پہلے ایمرجنسی رابطے شامل کریں۔',
    active: 'فعال',
    in_progress: 'جاری ہے',
    completed: 'مکمل ہو گیا',
    register_complaint: 'شکایت درج کریں',
    complaint_submitted: 'شکایت درج کر دی گئی ہے',
    complaint_desc: 'ہم آپ کے تاثرات کا جائزہ لیں گے اور جلد آپ سے رابطہ کریں گے۔',
    mark_completed: 'کام مکمل ہو گیا',
    scheduled: 'شیڈول کیا گیا',
    no_jobs_found: 'کوئی کام نہیں ملا۔',
    type_message: 'پیغام لکھیں...',
    send: 'بھیجیں',
    dark_mode: 'ڈارک موڈ',
    dashboard: 'ڈیش بورڈ',
    orders: 'آرڈرز',
    inventory: 'انوینٹری',
    sales: 'فروخت'
  },
  bilingual: {
    welcome: 'Welcome / خوش آمدید',
    tagline: 'Trusted Household Help / گھریلو مدد',
    search_placeholder: "Search / تلاش کریں",
    home: 'Home / ہوم',
    jobs: 'My Jobs / میرے کام',
    post_job: 'Post / پوسٹ',
    messages: 'Chats / چیٹس',
    profile: 'Profile / پروفائل',
    feed: 'Feed / فیڈ',
    my_jobs: 'My Jobs / میرے کام',
    chats: 'Chats / چیٹس',
    chat: 'Chat / چیٹ',
    call: 'Call / کال',
    settings: 'Settings / ترتیبات',
    app_language: 'Language / زبان',
    verified_pros: 'Verified Pros / تصدیق شدہ',
    instant_matching: 'Instant Matching / فوری میچنگ',
    get_started: 'Get Started / شروع کریں',
    already_account: 'Log In / لاگ ان',
    how_can_i_help: 'Aapki Muaawinat kesay karain?',
    location: 'Location / مقام',
    top_rated: 'Top Rated Pros / بہترین ماہرین',
    service_providers: 'Service Providers / پرووائیڈرز',
    local_vendors: 'Local Vendors / مقامی دکاندار',
    featured_ads: 'Featured Ads / نمایاں اشتہارات',
    ongoing: 'Ongoing / جاری',
    upcoming: 'Upcoming / آنے والا',
    history: 'History / تاریخ',
    my_requests: 'Requests / درخواستیں',
    no_active_jobs: 'No active jobs / کوئی کام نہیں',
    view_details: 'Details / تفصیلات',
    account_mgmt: 'Account / اکاؤنٹ',
    personal_info: 'Personal Info / ذاتی معلومات',
    payment_methods: 'Payments / ادائیگی',
    security_privacy: 'Security / سیکیورٹی',
    help_center: 'Help / مدد',
    app_settings: 'Settings / ترتیبات',
    log_out: 'Log Out / لاگ آؤٹ',
    banner_title: 'Verified Helpers / تصدیق شدہ',
    banner_sub: 'Maids, Drivers, Cooks / میڈز، ڈرائیورز',
    new_requests: 'New Requests / نئی درخواستیں',
    available: 'Available / دستیاب',
    urgent: 'Urgent / فوری',
    decline: 'Decline / مسترد',
    accept_job: 'Accept / قبول کریں',
    negotiate: 'Negotiate / بات چیت',
    business_mgmt: 'Business / کاروبار',
    prof_profile: 'Professional / پروفیشنل',
    earnings_payouts: 'Earnings / آمدنی',
    job_history: 'History / تاریخ',
    lang_settings: 'Language / زبان',
    acc_security: 'Security / سیکیورٹی',
    help_support: 'Support / تعاون',
    sos_emergency: 'SOS / ایس او ایس',
    sos_desc: 'Send Location / لوکیشن بھیجیں',
    emergency_contacts: 'Safety / حفاظت',
    manage_contacts: 'Contacts / رابطے',
    add_contact: 'Add / شامل کریں',
    sos_sent_title: 'SOS Sent / بھیج دیا گیا',
    sos_sent_desc: 'Location Shared / لوکیشن شیئر ہو گئی',
    no_contacts_error: 'Add contacts / رابطے شامل کریں',
    active: 'Active / فعال',
    in_progress: 'In Progress / جاری ہے',
    completed: 'Completed / مکمل',
    register_complaint: 'Register Complaint / شکایت درج کریں',
    complaint_submitted: 'Submitted / درج ہو گئی',
    complaint_desc: 'Feedback received / جائزہ لیا جائے گا',
    mark_completed: 'Done / مکمل',
    scheduled: 'Scheduled / شیڈول',
    no_jobs_found: 'No jobs / کوئی کام نہیں',
    type_message: 'Type / پیغام',
    send: 'Send / بھیجیں',
    dark_mode: 'Dark Mode / ڈارک موڈ',
    dashboard: 'Dashboard / ڈیش بورڈ',
    orders: 'Orders / آرڈرز',
    inventory: 'Inventory / انوینٹری',
    sales: 'Sales / فروخت'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('muawin_lang') as Language;
    if (savedLanguage && ['en', 'ur', 'bilingual'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('muawin_lang', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const isRtl = mounted && language === 'ur';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl, mounted }}>
      <div 
        dir={mounted ? (isRtl ? 'rtl' : 'ltr') : 'ltr'} 
        className={mounted && (language === 'ur' || language === 'bilingual') ? 'font-urdu-modern' : ''}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
