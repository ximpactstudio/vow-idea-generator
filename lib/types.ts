export type IdeaType = "Model" | "Component" | "Tactic" | "Test";
export type Horizon = "H1" | "H2" | "H3";
export type Confidence = "low" | "medium" | "high";

export const COMPONENT_AREAS = [
  "Audience",
  "Moment/Timing",
  "Narrative/Messaging",
  "Format/Tool",
  "Channel/Distribution",
  "Partner/Steward",
  "Economics/LTV",
] as const;

export type ComponentArea = (typeof COMPONENT_AREAS)[number];

export interface ClassificationResult {
  idea_h1: string;
  idea_h2: string;
  bullets: string[];
  type: IdeaType;
  horizon: Horizon;
  component_area: string;
  tags: string[];
  confidence: Confidence;
  rationale: string;
}

export interface SubmitPayload {
  idea: string;
  name?: string;
  email?: string;
  repeatability?: string;
  whoFor?: string;
  moment?: string;
  success?: string;
  links?: string;
  honeypot?: string;
}

export interface ClassificationSummary {
  idea_h1: string;
  idea_h2: string;
  bullets: string[];
  type: string;
  horizon: string;
}

export interface SheetRow {
  Timestamp: string;
  Name: string;
  Email: string;
  "Idea (raw)": string;
  Repeatability: string;
  "Who for": string;
  Moment: string;
  Success: string;
  Links: string;
  "Idea H1": string;
  "Idea H2": string;
  Bullets: string;
  Type: string;
  Horizon: string;
  "Component Area": string;
  Tags: string;
  Confidence: string;
  Rationale: string;
  Source: string;
  Status: string;
}
