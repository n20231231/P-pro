/**
 * Gmail OAuth 인증 URL 생성
 * GET /api/auth → Google 로그인 페이지로 리디렉트
 */

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = process.env.GMAIL_CLIENT_ID;
  const redirectUri = process.env.GMAIL_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).json({
      error: 'Missing environment variables',
      details: 'GMAIL_CLIENT_ID and GMAIL_REDIRECT_URI must be set'
    });
  }

  // Google OAuth 2.0 콘센트 URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  googleAuthUrl.searchParams.append('client_id', clientId);
  googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/gmail.readonly');
  googleAuthUrl.searchParams.append('access_type', 'offline');
  googleAuthUrl.searchParams.append('state', generateState());

  res.redirect(googleAuthUrl.toString());
}

/**
 * CSRF 공격 방지를 위한 state 토큰 생성
 */
function generateState() {
  return Math.random().toString(36).substr(2, 9);
}
