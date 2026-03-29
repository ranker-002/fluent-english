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
}

export interface GrammarLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  examples: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  xp: number;
}

export interface VocabularyCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  words: { word: string; translation: string; example: string }[];
}

export interface FlashCard {
  id: string;
  word: string;
  translation: string;
  example: string;
  pronunciation: string;
  mastered: boolean;
  // Spaced Repetition (SM-2) fields
  nextReviewDate: number | null; // timestamp in ms, null = not yet reviewed
  interval: number; // days until next review
  easinessFactor: number; // EF factor (1.3+)
  reviewCount: number; // number of successful reviews
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'lessons' | 'streak' | 'words' | 'xp' | 'conversations';
  unlocked: boolean;
}

export interface DailyGoal {
  id: string;
  type: 'lessons' | 'practice' | 'streak';
  target: number;
  progress: number;
  completed: boolean;
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
  lastGoalResetDate: string; // UTC date string, for daily goals reset
}

interface AppSettings {
  notifications: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  dailyGoal: number;
  preferredAccent: 'us' | 'uk';
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
  settings: AppSettings;
  currentStreak: number;
  
  setHasCompletedOnboarding: (value: boolean) => void;
  setUserLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  setUserGoal: (goal: string) => void;
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completeGrammarLesson: (lessonId: string) => void;
  completeFlashcard: (cardId: string) => void;
  completeConversation: () => void;
  updateStreak: () => void;
  updateDailyGoal: (goalId: string, progress: number) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  checkAchievements: () => void;
  resetProgress: () => void;
}

const initialLessons: Lesson[] = [
  { id: '1', title: 'Greetings & Introductions', description: 'Learn to introduce yourself and greet others', duration: 15, level: 'beginner', category: 'basics', completed: false, xp: 50 },
  { id: '2', title: 'At the Restaurant', description: 'Order food and make requests', duration: 20, level: 'beginner', category: 'travel', completed: false, xp: 60 },
  { id: '3', title: 'Shopping Conversations', description: 'Ask for sizes, prices, and purchases', duration: 20, level: 'beginner', category: 'shopping', completed: false, xp: 60 },
  { id: '4', title: 'Asking for Directions', description: 'Learn to navigate and give directions', duration: 25, level: 'intermediate', category: 'travel', completed: false, xp: 75 },
  { id: '5', title: 'Job Interview', description: 'Practice common interview questions', duration: 30, level: 'intermediate', category: 'career', completed: false, xp: 100 },
  { id: '6', title: 'Making Phone Calls', description: 'Handle phone conversations professionally', duration: 25, level: 'intermediate', category: 'communication', completed: false, xp: 80 },
  { id: '7', title: 'At the Airport', description: 'Check-in, security, boarding procedures', duration: 25, level: 'beginner', category: 'travel', completed: false, xp: 70 },
  { id: '8', title: 'Job Interview Part 2', description: 'Advanced interview techniques', duration: 35, level: 'advanced', category: 'career', completed: false, xp: 120 },
];

const initialGrammarLessons: GrammarLesson[] = [
  { id: '1', title: 'Present Simple', description: 'Learn how to describe daily routines', content: 'The present simple is used to describe habits, general truths, and scheduled events.', examples: ['I work every day.', 'She loves coffee.', 'The sun rises in the east.'], level: 'beginner', completed: false, xp: 40 },
  { id: '2', title: 'Past Simple', description: 'Describe completed actions in the past', content: 'The past simple is used for actions that happened at a specific time in the past.', examples: ['I visited Paris last year.', 'She ate breakfast at 8am.', 'They watched a movie yesterday.'], level: 'beginner', completed: false, xp: 40 },
  { id: '3', title: 'Future Tense', description: 'Talk about plans and predictions', content: 'We use "will" for predictions and "going to" for planned actions.', examples: ['I will call you tomorrow.', 'It\'s going to rain.', 'She is going to study medicine.'], level: 'beginner', completed: false, xp: 45 },
  { id: '4', title: 'Present Perfect', description: 'Connect past actions to present', content: 'Used for actions that started in the past and continue to the present.', examples: ['I have lived here for 5 years.', 'She has already eaten.', 'Have you ever been to Japan?'], level: 'intermediate', completed: false, xp: 60 },
  { id: '5', title: 'Modal Verbs', description: 'Express ability, possibility, and permission', content: 'Modal verbs include can, could, may, might, must, should, would.', examples: ['You should study harder.', 'She can speak three languages.', 'It might rain later.'], level: 'intermediate', completed: false, xp: 55 },
  { id: '6', title: 'Passive Voice', description: 'Focus on the action, not the actor', content: 'Use passive voice when the receiver of the action is more important.', examples: ['The cake was eaten.', 'The letter was written by John.', 'The building is being constructed.'], level: 'advanced', completed: false, xp: 80 },
  { id: '7', title: 'Conditional Sentences', description: 'Talk about hypothetical situations', content: 'Zero, first, second, and third conditionals.', examples: ['If you heat water, it boils.', 'If I won the lottery, I would travel.', 'If she had studied, she would have passed.'], level: 'advanced', completed: false, xp: 90 },
];

