import { ICONS, ICONS_META } from "@/assets/images";

export interface ObjectiveCardData {
  id: number;
  title: string;
  content: string;
  icon: any;
  iconMeta: any;
}

export const objectiveCardsData: ObjectiveCardData[] = [
  {
    id: 1,
    title: "Outlook",
    content: `With industries rapidly embracing digital transformation, our outlook is crystal clear: be the partner of choice for businesses that want to stay ahead in the immersive era 

We envision a world where:
Parking navigation becomes effortless with AR overlays.
Property buying happens through immersive 3D VR experiences.
Retail thrives through interactive product visualization.
Enterprises train employees in safe, simulated MR environments.

Obrive is building the tools of tomorrow, today—solutions that scale with industry needs and prepare businesses for the spatial computing revolution.`,
    icon: ICONS.TARGET_ICON,
    iconMeta: ICONS_META.TARGET_ICON,
  },
  {
    id: 2,
    title: "Origin",
    content: `Obrive Industries emerged with a bold idea: to redefine how people and businesses interact with technology. Built on a foundation of innovation, creativity, and future-driven research, our journey began with a commitment to making immersive solutions accessible and impactful for every industry.

Over the years, we've grown into a hub of immersive excellence, helping industries such as automotive, real estate, retail, manufacturing, and education adopt AR/VR/MR to improve efficiency and create deeper customer engagement. Our origin story is rooted in one belief—technology should simplify lives, not complicate them.
`,
    icon: ICONS.TARGET_ICON,
    iconMeta: ICONS_META.TARGET_ICON,
  },
  {
    id: 3,
    title: "Objective",
    content: `Our prime objective is to empower organizations with cutting-edge Augmented Reality (AR), Virtual Reality (VR), Mixed Reality (MR), Spatial Computing, and 3D Design solutions that transform challenges into opportunities.

We go beyond building applications—we create ecosystems of innovation. Every solution is tailored to drive new revenue streams, enhance operational workflows, and provide memorable customer experiences. Whether it's an AR-powered navigation system in a parking lot or a VR real estate walkthrough for global buyers, our objective is to bridge imagination with reality.`,
    icon: ICONS.TARGET_ICON,
    iconMeta: ICONS_META.TARGET_ICON,
  },
  {
    id: 4,
    title: "Opportunity",
    content: `Every client engagement is an opportunity to co-create something extraordinary. We don't just provide services; we collaborate, brainstorm, and innovate with our clients to design experiences that redefine industries.

From enterprise-scale deployments to startup collaborations, Obrive brings together:

Strategic insight- to align with your business goals.
Technical expertise- to craft robust and scalable platforms.
Creative design- to make every experience engaging and intuitive.

With Obrive, opportunities become growth engines—driving higher engagement, lower costs, and greater competitive`,
    icon: ICONS.TARGET_ICON,
    iconMeta: ICONS_META.TARGET_ICON,
  },
  {
    id: 5,
    title: "Optimization",
    content: `At Obrive, optimization isn't an afterthought—it's at the core of every solution. We ensure that every product or service is:

Cost-effective- delivering maximum ROI.
Scalable- adaptable for both startups and enterprises.
Future-ready- aligned with evolving AR/VR/MR advancements.

From reducing operational costs through AR-enabled workflows to boosting customer engagement in immersive eCommerce, Obrive builds solutions that create measurable, lasting impact.

Our mantra: Optimize today, lead tomorrow.
`,
    icon: ICONS.TARGET_ICON,
    iconMeta: ICONS_META.TARGET_ICON,
  },
];
