import Link from "next/link";
import { MailCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerDictionary } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export default async function CheckEmailPage() {
  const dict = await getServerDictionary();
  const t = dict.auth.checkEmail;

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="animate-in fade-in slide-in-from-bottom-3 w-full max-w-sm text-center duration-500">
        <CardHeader className="items-center">
          <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
            <MailCheck className="size-6" />
          </span>
          <CardTitle className="text-xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">{dict.auth.spamHint}</p>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            {dict.auth.backToLogin}
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
