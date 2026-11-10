import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const image = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string(),
  width: z.number(),
  height: z.number(),
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: z.object({
    numeral: z.enum(['i', 'ii', 'iii', 'iv', 'v']),
    title: z.string(),
    subtitle: z.string(),
    order: z.number(),
    image: image.optional(),
    appendices: z.array(z.string()).optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['prototype, in progress', 'milestone 1 complete', 'paused']),
    stack: z.array(z.string()),
    order: z.number(),
    media: z
      .array(image.extend({ kind: z.enum(['image', 'video']) }))
      .default([]),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    draft: z.boolean().default(false),
    youtube: z.string().optional(),
  }),
});

export const collections = { chapters, work, writing };
