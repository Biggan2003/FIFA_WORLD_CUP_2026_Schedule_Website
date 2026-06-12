import React, { useState, useEffect } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ThumbsUp, 
  Check, 
  Image as ImageIcon,
  Clock,
  Flame,
  Volume2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

import { Match, UserVote } from './types';
import { MATCHES_DATA, getBengaliFeedbackMessage } from './data';

export default function App() {
  // ডেট অবজেক্টকে YYYY-MM-DD ফরম্যাটে রূপান্তর করা
  const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ডেট অবজেক্টকে HH:MM ফরম্যাটে রূপান্তর করা
  const formatTimeToHHMM = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // =========================================================================
  // ১. স্টেট ও সিমুলেশন কন্ট্রোল (Automatic Real-Time & Custom Simulation Mode)
  // =========================================================================
  // default: true (অটোমেটিক রিয়েল-টাইম লাইভ ঘড়ি সক্রিয় থাকবে)
  const [useRealTime, setUseRealTime] = useState<boolean>(true);
  const [now, setNow] = useState<Date>(new Date());

  const [simulatedDateStr, setSimulatedDateStr] = useState<string>(() => formatDateToYYYYMMDD(new Date()));
  const [simulatedTimeStr, setSimulatedTimeStr] = useState<string>(() => formatTimeToHHMM(new Date()));
  
  // লাইভ সার্চ এবং ফিল্টারিং স্টেট
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'favs' | 'group'>('all');
  
  // কাস্টম ইমেজ প্রিভিউ এর জন্য ব্যানার ইনেবল/ডিজেবল টগল (ব্যবহারকারীর প্রম্পট অনুযায়ী)
  const [showVisualBanners, setShowVisualBanners] = useState<boolean>(true);

  // ব্রাউজার লোকাল স্টোরেজ থেকে ইউজারের পূর্ববর্তী ভোটগুলো লোড করা
  const [userVotes, setUserVotes] = useState<Record<string, UserVote>>(() => {
    try {
      const saved = localStorage.getItem('world_cup_2026_user_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // ভোট দেওয়ার পর ভেসে ওঠা বঙ্গানুবাদ ফিডব্যাক মেসেজ
  const [votingFeedback, setVotingFeedback] = useState<Record<string, string>>({});

  // =========================================================================
  // ২. কারেন্ট ডেট অবজেক্ট জেনারেটর (আসল লাইভ ও সিমুলেশন টাইম ম্যানেজমেন্ট)
  // =========================================================================
  useEffect(() => {
    const timer = setInterval(() => {
      const current = new Date();
      setNow(current);
      if (useRealTime) {
        setSimulatedDateStr(formatDateToYYYYMMDD(current));
        setSimulatedTimeStr(formatTimeToHHMM(current));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [useRealTime]);

  const getSimulatedNowDate = (): Date => {
    if (useRealTime) {
      return now;
    } else {
      const base = new Date(`${simulatedDateStr}T${simulatedTimeStr}:00`);
      // সিমুলেশন মোডেও যেন সেকেন্ড অবিরত কমে, তাই লাইভ সময়ের সেকেন্ড অংশ যোগ করে দেওয়া হলো
      base.setSeconds(now.getSeconds());
      return base;
    }
  };

  const simulatedNow = getSimulatedNowDate();

  // লোকাল স্টোরেজে ভোট সেভ করা
  const handleVote = (matchId: string, teamChoice: 'team1' | 'team2', match: Match) => {
    // ইতিমধ্যে ভোট দিয়ে থাকলে আর দেওয়া যাবে না (লোকাল স্টোরেজ লক ট্রিক)
    if (userVotes[matchId]) return;

    const newVote: UserVote = {
      matchId,
      votedFor: teamChoice,
      userAddedVote1: teamChoice === 'team1' ? 1 : 0,
      userAddedVote2: teamChoice === 'team2' ? 1 : 0
    };

    const updatedVotes = {
      ...userVotes,
      [matchId]: newVote
    };

    setUserVotes(updatedVotes);
    localStorage.setItem('world_cup_2026_user_votes', JSON.stringify(updatedVotes));

    // কাস্টম বঙ্গানুবাদ মেসেজ জেনারেট করে সেট করা
    const teamCode = teamChoice === 'team1' ? match.team1Code : match.team2Code;
    const teamName = teamChoice === 'team1' ? match.team1 : match.team2;
    const feedback = getBengaliFeedbackMessage(teamCode, teamName);
    
    setVotingFeedback(prev => ({
      ...prev,
      [matchId]: feedback
    }));
  };

  // =========================================================================
  // ৩. ফ্যান জোন অটো-আপডেট ম্যাজিক লজিক (JavaScript dynamic scheduler)
  // =========================================================================
  
  // আর্জেন্টিনা ও ব্রাজিলের পরবর্তী ম্যাচ খোঁজার লজিক
  const getNextMatchForTeam = (teamNameEn: 'Argentina' | 'Brazil'): Match | null => {
    const teamMatches = MATCHES_DATA.filter(m => 
      m.team1En === teamNameEn || m.team2En === teamNameEn
    );

    // যে ম্যাচগুলির সময় বর্তমান সিমুলেটেড সময়ের সমান বা পরে আছে, সেগুলোই শুধু ফিউচার ম্যাচ
    const futureMatches = teamMatches.filter(m => {
      const mDate = new Date(m.matchTimeUTC);
      return mDate >= simulatedNow;
    });

    // ফিউচার ম্যাচগুলোকে ক্রোনোলজিক্যালি সর্ট করে ১ম টি রিটার্ন করা
    if (futureMatches.length > 0) {
      return futureMatches.sort((a, b) => 
        new Date(a.matchTimeUTC).getTime() - new Date(b.matchTimeUTC).getTime()
      )[0];
    }
    return null;
  };

  const nextArgentinaMatch = getNextMatchForTeam('Argentina');
  const nextBrazilMatch = getNextMatchForTeam('Brazil');

  // কাউন্টডাউন টাইমার ক্যালকুলেটর হেল্পার
  const calculateTimeRemaining = (targetTimeStr: string) => {
    const target = new Date(targetTimeStr).getTime();
    const diff = target - simulatedNow.getTime();

    if (diff <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return { expired: false, days, hours, minutes, seconds };
  };

  // সংখ্যাগুলোকে বাংলা অক্ষরে রূপান্তরের ফাংশন
  const toBanglaDigits = (num: number | string): string => {
    const banglaNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/[0-9]/g, (w) => banglaNums[parseInt(w, 10)]);
  };

  // =========================================================================
  // ৪. স্মার্ট সার্চ ও লাইভ ফিল্টারিং প্রসেস
  // =========================================================================
  const filteredMatches = MATCHES_DATA.filter(match => {
    // সার্চ কোয়েরি ফিল্টার
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      match.team1.toLowerCase().includes(searchLower) ||
      match.team1En.toLowerCase().includes(searchLower) ||
      match.team2.toLowerCase().includes(searchLower) ||
      match.team2En.toLowerCase().includes(searchLower) ||
      match.stadium.toLowerCase().includes(searchLower) ||
      match.group.toLowerCase().includes(searchLower);

    // কান্ট্রি সিলেক্ট ড্রপডাউন ফিল্টার
    const matchesCountry = 
      selectedCountry === 'All' ||
      match.team1En === selectedCountry ||
      match.team2En === selectedCountry;

    // ট্যাব ফিল্টার
    let matchesTab = true;
    if (activeTab === 'today') {
      // সিমুলেটেড তারিখের সাথে ম্যাচ খেলে কিনা চেক করা
      const matchDateStr = new Date(match.matchTimeUTC).toISOString().split('T')[0];
      matchesTab = matchDateStr === simulatedDateStr;
    } else if (activeTab === 'favs') {
      // শুধু আর্জেন্টিনা বা ব্রাজিলের ম্যাচ
      matchesTab = 
        match.team1En === 'Argentina' || match.team1En === 'Brazil' ||
        match.team2En === 'Argentina' || match.team2En === 'Brazil';
    } else if (activeTab === 'group') {
      matchesTab = match.group.includes('গ্রুপ');
    }

    return matchesSearch && matchesCountry && matchesTab;
  });

  return (
    <div className="min-h-screen pb-20 text-white selection:bg-[#facc15] selection:text-black">
      
      {/* =========================================================================
          মুকুট/ব্যানার এবং ম্যানুয়াল ব্যাকগ্রাউন্ড পিকচার এড করার ইন্সট্রাকশন কমেন্ট 
          ========================================================================= */}
      
      {/* ⚠️ ম্যানুয়াল পিকচার আপডেট গাইডেন্স:
          আপনি যদি এই ওয়েবসাইটের সম্পুর্ণ ব্যাকগ্রাউন্ড পরিবর্তন করতে চান, তবে CSS ফাইল (src/index.css) 
          অথবা নিচের এই মূল কন্টেইনারে background-image এ কাস্টম পিকচার বসাতে পারেন।
          যেমন: className="bg-cover bg-center" style={{ backgroundImage: "url('আপনার_ছবি_লিঙ্ক')" }}
      */}
      
      <header className="relative border-b border-white/10 bg-gradient-to-b from-[#0a4d35]/35 to-[#041d14]/85 backdrop-blur-md">
        
        {/* টপ কসমিক ডিজাইন ও স্টাডিয়াম ভাইব গ্লো */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            
            {/* লোগো ও টাইটেল */}
            <div className="text-center md:text-left flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#facc15] to-yellow-600 gold-glow">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white flex items-center gap-2 justify-center md:justify-start">
                  🏆 WORLD CUP 2026 Schedule <span className="text-[#facc15] italic">Bangladesh Time </span>
                </h1>
                <p className="text-xs sm:text-sm text-yellow-500/80 font-medium">
                  Developed by: <a href="https://www.linkedin.com/in/g-m-biggan-371956305/" target="_blank" rel="noopener noreferrer" className="text-[#facc15] hover:underline font-bold">G. M Biggan</a>
                </p>
              </div>
            </div>

            {/* লাইভ ডিভাইস সময় কন্ট্রোল ও সিমুলেটর */}
            <div className="w-full md:w-auto bg-black/40 p-3 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <div 
                onClick={() => {
                  if (useRealTime) {
                    setUseRealTime(false);
                  } else {
                    const current = new Date();
                    setNow(current);
                    setSimulatedDateStr(formatDateToYYYYMMDD(current));
                    setSimulatedTimeStr(formatTimeToHHMM(current));
                    setUseRealTime(true);
                  }
                }}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none"
                title="রিয়েল-টাইম লাইভ ঘড়ি বা ম্যানুয়াল সিমুলেশনের মধ্যে টগল করুন"
              >
                {useRealTime ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-emerald-400">অটোমেটিক রিয়েল-টাইম লাইভ:</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                    <span className="text-amber-500">ম্যানুয়াল সিমুলেশন সময়:</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input 
                  type="date"
                  value={simulatedDateStr}
                  onChange={(e) => {
                    setSimulatedDateStr(e.target.value);
                    setUseRealTime(false); // ম্যানুয়াল মোড চালু হবে
                  }}
                  className={`bg-[#041d14] text-white text-xs px-2.5 py-1.5 rounded border focus:outline-none focus:border-[#facc15] cursor-pointer w-32 transition-colors ${
                    useRealTime ? 'border-emerald-600/40 text-emerald-300' : 'border-amber-600/45 text-amber-300'
                  }`}
                  title="আপনার ইচ্ছেমতো তারিখ পরিবর্তন করুন (পরিবর্তন করলে সিমুলেশন মোড অন হবে)"
                />
                <input 
                  type="time"
                  value={simulatedTimeStr}
                  onChange={(e) => {
                    setSimulatedTimeStr(e.target.value);
                    setUseRealTime(false); // ম্যানুয়াল মোড চালু হবে
                  }}
                  className={`bg-[#041d14] text-white text-xs px-2.5 py-1.5 rounded border focus:outline-none focus:border-[#facc15] cursor-pointer w-20 transition-colors ${
                    useRealTime ? 'border-emerald-600/40 text-emerald-300' : 'border-amber-600/45 text-amber-300'
                  }`}
                  title="আপনার ইচ্ছেমতো সময় পরিবর্তন করুন (পরিবর্তন করলে সিমুলেশন মোড অন হবে)"
                />
                
                {/* রিয়েল-টাইম মোড রিসেট বাটন */}
                <button
                  onClick={() => {
                    const current = new Date();
                    setNow(current);
                    setSimulatedDateStr(formatDateToYYYYMMDD(current));
                    setSimulatedTimeStr(formatTimeToHHMM(current));
                    setUseRealTime(true);
                  }}
                  title="অটোমেটিক লাইভ সময়-এ ফিরে যান"
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded transition-all active:scale-95 cursor-pointer flex items-center gap-1 ${
                    useRealTime 
                      ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 cursor-default opacity-60' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black border border-transparent'
                  }`}
                  disabled={useRealTime}
                >
                  {useRealTime ? 'Live 🟢' : 'Reset Live'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* মূল মূল কন্টেন্ট স্ক্রিন */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            🚀 আর্জেন্টিনা ও ব্রাজিল স্পেশাল ফ্যান জোন (Dynamic Next Match Info Line/Grid)
            ========================================================================= */}
        <section className="mb-10">
          <div className="flex items-center gap-2.5 mb-5">
            <Sparkles className="text-amber-400 animate-bounce" size={22} />
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              আর্জেন্টিনা ও ব্রাজিল স্পেশাল <span className="text-amber-400">ফ্যান জোন</span>
            </h2>
            <div className="h-[1px] flex-1 bg-emerald-800/40"></div>
            <div className="text-xs text-amber-400 font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/20">
              অটো-আপডেট ম্যাজিক
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* আর্জেন্টিনা ফ্যান জোন */}
            <motion.div 
              layout
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-950 via-emerald-950 to-slate-950 border-2 border-sky-600/40 p-5 shadow-2xl group transition-all"
            >
              {/* ব্যানার ব্যাকগ্রাউন্ড ইফেক্ট */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl -z-10 group-hover:bg-sky-500/20 transition-all"></div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌟</span>
                  <h3 className="text-lg font-bold text-sky-300 font-display flex items-center gap-1">
                    আর্জেন্টিনা ফ্যান জোন <span className="text-xs font-normal text-slate-400">(Argentina Fan Zone)</span>
                  </h3>
                </div>
                <span className="text-xs uppercase bg-sky-500/20 text-sky-100 font-bold px-2 py-0.5 rounded border border-sky-400/30 tracking-wider">
                  আলবিসেলেস্তে 🇦🇷
                </span>
              </div>

              {nextArgentinaMatch ? (
                <div>
                  <div className="bg-sky-950/60 p-4 rounded-xl border border-sky-800/50 mb-4">
                    <div className="text-xs text-sky-300/80 mb-2 font-medium flex items-center gap-1.5">
                      <Clock size={13} /> পরবর্তী ম্যাচ টাইমার (Countdown To Kickoff):
                    </div>
                    
                    {/* রিয়েল-টাইম লাইভ কাউন্টডাউন */}
                    <div className="grid grid-cols-4 gap-2 text-center text-white mb-2">
                      {(() => {
                        const remaining = calculateTimeRemaining(nextArgentinaMatch.matchTimeUTC);
                        if (remaining.expired) {
                          return <div className="col-span-4 text-center py-1 font-semibold text-amber-400 animate-pulse text-sm">খেলোয়াড়রা এখন মাঠে! ম্যাচটি রানিং চলছে ⚽</div>;
                        }
                        return (
                          <>
                            <div className="bg-slate-900/90 rounded p-2 border border-sky-900/50">
                              <span className="block text-lg sm:text-xl font-bold font-display text-sky-400">{toBanglaDigits(remaining.days)}</span>
                              <span className="text-[10px] text-gray-400 uppercase">দিন</span>
                            </div>
                            <div className="bg-slate-900/90 rounded p-2 border border-sky-900/50">
                              <span className="block text-lg sm:text-xl font-bold font-display text-sky-400">{toBanglaDigits(remaining.hours)}</span>
                              <span className="text-[10px] text-gray-400 uppercase">ঘণ্টা</span>
                            </div>
                            <div className="bg-slate-900/90 rounded p-2 border border-sky-900/50">
                              <span className="block text-lg sm:text-xl font-bold font-display text-sky-400">{toBanglaDigits(remaining.minutes)}</span>
                              <span className="text-[10px] text-gray-400 uppercase">মিনিট</span>
                            </div>
                            <div className="bg-slate-900/90 rounded p-2 border border-sky-900/50">
                              <span className="block text-lg sm:text-xl font-bold font-display text-sky-400">{toBanglaDigits(remaining.seconds)}</span>
                              <span className="text-[10px] text-gray-400 uppercase">সেকেন্ড</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* ম্যাচের বিবরণ */}
                    <p className="text-sm text-gray-200 mt-3 font-medium flex items-center flex-wrap gap-1 leading-relaxed">
                      আর্জেন্টিনার পরবর্তী ম্যাচ{" "}
                      <span className="text-white font-bold bg-sky-900/80 px-2 py-0.5 rounded-md border border-sky-600/30">
                        {nextArgentinaMatch.bstDate} ({nextArgentinaMatch.bstDay})
                      </span>{" "}
                      <span className="text-amber-400 font-bold bg-black/40 px-2 py-0.5 rounded-md border border-amber-400/20">
                        {nextArgentinaMatch.bstTime}
                      </span>{" "}
                      এ{" "}
                      <span className="text-white font-bold text-sky-200 underline decoration-sky-500/40">
                        {nextArgentinaMatch.team1En === 'Argentina' ? nextArgentinaMatch.team2 : nextArgentinaMatch.team1}
                      </span>{" "}
                      এর বিরুদ্ধে!
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-sky-200 bg-sky-950/40 px-3 py-2 rounded-lg border border-sky-900/30">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {nextArgentinaMatch.stadium}
                    </span>
                    <span className="font-semibold text-sky-400">
                      {nextArgentinaMatch.group}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-sky-950/40 p-6 rounded-xl border border-sky-900/30 text-center text-gray-400">
                  <p className="text-sm">এই সময়ের পর আর কোনো গ্রুপ পর্বের ম্যাচ শিডিউল পাওয়া যায়নি।</p>
                  <p className="text-xs text-sky-400/60 mt-1">নকআউট বা কোয়ার্টার ভাইবসের ম্যাচ শীঘ্রই ঘোষণা হবে!</p>
                </div>
              )}
            </motion.div>

            {/* ব্রাজিল ফ্যান জোন */}
            <motion.div 
              layout
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-950 via-emerald-950 to-slate-950 border-2 border-yellow-600/40 p-5 shadow-2xl group transition-all"
            >
              {/* ব্যানার ব্যাকগ্রাউন্ড ইফেক্ট */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -z-10 group-hover:bg-yellow-500/20 transition-all"></div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌟</span>
                  <h3 className="text-lg font-bold text-yellow-300 font-display flex items-center gap-1">
                    ব্রাজিল ফ্যান জোন <span className="text-xs font-normal text-slate-400">(Brazil Fan Zone)</span>
                  </h3>
                </div>
                <span className="text-xs uppercase bg-yellow-500/20 text-yellow-100 font-bold px-2 py-0.5 rounded border border-yellow-400/30 tracking-wider">
                  সেলেসাও 🇧🇷
                </span>
              </div>

              {nextBrazilMatch ? (
                <div>
                  <div className="bg-yellow-950/50 p-4 rounded-xl border border-yellow-800/40 mb-4">
                    <div className="text-xs text-yellow-300/80 mb-2 font-medium flex items-center gap-1.5">
                      <Clock size={13} /> পরবর্তী ম্যাচ টাইমার (Countdown To Kickoff):
                    </div>
                    
                    {/* রিয়েল-টাইম লাইভ কাউন্টডাউন */}
                    <div className="grid grid-cols-4 gap-2 text-center text-white mb-2">
                      {(() => {
                        const remaining = calculateTimeRemaining(nextBrazilMatch.matchTimeUTC);
                        if (remaining.expired) {
                          return <div className="col-span-4 text-center py-1 font-semibold text-amber-400 animate-pulse text-sm">খেলোয়াড়রা এখন মাঠে! ম্যাচটি রানিং চলছে ⚽</div>;
                        }
                        return (
                          <>
                            <div className="bg-slate-900/90 rounded p-2 border border-yellow-900/50">
                              <span className="block text-lg sm:text-xl font-bold font-display text-yellow-400">{toBanglaDigits(remaining.days)}</span>
                              <span className="text-[10px] text-gray-400 uppercase">দিন</span>
                            </div>
                            <div className="bg-slate-900/90 rounded p-2 border border-yellow-900/50">
                              <span className="block text-lg sm:text-xl font-bold font-display text-yellow-400">{toBanglaDigits(remaining.hours)}</span>
                              <span className="text-[10px] text-gray-400 uppercase">ঘণ্টা</span>
                            </div>
                            <div className="bg-slate-900/90 rounded p-2 border border-yellow-900/50">
                              <span className="block text-lg sm:text-xl font-bold font-display text-yellow-400">{toBanglaDigits(remaining.minutes)}</span>
                              <span className="text-[10px] text-gray-400 uppercase">মিনিট</span>
                            </div>
                            <div className="bg-slate-900/90 rounded p-2 border border-yellow-900/50">
                              <span className="block text-lg sm:text-xl font-bold font-display text-amber-400">{toBanglaDigits(remaining.seconds)}</span>
                              <span className="text-[10px] text-gray-400 uppercase">সেকেন্ড</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* ম্যাচের বিবরণ */}
                    <p className="text-sm text-gray-200 mt-3 font-medium flex items-center flex-wrap gap-1 leading-relaxed">
                      ব্রাজিলের পরবর্তী ম্যাচ 
                      <span className="text-white font-bold bg-yellow-900/80 px-2 py-0.5 rounded-md border border-yellow-600/30">
                        {nextBrazilMatch.bstDate} ({nextBrazilMatch.bstDay})
                      </span> 
                      <span className="text-amber-400 font-bold bg-black/40 px-2 py-0.5 rounded-md border border-amber-400/20">
                        {nextBrazilMatch.bstTime}
                      </span> 
                      এ 
                      <span className="text-white font-bold text-yellow-200 underline decoration-yellow-500/40">
                        {nextBrazilMatch.team1En === 'Brazil' ? nextBrazilMatch.team2 : nextBrazilMatch.team1}
                      </span> 
                      এর বিরুদ্ধে!
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-yellow-200 bg-yellow-950/40 px-3 py-2 rounded-lg border border-yellow-900/30">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {nextBrazilMatch.stadium}
                    </span>
                    <span className="font-semibold text-yellow-400">
                      {nextBrazilMatch.group}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-950/40 p-6 rounded-xl border border-yellow-900/30 text-center text-gray-400">
                  <p className="text-sm">এই সময়ের পর আর কোনো গ্রুপ পর্বের ম্যাচ শিডিউল পাওয়া যায়নি।</p>
                  <p className="text-xs text-yellow-400/60 mt-1">নকআউট বা কোয়ার্টার ভাইবসের ম্যাচ শীঘ্রই ঘোষণা হবে!</p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            🔍 ৫. সার্চ ফিল্টার এবং কুঁইক প্রোগ্রেস ট্যাব (Search, Filter and Category Select Tabs)
            ========================================================================= */}
        <section className="bg-[#031d11] rounded-2xl border border-emerald-800/80 p-5 mb-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            
            {/* সার্চ বক্স */}
            <div className="md:col-span-5 relative">
              <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1.5 ml-1 flex items-center gap-1">
                <Search size={12} /> দেশ বা স্টেডিয়াম অনুসন্ধান:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="যেমন: Argentina, Brazil, Fra, জার্মানি..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 text-white placeholder-white/30 py-2.5 pl-10 pr-4 rounded-xl border border-emerald-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400 transition"
                />
                <Search className="absolute left-3 top-3.5 text-emerald-600" size={16} />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3 text-xs bg-white/10 hover:bg-white/20 font-bold px-1.5 py-0.5 rounded text-white cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* দেশ সি�            <button
              onClick={() => setShowVisualBanners(!showVisualBanners)}
              className="px-3 py-1.5 rounded bg-[#031d11] hover:bg-emerald-900/40 border border-emerald-800/80 text-white font-medium flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <ImageIcon size={13} /> 
              {showVisualBanners ? 'পিকচার ব্যানার হাইড করুন' : 'পিকচার ব্যানার শো করুন'}
            </button>
          </div>
        </section>    className="px-3 py-1.5 rounded bg-[#031d11] hover:bg-emerald-900/40 border border-emerald-800/80 text-white font-medium flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <ImageIcon size={13} /> 
              {showVisualBanners ? 'পিকচার ব্যানার হাইড করুন' : 'পিকচার ব্যানার শো করুন'}
            </button>
          </div>
        </section>�� ব্যানার শো করুন'}
            </button>
          </div>
        </section>text-emerald-400 mb-1.5 ml-1">
                দেশ নির্বাচন (Dropdown Select):
              </label>
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-[#031d11] text-white py-2.5 px-3 rounded-xl border border-emerald-800/80 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition cursor-pointer appearance-none"
                >
                  <option value="All">🏆 সকল দেশের ম্যাচ (All Countries)</option>
                  <option value="Argentina">🇦🇷 আর্জেন্টিনা (Argentina)</option>
                  <option value="Brazil">🇧🇷 ব্রাজিল (Brazil)</option>
                  <option value="Germany">🇩🇪 জার্মানি (Germany)</option>
                  <option value="France">🇫🇷 ফ্রান্স (France)</option>
                  <option value="Portugal">🇵🇹 পর্তুগাল (Portugal)</option>
                  <option value="Spain">🇪🇦 স্পেন (Spain)</option>
                  <option value="England">🏴󠁧󠁢󠁥󠁮󠁧󠁿 ইংল্যান্ড (England)</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-emerald-600 pointer-events-none" size={16} />
              </div>
            </div>

            {/* কুইক ফিল্টার বাটন ট্যাব */}
            <div className="md:col-span-4 self-end">
              <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1.5 ml-1">
                কুইক ফিল্টারিং ক্যাটগরি:
              </span>
              <div className="flex bg-[#031d11] p-1 rounded-xl border border-emerald-800/80 gap-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 text-center py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'all' 
                      ? 'bg-amber-500 text-black font-bold' 
                      : 'text-emerald-400 hover:text-white hover:bg-emerald-900/30'
                  }`}
                >
                  সব ম্যাচ
                </button>
                <button
                  onClick={() => setActiveTab('today')}
                  className={`flex-1 text-center py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 ${
                    activeTab === 'today' 
                      ? 'bg-amber-505 bg-amber-500 text-black font-bold' 
                      : 'text-emerald-400 hover:text-white hover:bg-emerald-900/30'
                  }`}
                  title="আজকের সিমুলেটেড তারিখ অনুযায়ী খেলা ফিল্টার"
                >
                  <Calendar size={12} /> আজকের খেলা
                </button>
                <button
                  onClick={() => setActiveTab('favs')}
                  className={`flex-1 text-center py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'favs' 
                      ? 'bg-amber-500 text-black font-bold' 
                      : 'text-emerald-400 hover:text-white hover:bg-emerald-900/30'
                  }`}
                >
                  ⭐ ARG ও BRA
                </button>
                <button
                  onClick={() => setActiveTab('group')}
                  className={`flex-1 text-center py-1.5 px-3 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'group' 
                      ? 'bg-amber-500 text-black font-bold' 
                      : 'text-emerald-400 hover:text-white hover:bg-emerald-900/30'
                  }`}
                >
                  গ্রুপ পর্ব
                </button>
              </div>
            </div>

          </div>

          {/* অপশনাল: ম্যানুয়াল পিকচার আপডেট উইজেট টগল */}
          <div className="mt-4 pt-3 border-t border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-400">
            <p className="flex items-center gap-1">
              <Sparkles className="text-amber-400 text-xs" size={13} />
              প্রতিটি ম্যাচের সাথে ছবি কার্ড এনাবল বা ডিজেবল করা যাবে।
            </p>
            <button
              onClick={() => setShowVisualBanners(!showVisualBanners)}
              className="px-3 py-1.5 rounded bg-[#031d11] hover:bg-emerald-900/40 border border-emerald-800/80 text-white font-medium flex items-center gap-1.5 transition active:scale-95"
            >
              <ImageIcon size={13} /> 
              {showVisualBanners ? 'পিকচার ব্যানার হাইড করুন' : 'পিকচার ব্যানার শো করুন'}
            </button>
          </div>
        </section>

        {/* =========================================================================
            ⚽ ৪ ও ৫. প্রোগ্রেসিভ ম্যাচ শিডিউল কার্ডস গ্রিড (Match Cards Layout)
            ========================================================================= */}
        <section>
          

          {filteredMatches.length === 0 ? (
            <div className="bg-[#032115] text-center p-12 rounded-2xl border border-emerald-800/40 max-w-lg mx-auto">
              <div className="text-4xl mb-3">🔍</div>
              <h4 className="text-lg font-bold text-white mb-1">কোনো ম্যাচ পাওয়া যায়নি!</h4>
              <p className="text-sm text-gray-400">
                আপনার অনুসন্ধানের মান পরিবর্তন করে পুনরায় চেষ্টা করুন। ফিল্টারে "আজকের খেলা" থাকলে ওপরের ডেট সিমুলেটর পরিবর্তন করতে পারেন।
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCountry('All');
                  setActiveTab('all');
                }}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition"
              >
                রিসেট অল ফিল্টার্স
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredMatches.map((match) => {
                  // চেক করা ব্যবহারকারী ইতিমধ্যে এই ম্যাচে ভোট দিয়েছে কিনা
                  const hasVoted = !!userVotes[match.id];
                  const chosenVote = userVotes[match.id];
                  
                  // রিয়েল-টাইম ভোট হিসাব ( seeded + user click)
                  const v1Added = chosenVote?.userAddedVote1 || 0;
                  const v2Added = chosenVote?.userAddedVote2 || 0;
                  const totalVotes = match.seedVotes1 + match.seedVotes2 + v1Added + v2Added;
                  
                  // নতুন রিয়েল-টাইম পার্সেন্টেজ হিসাব
                  const p1 = Math.round(((match.seedVotes1 + v1Added) / totalVotes) * 105);
                  const p2 = 100 - p1;

                  // ফিডব্যাক মেসেজ রিভলভার
                  const activeFeedback = votingFeedback[match.id];

                  return (
                    <motion.div
                      layout
                      key={match.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-b from-[#052b19]/90 to-[#021f11] rounded-2xl border border-emerald-800/80 shadow-xl overflow-hidden hover:border-emerald-700 transition duration-300 flex flex-col"
                    >
                      
                      {/* =========================================================================
                          📸 কাস্টম ছবি ফিচার ব্যানার (Manual Picture Update Option)
                          ========================================================================= */}
                      {/* কোড মন্তব্য গাইড: 
                          আপনি যদি ম্যাচ কার্ডের ওপরে স্পেশাল ফুটবল খেলা বা স্টেডিয়ামের ছবি দেখাতে চান, 
                          তবে /src/data.ts ফাইল খুলে কাঙ্ক্ষিত ম্যাচের image: "" এর ভেতর আপনার ছবির URL বসিয়ে দিন। 
                          যদি ইমেজ থাকে, তবে তা ওপরে সুন্দরভাবে লোড হবে। খালি থাকলে ব্যানার পার্টটি অটোমেটিকলি 
                          একটি মিনিমাল আর্ট লাউভে কনভার্ট হয়ে যাবে যেন ইউজার এক্সপেরিয়েন্স প্রিমিয়াম থাকে।
                      */}
                      {showVisualBanners && (
                        <div className="relative h-40 w-full overflow-hidden bg-cover bg-center">
                          {match.image ? (
                            <img 
                              src={match.image} 
                              alt={`${match.team1} বনাম ${match.team2}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                          ) : (
                            // স্বয়ংক্রিয় প্রিমিয়াম ডার্ক গ্রিন ফুটবল পিচ রিপ্রেজেন্টেশন লাউভ ডিজাইন
                            <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-teal-950 flex items-center justify-center relative">
                              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_2px,transparent_2px)] bg-[size:16px_16px]"></div>
                              {/* ফুটবল লন লাইন */}
                              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-emerald-500/30"></div>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-emerald-500/35"></div>
                              
                              <div className="text-center z-10 px-4">
                                <span className="inline-block px-3 py-1 bg-black/40 text-[10px] text-amber-300 font-bold tracking-widest rounded-full uppercase border border-amber-500/25">
                                  {match.group} • BST SCHEDULE
                                </span>
                                <h4 className="text-white text-[11px] font-semibold mt-1 flex items-center justify-center gap-1">
                                  <span>{match.team1Flag} {match.team1}</span>
                                  <span className="text-amber-400">VS</span>
                                  <span>{match.team2Flag} {match.team2}</span>
                                </h4>
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-3 left-3 bg-black/75 px-3 py-1 rounded-md border border-emerald-700/60 text-[11px] font-bold text-emerald-400 flex items-center gap-1 z-10">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                            বাংলাদেশ সময় (BST)
                          </div>
                        </div>
                      )}

                      {/* কার্ড কন্টেন্ট */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        
                        {/* ১. দেশের নাম ও পতাকার রেস্পন্সিভ প্রিমিয়াম কার্ড লেআউট */}
                        <div className="flex items-center justify-between gap-2 mb-4 py-2 border-b border-emerald-900/30">
                          
                          {/* দেশ ১ (বামে) */}
                          <div className="flex-1 flex flex-col items-center text-center">
                            <span className="text-4xl mb-1 filter drop-shadow" role="img" aria-label={match.team1}>
                              {match.team1Flag}
                            </span>
                            <span className="text-base font-bold text-white tracking-wide">{match.team1}</span>
                            <span className="text-[11px] text-slate-400 font-mono font-bold">{match.team1Code}</span>
                          </div>

                          {/* মাঝে বড় করে VS */}
                          <div className="px-4 text-center">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 border-2 border-amber-400/50 flex items-center justify-center select-none shadow-inner">
                              <span className="text-amber-400 font-sans font-bold text-sm tracking-tighter">VS</span>
                            </div>
                          </div>

                          {/* দেশ ২ (ডানে) */}
                          <div className="flex-1 flex flex-col items-center text-center">
                            <span className="text-4xl mb-1 filter drop-shadow" role="img" aria-label={match.team2}>
                              {match.team2Flag}
                            </span>
                            <span className="text-base font-bold text-white tracking-wide">{match.team2}</span>
                            <span className="text-[11px] text-slate-400 font-mono font-bold">{match.team2Code}</span>
                          </div>

                        </div>

                        {/* ২. টাইমজোন এবং ভেন্যু ডিটেইলস (BD Time & Stadium) */}
                        <div className="bg-[#031e12] p-3 rounded-xl border border-emerald-950/60 mb-5 text-[12px] space-y-2">
                          <div className="flex items-center justify-between text-gray-300">
                            <span className="flex items-center gap-1 text-amber-400 font-semibold">
                              <Calendar size={13} /> {match.bstDate} ({match.bstDay})
                            </span>
                            <span className="bg-emerald-950 px-2 py-0.5 rounded text-[11px] border border-emerald-900/40 text-emerald-400 font-bold uppercase tracking-wider">
                              {match.group}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-gray-200">
                            <Clock size={13} className="text-emerald-500" />
                            <span>ম্যাচ শুরু: <strong className="text-white bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-800/40">{match.bstTime}</strong> (যেমন মাঝরাত বা ভোরে)</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-300 pt-1.5 border-t border-emerald-950/30">
                            <MapPin size={13} className="text-red-400 shrink-0" />
                            <span className="truncate" title={match.stadium}>ভেন্যু: <strong>{match.stadium}</strong></span>
                          </div>
                        </div>

                        {/* =========================================================================
                            ⚽ ৬. "কে জিতবে?" লোকাল স্টোরেজ পোল ট্রিক (Interactive Voting Section)
                            ========================================================================= */}
                        <div className="border-t border-emerald-900/50 pt-4 mt-auto">
                          
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                              <Flame size={12} className="text-amber-500" /> কে জিতবে বলে মনে করেন? (Who will win?)
                            </p>
                            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded font-bold text-gray-400">
                              ভোট: {toBanglaDigits(totalVotes.toLocaleString())}
                            </span>
                          </div>

                          {/* ভোট দিন বাটন্স (যদি ইতিমধ্যে ভোট না দিয়ে থাকে) */}
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <button
                              disabled={hasVoted}
                              onClick={() => handleVote(match.id, 'team1', match)}
                              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all outline-none ${
                                hasVoted 
                                  ? (chosenVote?.votedFor === 'team1' 
                                      ? 'bg-sky-500/10 text-sky-400 border border-sky-400/40' 
                                      : 'bg-emerald-950/30 text-gray-500 border border-emerald-900/20 cursor-not-allowed')
                                  : 'bg-emerald-900/80 hover:bg-sky-900/60 text-white border border-emerald-800 hover:border-sky-500 cursor-pointer active:scale-95'
                              }`}
                            >
                              <span>{match.team1Flag} {match.team1}</span>
                              <ThumbsUp size={12} />
                            </button>

                            <button
                              disabled={hasVoted}
                              onClick={() => handleVote(match.id, 'team2', match)}
                              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all outline-none ${
                                hasVoted 
                                  ? (chosenVote?.votedFor === 'team2' 
                                      ? 'bg-sky-500/10 text-sky-400 border border-sky-400/40' 
                                      : 'bg-emerald-950/30 text-gray-500 border border-emerald-900/20 cursor-not-allowed')
                                  : 'bg-emerald-900/80 hover:bg-sky-900/60 text-white border border-emerald-800 hover:border-sky-500 cursor-pointer active:scale-95'
                              }`}
                            >
                              <span>{match.team2Flag} {match.team2}</span>
                              <ThumbsUp size={12} />
                            </button>
                          </div>

                          {/* ৭. রঙিন ও মোটা প্রোগ্রেস বার (Bold eye-catching design) */}
                          <div className="space-y-1">
                            <div className="w-full bg-[#031d11] h-4 rounded-full overflow-hidden flex border border-emerald-900/50">
                              <motion.div
                                initial={{ width: '50%' }}
                                animate={{ width: `${p1}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full flex items-center pl-2 text-[9px] font-extrabold text-black"
                              >
                                {p1}%
                              </motion.div>
                              <motion.div
                                initial={{ width: '50%' }}
                                animate={{ width: `${p2}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className="bg-gradient-to-r from-amber-400 to-yellow-500 h-full flex items-center justify-end pr-2 text-[9px] font-extrabold text-black"
                              >
                                {p2}%
                              </motion.div>
                            </div>

                            {/* বার-লেবেল */}
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                              <span>{match.team1}: {toBanglaDigits(p1)}%</span>
                              <span>{match.team2}: {toBanglaDigits(p2)}%</span>
                            </div>
                          </div>

                          {/* ৮. কাস্টম উইনার হাসিখুশি বাংলা মেসেজ (Personalized team responses) */}
                          <AnimatePresence>
                            {(hasVoted || activeFeedback) && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 p-2.5 rounded-lg bg-emerald-950 border border-emerald-800/40 text-[11px] text-amber-300 leading-relaxed font-medium flex items-start gap-1.5"
                              >
                                <span className="text-emerald-400 shrink-0">✨</span>
                                <p>
                                  {activeFeedback || getBengaliFeedbackMessage(
                                    chosenVote?.votedFor === 'team1' ? match.team1Code : match.team2Code,
                                    chosenVote?.votedFor === 'team1' ? match.team1 : match.team2
                                  )}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>












        {/* =========================================================================
          📸 বড় ফ্রেমের কাস্টম ছবি সেকশন (Big Image Frame)
          ========================================================================= */}
        <div className="mt-10 w-full bg-slate-900/40 border border-emerald-800/30 rounded-2xl p-4 shadow-xl">
  
        {/* ওপরে জাস্ট ক্লিন "Group" লেখা বা ট্যাগ */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-sm font-bold tracking-widest text-slate-300 uppercase font-display">
            Group Matches & Features
          </span>
        </div>

        {/* বড় ফ্রেম (Big Frame) */}
        <div className="w-full h-[350px] md:h-[550px] rounded-xl overflow-hidden border border-emerald-700/20 shadow-inner relative group">
          <img 
            src="/pictures/bb.webp"  // 👈 public/Pictures/ ফোল্ডারে থাকা তোমার ছবির নাম
            alt="FIFA Big Frame Banner" 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
            onError={(e) => {
              // ছবি কোনো কারণে মিসিং হলে ব্যাকআপ হিসেবে একটা সুন্দর ডার্ক স্টেডিয়ামের ছবি দেখাবে
              e.currentTarget.src = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80";
            }}
          />
    
          {/* ইমেজের ওপর হালকা প্রিমিয়াম শ্যাডো ইফেক্ট */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none"></div>
        </div>

      </div>

      

        
        

      </main>




      <div className="mt-10 w-full bg-slate-900/40 border border-emerald-800/30 rounded-2xl p-4 shadow-xl">
  
        {/* ওপরে জাস্ট ক্লিন "Group" লেখা বা ট্যাগ */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-sm font-bold tracking-widest text-slate-300 uppercase font-display">
            Group 
          </span>
        </div>

        {/* বড় ফ্রেম (Big Frame) */}
        <div className="w-full h-[350px] md:h-[550px] rounded-xl overflow-hidden border border-emerald-700/20 shadow-inner relative group">
          <img 
            src="/pictures/aa.jpg"  // 👈 public/Pictures/ ফোল্ডারে থাকা তোমার ছবির নাম
            alt="FIFA Big Frame Banner" 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
            onError={(e) => {
              // ছবি কোনো কারণে মিসিং হলে ব্যাকআপ হিসেবে একটা সুন্দর ডার্ক স্টেডিয়ামের ছবি দেখাবে
              e.currentTarget.src = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80";
            }}
          />
    
          {/* ইমেজের ওপর হালকা প্রিমিয়াম শ্যাডো ইফেক্ট */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none"></div>
        </div>

      </div>
      



      {/* =========================================================================
          ✍️ ফুটার ক্রেডিট ও লিঙ্কডইন লিঙ্ক (Footer section with requested link and design)
          ========================================================================= */}
      <footer className="mt-20 border-t border-emerald-900/60 bg-emerald-950/40 py-10 text-center relative overflow-hidden">
        
        <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%) pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 z-10 relative">
          <p className="text-gray-400 text-sm mb-3">
            ২০২৬ ফিফা বিশ্বকাপ ফুটবল টুর্নামেন্টকে সামনে রেখে এই শিডিউলটি তৈরি করা হয়েছে। 
          </p>
          
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>

          <div className="text-emerald-400 font-mono text-sm inline-flex items-center gap-2 bg-emerald-950/80 px-4 py-2 rounded-full border border-emerald-800/50">
            <span>Developed by:</span> 
            <a 
              href="https://www.linkedin.com/in/g-m-biggan-371956305/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold hover:underline transition-all flex items-center gap-1 inline-flex hover:scale-105 active:scale-95"
            >
              G. M Biggan <ExternalLink size={14} className="inline" />
            </a>
          </div>

          <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest leading-relaxed">
            All Match Dates Oriented in Dhaka Time Local (BST timezone) • © 2026 World Cup Fan Club • Built on Real-time state
          </p>
        </div>
      </footer>

    </div>
  );
}
