// Editorial choices for the displayed meaning, keyed by stable question ID.
// Update these alongside sentence/answer edits; every option is validated in tests.
export const CURRICULUM: Record<
  string,
  { distractors: string[]; explanation: string }
> = {
  "a1-1": {
    distractors: ["in", "at", "by"],
    explanation:
      "Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "a1-2": {
    distractors: ["on", "at", "to"],
    explanation:
      "Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "a1-3": {
    distractors: ["in", "on", "to"],
    explanation:
      "“At” identifies the station entrance as a meeting point. “In” would describe being inside an enclosed space.",
  },
  "a1-4": {
    distractors: ["over", "above", "beside"],
    explanation:
      "“Under” means below something; figuratively, it introduces a condition such as pressure.",
  },
  "a1-5": {
    distractors: ["in", "at", "by"],
    explanation:
      "Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "a1-6": {
    distractors: ["between", "among"],
    explanation:
      "“Next to” means immediately beside; “by” can also indicate a nearby position.",
  },
  "a1-7": {
    distractors: ["on", "at", "to"],
    explanation:
      "Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "a1-8": {
    distractors: ["in", "at", "by"],
    explanation:
      "Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "a1-9": {
    distractors: ["in", "on", "to"],
    explanation:
      "Use “at” for a specific point, clock time or event. Some adjectives and verbs also require “at”.",
  },
  "a1-10": {
    distractors: ["on", "at", "to"],
    explanation:
      "Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "a1-11": {
    distractors: ["behind", "beside", "beyond"],
    explanation:
      "“In front of” describes a position before the front of something; “behind” describes the opposite position.",
  },
  "a1-12": {
    distractors: ["on", "under"],
    explanation:
      "Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "a1-13": {
    distractors: ["among", "beside", "around"],
    explanation:
      "“Between” relates distinct things or positions; use the stated meaning to choose the intended relationship.",
  },
  "a1-14": {
    distractors: ["for", "at", "from"],
    explanation:
      "“To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "a1-15": {
    distractors: ["before", "beside", "beyond"],
    explanation: "“Behind” expresses a position at the back of something.",
  },
  "a1-16": {
    distractors: ["on", "at", "to"],
    explanation:
      "Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "a1-17": {
    distractors: ["on", "beside"],
    explanation:
      "Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "a1-18": {
    distractors: ["under", "beside"],
    explanation:
      "“Above” and “over” can both express a higher position without contact.",
  },
  "a1-19": {
    distractors: ["in", "on", "to"],
    explanation:
      "The completed pattern is: “They are at home now.” Use “at” for a specific point, clock time or event. Some adjectives and verbs also require “at”.",
  },
  "a1-20": {
    distractors: ["through", "into"],
    explanation: "“Near” and “by” both express proximity in this sentence.",
  },
  "a1-music-1": {
    distractors: ["across", "over", "along"],
    explanation:
      "“Through” describes movement within or from one end to the other; “across” emphasises crossing a surface.",
  },
  "a1-music-2": {
    distractors: ["among", "beside", "around"],
    explanation:
      "“Between” relates distinct things or positions; use the stated meaning to choose the intended relationship.",
  },
  "a1-music-3": {
    distractors: ["on", "at", "to"],
    explanation:
      "The completed pattern is: “They fell in love during summer.” Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "a1-music-4": {
    distractors: ["by", "for", "of"],
    explanation:
      "The completed pattern is: “Never play with fire.” “With” expresses association, accompaniment or the connection required by a particular expression.",
  },
  "a1-music-5": {
    distractors: ["across", "over", "around"],
    explanation:
      "“Through” describes movement within or from one end to the other; “across” emphasises crossing a surface.",
  },
  "a1-music-6": {
    distractors: ["to", "at", "of"],
    explanation:
      "“From” marks an origin or starting point, or the complement required by words such as “prevent” and “differ”.",
  },
  "a2-1": {
    distractors: ["onto", "at", "to"],
    explanation:
      "“Into” expresses movement to the inside or a change of form; “in” generally describes position.",
  },
  "a2-2": {
    distractors: ["on", "with", "in"],
    explanation:
      "“By” introduces a means of transport without an article, as in “by train”. Other uses include proximity and the cause of a reaction.",
  },
  "a2-3": {
    distractors: ["for", "during", "until"],
    explanation:
      "“Since” introduces the starting point of a period; “for” introduces its duration.",
  },
  "a2-4": {
    distractors: ["since", "during", "at"],
    explanation:
      "“For” can introduce a duration, purpose, recipient or intended audience. Read the words around the gap.",
  },
  "a2-5": {
    distractors: ["along", "through", "over"],
    explanation: "“Across” expresses movement from one side to the other.",
  },
  "a2-6": {
    distractors: ["during", "since"],
    explanation:
      "“Until” and “till” specify an endpoint; “during” specifies the period in which something happens.",
  },
  "a2-7": {
    distractors: ["since", "during", "at"],
    explanation:
      "“For” can introduce a duration, purpose, recipient or intended audience. Read the words around the gap.",
  },
  "a2-8": {
    distractors: ["out of", "from", "away from"],
    explanation:
      "Use “get off” when leaving public transport; use “get out of” when leaving a car or taxi.",
  },
  "a2-9": {
    distractors: ["off", "outside"],
    explanation: "“Out of” indicates movement from inside to outside.",
  },
  "a2-10": {
    distractors: ["over", "beside"],
    explanation:
      "“Through” describes movement within or from one end to the other; “across” emphasises crossing a surface.",
  },
  "a2-11": {
    distractors: ["in", "on", "to"],
    explanation:
      "Use “at” for a specific point, clock time or event. Some adjectives and verbs also require “at”.",
  },
  "a2-12": {
    distractors: ["since", "during", "at"],
    explanation:
      "“For” can introduce a duration, purpose, recipient or intended audience. Read the words around the gap.",
  },
  "a2-13": {
    distractors: ["for", "at", "from"],
    explanation:
      "“To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "a2-14": {
    distractors: ["since", "during", "at"],
    explanation:
      "The completed pattern is: “They went for a walk after dinner.” “For” can introduce a duration, purpose, recipient or intended audience. Read the words around the gap.",
  },
  "a2-15": {
    distractors: ["off", "from", "outside"],
    explanation: "“Out of” indicates movement from inside to outside.",
  },
  "a2-16": {
    distractors: ["to", "at", "of"],
    explanation:
      "“From” marks an origin or starting point, or the complement required by words such as “prevent” and “differ”.",
  },
  "a2-17": {
    distractors: ["since", "until", "at"],
    explanation:
      "“During” introduces an event or named period; “for” expresses how long something lasts.",
  },
  "a2-18": {
    distractors: ["onto", "at", "to"],
    explanation:
      "“Into” expresses movement to the inside or a change of form; “in” generally describes position.",
  },
  "a2-19": {
    distractors: ["across", "into"],
    explanation:
      "“Around” or “round” describes movement surrounding something.",
  },
  "a2-20": {
    distractors: ["since", "until", "at"],
    explanation:
      "“During” introduces an event or named period; “for” expresses how long something lasts.",
  },
  "a2-music-1": {
    distractors: ["for", "with", "on"],
    explanation:
      "The completed pattern is: “He lost control of his emotions.” “Of” links the expression before the gap to its complement. Learn that complete word combination.",
  },
  "a2-music-2": {
    distractors: ["to", "at", "of"],
    explanation:
      "“From” marks an origin or starting point, or the complement required by words such as “prevent” and “differ”.",
  },
  "a2-music-3": {
    distractors: ["on", "at", "to"],
    explanation:
      "Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "a2-music-4": {
    distractors: ["across", "over", "around"],
    explanation:
      "“Through” describes movement within or from one end to the other; “across” emphasises crossing a surface.",
  },
  "a2-music-5": {
    distractors: ["on", "for", "with"],
    explanation:
      "“About” introduces a topic or the object of a feeling, such as worry.",
  },
  "a2-music-6": {
    distractors: ["across", "over", "around"],
    explanation:
      "“Through” describes movement within or from one end to the other; “across” emphasises crossing a surface.",
  },
  "b1-1": {
    distractors: ["of", "to", "with"],
    explanation:
      "The completed pattern is: “I am responsible for booking the restaurant.” “For” can introduce a duration, purpose, recipient or intended audience. Read the words around the gap.",
  },
  "b1-2": {
    distractors: ["despite", "in spite of"],
    explanation:
      "The completed pattern is: “The picnic was cancelled because of the rain.” “Because of” and “due to” introduce the reason before a noun phrase.",
  },
  "b1-3": {
    distractors: ["for", "with", "on"],
    explanation:
      "The completed pattern is: “She is capable of solving the problem alone.” “Of” links the expression before the gap to its complement. Learn that complete word combination.",
  },
  "b1-4": {
    distractors: ["on", "at", "to"],
    explanation:
      "The completed pattern is: “Keep your phone in sight while travelling.” Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "b1-5": {
    distractors: ["of", "to", "with"],
    explanation:
      "The completed pattern is: “He apologised for being late.” “For” can introduce a duration, purpose, recipient or intended audience. Read the words around the gap.",
  },
  "b1-6": {
    distractors: ["by", "for", "of"],
    explanation:
      "The completed pattern is: “Please comply with the house rules.” “With” expresses association, accompaniment or the connection required by a particular expression.",
  },
  "b1-7": {
    distractors: ["on", "at", "to"],
    explanation:
      "The completed pattern is: “She succeeded in finding a cheaper flat.” Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "b1-8": {
    distractors: ["in", "at", "by"],
    explanation:
      "The completed pattern is: “Try to focus on one task at a time.” Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "b1-9": {
    distractors: ["on", "for", "with"],
    explanation:
      "The completed pattern is: “They were worried about their son's exam.” “About” introduces a topic or the object of a feeling, such as worry.",
  },
  "b1-10": {
    distractors: ["for", "with"],
    explanation:
      "The completed pattern is: “Good results depend on regular practice.” Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "b1-11": {
    distractors: ["of", "to", "with"],
    explanation:
      "“For” can introduce a duration, purpose, recipient or intended audience. Read the words around the gap.",
  },
  "b1-12": {
    distractors: ["by", "for", "of"],
    explanation:
      "The completed pattern is: “Are you familiar with this app?” “With” expresses association, accompaniment or the connection required by a particular expression.",
  },
  "b1-13": {
    distractors: ["for", "with", "on"],
    explanation:
      "The completed pattern is: “The meal consists of three courses.” “Of” links the expression before the gap to its complement. Learn that complete word combination.",
  },
  "b1-14": {
    distractors: ["in", "at", "by"],
    explanation:
      "The completed pattern is: “She insisted on paying for dinner.” Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "b1-15": {
    distractors: ["for", "with"],
    explanation:
      "The completed pattern is: “I was surprised by the price.” “By” introduces a means of transport without an article, as in “by train”. Other uses include proximity and the cause of a reaction.",
  },
  "b1-16": {
    distractors: ["at", "by", "during"],
    explanation:
      "“On time” means punctual: exactly as scheduled. “In time” means early enough for a purpose, a different meaning.",
  },
  "b1-17": {
    distractors: ["to", "at", "of"],
    explanation:
      "The completed pattern is: “This password prevents strangers from entering.” “From” marks an origin or starting point, or the complement required by words such as “prevent” and “differ”.",
  },
  "b1-18": {
    distractors: ["for", "at", "from"],
    explanation:
      "The completed pattern is: “I am looking forward to the holiday.” “To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "b1-19": {
    distractors: ["with", "on", "in"],
    explanation:
      "Use “differ from” to compare this version with another. Do not confuse the verb pattern with adjective patterns such as “different to”.",
  },
  "b1-20": {
    distractors: ["by", "for", "of"],
    explanation:
      "“With” expresses association, accompaniment or the connection required by a particular expression.",
  },
  "b1-music-1": {
    distractors: ["since", "during", "at"],
    explanation:
      "“For” can introduce a duration, purpose, recipient or intended audience. Read the words around the gap.",
  },
  "b1-music-2": {
    distractors: ["at", "from"],
    explanation:
      "“To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "b1-music-3": {
    distractors: ["for", "with", "on"],
    explanation:
      "“Of” links the expression before the gap to its complement. Learn that complete word combination.",
  },
  "b1-music-4": {
    distractors: ["in", "on", "to"],
    explanation:
      "Use “at” for a specific point, clock time or event. Some adjectives and verbs also require “at”.",
  },
  "b1-music-5": {
    distractors: ["onto", "at", "to"],
    explanation:
      "“Into” expresses movement to the inside or a change of form; “in” generally describes position.",
  },
  "b1-music-6": {
    distractors: ["for", "with", "on"],
    explanation:
      "The completed pattern is: “The sky was full of stars.” “Of” links the expression before the gap to its complement. Learn that complete word combination.",
  },
  "b2-1": {
    distractors: ["on", "at", "to"],
    explanation:
      "The completed pattern is: “We carried on in spite of the bad weather.” Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "b2-2": {
    distractors: ["of", "to", "with"],
    explanation:
      "The completed pattern is: “She was praised for staying calm.” “For” can introduce a duration, purpose, recipient or intended audience. Read the words around the gap.",
  },
  "b2-3": {
    distractors: ["for", "at", "from"],
    explanation:
      "The completed pattern is: “The delay was attributed to a computer problem.” “To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "b2-4": {
    distractors: ["since", "until"],
    explanation:
      "“In front of” describes a position before the front of something; “behind” describes the opposite position.",
  },
  "b2-5": {
    distractors: ["despite", "in spite of"],
    explanation:
      "The completed pattern is: “The event was postponed because of a transport strike.” “Because of” and “due to” introduce the reason before a noun phrase.",
  },
  "b2-6": {
    distractors: ["for", "at", "from"],
    explanation:
      "The completed pattern is: “She objected to working every weekend.” “To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "b2-7": {
    distractors: ["for", "at", "from"],
    explanation:
      "The completed pattern is: “This article refers to an earlier study.” “To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "b2-8": {
    distractors: ["for", "at", "from"],
    explanation:
      "The completed pattern is: “I am accustomed to getting up early.” “To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "b2-9": {
    distractors: ["for", "with", "on"],
    explanation:
      "The completed pattern is: “They went ahead, regardless of the cost.” “Of” links the expression before the gap to its complement. Learn that complete word combination.",
  },
  "b2-10": {
    distractors: ["on", "at", "to"],
    explanation:
      "The completed pattern is: “The conversation resulted in a new plan.” Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "b2-11": {
    distractors: ["by", "for", "of"],
    explanation:
      "The completed pattern is: “The flat is equipped with a washing machine.” “With” expresses association, accompaniment or the connection required by a particular expression.",
  },
  "b2-12": {
    distractors: ["with", "for"],
    explanation:
      "The completed pattern is: “He was sceptical about the online offer.” “About” introduces a topic or the object of a feeling, such as worry.",
  },
  "b2-13": {
    distractors: ["for", "at", "from"],
    explanation:
      "The completed pattern is: “They are committed to reducing waste.” “To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "b2-14": {
    distractors: ["except for", "besides", "without"],
    explanation:
      "The completed pattern is: “We had no choice but to wait.” The fixed pattern is “have no choice but to” followed by a verb.",
  },
  "b2-15": {
    distractors: ["of", "to", "with"],
    explanation:
      "“For” can introduce a duration, purpose, recipient or intended audience. Read the words around the gap.",
  },
  "b2-16": {
    distractors: ["of", "to", "with"],
    explanation:
      "The completed pattern is: “He took responsibility for the mistake.” “For” can introduce a duration, purpose, recipient or intended audience. Read the words around the gap.",
  },
  "b2-17": {
    distractors: ["for", "at", "from"],
    explanation:
      "The completed pattern is: “Young children are vulnerable to online scams.” “To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "b2-18": {
    distractors: ["for", "with"],
    explanation:
      "The completed pattern is: “I was relieved by the news that she was safe.” “By” introduces a means of transport without an article, as in “by train”. Other uses include proximity and the cause of a reaction.",
  },
  "b2-19": {
    distractors: ["onto", "at", "to"],
    explanation:
      "“Into” expresses movement to the inside or a change of form; “in” generally describes position.",
  },
  "b2-20": {
    distractors: ["in", "at", "by"],
    explanation:
      "Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "b2-music-1": {
    distractors: ["in", "under"],
    explanation:
      "Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "b2-music-2": {
    distractors: ["for", "with", "on"],
    explanation:
      "“Of” links the expression before the gap to its complement. Learn that complete word combination.",
  },
  "b2-music-3": {
    distractors: ["in", "at", "by"],
    explanation:
      "The completed pattern is: “She felt on top of the world.” Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "b2-music-4": {
    distractors: ["in", "on", "to"],
    explanation:
      "Use “at” for a specific point, clock time or event. Some adjectives and verbs also require “at”.",
  },
  "b2-music-5": {
    distractors: ["at", "by"],
    explanation:
      "A memory can stay “in your mind” (be remembered) or “on your mind” (occupy your thoughts). Both fit this sentence.",
  },
  "b2-music-6": {
    distractors: ["on", "at", "to"],
    explanation:
      "The completed pattern is: “They were completely in love.” Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "c1-1": {
    distractors: ["on", "at", "to"],
    explanation:
      "The completed pattern is: “The decision was made in accordance with company policy.” Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "c1-2": {
    distractors: ["for", "with"],
    explanation:
      "The completed pattern is: “The offer is contingent on you providing two references.” Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "c1-3": {
    distractors: ["in", "at", "by"],
    explanation:
      "The completed pattern is: “She acted on the assumption that the shop was open.” Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "c1-4": {
    distractors: ["by", "for", "of"],
    explanation:
      "The completed pattern is: “His account was at variance with the receipt.” “With” expresses association, accompaniment or the connection required by a particular expression.",
  },
  "c1-5": {
    distractors: ["for", "at", "from"],
    explanation:
      "The completed pattern is: “The booking is subject to confirmation by email.” “To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "c1-6": {
    distractors: ["in", "at", "by"],
    explanation:
      "The completed pattern is: “We agreed on the proviso that everyone contributed.” Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "c1-7": {
    distractors: ["in", "at", "by"],
    explanation:
      "The completed pattern is: “She spoke on behalf of her neighbours.” Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "c1-8": {
    distractors: ["on", "at", "to"],
    explanation:
      "The completed pattern is: “The plan was developed in consultation with local people.” Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "c1-9": {
    distractors: ["by", "for", "of"],
    explanation:
      "The completed pattern is: “The company complied with the new rules.” “With” expresses association, accompaniment or the connection required by a particular expression.",
  },
  "c1-10": {
    distractors: ["by", "for", "of"],
    explanation:
      "The completed pattern is: “The results are consistent with previous research.” “With” expresses association, accompaniment or the connection required by a particular expression.",
  },
  "c1-11": {
    distractors: ["by", "for", "of"],
    explanation:
      "“With” expresses association, accompaniment or the connection required by a particular expression.",
  },
  "c1-12": {
    distractors: ["over", "above", "beside"],
    explanation:
      "The completed pattern is: “They continued working under difficult circumstances.” “Under” means below something; figuratively, it introduces a condition such as pressure.",
  },
  "c1-13": {
    distractors: ["for", "at", "from"],
    explanation:
      "The completed pattern is: “The error is attributable to a typing mistake.” “To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "c1-14": {
    distractors: ["since", "at"],
    explanation:
      "Both “for the duration” and “during the duration” fit this time period; “for the duration” is the more concise conventional expression.",
  },
  "c1-15": {
    distractors: ["in", "on", "to"],
    explanation:
      "The completed pattern is: “The campaign is aimed at encouraging recycling.” Use “at” for a specific point, clock time or event. Some adjectives and verbs also require “at”.",
  },
  "c1-16": {
    distractors: ["in", "at", "by"],
    explanation:
      "The completed pattern is: “We proceeded on the basis of the information available.” Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "c1-17": {
    distractors: ["on", "to"],
    explanation:
      "“At work” describes being at the workplace; “in work” means employed. Both fit without further context.",
  },
  "c1-18": {
    distractors: ["for", "with", "on"],
    explanation:
      "The completed pattern is: “He made the choice independently of his parents.” “Of” links the expression before the gap to its complement. Learn that complete word combination.",
  },
  "c1-19": {
    distractors: ["on", "at", "to"],
    explanation:
      "The completed pattern is: “The complaint was handled in accordance with the law.” Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "c1-20": {
    distractors: ["in", "at", "by"],
    explanation:
      "The completed pattern is: “They rented the flat on the understanding that pets were allowed.” Use “on” for a surface or a particular day; in fixed expressions, learn the surrounding words together.",
  },
  "c1-music-1": {
    distractors: ["among", "beside", "around"],
    explanation:
      "“Between” relates distinct things or positions; use the stated meaning to choose the intended relationship.",
  },
  "c1-music-2": {
    distractors: ["under", "beyond"],
    explanation:
      "“Amid” means surrounded by an atmosphere or situation; “in” is also acceptable here.",
  },
  "c1-music-3": {
    distractors: ["for", "at", "from"],
    explanation:
      "The completed pattern is: “The performance brought the story to life.” “To” introduces a destination or a complement required by a verb, adjective or fixed expression.",
  },
  "c1-music-4": {
    distractors: ["over", "above", "beside"],
    explanation:
      "“Under” means below something; figuratively, it introduces a condition such as pressure.",
  },
  "c1-music-5": {
    distractors: ["on", "at", "to"],
    explanation:
      "The completed pattern is: “He placed all his trust in her.” Use “in” for an enclosed space, a larger area, a month or part of a day. Fixed expressions must be learnt as a unit.",
  },
  "c1-music-6": {
    distractors: ["for", "with", "on"],
    explanation:
      "The completed pattern is: “The change was seen as a sign of the times.” “Of” links the expression before the gap to its complement. Learn that complete word combination.",
  },
  "pv-a1-1": {
    distractors: ["get up", "stay up", "lie down"],
    explanation:
      "“wake up” means “stop sleeping” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-2": {
    distractors: ["wake up", "stand up", "stay up"],
    explanation:
      "“get up” means “leave your bed” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-3": {
    distractors: ["stand up", "lie down", "get up"],
    explanation:
      "“sit down” means “take a seat” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-4": {
    distractors: ["sit down", "turn up", "get up"],
    explanation:
      "“stand up” means “rise to your feet” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-5": {
    distractors: ["come out", "come back", "go away"],
    explanation:
      "“come in” means “enter” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-6": {
    distractors: ["go back", "come in", "stay in"],
    explanation:
      "“go out” means “leave home for fun” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-7": {
    distractors: ["turn off", "turn down"],
    explanation:
      "“turn on” means “start a device” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-8": {
    distractors: ["turn on", "turn down"],
    explanation:
      "“turn off” means “stop a device” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-9": {
    distractors: ["take off", "try on", "put away"],
    explanation:
      "“put on” means “dress in” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-10": {
    distractors: ["put on", "try on", "take back"],
    explanation:
      "“take off” means “remove clothing” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-11": {
    distractors: ["look after", "look at", "look up"],
    explanation:
      "“look for” means “try to find” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-12": {
    distractors: ["put down", "pick out", "put away"],
    explanation:
      "“pick up” means “lift” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-13": {
    distractors: ["slow down", "calm down", "hold on"],
    explanation:
      "“hurry up” means “move faster” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-14": {
    distractors: ["go away", "come in"],
    explanation:
      "“come back” means “return here” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-15": {
    distractors: ["go away", "go out", "come in"],
    explanation:
      "“go back” means “return there” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-16": {
    distractors: ["cross out", "read out"],
    explanation:
      "“write down” means “record in writing” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-17": {
    distractors: ["mess up", "set up"],
    explanation:
      "“clean up” means “make tidy” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-18": {
    distractors: ["call off", "call out"],
    explanation:
      "“call back” means “telephone again” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-19": {
    distractors: ["put away", "take back", "take off"],
    explanation:
      "“try on” means “test some clothing” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-20": {
    distractors: ["speed up", "hurry up", "stop by"],
    explanation:
      "“slow down” means “reduce speed” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-music-1": {
    distractors: ["get up", "stay up", "lie down"],
    explanation:
      "“wake up” means “stop sleeping” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-music-2": {
    distractors: ["turn on"],
    explanation:
      "“shut down” means “stop a device” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-music-3": {
    distractors: ["go away", "go out"],
    explanation:
      "“get back” means “return” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-music-4": {
    distractors: ["take off", "try on", "put away"],
    explanation:
      "“put on” means “start playing” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-music-5": {
    distractors: ["speed up", "hurry up", "stop by"],
    explanation:
      "“slow down” means “reduce speed” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a1-music-6": {
    distractors: ["bring it up", "look it up", "put it on"],
    explanation:
      "“shake it off” means “stop worrying about it” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-1": {
    distractors: ["look for", "look into"],
    explanation:
      "“look after” means “care for” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-2": {
    distractors: ["get off", "get out", "go down"],
    explanation:
      "“get on” means “enter public transport” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-3": {
    distractors: ["get on", "get in", "go through"],
    explanation:
      "“get off” means “leave public transport” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-4": {
    distractors: ["stock up on", "cut down on", "get rid of"],
    explanation:
      "“run out of” means “have none left” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-5": {
    distractors: ["give away", "give up", "give out"],
    explanation:
      "“give back” means “return something” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-6": {
    distractors: ["take away", "take off", "take up"],
    explanation:
      "“take back” means “return to a shop” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-7": {
    distractors: ["put away", "give back"],
    explanation:
      "“throw away” means “put in the rubbish” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-8": {
    distractors: ["hand in", "give in"],
    explanation:
      "“fill in” means “complete a form” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-9": {
    distractors: ["check out", "check up", "check on"],
    explanation:
      "“check in” means “register for a journey” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-10": {
    distractors: ["check in", "check on", "check up"],
    explanation:
      "“check out” means “leave a hotel” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-11": {
    distractors: ["gets up", "turns up", "shows up"],
    explanation:
      "“grows up” means “becomes an adult” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-12": {
    distractors: ["hang up", "hold on", "get away"],
    explanation:
      "“hang out” means “spend time together” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-13": {
    distractors: ["eat up", "go off"],
    explanation:
      "“eat out” means “eat at a restaurant” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-14": {
    distractors: ["work on", "work through", "work up"],
    explanation:
      "“work out” means “exercise” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-15": {
    distractors: ["look after", "look into", "look over"],
    explanation:
      "“look up” means “search for information” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-16": {
    distractors: ["give up", "take up", "put up"],
    explanation:
      "“set up” means “prepare for use” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-17": {
    distractors: ["show off", "show around"],
    explanation:
      "“show up” means “arrive” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-18": {
    distractors: ["carry out", "give up"],
    explanation:
      "“carry on” means “continue” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-19": {
    distractors: ["speed up", "hurry up", "stand up"],
    explanation:
      "“calm down” means “become relaxed” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-20": {
    distractors: ["find fault", "look after", "give out"],
    explanation:
      "“find out” means “discover information” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-music-1": {
    distractors: ["gets up", "turns up", "shows up"],
    explanation:
      "“grows up” means “becomes an adult” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-music-2": {
    distractors: ["look for", "look into"],
    explanation:
      "“look after” means “care for” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-music-3": {
    distractors: ["carry out", "give up"],
    explanation:
      "“carry on” means “continue” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-music-4": {
    distractors: ["check in", "check on", "check up"],
    explanation:
      "“check out” means “visit or investigate” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-music-5": {
    distractors: ["make up", "get on"],
    explanation:
      "“break up” means “end a relationship” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-a2-music-6": {
    distractors: ["come across", "come up"],
    explanation:
      "“come over” means “visit my home” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-1": {
    distractors: ["bring about", "bring out", "bring back"],
    explanation:
      "“bring up” means “mention a topic” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-2": {
    distractors: ["call back", "call out", "call on"],
    explanation:
      "“call off” means “cancel” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-3": {
    distractors: ["put on", "put up", "put away"],
    explanation:
      "“put off” means “delay” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-4": {
    distractors: ["look for", "break into", "take after"],
    explanation:
      "“deal with” means “manage a situation” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-5": {
    distractors: ["put up with", "keep up with"],
    explanation:
      "“get on with” means “have a good relationship” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-6": {
    distractors: ["break in", "break out", "break up"],
    explanation:
      "“break down” means “stop working” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-7": {
    distractors: ["look after", "bring about"],
    explanation:
      "“figure out” means “understand or solve” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-8": {
    distractors: ["give in", "give away", "give back"],
    explanation:
      "“give up” means “stop trying” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-9": {
    distractors: ["take off", "take over", "take back"],
    explanation:
      "“take up” means “start an activity” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-10": {
    distractors: ["turn up", "turn off", "turn over"],
    explanation:
      "“turn down” means “refuse” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-11": {
    distractors: ["point at", "point to", "put out"],
    explanation:
      "“point out” means “draw attention to” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-12": {
    distractors: ["take out", "put out", "give out"],
    explanation:
      "“sort out” means “solve” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-13": {
    distractors: ["came into", "came up with"],
    explanation:
      "“came across” means “found by chance” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-14": {
    distractors: ["get around", "get into", "get away"],
    explanation:
      "“get over” means “recover emotionally” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-15": {
    distractors: ["look back on", "look down on", "look out for"],
    explanation:
      "“look forward to” means “feel excited about” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-16": {
    distractors: ["keep up with", "get away with", "put up with"],
    explanation:
      "“catch up with” means “exchange recent news” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-17": {
    distractors: ["catch up with", "get on with", "put up with"],
    explanation:
      "“keep up with” means “stay at the same pace” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-18": {
    distractors: ["make out", "make off", "make do"],
    explanation:
      "“make up” means “invent” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-19": {
    distractors: ["let in", "let out", "let off"],
    explanation:
      "“Let someone down” means disappoint them. A pronoun goes between the verb and particle: “let her down”. A noun can follow the particle: “let down my friend”.",
  },
  "pv-b1-20": {
    distractors: ["take after", "take up", "take on"],
    explanation:
      "“take over” means “assume control” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-music-1": {
    distractors: ["give in", "give away", "give back"],
    explanation:
      "“give up” means “stop trying” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-music-2": {
    distractors: ["look after", "bring about"],
    explanation:
      "“figure out” means “understand” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-music-3": {
    distractors: ["look ahead", "look out", "look up"],
    explanation:
      "“look back” means “think about the past” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-music-4": {
    distractors: ["let me in", "let me out", "let me off"],
    explanation:
      "“let me down” means “disappoint me” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-music-5": {
    distractors: ["give up", "hold back"],
    explanation:
      "“start over” means “begin again” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b1-music-6": {
    distractors: ["speed up", "hurry up", "stand up"],
    explanation:
      "“calm down” means “become relaxed” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-1": {
    distractors: ["bring up", "bring back", "bring out"],
    explanation:
      "“bring about” means “cause to happen” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-2": {
    distractors: ["come down with", "come out of", "come across"],
    explanation:
      "“come up with” means “produce an idea” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-3": {
    distractors: ["catch up on", "put up with", "stock up on"],
    explanation:
      "“cut down on” means “consume less” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-4": {
    distractors: ["get away with", "put up with", "keep up with"],
    explanation:
      "“do away with” means “abolish” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-5": {
    distractors: ["fall behind", "fall out", "fall apart"],
    explanation:
      "“fall through” means “fail to happen” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-6": {
    distractors: ["got away with", "got down from", "got out of"],
    explanation:
      "“got around to” means “eventually found time” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-7": {
    distractors: ["go after", "go along", "go off"],
    explanation:
      "“go through” means “experience a process” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-8": {
    distractors: ["put up with", "look up to", "get away with"],
    explanation:
      "“live up to” means “meet expectations” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-9": {
    distractors: ["keep up with", "get on with", "come up with"],
    explanation:
      "“put up with” means “tolerate” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-10": {
    distractors: ["rule over", "point out", "bring up"],
    explanation:
      "“rule out” means “eliminate a possibility” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-11": {
    distractors: ["give away", "spend on"],
    explanation:
      "“set aside” means “reserve” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-12": {
    distractors: ["stand in for", "stand out from"],
    explanation:
      "“stand up for” means “defend” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-13": {
    distractors: ["take over", "take after", "take off"],
    explanation:
      "“take on” means “accept responsibility” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-14": {
    distractors: ["turned up", "turned down", "turned back"],
    explanation:
      "“turned out” means “eventually proved” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-15": {
    distractors: ["bring up", "take up", "make up"],
    explanation:
      "“back up” means “provide evidence” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-16": {
    distractors: ["catch up with", "cut down on", "put up with"],
    explanation:
      "“brush up on” means “improve an old skill” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-17": {
    distractors: ["bring in", "set up", "take on"],
    explanation:
      "“phase out” means “gradually stop using” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-18": {
    distractors: ["put off", "take off", "call off"],
    explanation:
      "“pull off” means “achieve something difficult” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-19": {
    distractors: ["step up", "stand in", "take over"],
    explanation:
      "“step down” means “leave a senior role” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-20": {
    distractors: ["cut down on", "look down on", "come down with"],
    explanation:
      "“crack down on” means “take strict action against” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-music-1": {
    distractors: ["take over", "take after", "take off"],
    explanation:
      "“take on” means “accept responsibility” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-music-2": {
    distractors: ["turn up", "turn off", "turn over"],
    explanation:
      "“turn down” means “refuse” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-music-3": {
    distractors: ["go along with", "look down on", "get on with"],
    explanation:
      "“go easy on” means “treat less severely” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-music-4": {
    distractors: ["catch up on", "put up with", "stock up on"],
    explanation:
      "“cut down on” means “consume less” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-music-5": {
    distractors: ["put up with", "look up to", "get away with"],
    explanation:
      "“live up to” means “meet expectations” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-b2-music-6": {
    distractors: ["put off", "take off", "call off"],
    explanation:
      "“pull off” means “achieve something difficult” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-1": {
    distractors: ["come down with", "get away with", "keep up with"],
    explanation:
      "“boil down to” means “have as the essential cause” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-2": {
    distractors: ["cut down on", "back out of", "phase out"],
    explanation:
      "“branch out into” means “expand into a new area” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-3": {
    distractors: ["back out of", "get away with", "put up with"],
    explanation:
      "“buckle down to” means “start working seriously” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-4": {
    distractors: ["played down", "glossed over", "ruled out"],
    explanation:
      "“Chalk something up to something” means attribute it to that cause. “Chalked up” is the past form, and “to” introduces the cause.",
  },
  "pv-c1-5": {
    distractors: ["cut down on", "look down on", "come down with"],
    explanation:
      "“clamp down on” means “control more strictly” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-6": {
    distractors: ["come up with", "come down with", "come out of"],
    explanation:
      "“come in for” means “received criticism” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-7": {
    distractors: ["back out of", "get away with", "look down on"],
    explanation:
      "“face up to” means “accept a difficult reality” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-8": {
    distractors: ["gloss over", "play down", "root out"],
    explanation:
      "“flesh out” means “add more detail” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-9": {
    distractors: ["flesh out", "spell out", "weigh up"],
    explanation:
      "“gloss over” means “avoid discussing properly” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-10": {
    distractors: ["gloss over", "bring up", "rule out"],
    explanation:
      "“iron out” means “resolve small difficulties” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-11": {
    distractors: ["look down on", "stand in for", "take after"],
    explanation:
      "“level with” means “speak honestly” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-12": {
    distractors: ["built up", "brought in", "taken on"],
    explanation:
      "“narrowed down” means “reduce the number of options” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-13": {
    distractors: ["falls through", "breaks down", "gives in"],
    explanation:
      "“pans out” means “develops in the end” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-14": {
    distractors: ["spell out", "bring up", "flesh out"],
    explanation:
      "“play down” means “make seem less important” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-15": {
    distractors: ["cover up", "bring in", "put up with"],
    explanation:
      "“root out” means “find and remove completely” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-16": {
    distractors: ["stand in for", "look after", "keep up with"],
    explanation:
      "“single out” means “select one person” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-17": {
    distractors: ["gloss over", "play down", "rule out"],
    explanation:
      "“spell out” means “explain explicitly” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-18": {
    distractors: ["back out of", "get away with", "put off"],
    explanation:
      "“square up to” means “face a difficult situation” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-19": {
    distractors: ["rule out", "gloss over", "play down"],
    explanation:
      "“weigh up” means “consider carefully” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-20": {
    distractors: ["back out of", "get away with", "look down on"],
    explanation:
      "“zero in on” means “focus precisely on” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-music-1": {
    distractors: ["comes down with", "gets away with", "keeps up with"],
    explanation:
      "“boils down to” means “has as its essential cause” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-music-2": {
    distractors: ["gloss over", "play down", "root out"],
    explanation:
      "“flesh out” means “add more detail to” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-music-3": {
    distractors: ["cover up", "bring in", "put up with"],
    explanation:
      "“root out” means “find and remove completely” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-music-4": {
    distractors: ["backs out of", "gets away with"],
    explanation:
      "“zeroes in on” means “focuses precisely on” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-music-5": {
    distractors: ["stood in for", "looked after", "kept up with"],
    explanation:
      "“singled out” means “selected one person” here. Match this meaning and use the verb form that fits the sentence.",
  },
  "pv-c1-music-6": {
    distractors: ["glosses over", "plays down", "rules out"],
    explanation:
      "“spells out” means “explains explicitly” here. Match this meaning and use the verb form that fits the sentence.",
  },
};
