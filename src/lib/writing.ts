import { getCollection, type CollectionEntry } from 'astro:content';

/** Published posts (draft !== true), newest first. */
export async function getPublishedPosts(): Promise<CollectionEntry<'writing'>[]> {
  const all = await getCollection('writing');
  return all
    .filter((p) => p.data.draft !== true)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
