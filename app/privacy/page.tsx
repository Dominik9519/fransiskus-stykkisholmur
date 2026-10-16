import type { Metadata } from "next"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

export const metadata: Metadata = {
  title: "Privacy & Cookies",
  description:
    "Privacy and cookie information for the St. Francis of Assisi Parish website in Stykkishólmur.",
  alternates: {
    canonical: "/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <main className="privacy-page">
        <section className="privacy-hero">
          <div className="privacy-container">
            <p className="eyebrow">Your privacy</p>
            <h1>Privacy & Cookies</h1>
            <p className="privacy-intro">
              This page explains how information may be processed when you
              visit stfrancis.is and how we use third-party services.
            </p>

            <p className="privacy-updated">
              Last updated: 15 October 2026
            </p>
          </div>
        </section>

        <section className="privacy-content">
          <div className="privacy-container privacy-prose">
            <section>
              <h2>Who we are</h2>

              <p>
                This website is operated for St. Francis of Assisi Parish in
                Stykkishólmur, Iceland.
              </p>

              <address>
                St. Francis of Assisi Parish
                <br />
                Austurgata 7
                <br />
                340 Stykkishólmur
                <br />
                Iceland
                <br />
                <a href="mailto:franskirkja@gmail.com">
                  franskirkja@gmail.com
                </a>
              </address>
            </section>

            <section>
              <h2>Information processed when you visit the website</h2>

              <p>
                When you visit this website, limited technical information may
                be processed as part of delivering and protecting the service.
                This may include information such as your IP address, browser
                type, device information, requested pages, timestamps and
                technical diagnostic information.
              </p>

              <p>
                We do not intentionally use advertising trackers, behavioural
                advertising, Google Analytics, Meta Pixel or similar marketing
                tracking technologies on this website.
              </p>
            </section>

            <section>
              <h2>Website administration</h2>

              <p>
                Authorised administrators have protected accounts used to
                manage parish content. Website content, authentication and
                related administrative data are provided using Supabase.
              </p>
            </section>

            <section>
              <h2>Email services</h2>

              <p>
                Transactional administrative emails, such as account
                invitations and password recovery messages, may be delivered
                using Resend.
              </p>
            </section>

            <section>
              <h2>Live streams and YouTube</h2>

              <p>
                Live streams may be provided through YouTube. The YouTube
                player is not loaded automatically when you visit the Live
                Stream page.
              </p>

              <p>
                If you choose to load the player, your browser will connect to
                YouTube. We use YouTube&apos;s privacy-enhanced embed domain,
                youtube-nocookie.com. Google and YouTube may process
                information according to their own privacy policies after you
                activate the player.
              </p>
            </section>

            <section>
              <h2>Service providers</h2>

              <p>
                We use third-party service providers where necessary to operate
                and maintain the website. These currently include:
              </p>

              <ul>
                <li>Vercel — website hosting and delivery</li>
                <li>Supabase — database, authentication and file storage</li>
                <li>Resend — transactional email delivery</li>
                <li>YouTube — optional live video content</li>
              </ul>
            </section>

            <section>
              <h2>Cookies and similar technologies</h2>

              <p>
                The public website does not intentionally use analytics,
                advertising or behavioural tracking cookies.
              </p>

              <p>
                Technologies that are strictly necessary for protected website
                administration, authentication or security may be used where
                required.
              </p>

              <p>
                Third-party YouTube content is loaded only after you choose to
                activate the player.
              </p>
            </section>

            <section>
              <h2>International data transfers</h2>

              <p>
                Some service providers may process limited information outside
                Iceland or the European Economic Area. Where applicable, such
                processing is subject to the safeguards provided by applicable
                data protection law and the relevant service provider
                agreements.
              </p>
            </section>

            <section>
              <h2>How long information is retained</h2>

              <p>
                Personal information is retained only for as long as reasonably
                necessary for the purpose for which it was processed, including
                website operation, security, administration and applicable
                legal requirements.
              </p>
            </section>

            <section>
              <h2>Your rights</h2>

              <p>
                Subject to applicable data protection law, you may have rights
                including access to your personal data, correction, deletion,
                restriction of processing, data portability and objection to
                certain processing.
              </p>

              <p>
                Where processing is based on consent, you may withdraw that
                consent. You may also have the right to lodge a complaint with
                the Icelandic Data Protection Authority, Persónuvernd.
              </p>
            </section>

            <section>
              <h2>Contact</h2>

              <p>
                If you have questions about privacy or personal information
                relating to this website, contact:
              </p>

              <p>
                <a href="mailto:franskirkja@gmail.com">
                  franskirkja@gmail.com
                </a>
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
