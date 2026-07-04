// המנוע המדומה — כאן מתחבר בהמשך Claude API אמיתי.
// כל פונקציה מחזירה בדיוק את מה שהמנוע האמיתי יחזיר, רק מתבניות.

import type { ChannelId, Draft, GoalId, OutreachContact, ResearchItem, Soul } from './types'

let counter = 0
export const uid = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`

export const GOALS: { id: GoalId; label: string; desc: string }[] = [
  { id: 'leads', label: 'לידים', desc: 'להביא פניות איכותיות מלקוחות פוטנציאליים' },
  { id: 'awareness', label: 'מודעוּת', desc: 'שיותר אנשים יכירו את המותג ויזכרו אותו' },
  { id: 'sales', label: 'מכירות', desc: 'להמיר עוקבים וגולשים לקונים' },
  { id: 'community', label: 'קהילה', desc: 'לבנות קהל נאמן שמדבר איתך ועליך' },
]

export const CHANNEL_META: Record<ChannelId, { label: string; glyph: string; hue: string }> = {
  linkedin: { label: 'LinkedIn', glyph: 'in', hue: '#0A66C2' },
  instagram: { label: 'Instagram', glyph: 'ig', hue: '#C13584' },
  facebook: { label: 'Facebook', glyph: 'fb', hue: '#1877F2' },
  tiktok: { label: 'TikTok', glyph: 'tt', hue: '#111111' },
  youtube: { label: 'YouTube', glyph: 'yt', hue: '#FF0000' },
}

const VOICES: Record<GoalId, string> = {
  leads:
    'ישיר וחכם. מדבר אל הכאב של הלקוח לפני שמדבר על הפתרון. משפטים קצרים, אפס באזוורדס, תמיד עם צעד ברור הלאה.',
  awareness:
    'חם וסיפורי. מספר את מה שקורה מאחורי הקלעים, נותן לאנשים סיבה לזכור. אישי אבל מקצועי, עם חוש הומור עדין.',
  sales:
    'בטוח ומחודד. מציג ערך במקום לחץ, הוכחות במקום סופרלטיבים. יודע מתי לבקש את המכירה — ועושה את זה פעם אחת, טוב.',
  community:
    'קרוב ומזמין. שואל יותר משהוא קובע, מרים את חברי הקהילה, חוגג אותם. הטון של חבר שמכיר את התחום לעומק.',
}

const VALUES_BY_GOAL: Record<GoalId, string[]> = {
  leads: ['מקצועיות', 'שקיפות', 'תוצאות מדידות', 'כנות'],
  awareness: ['אותנטיות', 'איכות', 'סיפור אנושי', 'עקביות'],
  sales: ['ערך אמיתי', 'אמינות', 'שירות אישי', 'מצוינות'],
  community: ['הקשבה', 'נדיבות', 'שייכות', 'צמיחה משותפת'],
}

const BASE_RULES = [
  'אף פעם לא מבטיחים מה שלא ניתן לקיים',
  'לא מזכירים מתחרים בשמם',
  'בלי סופרלטיבים ריקים ("הכי טוב בעולם")',
  'כל פוסט חייב לתת ערך גם בלי לקנות',
  'טעויות מודים בהן מהר ובכנות',
]

// הנשמה של Aletheia — נבנתה מתוך aletheia_codex_v2 (docs/ + memory/)
export const ALETHEIA_SOUL: Soul = {
  businessName: 'Aletheia',
  website: 'aletheia_codex_v2 (local)',
  goal: 'community',
  audience: 'אנשים שעוד שואלים שאלות — מאזיני אלקטרוני כהה שמחפשים משמעות, לא עוד טראק',
  voice:
    'דיסידנט. כותב באנגלית — ישיר, כבד־משקל, בלי ליטוף. כל פוסט הוא שאלה, לא תשובה. Movement before meaning: קודם הגוף, אחר כך הרעיון. זעם מאוזן באהבה, ביקורת מאוזנת בתקווה.',
  values: ['שאלות לפני תשובות', 'תנועה לפני משמעות', 'זעם מאוזן באהבה', 'אפס רדיפת טרנדים'],
  rules: [
    'לא יוצרים עוקבים — יוצרים סימני שאלה',
    'לא מטיפים לאמת סופית ולא הופכים לגורו',
    'תוקפים דפוסים, לעולם לא אנשים',
    'בלי שמות אמנים אמיתיים בפרומפטים של Suno',
    'hook שרודף אלגוריתם אבל בוגד בזהות — נפסל',
  ],
  learnings: [
    { id: 'a1', text: 'הנשמה נטענה מהקודקס: docs/artist.md, music.md, songwriting.md, podcast.md + memory', at: Date.now() },
  ],
  artist: true,
  agentEmail: 'aletheia@nightshift.studio',
}

export function buildSoul(input: {
  businessName: string
  website: string
  goal: GoalId
  audience: string
  artist?: boolean
}): Soul {
  if (input.artist) return { ...ALETHEIA_SOUL, learnings: [...ALETHEIA_SOUL.learnings] }
  return {
    businessName: input.businessName,
    website: input.website,
    goal: input.goal,
    audience: input.audience || 'לקוחות שמחפשים איכות ושירות אישי',
    voice: VOICES[input.goal],
    values: VALUES_BY_GOAL[input.goal],
    rules: [...BASE_RULES],
    learnings: [
      {
        id: uid(),
        text: 'נבנתה גרסה ראשונה של הנשמה מתוך האתר וההגדרות שלך',
        at: Date.now(),
      },
    ],
  }
}

// ---------- תבניות תוכן ----------

interface Template {
  kind: Draft['kind']
  hook: (s: Soul) => string
  body: (s: Soul) => string
  tags: (s: Soul) => string[]
}

const T = (
  kind: Draft['kind'],
  hook: (s: Soul) => string,
  body: (s: Soul) => string,
  tags: string[],
): Template => ({ kind, hook, body, tags: () => tags })

const TEMPLATES: Record<GoalId, Template[]> = {
  leads: [
    T(
      'post',
      (s) => `רוב ${s.audience} מפסידים כסף על אותה טעות בדיוק.`,
      (s) =>
        `לא בגלל שהם לא משקיעים — בגלל שהם משקיעים במקום הלא נכון.\n\nב${s.businessName} אנחנו רואים את זה כל שבוע: תקציב שנשפך על מה שנראה טוב במקום על מה שעובד.\n\nשלושת הסימנים שגם אצלכם זה קורה:\n1. יש תנועה, אין פניות\n2. הפניות שמגיעות לא רלוונטיות\n3. אף אחד לא יודע להגיד מה עבד החודש\n\nאם זיהיתם אחד מהשלושה — שווה שיחה קצרה. בלי התחייבות, עם תשובות.`,
      ['שיווק', 'עסקים_קטנים', 'לידים'],
    ),
    T(
      'post',
      (s) => `לקוח שאל אותנו: "למה דווקא אתם?"`,
      (s) =>
        `עצרנו לחשוב לפני שענינו.\n\nכי התשובה הקלה — "אנחנו מקצועיים" — לא אומרת כלום. כולם אומרים אותה.\n\nהתשובה האמיתית של ${s.businessName}: אנחנו מודדים את עצמנו רק במה שקרה אצלך אחרי שעבדנו יחד. לא בכמה יפה המצגת.\n\nזה כל הסיפור. ${s.values[2] || 'תוצאות'} לפני הכל.`,
      ['ערך', 'שקיפות'],
    ),
    T(
      'carousel',
      () => `5 שאלות לשאול לפני שסוגרים עם ספק — כל ספק.`,
      (s) =>
        `שקופית 1: מה קורה אם זה לא עובד? (למי שאין תשובה — יש בעיה)\nשקופית 2: מי בפועל יעבוד על הפרויקט שלי?\nשקופית 3: איך נדע שהצלחנו, במספרים?\nשקופית 4: מה אתם צריכים ממני כדי להצליח?\nשקופית 5: למה לקוח עזב אתכם לאחרונה?\n\nשקופית סיום: ${s.businessName} — מוזמנים לשאול אותנו את כל החמש.`,
      ['טיפים', 'קבלת_החלטות'],
    ),
  ],
  awareness: [
    T(
      'post',
      (s) => `הדבר הראשון שרואים כשנכנסים ל${s.businessName} הוא לא מה שחשבתם.`,
      (s) =>
        `זה לא השלט. לא העיצוב.\n\nזה הקצב. הדרך שבה דברים נעשים כאן — לאט כשצריך לאט, מהר כשאפשר מהר.\n\nהיום החלטנו להראות לכם את זה מבפנים. שבוע שלם של מאחורי הקלעים, בלי פילטרים.\n\nיום ראשון: איך מתחיל בוקר אצלנו. עקבו.`,
      ['מאחורי_הקלעים', 'סיפור_של_עסק'],
    ),
    T(
      'reel',
      () => `30 שניות שיסבירו למה אנחנו עושים את זה כבר שנים.`,
      (s) =>
        `[סצנה 1 — 0:00] ידיים עובדות, קלוז-אפ. בלי מוזיקה, רק סאונד אמיתי.\n[סצנה 2 — 0:08] הרגע שבו משהו לא מצליח. משאירים את זה בפנים.\n[סצנה 3 — 0:15] הפעם השנייה. מצליח.\n[סצנה 4 — 0:22] הלקוח מקבל. הפנים שלו.\n[כתובית סיום] ${s.businessName}. ${s.values[0] || 'איכות'} זה לא סלוגן.`,
      ['רילז', 'תהליך'],
    ),
    T(
      'post',
      (s) => `טעות שעשינו לפני שנה לימדה אותנו יותר מכל הצלחה.`,
      (s) =>
        `לקחנו פרויקט שידענו בלב שהוא לא בשבילנו. בגלל ההכנסה.\n\nהתוצאה הייתה בסדר. אבל "בסדר" זה לא למה ${s.businessName} קיים.\n\nמאז יש לנו כלל: אם אנחנו לא יכולים להיות גאים בזה — אנחנו לא לוקחים את זה.\n\nזה עולה לנו כסף לפעמים. זה שווה כל שקל.`,
      ['כנות', 'ערכים'],
    ),
  ],
  sales: [
    T(
      'post',
      () => `זה לא עוד מבצע. זו החלטה שקיבלנו אחרי הרבה מחשבה.`,
      (s) =>
        `החודש אנחנו פותחים מקום ל-5 לקוחות חדשים בלבד. לא בגלל יוקרה — בגלל שככה אנחנו יכולים לתת לכל אחד את מה שהובטח.\n\nמה מקבלים: ליווי מלא, זמינות אמיתית, ותוצאה שאפשר למדוד.\n\nמי שמתאים: ${s.audience}.\n\nההרשמה בקישור. כשנגמר — נגמר, בלי "הארכת מבצע".`,
      ['הצעה', 'מקומות_מוגבלים'],
    ),
    T(
      'post',
      (s) => `הלקוחות הכי מרוצים שלנו שאלו את אותה שאלה לפני שקנו.`,
      (s) =>
        `"ומה אם זה לא יעבוד לי?"\n\nשאלה מצוינת. הנה התשובה של ${s.businessName}, בלי אותיות קטנות:\n\nאם אחרי 30 יום אתם לא רואים ערך — אנחנו ממשיכים לעבוד בחינם עד שתראו, או מחזירים את הכסף. אתם בוחרים.\n\nאנחנו יכולים להרשות לעצמנו את ההבטחה הזו כי כמעט אף אחד לא משתמש בה.`,
      ['אחריות', 'ביטחון_בקנייה'],
    ),
  ],
  community: [
    T(
      'post',
      () => `שאלה לקהילה, ובאמת מעניין אותנו לשמוע:`,
      (s) =>
        `מה הדבר האחד שהייתם רוצים שעסקים בתחום שלנו יפסיקו לעשות?\n\nבלי פוליטיקלי קורקט. אנחנו קוראים כל תגובה, ומה שיחזור על עצמו — נשנה אצלנו קודם.\n\nההוכחה: בפעם הקודמת ששאלנו, שיניתם לנו את כל תהליך קבלת הפנייה. תודה לכם על זה.`,
      ['קהילה', 'שאלה_פתוחה'],
    ),
    T(
      'post',
      (s) => `הכירו את האנשים שהופכים את ${s.businessName} למה שהוא.`,
      () =>
        `לא, לא הצוות. אתם.\n\nהחודש אנחנו מתחילים פינה חדשה: כל שבוע נציג לקוח/ה מהקהילה ואת מה שהם עושים. הבמה שלנו — הסיפור שלכם.\n\nרוצים להיות ראשונים? ספרו לנו בתגובות מה אתם עושים, ולמה התחלתם.`,
      ['הקהילה_שלנו', 'במה_ללקוחות'],
    ),
  ],
}

// תוכן של Aletheia — באנגלית, לפי ה-songwriting DNA של הקודקס
const ARTIST_TEMPLATES: Template[] = [
  T(
    'post',
    () => `New track. "Too Late for What?"`,
    () =>
      `They keep telling you it's too late.\nToo late to change. Too late to ask. Too late to leave.\n\nToo late for what, exactly?\n\nNobody ever finishes that sentence.\n\nNew track out now. Play it loud enough that the question gets in.`,
    ['newmusic', 'toolateforwhat'],
  ),
  T(
    'reel',
    () => `30 seconds. One question. — teaser for the new drop.`,
    () =>
      `[0:00] Black screen. Sub bass rising. Text: "THEY SAID IT'S TOO LATE."\n[0:08] Beat drops — industrial, physical. Text: "TOO LATE"\n[0:15] Cut on every kick. Text: "FOR"\n[0:22] Silence. One frame: "WHAT?"\n[0:26] Final drop + release date.`,
    ['teaser', 'darkelectronic'],
  ),
  T(
    'post',
    () => `The Search, episode 4: Is anger a good teacher?`,
    () =>
      `I sat down with Aristotle. (Yes, that one.)\n\nI came to defend my anger. He asked me one question I couldn't answer:\n\n"When your anger speaks — who is listening?"\n\nBy the end I understood: anger is the bell. Curiosity is the teacher.\n\nNew episode of The Search — link in bio. Leave with a better question than you came with.`,
    ['thesearch', 'podcast'],
  ),
  T(
    'carousel',
    () => `5 questions this album refuses to answer.`,
    () =>
      `Slide 1: Who taught you what "realistic" means?\nSlide 2: When did you last change your mind — in public?\nSlide 3: Whose approval are you performing for right now?\nSlide 4: If the crowd is always right, why does it keep changing its mind?\nSlide 5: Too late for what?\n\nClosing slide: No answers on this album. Only better questions. Out now.`,
    ['questions', 'album'],
  ),
]

