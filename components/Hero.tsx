"use client"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="wrapper mb-10 md:mb-16">
      <div className="rounded-2xl bg-[var(--bg-secondary)] p-8 md:p-12 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left: Heading + description + CTA */}
            <div className="px-4 md:px-0">
              <h1 className="page-title-xl">Your Library</h1>
              <p className="mt-4 subtitle max-w-xl">
                Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
              </p>

              <div className="mt-8">
                <Link href="/books/new" className="btn-secondary inline-flex items-center gap-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-[var(--accent-light)] rounded-md text-[var(--color-brand)]">+</span>
                  Add new book
                </Link>
              </div>
            </div>

            {/* Center: Illustration */}
            <div className="flex justify-center">
              <div className="w-80 md:w-[420px] lg:w-[520px] shadow-book">
                <Image src="/assets/hero-illustration.png" alt="Vintage books and globe" width={520} height={360} className="object-contain" />
              </div>
            </div>

            {/* Right: Steps card */}
            <div className="flex justify-end px-4 md:px-0">
              <div className="library-steps-card shadow-soft-md w-full max-w-xs">
                <ol className="space-y-4">
                  <li className="library-step-item">
                    <div className="library-step-number">1</div>
                    <div>
                      <div className="library-step-title">Upload PDF</div>
                      <div className="library-step-description">Add your book file</div>
                    </div>
                  </li>
                  <li className="library-step-item">
                    <div className="library-step-number">2</div>
                    <div>
                      <div className="library-step-title">AI Processing</div>
                      <div className="library-step-description">We analyze the content</div>
                    </div>
                  </li>
                  <li className="library-step-item">
                    <div className="library-step-number">3</div>
                    <div>
                      <div className="library-step-title">Voice Chat</div>
                      <div className="library-step-description">Discuss with AI</div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
