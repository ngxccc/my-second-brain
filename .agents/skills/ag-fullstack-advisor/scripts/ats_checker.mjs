import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Core keyword groups with weights and aliases (demanded 2025 tools included)
const KEYWORDS = {
  frontend: [
    { name: 'TypeScript', weight: 3, aliases: ['typescript', 'ts'] },
    { name: 'React', weight: 3, aliases: ['react', 'reactjs', 'react.js'] },
    { name: 'JavaScript', weight: 3, aliases: ['javascript', 'js', 'es6', 'es6+', 'ecmascript'] },
    { name: 'Next.js', weight: 3, aliases: ['nextjs', 'next.js'] },
    { name: 'Vue.js', weight: 2, aliases: ['vue', 'vuejs', 'vue.js'] },
    { name: 'Angular', weight: 2, aliases: ['angular', 'angularjs', 'angular.js'] },
    { name: 'TanStack Query', weight: 2, aliases: ['tanstack query', 'react query', 'react-query'] },
    { name: 'tRPC', weight: 2, aliases: ['trpc'] },
    { name: 'Tailwind CSS', weight: 2, aliases: ['tailwind', 'tailwindcss'] },
    { name: 'Redux', weight: 2, aliases: ['redux', 'redux-toolkit', 'rtk'] },
    { name: 'Zustand', weight: 2, aliases: ['zustand'] },
    { name: 'HTML5', weight: 1, aliases: ['html5', 'html'] },
    { name: 'CSS3', weight: 1, aliases: ['css3', 'css'] },
    { name: 'Svelte', weight: 2, aliases: ['svelte'] },
    { name: 'Vite', weight: 2, aliases: ['vite'] },
    { name: 'Webpack', weight: 1, aliases: ['webpack'] }
  ],
  backend: [
    { name: 'Node.js', weight: 3, aliases: ['nodejs', 'node.js', 'node'] },
    { name: 'Express.js', weight: 3, aliases: ['express', 'expressjs', 'express.js'] },
    { name: 'NestJS', weight: 3, aliases: ['nestjs', 'nest.js'] },
    { name: 'ASP.NET Core', weight: 3, aliases: ['asp.net', 'aspnet', 'c#', 'csharp', '.net', 'dot net'] },
    { name: 'Spring Boot', weight: 3, aliases: ['spring boot', 'springboot', 'spring', 'java'] },
    { name: 'PostgreSQL', weight: 3, aliases: ['postgresql', 'postgres'] },
    { name: 'Drizzle ORM', weight: 2, aliases: ['drizzle', 'drizzle orm', 'drizzle-orm'] },
    { name: 'Prisma', weight: 2, aliases: ['prisma'] },
    { name: 'GraphQL', weight: 2, aliases: ['graphql', 'gql'] },
    { name: 'gRPC', weight: 2, aliases: ['grpc'] },
    { name: 'WebSockets', weight: 2, aliases: ['websockets', 'websocket', 'ws'] },
    { name: 'Redis', weight: 2, aliases: ['redis'] },
    { name: 'MongoDB', weight: 2, aliases: ['mongodb', 'mongo'] },
    { name: 'SQL Server', weight: 2, aliases: ['sql server', 'mssql', 'microsoft sql server'] },
    { name: 'Fastify', weight: 2, aliases: ['fastify'] },
    { name: 'Python', weight: 2, aliases: ['python', 'py'] },
    { name: 'Go', weight: 2, aliases: ['golang', 'go'] }
  ],
  devops_arch: [
    { name: 'Docker', weight: 3, aliases: ['docker', 'docker-compose'] },
    { name: 'Kubernetes', weight: 3, aliases: ['kubernetes', 'k8s'] },
    { name: 'AWS', weight: 3, aliases: ['aws', 'amazon web services'] },
    { name: 'CI/CD', weight: 2, aliases: ['ci/cd', 'cicd', 'github actions', 'gitlab ci'] },
    { name: 'Playwright', weight: 2, aliases: ['playwright'] },
    { name: 'Jest', weight: 2, aliases: ['jest'] },
    { name: 'Cypress', weight: 2, aliases: ['cypress'] },
    { name: 'Bun', weight: 2, aliases: ['bun'] },
    { name: 'Microservices', weight: 2, aliases: ['microservices', 'microservice'] },
    { name: 'Clean Architecture', weight: 2, aliases: ['clean architecture', 'onion architecture'] },
    { name: 'DDD', weight: 2, aliases: ['ddd', 'domain driven design', 'domain-driven design'] },
    { name: 'Agile/Scrum', weight: 2, aliases: ['agile', 'scrum'] },
    { name: 'Git/GitHub', weight: 1, aliases: ['git', 'github', 'gitlab'] }
  ]
};

