import type { Level, Question } from "./questions.ts";

const SHAKESPEARE_LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

type ShakespeareItem = {
  sentence: string;
  answer: string;
  distractors: [string, string, string];
  hint: string;
  work: string;
};

const shakespeareQuestion = (
  id: string,
  level: Level,
  item: ShakespeareItem,
): Question => ({
  id,
  level,
  sentence: item.sentence,
  answers: [item.answer],
  distractors: item.distractors,
  hint: item.hint,
  explanation: `“${item.answer}” completes Shakespeare’s expression here. ${item.hint[0].toUpperCase()}${item.hint.slice(1)} in modern English.`,
  source: { kind: "shakespeare", work: item.work },
});

const PREPOSITIONS: Record<Level, ShakespeareItem[]> = {
  A1: [
    {
      sentence: "What’s ___ a name?",
      answer: "in",
      distractors: ["on", "at", "by"],
      hint: "inside or contained by",
      work: "Romeo and Juliet",
    },
    {
      sentence: "If music be the food ___ love, play on.",
      answer: "of",
      distractors: ["for", "with", "from"],
      hint: "shows the relationship between two nouns",
      work: "Twelfth Night",
    },
    {
      sentence: "The course ___ true love never did run smooth.",
      answer: "of",
      distractors: ["from", "for", "by"],
      hint: "connects the course with true love",
      work: "A Midsummer Night’s Dream",
    },
    {
      sentence: "The fault, dear Brutus, is not ___ our stars.",
      answer: "in",
      distractors: ["on", "at", "over"],
      hint: "located within something",
      work: "Julius Caesar",
    },
    {
      sentence: "Brevity is the soul ___ wit.",
      answer: "of",
      distractors: ["to", "for", "with"],
      hint: "shows belonging or connection",
      work: "Hamlet",
    },
    {
      sentence: "Cry ‘Havoc!’ and let slip the dogs ___ war.",
      answer: "of",
      distractors: ["from", "for", "at"],
      hint: "identifies what kind of dogs are meant",
      work: "Julius Caesar",
    },
    {
      sentence: "Something is rotten ___ the state of Denmark.",
      answer: "in",
      distractors: ["on", "at", "through"],
      hint: "within a place or situation",
      work: "Hamlet",
    },
    {
      sentence: "But soft, what light ___ yonder window breaks?",
      answer: "through",
      distractors: ["across", "beside", "under"],
      hint: "passes from one side or space to another",
      work: "Romeo and Juliet",
    },
  ],
  A2: [
    {
      sentence: "Some are born great; some have greatness thrust ___ ’em.",
      answer: "upon",
      distractors: ["above", "towards", "beside"],
      hint: "placed or imposed on someone",
      work: "Twelfth Night",
    },
    {
      sentence: "We are such stuff as dreams are made ___.",
      answer: "on",
      distractors: ["from", "with", "at"],
      hint: "an older form of the modern expression made of",
      work: "The Tempest",
    },
    {
      sentence: "Cowards die many times ___ their deaths.",
      answer: "before",
      distractors: ["behind", "during", "since"],
      hint: "earlier than an event",
      work: "Julius Caesar",
    },
    {
      sentence: "Love looks not ___ the eyes, but with the mind.",
      answer: "with",
      distractors: ["through", "by", "from"],
      hint: "shows the instrument used",
      work: "A Midsummer Night’s Dream",
    },
    {
      sentence:
        "By the pricking ___ my thumbs, something wicked this way comes.",
      answer: "of",
      distractors: ["on", "at", "from"],
      hint: "links the sensation to the thumbs",
      work: "Macbeth",
    },
    {
      sentence: "Is this a dagger which I see ___ me?",
      answer: "before",
      distractors: ["among", "within", "against"],
      hint: "in front of someone",
      work: "Macbeth",
    },
    {
      sentence: "O brave new world that has such people ___ ’t!",
      answer: "in",
      distractors: ["on", "at", "above"],
      hint: "inside the world",
      work: "The Tempest",
    },
    {
      sentence: "Misery acquaints a man ___ strange bedfellows.",
      answer: "with",
      distractors: ["to", "for", "from"],
      hint: "introduces or connects one person to another",
      work: "The Tempest",
    },
  ],
  B1: [
    {
      sentence: "Now is the winter ___ our discontent.",
      answer: "of",
      distractors: ["for", "from", "with"],
      hint: "connects the season metaphor to discontent",
      work: "Richard III",
    },
    {
      sentence: "Though this be madness, yet there is method ___ ’t.",
      answer: "in",
      distractors: ["on", "over", "beside"],
      hint: "contained within apparent madness",
      work: "Hamlet",
    },
    {
      sentence: "There are more things ___ heaven and earth, Horatio.",
      answer: "in",
      distractors: ["between", "through", "across"],
      hint: "within these two realms",
      work: "Hamlet",
    },
    {
      sentence:
        "When sorrows come, they come not single spies, but ___ battalions.",
      answer: "in",
      distractors: ["with", "by", "among"],
      hint: "arranged or arriving as a group",
      work: "Hamlet",
    },
    {
      sentence: "The evil that men do lives ___ them.",
      answer: "after",
      distractors: ["beyond", "behind", "against"],
      hint: "continues later than their lives",
      work: "Julius Caesar",
    },
    {
      sentence: "Beware the ides ___ March.",
      answer: "of",
      distractors: ["in", "at", "during"],
      hint: "connects a named day with its month",
      work: "Julius Caesar",
    },
    {
      sentence: "Once more ___ the breach, dear friends.",
      answer: "unto",
      distractors: ["into", "towards", "through"],
      hint: "an archaic form meaning to or towards",
      work: "Henry V",
    },
    {
      sentence: "We few, we happy few, we band ___ brothers.",
      answer: "of",
      distractors: ["with", "for", "among"],
      hint: "shows the members forming the band",
      work: "Henry V",
    },
  ],
  B2: [
    {
      sentence:
        "The play’s the thing wherein I’ll catch the conscience ___ the King.",
      answer: "of",
      distractors: ["from", "for", "over"],
      hint: "connects the conscience to its owner",
      work: "Hamlet",
    },
    {
      sentence: "This above all: ___ thine own self be true.",
      answer: "to",
      distractors: ["for", "with", "upon"],
      hint: "directs faithfulness towards oneself",
      work: "Hamlet",
    },
    {
      sentence: "I am a man more sinned ___ than sinning.",
      answer: "against",
      distractors: ["upon", "towards", "beside"],
      hint: "marks the person receiving harmful action",
      work: "King Lear",
    },
    {
      sentence: "Nothing will come ___ nothing.",
      answer: "of",
      distractors: ["from", "out", "with"],
      hint: "uses an older fixed expression meaning result from",
      work: "King Lear",
    },
    {
      sentence: "The rarer action is ___ virtue than in vengeance.",
      answer: "in",
      distractors: ["with", "by", "through"],
      hint: "locates the quality within virtue",
      work: "The Tempest",
    },
    {
      sentence: "The better part ___ valour is discretion.",
      answer: "of",
      distractors: ["in", "to", "from"],
      hint: "identifies a part belonging to valour",
      work: "Henry IV, Part 1",
    },
    {
      sentence: "He which hath no stomach ___ this fight, let him depart.",
      answer: "to",
      distractors: ["for", "with", "at"],
      hint: "an older pattern meaning desire or appetite for",
      work: "Henry V",
    },
    {
      sentence: "Follow your spirit, and ___ this charge cry ‘God for Harry!’",
      answer: "upon",
      distractors: ["above", "against", "beside"],
      hint: "at the moment of this command or attack",
      work: "Henry V",
    },
  ],
  C1: [
    {
      sentence: "Men at some time are masters ___ their fates.",
      answer: "of",
      distractors: ["over", "for", "upon"],
      hint: "marks control or possession",
      work: "Julius Caesar",
    },
    {
      sentence: "Let’s carve him as a dish fit ___ the gods.",
      answer: "for",
      distractors: ["to", "of", "with"],
      hint: "suitable or appropriate for someone",
      work: "Julius Caesar",
    },
    {
      sentence:
        "The lunatic, the lover, and the poet are ___ imagination all compact.",
      answer: "of",
      distractors: ["from", "with", "by"],
      hint: "an archaic construction meaning made of",
      work: "A Midsummer Night’s Dream",
    },
    {
      sentence: "This was the most unkindest cut ___ all.",
      answer: "of",
      distractors: ["from", "with", "among"],
      hint: "selects one cut from the whole group",
      work: "Julius Caesar",
    },
    {
      sentence:
        "Full fathom five thy father lies; ___ his bones are coral made.",
      answer: "of",
      distractors: ["from", "with", "by"],
      hint: "introduces the material being transformed",
      work: "The Tempest",
    },
    {
      sentence:
        "Good night, sweet prince, and flights ___ angels sing thee to thy rest.",
      answer: "of",
      distractors: ["from", "with", "among"],
      hint: "describes a group composed of angels",
      work: "Hamlet",
    },
    {
      sentence: "Let me not ___ the marriage of true minds admit impediments.",
      answer: "to",
      distractors: ["for", "with", "upon"],
      hint: "connects an obstacle with the marriage it affects",
      work: "Sonnet 116",
    },
    {
      sentence:
        "The quality of mercy is not strained; it droppeth as the gentle rain ___ heaven.",
      answer: "from",
      distractors: ["of", "through", "above"],
      hint: "shows the origin of the rain",
      work: "The Merchant of Venice",
    },
  ],
};

