import { cn } from "@/lib/utils";

export function LoadingState({
  label = "Loading soft-sim data…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <p
      role="status"
      className={cn(
        "font-[family-name:var(--font-mono)] text-sm text-muted-foreground",
        className,
      )}
    >
      {label}
    </p>
  );
}

export function EmptyState({
  children,
  title,
  detail,
  action,
  className,
}: {
  children?: React.ReactNode;
  title?: string;
  detail?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  const heading =
    title ?? (typeof children === "string" ? children : "Nothing here yet");

  return (
    <div
      className={cn(
        "border border-dashed border-[color-mix(in_srgb,var(--color-rule)_40%,transparent)] px-5 py-8",
        className,
      )}
    >
      <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
        {heading}
      </p>
      {detail ? (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {detail}
        </p>
      ) : null}
      {typeof children !== "string" && children ? (
        <div className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "border border-[color-mix(in_srgb,var(--color-gap)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-gap)_8%,var(--color-paper))] px-5 py-4",
        className,
      )}
    >
      <p className="text-sm font-medium text-[var(--color-gap)]">
        Soft-sim load failed
      </p>
      <p className="mt-1 text-sm text-[var(--color-ink)]">{message}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Soft-sim only — not your cloud billing system of record.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm font-medium text-[var(--color-accent)] underline-offset-4 hover:underline"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
