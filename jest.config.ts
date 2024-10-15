import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  maxWorkers: 0,
  projects: await getJestProjectsAsync(),
});
