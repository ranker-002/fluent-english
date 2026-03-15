import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'fluent-english-storage' });

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  completed: boolean;
  xp: number;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'match' | 'speak' | 'listen';
  question: string;
  options?: string[];
  correctAnswer: string;
  translation?: string;
  audioUrl?: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  examples: GrammarExample[];
  exercises: GrammarExercise[];
  level: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  xp: number;
}

export interface GrammarExample {
  sentence: string;
  translation: string;
  explanation?: string;
}

export interface GrammarExercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'rewrite';
  question: string;
  correctAnswer: string;
  options?: string[];
  explanation?: string;
}

export interface VocabularyCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  words: VocabularyWord[];
}

export interface VocabularyWord {
  word: string;
  translation: string;
  example: string;
  phonetic?: string;
}

export interface FlashCard {
  id: string;
  word: string;
  translation: string;
  example: string;
  pronunciation: string;
  mastered: boolean;
  nextReview?: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'lessons' | 'streak' | 'words' | 'xp' | 'conversations' | 'grammar' | 'listening';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface DailyGoal {
  id: string;
  type: 'lessons' | 'practice' | 'streak' | 'review';
  target: number;
  progress: number;
  completed: boolean;
}

export interface ConversationScenario {
  id: string;
  title: string;
  context: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  messages: ConversationMessage[];
  completed: boolean;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
}

export interface ListeningExercise {
  id: string;
  title: string;
  transcript: string;
  translation: string;
  questions: ListeningQuestion[];
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  completed: boolean;
}

export interface ListeningQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  lessonsCompleted: number;
  wordsLearned: number;
  conversationsCompleted: number;
  totalPracticeTime: number;
  grammarLessonsCompleted: number;
  listeningExercisesCompleted: number;
}

interface AppSettings {
  notifications: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  dailyGoal: number;
  preferredAccent: 'us' | 'uk';
  theme: 'dark' | 'light';
}

interface AppState {
  hasCompletedOnboarding: boolean;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  userGoal: string;
  progress: UserProgress;
  lessons: Lesson[];
  grammarLessons: GrammarLesson[];
  vocabularyCategories: VocabularyCategory[];
  flashcards: FlashCard[];
  achievements: Achievement[];
  dailyGoals: DailyGoal[];
  conversationScenarios: ConversationScenario[];
  listeningExercises: ListeningExercise[];
  settings: AppSettings;
  currentStreak: number;
  
  setHasCompletedOnboarding: (value: boolean) => void;
  setUserLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  setUserGoal: (goal: string) => void;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completeGrammarLesson: (lessonId: string) => void;
  completeFlashcard: (cardId: string, quality: number) => void;
  completeConversation: (scenarioId: string) => void;
  completeListeningExercise: (exerciseId: string) => void;
  updateStreak: () => void;
  updateDailyGoal: (goalId: string, progress: number) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  checkAchievements: () => void;
  getDueCards: () => FlashCard[];
  resetProgress: () => void;
}

const initialLessons: Lesson[] = [
  { id: '1', title: 'Greetings & Introductions', description: 'Learn to introduce yourself and greet others', duration: 15, level: 'beginner', category: 'basics', completed: false, xp: 50 },
  { id: '2', title: 'At the Restaurant', description: 'Order food and make requests', duration: 20, level: 'beginner', category: 'travel', completed: false, xp: 60 },
  { id: '3', title: 'Shopping Conversations', description: 'Ask for sizes, prices, purchases', duration: 20, level: 'beginner', category: 'shopping', completed: false, xp: 60 },
  { id: '4', title: 'Asking for Directions', description: 'Learn to navigate and give directions', duration: 25, level: 'intermediate', category: 'travel', completed: false, xp: 75 },
  { id: '5', title: 'Job Interview', description: 'Practice common interview questions', duration: 30, level: 'intermediate', category: 'career', completed: false, xp: 100 },
  { id: '6', title: 'Making Phone Calls', description: 'Handle phone conversations professionally', duration: 25, level: 'intermediate', category: 'communication', completed: false, xp: 80 },
  { id: '7', title: 'At the Airport', description: 'Check-in, security, boarding', duration: 25, level: 'beginner', category: 'travel', completed: false, xp: 70 },
  { id: '8', title: 'Job Interview Part 2', description: 'Advanced interview techniques', duration: 35, level: 'advanced', category: 'career', completed: false, xp: 120 },
];

