import Image from "next/image"

export default function Mark({
  compact = false,
}: {
  compact?: boolean
}) {
  return (
    <div
      className={`brand${compact ? " brand-compact" : ""}`}
    >
      <Image
        className="brand-logo"
        src="/fransiskus-logo.webp"
        width={60}
        height={60}
        alt=""
        aria-hidden="true"
      />
    </div>
  )
}
