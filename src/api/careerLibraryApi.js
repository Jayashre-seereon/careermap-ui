import api from './axios';

export async function getCareerLibraryCategories() {
  const response = await api.get('/careerlibrary/categories');
  return response?.data ?? null;
}

export async function getCareerLibraryStreams() {
  const response = await api.get('/streams/');
  return response?.data ?? null;
}

export async function getCareerLibraryCategoriesByStream(streamId) {
  const response = await api.get(`/categories/stream/${streamId}`);
  return response?.data ?? null;
}

export async function getCareerLibraryNext(type, id) {
  const response = await api.get(`/careerlibrary/next/${type}/${id}`);
  return response?.data ?? null;
}

export async function getCareerLibraryDetails(subcategoryId) {
  const response = await api.get(`/careerlibrary/subcategory/${subcategoryId}/details`);
  return response?.data ?? null;
}

export async function startCareerLibraryPreview({ moduleId, pageType, pageId }) {
  if (moduleId === null || moduleId === undefined || moduleId === '' || pageType === null || pageType === undefined || pageType === '' || pageId === null || pageId === undefined || pageId === '') {
    throw new Error('moduleId, pageType, and pageId are required.');
  }

  const response = await api.post('/module-access/preview/start', {
    moduleId,
    pageType,
    pageId,
  });

  return response?.data ?? null;
}
