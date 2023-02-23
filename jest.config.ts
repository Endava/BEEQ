import { getJestProjects } from '@nrwl/jest';

export default {
  maxWorkers: 0,
  projects: getJestProjects(),
};