const initialGrammarLessons: GrammarLesson[] = [
  {
    id: '1',
    title: 'Present Simple',
    description: 'Learn how to describe daily routines',
    content: `The Present Simple tense is used to describe:
• Daily routines and habits
• General truths and facts
• Scheduled events
• Likes and dislikes

Formation:
• I/You/We/They: base form (work)
• He/She/It: base form + s (works)

Negative: don't/doesn't + verb
Question: Do/Does + subject + verb?`,
    examples: [
      { sentence: 'I wake up at 7am every day.', translation: 'Je me réveille à 7h chaque jour.' },
      { sentence: 'She works as a teacher.', translation: 'Elle travaille comme enseignante.' },
      { sentence: 'The sun rises in the east.', translation: 'Le soleil se lève à l\'est.' },
    ],
    exercises: [
      { id: '1', type: 'multiple_choice', question: 'Choose the correct form:', correctAnswer: 'works', options: ['work', 'works', 'working'], explanation: 'He/She/It takes the -s form' },
      { id: '2', type: 'fill_blank', question: 'Complete: She ___ coffee every morning.', correctAnswer: 'drinks', explanation: 'Third person singular takes -s' },
      { id: '3', type: 'rewrite', question: 'Rewrite: They don\'t like fish.', correctAnswer: 'Do they like fish?', explanation: 'Forming yes/no questions with do/did' },
    ],
    level: 'beginner',
    completed: false,
    xp: 40
  },
  {
    id: '2',
    title: 'Past Simple',
    description: 'Describe completed actions in the past',
    content: `The Past Simple tense is used to describe:
• Actions completed at a specific time
• Sequences of past events
• Past habits

Formation:
• Regular: verb + ed (played)
• Irregular: see the list (went, ate, wrote)

Negative: didn't + verb
Question: Did + subject + verb?`,
    examples: [
      { sentence: 'I visited Paris last year.', translation: 'J\'ai visité Paris l\'année dernière.' },
      { sentence: 'She ate breakfast at 8am.', translation: 'Elle a déjeuné à 8h.' },
      { sentence: 'They watched a movie yesterday.', translation: 'Ils ont regardé un film hier.' },
    ],
    exercises: [
      { id: '1', type: 'multiple_choice', question: 'Choose the correct past tense:', correctAnswer: 'went', options: ['go', 'gone', 'went'], explanation: 'Go past tense is went' },
      { id: '2', type: 'fill_blank', question: 'Complete: She ___ to school yesterday.', correctAnswer: 'walked', explanation: 'Regular verbs add -ed' },
      { id: '3', type: 'multiple_choice', question: 'Did you ___ the movie?', correctAnswer: 'watch', options: ['watch', 'watched', 'watching'], explanation: 'Use base form after did' },
    ],
    level: 'beginner',
    completed: false,
    xp: 40
  },
  {
    id: '3',
    title: 'Future Tense',
    description: 'Talk about plans and predictions',
    content: `We use different ways to talk about the future:

1. "will" - Predictions, spontaneous decisions
2. "going to" - Plans, intentions
3. Present Continuous - Arranged plans

"will" vs "going to":
• I think it will rain = prediction
• I am going to study = plan`,
    examples: [
      { sentence: 'I will call you tomorrow.', translation: 'Je t\'appellerai demain.' },
      { sentence: 'It\'s going to rain.', translation: 'Il va pleuvoir.' },
      { sentence: 'She is going to study medicine.', translation: 'Elle va étudier la médecine.' },
    ],
    exercises: [
      { id: '1', type: 'multiple_choice', question: 'Choose the correct form:', correctAnswer: 'is going to', options: ['will', 'is going to', 'is'], explanation: 'Going to expresses plans' },
      { id: '2', type: 'fill_blank', question: 'Complete: I think it ___ rain.', correctAnswer: 'will', explanation: 'Will for predictions' },
      { id: '3', type: 'rewrite', question: 'Rewrite: She will buy a car.', correctAnswer: 'She is going to buy a car.', explanation: 'Going to for planned actions' },
    ],
    level: 'beginner',
    completed: false,
    xp: 45
  },
  {
    id: '4',
    title: 'Present Perfect',
    description: 'Connect past actions to present',
    content: `The Present Perfect is used for:
• Actions that started in the past and continue
• Experiences in our life (ever/never)
• Actions that happened at an unstated time
• Recently completed actions (already/yet)

Formation: have/has + past participle`,
    examples: [
      { sentence: 'I have lived here for 5 years.', translation: 'J\'habite ici depuis 5 ans.' },
      { sentence: 'She has already eaten.', translation: 'Elle a déjà mangé.' },
      { sentence: 'Have you ever been to Japan?', translation: 'Êtes-vous déjà allé au Japon?' },
    ],
    exercises: [
      { id: '1', type: 'multiple_choice', question: 'Choose correct:', correctAnswer: 'has been', options: ['have been', 'has been', 'is been'], explanation: 'Third person singular uses has' },
      { id: '2', type: 'fill_blank', question: 'Complete: I ___ never ___ to Italy.', correctAnswer: 'have been', explanation: 'Never goes before past participle' },
      { id: '3', type: 'multiple_choice', question: '___ you finished your homework?', correctAnswer: 'Have', options: ['Have', 'Has', 'Do'], explanation: 'Present perfect uses have/has' },
    ],
    level: 'intermediate',
    completed: false,
    xp: 60
  },
  {
    id: '5',
    title: 'Modal Verbs',
    description: 'Express ability, possibility, and permission',
    content: `Modal verbs add meaning to the main verb:

CAN/COULD - Ability, permission
• She can speak French
• Could I help you?

MAY/MIGHT - Possibility
• It may rain later
• She might come

MUST/SHOULD - Obligation, advice
• You must study
• You should rest

Note: Modals are followed by base form`,
    examples: [
      { sentence: 'You should study harder.', translation: 'Tu devrais étudier plus dur.' },
      { sentence: 'She can speak three languages.', translation: 'Elle parle trois langues.' },
      { sentence: 'It might rain later.', translation: 'Il pourrait pleuvoir plus tard.' },
    ],
    exercises: [
      { id: '1', type: 'multiple_choice', question: 'Choose:', correctAnswer: 'should', options: ['should', 'can', 'must'], explanation: 'Should for advice' },
      { id: '2', type: 'fill_blank', question: 'Complete: You ___ drive carefully.', correctAnswer: 'must', explanation: 'Must for strong obligation' },
      { id: '3', type: 'multiple_choice', question: '___ I open the window?', correctAnswer: 'May', options: ['May', 'Can', 'Must'], explanation: 'May for polite permission' },
    ],
    level: 'intermediate',
    completed: false,
    xp: 55
  },
  {
    id: '6',
    title: 'Passive Voice',
    description: 'Focus on the action, not the actor',
    content: `The passive voice emphasizes the action receiver:

Formation: be + past participle
• The cake was eaten
• The letter is being written

When to use:
• Unknown actor
• Focus on action
• Formal writing`,
    examples: [
      { sentence: 'The cake was eaten.', translation: 'Le gateau a été mangé.' },
      { sentence: 'The letter was written by John.', translation: 'La lettre a été écrite par John.' },
      { sentence: 'The building is being constructed.', translation: 'Le bâtiment est en construction.' },
    ],
    exercises: [
      { id: '1', type: 'rewrite', question: 'Passive: They built the house.', correctAnswer: 'The house was built.', explanation: 'Object becomes subject + was/were + past participle' },
      { id: '2', type: 'multiple_choice', question: 'Choose passive:', correctAnswer: 'is being painted', options: ['is painting', 'is being painted', 'paints'], explanation: 'be + being + past participle' },
    ],
    level: 'advanced',
    completed: false,
    xp: 80
  },
  {
    id: '7',
    title: 'Conditional Sentences',
    description: 'Talk about hypothetical situations',
    content: `Conditionals express hypothetical situations:

Zero: General truths
• If you heat water, it boils

First: Real possibilities
• If I win, I will travel

Second: Unreal present
• If I won, I would travel

Third: Unreal past
• If she had studied, she would have passed`,
    examples: [
      { sentence: 'If you heat water, it boils.', translation: 'Si tu chauffes l\'eau, elle bout.' },
      { sentence: 'If I won the lottery, I would travel.', translation: 'Si je gagnais à la loterie, je voyagerais.' },
      { sentence: 'If she had studied, she would have passed.', translation: 'Si elle avait étudié, elle aurait réussi.' },
    ],
    exercises: [
      { id: '1', type: 'fill_blank', question: 'Complete: If it ___ (rain), I will stay home.', correctAnswer: 'rains', explanation: 'First conditional: if + present, will + verb' },
      { id: '2', type: 'multiple_choice', question: 'Choose: If I ___ rich, I would buy a yacht.', correctAnswer: 'were', options: ['was', 'were', 'am'], explanation: 'Second conditional uses were' },
    ],
    level: 'advanced',
    completed: false,
    xp: 90
  },
];

