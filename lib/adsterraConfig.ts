// MASTER SWITCH: Set this single line to false to disable every Adsterra ad site-wide.
export const ADSTERRA_ALL_ADS_ENABLED = true;

export const ADSTERRA_BANNER_728_KEY =
  process.env.NEXT_PUBLIC_ADSTERRA_BANNER_728_KEY ||
  "2509fb3ccdb765e1e445a723925e0934";

export const ADSTERRA_BANNER_728_ENABLED =
  ADSTERRA_ALL_ADS_ENABLED && /^[a-f0-9]{32}$/i.test(ADSTERRA_BANNER_728_KEY);

export const ADSTERRA_BANNER_320_KEY =
  process.env.NEXT_PUBLIC_ADSTERRA_BANNER_320_KEY ||
  "5c70ca7ef822fbea8712b1c5fd406f5e";

export const ADSTERRA_BANNER_320_ENABLED =
  ADSTERRA_ALL_ADS_ENABLED && /^[a-f0-9]{32}$/i.test(ADSTERRA_BANNER_320_KEY);


export const ADSTERRA_BANNER_300_KEY =
  process.env.NEXT_PUBLIC_ADSTERRA_BANNER_300_KEY ||
  "7e80ecd08cb20bbae47352951b96dfc6";

export const ADSTERRA_BANNER_300_ENABLED =
  ADSTERRA_ALL_ADS_ENABLED && /^[a-f0-9]{32}$/i.test(ADSTERRA_BANNER_300_KEY);


export const ADSTERRA_NATIVE_SCRIPT_SRC =
  process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_SRC ||
  "https://pl30462932.effectivecpmnetwork.com/fd6601ae4f261958321eb11878687973/invoke.js";

export const ADSTERRA_NATIVE_CONTAINER_ID =
  process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID ||
  "container-fd6601ae4f261958321eb11878687973";

export const ADSTERRA_NATIVE_ENABLED =
  ADSTERRA_ALL_ADS_ENABLED &&
  /^https:\/\/[a-z0-9.-]+\/[^\s]+\/invoke\.js$/i.test(ADSTERRA_NATIVE_SCRIPT_SRC) &&
  /^container-[a-z0-9]+$/i.test(ADSTERRA_NATIVE_CONTAINER_ID);
