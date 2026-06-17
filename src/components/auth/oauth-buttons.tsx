"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Provider } from "@supabase/supabase-js";

import { ProviderIcon } from "@/components/brand/provider-icons";
import { useDictionary } from "@/components/i18n/locale-provider";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  SUPABASE_PROVIDER_ID,
  type OAuthProvider,
} from "@/lib/supabase/oauth-providers";

export function OAuthButtons({ providers }: { providers: OAuthProvider[] }) {
  const t = useDictionary().auth;
  // Track which provider is mid-redirect so we can disable the row.
  const [pending, setPending] = useState<OAuthProvider | null>(null);

  async function signIn(provider: OAuthProvider) {
    setPending(provider);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: SUPABASE_PROVIDER_ID[provider] as Provider,
      options: {
        redirectTo: `${window.location.origin}/auth/confirm?next=/dashboard`,
      },
    });
    // On success the browser is already navigating to the provider; only reset
    // on error so the user can retry.
    if (error) setPending(null);
  }

  return (
    <div className="flex flex-col gap-2">
      {providers.map((provider) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          size="lg"
          disabled={pending !== null}
          onClick={() => signIn(provider)}
        >
          {pending === provider ? (
            <Loader2 className="animate-spin" />
          ) : (
            <ProviderIcon provider={provider} />
          )}
          {t.providers[provider]}
        </Button>
      ))}
    </div>
  );
}