const initialVocabularyCategories: VocabularyCategory[] = [
  { id: '1', name: 'Daily Routines', icon: '📅', color: '#6366F1', words: [
    { word: 'Wake up', translation: 'Se réveiller', example: 'I wake up at 7am every day.', phonetic: '/weɪk ʌp/' },
    { word: 'Have breakfast', translation: 'Prendre le petit-déjeuner', example: 'She has breakfast at 8am.', phonetic: '/hæv ˈbrekfəst/' },
    { word: 'Go to work', translation: 'Aller au travail', example: 'I go to work by bus.', phonetic: '/ɡoʊ tə wɜːrk/' },
    { word: 'Have lunch', translation: 'Déjeuner', example: 'We have lunch at noon.', phonetic: '/hæv lʌntʃ/' },
    { word: 'Finish work', translation: 'Finir le travail', example: 'I finish work at 6pm.', phonetic: '/ˈfɪnɪʃ wɜːrk/' },
    { word: 'Have dinner', translation: 'Dîner', example: 'They have dinner together.', phonetic: '/hæv ˈdɪnər/' },
    { word: 'Go to bed', translation: 'Se coucher', example: 'I go to bed at 10pm.', phonetic: '/ɡoʊ tə bed/' },
  ]},
  { id: '2', name: 'Emotions', icon: '😊', color: '#EC4899', words: [
    { word: 'Happy', translation: 'Heureux', example: 'I am happy to see you!', phonetic: '/ˈhæpi/' },
    { word: 'Excited', translation: 'Excité', example: 'She is excited about the trip.', phonetic: '/ɪkˈsaɪtɪd/' },
    { word: 'Nervous', translation: 'Nerveux', example: 'I am nervous about the exam.', phonetic: '/ˈnɜːrvəs/' },
    { word: 'Grateful', translation: 'Reconnaissant', example: 'I am grateful for your help.', phonetic: '/ˈɡreɪtfəl/' },
    { word: 'Anxious', translation: 'Anxieux', example: 'He feels anxious about the results.', phonetic: '/ˈæŋkʃəs/' },
    { word: 'Confident', translation: 'Confiant', example: 'She feels confident about the interview.', phonetic: '/ˈkɒnfɪdənt/' },
  ]},
  { id: '3', name: 'Travel', icon: '✈️', color: '#10B981', words: [
    { word: 'Passport', translation: 'Passeport', example: 'Do you have your passport?', phonetic: '/ˈpæspɔːrt/' },
    { word: 'Boarding pass', translation: 'Carte d\'embarquement', example: 'Here is my boarding pass.', phonetic: '/ˈbɔːrdɪŋ pæs/' },
    { word: 'Hotel', translation: 'Hôtel', example: 'I booked a hotel near the beach.', phonetic: '/hoʊˈtel/' },
    { word: 'Flight', translation: 'Vol', example: 'The flight is delayed.', phonetic: '/flaɪt/' },
    { word: 'Luggage', translation: 'Bagages', example: 'Where is my luggage?', phonetic: '/ˈlʌɡɪdʒ/' },
    { word: 'Reservation', translation: 'Réservation', example: 'I have a reservation for two.', phonetic: '/ˌrezərˈveɪʃən/' },
  ]},
  { id: '4', name: 'Business', icon: '💼', color: '#F59E0B', words: [
    { word: 'Meeting', translation: 'Réunion', example: 'I have a meeting at 3pm.', phonetic: '/ˈmiːtɪŋ/' },
    { word: 'Deadline', translation: 'Date limite', example: 'The deadline is next Friday.', phonetic: '/ˈdedlaɪn/' },
    { word: 'Contract', translation: 'Contrat', example: 'Please sign the contract.', phonetic: '/ˈkɒntrækt/' },
    { word: 'Presentation', translation: 'Présentation', example: 'The presentation was excellent.', phonetic: '/ˌprezənˈteɪʃən/' },
    { word: 'Salary', translation: 'Salaire', example: 'What is your expected salary?', phonetic: '/ˈsæləri/' },
    { word: 'Promotion', translation: 'Promotion', example: 'She got a promotion!', phonetic: '/prəˈmoʊʃən/' },
  ]},
  { id: '5', name: 'Food & Drinks', icon: '🍕', color: '#EF4444', words: [
    { word: 'Appetizer', translation: 'Entrée', example: 'Let\'s order an appetizer.', phonetic: '/ˈæpɪtaɪzər/' },
    { word: 'Dessert', translation: 'Dessert', example: 'I would like dessert please.', phonetic: '/dɪˈzɜːrt/' },
    { word: 'Beverage', translation: 'Boisson', example: 'What beverage would you like?', phonetic: '/ˈbevərɪdʒ/' },
    { word: 'Ingredient', translation: 'Ingrédient', example: 'What are the ingredients?', phonetic: '/ɪnˈɡriːdiənt/' },
    { word: 'Reservation', translation: 'Réservation', example: 'I made a reservation for 7pm.', phonetic: '/ˌrezərˈveɪʃən/' },
    { word: 'Tip', translation: 'Pourboire', example: 'Should I leave a tip?', phonetic: '/tɪp/' },
  ]},
  { id: '6', name: 'Technology', icon: '💻', color: '#8B5CF6', words: [
    { word: 'Software', translation: 'Logiciel', example: 'I need to update the software.', phonetic: '/ˈsɔftwer/' },
    { word: 'Password', translation: 'Mot de passe', example: 'Enter your password.', phonetic: '/ˈpæswɜːrd/' },
    { word: 'Download', translation: 'Télécharger', example: 'I need to download this file.', phonetic: '/ˈdaʊnloʊd/' },
    { word: 'Screen', translation: 'Écran', example: 'The screen is too small.', phonetic: '/skriːn/' },
    { word: 'Battery', translation: 'Batterie', example: 'My battery is low.', phonetic: '/ˈbætəri/' },
    { word: 'Internet', translation: 'Internet', example: 'The internet is slow today.', phonetic: '/ˈɪntərnet/' },
  ]},
  { id: '7', name: 'Health', icon: '🏥', color: '#06B6D4', words: [
    { word: 'Appointment', translation: 'Rendez-vous', example: 'I have a doctor\'s appointment.', phonetic: '/əˈpɔɪntmənt/' },
    { word: 'Symptom', translation: 'Symptôme', example: 'What are your symptoms?', phonetic: '/ˈsɪmptəm/' },
    { word: 'Prescription', translation: 'Ordonnance', example: 'I need a prescription.', phonetic: '/prɪˈskrɪpʃən/' },
    { word: 'Insurance', translation: 'Assurance', example: 'Do you have insurance?', phonetic: '/ɪnˈʃʊrəns/' },
    { word: 'Pharmacy', translation: 'Pharmacie', example: 'Where is the pharmacy?', phonetic: '/ˈfɑːrməsi/' },
    { word: 'Recovery', translation: 'Récupération', example: 'It takes time for recovery.', phonetic: '/rɪˈkʌvəri/' },
  ]},
  { id: '8', name: 'Education', icon: '🎓', color: '#84CC16', words: [
    { word: 'Assignment', translation: 'Devoir', example: 'When is the assignment due?', phonetic: '/əˈsaɪnmənt/' },
    { word: 'Exam', translation: 'Examen', example: 'The exam is next week.', phonetic: '/ɪɡˈzæm/' },
    { word: 'Grade', translation: 'Note', example: 'What grade did you get?', phonetic: '/ɡreɪd/' },
    { word: 'Thesis', translation: 'Thèse', example: 'I am writing my thesis.', phonetic: '/ˈθiːsɪs/' },
    { word: 'Scholarship', translation: 'Bourse', example: 'She got a scholarship.', phonetic: '/ˈskɒlərʃɪp/' },
    { word: 'Tuition', translation: 'Frais de scolarité', example: 'Tuition is expensive.', phonetic: '/tuːˈɪʃən/' },
  ]},
  { id: '9', name: 'Sports', icon: '⚽', color: '#F97316', words: [
    { word: 'Team', translation: 'Équipe', example: 'Which team do you support?', phonetic: '/tiːm/' },
    { word: 'Champion', translation: 'Champion', example: 'She is the champion!', phonetic: '/ˈtʃæmpiən/' },
    { word: 'Tournament', translation: 'Tournoi', example: 'The tournament starts today.', phonetic: '/ˈtɔːrnəmənt/' },
    { word: 'Score', translation: 'Score', example: 'What is the score?', phonetic: '/skɔːr/' },
    { word: 'Training', translation: 'Entraînement', example: 'Training is every morning.', phonetic: '/ˈtreɪnɪŋ/' },
    { word: 'Stadium', translation: 'Stade', example: 'The stadium is full.', phonetic: '/ˈsteɪdiəm/' },
  ]},
  { id: '10', name: 'Shopping', icon: '🛍️', color: '#EC4899', words: [
    { word: 'Receipt', translation: 'Reçu', example: 'Do you need a receipt?', phonetic: '/rɪˈsiːt/' },
    { word: 'Discount', translation: 'Réduction', example: 'Is there a discount?', phonetic: '/ˈdɪskaʊnt/' },
    { word: 'Refund', translation: 'Remboursement', example: 'Can I get a refund?', phonetic: '/ˈriːfʌnd/' },
    { word: 'Receipt', translation: 'Reçu', example: 'Keep the receipt.', phonetic: '/rɪˈsiːt/' },
    { word: 'Size', translation: 'Taille', example: 'What size do you need?', phonetic: '/saɪz/' },
    { word: 'Fitting room', translation: 'Cabine d\'essayage', example: 'Where is the fitting room?', phonetic: '/ˈfɪtɪŋ ruːm/' },
  ]},
  { id: '11', name: 'Weather', icon: '🌤️', color: '#3B82F6', words: [
    { word: 'Sunny', translation: 'Ensoleillé', example: 'It is sunny today.', phonetic: '/ˈsʌni/' },
    { word: 'Cloudy', translation: 'Nuageux', example: 'It looks cloudy.', phonetic: '/ˈklaʊdi/' },
    { word: 'Humid', translation: 'Humide', example: 'It is very humid.', phonetic: '/ˈhjuːmɪd/' },
    { word: 'Forecast', translation: 'Prévisions', example: 'What is the forecast?', phonetic: '/ˈfɔːrkæst/' },
    { word: 'Temperature', translation: 'Température', example: 'What is the temperature?', phonetic: '/ˈtemprətʃər/' },
    { word: 'Breeze', translation: 'Brise', example: 'There is a nice breeze.', phonetic: '/briːz/' },
  ]},
  { id: '12', name: 'Relationships', icon: '❤️', color: '#F43F5E', words: [
    { word: 'Friend', translation: 'Ami', example: 'She is my best friend.', phonetic: '/frend/' },
    { word: 'Partner', translation: 'Partenaire', example: 'My partner and I live together.', phonetic: '/ˈpɑːrtnər/' },
    { word: 'Colleague', translation: 'Collègue', example: 'He is my colleague.', phonetic: '/ˈkɒliːɡ/' },
    { word: 'Neighbor', translation: 'Voisin', example: 'My neighbor is very nice.', phonetic: '/ˈneɪbər/' },
    { word: 'Acquaintance', translation: 'Connaissance', example: 'He is just an acquaintance.', phonetic: '/əˈkweɪntəns/' },
    { word: ' Crush', translation: 'Béguin', example: 'I have a crush on him.', phonetic: '/krʌʃ/' },
  ]},
];

