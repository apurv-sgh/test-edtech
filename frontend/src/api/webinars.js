import api from './api';

export const registerForWebinar = async (webinarId, expertId, extra = {}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token || localStorage.getItem('token') || localStorage.getItem('teacherToken');

  const res = await fetch(`${api.defaults.baseURL}/api/webinar-registrations/webinar/${webinarId}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      webinarId,
      expertId,
      name: user?.name || user?.user?.name,
      email: user?.email || user?.user?.email,
      yearOfStudy: extra.yearOfStudy || 'Other',
      expectations: extra.expectations || 'N/A',
      questions: extra.questions || '',
      source: extra.source || 'profile'
    })
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : { raw: await res.text() };

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || data?.raw || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
};


