import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

type LanguageSwitcherProps = {
  dark?: boolean;
};

const GlobeIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15.3 15.3 0 0 1 0 18" />
    <path d="M12 3a15.3 15.3 0 0 0 0 18" />
  </svg>
);

export const LanguageSwitcher = ({ dark = false }: LanguageSwitcherProps) => {
  const { currentLanguage, currentLanguageMeta, languages, ready, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickAway);
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const triggerClassName = dark
    ? "landing-language-trigger"
    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
  const panelClassName = dark
    ? "landing-language-panel"
    : "border-slate-200 bg-white text-slate-900 shadow-2xl";
  const inactiveTextClassName = dark ? "landing-language-muted" : "text-slate-500";
  const headingClassName = dark ? "landing-language-heading" : "text-slate-900";
  const closeButtonClassName = dark
    ? "landing-language-close"
    : "border-slate-200 bg-white text-slate-500 shadow-sm";
  const activeClassName = dark
    ? "landing-language-option-active"
    : "border-blue-200 bg-blue-50 text-blue-700";
  const inactiveClassName = dark
    ? "landing-language-option"
    : "border-transparent hover:bg-slate-50";
  const activeBadgeClassName = dark
    ? "landing-language-badge-active"
    : "bg-blue-600 text-white";
  const inactiveBadgeClassName = dark
    ? "landing-language-badge"
    : "bg-slate-100 text-slate-500";
  const unavailableBadgeClassName = dark
    ? "landing-language-badge-unavailable"
    : "bg-amber-100 text-amber-700";

  return (
    <div
      ref={rootRef}
      className={`notranslate relative ${dark ? "landing-language-root" : ""}`}
      translate="no"
      lang="en"
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition md:h-11 md:w-11 ${triggerClassName}`}
        aria-label="Choose language"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Choose language"
        translate="no"
      >
        <GlobeIcon />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close language picker"
            className="fixed inset-0 z-40 cursor-default bg-slate-950/35 backdrop-blur-[1px] md:hidden"
            onClick={() => setOpen(false)}
            translate="no"
          />

          <div
            className={`fixed left-3 right-3 top-16 z-50 max-h-[calc(100vh-5.5rem)] overflow-hidden rounded-[2rem] border border-slate-200 p-0 shadow-[0_24px_60px_rgba(15,23,42,0.22)] md:absolute md:right-0 md:top-14 md:left-auto md:bottom-auto md:z-40 md:w-[min(92vw,19rem)] md:rounded-[1.5rem] md:border md:p-3 ${panelClassName}`}
            role="menu"
            aria-label="Language options"
            translate="no"
          >
            <div className="border-b border-slate-200 px-4 pt-4 md:border-0 md:px-1 md:pb-3 md:pt-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className={`text-base font-semibold md:text-sm ${headingClassName}`}>Choose language</p>
                  <p className={`text-xs ${inactiveTextClassName}`}>
                  {ready
                    ? `Current: ${currentLanguageMeta.label}. Choose the language for the full website.`
                    : "Loading translation options..."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border md:hidden ${closeButtonClassName}`}
                  aria-label="Close language picker"
                  translate="no"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-9rem)] space-y-2 overflow-y-auto px-4 py-4 md:max-h-[20rem] md:px-0 md:py-0">
              {languages.map((language) => {
                const active = language.code === currentLanguage;

                return (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() => {
                      if (!language.supported) {
                        return;
                      }
                      setLanguage(language.code);
                      setOpen(false);
                    }}
                    disabled={!language.supported}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                      active ? activeClassName : inactiveClassName
                    }`}
                    role="menuitemradio"
                    aria-checked={active}
                    translate="no"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{language.nativeLabel}</span>
                      <span className={`block text-xs ${active ? "" : inactiveTextClassName}`}>
                        {language.label}
                      </span>
                    </span>
                    <span
                      className={`ml-3 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                        active
                          ? activeBadgeClassName
                          : language.supported
                            ? inactiveBadgeClassName
                            : unavailableBadgeClassName
                      }`}
                    >
                      {active ? "Active" : language.supported ? "Select" : "Unavailable"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default LanguageSwitcher;