const initialConversationScenarios: ConversationScenario[] = [
  { id: '1', title: 'At the Restaurant', context: 'Ordering food and making requests', icon: '🍽️', difficulty: 'easy', completed: false, messages: [
    { role: 'assistant', content: 'Good evening! Welcome to our restaurant. Do you have a reservation?' },
    { role: 'user', options: ['Yes, under the name Smith', 'No, do you have a table for two?', 'We need a table please'] },
    { role: 'assistant', content: 'Perfect! Right this way. Here are your menus.' },
    { role: 'user', options: ['Thank you. What do you recommend?', 'Can I see the drinks menu?', 'What are your specials today?'] },
    { role: 'assistant', content: 'Our specials today are grilled salmon and beef tenderloin. Would you like to start with some drinks?' },
    { role: 'user', options: ['I\'ll have a glass of red wine please', 'What wines do you have?', 'Can we have some water?'] },
  ]},
  { id: '2', title: 'Shopping', context: 'Buying clothes and asking for sizes', icon: '🛍️', difficulty: 'easy', completed: false, messages: [
    { role: 'assistant', content: 'Hello! Can I help you find something today?' },
    { role: 'user', options: ['I\'m looking for a jacket', 'Do you have this in a larger size?', 'How much is this?'] },
    { role: 'assistant', content: 'We have some nice jackets over here. What size are you looking for?' },
    { role: 'user', options: ['I\'m a medium', 'Do you have this in blue?', 'Can I try this on?'] },
    { role: 'assistant', content: 'The fitting rooms are right over there. Let me know if you need any help!' },
  ]},
  { id: '3', title: 'Asking Directions', context: 'Finding your way around', icon: '🗺️', difficulty: 'easy', completed: false, messages: [
    { role: 'assistant', content: 'Excuse me, do you need help finding somewhere?' },
    { role: 'user', options: ['Yes, where is the nearest metro station?', 'Can you tell me how to get to the museum?', 'Is there a pharmacy nearby?'] },
    { role: 'assistant', content: 'The metro station is just two blocks from here. Go straight and turn left.' },
    { role: 'user', options: ['Thank you! How long does it take to walk?', 'Is it far from here?', 'Are there any good restaurants on the way?'] },
  ]},
  { id: '4', title: 'Job Interview', context: 'Common interview questions', icon: '💼', difficulty: 'medium', completed: false, messages: [
    { role: 'assistant', content: 'Thank you for coming in today. Can you tell me about yourself?' },
    { role: 'user', options: ['I have five years of experience in marketing', 'I am a hard worker', 'Let me start from the beginning...'] },
    { role: 'assistant', content: 'Interesting! What are your greatest strengths?' },
    { role: 'user', options: ['I am very organized and detail-oriented', 'I work well under pressure', 'I would say my communication skills'] },
    { role: 'assistant', content: 'Great! Where do you see yourself in five years?' },
  ]},
  { id: '5', title: 'At the Hotel', context: 'Checking in and making requests', icon: '🏨', difficulty: 'easy', completed: false, messages: [
    { role: 'assistant', content: 'Good evening! Do you have a reservation?' },
    { role: 'user', options: ['Yes, I booked a room for three nights', 'I need to check in please', 'Do you have any rooms available?'] },
    { role: 'assistant', content: 'May I have your name, please?' },
    { role: 'user', options: ['It\'s under Johnson', 'The name is John Smith', 'I have a confirmation number'] },
  ]},
  { id: '6', title: 'Making Phone Calls', context: 'Professional phone etiquette', icon: '📞', difficulty: 'medium', completed: false, messages: [
    { role: 'assistant', content: 'Good morning, XYZ Company. How may I help you?' },
    { role: 'user', options: ['I would like to speak with Mr. Smith please', 'Can I leave a message?', 'What time does the office close?'] },
    { role: 'assistant', content: 'May I ask who is calling?' },
    { role: 'user', options: ['This is Jane Doe from ABC Corp', 'My name is...', 'I am a client of the company'] },
  ]},
  { id: '7', title: 'At the Doctor', context: 'Describing symptoms', icon: '🏥', difficulty: 'medium', completed: false, messages: [
    { role: 'assistant', content: 'Good morning. What brings you in today?' },
    { role: 'user', options: ['I have been feeling sick for three days', 'I need a check-up please', 'I have a headache and fever'] },
    { role: 'assistant', content: 'I see. How severe are the symptoms?' },
    { role: 'user', options: ['It started as a mild cold', 'The headache is quite bad', 'I feel very tired'] },
  ]},
  { id: '8', title: 'At the Bank', context: 'Banking transactions', icon: '🏦', difficulty: 'medium', completed: false, messages: [
    { role: 'assistant', content: 'Hello! How can I help you today?' },
    { role: 'user', options: ['I would like to open a new account', 'I need to transfer some money', 'Can I get a new debit card?'] },
    { role: 'assistant', content: 'Of course! What type of account are you interested in?' },
    { role: 'user', options: ['A savings account please', 'What are the fees?', 'What is the interest rate?'] },
  ]},
  { id: '9', title: 'At the Gym', context: 'Membership and inquiries', icon: '🏋️', difficulty: 'easy', completed: false, messages: [
    { role: 'assistant', content: 'Hi there! Welcome to FitLife Gym. Are you interested in a membership?' },
    { role: 'user', options: ['Yes, what are the membership options?', 'I want to cancel my membership', 'Can I have a tour of the gym?'] },
    { role: 'assistant', content: 'We have monthly and annual plans. Would you like to see our facilities first?' },
    { role: 'user', options: ['Yes please', 'What does the monthly plan include?', 'I prefer the annual plan'] },
  ]},
  { id: '10', title: 'Job Interview Part 2', context: 'Salary and benefits discussion', icon: '📈', difficulty: 'hard', completed: false, messages: [
    { role: 'assistant', content: 'We would like to make you an offer. What are your salary expectations?' },
    { role: 'user', options: ['I was thinking around $70,000', 'That depends on the benefits package', 'What is the typical range for this position?'] },
    { role: 'assistant', content: 'We can offer $65,000 plus health insurance and 401k matching.' },
    { role: 'user', options: ['Can I think about it and get back to you?', 'That sounds reasonable, I accept!', 'Would you consider $70,000?'] },
  ]},
];

