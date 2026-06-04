export type AltynAdamLanguage = "en" | "ru" | "kk";

export type StandardTestType = "personality" | "animal" | "weapon" | "enemy";

export type CompletedTestKey = StandardTestType | "adaptive-figure";

export type AltynAdamPose =
  | "welcome"
  | "explaining"
  | "thinking"
  | "guide"
  | "congratulations";

export type DialogueChoiceType = "basic" | "story";

export interface LocalizedText {
  en: string;
  ru: string;
  kk: string;
}

export interface KnowledgeCheckOption {
  id: string;
  label: LocalizedText;
}

export interface KnowledgeCheck {
  question: LocalizedText;
  options: KnowledgeCheckOption[];
  correctOptionId: string;
  correctResponse: LocalizedText;
  wrongResponse: LocalizedText;
}

export interface DialogueChoice {
  id: string;
  label: LocalizedText;
  nextNodeId: string;
  type?: DialogueChoiceType;
}

export interface DialogueNode {
  id: string;
  text: LocalizedText;
  pose: AltynAdamPose;
  choices?: DialogueChoice[];
  knowledgeCheck?: KnowledgeCheck;
}

export interface AltynAdamCulturalDialogueDefinition {
  id: string;
  testType: StandardTestType;
  resultKey: string;
  nodes: Record<string, DialogueNode>;
  openingNodeId: string;
}

export interface FriendshipLevelDefinition {
  id: string;
  minPoints: number;
  maxPoints: number | null;
  title: LocalizedText;
}

export interface AltynAdamAchievementDefinition {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  isSecret?: boolean;
}

export interface AltynAdamProgressSnapshot {
  friendshipPoints: number;
  correctAnswers: number;
  totalAnswers: number;
  correctStreak: number;
  completedTestCount: number;
  completedUniqueTests: CompletedTestKey[];
  completedCulturalDialogues: string[];
  completedDialoguesByTest: Record<StandardTestType, string[]>;
  unlockedAchievements: string[];
  lastVisitDates: string[];
  storyBranchChoices: number;
  startedDialogues: string[];
}
