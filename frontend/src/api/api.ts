const BASE = 'http://localhost:8000/api';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

async function put<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  return res.json();
}

// Auth
export const login = (username: string, password: string) =>
  post<{ token: string }>('/auth/login', { username, password });

// Types
export const getTypes = () => get<any[]>('/types');
export const getTypesByCategory = (category: string) => get<any[]>(`/types/${category}`);

// Releases
export const getReleases = () => get<any[]>('/releases');
export const getRelease = (id: number) => get<any>(`/releases/${id}`);
export const createRelease = (data: object) => post<any>('/releases', data);
export const updateRelease = (id: number, data: object) => put<any>(`/releases/${id}`, data);
export const deleteRelease = (id: number) => del<any>(`/releases/${id}`);

// Tracks
export const getTracks = () => get<any[]>('/tracks');
export const getTrack = (id: number) => get<any>(`/tracks/${id}`);
export const createTrack = (data: object) => post<any>('/tracks', data);
export const updateTrack = (id: number, data: object) => put<any>(`/tracks/${id}`, data);
export const deleteTrack = (id: number) => del<any>(`/tracks/${id}`);

// Sources
export const getSources = () => get<any[]>('/sources');
export const getSource = (id: number) => get<any>(`/sources/${id}`);
export const createSource = (data: object) => post<any>('/sources', data);
export const updateSource = (id: number, data: object) => put<any>(`/sources/${id}`, data);
export const deleteSource = (id: number) => del<any>(`/sources/${id}`);

// Samples
export const getSamples = () => get<any[]>('/samples');
export const getSample = (id: number) => get<any>(`/samples/${id}`);
export const createSample = (data: object) => post<any>('/samples', data);
export const updateSample = (id: number, data: object) => put<any>(`/samples/${id}`, data);
export const deleteSample = (id: number) => del<any>(`/samples/${id}`);
export const attachSampleToTrack = (sampleId: number, trackId: number) =>
  post<any>(`/samples/${sampleId}/tracks/${trackId}`, {});
export const detachSampleFromTrack = (sampleId: number, trackId: number) =>
  del<any>(`/samples/${sampleId}/tracks/${trackId}`);
