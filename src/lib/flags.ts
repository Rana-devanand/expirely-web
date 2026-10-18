// Premium / pricing is hidden on the public site until this is switched on:
//   NEXT_PUBLIC_PREMIUM_ENABLED=true
// (set it in the web app's environment when payments are ready to go live).
export const PREMIUM_ENABLED = process.env.NEXT_PUBLIC_PREMIUM_ENABLED === 'true';

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.expirely.mobile';