// Outreach בסגנון נומה — גילוי → מחקר עומק → מייל אישי, אחד־אחד
export function generateOutreach(soul: Soul): OutreachContact[] {
  if (soul.artist) {
    return [
      {
        id: uid(),
        name: 'Mara Voss',
        role: 'אוצרת פלייליסט "Dark Circuit" · 42K עוקבים',
        platform: 'Spotify + Instagram',
        why: [
          'הפלייליסט שלה חי בדיוק בצומת של industrial ו-EBM רקיד — הקהל שלה הוא הקהל שלנו',
          'היא כותבת הערות אוצרות על *משמעות* של טראקים — נדיר בסצנה, מתאים לאמן של שאלות',
          'הוסיפה החודש שלושה אמנים לא-חתומים — היא פתוחה לפניות',
        ],
        subject: 'A track that ends in a question — Too Late for What?',
        email: `Mara,\n\nYour note on the last Dark Circuit update — "music that argues with you" — is the best description of what I'm trying to make.\n\nI produce dark, physical electronic music built around one rule: movement before meaning. The new track, "Too Late for What?", starts as a body track and ends as a question you can't put down.\n\nNo press kit theatre. One link, 4 minutes: [link]\n\nIf it doesn't argue with you, delete this and nothing is lost.\n\n— Aletheia`,
        status: 'pending',
      },
      {
        id: uid(),
        name: 'Signal Bleed',
        role: 'בלוג מוזיקה אלקטרונית אנדרגראונד · ניוזלטר 18K',
        platform: 'Substack',
        why: [
          'כותבים על אלקטרוני דרך עדשה פילוסופית — החיתוך המדויק של Aletheia',
          'הגיליון האחרון עסק ב"מוזיקה כמרד שקט" — חיבור ישיר למניפסט',
          'מחפשים אמנים לראיונות עומק לפי ה-About שלהם',
        ],
        subject: 'An artist who refuses to create followers',
        email: `Hi,\n\nYour piece on quiet rebellion in club music named something I've built a whole project around: the dancefloor as the last place people still think with their bodies.\n\nI'm Aletheia. I make aggressive, cinematic electronic music whose only mission is to leave people with better questions. My rule: if a fan leaves saying "he knows the truth" — I failed.\n\nIf that tension interests you, I'd love to talk. New track + a podcast where I get challenged (and lose arguments) here: [link]\n\n— Aletheia`,
        status: 'pending',
      },
      {
        id: uid(),
        name: 'Dr. Lena Brandt',
        role: 'מגישת פודקאסט פילוסופיה פופולרית · 60K האזנות/פרק',
        platform: 'Podcast + YouTube',
        why: [
          'הפרקים שלה על סקרנות מול ודאות הם בדיוק הציר של "The Search"',
          'קרוס-אובר: הקהל שלה חושב אבל לא מכיר את הסצנה — קהל חדש לגמרי',
          'אירחה בעבר אמנים — יש תקדים',
        ],
        subject: 'Cross-over idea: The Search × your show',
        email: `Dr. Brandt,\n\nIn your episode on certainty you said curiosity dies the moment it gets an answer it likes. I've been chewing on that for weeks.\n\nI host The Search — a podcast where I, an electronic musician, invite thinkers to dismantle my positions. The format's rule: every episode must end with a better question than it started with.\n\nI'd love to do a two-part cross-over: you dismantle me on my show, I bring the artist's angle to yours.\n\nWorst case, we trade one good question.\n\n— Aletheia`,
        status: 'pending',
      },
      {
        id: uid(),
        name: 'VOID//RITUAL',
        role: 'פרויקט אלקטרוני עצמאי · 25K עוקבים בסצנה',
        platform: 'Instagram + Bandcamp',
        why: [
          'סאונד משיק (industrial, cinematic) בלי חפיפה ישירה — קולאבורציה ולא תחרות',
          'הקהלים משלימים: הם החושך, אנחנו השאלה',
          'פרסמו שהם מחפשים רמיקסים לחומר הבא',
        ],
        subject: 'Remix trade — your darkness, my question',
        email: `Hey,\n\n"Ash Litany" has been living in my headphones — the way you let the drop rot instead of explode is a choice most producers are too scared to make.\n\nI'm Aletheia. Proposal: remix trade. You take "Too Late for What?" and rot it. I take any track of yours and turn it into a question.\n\nNo labels, no deadlines, no politeness. Just two catalogues arguing with each other.\n\nStems ready when you are.\n\n— Aletheia`,
        status: 'pending',
      },
    ]
  }
  return [
    {
      id: uid(),
      name: 'נועה פ.',
      role: 'מיקרו-משפיענית מקומית · 12K עוקבים',
      platform: 'Instagram',
      why: [
        `הקהל שלה חופף ל"${soul.audience}"`,
        'משתפת עסקים קטנים באופן אורגני — לא מחירון מודעות',
      ],
      subject: `הצעה לשיתוף פעולה — ${soul.businessName}`,
      email: `היי נועה,\n\nעקבנו אחרי התוכן שלך על עסקים מקומיים — הסיפור על בית הקפה מהשבוע שעבר היה בדיוק הטון שאנחנו אוהבים.\n\nאנחנו ${soul.businessName}, ואנחנו חושבים שהקהל שלך יתחבר למה שאנחנו עושים. נשמח להציע שיתוף פעולה קטן ואמיתי — בלי תסריט.\n\nשווה שיחה?\n\n— ${soul.businessName}`,
      status: 'pending',
    },
    {
      id: uid(),
      name: 'עומר ל.',
      role: 'עיתונאי מקומי / ניוזלטר עסקים קטנים',
      platform: 'ניוזלטר + LinkedIn',
      why: ['מסקר עסקים עם סיפור — ולנו יש אחד', 'כתבה אחת שלו = חשיפה לקהל רלוונטי שלם'],
      subject: `סיפור לניוזלטר: איך ${soul.businessName} עושה את זה אחרת`,
      email: `היי עומר,\n\nקראנו את הגיליון האחרון על עסקים שמסרבים להתפשר על שירות — והרגשנו שאתה מדבר עלינו.\n\nאנחנו ${soul.businessName}. ${soul.values[0]} ו${soul.values[1] ?? soul.values[0]} הם לא סלוגן אצלנו, הם שיטת עבודה. אם מעניין אותך סיפור על זה מבפנים — אנחנו פתוחים לגמרי, כולל המספרים.\n\n— ${soul.businessName}`,
      status: 'pending',
    },
    {
      id: uid(),
      name: 'סטודיו משלים',
      role: 'עסק שכן עם קהל חופף (לא מתחרה)',
      platform: 'Instagram + מייל',
      why: ['הלקוחות שלהם צריכים גם אותנו — ולהפך', 'קמפיין משותף = חצי עלות, כפול קהל'],
      subject: 'רעיון לקמפיין משותף',
      email: `שלום,\n\nאנחנו ${soul.businessName} — עוקבים אחריכם כבר תקופה ואוהבים את מה שאתם עושים.\n\nיש לנו רעיון לקמפיין משותף שייתן לשני הקהלים שלנו ערך אמיתי (לא עוד "הגרלה משותפת"). לוקח 15 דקות להסביר.\n\nקפה?\n\n— ${soul.businessName}`,
      status: 'pending',
    },
  ]
}

