import {checkSession, SESSION_KEY} from '/tmb-agent/src/session.js';

const API = 'https://hhenkvendzengggrgook.supabase.co';
const PUBLIC_KEY = 'sb_publishable_QSPDTmh3fd0FH-VvAjH5KQ_Rfvzr2x_';
const OBJECT_URL = API + '/storage/v1/object/authenticated/bobines-private/guia_bobinas_da.png';
const status = document.querySelector('#access-status');
const message = document.querySelector('#access-message');
const retry = document.querySelector('#access-retry');
let objectUrl = null, checkId = 0;
let snapshot = localStorage.getItem(SESSION_KEY);

function conceal() {
  document.documentElement.classList.remove('access-approved');
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = null;
  window.bobinesImageUrl = null;
  status.hidden = false;
}
function unavailable() {
  conceal();
  message.textContent = 'No s’ha pogut comprovar l’accés.';
  retry.hidden = false;
}
async function loadPrivateImage() {
  const raw = localStorage.getItem(SESSION_KEY);
  const session = JSON.parse(raw);
  if (!session?.access_token) throw Error('No session');
  const response = await fetch(OBJECT_URL, {
    cache: 'no-store',
    headers: {apikey: PUBLIC_KEY, Authorization: `Bearer ${session.access_token}`},
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw Error('Image unavailable');
  const latest = JSON.parse(localStorage.getItem(SESSION_KEY));
  if (latest?.access_token !== session.access_token) throw Error('Session changed');
  objectUrl = URL.createObjectURL(await response.blob());
  window.bobinesImageUrl = objectUrl;
}
async function verify() {
  const id = ++checkId;
  conceal();
  message.textContent = 'Comprovant el teu accés…';
  retry.hidden = true;
  try {
    if (await checkSession() !== 'approved') {
      location.replace('/tmb-agent/auth/?returnTo=' + encodeURIComponent('/bobines/'));
      return;
    }
    await loadPrivateImage();
    if (id !== checkId || document.hidden) return;
    const script = document.createElement('script');
    script.src = 'flutter_bootstrap.js';
    script.async = true;
    script.onerror = unavailable;
    document.body.append(script);
    document.documentElement.classList.add('access-approved');
    status.hidden = true;
  } catch { if (id === checkId) unavailable(); }
}
retry.addEventListener('click', () => location.reload());
window.addEventListener('storage', e => { if (e.key === SESSION_KEY || e.key === null) location.reload(); });
window.addEventListener('pagehide', () => { ++checkId; conceal(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { ++checkId; conceal(); } });
setInterval(() => {
  if (document.hidden) return;
  const current = localStorage.getItem(SESSION_KEY);
  if (current !== snapshot) location.reload();
}, 1000);
verify();
