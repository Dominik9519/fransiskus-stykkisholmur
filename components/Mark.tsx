export default function Mark({
  compact = false,
}: {
  compact?: boolean
}) {
  return (
    <div
      className={`brand${compact ? " brand-compact" : ""}`}
     
    >
      <img
        className="brand-logo"
        src="/fransiskus-logo.webp"
        alt=""
        aria-hidden="true"
      />
    </div>
  )
}