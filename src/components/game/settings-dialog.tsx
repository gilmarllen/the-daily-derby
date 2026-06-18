"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useState,
  useTransition,
} from "react";
import { AlertCircle, Loader2, Mail, Trash2 } from "lucide-react";

import {
  confirmAccountDeletion,
  requestAccountDeletion,
  type ConfirmDeletionState,
} from "@/app/auth/actions";
import { useDictionary } from "@/components/i18n/locale-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";

const SettingsDialogContext = createContext<{
  openSettings: () => void;
} | null>(null);

/** Lets any descendant (e.g. the user menu) open the settings modal. */
export function useSettingsDialog() {
  const ctx = useContext(SettingsDialogContext);
  if (!ctx) {
    throw new Error(
      "useSettingsDialog must be used within a SettingsDialogProvider"
    );
  }
  return ctx;
}

export function SettingsDialogProvider({
  children,
  email,
}: {
  children: React.ReactNode;
  /** The signed-in user's email — used to confirm intent before deletion. */
  email: string | null;
}) {
  const [open, setOpen] = useState(false);
  const t = useDictionary().settings;

  const openSettings = useCallback(() => setOpen(true), []);

  return (
    <SettingsDialogContext.Provider value={{ openSettings }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-6">
          <div className="flex flex-col gap-1 pr-6">
            <DialogTitle>{t.title}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </div>

          <div className="flex flex-col gap-5">
            <Row label={t.language}>
              <LanguageSwitcher className="bg-muted/60 ring-foreground/10 ring-1" />
            </Row>
            <Row label={t.appearance}>
              <ThemeSwitcher />
            </Row>
          </div>

          <Separator />

          <DangerZone email={email} />
        </DialogContent>
      </Dialog>
    </SettingsDialogContext.Provider>
  );
}

/** Destructive account actions, visually set apart from the regular settings. */
function DangerZone({ email }: { email: string | null }) {
  const t = useDictionary().settings;
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Row label={t.deleteAccount}>
        <Button
          variant="destructive"
          size="lg"
          onClick={() => setConfirming(true)}
        >
          <Trash2 />
          {t.deleteAccount}
        </Button>
      </Row>

      <DeleteAccountDialog
        open={confirming}
        onOpenChange={setConfirming}
        email={email}
      />
    </div>
  );
}

function DeleteAccountDialog({
  open,
  onOpenChange,
  email,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string | null;
}) {
  const t = useDictionary().settings;

  // Two-step flow: "intro" (warning + email the code) → "code" (enter it).
  const [step, setStep] = useState<"intro" | "code">("intro");
  const [code, setCode] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSending, startSending] = useTransition();

  const [verifyState, verifyAction, isVerifying] = useActionState<
    ConfirmDeletionState,
    FormData
  >(confirmAccountDeletion, null);

  // Reset back to the intro step whenever the dialog is dismissed, so reopening
  // never lands mid-flow with a stale code.
  function handleOpenChange(next: boolean) {
    if (!next) {
      setStep("intro");
      setCode("");
      setSendError(null);
    }
    onOpenChange(next);
  }

  function sendCode() {
    setSendError(null);
    startSending(async () => {
      const result = await requestAccountDeletion();
      if (result?.error) {
        setSendError(result.error);
        return;
      }
      setStep("code");
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-5">
        <div className="flex flex-col gap-1 pr-6">
          <DialogTitle className="text-destructive">
            {t.deleteAccountTitle}
          </DialogTitle>
          <DialogDescription>
            {step === "intro" ? (
              t.deleteAccountWarning
            ) : (
              <>
                {t.deleteAccountCodeSentBefore}
                <span className="text-foreground font-medium">
                  {email ?? "your inbox"}
                </span>
                {t.deleteAccountCodeSentAfter}
              </>
            )}
          </DialogDescription>
        </div>

        {step === "intro" ? (
          <div className="flex flex-col gap-4">
            {sendError && (
              <p
                role="alert"
                className="text-destructive flex items-center gap-1.5 text-sm"
              >
                <AlertCircle className="size-4 shrink-0" />
                {sendError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleOpenChange(false)}
              >
                {t.cancel}
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="lg"
                disabled={isSending}
                onClick={sendCode}
              >
                {isSending ? <Loader2 className="animate-spin" /> : <Mail />}
                {t.deleteAccountSendCode}
              </Button>
            </div>
          </div>
        ) : (
          <form action={verifyAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium">
                {t.deleteAccountCodeLabel}
              </span>
              <InputOTP
                name="code"
                maxLength={6}
                value={code}
                onChange={setCode}
                pattern={REGEXP_ONLY_DIGITS}
                autoFocus
                aria-label={t.deleteAccountCodeLabel}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="size-10" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <button
                type="button"
                onClick={sendCode}
                disabled={isSending}
                className="text-muted-foreground hover:text-foreground self-start text-sm underline-offset-4 hover:underline disabled:opacity-50"
              >
                {t.deleteAccountResend}
              </button>
            </div>

            {verifyState?.error && (
              <p
                role="alert"
                className="text-destructive flex items-center gap-1.5 text-sm"
              >
                <AlertCircle className="size-4 shrink-0" />
                {verifyState.error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleOpenChange(false)}
              >
                {t.cancel}
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="lg"
                disabled={isVerifying || code.length < 6}
              >
                {isVerifying && <Loader2 className="animate-spin" />}
                {t.deleteAccountConfirm}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </div>
  );
}