const initialListeningExercises: ListeningExercise[] = [
  { id: '1', title: 'At a Coffee Shop', transcript: 'Good morning! What can I get for you? I would like a large cappuccino please. Would you like that for here or to go? For here, please. That will be four fifty. Here\'s five dollars. Keep the change. Thank you! Have a nice day!', translation: 'Au café - commande et paiement', level: 'beginner', duration: 3, completed: false, questions: [
    { id: 'q1', question: 'What did they order?', options: ['Latte', 'Cappuccino', 'Espresso'], correctAnswer: 'Cappuccino' },
    { id: 'q2', question: 'How much was it?', options: ['$4.00', '$4.50', '$5.00'], correctAnswer: '$4.50' },
  ]},
  { id: '2', title: 'Asking for Directions', transcript: 'Excuse me, can you help me? Of course! I\'m looking for the nearest metro station. The station is about a ten-minute walk from here. Go straight down this street, then turn left at the second traffic light. You\'ll see it on your right. Thank you so much! You\'re welcome!', translation: 'Demander son chemin', level: 'beginner', duration: 3, completed: false, questions: [
    { id: 'q1', question: 'How far is the station?', options: ['5 minutes', '10 minutes', '15 minutes'], correctAnswer: '10 minutes' },
    { id: 'q2', question: 'Where should they turn?', options: ['Right at first light', 'Left at second light', 'Go straight'], correctAnswer: 'Left at second light' },
  ]},
  { id: '3', title: 'Job Interview Introduction', transcript: 'Thank you for meeting with me today. Can you tell me a little about yourself? Of course! I graduated from university three years ago, and since then I\'ve been working in marketing. I love creating engaging content and数据分析. What interests you most about this position? Your company has a great reputation, and I believe my skills would be a great match.', translation: 'Entretien d\'embauche', level: 'intermediate', duration: 4, completed: false, questions: [
    { id: 'q1', question: 'How long have they been working?', options: ['1 year', '3 years', '5 years'], correctAnswer: '3 years' },
    { id: 'q2', question: 'What field do they work in?', options: ['IT', 'Marketing', 'Sales'], correctAnswer: 'Marketing' },
  ]},
  { id: '4', title: 'At the Doctor\'s Office', transcript: 'Good afternoon, please have a seat. What seems to be the problem? I\'ve had a bad cough for about a week now. Have you had any fever? Yes, especially in the evenings. Let me check your throat and listen to your lungs. I think it might be a viral infection. You should rest and drink plenty of fluids.', translation: 'Chez le médecin', level: 'intermediate', duration: 4, completed: false, questions: [
    { id: 'q1', question: 'How long have they been sick?', options: ['3 days', 'A week', 'Two weeks'], correctAnswer: 'A week' },
    { id: 'q2', question: 'When is the fever worse?', options: ['Morning', 'Afternoon', 'Evening'], correctAnswer: 'Evening' },
  ]},
  { id: '5', title: 'Business Meeting', transcript: 'Let\'s discuss the quarterly results. Overall, it\'s been a strong quarter. Revenue is up by fifteen percent compared to last year. That\'s great news! Yes, especially in the European market. However, we did face some challenges in Asia. What were the main issues? Currency fluctuations and increased competition. I see. What\'s our strategy for next quarter?', translation: 'Réunion d\'affaires', level: 'advanced', duration: 5, completed: false, questions: [
    { id: 'q1', question: 'How much did revenue increase?', options: ['5%', '10%', '15%'], correctAnswer: '15%' },
    { id: 'q2', question: 'Where did they face challenges?', options: ['Europe', 'Asia', 'America'], correctAnswer: 'Asia' },
  ]},
];

