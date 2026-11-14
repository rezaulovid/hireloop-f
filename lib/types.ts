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
  companyId?:string;
  recruiterId: string;
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

/**
 * Lifecycle of an application, from the moment the seeker applies until the
 * process ends. Mirrors the `status` field allowed by the applications
 * collection schema on the API side.
 */
export type ApplicationStatus =
  | "applied"
  | "reviewed"
  | "shortlisted"
  | "interview"
  | "offered"
  | "rejected"
  | "hired";

/**
 * A job application — the snapshot of the job taken at the time of applying,
 * plus the applicant identity and the application lifecycle. Stored in the
 * `applications` collection; the My Applications page renders it with no joins.
 */
export type JobApplication = {
  /** `_id` of the applied job (relation to the `jobs` collection). */
  jobId: string;
  /** `_id` of the applicant (relation to the `user` collection). */
  userId: string;
  email: string;
  jobTitle: string;
  companyName: string;
  /** Job category, e.g. "Design". */
  category: string;
  /** Employment type — "Full-time", "Contract", … */
  jobType: JobType;
  isRemote: boolean;
  location: string;
  deadline: string;
  /** ISO 8601 timestamp of when the seeker applied. */
  appliedAt: string;
  status: ApplicationStatus;
  /** Archived applications are hidden from the "Active" tab. */
  archived: boolean;
};

/** A stored application, including its Mongo `_id`. */
export type JobApplicationRow = JobApplication & {
  _id: string;
};
