/**
 * Content collections.
 * builds: one Markdown file per build in src/content/builds/<slug>.md (frontmatter only).
 * See README → "How to add a new build".
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const localized = z.object({ he: z.string().min(1), en: z.string().min(1) });

const builds = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/builds' }),
  schema: ({ image }) =>
    z.object({
      /** Display name per language (model names may be identical in both). */
      name: localized,
      /** Path relative to the .md file, e.g. ../../assets/builds/falcon-5.jpg */
      image: image(),
      /** Short technical strings shared by both languages, e.g. "6S 1300mAh". */
      specs: z.array(z.string().min(1)).min(1),
      /** Optional longer description per language (shown in the lightbox). */
      description: localized.optional(),
      /** Sort order in the gallery (ascending). */
      order: z.number(),
    }),
});

export const collections = { builds };
