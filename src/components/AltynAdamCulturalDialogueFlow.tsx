import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AltynAdamDialog } from "./AltynAdamDialog";
import {
  normalizeAltynAdamLanguage,
  resolveLocalizedText,
} from "../data/altynAdamCulturalDialogues";
import { ALTTYN_ADAM_ACHIEVEMENTS_BY_ID } from "../data/achievements";
import { registerDialogueStarted, submitCulturalKnowledgeCheck } from "../utils/altynAdamProgress";
import type {
  AltynAdamCulturalDialogueDefinition,
  AltynAdamLanguage,
  AltynAdamPose,
  DialogueChoiceType,
} from "../types/altynAdam";

const POSE_IMAGES: Record<AltynAdamPose, string> = {
  welcome: "/images/altyn-adam-welcome-half.png",
  explaining: "/images/altyn-adam-explaining-half.png",
  thinking: "/images/altyn-adam-thinking-half.png",
  guide: "/images/altyn-adam-guide-half.png",
  congratulations: "/images/altyn-adam-congratulations-half.png",
};

const COPY = {
  en: {
    continue: "Continue",
    poseAlt: "Altyn Adam speaks",
    pointsPositive: "+5 friendship points",
    pointsNeutral: "+0 friendship points",
    unlockedPrefix: "New achievements:",
  },
  ru: {
    continue: "Продолжить",
    poseAlt: "Алтын Адам говорит",
    pointsPositive: "+5 очков дружбы",
    pointsNeutral: "+0 очков дружбы",
    unlockedPrefix: "Новые достижения:",
  },
  kk: {
    continue: "Жалғастыру",
    poseAlt: "Алтын Адам сөйлеп тұр",
    pointsPositive: "+5 достық ұпайы",
    pointsNeutral: "+0 достық ұпайы",
    unlockedPrefix: "Жаңа жетістіктер:",
  },
} as const;

interface FeedbackState {
  message: ReactNode;
  pose: AltynAdamPose;
}

export function AltynAdamCulturalDialogueFlow({
  open,
  dialogue,
  language,
  onClose,
}: {
  open: boolean;
  dialogue: AltynAdamCulturalDialogueDefinition | null;
  language: AltynAdamLanguage;
  onClose: () => void;
}) {
  const resolvedLanguage = normalizeAltynAdamLanguage(language);
  const copy = COPY[resolvedLanguage];
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [selectedBranchType, setSelectedBranchType] =
    useState<DialogueChoiceType | null>(null);
  const [feedbackState, setFeedbackState] = useState<FeedbackState | null>(
    null,
  );

  useEffect(() => {
    if (!open || !dialogue) {
      return;
    }

    setCurrentNodeId(dialogue.openingNodeId);
    setSelectedBranchType(null);
    setFeedbackState(null);
    registerDialogueStarted(dialogue.id);
  }, [dialogue, open]);

  const currentNode = useMemo(() => {
    if (!dialogue || !currentNodeId) {
      return null;
    }

    return dialogue.nodes[currentNodeId] ?? null;
  }, [currentNodeId, dialogue]);

  if (!open || !dialogue || !currentNode) {
    return null;
  }

  const activePose = feedbackState?.pose ?? currentNode.pose;
  const imageSrc = POSE_IMAGES[activePose];
  const message = feedbackState?.message ?? resolveLocalizedText(
    currentNode.text,
    resolvedLanguage,
  );

  const handleKnowledgeAnswer = (optionId: string) => {
    const knowledgeCheck = currentNode.knowledgeCheck;

    if (!knowledgeCheck) {
      return;
    }

    const isCorrect = optionId === knowledgeCheck.correctOptionId;
    const submissionResult = submitCulturalKnowledgeCheck({
      dialogueId: dialogue.id,
      testType: dialogue.testType,
      resultKey: dialogue.resultKey,
      branchType: selectedBranchType,
      isCorrect,
    });

    const unlockedTitles = submissionResult.newlyUnlockedAchievements
      .map((achievementId) => ALTTYN_ADAM_ACHIEVEMENTS_BY_ID[achievementId])
      .filter(Boolean)
      .map((achievement) =>
        resolveLocalizedText(achievement.title, resolvedLanguage),
      );

    const feedbackMessage = (
      <div className="space-y-3">
        <p className="m-0">
          {resolveLocalizedText(
            isCorrect
              ? knowledgeCheck.correctResponse
              : knowledgeCheck.wrongResponse,
            resolvedLanguage,
          )}
        </p>
        <p className="m-0 font-semibold text-[#f2c200]">
          {isCorrect ? copy.pointsPositive : copy.pointsNeutral}
        </p>
        {unlockedTitles.length > 0 && (
          <p className="m-0 text-[15px] leading-[1.6] text-[#f8d760]">
            {copy.unlockedPrefix} {unlockedTitles.join(", ")}
          </p>
        )}
      </div>
    );

    setFeedbackState({
      message: feedbackMessage,
      pose:
        isCorrect || unlockedTitles.length > 0
          ? "congratulations"
          : "explaining",
    });
  };

  const actions = feedbackState
    ? [
        {
          id: "cultural-dialogue-finish",
          label: copy.continue,
          onClick: onClose,
        },
      ]
    : currentNode.knowledgeCheck
      ? currentNode.knowledgeCheck.options.map((option) => ({
          id: option.id,
          label: resolveLocalizedText(option.label, resolvedLanguage),
          onClick: () => handleKnowledgeAnswer(option.id),
          variant: "secondary" as const,
        }))
      : (currentNode.choices ?? []).map((choice, index) => ({
          id: choice.id,
          label: resolveLocalizedText(choice.label, resolvedLanguage),
          onClick: () => {
            if (choice.type) {
              setSelectedBranchType(choice.type);
            }

            setCurrentNodeId(choice.nextNodeId);
          },
          variant: (index === 0 ? "primary" : "secondary") as
            | "primary"
            | "secondary",
        }));

  return (
    <AltynAdamDialog
      open={open}
      imageSrc={imageSrc}
      imageAlt={copy.poseAlt}
      message={message}
      onClose={onClose}
      actions={actions}
    />
  );
}