const initialVocabularyCategories: VocabularyCategory[] = [
  { id: '1', name: 'Daily Routines', icon: '📅', color: '#6366F1', words: [{ word: 'Wake up', translation: 'Se réveiller', example: 'I wake up at 7am every day.' }, { word: 'Have breakfast', translation: 'Prendre le petit-déjeuner', example: 'She has breakfast at 8am.' }, { word: 'Go to work', translation: 'Aller au travail', example: 'I go to work by bus.' }, { word: 'Have lunch', translation: 'Déjeuner', example: 'We have lunch at noon.' }] },
  { id: '2', name: 'Emotions', icon: '😊', color: '#EC4899', words: [{ word: 'Happy', translation: 'Heureux', example: 'I am happy to see you!' }, { word: 'Excited', translation: 'Excité', example: 'She is excited about the trip.' }, { word: 'Nervous', translation: 'Nerveux', example: 'I am nervous about the exam.' }, { word: 'Grateful', translation: 'Reconnaissant', example: 'I am grateful for your help.' }] },
  { id: '3', name: 'Travel', icon: '✈️', color: '#10B981', words: [{ word: 'Passport', translation: 'Passeport', example: 'Do you have your passport?' }, { word: 'Boarding pass', translation: 'Carte d\'embarquement', example: 'Here is my boarding pass.' }, { word: 'Hotel', translation: 'Hôtel', example: 'I booked a hotel near the beach.' }, { word: 'Flight', translation: 'Vol', example: 'The flight is delayed.' }] },
  { id: '4', name: 'Business', icon: '💼', color: '#F59E0B', words: [{ word: 'Meeting', translation: 'Réunion', example: 'I have a meeting at 3pm.' }, { word: 'Deadline', translation: 'Date limite', example: 'The deadline is next Friday.' }, { word: 'Contract', translation: 'Contrat', example: 'Please sign the contract.' }, { word: 'Presentation', translation: 'Présentation', example: 'The presentation was excellent.' }] },
];

