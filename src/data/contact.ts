// "Contact" — Twister-style touch commands. {a} and {b} are filled with two
// players' names at draw time. Do it and HOLD; break contact or refuse = drink.
export interface ContactMove {
  text: string;
}

export const contactMoves: ContactMove[] = [
  { text: "{a}, rest your hand on {b}'s shoulder." },
  { text: "{a} and {b}, stand back to back." },
  { text: "{a}, link your pinky with {b}." },
  { text: "{a}, put your hand on top of {b}'s head." },
  { text: "{a} and {b}, press your elbows together." },
  { text: "{a}, hold {b}'s hand until the next round." },
  { text: "{a}, rest your chin on {b}'s shoulder." },
  { text: "{a} and {b}, touch the tips of your index fingers." },
  { text: "{a}, put your hand on {b}'s knee." },
  { text: "{a} and {b}, lean shoulder to shoulder." },
  { text: "{a}, place your foot on top of {b}'s foot." },
  { text: "{a}, wrap one arm around {b}." },
  { text: "{a} and {b}, press your knees together." },
  { text: "{a}, rest your head on {b}'s shoulder." },
  { text: "{a} and {b}, lock arms like you're about to march." },
  { text: "{a}, give {b} a piggyback hold — or just hang on." },

  // More holds
  { text: "{a} and {b}, interlock your fingers and don't let go." },
  { text: "{a}, balance the back of your hand on {b}'s palm." },
  { text: "{a} and {b}, press temple to temple." },
  { text: "{a}, hook your ankle around {b}'s." },
  { text: "{a} and {b}, press the backs of your hands together." },
  { text: "{a} and {b}, sit back to back and stay upright." },
  { text: "{a}, hold {b}'s hand above both your heads." },
  { text: "{a} and {b}, start a thumb war and freeze mid-grip." },
  { text: "{a}, keep two fingers on {b}'s wrist — find the pulse." },
  { text: "{a}, rest your forearm across {b}'s shoulders like a bar." },
];

// Spicier moves, added on top of the above when Spicy mode is on. 18+.
export const contactMovesSpicy: ContactMove[] = [
  { text: "{a}, sit on {b}'s lap until the next round." },
  { text: "{a} and {b}, press cheek to cheek." },
  { text: "{a}, rest your hand on {b}'s thigh." },
  { text: "{a} and {b}, hold each other's gaze — noses almost touching." },
  { text: "{a}, drape both arms around {b}'s neck." },
  { text: "{a}, rest your hand on {b}'s lower back." },
  { text: "{a} and {b}, press your foreheads together." },
  { text: "{a}, run one hand through {b}'s hair and hold it there." },
  { text: "{a}, hold {b} from behind, arms wrapped around." },
  { text: "{a} and {b}, hip to hip, no gap." },
  { text: "{a}, cup {b}'s face with one hand." },
  { text: "{a} and {b}, slow-dance close until the next round." },
  { text: "{a}, rest your hand on {b}'s stomach." },
  { text: "{a}, whisper in {b}'s ear, lips almost touching." },
  { text: "{a} and {b}, chest to chest in a full hug — hold it." },

  // More heat
  { text: "{a}, trace {b}'s collarbone once, then leave your hand there." },
  { text: "{a}, hold {b}'s wrist behind their back." },
  { text: "{a} and {b}, nose to neck. Breathe, don't touch." },
  { text: "{a}, rest your lips just above {b}'s ear until the next round." },
  { text: "{a} and {b}, thigh over thigh." },
  { text: "{a}, hold {b}'s chin and don't break eye contact." },
  { text: "{a}, one hand on {b}'s waist, one holding their hand. Slow-dance frame." },
  { text: "{a} and {b}, ankles locked and foreheads touching." },
  { text: "{a}, let {b} rest their full weight against you." },
  { text: "{a}, kiss {b} on the cheek and hold it for three full seconds." },
];
