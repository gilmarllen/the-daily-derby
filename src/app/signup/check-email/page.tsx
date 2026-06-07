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
import { cn } from "@/lib/utils";

export default function CheckEmailPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <Card className="animate-in fade-in slide-in-from-bottom-3 w-full max-w-sm text-center duration-500">
        <CardHeader className="items-center">
          <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
            <MailCheck className="size-6" />
          </span>
          <CardTitle className="text-xl">Check your inbox</CardTitle>
          <CardDescription>
            We sent you a confirmation link. Click it to activate your account,
            then log in to make your first pick.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Back to log in
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
