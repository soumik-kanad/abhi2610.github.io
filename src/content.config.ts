import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const papers = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/papers' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    authors: z.array(
      z.union([
        z.string(),
        z.object({ name: z.string(), url: z.string().optional() }),
      ])
    ),
    venue: z.string(),
    year: z.number(),
    tags: z.array(z.string()).optional().default([]),
    links: z.record(z.string(), z.string()).optional().default({}),
    thumbnail: z.string().nullable().optional(),
    date: z.string().optional(),
    sortOrder: z.number().optional(),
  }),
});

export const collections = { papers };
