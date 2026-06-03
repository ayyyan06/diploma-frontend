import { useEffect, useId, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import "./AltynAdamDialog.css";

export interface AltynAdamDialogAction {
  id: string;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

interface AltynAdamDialogProps {
  open: boolean;
  imageSrc: string;
  imageAlt: string;
  message: ReactNode;
  actions: readonly AltynAdamDialogAction[];
  characterName?: string;
  onClose?: () => void;
}

export function AltynAdamDialog({
  open,
  imageSrc,
  imageAlt,
  message,
  actions,
  characterName,
  onClose,
}: AltynAdamDialogProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const descriptionId = useId();
  const isWelcomeDialog = actions.some(
    (action) => action.id === "login-welcome-continue",
  );
  const isReminderDialog = actions.some((action) =>
    action.id.endsWith("-reminder-profile"),
  );
  const isModalPresentation = !isReminderDialog;
  const resolvedCharacterName = characterName ?? t("altynAdam.name");
  const resolvedImageAlt = isWelcomeDialog
    ? t("altynAdam.welcome.imageAlt")
    : isReminderDialog
      ? t("altynAdam.reminder.imageAlt")
      : imageAlt;
  const resolvedMessage = isWelcomeDialog
    ? t("altynAdam.welcome.message")
    : isReminderDialog
      ? t("altynAdam.reminder.message")
      : message;
  const resolvedActions = actions.map((action) => {
    if (action.id === "login-welcome-continue") {
      return {
        ...action,
        label: t("altynAdam.actions.continue"),
      };
    }

    if (action.id.endsWith("-reminder-profile")) {
      return {
        ...action,
        label: t("altynAdam.actions.goToProfile"),
      };
    }

    if (action.id.endsWith("-reminder-continue")) {
      return {
        ...action,
        label: t("altynAdam.actions.continue"),
      };
    }

    return action;
  });

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }

    if (!isModalPresentation) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalPresentation, onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={`altyn-adam-dialog__overlay ${
        isReminderDialog ? "altyn-adam-dialog__overlay--docked" : ""
      }`}
      role="presentation"
      onClick={(event) => {
        if (isModalPresentation && event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className={`altyn-adam-dialog__panel ${
          isReminderDialog ? "altyn-adam-dialog__panel--docked" : ""
        }`}
        role="dialog"
        aria-modal={isModalPresentation ? "true" : "false"}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div
          className={`altyn-adam-dialog__image-shell ${
            isReminderDialog ? "altyn-adam-dialog__image-shell--docked" : ""
          }`}
        >
          <img
            src={imageSrc}
            alt={resolvedImageAlt}
            className={`altyn-adam-dialog__image ${
              isReminderDialog ? "altyn-adam-dialog__image--docked" : ""
            }`}
          />
        </div>

        <div
          className={`altyn-adam-dialog__content ${
            isReminderDialog ? "altyn-adam-dialog__content--docked" : ""
          }`}
        >
          <div
            className={`altyn-adam-dialog__bubble ${
              isReminderDialog ? "altyn-adam-dialog__bubble--docked" : ""
            }`}
          >
            <div className="altyn-adam-dialog__nameplate">
              <span
                className="altyn-adam-dialog__nameplate-mark"
                aria-hidden="true"
              />
              <h2 id={titleId} className="altyn-adam-dialog__name">
                {resolvedCharacterName}
              </h2>
            </div>

            <div id={descriptionId} className="altyn-adam-dialog__message">
              {resolvedMessage}
            </div>

            <div className="altyn-adam-dialog__actions">
              {resolvedActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={action.onClick}
                  className={`altyn-adam-dialog__button altyn-adam-dialog__button--${
                    action.variant ?? "primary"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
