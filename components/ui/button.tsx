import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return <button className={cn("cta rounded-lg px-4 py-2", className)} {...rest} />;
}
