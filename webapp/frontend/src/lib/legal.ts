// Legal content shown in the footer modal. Written to be broadly compliant
// (GDPR/CCPA-aware) for an open-source, educational, non-commercial demo.
// This is informational and not a substitute for professional legal advice.

export interface LegalDoc {
  id: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}

const UPDATED = "May 2026";

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  terms: {
    id: "terms",
    title: "Terms & Conditions",
    updated: UPDATED,
    sections: [
      {
        heading: "1. Acceptance",
        body: [
          "By accessing this website or its API you agree to these Terms. If you do not agree, do not use the service.",
          "This is a free, open-source, educational research project. It is provided on an as-is and as-available basis without warranties of any kind.",
        ],
      },
      {
        heading: "2. Nature of the Service",
        body: [
          "The service estimates the likely veracity of a text statement using a machine-learning model. Outputs are probabilistic predictions, not statements of fact, legal findings, or professional advice.",
          "Predictions may be wrong. You must not rely on them for any decision that affects legal rights, safety, health, finances, reputation, or eligibility.",
        ],
      },
      {
        heading: "3. Acceptable Use",
        body: [
          "You agree not to: (a) use the service to harass, defame, or unlawfully target any person; (b) attempt to disrupt, overload, reverse-engineer, or gain unauthorized access to the service; (c) exceed published rate limits or circumvent access controls; (d) use outputs to represent that any individual has lied or committed wrongdoing.",
        ],
      },
      {
        heading: "4. Intellectual Property & License",
        body: [
          "The source code is released under the MIT License. Model weights derive from publicly available pre-trained checkpoints and public datasets. You are free to use, modify, and redistribute under the license terms, with attribution.",
        ],
      },
      {
        heading: "5. Limitation of Liability",
        body: [
          "To the maximum extent permitted by law, the author is not liable for any direct, indirect, incidental, or consequential damages arising from use of the service or reliance on its outputs.",
        ],
      },
      {
        heading: "6. Changes",
        body: [
          "These Terms may be updated at any time. Continued use after changes constitutes acceptance of the revised Terms.",
        ],
      },
    ],
  },

  privacy: {
    id: "privacy",
    title: "Privacy & Cookies Policy",
    updated: UPDATED,
    sections: [
      {
        heading: "1. Data We Process",
        body: [
          "When you submit a statement for analysis, the text is sent to the API to generate a prediction. We do not require an account and do not ask for personal identifiers.",
          "Do not submit personal, sensitive, or confidential information. Statements should be public claims you wish to analyze.",
        ],
      },
      {
        heading: "2. Logs",
        body: [
          "The API records minimal technical logs (timestamp, request identifier, latency, and truncated IP for rate limiting and abuse prevention). These are used solely to operate and protect the service and are not sold or shared.",
        ],
      },
      {
        heading: "3. Cookies & Local Storage",
        body: [
          "This site uses no tracking or advertising cookies. It stores a single preference in your browser's local storage — your light/dark theme choice — which never leaves your device.",
        ],
      },
      {
        heading: "4. Your Rights",
        body: [
          "Because we do not maintain user accounts or persistent personal profiles, there is no personal data store to access, correct, or delete. Submitted statements are processed transiently to return a prediction.",
          "Residents of the EEA/UK (GDPR) and California (CCPA/CPRA) retain their statutory rights; contact the project via the repository for any request.",
        ],
      },
    ],
  },

  api: {
    id: "api",
    title: "API Consumption Policy",
    updated: UPDATED,
    sections: [
      {
        heading: "1. Open Access",
        body: [
          "The API is free to consume for research and educational use within the published rate limits. Interactive documentation is available at the /docs endpoint and a machine-readable schema at /openapi.json.",
        ],
      },
      {
        heading: "2. Rate Limits",
        body: [
          "Requests are limited per client (default 120/minute; the prediction endpoint 30/minute). Exceeding limits returns HTTP 429 with a Retry-After header. Do not attempt to bypass limits via rotation or distribution.",
        ],
      },
      {
        heading: "3. Fair Use & Attribution",
        body: [
          "Bulk scraping, resale of raw access, or use that degrades availability for others is prohibited. If you build on this API, attribution to the project repository is appreciated.",
        ],
      },
      {
        heading: "4. No Warranty",
        body: [
          "The API may change, rate-limit, or be discontinued at any time. Outputs are probabilistic and provided without warranty. Do not use them as authoritative fact-checks.",
        ],
      },
    ],
  },

  disclaimer: {
    id: "disclaimer",
    title: "Legal Disclaimer",
    updated: UPDATED,
    sections: [
      {
        heading: "Research & Educational Purpose",
        body: [
          "This project is an academic demonstration of natural language processing methods. It is not a fact-checking authority and is not affiliated with PolitiFact, the dataset authors, or any government or news organization.",
        ],
      },
      {
        heading: "Not Professional Advice",
        body: [
          "Nothing here constitutes legal, financial, medical, or journalistic advice. Veracity predictions are statistical estimates derived from historical data and may reflect the biases and limitations of that data.",
        ],
      },
      {
        heading: "No Defamation",
        body: [
          "Outputs must not be used to assert that any identifiable person has lied or acted wrongfully. The model classifies text, not people.",
        ],
      },
    ],
  },
};

export const LEGAL_ORDER = ["terms", "privacy", "api", "disclaimer"] as const;
