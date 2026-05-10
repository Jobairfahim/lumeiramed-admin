export function Logo() {
  return (
    <div className="flex items-center gap-2 px-2 mb-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/images/logo.png" 
        alt="Lumiera Med Logo" 
        className="w-20 h-12 flex-shrink-0 object-contain"
      />
    </div>
  );
}

interface AvatarProps { size?: string; src?: string; alt?: string; }
export function Avatar({ size = "w-8 h-8", src, alt = "User" }: AvatarProps) {
  // eslint-disable-next-line @next/next/no-img-element
  if (src) return <img src={src} alt={alt} className={`${size} rounded-full object-cover flex-shrink-0`} />;
  return (
    <div className={`${size} rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0`}>
      <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
}

type StageBadgeVariant = "AwaitingPayment" | "MatchingRequired" | "AwaitingResponse";
const STAGE_STYLES: Record<StageBadgeVariant, string> = {
  AwaitingPayment: "bg-teal-100 text-teal-700 border border-teal-200",
  MatchingRequired: "bg-red-100 text-red-600 border border-red-200",
  AwaitingResponse: "bg-amber-100 text-amber-700 border border-amber-200",
};
const STAGE_LABELS: Record<StageBadgeVariant, string> = {
  AwaitingPayment: "Awaiting Payment",
  MatchingRequired: "Matching required",
  AwaitingResponse: "Awaiting response",
};
export function StageBadge({ status }: { status: StageBadgeVariant }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${STAGE_STYLES[status]}`}>
      {STAGE_LABELS[status]}
    </span>
  );
}

type PayBadgeVariant = "Pending" | "Paid";
const PAY_STYLES: Record<PayBadgeVariant, string> = {
  Pending: "bg-amber-100 text-amber-700 border border-amber-200",
  Paid: "bg-teal-100 text-teal-700 border border-teal-200",
};
export function PayBadge({ status }: { status: PayBadgeVariant }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${PAY_STYLES[status]}`}>
      {status}
    </span>
  );
}
