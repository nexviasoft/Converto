// MASTER SWITCH: Set this single line to false to disable every Adsterra ad site-wide.
export const ADSTERRA_ALL_ADS_ENABLED = true;

// Standard 728x90 / 320x50 / 300x250 units are temporarily disabled because
// the current Adsterra inventory does not fill them reliably. Native remains active.
export const ADSTERRA_STANDARD_BANNERS_ENABLED = false;

// TEMPORARY TEST SWITCH: Keep this true only while testing ads from Turkey.
// Set it back to false after the test so Turkey is blocked again.
export const ADSTERRA_TURKEY_TEST_MODE = false;

export const ADSTERRA_BLOCKED_COUNTRIES: readonly string[] =
  ADSTERRA_TURKEY_TEST_MODE ? [] : ["TR"];

// Fail closed for privacy/safety: no country result means no ad request.
export const ADSTERRA_ALLOW_UNKNOWN_COUNTRY = false;

export const ADSTERRA_BANNER_728_KEY =
  process.env.NEXT_PUBLIC_ADSTERRA_BANNER_728_KEY ||
  "2509fb3ccdb765e1e445a723925e0934";

export const ADSTERRA_BANNER_728_ENABLED =
  ADSTERRA_ALL_ADS_ENABLED &&
  ADSTERRA_STANDARD_BANNERS_ENABLED &&
  /^[a-f0-9]{32}$/i.test(ADSTERRA_BANNER_728_KEY);

export const ADSTERRA_BANNER_320_KEY =
  process.env.NEXT_PUBLIC_ADSTERRA_BANNER_320_KEY ||
  "5c70ca7ef822fbea8712b1c5fd406f5e";

export const ADSTERRA_BANNER_320_ENABLED =
  ADSTERRA_ALL_ADS_ENABLED &&
  ADSTERRA_STANDARD_BANNERS_ENABLED &&
  /^[a-f0-9]{32}$/i.test(ADSTERRA_BANNER_320_KEY);


export const ADSTERRA_BANNER_300_KEY =
  process.env.NEXT_PUBLIC_ADSTERRA_BANNER_300_KEY ||
  "7e80ecd08cb20bbae47352951b96dfc6";

export const ADSTERRA_BANNER_300_ENABLED =
  ADSTERRA_ALL_ADS_ENABLED &&
  ADSTERRA_STANDARD_BANNERS_ENABLED &&
  /^[a-f0-9]{32}$/i.test(ADSTERRA_BANNER_300_KEY);


const ADSTERRA_NATIVE_SCRIPT_FALLBACK =
  "https://thorpejoy.com/fd6601ae4f261958321eb11878687973/invoke.js";

const ADSTERRA_NATIVE_SCRIPT_LEGACY =
  "https://pl30462932.effectivecpmnetwork.com/fd6601ae4f261958321eb11878687973/invoke.js";

const adsterraNativeScriptOverride =
  process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_SRC?.trim();

// Use the current Anti-Adblock script from the Adsterra dashboard. If Vercel
// still contains the old host as an environment override, ignore it so the
// legacy script cannot silently replace the updated integration.
export const ADSTERRA_NATIVE_SCRIPT_SRC =
  adsterraNativeScriptOverride &&
  adsterraNativeScriptOverride !== ADSTERRA_NATIVE_SCRIPT_LEGACY
    ? adsterraNativeScriptOverride
    : ADSTERRA_NATIVE_SCRIPT_FALLBACK;

export const ADSTERRA_NATIVE_CONTAINER_ID =
  process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID ||
  "container-fd6601ae4f261958321eb11878687973";

export const ADSTERRA_NATIVE_ENABLED =
  ADSTERRA_ALL_ADS_ENABLED &&
  /^https:\/\/[a-z0-9.-]+\/[^\s]+\/invoke\.js$/i.test(ADSTERRA_NATIVE_SCRIPT_SRC) &&
  /^container-[a-z0-9]+$/i.test(ADSTERRA_NATIVE_CONTAINER_ID);
