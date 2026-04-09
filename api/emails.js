/**
 * Gmail 이메일 목록 조회
 * GET /api/emails → 최근 5개 이메일 반환
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 쿠키에서 Access Token 추출
    const accessToken = extractAccessToken(req);

    if (!accessToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        details: 'No access token found. User must log in.'
      });
    }

    // Gmail API 호출 - 메일 목록 조회
    const messagesResponse = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=5',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!messagesResponse.ok) {
      if (messagesResponse.status === 401) {
        // 토큰 만료
        res.setHeader('Set-Cookie', 'gmail_access_token=; Path=/; HttpOnly; Max-Age=0');
        return res.status(401).json({ error: 'Token expired', expired: true });
      }
      throw new Error(`Gmail API error: ${messagesResponse.statusText}`);
    }

    const messagesData = await messagesResponse.json();
    const messageIds = messagesData.messages || [];

    if (messageIds.length === 0) {
      return res.status(200).json({ emails: [] });
    }

    // 각 메시지의 상세 정보 조회
    const emails = [];

    for (const message of messageIds) {
      try {
        const messageResponse = await fetch(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=From,Subject,Date`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        if (!messageResponse.ok) {
          console.error(`Failed to fetch message ${message.id}`);
          continue;
        }

        const messageData = await messageResponse.json();
        const headers = messageData.payload?.headers || [];

        const email = {
          id: message.id,
          from: getHeaderValue(headers, 'From') || 'Unknown',
          subject: getHeaderValue(headers, 'Subject') || '(No Subject)',
          date: getHeaderValue(headers, 'Date') || '',
          snippet: messageData.snippet || ''
        };

        emails.push(email);
      } catch (error) {
        console.error(`Error processing message ${message.id}:`, error);
      }
    }

    res.status(200).json({
      success: true,
      count: emails.length,
      emails: emails
    });
  } catch (error) {
    console.error('Emails API error:', error);
    res.status(500).json({
      error: 'Failed to fetch emails',
      details: error.message
    });
  }
}

/**
 * 요청에서 Access Token 추출
 */
function extractAccessToken(req) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = cookieHeader.split('; ').reduce((acc, cookie) => {
    const [name, value] = cookie.split('=');
    acc[name] = decodeURIComponent(value || '');
    return acc;
  }, {});

  return cookies.gmail_access_token;
}

/**
 * 헤더 배열에서 특정 헤더값 추출
 */
function getHeaderValue(headers, headerName) {
  const header = headers.find(h => h.name.toLowerCase() === headerName.toLowerCase());
  return header ? header.value : null;
}
