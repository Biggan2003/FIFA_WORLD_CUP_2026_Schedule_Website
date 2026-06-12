import { Match } from './types';

// ==========================================
// বিশ্বমানের ফুটবল ম্যাচ শিডিউল ডেটা অবজেক্ট
// ==========================================
// প্রতিটি ম্যাচের জন্য 'image' প্রপার্টি রয়েছে। 
// আপনি নিচের MATCHES_DATA এর যেকোনো ম্যাচের image: "" এর জায়গায় 
// যেকোনো অনলাইন বা লোকাল ছবির লিঙ্ক (যেমন: image: "https://yourimage.com/stadium.jpg") বসিয়ে দিতে পারেন।
// যদি খালি রাখেন "", তবে ফুটবল মাঠের সুন্দর ডার্ক গ্রিন থিম স্বয়ংক্রিয়ভাবে ব্যানার হিসেবে লোড হবে।

export const MATCHES_DATA: Match[] = [
  {
    id: 'wc-1',
    team1: 'ব্রাজিল',
    team1En: 'Brazil',
    team1Flag: 'Brazil',
    team1Code: 'BRA',
    team2: 'মরক্কো',
    team2En: 'Morocco',
    team2Flag: 'Morocco',
    team2Code: 'MAR',
    // UTC সময়: বাংলাদেশ জুন ১৪, ভোর ৪:০০ AM = জুন ১৩, রাত ১০:০০ PM UTC
    matchTimeUTC: '2026-06-13T22:00:00Z',
    bstDate: '14 June 2026',
    bstDay: 'রবিবার',
    bstTime: 'ভোর ০৪:০০ AM',
    stadium: 'মেটলাইফ স্টেডিয়াম, নিউ ইয়র্ক',
    group: 'Group C',
    // 📸 ছবি বসানোর জায়গা (নিচের ফাঁকা কোটেশনে ছবির লিংক দিন)
    image: './pictures/brazil1.jpg', 
    seedVotes1: 23540,
    seedVotes2: 7840,
    seedPercent1: 75,
    seedPercent2: 25
  },
  {
    id: 'wc-2',
    team1: 'Germany',
    team1En: 'Germany',
    team1Flag: 'জার্মানি',
    team1Code: 'GER',
    team2: 'Curacao',
    team2En: 'Curacao',
    team2Flag: 'কুরাসাও',
    team2Code: 'CUW',
    // UTC সময়: বাংলাদেশ জুন ১৪, রাত ১১:০০ PM = জুন ১৪, বিকাল ৫:০০ PM UTC
    matchTimeUTC: '2026-06-14T17:00:00Z',
    bstDate: '14 June 2026',
    bstDay: 'রবিবার',
    bstTime: 'রাত ১১:০০ PM',
    stadium: 'হিউস্টন স্টেডিয়াম, টেক্সাস',
    group: 'গ্রুপ E',
    image: '/pictures/germany.jpg', // আপনি এখানে custom image বসাতে পারবেন
    seedVotes1: 12450, // প্রম্পট অনুযায়ী ফিক্সড ভোট কাউন্ট
    seedVotes2: 3112,
    seedPercent1: 80, // প্রম্পট অনুযায়ী ফিক্সড ওয়ান-টাইম ৮০%
    seedPercent2: 20
  },
  {
    id: 'wc-3',
    team1: 'Argentina',
    team1En: 'Argentina',
    team1Flag: 'আর্জেন্টিনা',
    team1Code: 'ARG',
    team2: 'Algeria',
    team2En: 'Algeria',
    team2Flag: 'আলজেরিয়া',
    team2Code: 'ALG',
    // UTC সময়: বাংলাদেশ জুন ১৭, সকাল ৭:০০ AM = জুন ১৭, রাত ১:০০ AM UTC
    matchTimeUTC: '2026-06-17T01:00:00Z',
    bstDate: '17 June 2026',
    bstDay: 'বুধবার',
    bstTime: 'সকাল ০৭:০০ AM',
    stadium: 'হার্ড রক স্টেডিয়াম, মায়ামি',
    group: 'গ্রুপ J',
    image: '/pictures/messi.webp',
    seedVotes1: 18320,
    seedVotes2: 5160,
    seedPercent1: 78,
    seedPercent2: 22
  },
  {
    id: 'wc-4',
    team1: 'স্পেন',
    team1En: 'Spain',
    team1Flag: 'Spain',
    team1Code: 'ESP',
    team2: 'সৌদি আরব',
    team2En: 'Saudi Arabia',
    team2Flag: 'Saudi Arabia',
    team2Code: 'KSA',
    // UTC সময়: বাংলাদেশ জুন ১২, রাত ১০:০০ PM = জুন ১২, বিকাল ৪:০০ PM UTC
    matchTimeUTC: '2026-06-12T16:00:00Z',
    bstDate: '12 June 2026',
    bstDay: 'শুক্রবার',
    bstTime: 'রাত ১০:০০ PM',
    stadium: 'জিলেট স্টেডিয়াম, বোস্টন',
    group: 'গ্রুপ H',
    image: '/pictures/spane.avif',
    seedVotes1: 16770,
    seedVotes2: 5890,
    seedPercent1: 74,
    seedPercent2: 26
  },
  {
    id: 'wc-5',
    team1: 'ফ্রান্স',
    team1En: 'France',
    team1Flag: 'France',
    team1Code: 'FRA',
    team2: 'সেনেগাল',
    team2En: 'Senegal',
    team2Flag: 'Senegal',
    team2Code: 'SEN',
    // UTC সময়: বাংলাদেশ জুন ১৩, রাত ০১:০০ AM = জুন ১২, সন্ধ্যা ৭:০০ PM UTC
    matchTimeUTC: '2026-06-12T19:00:00Z',
    bstDate: '১৩ জুন, ২০২৬',
    bstDay: 'শনিবার',
    bstTime: 'রাত ০১:০০ AM',
    stadium: 'সোফি স্টেডিয়াম, লস অ্যাঞ্জেলেস',
    group: 'গ্রুপ I',
    image: '/pictures/embappe.webp',
    seedVotes1: 15100,
    seedVotes2: 3310,
    seedPercent1: 82,
    seedPercent2: 18
  },
  {
    id: 'wc-6',
    team1: 'পর্তুগাল',
    team1En: 'Portugal',
    team1Flag: 'Portugal',
    team1Code: 'POR',
    team2: 'উজবেকিস্তান',
    team2En: 'Uzbekistan',
    team2Flag: 'Uzbekistan',
    team2Code: 'UZB',
    // UTC সময়: বাংলাদেশ জুন ১৫, সকাল ০৬:০০ AM = জুন ১৫, রাত ১২:০০ AM UTC
    matchTimeUTC: '2026-06-15T00:00:00Z',
    bstDate: '১৫ জুন, ২০২৬',
    bstDay: 'সোমবার',
    bstTime: 'সকাল ০৬:০০ AM',
    stadium: 'বিসি প্লেস, ভ্যাঙ্কুভার',
    group: 'গ্রুপ K',
    image: '',
    seedVotes1: 11210,
    seedVotes2: 1980,
    seedPercent1: 85,
    seedPercent2: 15
  },
  {
    id: 'wc-7',
    team1: 'ইংল্যান্ড',
    team1En: 'England',
    team1Flag: 'England',
    team1Code: 'ENG',
    team2: 'ক্রোয়েশিয়া',
    team2En: 'Croatia',
    team2Flag: 'Croatia',
    team2Code: 'CRO',
    // UTC সময়: বাংলাদেশ জুন ১৬, রাত ০৯:০০ PM = জুন ১৬, বিকাল ৩:০০ PM UTC
    matchTimeUTC: '2026-06-16T15:00:00Z',
    bstDate: '১৬ জুন, ২০২৬',
    bstDay: 'মঙ্গলবার',
    bstTime: 'রাত ০৯:০০ PM',
    stadium: 'মার্সিডিজ-বেঞ্জ স্টেডিয়াম, আটলান্টা',
    group: 'গ্রুপ L',
    image: '/pictures/Tophy.jpeg',
    seedVotes1: 19840,
    seedVotes2: 16230,
    seedPercent1: 55,
    seedPercent2: 45
  },
  {
    id: 'wc-x-arg2',
    team1: 'আর্জেন্টিনা',
    team1En: 'Argentina',
    team1Flag: 'Argentina',
    team1Code: 'ARG',
    team2: 'অস্ট্রিয়া',
    team2En: 'Austria',
    team2Flag: 'Austria',
    team2Code: 'AUT',
    // UTC সময়: বাংলাদেশ জুন ২১, সকাল ০৮:০০ AM = জুন ২১, রাত ২:০০ AM UTC
    matchTimeUTC: '2026-06-21T02:00:00Z',
    bstDate: '21 June 2026',
    bstDay: 'রবিবার',
    bstTime: 'সকাল ০৮:০০ AM',
    stadium: 'लुসিয়ান স্টেডিয়াম, ডালাস',
    group: 'গ্রুপ J',
    image: '/pictures/arg.webp',
    seedVotes1: 14920,
    seedVotes2: 5800,
    seedPercent1: 72,
    seedPercent2: 28
  },
  {
    id: 'wc-x-bra2',
    team1: 'ব্রাজিল',
    team1En: 'Brazil',
    team1Flag: 'Brazil',
    team1Code: 'BRA',
    team2: 'হাইতি',
    team2En: 'Haiti',
    team2Flag: 'Haiti',
    team2Code: 'HAI',
    // UTC সময়: বাংলাদেশ জুন ১৯, রাত ০১:০০ AM = জুন ১৮, সন্ধ্যা ৭:০০ PM UTC
    matchTimeUTC: '2026-06-18T19:00:00Z',
    bstDate: '19 June 2026',
    bstDay: 'শুক্রবার',
    bstTime: 'রাত ০১:০০ AM',
    stadium: "লেভি'স স্টেডিয়াম, সান্তা ক্লারা",
    group: 'গ্রুপ C',
    image: '/pictures/brazil11.webp',
    seedVotes1: 22110,
    seedVotes2: 3010,
    seedPercent1: 88,
    seedPercent2: 12
  }
];

