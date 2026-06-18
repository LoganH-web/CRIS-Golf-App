/**
 * Root page — route: /
 *
 * This page exists solely to redirect visitors from "/" to the correct
 * locale-prefixed URL (e.g. "/en", "/ko"). The redirect is client-side so
 * it works with Next.js output: "export" static builds.
 *
 * Detection priority (see i18n/detectLocale.ts):
 *   1. localStorage override (user's prior manual language selection)
 *   2. navigator.languages (device/browser language)
 *   3. "en" (default)
 */

import { LocaleRedirect } from "@/components/LocaleRedirect";

export default function RootPage(): React.ReactElement {
  return <LocaleRedirect />;
}