const PHRASAL_VERBS: Record<Level, ShakespeareItem[]> = {
  A1: [
    {
      sentence: "If music be the food of love, ___.",
      answer: "play on",
      distractors: ["play out", "play up", "play along"],
      hint: "continue playing",
      work: "Twelfth Night",
    },
    {
      sentence: "Let me ___, and you shall know my errand.",
      answer: "come in",
      distractors: ["come by", "come over", "come through"],
      hint: "enter a place",
      work: "Romeo and Juliet",
    },
    {
      sentence: "___, stand up. Stand an you be a man.",
      answer: "stand up",
      distractors: ["stand by", "stand out", "stand down"],
      hint: "rise to your feet",
      work: "Romeo and Juliet",
    },
    {
      sentence: "Then I’ll ___. My fault is past.",
      answer: "look up",
      distractors: ["look on", "look into", "look over"],
      hint: "raise the eyes or seek hope",
      work: "Hamlet",
    },
    {
      sentence: "___ the light, and then put out the light.",
      answer: "put out",
      distractors: ["put on", "put up", "put away"],
      hint: "extinguish a light",
      work: "Othello",
    },
    {
      sentence: "Welcome. ___ your venerable burden, and let him feed.",
      answer: "set down",
      distractors: ["set off", "set out", "set up"],
      hint: "place something down",
      work: "As You Like It",
    },
    {
      sentence: "Here, ___ this dish.",
      answer: "take away",
      distractors: ["take over", "take up", "take in"],
      hint: "remove something from a place",
      work: "The Taming of the Shrew",
    },
    {
      sentence: "___ thy song and haste thee quick away.",
      answer: "break off",
      distractors: ["break out", "break down", "break through"],
      hint: "stop suddenly before finishing",
      work: "Measure for Measure",
    },
  ],
  A2: [
    {
      sentence: "Nurse, ___ again; I have remembered me.",
      answer: "come back",
      distractors: ["come by", "come over", "come through"],
      hint: "return to a place",
      work: "Romeo and Juliet",
    },
    {
      sentence: "___, dull earth, and find thy centre out.",
      answer: "turn back",
      distractors: ["turn over", "turn out", "turn up"],
      hint: "reverse direction and return",
      work: "Romeo and Juliet",
    },
    {
      sentence: "___ the sword again, or take up me.",
      answer: "take up",
      distractors: ["take in", "take over", "take away"],
      hint: "lift something from its resting place",
      work: "Richard III",
    },
    {
      sentence: "Well, well, ___ your sword.",
      answer: "put up",
      distractors: ["put on", "put out", "put down"],
      hint: "return a weapon to its place",
      work: "Richard III",
    },
    {
      sentence:
        "___ her weakness, which, I think, proceeds from wayward sickness.",
      answer: "bear with",
      distractors: ["bear out", "bear down", "bear upon"],
      hint: "be patient or tolerant",
      work: "Richard III",
    },
    {
      sentence: "Come, leave your drinking, and ___ blows.",
      answer: "fall to",
      distractors: ["fall out", "fall over", "fall through"],
      hint: "begin an activity energetically",
      work: "Henry VI, Part 2",
    },
    {
      sentence: "Clifford, I say, ___ and fight with me.",
      answer: "come forth",
      distractors: ["come by", "come round", "come through"],
      hint: "appear or move forwards",
      work: "Henry VI, Part 2",
    },
    {
      sentence: "Then leap over this stool and ___.",
      answer: "run away",
      distractors: ["run over", "run through", "run into"],
      hint: "escape by running",
      work: "Henry VI, Part 2",
    },
  ],
  B1: [
    {
      sentence: "He would ___ those that have offended him.",
      answer: "cut off",
      distractors: ["cut in", "cut out", "cut up"],
      hint: "remove or separate completely",
      work: "Richard III",
    },
    {
      sentence: "I am not barren to ___ complaints.",
      answer: "bring forth",
      distractors: ["bring round", "bring back", "bring down"],
      hint: "produce or give rise to something",
      work: "Richard III",
    },
    {
      sentence: "The new-healed wound of malice should ___.",
      answer: "break out",
      distractors: ["break in", "break up", "break through"],
      hint: "begin or erupt suddenly",
      work: "Richard III",
    },
    {
      sentence: "___ thy hand; make signal of thy hope.",
      answer: "hold up",
      distractors: ["hold off", "hold out", "hold back"],
      hint: "raise and keep something aloft",
      work: "Henry VI, Part 2",
    },
    {
      sentence: "When clouds appear, wise men ___ their cloaks.",
      answer: "put on",
      distractors: ["put out", "put away", "put through"],
      hint: "dress oneself in something",
      work: "Richard III",
    },
    {
      sentence: "We mean to ___ this business thoroughly.",
      answer: "look into",
      distractors: ["look over", "look on", "look up"],
      hint: "investigate carefully",
      work: "Henry VI, Part 2",
    },
    {
      sentence: "___ before; I’ll talk with this good fellow.",
      answer: "go on",
      distractors: ["go over", "go through", "go back"],
      hint: "continue or move ahead",
      work: "Richard III",
    },
    {
      sentence: "I have no delight to ___ the time.",
      answer: "pass away",
      distractors: ["pass over", "pass on", "pass through"],
      hint: "spend or cause time to elapse",
      work: "Richard III",
    },
  ],
  B2: [
    {
      sentence: "Beg thou, or borrow, to ___ the sum.",
      answer: "make up",
      distractors: ["make out", "make over", "make for"],
      hint: "complete the required total",
      work: "The Comedy of Errors",
    },
    {
      sentence: "Well, I’ll ___; go borrow me a crow.",
      answer: "break in",
      distractors: ["break off", "break out", "break through"],
      hint: "enter by force",
      work: "The Comedy of Errors",
    },
    {
      sentence: "I am sorry now that I did ___ him.",
      answer: "draw on",
      distractors: ["draw out", "draw up", "draw in"],
      hint: "draw a weapon against someone",
      work: "The Comedy of Errors",
    },
    {
      sentence: "___ thy sorrows which thou bring’st in haste.",
      answer: "speak out",
      distractors: ["speak up", "speak for", "speak over"],
      hint: "say something openly and clearly",
      work: "Pericles",
    },
    {
      sentence: "Look how thou stirrest now! ___, or I’ll fetch thee.",
      answer: "come away",
      distractors: ["come over", "come by", "come through"],
      hint: "leave a place and come with the speaker",
      work: "Pericles",
    },
    {
      sentence: "They were ___ before us even now.",
      answer: "cast away",
      distractors: ["cast out", "cast off", "cast down"],
      hint: "wrecked or abandoned",
      work: "Pericles",
    },
    {
      sentence: "Why to ___, I pray you?",
      answer: "give over",
      distractors: ["give out", "give away", "give back"],
      hint: "stop doing something",
      work: "Pericles",
    },
    {
      sentence: "It seeks to ___ by treason’s knife.",
      answer: "take off",
      distractors: ["take out", "take up", "take over"],
      hint: "remove or, here, kill",
      work: "Pericles",
    },
  ],
  C1: [
    {
      sentence: "___ me, Lucius; do not fear thine aunt.",
      answer: "stand by",
      distractors: ["stand out", "stand down", "stand up"],
      hint: "remain beside and support someone",
      work: "Titus Andronicus",
    },
    {
      sentence: "These tidings would ___ their flowing tides.",
      answer: "call forth",
      distractors: ["call off", "call back", "call on"],
      hint: "cause something to appear",
      work: "Henry VI, Part 1",
    },
    {
      sentence: "___ the County; go tell him of this.",
      answer: "send for",
      distractors: ["send out", "send off", "send back"],
      hint: "ask someone to come",
      work: "Romeo and Juliet",
    },
    {
      sentence: "Wilt thou resign them and ___ thy arms?",
      answer: "lay down",
      distractors: ["lay out", "lay by", "lay on"],
      hint: "put aside or surrender",
      work: "King John",
    },
    {
      sentence: "Which when you part from, lose, or ___.",
      answer: "give away",
      distractors: ["give over", "give out", "give back"],
      hint: "hand something to another person",
      work: "The Merchant of Venice",
    },
    {
      sentence: "___ that kingdom, and enfranchise that.",
      answer: "take in",
      distractors: ["take over", "take up", "take away"],
      hint: "conquer or absorb a territory",
      work: "Antony and Cleopatra",
    },
    {
      sentence: "I do it for some piece of money, and ___ all.",
      answer: "go through with",
      distractors: ["go along with", "go over to", "go back on"],
      hint: "complete something despite difficulty",
      work: "Measure for Measure",
    },
    {
      sentence: "One that made means to ___ what he hath.",
      answer: "come by",
      distractors: ["come over", "come through", "come back"],
      hint: "obtain or acquire something",
      work: "Richard III",
    },
  ],
};

export const SHAKESPEARE_PREPOSITION_QUESTIONS: Question[] =
  SHAKESPEARE_LEVELS.flatMap((level) =>
    PREPOSITIONS[level].map((item, index) =>
      shakespeareQuestion(
        `sh-prep-${level.toLowerCase()}-${index + 1}`,
        level,
        item,
      ),
    ),
  );

export const SHAKESPEARE_PHRASAL_VERB_QUESTIONS: Question[] =
  SHAKESPEARE_LEVELS.flatMap((level) =>
    PHRASAL_VERBS[level].map((item, index) =>
      shakespeareQuestion(
        `sh-pv-${level.toLowerCase()}-${index + 1}`,
        level,
        item,
      ),
    ),
  );