// ==========================================
// ভোটিং ফিডব্যাক মেসেজ ডিরেক্টরি (মজার ও মজার বাঙালি মেসেজ)
// ==========================================
export const TEAM_MESSAGES: Record<string, string[]> = {
  ARG: [
    "আপনি আর্জেন্টিনার জয় প্রেডিক্ট করেছেন! জয় এবার আলবিসেলেস্তের ঘরেই যাবে! মরুর বুকে কাপ গেছে, এবার আমেরিকাতেও মেগা মিশন হবে! 🇦🇷💪",
    "আর্জেন্টিনার জন্য ভোট দেওয়ার জন্য ধন্যবাদ! মেসি ম্যাজিকে মাতোয়ারা হবে স্টেডিয়াম! জয় নিশ্চিত ইনশাল্লাহ! 🇦🇷🏆",
    "আলবিসেলেস্তের জয় রুখবে কে? আপনার প্রিডিকশন একদম ঠিক! নীল-সাদা ঝড়ে উড়ে যাবে প্রতিপক্ষ! ⚽⚡"
  ],
  BRA: [
    "আপনি ব্রাজিলের জয় প্রেডিক্ট করেছেন! হেক্সা মিশন এবার সফল হবেই! সাম্বার তালে মেতে উঠবে পুরো বিশ্ব! 🇧🇷🔥",
    "সেলেসাওদের পক্ষে ভোট দিয়েছেন! জোগো বোনিতো ফুটবলের মন জুড়ানো ড্রিবলিং আর সুন্দর গোলে জয় আমাদেরই! 🇧🇷⚽",
    "ব্রাজিল মানেই তো শৈল্পিক আক্রমণ! হলুদ-সবুজ ঝড়ে সবাই দিশেহারা হবে! আপনার প্রেডিকশন সফল হোক! 🏆🇧🇷"
  ],
  GER: [
    "আপনি জার্মানির জয় চয়েস করেছেন! জার্মান মেশিনের নিখুঁত পাসিং আর গোল নিশ্চিত! ট্যাংক সবসময় রেডি! 🇩🇪⚙️",
    "জার্মান ফুটবলের কোনো বিকল্প নেই! দুর্দান্ত ড্রাফটিং আর শৃঙ্খলায় মাঠ কাঁপিয়ে জয় আসবেই! 🇩🇪⚽"
  ],
  FRA: [
    "আপনি ফ্রান্সের পক্ষে ভোট দিয়েছেন! এমবাপ্পের গোলবন্যা আর লে ব্লুজদের ডিফেন্স কাঁপানো কাউন্টার এটাক দেখতে প্রস্তুত থাকুন! 🇫🇷⚡",
    "ফরাসি ট্রফি উডলকের মিশন শুরু! আপনার ভোটে ফ্রান্স অনেক এগিয়ে গেছে! 🏆🇫🇷"
  ],
  POR: [
    "আপনি পর্তুগালের জয় প্রেডিক্ট করেছেন! সিআর৭ এর সিউউউউ (SIUUU) উদযাপনে কাঁপবে স্টেডিয়াম! 🇵🇹🐐",
    "পর্তুগীজ শক্তির পাশে ভোট দেওয়ার জন্য ধন্যবাদ! অসাধারণ ও শৈল্পিক জয় দিয়ে খেলা শেষ হবে! 🇵🇹🔥"
  ],
  ESP: [
    "টিকি-টাকা স্টাইলে স্পেনের জয় সাব্যস্ত করলেন! সুন্দর পাসিং ফুটবলের শৈল্পিক জয় সময়ের ব্যাপার মাত্র! 🇪🇸✨"
  ],
  ENG: [
    "ফুটবল কি বাড়িতে ফিরবে (It's Coming Home)? থ্রি লায়ন্সের পক্ষে ভোট দিয়ে আশা আরও বাড়িয়ে দিলেন! 🏴󠁧󠁢󠁥󠁮󠁧󠁿🔥"
  ],
  DEFAULT: [
    "আপনি এই দারুণ ম্যাচটিতে জয়ী দল বেছে নিয়েছেন! ফুটবল মাঠে চরম উত্তেজনাপূর্ণ ৯০ মিনিট উপভোগ করুন! ⚽🏆",
    "আপনার প্রেডিকশন সাবমিট হয়েছে! দেখা যাক মাঠে বল গড়াতেই কাদের ভাগ্য খোলে! 📢👍",
    "ফুটবলে যেকোনো মুহূর্তে যেকোনো কিছু হতে পারে! দারুণ লড়াই উপভোগের অপেক্ষায় রইলাম! ⚽🔥"
  ]
};

// ভোট দেওয়ার পর কাস্টম রেসপন্স মেসেজ জেনারেটর
export function getBengaliFeedbackMessage(teamCode: string, teamName: string): string {
  const messages = TEAM_MESSAGES[teamCode] || TEAM_MESSAGES.DEFAULT;
  const index = Math.floor(Math.random() * messages.length);
  return messages[index].replace('[Team]', teamName);
}
