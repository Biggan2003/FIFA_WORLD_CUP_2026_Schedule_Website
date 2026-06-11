export interface Match {
  id: string;
  team1: string; // e.g. 'আর্জেন্টিনা'
  team1En: string; // e.g. 'Argentina'
  team1Flag: string; // e.g. '🇦🇷'
  team1Code: string; // e.g. 'ARG'
  
  team2: string; // e.g. 'আলজেরিয়া'
  team2En: string; // e.g. 'Algeria'
  team2Flag: string; // e.g. '🇩🇿'
  team2Code: string; // e.g. 'ALG'
  
  // Real JS Date string for dynamic Javascript date filters
  // Since user's actual system date can change/advance, we compare this ISO string using new Date(m.matchTimeUTC)
  matchTimeUTC: string;
  
  // Bangladesh Standard Time string displayed beautifully to users
  bstDate: string; // e.g. '১৭ জুন, ২০২৬'
  bstDay: string; // e.g. 'বুধবার'
  bstTime: string; // e.g. 'সকাল ০৭:০০ AM'
  
  stadium: string; // e.g. 'মেটলাইফ স্টেডিয়াম, নিউ জার্সি'
  group: string; // e.g. 'গ্রুপ J' or 'রাউন্ড অফ ৩২'
  
  // Manual picture update prop (can be empty string or image path/URL)
  image: string; 
  
  // Seeded stable votes configuration
  seedVotes1: number;
  seedVotes2: number;
  seedPercent1: number; // e.g. 80
  seedPercent2: number; // e.g. 20
}

export interface UserVote {
  matchId: string;
  votedFor: 'team1' | 'team2';
  userAddedVote1: number; // 0 or 1
  userAddedVote2: number; // 0 or 1
}
