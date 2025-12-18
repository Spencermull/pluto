export const cache = {};

export async function searchImages(url) {
  if (!url) return null;
  if (cache[url]) return cache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  cache[url] = data;
  return data;
}
