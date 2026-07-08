## Exploration: personal-portfolio-website

### Current State
The project is in an SDD-only bootstrap state. Real project context read during exploration:

- `/Users/gabrielvilabracho/projects/Portafolio` currently contains only `.atl/` and `openspec/`.
- `openspec/config.yaml` states that no tech stack, architecture, style system, app source, test runner, linter, type checker, formatter, or coverage tooling has been detected.
- `openspec/specs/` has no domain specs yet.
- `openspec/changes/` has no active application change artifacts before this exploration.
- No `.codegraph/` index exists, and there is no application code to inspect.

The portfolio should therefore be planned as a greenfield product, not as a refactor of an existing app. The first implementation decision is not component-level code; it is the product brief: audience, positioning, content model, visual direction, stack, quality gates, and delivery sequence.

### System Briefing

#### Product intent
Build a personal portfolio website that presents Gabriel as a senior software architect and frontend/product engineer. The site should prioritize credibility, taste, and clarity over generic resume-site conventions.

#### Primary audience
- Recruiters and hiring managers who need a fast credibility signal.
- Technical leads, founders, and clients evaluating architecture and frontend craft.
- Community members who may arrive from talks, streams, GitHub, or social links.

#### Suggested information architecture
1. **Hero** - name, positioning statement, primary CTA, secondary CTA, proof signal.
2. **Selected Work** - curated projects with problem, role, stack, outcome, and links.
3. **Architecture Philosophy** - concise principles: clean architecture, testing, frontend craft, AI as tool, mentoring.
4. **Experience Snapshot** - timeline or compact career highlights, not a full CV dump.
5. **Writing / Talks / Content** - optional if real content exists or can be added later.
6. **Contact** - clear CTA with email/social links and availability context.

#### Visual direction candidates
- **Recommended: Editorial technical portfolio** - strong typography, disciplined grid, textured/tinted neutral palette, one committed accent, restrained motion. Feels senior, confident, and memorable without becoming a gimmick.
- **Alternative: Motion-driven showcase** - richer scroll choreography, project hover reveals, page transitions, and parallax accents. Higher visual impact, but higher accessibility and performance risk.
- **Alternative: Minimal resume site** - fastest to build and easiest to maintain, but risks looking generic and underselling seniority.

#### Quality principles
- Content-first: real claims, real outcomes, no vague “passionate developer” copy.
- Distinctive but readable: avoid generic AI portfolio aesthetics, gradient text, identical card grids, and decorative glassmorphism.
- Accessible by default: semantic headings, visible focus states, 4.5:1 contrast, keyboard navigation, and `prefers-reduced-motion` support.
- Performance by design: static-first output, optimized images, minimal client JavaScript, no animation of layout properties.
- Iterative delivery: plan small SDD phases before writing code.

### Affected Areas
- `openspec/changes/personal-portfolio-website/exploration.md` - this exploration artifact.
- `openspec/changes/personal-portfolio-website/proposal.md` - planned next artifact to define scope, constraints, rollback, and selected approach.
- `openspec/changes/personal-portfolio-website/specs/portfolio-site/spec.md` - planned delta spec for portfolio requirements and scenarios.
- `openspec/changes/personal-portfolio-website/design.md` - planned technical and visual design decisions.
- `openspec/changes/personal-portfolio-website/tasks.md` - planned implementation task breakdown.
- `package.json` - planned only after proposal/design approval; would define selected stack scripts and dependencies.
- `src/` or framework-specific app directory - planned only after stack selection; would hold pages, layout, components, and styles.
- `src/content/` or equivalent content directory - planned if using content collections or local structured content for projects/articles.
- `public/` - planned for static assets such as images, OG images, favicons, and downloadable CV if desired.
- `design-system/` or `src/styles/` - planned location for tokens, typography, color, spacing, and motion rules if the design phase chooses a formal token system.

### Approaches
1. **Static HTML/CSS/JS** - Build a handcrafted static site with no framework.
   - Pros: Lowest tooling complexity, excellent performance ceiling, easy static hosting.
   - Cons: Manual routing/content organization, weaker reuse once projects/articles grow, less scalable design system ergonomics.
   - Effort: Low

2. **Astro content-first portfolio** - Use Astro with TypeScript, static output, content collections, image optimization, and optional islands only where interactivity is necessary.
   - Pros: Strong fit for content-focused portfolios, static by default, minimal JavaScript, good content modeling, can add React islands later without turning the whole site into a client app.
   - Cons: New framework setup still required; highly interactive React-style experiences need deliberate island boundaries.
   - Effort: Medium

3. **Next.js App Router portfolio** - Use Next.js with React, TypeScript, static rendering where possible, and Vercel-friendly deployment.
   - Pros: Strong ecosystem, excellent if future needs include app-like demos, server features, API routes, CMS integrations, or React-heavy UI.
   - Cons: Heavier than needed for a mostly static portfolio; static export and image optimization require care because default image optimization is runtime-oriented unless configured with a custom loader.
   - Effort: Medium to High

4. **Brief-first OpenSpec delivery** - Treat the website as a product, not a scaffold: proposal, requirements, visual/technical design, tasks, then implementation.
   - Pros: Prevents generic output, keeps scope controlled, makes visual style and content decisions explicit before code.
   - Cons: Slower before first pixels appear; requires user input on positioning, content, and references.
   - Effort: Medium

### Recommendation
Use **Astro content-first portfolio** as the likely implementation stack, paired with a **brief-first OpenSpec delivery process** and an **editorial technical portfolio** visual direction.

Rationale:
- The repo is blank and the product is content-driven, so static-first architecture is the simplest strong foundation.
- Astro documentation confirms static output support and default static rendering with client JavaScript removed unless explicitly hydrated.
- Content collections are a good fit for projects, writing, talks, and case studies.
- The site can still include selective motion or React islands later, but interactivity stays intentional instead of becoming the default.

Recommended step-by-step path:
1. **Proposal phase** - choose scope, target audience, first release sections, stack, and non-goals.
2. **Spec phase** - define portfolio requirements with Given/When/Then scenarios: navigation, responsive behavior, project content, contact CTAs, accessibility, SEO metadata.
3. **Design phase** - lock visual direction, typography, color strategy, motion rules, content model, routes, and component boundaries.
4. **Tasks phase** - split implementation into reviewable units: tooling setup, layout shell, content model, sections, assets/SEO, responsive/a11y/performance verification.
5. **Apply phase** - scaffold only after SDD artifacts are approved.
6. **Verify phase** - run whatever tooling exists by then; likely typecheck, lint, build, and basic accessibility/performance checks.

### Risks
- Portfolio content is not yet defined. Without real project outcomes, the site can become visually polished but strategically weak.
- Visual direction is not confirmed by the user. A personal brand site needs taste alignment before implementation.
- Stack choice is not final. Astro is recommended, but Next.js may be preferable if the portfolio must become an interactive app or integrate server-side features soon.
- No test, lint, format, or type tooling exists yet. Quality gates must be introduced during stack setup.
- Motion-heavy design can hurt accessibility and performance if not constrained by reduced-motion and transform/opacity-only rules.

### Ready for Proposal
Yes. The orchestrator should proceed to `sdd-propose` and ask the user to confirm the first-release scope, preferred visual direction, content sources, and whether Astro is acceptable as the default stack candidate.
