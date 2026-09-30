/**
 * Options for the `@beeq/tools:sync-skills` sync generator. It takes none: the source and output
 * folders are fixed in `lib/sync.ts` (`SYNC_CONFIG`) so `nx sync` and `nx sync:check` always agree.
 *
 * Kept in sync with [`schema.json`](./schema.json).
 */
type SyncSkillsGeneratorSchema = Record<string, never>;

export type { SyncSkillsGeneratorSchema };