const initialAchievements: Achievement[] = [
  { id: '1', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', requirement: 1, type: 'lessons', unlocked: false },
  { id: '2', title: 'Dedicated Learner', description: 'Complete 5 lessons', icon: '📚', requirement: 5, type: 'lessons', unlocked: false },
  { id: '3', title: 'Knowledge Seeker', description: 'Complete 20 lessons', icon: '🧠', requirement: 20, type: 'lessons', unlocked: false },
  { id: '4', title: 'Grammar Master', description: 'Complete 5 grammar lessons', icon: '📖', requirement: 5, type: 'grammar', unlocked: false },
  { id: '5', title: 'On Fire', description: 'Reach a 3-day streak', icon: '🔥', requirement: 3, type: 'streak', unlocked: false },
  { id: '6', title: 'Week Warrior', description: 'Reach a 7-day streak', icon: '💪', requirement: 7, type: 'streak', unlocked: false },
  { id: '7', title: 'Month Master', description: 'Reach a 30-day streak', icon: '👑', requirement: 30, type: 'streak', unlocked: false },
  { id: '8', title: 'Word Collector', description: 'Master 10 words', icon: '📝', requirement: 10, type: 'words', unlocked: false },
  { id: '9', title: 'Vocabulary Expert', description: 'Master 50 words', icon: '🏆', requirement: 50, type: 'words', unlocked: false },
  { id: '10', title: 'Conversation Starter', description: 'Complete 5 conversations', icon: '💬', requirement: 5, type: 'conversations', unlocked: false },
  { id: '11', title: 'Chat Master', description: 'Complete 20 conversations', icon: '🎓', requirement: 20, type: 'conversations', unlocked: false },
  { id: '12', title: 'XP Hunter', description: 'Earn 1000 XP', icon: '⭐', requirement: 1000, type: 'xp', unlocked: false },
  { id: '13', title: 'XP Legend', description: 'Earn 5000 XP', icon: '💎', requirement: 5000, type: 'xp', unlocked: false },
  { id: '14', title: 'Ear Training', description: 'Complete 3 listening exercises', icon: '👂', requirement: 3, type: 'listening', unlocked: false },
  { id: '15', title: 'Perfect Listener', description: 'Complete 10 listening exercises', icon: '🎧', requirement: 10, type: 'listening', unlocked: false },
];

const initialDailyGoals: DailyGoal[] = [
  { id: '1', type: 'lessons', target: 1, progress: 0, completed: false },
  { id: '2', type: 'practice', target: 10, progress: 0, completed: false },
  { id: '3', type: 'streak', target: 1, progress: 0, completed: false },
  { id: '4', type: 'review', target: 5, progress: 0, completed: false },
];

const initialSettings: AppSettings = {
  notifications: true,
  soundEffects: true,
  hapticFeedback: true,
  dailyGoal: 15,
  preferredAccent: 'us',
  theme: 'dark',
};

const initialProgress: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastPracticeDate: null,
  lessonsCompleted: 0,
  wordsLearned: 0,
  conversationsCompleted: 0,
  totalPracticeTime: 0,
  grammarLessonsCompleted: 0,
  listeningExercisesCompleted: 0,
};

