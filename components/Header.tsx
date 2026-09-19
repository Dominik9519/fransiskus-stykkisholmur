import { Search, Menu, X } from "lucide-react"

function SectionArrow() {
  return <span aria-hidden="true">→</span>
}

export default function Header() {
  return (
    <header className="site-header">
      <div className="topline">
        <a href="#contact">Contact</a>
      </div>

      <div className="nav-shell">
        <a className="logo-link" href="/">
          <span className="brand">
            <img
              className="brand-logo"
              src="/fransiskus-logo.webp"
              alt="St. Francis of Assisi"
            />

            <span className="brand-text">
              <strong>St. Francis of Assisi</strong>
              <small>Stykkishólmur</small>
            </span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/mass-times">Mass Times</a>

          <div className="nav-dropdown">
            <button className="nav-dropdown-button" type="button">
              Parish
              <span className="nav-chevron">⌄</span>
            </button>

            <div className="nav-dropdown-menu">
              <a href="/parish/about">About us</a>
              <a href="/parish/st-francis">St. Francis of Assisi</a>
              <a href="/parish/churches">Churches</a>
              <a href="/parish/clergy">Clergy</a>
            </div>
          </div>

          <a href="/news">News</a>
          <a href="/events">Events</a>
          <a href="/live">Live</a>
          <a href="/gallery">Gallery</a>
          <a href="/contact">Contact</a>
        </nav>

        <button
          className="search-button"
          type="button"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <details className="mobile-menu">
          <summary aria-label="Open menu">
            <Menu className="menu-open" size={24} />
            <X className="menu-close" size={24} />
          </summary>

          <nav aria-label="Mobile navigation">
            <a href="/">Home</a>
            <a href="/mass-times">Mass Times</a>
            <a href="/parish/about">About us</a>
            <a href="/parish/st-francis">St. Francis of Assisi</a>
            <a href="/parish/churches">Churches</a>
            <a href="/parish/clergy">Clergy</a>
            <a href="/news">News</a>
            <a href="/events">Events</a>
            <a href="/live">Live</a>
            <a href="/gallery">Gallery</a>
            <a href="/contact">Contact</a>
          </nav>
        </details>
      </div>
    </header>
  )
}