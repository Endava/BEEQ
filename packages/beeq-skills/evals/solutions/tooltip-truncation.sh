#!/usr/bin/env bash
# Reference answer for tooltip-truncation, used by `nx run beeq-skills:eval --validate`.
set -euo pipefail
mkdir -p src
cat > src/ProjectList.tsx <<'EOF'
import { BqBadge, BqIcon, BqTooltip } from '@beeq/react';

import './ProjectList.css';

type Project = { id: string; name: string; count: number };

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.id} className="project-row">
          <BqIcon name="folder" aria-hidden="true" />
          <BqTooltip className="project-row__tooltip" placement="right">
            <span slot="trigger" className="project-row__name">
              {project.name}
            </span>
            {project.name}
          </BqTooltip>
          <BqBadge>{project.count}</BqBadge>
        </li>
      ))}
    </ul>
  );
}
EOF
cat > src/ProjectList.css <<'EOF'
.project-row {
  display: flex;
  align-items: center;
  gap: var(--bq-spacing-s);
}

.project-row__tooltip {
  flex: 1;
  min-width: 0;
}

.project-row__name {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
EOF
cat > src/index.css <<'EOF'
@import "@beeq/core/dist/beeq/beeq.css";
EOF
cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <script data-beeq="https://cdn.jsdelivr.net/npm/@beeq/core/dist/beeq/svg/"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF
cat > src/main.tsx <<'EOF'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { ProjectList } from './ProjectList';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProjectList projects={[{ id: '1', name: 'Customer analytics dashboard migration', count: 12 }]} />
  </StrictMode>,
);
EOF
rm -- "$0"
