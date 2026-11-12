// App-wide domain types, shared between server and client code.
// Component-local contracts (e.g. AuthMode, MenuItem) stay with their components.

// ---------- Auth ----------

export type UserRole = "seeker" | "recruiter" | "admin";

export type AuthFormData = {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
};

// ---------- Jobs ----------

export type JobType = "full-time" | "part-time" | "contract" | "internship";

export type JobStatus = "active" | "expired";

// Flat form data, keys mirror the Figma layer names (isRemote, deadline…).
export type JobFormData = {
  title: string;
  companyName: string;
  category: string;
  jobType: JobType;
  isRemote: boolean;
  location: string;
  deadline: string;
  responsibilities: string;
  requirements: string;
  applicants: number;
  status: JobStatus;
};

// Table rows carry the same flat shape the "Post a New Job" form (JobFormData)
// stores, plus the extra fields only the table needs.
export type JobRow = JobFormData & {
  _id: string;
  /** Relativized post date, e.g. "Posted 4d ago". */
  posted: string;
};

// ---------- Applications ----------

export type ApplicationStatus =
  | "applied"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "hired";

// Full application snapshot (job + seeker + lifecycle) so the My Applications
// page can render with no joins.
export type ApplicationFormData = {
  jobId: string;
  userId: string;
  email: string;
  jobTitle: string;
  companyName: string;
  jobType: JobType;
  isRemote: boolean;
  location: string;
  deadline: string;
  appliedAt: string;
  status: ApplicationStatus;
  archived: boolean;
};

export type ApplicationRow = ApplicationFormData & {
  _id: string;
};
