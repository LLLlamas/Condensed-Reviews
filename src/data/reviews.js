// Real review data scraped from r/BBallShoes (last 30 days as of 2026-04-13)

// Amazon affiliate URLs (tag: llamas02-20)
export const amazonLinks = {
  "Nike LeBron 21": "https://www.amazon.com/s?k=Nike+LeBron+21+basketball+shoe&tag=llamas02-20",
  "Nike LeBron 20": "https://www.amazon.com/s?k=Nike+LeBron+20+basketball+shoe&tag=llamas02-20",
  "Nike KD 14": "https://www.amazon.com/s?k=Nike+KD+14+basketball+shoe&tag=llamas02-20",
  "Nike Sabrina 2": "https://www.amazon.com/s?k=Nike+Sabrina+2+basketball+shoe&tag=llamas02-20",
  "Nike AE 1": "https://www.amazon.com/s?k=Nike+AE+1+Anthony+Edwards+basketball+shoe&tag=llamas02-20",
  "Nike Shai 001": "https://www.amazon.com/s?k=Nike+Shai+001+SGA+basketball+shoe&tag=llamas02-20",
  "Nike GT Cut 3": "https://www.amazon.com/s?k=Nike+GT+Cut+3+basketball+shoe&tag=llamas02-20",
  "Nike GT Cut 4": "https://www.amazon.com/s?k=Nike+GT+Cut+4+basketball+shoe&tag=llamas02-20",
  "Nike Ja 3": "https://www.amazon.com/s?k=Nike+Ja+3+basketball+shoe&tag=llamas02-20",
  "Nike Kobe 6 Protro": "https://www.amazon.com/s?k=Nike+Kobe+6+Protro+basketball+shoe&tag=llamas02-20",
  "Nike Kobe AD NXT FF": "https://www.amazon.com/s?k=Nike+Kobe+AD+NXT+FF+basketball+shoe&tag=llamas02-20",
  "Air Jordan 40": "https://www.amazon.com/s?k=Nike+Air+Jordan+40+basketball+shoe&tag=llamas02-20",
  "361 Joker 1 GT": "https://www.amazon.com/s?k=361+Degrees+Joker+1+GT+basketball+shoe&tag=llamas02-20",
  "361 Joker 2": "https://www.amazon.com/s?k=361+Degrees+Joker+2+basketball+shoe&tag=llamas02-20",
  "361 Joker 2 GT": "https://www.amazon.com/s?k=361+Degrees+Joker+2+GT+basketball+shoe&tag=llamas02-20",
  "361 Joker 2 Low": "https://www.amazon.com/s?k=361+Degrees+Joker+2+Low+basketball+shoe&tag=llamas02-20",
  "Li-Ning JB3": "https://www.amazon.com/s?k=Li-Ning+JB3+Jimmy+Butler+basketball+shoe&tag=llamas02-20",
  "Li-Ning Way of Wade 12": "https://www.amazon.com/s?k=Li-Ning+Way+of+Wade+12+basketball+shoe&tag=llamas02-20",
  "Li-Ning Gamma 1": "https://www.amazon.com/s?k=Li-Ning+Gamma+1+basketball+shoe&tag=llamas02-20",
  "Li-Ning Gamma 2": "https://www.amazon.com/s?k=Li-Ning+Gamma+2+basketball+shoe&tag=llamas02-20",
  "Li-Ning Liren 6v2": "https://www.amazon.com/s?k=Li-Ning+Liren+6v2+basketball+shoe&tag=llamas02-20",
  "Li-Ning Wade 808 3 Ultra v2": "https://www.amazon.com/s?k=Li-Ning+Wade+808+3+Ultra+v2+basketball+shoe&tag=llamas02-20",
  "ANTA Kai 3": "https://www.amazon.com/s?k=ANTA+Kai+3+basketball+shoe&tag=llamas02-20",
  "Adidas Don Issue 7": "https://www.amazon.com/s?k=Adidas+Don+Issue+7+basketball+shoe&tag=llamas02-20",
  "Adidas Harden 9": "https://www.amazon.com/s?k=Adidas+Harden+9+basketball+shoe&tag=llamas02-20",
  "Adidas Crazy Energy": "https://www.amazon.com/s?k=Adidas+Crazy+Energy+Plus+basketball+shoe&tag=llamas02-20",
  "SPO Game 1 High": "https://www.amazon.com/s?k=Serious+Player+Only+Game+1+High+basketball+shoe&tag=llamas02-20",
  "Li-Ning All City 14": "https://www.amazon.com/s?k=Li-Ning+All+City+14+basketball+shoe&tag=llamas02-20",
};

export function getAmazonUrl(shoeName) {
  return amazonLinks[shoeName] || `https://www.amazon.com/s?k=${encodeURIComponent(shoeName + ' basketball shoe')}&tag=llamas02-20`;
}

