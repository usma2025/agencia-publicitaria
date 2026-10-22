import { SITE } from "@/lib/site";

export function Logo({ invertido = false }: { invertido?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden className="relative block h-7 w-7 bg-amarillo">
        <span className="absolute right-0.5 bottom-0.5 h-2.5 w-2.5 rounded-full bg-magenta" />
      </span>
      <span className={`font-display text-2xl whitespace-nowrap ${invertido ? "text-papel" : "text-tinta"}`}>{SITE.marca}</span>
    </span>
  );
}
