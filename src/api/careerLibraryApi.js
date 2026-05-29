import api from './axios';

export async function getCareerLibraryCategories() {
  const response = await api.get('/careerlibrary/categories');
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
