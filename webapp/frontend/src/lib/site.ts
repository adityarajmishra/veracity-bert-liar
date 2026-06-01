// Central site configuration: external links and metadata used across the UI.
// Update GITHUB_URL once the repository is created.

export const GITHUB_URL = "https://github.com/adityarajmishra/veracity-bert-liar";

// The final report PDF is served from the app's public/ folder so it is
// bundled with the deployed frontend and downloadable from the footer.
export const REPORT_URL = "/Rahul_Mishra_453_P4_Final_Report.pdf";

// Backend API base (interactive docs live at /docs).
export const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) || "http://127.0.0.1:8000";
export const API_DOCS_URL = `${API_BASE}/docs`;

// LIAR dataset source (Wang 2017).
export const LIAR_URL = "https://www.cs.ucsb.edu/~william/data/liar_dataset.zip";
export const LIAR_PAPER_URL = "https://aclanthology.org/P17-2067/";

// Open-source license.
export const LICENSE = "MIT";
export const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`;
