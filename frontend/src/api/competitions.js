import api from './apit';

/**
 * Fetch all competitions from the backend.
 */
export const getCompetitions = () => {
  return api.get('/api/competitions').then(res => {
    console.log('Full API response:', res.data); 

    // Handle both array or {competitions: []}
    const competitions = Array.isArray(res.data)
      ? res.data
      : res.data?.competitions || [];

    return competitions.map(c => ({
      ...c,
      _id: c._id || c.id,
      title: c.title || '(Untitled)',
      category: c.category || '',
      prize: c.prize || '',
      startsOn: c.startsOn || '',
      endsOn: c.endsOn || '',
      teacher: c.teacher || '',
      status: c.status || '', // include virtual field
    }));
  });
};

/**
 * Create a new competition.
 */
export const createCompetition = (competitionData) => {
  const payload = {
    title: competitionData.title ?? '',      // ✅ matches schema
    category: competitionData.category ?? '',
    prize: competitionData.prize ?? '',
    startsOn: competitionData.startsOn ?? '',
    endsOn: competitionData.endsOn ?? '',
    teacher: competitionData.teacher ?? '',  // ✅ matches schema
  };
  return api.post('/api/competitions', payload);
};

/**
 * Update a competition by ID.
 */
export const updateCompetition = (competitionId, competitionData) => {
  const payload = {
    title: competitionData.title ?? '',
    category: competitionData.category ?? '',
    prize: competitionData.prize ?? '',
    startsOn: competitionData.startsOn ?? '',
    endsOn: competitionData.endsOn ?? '',
    teacher: competitionData.teacher ?? '',
  };
  return api.put(`/api/competitions/${competitionId}`, payload);
};

/**
 * Delete a competition by ID.
 */
export const deleteCompetition = (competitionId) => {
  return api.delete(`/api/competitions/${competitionId}`);
};