const initialAchievements: Achievement[] = [
  { id: '1', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', requirement: 1, type: 'lessons', unlocked: false },
  { id: '2', title: 'Dedicated Learner', description: 'Complete 5 lessons', icon: '📚', requirement: 5, type: 'lessons', unlocked: false },
  { id: '3', title: 'Knowledge Seeker', description: 'Complete 20 lessons', icon: '🧠', requirement: 20, type: 'lessons', unlocked: false },
  { id: '4', title: 'On Fire', description: 'Reach a 3-day streak', icon: '🔥', requirement: 3, type: 'streak', unlocked: false },
  { id: '5', title: 'Week Warrior', description: 'Reach a 7-day streak', icon: '💪', requirement: 7, type: 'streak', unlocked: false },
  { id: '6', title: 'Month Master', description: 'Reach a 30-day streak', icon: '👑', requirement: 30, type: 'streak', unlocked: false },
  { id: '7', title: 'Word Collector', description: 'Master 10 words', icon: '📝', requirement: 10, type: 'words', unlocked: false },
  { id: '8', title: 'Vocabulary Expert', description: 'Master 50 words', icon: '🏆', requirement: 50, type: 'words', unlocked: false },
  { id: '9', title: 'Conversation Starter', description: 'Complete 5 conversations', icon: '💬', requirement: 5, type: 'conversations', unlocked: false },
  { id: '10', title: 'XP Hunter', description: 'Earn 1000 XP', icon: '⭐', requirement: 1000, type: 'xp', unlocked: false },
];

const initialDailyGoals: DailyGoal[] = [
  { id: '1', type: 'lessons', target: 1, progress: 0, completed: false },
  { id: '2', type: 'practice', target: 10, progress: 0, completed: false },
  { id: '3', type: 'streak', target: 1, progress: 0, completed: false },
];

const initialSettings: AppSettings = {
  notifications: true,
  soundEffects: true,
  hapticFeedback: true,
  dailyGoal: 15,
  preferredAccent: 'us',
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
  lastGoalResetDate: new Date().toISOString().slice(0, 10), // today UTC
};

const initialFlashcards: FlashCard[] = [
  { id: '1', word: 'Hello', translation: 'Bonjour', example: 'Hello, how are you?', pronunciation: '/həˈloʊ/', mastered: false, nextReviewDate: null, interval: 0, easinessFactor: 2.5, reviewCount: 0 },
  { id: '2', word: 'Thank you', translation: 'Merci', example: 'Thank you for your help.', pronunciation: '/θæŋk juː/', mastered: false, nextReviewDate: null, interval: 0, easinessFactor: 2.5, reviewCount: 0 },
  { id: '3', word: 'Please', translation: 'S\'il vous plaît', example: 'Please help me.', pronunciation: '/pliːz/', mastered: false, nextReviewDate: null, interval: 0, easinessFactor: 2.5, reviewCount: 0 },
  { id: '4', word: 'Excuse me', translation: 'Excusez-moi', example: 'Excuse me, where is the station?', pronunciation: '/ɪkˈskjuːz miː/', mastered: false, nextReviewDate: null, interval: 0, easinessFactor: 2.5, reviewCount: 0 },
  { id: '5', word: 'Sorry', translation: 'Pardon', example: 'Sorry, I didn\'t understand.', pronunciation: '/ˈsɒri/', mastered: false, nextReviewDate: null, interval: 0, easinessFactor: 2.5, reviewCount: 0 },
  { id: '6', word: 'Welcome', translation: 'Bienvenue', example: 'Welcome to our home!', pronunciation: '/ˈwelkəm/', mastered: false, nextReviewDate: null, interval: 0, easinessFactor: 2.5, reviewCount: 0 },
  { id: '7', word: 'Goodbye', translation: 'Au revoir', example: 'Goodbye, see you tomorrow!', pronunciation: '/ɡʊdˈbaɪ/', mastered: false, nextReviewDate: null, interval: 0, easinessFactor: 2.5, reviewCount: 0 },
  { id: '8', word: 'Congratulations', translation: 'Félicitations', example: 'Congratulations on your success!', pronunciation: '/kənˌɡrætʃəˈleɪʃənz/', mastered: false, nextReviewDate: null, interval: 0, easinessFactor: 2.5, reviewCount: 0 },
  { id: '9', word: 'Appreciate', translation: 'Apprécier', example: 'I really appreciate your help.', pronunciation: '/əˈpriːʃieɪt/', mastered: false, nextReviewDate: null, interval: 0, easinessFactor: 2.5, reviewCount: 0 },
  { id: '10', word: 'Amazing', translation: 'Incroyable', example: 'This is amazing!', pronunciation: '/əˈmeɪzɪŋ/', mastered: false, nextReviewDate: null, interval: 0, easinessFactor: 2.5, reviewCount: 0 },
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
          progress: {
            ...progress,
            xp: newXP,
            level: newLevel,
          },
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
            progress: {
              ...get().progress,
              lessonsCompleted: completedCount,
            },
            dailyGoals: dailyGoals.map((g) =>
              g.type === 'lessons' ? { ...g, progress: g.progress + 1, completed: g.progress + 1 >= g.target } : g
            ),
          });
          get().checkAchievements();
          get().updateStreak();
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
            progress: {
              ...get().progress,
              grammarLessonsCompleted: get().progress.grammarLessonsCompleted + 1,
            },
          });
          get().checkAchievements();
          get().updateStreak();
        }
      },
      
      /**
       * Review a flashcard with a quality rating (0-5)
       * Implements SM-2 algorithm for spaced repetition
       * quality: 0-5 (0=complete blackout, 5=perfect)
       */
      reviewFlashcard: (cardId: string, quality: number) => {
        const { flashcards, addXP, checkAchievements, updateStreak } = get();
        const card = flashcards.find(c => c.id === cardId);
        if (!card) return;

        // SM-2 algorithm
        const { easinessFactor, interval, reviewCount } = card;
        let newEF = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (newEF < 1.3) newEF = 1.3;

        let newInterval: number;
        if (reviewCount === 0) {
          newInterval = 1;
        } else if (reviewCount === 1) {
          newInterval = 3;
        } else {
          newInterval = Math.ceil(interval * newEF);
        }

        const newReviewCount = reviewCount + 1;
        const now = Date.now();
        const nextReviewDate = now + newInterval * 24 * 60 * 60 * 1000; // days to ms

        // Determine mastery: quality >= 4 indicates card is learned
        const wasMastered = card.mastered;
        const newMastered = quality >= 4 ? true : wasMastered;

        // Update card
        const updatedFlashcards = flashcards.map(c =>
          c.id === cardId ? {
            ...c,
            easinessFactor: newEF,
            interval: newInterval,
            reviewCount: newReviewCount,
            nextReviewDate,
            mastered: newMastered,
          } : c
        );

        // Update wordsLearned count based on total mastered
        const masteredCount = updatedFlashcards.filter(c => c.mastered).length;

        set({
          flashcards: updatedFlashcards,
          progress: {
            ...get().progress,
            wordsLearned: masteredCount,
          },
        });

        addXP(quality >= 4 ? 10 : 5); // bonus XP for correct recall
        checkAchievements();
        updateStreak();
      },

      skipFlashcard: (cardId: string) => {
        get().reviewFlashcard(cardId, 2);
      },

      completeFlashcard: (cardId: string) => {
        get().reviewFlashcard(cardId, 5);
      },

      completeConversation: () => {
        const { addXP } = get();
        addXP(25);
        set({
          progress: {
            ...get().progress,
            conversationsCompleted: get().progress.conversationsCompleted + 1,
          },
        });
        get().checkAchievements();
        get().updateStreak();
      },
      
      updateStreak: () => {
        const { progress, currentStreak } = get();
        // Use UTC date strings to avoid timezone issues
        const getUTCDateString = (date: Date) => date.toISOString().slice(0, 10);
        const today = getUTCDateString(new Date());
        const lastDate = progress.lastPracticeDate;
        
        if (lastDate === today) return;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getUTCDateString(yesterday);
        
        let newStreak: number;
        if (lastDate === yesterdayStr) {
          newStreak = currentStreak + 1;
        } else {
          newStreak = 1;
        }

        const longestStreak = Math.max(progress.longestStreak, newStreak);
        
        set({
          currentStreak: newStreak,
          progress: {
            ...progress,
            streak: newStreak,
            longestStreak,
            lastPracticeDate: today,
          },
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
        set({
          settings: { ...get().settings, ...newSettings },
        });
      },

      /**
       * Resets daily goals (except streak) if the date has changed.
       * Should be called on app launch or periodically.
       */
      maybeResetDailyGoals: () => {
        const { progress, dailyGoals } = get();
        const today = new Date().toISOString().slice(0, 10);
        if (progress.lastGoalResetDate === today) return;

        const updatedDailyGoals = dailyGoals.map(g =>
          g.type === 'streak' ? g : { ...g, progress: 0, completed: false }
        );

        set({
          progress: {
            ...progress,
            lastGoalResetDate: today,
          },
          dailyGoals: updatedDailyGoals,
        });
      },

      checkAchievements: () => {
        const { progress, achievements } = get();
        const updatedAchievements = achievements.map((a) => {
          if (a.unlocked) return a;
          
          let current = 0;
          switch (a.type) {
            case 'lessons': current = progress.lessonsCompleted; break;
            case 'streak': current = progress.streak; break;
            case 'words': current = progress.wordsLearned; break;
            case 'xp': current = progress.xp; break;
            case 'conversations': current = progress.conversationsCompleted; break;
          }
          
          if (current >= a.requirement) {
            return { ...a, unlocked: true };
          }
          return a;
        });
        
        if (JSON.stringify(updatedAchievements) !== JSON.stringify(achievements)) {
          set({ achievements: updatedAchievements });
        }
      },
      
      resetProgress: () => set({
        progress: initialProgress,
        lessons: initialLessons,
        grammarLessons: initialGrammarLessons,
        flashcards: initialFlashcards,
        achievements: initialAchievements,
        dailyGoals: initialDailyGoals,
        currentStreak: 0,
      }),
    }),
    {
      name: 'fluent-english-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
