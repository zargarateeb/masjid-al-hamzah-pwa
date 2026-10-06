export interface Dua {
  id: number;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  english: string;
  reference?: string;
}

export const DUA_CATEGORIES = [
  'Morning & Evening',
  'Eating & Drinking',
  'Sleeping & Waking',
  'Travel',
  'Home & Masjid',
  'Protection',
  'Forgiveness',
  'Parents & Family',
  'Anxiety & Sadness',
  'General',
] as const;

export const DUAS: Dua[] = [
  // ── Morning & Evening ──────────────────────────────
  { id: 1, category: 'Morning & Evening', title: 'Morning Remembrance', arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', transliteration: 'Asbahna wa asbahal-mulku lillah', english: 'We have entered the morning and the dominion belongs to Allah.', reference: 'Muslim' },
  { id: 2, category: 'Morning & Evening', title: 'Evening Remembrance', arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', transliteration: 'Amsayna wa amsal-mulku lillah', english: 'We have entered the evening and the dominion belongs to Allah.', reference: 'Muslim' },
  { id: 3, category: 'Morning & Evening', title: 'By Allah\'s Name', arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ', transliteration: 'Bismillahil-ladhi la yadurru ma\'asmihi shay\'un', english: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm.', reference: 'Abu Dawud' },
  { id: 4, category: 'Morning & Evening', title: 'Satisfied with Allah', arabic: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا', transliteration: 'Raditu billahi Rabban wa bil-Islami dinan', english: 'I am pleased with Allah as my Lord and Islam as my religion.', reference: 'Abu Dawud' },
  { id: 5, category: 'Morning & Evening', title: 'Glorify Allah 100x', arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', transliteration: 'SubhanAllahi wa bihamdihi', english: 'Glory and praise be to Allah.', reference: 'Muslim' },

  // ── Eating & Drinking ──────────────────────────────
  { id: 6, category: 'Eating & Drinking', title: 'Before Eating', arabic: 'بِسْمِ اللَّهِ', transliteration: 'Bismillah', english: 'In the name of Allah.', reference: 'Abu Dawud' },
  { id: 7, category: 'Eating & Drinking', title: 'If Forgot Before Eating', arabic: 'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ', transliteration: 'Bismillahi awwalahu wa akhirahu', english: 'In the name of Allah at the beginning and at the end.', reference: 'Abu Dawud' },
  { id: 8, category: 'Eating & Drinking', title: 'After Eating', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا', transliteration: 'Alhamdulillahil-ladhi at\'amana wa saqana', english: 'All praise to Allah who fed us and gave us drink.', reference: 'Abu Dawud' },
  { id: 9, category: 'Eating & Drinking', title: 'After Drinking Milk', arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ', transliteration: 'Allahumma barik lana fihi wa zidna minhu', english: 'O Allah, bless it for us and give us more of it.', reference: 'Tirmidhi' },
  { id: 10, category: 'Eating & Drinking', title: 'Guest\'s Dua for Host', arabic: 'اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ', transliteration: 'Allahumma barik lahum fima razaqtahum', english: 'O Allah, bless them in what You have provided.', reference: 'Muslim' },

  // ── Sleeping & Waking ──────────────────────────────
  { id: 11, category: 'Sleeping & Waking', title: 'Before Sleeping', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', transliteration: 'Bismika Allahumma amutu wa ahya', english: 'In Your name, O Allah, I die and I live.', reference: 'Bukhari' },
  { id: 12, category: 'Sleeping & Waking', title: 'Upon Waking', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا', transliteration: 'Alhamdulillahil-ladhi ahyana ba\'da ma amatana', english: 'All praise to Allah who gave us life after death.', reference: 'Bukhari' },
  { id: 13, category: 'Sleeping & Waking', title: 'Ayatul Kursi Before Sleep', arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum', english: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer.', reference: 'Bukhari' },
  { id: 14, category: 'Sleeping & Waking', title: 'Last Two Verses of Baqarah', arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ', transliteration: 'Amanar-Rasulu bima unzila ilayhi mir-Rabbihi', english: 'The Messenger has believed in what was revealed to him from his Lord.', reference: 'Bukhari' },
  { id: 15, category: 'Sleeping & Waking', title: 'If You Wake at Night', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', transliteration: 'La ilaha illallahu wahdahu la sharika lah', english: 'There is no god but Allah alone, without any partner.', reference: 'Bukhari' },

  // ── Travel ─────────────────────────────────────────
  { id: 16, category: 'Travel', title: 'Before Travel', arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا', transliteration: 'Subhanal-ladhi sakhkhara lana hadha', english: 'Glory to Him who has subjected this to us.', reference: 'Muslim' },
  { id: 17, category: 'Travel', title: 'Setting Out', arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ', transliteration: 'Bismillah, tawakkaltu \'ala Allah', english: 'In the name of Allah, I place my trust in Allah.', reference: 'Abu Dawud' },
  { id: 18, category: 'Travel', title: 'Entering a Town', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا', transliteration: 'Allahumma inni as\'aluka khayraha', english: 'O Allah, I ask You for its goodness.', reference: 'Muslim' },
  { id: 19, category: 'Travel', title: 'Returning from Travel', arabic: 'آيِبُونَ تَائِبُونَ عَابِدُونَ', transliteration: 'Ayyibuna ta\'ibuna \'abiduna', english: 'We return, repentant, worshipping.', reference: 'Muslim' },
  { id: 20, category: 'Travel', title: 'Riding/Vehicle', arabic: 'سُبْحَانَكَ إِنِّي ظَلَمْتُ نَفْسِي', transliteration: 'Subhanaka inni zalamtu nafsi', english: 'Glory to You, I have wronged myself.', reference: 'Muslim' },

  // ── Home & Masjid ──────────────────────────────────
  { id: 21, category: 'Home & Masjid', title: 'Entering Home', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ', transliteration: 'Allahumma inni as\'aluka khayral-mawlaj', english: 'O Allah, I ask You for the best entering.', reference: 'Abu Dawud' },
  { id: 22, category: 'Home & Masjid', title: 'Leaving Home', arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ', transliteration: 'Bismillah, tawakkaltu \'ala Allah', english: 'In the name of Allah, I place my trust in Allah.', reference: 'Abu Dawud' },
  { id: 23, category: 'Home & Masjid', title: 'Entering Masjid', arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', transliteration: 'Allahummaftah li abwaba rahmatik', english: 'O Allah, open the gates of Your mercy for me.', reference: 'Muslim' },
  { id: 24, category: 'Home & Masjid', title: 'Leaving Masjid', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', transliteration: 'Allahumma inni as\'aluka min fadlik', english: 'O Allah, I ask You from Your bounty.', reference: 'Muslim' },
  { id: 25, category: 'Home & Masjid', title: 'Entering Toilet', arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', transliteration: 'Allahumma inni a\'udhu bika minal-khubuthi wal-khaba\'ith', english: 'O Allah, I seek refuge from male and female devils.', reference: 'Bukhari' },

  // ── Protection ─────────────────────────────────────
  { id: 26, category: 'Protection', title: 'Seek Refuge in Allah\'s Words', arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ', transliteration: 'A\'udhu bikalimatillahit-tammati', english: 'I seek refuge in the perfect words of Allah.', reference: 'Muslim' },
  { id: 27, category: 'Protection', title: 'In the Name of Allah (3x)', arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ', transliteration: 'Bismillahil-ladhi la yadurru', english: 'In the name of Allah, with whose name nothing can harm.', reference: 'Tirmidhi' },
  { id: 28, category: 'Protection', title: 'A\'udhu Billah', arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', transliteration: 'A\'udhu billahi minash-shaytanir-rajim', english: 'I seek refuge in Allah from the accursed devil.', reference: 'Bukhari' },
  { id: 29, category: 'Protection', title: 'For Protection of Children', arabic: 'أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ', transliteration: 'U\'idhukuma bikalimatillahit-tammah', english: 'I seek refuge for you both in the perfect words of Allah.', reference: 'Bukhari' },
  { id: 30, category: 'Protection', title: 'When in Danger', arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', transliteration: 'Hasbunallahu wa ni\'mal-wakeel', english: 'Allah is sufficient for us and He is the best disposer of affairs.', reference: 'Qur\'an 3:173' },

  // ── Forgiveness ────────────────────────────────────
  { id: 31, category: 'Forgiveness', title: 'Sayyidul Istighfar', arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ', transliteration: 'Allahumma Anta Rabbi la ilaha illa Anta', english: 'O Allah, You are my Lord, there is no god but You.', reference: 'Bukhari' },
  { id: 32, category: 'Forgiveness', title: 'Simple Istighfar', arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', english: 'I seek Allah\'s forgiveness.', reference: 'Muslim' },
  { id: 33, category: 'Forgiveness', title: 'Astaghfirullah wa Atubu', arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', transliteration: 'Astaghfirullaha wa atubu ilayh', english: 'I seek Allah\'s forgiveness and turn to Him in repentance.', reference: 'Bukhari' },
  { id: 34, category: 'Forgiveness', title: 'Allahumma innaka Afuwwun', arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ', transliteration: 'Allahumma innaka \'Afuwwun tuhibbul-\'afwa', english: 'O Allah, You are Forgiving and love to forgive.', reference: 'Tirmidhi' },
  { id: 35, category: 'Forgiveness', title: 'Rabbana Zalamna', arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا', transliteration: 'Rabbana zalamna anfusana', english: 'Our Lord, we have wronged ourselves.', reference: 'Qur\'an 7:23' },

  // ── Parents & Family ───────────────────────────────
  { id: 36, category: 'Parents & Family', title: 'For Parents', arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', transliteration: 'Rabbir-hamhuma kama rabbayani saghira', english: 'My Lord, have mercy on them as they raised me when I was small.', reference: 'Qur\'an 17:24' },
  { id: 37, category: 'Parents & Family', title: 'For Righteous Family', arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ', transliteration: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a\'yun', english: 'Our Lord, grant us comfort in our spouses and offspring.', reference: 'Qur\'an 25:74' },
  { id: 38, category: 'Parents & Family', title: 'For Children', arabic: 'رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ', transliteration: 'Rabbi hab li minas-salihin', english: 'My Lord, grant me from among the righteous.', reference: 'Qur\'an 37:100' },
  { id: 39, category: 'Parents & Family', title: 'For Spouse', arabic: 'اللَّهُمَّ بَارِكْ لِي فِيهِ', transliteration: 'Allahumma barik li fihi', english: 'O Allah, bless him/her for me.', reference: 'General' },
  { id: 40, category: 'Parents & Family', title: 'For Family Protection', arabic: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ', transliteration: 'Rabbanaghfir li wa liwalidayya wa lil-mu\'minin', english: 'Our Lord, forgive me, my parents, and all believers.', reference: 'Qur\'an 14:41' },

  // ── Anxiety & Sadness ──────────────────────────────
  { id: 41, category: 'Anxiety & Sadness', title: 'For Anxiety', arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ', transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan', english: 'O Allah, I seek refuge in You from worry and grief.', reference: 'Bukhari' },
  { id: 42, category: 'Anxiety & Sadness', title: 'Dua of Distress', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ', transliteration: 'La ilaha illallahul-\'Azeemul-Haleem', english: 'There is no god but Allah, the Mighty, the Forbearing.', reference: 'Bukhari' },
  { id: 43, category: 'Anxiety & Sadness', title: 'Dua of Yunus (AS)', arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', transliteration: 'La ilaha illa Anta subhanaka inni kuntu minaz-zalimin', english: 'There is no god but You, glory to You, I was among the wrongdoers.', reference: 'Qur\'an 21:87' },
  { id: 44, category: 'Anxiety & Sadness', title: 'For Relief', arabic: 'حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ', transliteration: 'Hasbiyallahu wa ni\'mal-wakeel', english: 'Allah is sufficient for me and He is the best disposer of affairs.', reference: 'Qur\'an 3:173' },
  { id: 45, category: 'Anxiety & Sadness', title: 'When Saddened', arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', transliteration: 'Inna lillahi wa inna ilayhi raji\'un', english: 'To Allah we belong and to Him we return.', reference: 'Qur\'an 2:156' },

  // ── General ────────────────────────────────────────
  { id: 46, category: 'General', title: 'Before Any Task', arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', transliteration: 'Bismillahir-Rahmanir-Rahim', english: 'In the name of Allah, the Most Compassionate, the Most Merciful.', reference: 'Qur\'an 1:1' },
  { id: 47, category: 'General', title: 'For Knowledge', arabic: 'رَبِّ زِدْنِي عِلْمًا', transliteration: 'Rabbi zidni \'ilma', english: 'My Lord, increase me in knowledge.', reference: 'Qur\'an 20:114' },
  { id: 48, category: 'General', title: 'For Goodness in Both Worlds', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', transliteration: 'Rabbana atina fid-dunya hasanah', english: 'Our Lord, give us good in this world and the next.', reference: 'Qur\'an 2:201' },
  { id: 49, category: 'General', title: 'For Steadfastness', arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا', transliteration: 'Rabbana la tuzigh qulubana', english: 'Our Lord, do not let our hearts deviate.', reference: 'Qur\'an 3:8' },
  { id: 50, category: 'General', title: 'For Acceptance', arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا', transliteration: 'Rabbana taqabbal minna', english: 'Our Lord, accept this from us.', reference: 'Qur\'an 2:127' },
    // ── Additional General & Specific ──────────────────
  { id: 51, category: 'General', title: 'For Forgiveness of All Believers', arabic: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا', transliteration: 'Rabbanaghfir lana wa li-ikhwanina', english: 'Our Lord, forgive us and our brothers and sisters in faith.', reference: 'Qur\'an 59:10' },
  { id: 52, category: 'General', title: 'Seek Allah\'s Help with Patience', arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا', transliteration: 'Rabbana afrigh \'alayna sabran', english: 'Our Lord, pour upon us patience.', reference: 'Qur\'an 2:250' },
  { id: 53, category: 'General', title: 'For Mercy', arabic: 'رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً', transliteration: 'Rabbana atina min ladunka rahmah', english: 'Our Lord, grant us mercy from Yourself.', reference: 'Qur\'an 18:10' },
  { id: 54, category: 'General', title: 'For Righteous Deeds', arabic: 'رَبَّنَا هَبْ لَنَا مِنْ لَّدُنكَ رَحْمَةً', transliteration: 'Rabbana hab lana min ladunka rahmah', english: 'Our Lord, grant us mercy from Yourself.', reference: 'Qur\'an 18:10' },
  { id: 55, category: 'General', title: 'For Guidance', arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', transliteration: 'Ihdinas-siratal-mustaqim', english: 'Guide us to the straight path.', reference: 'Qur\'an 1:6' },
  { id: 56, category: 'General', title: 'For Protection from Hellfire', arabic: 'رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ', transliteration: 'Rabbanasrif \'anna \'adhaba Jahannam', english: 'Our Lord, avert from us the punishment of Hell.', reference: 'Qur\'an 25:65' },
  { id: 57, category: 'General', title: 'For Patience & Victory', arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا', transliteration: 'Rabbana afrigh \'alayna sabran wa thabbit aqdamana', english: 'Our Lord, pour patience upon us and make our feet firm.', reference: 'Qur\'an 2:250' },
  { id: 58, category: 'General', title: 'For Good End', arabic: 'رَبَّنَا تَوَفَّنَا مُسْلِمِينَ', transliteration: 'Rabbana tawaffana muslimin', english: 'Our Lord, cause us to die as Muslims.', reference: 'Qur\'an 12:101' },
  { id: 59, category: 'General', title: 'For Unity', arabic: 'رَبَّنَا لَا تَجْعَلْ بَيْنَنَا غِلًّا', transliteration: 'Rabbana la taj\'al baynana ghillan', english: 'Our Lord, place no hatred between us.', reference: 'Qur\'an 59:10' },
  { id: 60, category: 'General', title: 'For Protection from Shirk', arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ', transliteration: 'Rabbi-j\'alni muqimas-salati', english: 'My Lord, make me an establisher of prayer.', reference: 'Qur\'an 14:40' },
  { id: 61, category: 'General', title: 'For a Good Death', arabic: 'رَبَّنَا اغْفِرْ لَنَا وَلِوَالِدَيْنَا', transliteration: 'Rabbanaghfir lana wa liwalidayna', english: 'Our Lord, forgive us and our parents.', reference: 'Qur\'an 14:41' },
  { id: 62, category: 'General', title: 'For Good Provision', arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ', transliteration: 'Allahummakfini bihalalika \'an haramik', english: 'O Allah, suffice me with Your lawful and protect me from the unlawful.', reference: 'Tirmidhi' },
  { id: 63, category: 'General', title: 'For Barakah in Provision', arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا', transliteration: 'Allahumma barik lana fima razaqtana', english: 'O Allah, bless us in what You have provided us.', reference: 'General' },
  { id: 64, category: 'General', title: 'For Debt Relief', arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ', transliteration: 'Allahummakfini bihalalik', english: 'O Allah, free me from debt.', reference: 'Tirmidhi' },
  { id: 65, category: 'General', title: 'Before Entering Market', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', transliteration: 'La ilaha illallahu wahdahu la sharika lah', english: 'There is no god but Allah alone, without any partner.', reference: 'Tirmidhi' },
  { id: 66, category: 'General', title: 'When It Rains', arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا', transliteration: 'Allahumma sayyiban nafi\'a', english: 'O Allah, make it a beneficial rain.', reference: 'Bukhari' },
  { id: 67, category: 'General', title: 'When Hearing Thunder', arabic: 'سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ', transliteration: 'Subhanal-ladhi yusabbihur-ra\'du bihamdihi', english: 'Glory to Him whom the thunder glorifies with praise.', reference: 'Malik' },
  { id: 68, category: 'General', title: 'When Seeing Moon', arabic: 'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ', transliteration: 'Allahumma ahillahu \'alayna bil-yumni wal-iman', english: 'O Allah, bring it upon us with blessings and faith.', reference: 'Tirmidhi' },
  { id: 69, category: 'General', title: 'For Wind', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا', transliteration: 'Allahumma inni as\'aluka khayraha', english: 'O Allah, I ask You for its good.', reference: 'Muslim' },
  { id: 70, category: 'General', title: 'When Sick', arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ', transliteration: 'As\'alullahal-\'Azeema Rabbal-\'Arshil-\'Azeem an yashfiyak', english: 'I ask Allah the Mighty, Lord of the Mighty Throne, to cure you.', reference: 'Abu Dawud' },
  { id: 71, category: 'General', title: 'For Healing', arabic: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَاسَ', transliteration: 'Allahumma Rabban-nasi adh-hibil-bas', english: 'O Allah, Lord of mankind, remove the affliction.', reference: 'Bukhari' },
  { id: 72, category: 'General', title: 'For Deceased', arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ', transliteration: 'Allahummaghfir lahu warhamhu', english: 'O Allah, forgive him and have mercy on him.', reference: 'Muslim' },
  { id: 73, category: 'General', title: 'Visiting Graves', arabic: 'السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ', transliteration: 'As-salamu \'alaykum ahlad-diyar', english: 'Peace be upon you, inhabitants of these graves.', reference: 'Muslim' },
  { id: 74, category: 'General', title: 'For Wedding', arabic: 'بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ', transliteration: 'Barakallahu laka wa baraka \'alayk', english: 'May Allah bless you and shower blessings upon you.', reference: 'Tirmidhi' },
  { id: 75, category: 'General', title: 'For New Parents', arabic: 'بَارَكَ اللَّهُ لَكَ فِي الْمَوْهُوبِ', transliteration: 'Barakallahu laka fil-mawhub', english: 'May Allah bless you in the gift given to you.', reference: 'General' },
  { id: 76, category: 'Protection', title: 'When Angry', arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', transliteration: 'A\'udhu billahi minash-shaytanir-rajim', english: 'I seek refuge in Allah from the accursed devil.', reference: 'Bukhari' },
  { id: 77, category: 'Protection', title: 'From Evil Eye', arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ كُلِّ شَيْطَانٍ', transliteration: 'A\'udhu bikalimatillahit-tammati min kulli shaytan', english: 'I seek refuge in Allah\'s perfect words from every devil.', reference: 'Muslim' },
  { id: 78, category: 'Protection', title: 'For Fear', arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ', transliteration: 'A\'udhu bikalimatillahit-tammat', english: 'I seek refuge in Allah\'s perfect words.', reference: 'Muslim' },
  { id: 79, category: 'Protection', title: 'From Enemy', arabic: 'اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ', transliteration: 'Allahumma inna naj\'aluka fi nuhurihim', english: 'O Allah, we place You before them.', reference: 'Abu Dawud' },
  { id: 80, category: 'Protection', title: 'From Evil Thoughts', arabic: 'رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ', transliteration: 'Rabbi a\'udhu bika min hamazatish-shayatin', english: 'My Lord, I seek refuge from the whispers of devils.', reference: 'Qur\'an 23:97' },
  { id: 81, category: 'Forgiveness', title: 'Seeking Forgiveness 100x', arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', transliteration: 'Astaghfirullaha wa atubu ilayh', english: 'I seek Allah\'s forgiveness and turn to Him in repentance.', reference: 'Muslim' },
  { id: 82, category: 'Forgiveness', title: 'Admitting Sins', arabic: 'رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي', transliteration: 'Rabbi inni zalamtu nafsi faghfir li', english: 'My Lord, I have wronged myself, so forgive me.', reference: 'Qur\'an 28:16' },
  { id: 83, category: 'Forgiveness', title: 'For All Sins', arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ', transliteration: 'Allahummaghfir li dhanbi kullahu', english: 'O Allah, forgive me all my sins.', reference: 'Muslim' },
  { id: 84, category: 'Forgiveness', title: 'Dua of Adam (AS)', arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا', transliteration: 'Rabbana zalamna anfusana wa il-lam taghfir lana', english: 'Our Lord, we have wronged ourselves; if You do not forgive us...', reference: 'Qur\'an 7:23' },
  { id: 85, category: 'Forgiveness', title: 'For Repentance', arabic: 'تُبْتُ إِلَى اللَّهِ', transliteration: 'Tubtu ilallah', english: 'I have repented to Allah.', reference: 'General' },
  { id: 86, category: 'Morning & Evening', title: 'Sayyidul Istighfar (Morning)', arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ خَلَقْتَنِي', transliteration: 'Allahumma Anta Rabbi la ilaha illa Anta khalaqtani', english: 'O Allah, You are my Lord, there is no god but You, You created me.', reference: 'Bukhari' },
  { id: 87, category: 'Morning & Evening', title: 'Glorify 100x Morning', arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', transliteration: 'SubhanAllahi wa bihamdihi', english: 'Glory and praise be to Allah.', reference: 'Muslim' },
  { id: 88, category: 'Morning & Evening', title: 'Seek Protection 3x', arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ', transliteration: 'Bismillahil-ladhi la yadurru ma\'asmihi shay\'', english: 'In the name of Allah, with whose name nothing can harm.', reference: 'Abu Dawud' },
  { id: 89, category: 'Morning & Evening', title: 'Upon Waking for Fajr', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا', transliteration: 'Alhamdulillahil-ladhi ahyana', english: 'All praise to Allah who gave us life.', reference: 'Bukhari' },
  { id: 90, category: 'Eating & Drinking', title: 'When Breaking Fast', arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ', transliteration: 'Dhahabaz-zama\'u wabtallatil-\'uruq', english: 'The thirst is gone, the veins are moistened.', reference: 'Abu Dawud' },
  { id: 91, category: 'Eating & Drinking', title: 'When Guest Finishes', arabic: 'أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ', transliteration: 'Aftara \'indakumus-sa\'imun', english: 'May those who fast break their fast at your home.', reference: 'Abu Dawud' },
  { id: 92, category: 'Eating & Drinking', title: 'For the Host', arabic: 'اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ', transliteration: 'Allahumma barik lahum fima razaqtahum', english: 'O Allah, bless them in what You provided them.', reference: 'Muslim' },
  { id: 93, category: 'Sleeping & Waking', title: 'Before Sleep Forgiveness', arabic: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', transliteration: 'Astaghfirullahal-ladhi la ilaha illa Huwal-Hayyul-Qayyum', english: 'I seek forgiveness from Allah, besides whom there is no god.', reference: 'Abu Dawud' },
  { id: 94, category: 'Sleeping & Waking', title: 'Sleeping on Right Side', arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي', transliteration: 'Bismika Rabbi wada\'tu janbi', english: 'In Your name, my Lord, I lay down my side.', reference: 'Bukhari' },
  { id: 95, category: 'Travel', title: 'For Transport', arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا', transliteration: 'Subhanal-ladhi sakhkhara lana hadha', english: 'Glory to Him who subjected this to us.', reference: 'Muslim' },
  { id: 96, category: 'Travel', title: 'Staying at a Place', arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ', transliteration: 'A\'udhu bikalimatillahit-tammat', english: 'I seek refuge in Allah\'s perfect words.', reference: 'Muslim' },
  { id: 97, category: 'Home & Masjid', title: 'When Leaving House', arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ', transliteration: 'Allahumma inni a\'udhu bika an adilla aw udall', english: 'O Allah, I seek refuge from going astray or being led astray.', reference: 'Abu Dawud' },
  { id: 98, category: 'Parents & Family', title: 'For Parents\' Forgiveness', arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ', transliteration: 'Rabbighfir li wa liwalidayya', english: 'My Lord, forgive me and my parents.', reference: 'Qur\'an 71:28' },
  { id: 99, category: 'Anxiety & Sadness', title: 'For Complete Relief', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى', transliteration: 'Allahumma inni as\'alukal-huda wat-tuqa wal-\'afafa wal-ghina', english: 'O Allah, I ask You for guidance, piety, chastity, and contentment.', reference: 'Muslim' },
  { id: 100, category: 'General', title: 'For the Best in Both Worlds', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanah', english: 'Our Lord, give us good in this world and good in the Hereafter.', reference: 'Qur\'an 2:201' },
  { id: 101, category: 'General', title: 'For Protection from Fire', arabic: 'رَبَّنَا اصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ', transliteration: 'Rabbanasrif \'anna \'adhaba Jahannam', english: 'Our Lord, avert from us the punishment of Hell.', reference: 'Qur\'an 25:65' },
  { id: 102, category: 'General', title: 'When Praising Allah', arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', transliteration: 'Alhamdulillahi Rabbil-\'alamin', english: 'All praise be to Allah, Lord of all worlds.', reference: 'Qur\'an 1:2' },
  { id: 103, category: 'General', title: 'Before Starting Anything', arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', transliteration: 'Bismillahir-Rahmanir-Rahim', english: 'In the name of Allah, the Most Compassionate, the Most Merciful.', reference: 'Qur\'an 1:1' },
  { id: 104, category: 'General', title: 'When Receiving Good News', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ', transliteration: 'Alhamdulillahil-ladhi bi ni\'matihi tatimmus-salihat', english: 'Praise be to Allah through whose blessing good things are completed.', reference: 'Ibn Majah' },
  { id: 105, category: 'General', title: 'For Shifa', arabic: 'اللَّهُمَّ اشْفِ عَبْدَكَ', transliteration: 'Allahumma-shfi \'abdak', english: 'O Allah, cure Your servant.', reference: 'Abu Dawud' },
];