export const reviews = [
  // =====================================================
  // === NIKE ===
  // =====================================================

  // --- LeBron 21 ---
  {
    shoe: "Nike LeBron 21", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sfd8j4/lebron_21_performance_review/",
    author: "u/Bbakes_", date: "2026-04-08",
    summary: "TTS fit but painful break-in period — the hard plastic upper and razor tongue cause blisters early on. After breaking in with a swapped insole, comfort becomes amazing and court feel is excellent. Traction picks up dust easily and heel slippage is occasional. Best at a discount.",
    playstyle: "Quick Guard", courtType: "Indoor", sizingNote: "True to size", verdict: "Solid", wordCount: 439,
    fullText: "Background: I play organized pickup 3x a week. Play style is that of a quick guard. Things I look for in a shoe - comfort where I don't even think about what's on my feet when playing. Confidence in the traction with every cut. Review: Good looking shoe overall. Break in time was not good for these. The upper is a semi hard plastic material that took some serious playing time to break in. Lace irritation was pretty awful. BUT - after hours of breaking them in and swapping out the insole, comfort became amazing. Court feel is really good. The only issues I have with them are traction and heel slippage. Traction is pretty good overall but they pick up dust easily. Heel slippage can happen from time to time. I got these heavily discounted and for the price, they're a steal.",
    ratings: { cushioning: 8.5, traction: 7.5, support: 7.5, fit: 7.0, breathability: 5.5, courtFeel: 8.5, durability: 7.0, value: 8.5 }
  },

  // --- LeBron 20 ---
  {
    shoe: "Nike LeBron 20", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1shphbj/rate_the_rotation/",
    author: "u/Typical-Public4166", date: "2026-04-10",
    summary: "Exceptional traction (top 3 all-time) and elite bouncy cushioning with a 1:1 TTS fit. Heel doesn't lock down perfectly and on hard cuts the foot goes over the lateral flange. A phenomenal shoe if heel lockdown isn't a dealbreaker.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size", verdict: "Elite", wordCount: 1054,
    fullText: "Lebron 20: these are in my locker at the gym, but these are exceptional. Traction is top 3 all time imo, cushion is my third favorite all time, and fit is good. These fit 1:1, which is great for me, but the heel doesn't lock down well. The cushion is great, best bouncy cushion I have currently. On hard cuts/direction changes my foot goes over the flange.",
    ratings: { cushioning: 9.5, traction: 9.5, support: 7.0, fit: 8.0, breathability: 6.5, courtFeel: 8.0, durability: 8.0, value: 8.5 }
  },
  {
    shoe: "Nike LeBron 20", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sfcz3v/lebron_20_heel_slip/",
    author: "u/Shanlangmalakas", date: "2026-04-07",
    summary: "Calls it a 'goated shoe' but the heel slippage is real and persistent — ankle wraps, runner's knots, and double socks all failed to fix it. Despite that, loves the shoe overall. Ankle wraps cause overheating.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size", verdict: "Great (with caveats)", wordCount: 166,
    fullText: "This is my first time trying the lebron 20s and I must say this is goated shoes, just with a bit of inconveniences in heel slippage. I bought myself ankle wraps for extra padding but my feet heats up rather fast. Tried runners knot but laces are too short. Thick/double sock doesn't work either.",
    ratings: { cushioning: 9.0, traction: 9.0, support: 6.5, fit: 7.0, breathability: 5.5, courtFeel: 8.0, durability: 8.0, value: 9.0 }
  },

  // --- KD 14 ---
  {
    shoe: "Nike KD 14", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1shphbj/rate_the_rotation/",
    author: "u/Typical-Public4166", date: "2026-04-10",
    summary: "The reviewer's GOAT shoe. Zoom strobel + Cushlon is the best cushion setup ever. Lockdown and support are amazing, and despite looking bulky they don't feel heavy. Traction is 10/10 indoors. Only weakness: outdoor durability is terrible.",
    playstyle: "All-Around", courtType: "Indoor only", sizingNote: "True to size", verdict: "GOAT", wordCount: 1054,
    fullText: "Kd 14: if you've seen my profile before you know these are my GOATs. Zoom strobel and cushlon is the best cushion setup ever, lockdown and support are amazing, and even though they look and are bulky, they don't feel like it. Traction is 10/10 on indoor courts. Don't use these outdoors, durability outside is the only thing wrong with these.",
    ratings: { cushioning: 10, traction: 10, support: 9.5, fit: 9.0, breathability: 7.0, courtFeel: 8.0, durability: 5.0, value: 9.0 }
  },

  // --- Sabrina 2 ---
  {
    shoe: "Nike Sabrina 2", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1shphbj/rate_the_rotation/",
    author: "u/Typical-Public4166", date: "2026-04-10",
    summary: "An easy, comfortable option with great lockdown and no pinch. Feels minimalist after break-in with solid shock absorption. 10/10 traction works on any court including outdoors. Big downside: upper durability is horrible — uppers fall apart before the sole.",
    playstyle: "All-Around", courtType: "Indoor / Outdoor", sizingNote: "True to size", verdict: "Great", wordCount: 1054,
    fullText: "Sabrina 2: I love these as an easy option. Comfortable, fits with no pinch, great lockdown, won't hurt my knees. After broken in, feels like a minimalist shoe but shock absorption is great. Traction is 10/10, works on any court. I use these outside and they've held up. Only thing wrong: upper durability is horrible, uppers fall apart before the midsole or outsole.",
    ratings: { cushioning: 7.5, traction: 10, support: 8.0, fit: 9.0, breathability: 7.0, courtFeel: 8.5, durability: 5.0, value: 8.0 }
  },

  // --- AE 1 ---
  {
    shoe: "Nike AE 1", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1shphbj/rate_the_rotation/",
    author: "u/Typical-Public4166", date: "2026-04-10",
    summary: "Runs big — half size down recommended. With double socks, lockdown becomes possibly the best ever. Traction is strong but thin tread lines peel. Upper durability is top-tier indoors but outsole falls apart outdoors. Cushion fades over time.",
    playstyle: "All-Around", courtType: "Indoor only", sizingNote: "Half size down", verdict: "Good", wordCount: 1054,
    fullText: "Ae 1: pretty good, nothing exceptional. Ran big, would go half size down. With double sock, lockdown was amazing. Traction is really good but thin lines rip off on sides. Upper durability is top tier but don't wear outside. Cushion is good when it's good, but after that it's done. High stack but feels low to the ground.",
    ratings: { cushioning: 7.0, traction: 8.5, support: 8.0, fit: 6.5, breathability: 6.5, courtFeel: 8.0, durability: 7.0, value: 7.0 }
  },

  // --- Shai 001 ---
  {
    shoe: "Nike Shai 001", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sdg9dk/i_gave_them_an_honest_shot/",
    author: "u/Ok-Network8411", date: "2026-04-05",
    summary: "Coolest silhouette since the OG Foamposite with the most plush, responsive cushion Nike has created. But the razor tongue ruins it — zero padding, digs into the foot causing blisters across 3 colorways and 32+ hours. Heartbreaking for those it doesn't fit.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size", verdict: "Frustrating", wordCount: 256,
    fullText: "I truly wanted these to be it. Coolest silhouette since the OG foamposite. Most plush, responsive and bouncy basketball sneaker Nike has created. But the razor tongue has ZERO padding and pushes into the upper bridge of your foot painfully. Played 20 hours in preloved blue, bought two more colorways, blisters returned. Break in didn't help.",
    ratings: { cushioning: 9.5, traction: 8.5, support: 7.5, fit: 4.5, breathability: 6.0, courtFeel: 8.5, durability: 7.5, value: 5.0 }
  },
  {
    shoe: "Nike Shai 001", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s49lxa/shai_001_performance_review/",
    author: "u/anumberxaspace", date: "2026-03-19",
    summary: "After 2 months of play, traction is elite — the go-to for terrible gym courts. Great impact protection, responsive cushioning, and solid lockdown. However, breathability is poor (feet get hot), upper creases badly, and the tongue padding is minimal. An underrated sneaker with real performance chops.",
    playstyle: "Guard / Wing", courtType: "Indoor", sizingNote: "True to size (slightly narrow)", verdict: "Great", wordCount: 1115,
    fullText: "I've been playing in the Shai 001s for about 2 months now, and I honestly think they're an underrated sneaker. Traction has been elite — my go-to men's league shoes as they grip terrible gym courts. Impact protection and responsiveness are great. Lockdown is solid. Breathability is poor, feet get hot. Upper creases badly. Tongue padding is minimal.",
    ratings: { cushioning: 8.5, traction: 9.5, support: 8.0, fit: 7.5, breathability: 4.5, courtFeel: 8.0, durability: 6.5, value: 7.5 }
  },

  // --- GT Cut 3 ---
  {
    shoe: "Nike GT Cut 3", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sgkzig/2026_shoe_rotation/",
    author: "u/SadGuitarNoises29", date: "2026-04-09",
    summary: "Personal workhorse shoe. Great cushion, amazing traction, fits like a glove. Indoor only recommended.",
    playstyle: "All-Around", courtType: "Indoor only", sizingNote: "True to size", verdict: "Great", wordCount: 192,
    fullText: "GT CUT 3: Cushion is great, Traction is amazing! Fits like a glove!! My personal workhorse. Indoor courts only recommended.",
    ratings: { cushioning: 8.5, traction: 9.5, support: 8.0, fit: 9.5, breathability: 7.0, courtFeel: 8.5, durability: 7.0, value: 8.0 }
  },

  // --- GT Cut 4 ---
  {
    shoe: "Nike GT Cut 4", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s2uooi/gt_cut_4_on_court_review/",
    author: "u/Longgadogforlife", date: "2026-03-21",
    summary: "Not as terrible as YouTube makes it out to be — actually one of the best hoop shoes played in. Zoom strobel + ZoomX + traction all work in perfect sync. 10/10 cushion for heavy guards. Pinky toe pinch is real but not a dealbreaker for everyone. Court feel and responsiveness are incredible.",
    playstyle: "Heavy Guard", courtType: "Indoor", sizingNote: "True to size (pinky toe may pinch)", verdict: "Elite", wordCount: 512,
    fullText: "Not as terrible as YouTube makes it out to be. These are one of the best hoop shoes I've played in because of how they managed to make the zoom strobel, zoomx, court feel and traction all work together. Cushion: 10/10 — insanely plush and bouncy and responsive. Best iteration of zoom strobel. Traction: 9/10 — ridiculous bite. Court Feel: 9/10 — connected to the court. The pinky toe issue exists but isn't universal.",
    ratings: { cushioning: 10, traction: 9.0, support: 8.5, fit: 7.0, breathability: 6.0, courtFeel: 9.0, durability: 7.5, value: 8.5 }
  },
  {
    shoe: "Nike GT Cut 4", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s49v5e/non_biased_gt_cut_4_review/",
    author: "u/Open_Bake_8013", date: "2026-03-19",
    summary: "Went TTS with flat feet. Some dead space at tip which is unusual. The infamous pinky toe pinch wasn't bad for this reviewer's foot shape. Once laces dialed in, lockdown is excellent. Traction and cushion both perform well. Solid shoe if the shape works for your foot.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size (flat foot friendly)", verdict: "Good", wordCount: 447,
    fullText: "Size 9.5 mens TTS, flat foot but not wide. Some deadspace at the tip. The pinky toe pinch wasn't bad for my foot shape. Once laces dialed in, lockdown and comfort were excellent. Traction and cushion both perform well.",
    ratings: { cushioning: 8.5, traction: 9.0, support: 8.0, fit: 7.5, breathability: 6.0, courtFeel: 8.5, durability: 7.0, value: 7.5 }
  },

  // --- Ja 3 ---
  {
    shoe: "Nike Ja 3", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sb5mvh/uncles_2026_rotation/",
    author: "u/TakoOne", date: "2026-04-03",
    summary: "Very fun shoe — lightweight and bouncy as hell. Heel stability is a big minus, but manageable if you transition to midfoot/forefoot faster. A secondary rotation option for lighter play sessions.",
    playstyle: "Guard / Quick Cuts", courtType: "Indoor", sizingNote: "True to size", verdict: "Good", wordCount: 692,
    fullText: "Nike Ja 3 (secondary rotation): Very fun shoe thanks to being lightweight and bouncy as hell. Heel stability is a big minus but manageable if you transition into midfoot and forefoot faster.",
    ratings: { cushioning: 8.0, traction: 8.0, support: 6.0, fit: 8.0, breathability: 7.5, courtFeel: 8.5, durability: 7.0, value: 8.0 }
  },

  // --- Kobe 6 Protro ---
  {
    shoe: "Nike Kobe 6 Protro", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sckw9p/shoe_rotation_pic_what_should_i_add_next_wide/",
    author: "u/Icy-Factor-8752", date: "2026-04-04",
    summary: "Great performance for league games and nicer courts, but kills wide feet — tight on sides with excessive heat. Not wide-foot friendly. Beautiful shoe with top-tier court feel if your feet can handle the narrow fit.",
    playstyle: "Power Forward", courtType: "Indoor", sizingNote: "True to size (not wide-foot friendly)", verdict: "Great (narrow feet)", wordCount: 258,
    fullText: "Kobe 6 Protro All-Star: Performance is great, but they kill my feet every time — really tight on the sides and my feet heat up a lot. Probably not wide-foot friendly (I'm a 10.5).",
    ratings: { cushioning: 7.5, traction: 9.0, support: 8.0, fit: 5.0, breathability: 4.5, courtFeel: 9.5, durability: 8.0, value: 7.0 }
  },

  // --- Air Jordan 40 ---
  {
    shoe: "Air Jordan 40", brand: "Nike",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s7tebq/jordan_40_the_best_jordans_for_hooping/",
    author: "u/dzDiyos", date: "2026-03-26",
    summary: "Extremely comfortable, premium materials, one of the best break-ins experienced. Possibly the cleanest silhouette on the market. Snug fit — most recommend half size up. After breaking in, one of the top all-rounders with great stability and molds around feet perfectly.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "Half size up (snug)", verdict: "Elite", wordCount: 649,
    fullText: "Comfortable. Extremely stable. Premium materials. Molds around your feet and has one of the best break-ins. Possibly the cleanest silhouette on the market. Fit is snug — most advise half size up. After breaking in, one of the top all-rounders. Well engineered with great tech.",
    ratings: { cushioning: 9.0, traction: 8.5, support: 9.5, fit: 8.0, breathability: 5.5, courtFeel: 8.0, durability: 8.5, value: 8.0 }
  },

  // =====================================================
  // === 361 DEGREES ===
  // =====================================================

  // --- Joker 1 GT ---
  {
    shoe: "361 Joker 1 GT", brand: "361 Degrees",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sgrpzy/rotation_from_a_primarily_volleyball_player/",
    author: "u/Single-Ninja8886", date: "2026-04-09",
    summary: "Beats every shoe in the rotation for comfort + cushioning, ties JB3 for traction. Court feel is slightly less responsive due to cushion amount. Played 6 hours across three sports — felt divine when swapped in. The safest, most comfortable shoe.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "Half size down (slightly wide)", verdict: "Elite", wordCount: 783,
    fullText: "Joker1GT: Beats every shoe here for Comfort + Cushion and ties JB3 for traction. Court feel slightly less responsive due to cushion amount but traction compensates. Bounce is great. Played 2hrs bball, 1hr badminton, 3hrs vball — these felt divine when swapped in.",
    ratings: { cushioning: 10, traction: 9.5, support: 8.5, fit: 8.5, breathability: 6.0, courtFeel: 7.0, durability: 8.0, value: 9.0 }
  },
  {
    shoe: "361 Joker 1 GT", brand: "361 Degrees",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sb1a5o/jb3_vs_joker_1_gt/",
    author: "u/Terrible-Day3117", date: "2026-04-03",
    summary: "Glove-like fit, bouncy like a full-length Zoom Air pod. First run felt slow and laterally unstable, but after 10+ hours it becomes rejuvenating. Traction is sneaky great — feels like you'll slip but never do. Limited colorways.",
    playstyle: "Hustle Player", courtType: "Indoor", sizingNote: "True to size (wide flat foot friendly)", verdict: "Elite", wordCount: 290,
    fullText: "Late 30s, 6' 190, hustle player, wide-ish flat foot. Glove like fit, bouncy like a full length zoom air pod. First run felt slow and unstable laterally. After 10hrs, really appreciating how rejuvenating they feel. Traction is sneaky great — feels like you'll slip but never do.",
    ratings: { cushioning: 9.5, traction: 8.5, support: 7.0, fit: 9.0, breathability: 5.5, courtFeel: 7.5, durability: 8.0, value: 8.5 }
  },
  {
    shoe: "361 Joker 1 GT", brand: "361 Degrees",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sbfevb/outdoor_and_durable_for_everyday_practices/",
    author: "u/CoffeeExtension4794", date: "2026-04-03",
    summary: "Same soft vibe as WoW 12 but slightly less bouncy. Squeaks on dusty courts though slips at some points. The safest, most comfortable option — the go-to for relaxed play.",
    playstyle: "All-Around", courtType: "Indoor / Outdoor", sizingNote: "Half size down", verdict: "Great", wordCount: 377,
    fullText: "Joker 1 GT: same vibe as Wow 12 in terms of softness but not that bouncy. Squeaky even on dust courts but slips at some points. The safest, most comfortable shoe in the rotation.",
    ratings: { cushioning: 9.0, traction: 7.5, support: 8.0, fit: 8.5, breathability: 6.0, courtFeel: 7.5, durability: 8.0, value: 8.5 }
  },
  {
    shoe: "361 Joker 1 GT", brand: "361 Degrees",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s5l8y6/joker_1_vs_joker_1_gt_comparo/",
    author: "u/Chinokio", date: "2026-03-23",
    summary: "Great cushion bounce, forgiving fit, ample support. Traction works even on dusty courts. The regular Joker 1 is close but the GT has better bounce and slightly more forgiving fit. Praises are warranted.",
    playstyle: "All-Around", courtType: "Indoor / Outdoor", sizingNote: "True to size", verdict: "Great", wordCount: 182,
    fullText: "Got the GTs and love em! Great cushion bounce, forgiving fit, ample support. Traction has been great even on dusty courts. The praises are warranted.",
    ratings: { cushioning: 9.5, traction: 8.5, support: 8.5, fit: 9.0, breathability: 6.0, courtFeel: 7.5, durability: 8.0, value: 9.0 }
  },

  // --- Joker 2 ---
  {
    shoe: "361 Joker 2", brand: "361 Degrees",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s8xlzl/joker_2_review_comparison_with_wow_12_and_joker_gt1/",
    author: "u/ChanbanX", date: "2026-03-30",
    summary: "Super comfortable with a snug lockdown — no heel slip at all. Cushion is nice and responsive without being too plush. Stability is the best feature — almost impossible to roll your ankle. Traction is average, picks up dust like Jordan 37s. Better stability than GT 1s.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size (hard to get foot in initially)", verdict: "Great", wordCount: 387,
    fullText: "Super comfortable, snug lockdown, no heel slippage. Cushion feels good — nice bounce and responsive. Stability is probably the best part — can't roll your foot even if you tried. Traction is average, picks up dust. Comparable to Jordan 37s.",
    ratings: { cushioning: 8.5, traction: 7.0, support: 10, fit: 8.5, breathability: 6.0, courtFeel: 8.0, durability: 8.0, value: 8.0 }
  },

  // --- Joker 2 Low ---
  {
    shoe: "361 Joker 2 Low", brand: "361 Degrees",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s49oqe/361_joker_2_low_duality/",
    author: "u/Dwreckshoelander", date: "2026-03-19",
    summary: "Cushioning is as advertised — very responsive in forefoot and heel, great for players always on the balls of their feet. Traction is top-tier indoors but won't last outdoors. Ventilation is lacking in a warm gym. Diamond rubber herringbone does its job inside.",
    playstyle: "Guard", courtType: "Indoor only", sizingNote: "True to size", verdict: "Good", wordCount: 235,
    fullText: "Ventilation is lacking — had to take shoes off between games. Traction does its job indoors but would burn through outdoors. Cushioning is as advertised — very responsive forefoot and heel. Great for players on the balls of their feet and heel landers.",
    ratings: { cushioning: 8.5, traction: 8.5, support: 8.0, fit: 8.0, breathability: 5.0, courtFeel: 8.0, durability: 6.5, value: 7.5 }
  },

  // --- Joker 2 GT ---
  {
    shoe: "361 Joker 2 GT", brand: "361 Degrees",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sb5mvh/uncles_2026_rotation/",
    author: "u/TakoOne", date: "2026-04-03",
    summary: "Slotting in as the primary 'mad bouncy' shoe. Still in testing but looking like a permanent rotation piece for a veteran reviewer with a massive collection.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size", verdict: "Great", wordCount: 692,
    fullText: "361 Joker 2 GT (testing/primary rotation): Barring surprise discoveries, these are going to slot in as my primary 'I just want some mad bouncy today' shoes.",
    ratings: { cushioning: 9.5, traction: 8.5, support: 8.5, fit: 8.0, breathability: 6.5, courtFeel: 8.0, durability: 8.0, value: 8.0 }
  },

  // =====================================================
  // === LI-NING ===
  // =====================================================

  // --- JB3 ---
  {
    shoe: "Li-Ning JB3", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sgrpzy/rotation_from_a_primarily_volleyball_player/",
    author: "u/Single-Ninja8886", date: "2026-04-09",
    summary: "By far the best fitting shoe for wide feet — fills out perfectly at TTS. Traction is absurd and trustworthy. Feels slightly clunky compared to lighter options but still top-tier in bounce. Cushion is a bit bare and heel-to-toe is average.",
    playstyle: "Wide Feet / All-Around", courtType: "Indoor", sizingNote: "True to size (extremely wide foot friendly)", verdict: "Great", wordCount: 783,
    fullText: "JB3s: by far the best fitting shoe for my feet at TTS. Extremely wide foot friendly. Clunky in comparison but still top tier feel and bounce. Traction is absurd — I trust it with my life. Cushion is a bit bare, heel-to-toe is average.",
    ratings: { cushioning: 7.0, traction: 10, support: 8.5, fit: 10, breathability: 5.5, courtFeel: 8.5, durability: 8.5, value: 8.5 }
  },
  {
    shoe: "Li-Ning JB3", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sb1a5o/jb3_vs_joker_1_gt/",
    author: "u/Terrible-Day3117", date: "2026-04-03",
    summary: "Light, springy, smooth heel-to-toe transition on first run. Great materials with zero break-in needed. Traction is insane. But second run was flat with no bounce — inconsistent ride quality is concerning. Breathability is poor.",
    playstyle: "Hustle Player", courtType: "Indoor", sizingNote: "True to size (wide flat foot friendly)", verdict: "Mixed", wordCount: 290,
    fullText: "First run was surprisingly fun — light, springy, smooth heel-to-toe transition. Materials are great, no break-in needed. Traction is insane. Second run was bizarre — no quickness or bounce, felt like great effort to move. Switched to Jokers and instantly felt better.",
    ratings: { cushioning: 7.0, traction: 9.5, support: 8.0, fit: 8.5, breathability: 5.0, courtFeel: 8.0, durability: 8.0, value: 7.5 }
  },

  // --- Way of Wade 12 ---
  {
    shoe: "Li-Ning Way of Wade 12", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sgrpzy/rotation_from_a_primarily_volleyball_player/",
    author: "u/Single-Ninja8886", date: "2026-04-09",
    summary: "Comfort meets performance — high-performing but cushion slightly dampens raw barebones feedback. TTS, slightly wider than Gammas. Obsidian colorway has impeccable traction even on dusty courts.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size (slightly wide)", verdict: "Elite", wordCount: 783,
    fullText: "WoW 12s: Comfort performance. High performers but cushion slightly dampens the barebones feedback. TTS, slightly wider than Gammas. Obsidian colourway has impeccable traction even on dusty courts.",
    ratings: { cushioning: 9.0, traction: 9.0, support: 8.5, fit: 9.0, breathability: 6.5, courtFeel: 7.5, durability: 8.5, value: 8.5 }
  },
  {
    shoe: "Li-Ning Way of Wade 12", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s8axe0/wow_12_review_from_a_pf_perspective/",
    author: "u/InformationLeast5607", date: "2026-03-29",
    summary: "A flawed beast from a PF perspective. Incredible plush cushion with great impact protection at 240lbs. Amazing court feel. But traction on dusty courts is terrible — forefoot rubber collects dust relentlessly. GCU claims are misleading (only heel/midfoot). Elite for clean courts only.",
    playstyle: "Power Forward (240lbs)", courtType: "Indoor (clean courts)", sizingNote: "True to size", verdict: "Great (clean courts only)", wordCount: 424,
    fullText: "Incredible cushion setup — plush, responsive, great court feel. At 240 and grabbing above the rim, amazing impact protection. But traction — on dusty courts, terrible. The forefoot is rubber not GCU, and it collects dust relentlessly. On clean courts it's elite. A flawed beast.",
    ratings: { cushioning: 9.5, traction: 6.5, support: 8.5, fit: 8.5, breathability: 6.0, courtFeel: 8.5, durability: 8.0, value: 7.5 }
  },
  {
    shoe: "Li-Ning Way of Wade 12", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s8apw6/wow_12_year_of_the_horse_review/",
    author: "u/Fabulous_Ad8642", date: "2026-03-29",
    summary: "Probably best shoes on market but overpriced. TTS fit with snug midfoot and roomy toe box. Traction ranges 8.5-9.5 depending on court condition. Amazing for on-ball defense. No weak points besides price. 9/10 overall.",
    playstyle: "Guard / Wing", courtType: "Indoor", sizingNote: "True to size", verdict: "Elite", wordCount: 496,
    fullText: "Probably best shoes on market but overpriced. TTS fit, snug midfoot, space in toebox. Traction 8.5-9.5 depending on court condition — perfect on clean, decent on dusty. Amazing for on-ball defence, wings, guards. No weak points. 9/10.",
    ratings: { cushioning: 9.0, traction: 8.5, support: 9.0, fit: 9.0, breathability: 7.0, courtFeel: 8.5, durability: 8.0, value: 7.0 }
  },
  {
    shoe: "Li-Ning Way of Wade 12", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s7thno/wow_12_after_months_of_play_elite_comfort/",
    author: "u/BOSSFORTHECAUSE", date: "2026-03-26",
    summary: "One of the most comfortable hoop shoes ever. Cushioning is crazy, fit is dialed right out the box. Barely any break-in needed. But traction is frustrating — forefoot rubber picks up dust, requiring constant wiping. Feels like the shoe isn't made for everyday hoopers.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size", verdict: "Elite (comfort) / Frustrating (traction)", wordCount: 211,
    fullText: "One of the most comfortable hoop shoes I've played in. Cushioning is crazy, fit is dialed right out the box. But the traction — forefoot is rubber not GCU. On a moderately clean Lifetime court, wiping every couple plays. WOW 10s had more bite on the same court.",
    ratings: { cushioning: 9.5, traction: 6.0, support: 8.5, fit: 9.5, breathability: 6.5, courtFeel: 8.0, durability: 8.0, value: 7.5 }
  },

  // --- Gamma 1 ---
  {
    shoe: "Li-Ning Gamma 1", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sgrpzy/rotation_from_a_primarily_volleyball_player/",
    author: "u/Single-Ninja8886", date: "2026-04-09",
    summary: "Unreal lightness with epic heel-to-toe transition and top-tier traction. Court feel is perfect. Fits slightly narrow but thin uppers conform beautifully. Improves everything the WoW 10s did well. An elite lightweight performer.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size (slightly narrow, conforms)", verdict: "Elite", wordCount: 783,
    fullText: "Gamma 1s: Fits slightly narrow but uppers are thin and conform very well. Lightness is unreal, heel-to-toe transition is epic, traction is top tier. Feeling on foot is seamless, court feel is perfect. Improves on everything about the WoW 10s.",
    ratings: { cushioning: 8.0, traction: 9.0, support: 8.0, fit: 8.5, breathability: 8.0, courtFeel: 9.5, durability: 8.0, value: 9.0 }
  },

  // --- Gamma 2 ---
  {
    shoe: "Li-Ning Gamma 2", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sb5mvh/uncles_2026_rotation/",
    author: "u/TakoOne", date: "2026-04-03",
    summary: "Gamma 1s but better — no surprises. A primary rotation shoe that improves on the already excellent formula.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size", verdict: "Elite", wordCount: 692,
    fullText: "Li Ning Gamma 2s (primary rotation): No surprises here. Gamma 1s but better.",
    ratings: { cushioning: 8.5, traction: 9.5, support: 8.5, fit: 9.0, breathability: 8.0, courtFeel: 9.5, durability: 8.5, value: 9.0 }
  },
  {
    shoe: "Li-Ning Gamma 2", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s5l6l7/my_new_goat_li_ning_gamma_2_review/",
    author: "u/SirGiannino", date: "2026-03-23",
    summary: "New GOAT — best fit of all time with zero dead space anywhere and zero pinching right out of the box. Lockdown is crazy good. Traction is elite-tier. Cushioning is responsive with great court feel. The complete package, though pricey.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size (perfect fit)", verdict: "GOAT", wordCount: 827,
    fullText: "Best fit of all time — zero dead space anywhere, zero pinching right out of the box. Lockdown is crazy good. Traction is elite-tier. Cushioning is responsive with great court feel. These might just be the best fitting shoes ever.",
    ratings: { cushioning: 9.0, traction: 9.5, support: 9.0, fit: 10, breathability: 7.5, courtFeel: 9.0, durability: 8.5, value: 7.5 }
  },

  // --- Liren 6v2 ---
  {
    shoe: "Li-Ning Liren 6v2", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s8bxqy/liren_6v2_initial_review/",
    author: "u/dual_hearts", date: "2026-03-29",
    summary: "SuperBOOM cushion starts stiff but softens up nicely — comparable to WoW 10s. Fits longer/narrower with a V-shaped heel cup. Lockdown is 9/10. 6'9\" 235lb ex-college player says arch support is less than expected due to lack of carbon fiber plate. Great bounce once broken in.",
    playstyle: "Big Man (6'9\" 235lbs)", courtType: "Indoor", sizingNote: "Runs slightly long/narrow", verdict: "Great", wordCount: 386,
    fullText: "6'9 235lb ex college player, size 13US. Some foot soreness in arches initially but went away. Cushion started stiff but comparable to WoW 10s after playing. Fits longer/narrower, V-shaped heel cup. Lockdown is 9/10. Lack of carbon fiber means less arch support.",
    ratings: { cushioning: 8.5, traction: 8.5, support: 7.5, fit: 8.0, breathability: 7.0, courtFeel: 8.5, durability: 8.0, value: 8.0 }
  },

  // --- Wade 808 3 Ultra v2 ---
  {
    shoe: "Li-Ning Wade 808 3 Ultra v2", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1shphbj/rate_the_rotation/",
    author: "u/Typical-Public4166", date: "2026-04-10",
    summary: "Just great — nothing wrong at all. Half size down for perfect 1:1 fit. Almost impossible to roll your ankle. Cushion is solid but not trampoline-level. A reliable, well-rounded performer.",
    playstyle: "All-Around", courtType: "Indoor / Outdoor", sizingNote: "Half size down", verdict: "Great", wordCount: 1054,
    fullText: "808 3 ultra v2: just great, nothing wrong with them at all. Half size down for 1:1 fit. Almost impossible to roll your ankle. Cushion is solid but not like SuperBoom trampoline level.",
    ratings: { cushioning: 8.0, traction: 8.5, support: 9.5, fit: 9.0, breathability: 6.5, courtFeel: 8.0, durability: 9.0, value: 8.5 }
  },

  // --- All City 14 ---
  {
    shoe: "Li-Ning All City 14", brand: "Li-Ning",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s1fpn2/all_city_14_review/",
    author: "u/InformationLeast5607", date: "2026-03-14",
    summary: "A great shoe — much better than the 13s. Tuff RB traction is phenomenal for outdoor, and works fine indoors too. Fit is TTS and slightly wide. Lockdown is the only fault — some heel slipping that needs tongue pads. Cushion is surprisingly good with enough court feel.",
    playstyle: "Power Forward", courtType: "Indoor / Outdoor", sizingNote: "True to size (slightly wide)", verdict: "Great", wordCount: 306,
    fullText: "A great shoe, so much better than 13s. Traction for outdoor is phenomenal — nothing better than Tuff RB. Good bite indoors too. Fit is TTS, slightly wide. Lockdown is my only fault — some heel slipping. Cushion is surprisingly good.",
    ratings: { cushioning: 8.0, traction: 9.5, support: 7.5, fit: 8.0, breathability: 7.0, courtFeel: 8.0, durability: 9.5, value: 8.5 }
  },

  // =====================================================
  // === ANTA ===
  // =====================================================

  // --- Kai 3 ---
  {
    shoe: "ANTA Kai 3", brand: "ANTA",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1shphbj/rate_the_rotation/",
    author: "u/Typical-Public4166", date: "2026-04-10",
    summary: "Exceptional right out of the box — only traction needs breaking in. ANTA's N2 foam is the reviewer's second-favorite cushion ever. Lateral flange provides great support and wide fit while maintaining breathing room.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size (wide fit)", verdict: "Elite", wordCount: 1054,
    fullText: "Anta Kai 3: exceptional. Traction needs breaking in, but N2 foam from Anta is my second favorite cushion ever. Support is great, lateral flange makes the shoe super wide. Keeps 1:1 fit with breathing room.",
    ratings: { cushioning: 9.5, traction: 8.0, support: 9.0, fit: 9.0, breathability: 7.0, courtFeel: 8.5, durability: 8.0, value: 9.0 }
  },
  {
    shoe: "ANTA Kai 3", brand: "ANTA",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sb5mvh/uncles_2026_rotation/",
    author: "u/TakoOne", date: "2026-04-03",
    summary: "Just the Kai 2s but better. Motion engineering is the only downgrade, but every weakness of the Kai 2 (over-pronation, weird heel fit) has been improved. A primary rotation shoe.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size", verdict: "Elite", wordCount: 692,
    fullText: "ANTA Kai 3: Just the Kai 2s but better. Motion engineering is the only downgrade but it improves on every weakness of Kai 2 — over pronation, weird heel fit, etc.",
    ratings: { cushioning: 9.0, traction: 9.0, support: 9.0, fit: 9.0, breathability: 7.0, courtFeel: 8.5, durability: 8.5, value: 9.0 }
  },

  // =====================================================
  // === ADIDAS ===
  // =====================================================

  // --- Don Issue 7 ---
  {
    shoe: "Adidas Don Issue 7", brand: "Adidas",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1shphbj/rate_the_rotation/",
    author: "u/Typical-Public4166", date: "2026-04-10",
    summary: "Loved for more than looks — cushion, traction, and support are all amazing. Heel has good compression, forefoot is responsive and low to ground. Runs big though — had to double sock for 1:1 fit.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "Half size down (runs big)", verdict: "Great", wordCount: 1054,
    fullText: "Don issue 7: cushion, traction, and support are amazing. Heel has good compression, forefoot is responsive and low to ground. Runs big — had to double sock. Would go half size down.",
    ratings: { cushioning: 8.5, traction: 9.0, support: 8.5, fit: 7.0, breathability: 7.0, courtFeel: 8.5, durability: 8.0, value: 8.5 }
  },
  {
    shoe: "Adidas Don Issue 7", brand: "Adidas",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sb5mvh/uncles_2026_rotation/",
    author: "u/TakoOne", date: "2026-04-03",
    summary: "Best Adidas shoe in the last 3 years. Only real downside is breathability. Even fixes Adidas' signature heel slip issue. A rare win for Adidas in performance basketball.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size", verdict: "Great", wordCount: 692,
    fullText: "Adidas DON Issue 7: Best Adidas shoes in the last 3 years. Only downside is breathability. They even fix the Adidas signature heel slips!",
    ratings: { cushioning: 8.5, traction: 8.5, support: 8.5, fit: 8.5, breathability: 5.5, courtFeel: 8.0, durability: 8.0, value: 8.5 }
  },
  {
    shoe: "Adidas Don Issue 7", brand: "Adidas",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s8xhs6/don_issue_7_all_star_31_usd/",
    author: "u/MyManD", date: "2026-03-30",
    summary: "Nabbed for $32 USD in Japan. Materials are synthetic but solid. Glue quality is poor. After two sessions: traction is very good with a 10-minute break-in, cushion is 'pleasant' — not booming but protective. Lockdown and support are excellent. Incredible value at sale price.",
    playstyle: "All-Around", courtType: "Indoor", sizingNote: "True to size", verdict: "Great (amazing at sale price)", wordCount: 579,
    fullText: "Got for $32 USD in Japan. Materials are synthetic but solid, poor glue quality. Traction: very good after 10-minute break-in. Cushion: 'pleasant' — not booming but protective. Lockdown and support are excellent. At this price, incredible value.",
    ratings: { cushioning: 7.5, traction: 8.5, support: 9.0, fit: 8.5, breathability: 5.5, courtFeel: 8.0, durability: 7.5, value: 10 }
  },

  // --- Harden 9 ---
  {
    shoe: "Adidas Harden 9", brand: "Adidas",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1sa3zys/dissappointed_wife_with_harden_9s_and_comparisons/",
    author: "u/in_vestigate311", date: "2026-04-02",
    summary: "Best cushioning she's ever had, but major midfoot rubbing and terrible traction on dusty courts killed it after 10+ hours. Not the right shoe for dusty or imperfect court conditions.",
    playstyle: "All-Around", courtType: "Indoor (clean only)", sizingNote: "True to size", verdict: "Disappointing", wordCount: 217,
    fullText: "Best cushioning ever, but major rubbing on midfoot and terrible traction on dusty courts. After 10+ hours, not what she's after.",
    ratings: { cushioning: 9.0, traction: 5.0, support: 7.0, fit: 5.5, breathability: 6.0, courtFeel: 7.0, durability: 7.0, value: 6.0 }
  },

  // --- Crazy Energy + ---
  {
    shoe: "Adidas Crazy Energy", brand: "Adidas",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s55ug7/adidas_crazy_energy/",
    author: "u/1Ball1sLife1", date: "2026-03-22",
    summary: "Solid 9/10 traction that works on dusty courts with minimal wiping. But lockdown is the biggest gripe — stiff, not breathable upper with slippery stock insoles and short lacing system. Heel slippage due to poor ankle lockdown. Cushion is bouncy with great court feel but overall ruined by the upper.",
    playstyle: "All-Around", courtType: "Indoor / Outdoor", sizingNote: "True to size", verdict: "Mixed", wordCount: 274,
    fullText: "Traction 9/10 — solid grip, works on dusty courts. Lockdown 6.5/10 — biggest gripe! Upper is stiff and not breathable, stock insoles are slippery. Lacing doesn't run high enough. Some heel slippage. Cushion is bouncy with great court feel.",
    ratings: { cushioning: 8.0, traction: 9.0, support: 6.5, fit: 6.5, breathability: 4.5, courtFeel: 8.5, durability: 8.0, value: 7.0 }
  },

  // =====================================================
  // === SPO ===
  // =====================================================
  {
    shoe: "SPO Game 1 High", brand: "SPO",
    redditUrl: "https://www.reddit.com/r/BBallShoes/comments/1s1gkkh/serious_player_only_game_1_high/",
    author: "u/HotWorldliness123", date: "2026-03-16",
    summary: "Unbelievable traction — S tier 10/10 with an insanely consistent rubber compound that's tacky even on dusty courts. Zero slips, zero wiping needed. Great heel lockdown with 3D-printed heel counter. Cushion takes time to break in but becomes very comfortable. Shoes don't squeak at all, which some may miss.",
    playstyle: "All-Around", courtType: "Indoor / Outdoor", sizingNote: "True to size", verdict: "Elite", wordCount: 779,
    fullText: "Traction is unbelievable — insanely consistent rubber compound, tacky even on dusty courts. S tier, 10/10. Never had to wipe, never slipped. Heel lockdown is great with 3D printed counter. Cushion takes time to break in but becomes very comfortable. No squeaking at all.",
    ratings: { cushioning: 8.0, traction: 10, support: 9.0, fit: 8.5, breathability: 7.0, courtFeel: 8.5, durability: 9.0, value: 8.5 }
  },
];

// Aggregate shoes for the shoe listing
export function getShoes() {
  const shoeMap = {};
  for (const review of reviews) {
    const key = review.shoe;
    if (!shoeMap[key]) {
      shoeMap[key] = { name: review.shoe, brand: review.brand, reviews: [], avgRatings: {} };
    }
    shoeMap[key].reviews.push(review);
  }
  const categories = ["cushioning", "traction", "support", "fit", "breathability", "courtFeel", "durability", "value"];
  for (const shoe of Object.values(shoeMap)) {
    for (const cat of categories) {
      const vals = shoe.reviews.map(r => r.ratings[cat]).filter(v => v != null);
      shoe.avgRatings[cat] = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
    }
  }
  return Object.values(shoeMap).sort((a, b) => b.reviews.length - a.reviews.length);
}
