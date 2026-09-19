import { MapPin, Clock3, Mail } from "lucide-react"
import Mark from "./Mark"

export default function Footer() {
  return (
    <footer id="hafa-samband">
      <div className="footer-main">
        <Mark compact />

        <a
          href="https://maps.google.com/?q=Austurgata+7,+340+Stykkisholmur"
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={19} />
          <span>
            Austurgata 7
            <br />
            340 Stykkishólmur
          </span>
        </a>

        <a href="tel:+3548507576">
          <Clock3 size={19} />
          <span>
            Rev. Krzysztof Sliwa
            <br />
            +354 850 7576
          </span>
        </a>

        <a href="mailto:sliwcok@gmail.com">
          <Mail size={19} />
          <span>sliwcok@gmail.com</span>
        </a>

        <a
          className="social-link"
          href="https://www.facebook.com/"
          aria-label="Facebook"
        >
          <strong aria-hidden="true">f</strong>
        </a>
      </div>
    </footer>
  )
}