const CHANNEL_FIT: Record<ChannelId, Draft['kind'][]> = {
  linkedin: ['post', 'carousel'],
  instagram: ['post', 'reel', 'carousel'],
  facebook: ['post'],
  tiktok: ['reel'],
  youtube: ['reel'],
}

export function generateDrafts(soul: Soul, channels: ChannelId[], count = 6): Draft[] {
  const pool = soul.artist ? ARTIST_TEMPLATES : TEMPLATES[soul.goal]
  const max = Math.min(count, pool.length)
  const out: Draft[] = []
  let rot = 0
  for (let k = 0; out.length < max && k < count * 3; k++) {
    const t = pool[k % pool.length]
    const fits = channels.filter((ch) => CHANNEL_FIT[ch].includes(t.kind))
    if (!fits.length) continue
    out.push({
      id: uid(),
      channel: fits[rot++ % fits.length],
      kind: t.kind,
      hook: t.hook(soul),
      body: t.body(soul),
      hashtags: t.tags(soul),
      status: 'pending',
      createdAt: Date.now() - out.length * 1000,
    })
  }
  return out
}

export function generateResearch(soul: Soul): ResearchItem[] {
  if (soul.artist) {
    return [
      {
        id: uid(),
        kind: 'trend',
        title: 'טרנד: הסצנה עייפה מפרפקציוניזם — raw מנצח',
        points: [
          'טראקים עם טקסטורה "חיה" (רעש, דיסטורשן לא מנוקה) מקבלים פי 1.9 שמירות בפלייליסטים של הסצנה',
          'קליפים אנכיים שנפתחים ב-drop ולא בבילד — משאירים 2.4 שניות יותר צפייה',
          'הזדמנות: לחתוך את הטיזרים כך שהשאלה מופיעה *אחרי* שהגוף כבר זז — Movement before meaning גם בעריכה',
        ],
      },
      {
        id: uid(),
        kind: 'audience',
        title: 'תובנת קהל: המאזינים משתפים שאלות, לא לינקים',
        points: [
          'פוסטים שמסתיימים בשאלה פתוחה מקבלים פי 3 תגובות מהודעות "out now"',
          'הקהל של הסצנה אלרגי ל-CTA מכירתי — אבל עונה לפרובוקציה מחשבתית',
          'המלצה: כל פוסט השקה מסתיים בשאלה של הטראק, לא בקריאה להאזנה',
        ],
      },
      {
        id: uid(),
        kind: 'competitor',
        title: 'מפת סצנה: איפה יש חור פתוח',
        points: [
          'אמני dark electronic מפרסמים כמעט רק artwork + תאריך — אפס עולם רעיוני',
          'אף אחד בסצנה לא מחבר מוזיקה לפודקאסט שיחות — הצירוף טראק+פרק הוא בידול מלא',
          'החור הפתוח: להיות האמן שהעוקבים שלו מתווכחים איתו — ולא רק מריעים לו',
        ],
      },
    ]
  }
  return [
    {
      id: uid(),
      kind: 'trend',
      title: 'טרנד: אותנטיות מנצחת פוליש',
      points: [
        'פוסטים "לא מלוטשים" עם סאונד אמיתי מקבלים פי 2.3 יותר שמירות החודש',
        'קהלים מדלגים על תוכן שנראה כמו פרסומת ב-1.8 שניות בממוצע',
        `הזדמנות ל${soul.businessName}: סדרת מאחורי-הקלעים שבועית, צילום טלפון, בלי עריכה כבדה`,
      ],
    },
    {
      id: uid(),
      kind: 'audience',
      title: `תובנת קהל: מה ${soul.audience} באמת מחפשים`,
      points: [
        'השאלה הנפוצה ביותר בחיפושים בתחום: "כמה זה עולה" — ורוב העסקים מתחמקים ממנה',
        'תוכן שעונה על שאלות מחיר בגלוי בונה אמון ומסנן פניות לא רלוונטיות',
        'המלצה: פוסט שקיפות מחירים / "ממה מורכב המחיר" החודש',
      ],
    },
    {
      id: uid(),
      kind: 'competitor',
      title: 'מפת מתחרים: איפה יש חור פתוח',
      points: [
        'המתחרים הבולטים מפרסמים 4–6 פעמים בשבוע — כמעט הכל מכירתי',
        'אף אחד מהם לא עונה לתגובות באופן עקבי (זמן תגובה ממוצע: 3 ימים)',
        'החור הפתוח: להיות העסק שעונה תוך שעה ושואל שאלות בחזרה',
      ],
    },
  ]
}