const initialFlashcards: FlashCard[] = [
  { id: '1', word: 'Hello', translation: 'Bonjour', example: 'Hello, how are you?', pronunciation: '/həˈloʊ/', mastered: false, easeFactor: 2.5, interval: 0, repetitions: 0 },
  { id: '2', word: 'Thank you', translation: 'Merci', example: 'Thank you for your help.', pronunciation: '/θæŋk juː/', mastered: false, easeFactor: 2.5, interval: 0, repetitions: 0 },
  { id: '3', word: 'Please', translation: 'S\'il vous plaît', example: 'Please help me.', pronunciation: '/pliːz/', mastered: false, easeFactor: 2.5, interval: 0, repetitions: 0 },
  { id: '4', word: 'Excuse me', translation: 'Excusez-moi', example: 'Excuse me, where is the station?', pronunciation: '/ɪkˈskjuːz miː/', mastered: false, easeFactor: 2.5, interval: 0, repetitions: 0 },
  { id: '5', word: 'Sorry', translation: 'Pardon', example: 'Sorry, I didn\'t understand.', pronunciation: '/ˈsɒri/', mastered: false, easeFactor: 2.5, interval: 0, repetitions: 0 },
  { id: '6', word: 'Welcome', translation: 'Bienvenue', example: 'Welcome to our home!', pronunciation: '/ˈwelkəm/', mastered: false, easeFactor: 2.5, interval: 0, repetitions: 0 },
  { id: '7', word: 'Goodbye', translation: 'Au revoir', example: 'Goodbye, see you tomorrow!', pronunciation: '/ɡʊdˈbaɪ/', mastered: false, easeFactor: 2.5, interval: 0, repetitions: 0 },
  { id: '8', word: 'Congratulations', translation: 'Félicitations', example: 'Congratulations on your success!', pronunciation: '/kənˌɡrætʃəˈleɪʃənz/', mastered: false, easeFactor: 2.5, interval: 0, repetitions: 0 },
  { id: '9', word: 'Appreciate', translation: 'Apprécier', example: 'I really appreciate your help.', pronunciation: '/əˈpriːʃieɪt/', mastered: false, easeFactor: 2.5, interval: 0, repetitions: 0 },
  { id: '10', word: 'Amazing', translation: 'Incroyable', example: 'This is amazing!', pronunciation: '/əˈmeɪzɪŋ/', mastered: false, easeFactor: 2.5, interval: 0, repetitions: 0 },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      userLevel: 'beginner',
      userGoal: '',
      progress: initialProgress,
      lessons: initialLessons,
      grammarLessons: initialGrammarLessons,
      vocabularyCategories: initialVocabularyCategories,
      flashcards: initialFlashcards,
      achievements: initialAchievements,
      dailyGoals: initialDailyGoals,
      conversationScenarios: initialConversationScenarios,
      listeningExercises: initialListeningExercises,
      settings: initialSettings,
      currentStreak: 0,

      setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
      setUserLevel: (level) => set({ userLevel: level }),
      setUserGoal: (goal) => set({ userGoal: goal }),
      
      addXP: (amount) => {
        const { progress } = get();
        const newXP = progress.xp + amount;
        const newLevel = Math.floor(newXP / 500) + 1;
        set({
          progress: { ...progress, xp: newXP, level: newLevel },
        });
        get().checkAchievements();
      },
      
      completeLesson: (lessonId) => {
        const { lessons, addXP, dailyGoals } = get();
        const lesson = lessons.find((l) => l.id === lessonId);
        if (lesson && !lesson.completed) {
          addXP(lesson.xp);
          const newLessons = lessons.map((l) =>
            l.id === lessonId ? { ...l, completed: true } : l
          );
          const completedCount = newLessons.filter((l) => l.completed).length;
          set({
            lessons: newLessons,
            progress: { ...get().progress, lessonsCompleted: completedCount },
            dailyGoals: dailyGoals.map((g) =>
              g.type === 'lessons' ? { ...g, progress: g.progress + 1, completed: g.progress + 1 >= g.target } : g
            ),
          });
          get().checkAchievements();
        }
      },

      completeGrammarLesson: (lessonId) => {
        const { grammarLessons, addXP } = get();
        const lesson = grammarLessons.find((l) => l.id === lessonId);
        if (lesson && !lesson.completed) {
          addXP(lesson.xp);
          set({
            grammarLessons: grammarLessons.map((l) =>
              l.id === lessonId ? { ...l, completed: true } : l
            ),
            progress: { ...get().progress, grammarLessonsCompleted: get().progress.grammarLessonsCompleted + 1 },
          });
          get().checkAchievements();
        }
      },
      
      completeFlashcard: (cardId, quality) => {
        const { flashcards, addXP } = get();
        const card = flashcards.find((c) => c.id === cardId);
        if (!card) return;

        let { easeFactor, interval, repetitions } = card;
        
        if (quality >= 3) {
          if (repetitions === 0) interval = 1;
          else if (repetitions === 1) interval = 6;
          else interval = Math.round(interval * easeFactor);
          
          repetitions += 1;
          easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
          
          if (repetitions >= 3 && interval >= 21) {
            addXP(10);
          }
        } else {
          repetitions = 0;
          interval = 1;
        }

        const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;
        
        const mastered = repetitions >= 3 && interval >= 21;
        
        set({
          flashcards: flashcards.map((c) =>
            c.id === cardId ? { ...c, easeFactor, interval, repetitions, nextReview, mastered } : c
          ),
          progress: mastered ? { ...get().progress, wordsLearned: get().progress.wordsLearned + 1 } : get().progress,
        });
        get().checkAchievements();
      },

      completeConversation: (scenarioId) => {
        const { conversationScenarios, addXP } = get();
        const scenario = conversationScenarios.find((s) => s.id === scenarioId);
        if (scenario && !scenario.completed) {
          addXP(25);
          set({
            conversationScenarios: conversationScenarios.map((s) =>
              s.id === scenarioId ? { ...s, completed: true } : s
            ),
            progress: { ...get().progress, conversationsCompleted: get().progress.conversationsCompleted + 1 },
          });
          get().checkAchievements();
        }
      },

      completeListeningExercise: (exerciseId) => {
        const { listeningExercises, addXP } = get();
        const exercise = listeningExercises.find((e) => e.id === exerciseId);
        if (exercise && !exercise.completed) {
          addXP(30);
          set({
            listeningExercises: listeningExercises.map((e) =>
              e.id === exerciseId ? { ...e, completed: true } : e
            ),
            progress: { ...get().progress, listeningExercisesCompleted: get().progress.listeningExercisesCompleted + 1 },
          });
          get().checkAchievements();
        }
      },
      
      updateStreak: () => {
        const { progress, currentStreak } = get();
        const today = new Date().toDateString();
        const lastDate = progress.lastPracticeDate;
        
        if (lastDate === today) return;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        let newStreak: number;
        if (lastDate === yesterday.toDateString()) {
          newStreak = currentStreak + 1;
        } else {
          newStreak = 1;
        }

        const longestStreak = Math.max(progress.longestStreak, newStreak);
        
        set({
          currentStreak: newStreak,
          progress: { ...progress, streak: newStreak, longestStreak, lastPracticeDate: today },
          dailyGoals: get().dailyGoals.map((g) =>
            g.type === 'streak' ? { ...g, progress: newStreak, completed: newStreak >= g.target } : g
          ),
        });
        get().checkAchievements();
      },

      updateDailyGoal: (goalId, progress) => {
        set({
          dailyGoals: get().dailyGoals.map((g) =>
            g.id === goalId ? { ...g, progress, completed: progress >= g.target } : g
          ),
        });
      },

      updateSettings: (newSettings) => {
        set({ settings: { ...get().settings, ...newSettings } });
      },

      checkAchievements: () => {
        const { progress, achievements } = get();
        const updatedAchievements = achievements.map((a) => {
          if (a.unlocked) return a;
          
          let current = 0;
          switch (a.type) {
            case 'lessons': current = progress.lessonsCompleted; break;
            case 'grammar': current = progress.grammarLessonsCompleted; break;
            case 'streak': current = progress.streak; break;
            case 'words': current = progress.wordsLearned; break;
            case 'xp': current = progress.xp; break;
            case 'conversations': current = progress.conversationsCompleted; break;
            case 'listening': current = progress.listeningExercisesCompleted; break;
          }
          
          if (current >= a.requirement) {
            return { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
          }
          return a;
        });
        
        if (JSON.stringify(updatedAchievements) !== JSON.stringify(achievements)) {
          set({ achievements: updatedAchievements });
        }
      },

      getDueCards: () => {
        const { flashcards } = get();
        const now = Date.now();
        return flashcards.filter((card) => {
          if (!card.nextReview) return true;
          return card.nextReview <= now;
        });
      },
      
      resetProgress: () => set({
        progress: initialProgress,
        lessons: initialLessons,
        grammarLessons: initialGrammarLessons,
        flashcards: initialFlashcards,
        achievements: initialAchievements,
        dailyGoals: initialDailyGoals,
        conversationScenarios: initialConversationScenarios,
        listeningExercises: initialListeningExercises,
        currentStreak: 0,
      }),
    }),
    {
      name: 'fluent-english-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
