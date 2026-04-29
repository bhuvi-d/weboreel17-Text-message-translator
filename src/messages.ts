export interface Translation {
  id: string;
  original: string;
  meaning: string;
}

export const PRESET_MESSAGES: Translation[] = [
  {
    id: 'k',
    original: 'k',
    meaning: 'I am either annoyed, busy, or both. Good luck figuring it out.'
  },
  {
    id: 'sure',
    original: 'sure :)',
    meaning: 'I am not okay but I am being polite.'
  },
  {
    id: 'whatever',
    original: 'do whatever',
    meaning: 'You better not do whatever. This is a trap.'
  },
  {
    id: 'fine',
    original: 'I’m fine',
    meaning: 'I am absolutely not fine. Please ask me what is wrong 14 more times.'
  },
  {
    id: 'lol',
    original: 'lol',
    meaning: 'That was mildly amusing at best. I did not actually laugh out loud.'
  },
  {
    id: 'we-see',
    original: 'we’ll see',
    meaning: 'The answer is no, but I don’t want to deal with your reaction right now.'
  },
  {
    id: 'typing',
    original: '...',
    meaning: 'I am typing a long paragraph but I will probably delete it and send "ok".'
  },
  {
    id: 'noted',
    original: 'Noted.',
    meaning: 'I have heard you, and I have filed this under "Things I will use against you later".'
  }
];

export const getCustomTranslation = (text: string): string => {
  const humorTranslations = [
    "I'm overthinking this exact sequence of characters.",
    "I'm actually just hungry and taking it out on you.",
    "This is my way of ending the conversation without being rude.",
    "I am currently looking for a reason to be offended.",
    "I'm actually smiling, but only because my cat did something cute.",
    "This message was drafted three times before I hit send.",
    "I am testing your ability to read between lines that don't exist."
  ];
  
  // Hash the text to pick a consistent humorous translation
  const index = text.length % humorTranslations.length;
  return humorTranslations[index];
};
