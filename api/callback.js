/**
 * Gmail OAuth 콜백 처리
 * Google에서 인증 코드를 받으면 Access Token으로 교환
 * GET /api/callback?code=...
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error, state } = req.query;

  // 에러 확인
  if (error) {
    return res.redirect(`/?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const redirectUri = process.env.GMAIL_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing environment variables');
    }

    // Access Token 요청
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Token exchange failed: ${errorData.error}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 3600;

    if (!accessToken) {
      throw new Error('No access token received');
    }

    // HttpOnly 쿠키에 토큰 저장
    // 이렇게 하면 JavaScript에서 접근 불가능 (XSS 방지)
    const isSecure = process.env.VERCEL_ENV === 'production';
    const cookiePath = `gmail_access_token=${encodeURIComponent(accessToken)}; Path=/; HttpOnly; SameSite=Lax${isSecure ? '; Secure' : ''}; Max-Age=${expiresIn}`;

    res.setHeader('Set-Cookie', cookiePath);

    // 메인 페이지로 리디렉트
    res.redirect('/');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`/?error=${encodeURIComponent(error.message)}`);
  }
}
