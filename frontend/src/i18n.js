// Tiny UI dictionary. Item names, reasons and taglines stay in English for now.
export const LANGS = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
]

const STRINGS = {
  en: {
    language: 'Language', themeLight: 'Switch to light theme', themeDark: 'Switch to dark theme',
    stylist: 'Stylist chat', cabinet: 'Cabinet', account: 'Account',
    favorite: 'Add to favorites', unfavorite: 'Remove from favorites',
    colorMatch: 'Color Match', styleImpact: 'Style Impact', analyze: 'Analyze',
    breakdown: 'Outfit breakdown', why: 'Why this score', close: 'Close',
    saveOutfit: 'Save this outfit', saved: 'Saved',
    cabinetEmpty: 'Nothing here yet. Save an outfit to see it here.',
    tabAll: 'All', tabFavs: 'Favorites', wear: 'Wear', remove: 'Remove',
    name: 'Your name', guest: 'Guest', statSaved: 'Saved outfits', statFavs: 'Favorites', statBest: 'Best score',
    accountNote: 'Everything is stored on this device only.',
    chatPlaceholder: 'Ask your stylist…', send: 'Send',
    chipRate: 'Rate my outfit', chipImprove: 'Improve it', chipSurprise: 'Surprise me',
    hello: 'Hi! I’m your stylist. I can rate your outfit, improve it, or shuffle something new.',
    rated: 'You’re at {score}/10 ({label}). {tagline}',
    improved: 'Swapped your {slot} to “{item}”. {from} → {to}.',
    noImprove: 'I can’t beat this with the pieces I have. Nice work.',
    surprise: 'Random pick! It scores {score}/10.',
    unknown: 'Try “rate”, “improve” or “surprise”.',
    slot_headtop: 'headwear', slot_glasses: 'glasses', slot_top: 'top', slot_bottom: 'pants', slot_shoes: 'shoes',
  },
  fr: {
    language: 'Langue', themeLight: 'Passer au thème clair', themeDark: 'Passer au thème sombre',
    stylist: 'Chat styliste', cabinet: 'Garde-robe', account: 'Compte',
    favorite: 'Ajouter aux favoris', unfavorite: 'Retirer des favoris',
    colorMatch: 'Harmonie des couleurs', styleImpact: 'Impact du style', analyze: 'Analyser',
    breakdown: 'Détail de la tenue', why: 'Pourquoi cette note', close: 'Fermer',
    saveOutfit: 'Enregistrer cette tenue', saved: 'Enregistrée',
    cabinetEmpty: 'Rien ici pour l’instant. Enregistrez une tenue pour la voir ici.',
    tabAll: 'Toutes', tabFavs: 'Favoris', wear: 'Porter', remove: 'Supprimer',
    name: 'Votre nom', guest: 'Invité', statSaved: 'Tenues enregistrées', statFavs: 'Favoris', statBest: 'Meilleure note',
    accountNote: 'Tout est stocké uniquement sur cet appareil.',
    chatPlaceholder: 'Demandez à votre styliste…', send: 'Envoyer',
    chipRate: 'Note ma tenue', chipImprove: 'Améliore-la', chipSurprise: 'Surprends-moi',
    hello: 'Salut ! Je suis votre styliste. Je peux noter votre tenue, l’améliorer ou en tirer une au hasard.',
    rated: 'Vous êtes à {score}/10 ({label}). {tagline}',
    improved: 'J’ai remplacé votre {slot} par « {item} ». {from} → {to}.',
    noImprove: 'Je ne peux pas faire mieux avec ces pièces. Bravo.',
    surprise: 'Tirage au hasard ! Note : {score}/10.',
    unknown: 'Essayez « note », « améliorer » ou « surprise ».',
    slot_headtop: 'couvre-chef', slot_glasses: 'lunettes', slot_top: 'haut', slot_bottom: 'pantalon', slot_shoes: 'chaussures',
  },
  ar: {
    language: 'اللغة', themeLight: 'التبديل إلى المظهر الفاتح', themeDark: 'التبديل إلى المظهر الداكن',
    stylist: 'محادثة المنسّق', cabinet: 'الخزانة', account: 'الحساب',
    favorite: 'إضافة إلى المفضلة', unfavorite: 'إزالة من المفضلة',
    colorMatch: 'تناسق الألوان', styleImpact: 'قوة الأسلوب', analyze: 'تحليل',
    breakdown: 'تفاصيل الإطلالة', why: 'سبب هذا التقييم', close: 'إغلاق',
    saveOutfit: 'حفظ هذه الإطلالة', saved: 'محفوظة',
    cabinetEmpty: 'لا شيء هنا بعد. احفظ إطلالة لتظهر هنا.',
    tabAll: 'الكل', tabFavs: 'المفضلة', wear: 'ارتدِ', remove: 'حذف',
    name: 'اسمك', guest: 'ضيف', statSaved: 'الإطلالات المحفوظة', statFavs: 'المفضلة', statBest: 'أفضل تقييم',
    accountNote: 'كل شيء يُخزَّن على هذا الجهاز فقط.',
    chatPlaceholder: 'اسأل المنسّق…', send: 'إرسال',
    chipRate: 'قيّم إطلالتي', chipImprove: 'حسّنها', chipSurprise: 'فاجئني',
    hello: 'مرحبًا! أنا منسّق أزيائك. أستطيع تقييم إطلالتك أو تحسينها أو اختيار إطلالة جديدة.',
    rated: 'تقييمك {score}/10 ({label}). {tagline}',
    improved: 'استبدلتُ {slot} بـ «{item}». {from} ← {to}.',
    noImprove: 'لا أستطيع تحسينها بالقطع المتاحة. عمل رائع.',
    surprise: 'اختيار عشوائي! التقييم {score}/10.',
    unknown: 'جرّب «قيّم» أو «حسّن» أو «مفاجأة».',
    slot_headtop: 'غطاء الرأس', slot_glasses: 'النظارات', slot_top: 'القطعة العلوية', slot_bottom: 'البنطال', slot_shoes: 'الحذاء',
  },
}

// t('key') or t('key', { name: 'value' }) replaces {name} in the string.
export function makeT(lang) {
  return (key, vars) => {
    let s = STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
    return s
  }
}
