export type Highlight = { num: string; text: string };
export type Role = { co: string; title: string; badge: string; date: string; highlights?: Highlight[]; points: string[] };

// `num` may contain <s> markup for a struck-through "before" value
export const experiences: Role[] = [
  {
    co: "Reach Industries", title: "Frontend Developer", badge: "RI", date: "Jan 2024 – Oct 2026",
    highlights: [
      { num: "−40%", text: "Render times on the slowest views, found with PostHog and fixed with memoisation and lazy loading." },
      { num: "<s>22</s> → 14 min", text: "Re-engineered the CI pipeline, cutting E2E build times by around 35%." },
    ],
    points: [
      "Owned features end to end across the experiment documentation app, AI monitoring views and live lab streaming, used by 10+ customer organisations. Ran discovery sessions with scientists and product owners, then prototyped in Figma and shipped.",
      "Worked cross-functionally with designers, product managers, marketing and sales to turn requirements into polished features.",
      "Created and maintained the shared design system and component library in Storybook, with visual regression testing in Chromatic.",
      "Redesigned the human-in-the-loop audit flow after users found it confusing, so reviewers could check each completed protocol step, sign approvals and dispute errors made by the AI.",
      "Built an in-app guided onboarding system with driver.js, walking new users through key workflows step by step.",
      "Integrated REST and GraphQL APIs, with TanStack Query for REST data, Apollo Client for GraphQL and Redux for app state.",
      "Built real-time views with custom D3 components driven by live WebSocket streams, plus filterable TanStack Table data tables.",
      "Architected full-stack solutions across React, Go and PostgreSQL, and built a Node.js and Express backend-for-frontend layer.",
      "Proposed and led the Kubb rollout, generating type-safe API clients from the OpenAPI spec to keep the front end and back end in sync.",
      "Used PostHog to spot slow views, then cut their render times by 40% with memoisation and lazy loading.",
      "Resolved a live incident where rendering too many live-capture values stopped AI-assisted experiments from running, by paginating the data and caching the pages around the visible time range.",
      "Improved accessibility with semantic HTML, ARIA and axe audits, and led the move to a fully responsive web app, delegating pages to developers based on their strengths.",
      "Set the unit, E2E and visual test strategy with Jest, React Testing Library and Playwright.",
      "Added OAuth and JWT login plus role-based access control for the multi-tenant platform.",
      "Set team standards with ESLint, Prettier, CLAUDE.md files and Claude Code skills for reviewing human and agent-generated code.",
      "Handled front-end releases on AWS behind PostHog feature flags, led code reviews, mentored developers and wrote technical docs.",
    ],
  },
  {
    co: "RMR Property Investments", title: "Junior Frontend Developer", badge: "RM", date: "May 2022 – Dec 2023",
    highlights: [{ num: "−45%", text: "Page load times, with Webpack code splitting and memoised components." }],
    points: [
      "Built customer dashboards, internal web apps and parts of the marketing website in an early-stage startup of about 30.",
      "Built screens, components and navigation for the React Native mobile app, published on the App Store and Google Play.",
      "Migrated the application codebase from JavaScript to TypeScript, improving type safety and making refactoring easier.",
      "Cut page load times by 45% with Webpack code splitting and reduced unnecessary re-renders by memoising components.",
      "Led the migration of all styling from Sass to Tailwind CSS, building responsive layouts with CSS Grid and Flexbox.",
    ],
  },
  {
    co: "Wanstor", title: "Technical Consultant", badge: "WA", date: "Mar 2021 – Apr 2022",
    points: [
      "Created databases and filegroups on hosted client machines with SQLcmd and T-SQL.",
      "Ran PowerShell in the Exchange Management Shell for complex user requests.",
      "Deployed security updates and patches to vulnerable client devices alongside platform engineering.",
      "Managed laptops, tablets, phones and POS devices with Desktop Central and MaaS360.",
    ],
  },
  {
    co: "Wagamama", title: "Onsite Service & Support Engineer", badge: "WG", date: "Sep 2020 – Mar 2021",
    highlights: [{ num: "+30%", text: "Customer feedback from my requests lifted my team's KPI stats." }],
    points: [
      "First point of contact for client customers, owning requests through to completion.",
      "Kept IT operations running smoothly across client sites.",
      "Troubleshot with Active Directory, Desktop Central, Azure and Exchange.",
    ],
  },
  {
    co: "Bright Network", title: "Graduate Technology Intern", badge: "BN", date: "May 2020 – Jul 2020",
    points: [
      "Researched the market for facial verification in mobile devices and apps.",
      "Presented a project management plan taking the feature from concept to release.",
    ],
  },
  {
    co: "FedEx", title: "Operational Support Agent", badge: "FX", date: "Mar 2019 – Apr 2019",
    points: [
      "Handled customer calls, requests and queries clearly and concisely.",
      "Met daily quotas in a high-pressure environment.",
    ],
  },
];
