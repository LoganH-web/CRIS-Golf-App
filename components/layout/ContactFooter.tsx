/**
 * ContactFooter — persistent contact section shown at the bottom of every screen,
 * above the bottom tab bar. Per §2 the app has a persistent Contact section.
 *
 * Real contact details (phone, email, address) are populated in subphase 1D
 * once confirmed from the school. This is structural scaffolding only.
 */

export function ContactFooter(): React.ReactElement {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 px-6 py-5 pb-20 text-center text-sm text-slate-500">
      {/* Section heading */}
      <p className="font-semibold text-slate-700">Contact</p>

      {/*
       * Contact detail placeholders — replaced with real values in 1D.
       * Phone: +66 (0) 53 600-900 | Email: admin@cris.ac.th
       */}
      <p className="mt-1 text-xs text-slate-400">
        Contact details coming in subphase 1D.
      </p>
    </footer>
  );
}