// Check if word exists in text with boundaries (handles next.js, c#, c++ etc)
function checkWord(text, word) {
  const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(?<![a-zA-Z0-9])${escaped}(?![a-zA-Z0-9])`, 'i');
  return regex.test(text);
}

// Clean HTML tags
function cleanHtml(text) {
  return text.replace(/<[^>]*>/g, ' ');
}

// Clean LaTeX macros and syntax
function cleanLatex(text) {
  let cleaned = text;
  // 1. Remove comments
  cleaned = cleaned.replace(/(?<!\\)%.*/g, '');
  // 2. Remove layout/environments
  cleaned = cleaned.replace(/\\(?:begin|end|documentclass|usepackage|hypersetup|pagestyle|geometry|setup)\{[^}]*\}/gi, ' ');
  // 3. Extract text from format macros (recursive to handle nesting)
  for (let i = 0; i < 3; i++) {
    cleaned = cleaned.replace(/\\(?:href|url|textbf|textit|section|subsection|subsubsection|item|color|emph)(?:\[[^\]]*\])?\{([^}]+)\}/gi, ' $1 ');
  }
  // Special handling for two-argument href to keep second argument
  cleaned = cleaned.replace(/\\href\{[^}]*\}\{([^}]+)\}/gi, ' $1 ');
  // 4. Remove escaping backslashes from special characters
  cleaned = cleaned.replace(/\\([&%#_{}])/g, '$1');
  // 5. Remove remaining commands
  cleaned = cleaned.replace(/\\[a-zA-Z]+/g, ' ');
  cleaned = cleaned.replace(/\\\\/g, ' ');
  return cleaned;
}

// Read and parse file based on extension
function loadFile(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  const rawText = readFileSync(filePath, 'utf8');
  if (ext === 'tex') {
    return cleanLatex(rawText);
  } else if (ext === 'html' || ext === 'htm') {
    return cleanHtml(rawText);
  }
  return rawText;
}

function main() {
  const args = process.argv.slice(2);
  const jsonIndex = args.indexOf('--json');
  const jsonMode = jsonIndex !== -1;
  if (jsonMode) {
    args.splice(jsonIndex, 1);
  }

  if (args.length === 0) {
    console.error('❌ Error: Missing CV path.');
    console.log('Usage: bun ats_checker.mjs [--json] <cv_path> [jd_path]');
    process.exit(1);
  }

  const cvPath = resolve(args[0]);
  const jdPath = args[1] ? resolve(args[1]) : null;

  if (!existsSync(cvPath)) {
    console.error(`❌ Error: CV file not found at ${cvPath}`);
    process.exit(1);
  }

  const cvText = loadFile(cvPath).toLowerCase();
  let jdText = '';

  if (jdPath) {
    if (!existsSync(jdPath)) {
      if (!jsonMode) {
        console.warn(`⚠️ Warning: JD file not found at ${jdPath}. Proceeding with default keyword database.`);
      }
    } else {
      jdText = loadFile(jdPath).toLowerCase();
    }
  }

  const matches = { frontend: [], backend: [], devops_arch: [] };
  const missing = { frontend: [], backend: [], devops_arch: [] };
  
  const matchedItems = { frontend: [], backend: [], devops_arch: [] };
  const missingItems = { frontend: [], backend: [], devops_arch: [] };

  let totalMatchedWeight = 0;
  let totalExpectedWeight = 0;

  const categoryWeights = {
    frontend: { matched: 0, total: 0 },
    backend: { matched: 0, total: 0 },
    devops_arch: { matched: 0, total: 0 }
  };

  for (const [category, list] of Object.entries(KEYWORDS)) {
    for (const item of list) {
      // If a JD is provided, check if any alias is present in the JD
      let isItemInJD = true;
      if (jdPath && jdText) {
        isItemInJD = item.aliases.some(alias => checkWord(jdText, alias));
      }

      if (isItemInJD) {
        totalExpectedWeight += item.weight;
        categoryWeights[category].total += item.weight;

        // Check if any alias is present in the CV
        const isItemInCV = item.aliases.some(alias => checkWord(cvText, alias));
        if (isItemInCV) {
          matchedItems[category].push({ name: item.name, weight: item.weight });
          matches[category].push(`${item.name} (w:${item.weight})`);
          totalMatchedWeight += item.weight;
          categoryWeights[category].matched += item.weight;
        } else {
          missingItems[category].push({ name: item.name, weight: item.weight });
          missing[category].push(`${item.name} (w:${item.weight})`);
        }
      }
    }
  }

  // Calculate Weighted Scores
  const matchRate = totalExpectedWeight > 0 ? Math.round((totalMatchedWeight / totalExpectedWeight) * 100) : 0;

  const feRate = categoryWeights.frontend.total > 0 
    ? Math.round((categoryWeights.frontend.matched / categoryWeights.frontend.total) * 100) : 0;

  const beRate = categoryWeights.backend.total > 0 
    ? Math.round((categoryWeights.backend.matched / categoryWeights.backend.total) * 100) : 0;

  const devopsRate = categoryWeights.devops_arch.total > 0 
    ? Math.round((categoryWeights.devops_arch.matched / categoryWeights.devops_arch.total) * 100) : 0;

  if (jsonMode) {
    const reportData = {
      metadata: {
        cvPath,
        jdPath: jdPath || 'None'
      },
      scores: {
        overall: matchRate,
        categories: {
          frontend: { matchedWeight: categoryWeights.frontend.matched, totalWeight: categoryWeights.frontend.total, rate: feRate },
          backend: { matchedWeight: categoryWeights.backend.matched, totalWeight: categoryWeights.backend.total, rate: beRate },
          devops_arch: { matchedWeight: categoryWeights.devops_arch.matched, totalWeight: categoryWeights.devops_arch.total, rate: devopsRate }
        }
      },
      keywords: {
        matched: matchedItems,
        missing: missingItems
      }
    };
    console.log(JSON.stringify(reportData, null, 2));
    return;
  }

  // Print Report (Human Readable)
  console.log('=== ATS CV CHECKER REPORT (WEIGHTED & ALIAS-AWARE) ===\n');
  console.log(`## 1. Overall Weighted ATS Score: **${matchRate}%**`);
  console.log(`- Frontend Relevance: **${feRate}%** (${categoryWeights.frontend.matched}/${categoryWeights.frontend.total} weight matched)`);
  console.log(`- Backend Relevance: **${beRate}%** (${categoryWeights.backend.matched}/${categoryWeights.backend.total} weight matched)`);
  console.log(`- DevOps & Architecture Relevance: **${devopsRate}%** (${categoryWeights.devops_arch.matched}/${categoryWeights.devops_arch.total} weight matched)\n`);

  console.log('## 2. Matched Keywords (with weights):');
  console.log(`- **Frontend:** ${matches.frontend.map(w => `\`${w}\``).join(', ') || '*None*'}`);
  console.log(`- **Backend:** ${matches.backend.map(w => `\`${w}\``).join(', ') || '*None*'}`);
  console.log(`- **DevOps & Arch:** ${matches.devops_arch.map(w => `\`${w}\``).join(', ') || '*None*'}\n`);

  console.log('## 3. Recommended Keywords to Add (Skill Gaps by Priority):');
  console.log(`- **Frontend:** ${missing.frontend.map(w => `\`${w}\``).join(', ') || '*None*'}`);
  console.log(`- **Backend:** ${missing.backend.map(w => `\`${w}\``).join(', ') || '*None*'}`);
  console.log(`- **DevOps & Arch:** ${missing.devops_arch.map(w => `\`${w}\``).join(', ') || '*None*'}\n`);

  console.log('## 4. Key Formatting Checklist:');
  console.log('- [ ] Layout: Single-column format preferred (ATS reads top-to-bottom, left-to-right).');
  console.log('- [ ] Font: Standard clean fonts only (Arial, Calibri, Helvetica). No icons/graphical progress bars.');
  console.log('- [ ] File format: Save as PDF or DOCX (ensure text is selectable, not an image scan).');
  console.log('- [ ] Section Headers: Use standard names: "Experience", "Skills", "Education", "Projects".');
}

main();