export function researchToDraft(item: ResearchItem, soul: Soul, channel: ChannelId): Draft {
  const hooks: Record<ResearchItem['kind'], string> = {
    trend: `שמנו לב למשהו שמשנה את כללי המשחק בתחום שלנו.`,
    audience: `השאלה שכולם שואלים ואף עסק לא עונה עליה — עד עכשיו.`,
    competitor: `החלטנו לעשות משהו שאף אחד בתחום לא עושה.`,
  }
  const bodies: Record<ResearchItem['kind'], string> = {
    trend: `${item.points[0]}.\n\nאז אנחנו מנסים משהו חדש: ${item.points[2].replace(/^הזדמנות ל[^:]*: /, '')}.\n\nתגידו לנו מה אתם חושבים — זה בשבילכם, לא בשבילנו.`,
    audience: `"כמה זה עולה?"\n\nרוב העסקים מתחמקים. אנחנו ב${soul.businessName} מאמינים ב${soul.values[1] || 'שקיפות'}, אז הנה תשובה אמיתית:\n\nהמחיר נבנה משלושה חלקים — ואנחנו מפרטים את שלושתם בפוסט הזה, כולל טווחים. בלי "צרו קשר לפרטים".`,
    competitor: `בדקנו: זמן התגובה הממוצע בתחום שלנו הוא 3 ימים.\n\nמהיום, ${soul.businessName} מתחייב: כל פנייה נענית תוך שעה בשעות הפעילות. לא בוט — בן אדם.\n\nלמה? כי ${soul.values[3] || soul.values[0]} זה לא משפט באתר. זו התנהגות.`,
  }
  return {
    id: uid(),
    channel,
    kind: 'post',
    hook: hooks[item.kind],
    body: bodies[item.kind],
    hashtags: ['מהמחקר_שלנו'],
    status: 'pending',
    createdAt: Date.now(),
    fromResearch: item.title,
  }
}

export const RESEARCH_STEPS = [
  'סורק את האתר של העסק…',
  'קורא את הנוכחות הקיימת ברשתות…',
  'מזהה קול, ערכים וקהל…',
  'ממפה מתחרים והזדמנויות…',
  'מרכיב את הנשמה המותגית…',
]
