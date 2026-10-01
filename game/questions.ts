import { PHRASAL_VERB_QUESTIONS } from "./phrasal-verbs.ts";

export type Level = "A1" | "A2" | "B1" | "B2" | "C1";
export type ExerciseMode = "prepositions" | "phrasal-verbs";
export type MusicSource = { artist: string; song: string };
export type Question = {
  id: string;
  sentence: string;
  answers: string[];
  level: Level;
  hint: string;
  source?: MusicSource;
};
export const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1"];

const question = (id: string, sentence: string, answers: string[], level: Level, hint: string): Question => ({ id, sentence, answers, level, hint });
const musicQuestion = (
  id: string,
  sentence: string,
  answers: string[],
  level: Level,
  hint: string,
  artist: string,
  song: string,
): Question => ({ id, sentence, answers, level, hint, source: { artist, song } });

export const QUESTIONS: Question[] = [
  question("a1-1", "The keys are ___ the table.", ["on"], "A1", "surface"),
  question("a1-2", "I live ___ Brazil.", ["in"], "A1", "country"),
  question("a1-3", "Meet me ___ the station.", ["at"], "A1", "specific place"),
  question("a1-4", "The cat is ___ the chair.", ["under"], "A1", "lower position"),
  question("a1-5", "The picture is ___ the wall.", ["on"], "A1", "surface"),
  question("a1-6", "The shop is ___ the bank.", ["next to", "by"], "A1", "close position"),
  question("a1-7", "My birthday is ___ May.", ["in"], "A1", "month"),
  question("a1-8", "We have class ___ Monday.", ["on"], "A1", "day"),
  question("a1-9", "I get up ___ seven o'clock.", ["at"], "A1", "time"),
  question("a1-10", "The children are ___ the garden.", ["in"], "A1", "place"),
  question("a1-11", "The bus stop is ___ my house.", ["in front of"], "A1", "position"),
  question("a1-12", "Put the milk ___ the fridge.", ["in", "inside"], "A1", "inside"),
  question("a1-13", "The dog is ___ the sofa and the door.", ["between"], "A1", "two things"),
  question("a1-14", "She walks ___ work every morning.", ["to"], "A1", "destination"),
  question("a1-15", "The cinema is ___ the supermarket.", ["behind"], "A1", "position"),
  question("a1-16", "We eat breakfast ___ the morning.", ["in"], "A1", "part of the day"),
  question("a1-17", "The book is ___ my bag.", ["in", "inside"], "A1", "inside"),
  question("a1-18", "The lamp is ___ the desk.", ["above", "over"], "A1", "higher position"),
  question("a1-19", "They are ___ home now.", ["at"], "A1", "fixed place"),
  question("a1-20", "The café is ___ the park.", ["near", "by"], "A1", "close position"),
  musicQuestion("a1-music-1", "We walked ___ the woods before sunset.", ["through"], "A1", "movement inside and out", "Taylor Swift", "Out of the Woods"),
  musicQuestion("a1-music-2", "The chair is ___ the two windows.", ["between"], "A1", "two things", "BABYMONSTER", "Stuck in the Middle"),
  musicQuestion("a1-music-3", "They fell ___ love during summer.", ["in"], "A1", "fixed expression", "Elvis Presley", "Can't Help Falling in Love"),
  musicQuestion("a1-music-4", "Never play ___ fire.", ["with"], "A1", "fixed expression", "BLACKPINK", "Playing with Fire"),
  musicQuestion("a1-music-5", "We danced ___ the night.", ["through"], "A1", "from start to finish", "Dua Lipa", "Dance the Night"),
  musicQuestion("a1-music-6", "Her voice came ___ the other side.", ["from"], "A1", "source", "Adele", "Hello"),

  question("a2-1", "She walked ___ the kitchen and made tea.", ["into"], "A2", "movement inside"),
  question("a2-2", "We travelled ___ train last weekend.", ["by"], "A2", "transport"),
  question("a2-3", "He has worked here ___ 2020.", ["since"], "A2", "starting point in time"),
  question("a2-4", "I have known her ___ ten years.", ["for"], "A2", "length of time"),
  question("a2-5", "The children ran ___ the road.", ["across"], "A2", "movement from one side to another"),
  question("a2-6", "Please wait ___ I finish this call.", ["until", "till"], "A2", "time limit"),
  question("a2-7", "We stopped ___ coffee on the way home.", ["for"], "A2", "purpose"),
  question("a2-8", "She got ___ the bus at the next stop.", ["off"], "A2", "public transport"),
  question("a2-9", "He looked ___ the window and smiled.", ["out of"], "A2", "movement outside"),
  question("a2-10", "The path goes ___ the woods.", ["through"], "A2", "movement inside and out"),
  question("a2-11", "We arrived ___ the hotel late.", ["at"], "A2", "arrival"),
  question("a2-12", "The meeting lasted ___ two hours.", ["for"], "A2", "length of time"),
  question("a2-13", "She turned ___ the left at the corner.", ["to"], "A2", "direction"),
  question("a2-14", "They went ___ a walk after dinner.", ["for"], "A2", "fixed expression"),
  question("a2-15", "I got ___ the taxi outside the restaurant.", ["out of"], "A2", "transport"),
  question("a2-16", "The parcel came ___ my friend in London.", ["from"], "A2", "source"),
  question("a2-17", "We stayed inside ___ the storm.", ["during"], "A2", "period of time"),
  question("a2-18", "He got ___ the car and drove away.", ["into"], "A2", "transport"),
  question("a2-19", "They walked ___ the lake.", ["around"], "A2", "movement surrounding"),
  question("a2-20", "The lights went out ___ the night.", ["during"], "A2", "period of time"),
  musicQuestion("a2-music-1", "He lost control ___ his emotions.", ["of"], "A2", "fixed expression", "Teddy Swims", "Lose Control"),
  musicQuestion("a2-music-2", "The path went ___ the summit to the valley.", ["from"], "A2", "starting point", "Ghost", "From the Pinnacle to the Pit"),
  musicQuestion("a2-music-3", "Everything worked out ___ the end.", ["in"], "A2", "final result", "Linkin Park", "In the End"),
  musicQuestion("a2-music-4", "She ran ___ the city before dawn.", ["through"], "A2", "movement inside and out", "Woodkid", "Run Boy Run"),
  musicQuestion("a2-music-5", "I kept thinking ___ the answer.", ["about"], "A2", "topic", "Arctic Monkeys", "Do I Wanna Know?"),
  musicQuestion("a2-music-6", "She drove ___ the neighbourhood at night.", ["through"], "A2", "movement inside and out", "Olivia Rodrigo", "drivers license"),

  question("b1-1", "I am responsible ___ booking the restaurant.", ["for"], "B1", "dependent preposition"),
  question("b1-2", "The picnic was cancelled ___ the rain.", ["because of", "due to"], "B1", "reason"),
  question("b1-3", "She is capable ___ solving the problem alone.", ["of"], "B1", "dependent preposition"),
  question("b1-4", "Keep your phone ___ sight while travelling.", ["in"], "B1", "fixed expression"),
  question("b1-5", "He apologised ___ being late.", ["for"], "B1", "dependent preposition"),
  question("b1-6", "Please comply ___ the house rules.", ["with"], "B1", "dependent preposition"),
  question("b1-7", "She succeeded ___ finding a cheaper flat.", ["in"], "B1", "dependent preposition"),
  question("b1-8", "Try to focus ___ one task at a time.", ["on"], "B1", "dependent preposition"),
  question("b1-9", "They were worried ___ their son's exam.", ["about"], "B1", "dependent preposition"),
  question("b1-10", "Good results depend ___ regular practice.", ["on", "upon"], "B1", "dependent preposition"),
  question("b1-11", "We prepared ___ the party all afternoon.", ["for"], "B1", "purpose"),
  question("b1-12", "Are you familiar ___ this app?", ["with"], "B1", "dependent preposition"),
  question("b1-13", "The meal consists ___ three courses.", ["of"], "B1", "dependent preposition"),
  question("b1-14", "She insisted ___ paying for dinner.", ["on"], "B1", "dependent preposition"),
  question("b1-15", "I was surprised ___ the price.", ["by", "at"], "B1", "reaction"),
  question("b1-16", "The train arrived ___ time.", ["on"], "B1", "fixed expression"),
  question("b1-17", "This password prevents strangers ___ entering.", ["from"], "B1", "dependent preposition"),
  question("b1-18", "I am looking forward ___ the holiday.", ["to"], "B1", "fixed expression"),
  question("b1-19", "This version differs ___ the old one.", ["from"], "B1", "dependent preposition"),
  question("b1-20", "She dealt ___ the complaint politely.", ["with"], "B1", "phrasal verb"),
  musicQuestion("b1-music-1", "There was no time ___ hesitation.", ["for"], "B1", "purpose or opportunity", "Billie Eilish", "No Time to Die"),
  musicQuestion("b1-music-2", "They walked ___ the church in silence.", ["to", "towards"], "B1", "destination or direction", "Hozier", "Take Me to Church"),
  musicQuestion("b1-music-3", "We ran out ___ time.", ["of"], "B1", "phrasal verb", "The Weeknd", "Out of Time"),
  musicQuestion("b1-music-4", "She felt nostalgic ___ the end of summer.", ["at"], "B1", "point in time", "Lana Del Rey", "Summertime Sadness"),
  musicQuestion("b1-music-5", "After all these years, she was still ___ him.", ["into"], "B1", "informal attraction", "Paramore", "Still into You"),
  musicQuestion("b1-music-6", "The sky was full ___ stars.", ["of"], "B1", "fixed expression", "Coldplay", "A Sky Full of Stars"),

  question("b2-1", "We carried on ___ spite of the bad weather.", ["in"], "B2", "fixed expression"),
  question("b2-2", "She was praised ___ staying calm.", ["for"], "B2", "reason for praise"),
  question("b2-3", "The delay was attributed ___ a computer problem.", ["to"], "B2", "dependent preposition"),
  question("b2-4", "His confidence grew ___ the course of the year.", ["over", "during"], "B2", "period of time"),
  question("b2-5", "The event was postponed ___ a transport strike.", ["because of", "due to"], "B2", "reason"),
  question("b2-6", "She objected ___ working every weekend.", ["to"], "B2", "dependent preposition"),
  question("b2-7", "This article refers ___ an earlier study.", ["to"], "B2", "dependent preposition"),
  question("b2-8", "I am accustomed ___ getting up early.", ["to"], "B2", "dependent preposition"),
  question("b2-9", "They went ahead, regardless ___ the cost.", ["of"], "B2", "fixed expression"),
  question("b2-10", "The conversation resulted ___ a new plan.", ["in"], "B2", "dependent preposition"),
  question("b2-11", "The flat is equipped ___ a washing machine.", ["with"], "B2", "dependent preposition"),
  question("b2-12", "He was sceptical ___ the online offer.", ["about", "of"], "B2", "dependent preposition"),
  question("b2-13", "They are committed ___ reducing waste.", ["to"], "B2", "dependent preposition"),
  question("b2-14", "We had no choice ___ to wait.", ["but"], "B2", "fixed expression"),
  question("b2-15", "The course is designed ___ improve your speaking.", ["to"], "B2", "infinitive"),
  question("b2-16", "He took responsibility ___ the mistake.", ["for"], "B2", "dependent preposition"),
  question("b2-17", "Young children are vulnerable ___ online scams.", ["to"], "B2", "dependent preposition"),
  question("b2-18", "I was relieved ___ hear that she was safe.", ["to"], "B2", "infinitive"),
  question("b2-19", "The guide was translated ___ Portuguese.", ["into"], "B2", "change of form"),
  question("b2-20", "The request was refused ___ the grounds of cost.", ["on"], "B2", "formal expression"),
  musicQuestion("b2-music-1", "She stood ___ the edge of a new beginning.", ["on", "at"], "B2", "position", "Lady Gaga", "The Edge of Glory"),
  musicQuestion("b2-music-2", "He felt locked out ___ his old life.", ["of"], "B2", "phrasal expression", "Bruno Mars", "Locked Out of Heaven"),
  musicQuestion("b2-music-3", "She felt ___ top of the world.", ["on"], "B2", "fixed expression", "Imagine Dragons", "On Top of the World"),
  musicQuestion("b2-music-4", "Everyone danced ___ the party.", ["at"], "B2", "event", "Miley Cyrus", "Party in the U.S.A."),
  musicQuestion("b2-music-5", "The memory stayed ___ her mind.", ["on"], "B2", "fixed expression", "Rihanna", "Love on the Brain"),
  musicQuestion("b2-music-6", "They were completely ___ love.", ["in"], "B2", "fixed expression", "Beyoncé", "Crazy in Love"),

  question("c1-1", "The decision was made ___ accordance with company policy.", ["in"], "C1", "formal fixed expression"),
  question("c1-2", "The offer is contingent ___ you providing two references.", ["on", "upon"], "C1", "dependent preposition"),
  question("c1-3", "She acted ___ the assumption that the shop was open.", ["on"], "C1", "formal collocation"),
  question("c1-4", "His account was at variance ___ the receipt.", ["with"], "C1", "formal fixed expression"),
  question("c1-5", "The booking is subject ___ confirmation by email.", ["to"], "C1", "formal dependent preposition"),
  question("c1-6", "We agreed ___ the proviso that everyone contributed.", ["on"], "C1", "formal collocation"),
  question("c1-7", "She spoke ___ behalf of her neighbours.", ["on"], "C1", "formal fixed expression"),
  question("c1-8", "The plan was developed ___ consultation with local people.", ["in"], "C1", "formal fixed expression"),
  question("c1-9", "The company complied ___ the new rules.", ["with"], "C1", "formal dependent preposition"),
  question("c1-10", "The results are consistent ___ previous research.", ["with"], "C1", "formal dependent preposition"),
  question("c1-11", "The changes were made ___ a view to saving money.", ["with"], "C1", "formal expression"),
  question("c1-12", "They continued working ___ difficult circumstances.", ["under"], "C1", "formal collocation"),
  question("c1-13", "The error is attributable ___ a typing mistake.", ["to"], "C1", "formal dependent preposition"),
  question("c1-14", "The restaurant remained open ___ the duration of the festival.", ["for"], "C1", "formal duration"),
  question("c1-15", "The campaign is intended ___ encourage recycling.", ["to"], "C1", "formal infinitive"),
  question("c1-16", "We proceeded ___ the basis of the information available.", ["on"], "C1", "formal collocation"),
  question("c1-17", "She remained ___ work pending a response.", ["at"], "C1", "formal fixed expression"),
  question("c1-18", "He made the choice independently ___ his parents.", ["of"], "C1", "formal dependent preposition"),
  question("c1-19", "The complaint was handled ___ accordance with the law.", ["in"], "C1", "formal fixed expression"),
  question("c1-20", "They rented the flat ___ the understanding that pets were allowed.", ["on"], "C1", "formal collocation"),
  musicQuestion("c1-music-1", "The truth lay ___ two opposing views.", ["between"], "C1", "abstract position", "Florence + the Machine", "Between Two Lungs"),
  musicQuestion("c1-music-2", "Their conversation unfolded ___ the quiet of the salon.", ["amid", "in"], "C1", "surrounding atmosphere", "Lorde", "Stoned at the Nail Salon"),
  musicQuestion("c1-music-3", "The performance brought the story ___ life.", ["to"], "C1", "fixed expression", "Evanescence", "Bring Me to Life"),
  musicQuestion("c1-music-4", "She remained composed ___ intense pressure.", ["under"], "C1", "condition", "Queen", "Under Pressure"),
  musicQuestion("c1-music-5", "He placed all his trust ___ her.", ["in"], "C1", "dependent preposition", "ABBA", "Lay All Your Love on Me"),
  musicQuestion("c1-music-6", "The change was seen as a sign ___ the times.", ["of"], "C1", "fixed expression", "Harry Styles", "Sign of the Times"),
];

export const QUESTION_BANKS: Record<ExerciseMode, Question[]> = {
  prepositions: QUESTIONS,
  "phrasal-verbs": PHRASAL_VERB_QUESTIONS,
};

export function levelForStreak(correctAnswers: number): Level {
  return LEVELS[Math.min(Math.floor(correctAnswers / 4), LEVELS.length - 1)];
}

export function pickQuestion(
  mode: ExerciseMode,
  level: Level,
  previousId?: string,
): Question {
  const bank = QUESTION_BANKS[mode];
  const pool = bank.filter(
    (question) => question.level === level && question.id !== previousId,
  );
  return pool[Math.floor(Math.random() * pool.length)] ?? bank[0];
}
