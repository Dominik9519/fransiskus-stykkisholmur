export default function Mark({
  compact = false,
}: {
  compact?: boolean
}) {
  return (
    <div
      className={`brand${compact ? " brand-compact" : ""}`}
      aria-label="Catholic Parish of Saint Francis of Assisi, Stykkishólmur"
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