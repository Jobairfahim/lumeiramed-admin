interface IconProps {
  path: string;
  path2?: string;
  className?: string;
}
export function Icon({ path, path2, className = "w-4 h-4" }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
      {path2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path2} />}
    </svg>
  );
}
