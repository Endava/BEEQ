#!/usr/bin/env bash
# Reference answer for tooltip-truncation, used by `nx run beeq-skills:eval --validate`.
set -euo pipefail
mkdir -p src
cat > src/ProjectCard.tsx <<'EOF'
import { BqBadge, BqCard, BqIcon, BqTooltip } from '@beeq/react';

import './ProjectCard.css';

type Project = { id: string; name: string; count: number };

export function ProjectCard({ project }: { project: Project }) {
  return (
    <BqCard>
      <div className="project-card__header">
        <BqIcon name="folder" aria-hidden="true" />
        <BqTooltip className="project-card__tooltip">
          <span slot="trigger" className="project-card__name">
            {project.name}
          </span>
          {project.name}
        </BqTooltip>
        <BqBadge>{project.count}</BqBadge>
      </div>
    </BqCard>
  );
}
EOF
cat > src/ProjectCard.css <<'EOF'
.project-card__header {
  display: flex;
  align-items: center;
  gap: var(--bq-spacing-s);
}

.project-card__tooltip {
  flex: 1;
  min-width: 0;
}

.project-card__name {
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
import { ProjectCard } from './ProjectCard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProjectCard project={{ id: '1', name: 'Customer analytics dashboard migration', count: 12 }} />
  </StrictMode>,
);
EOF
rm -- "$0"
