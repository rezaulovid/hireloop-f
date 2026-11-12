import { getJobs } from "@/lib/api/jobs"
import { Card } from "@/components/ui/card"
import { JobCard } from "@/app/components/JobCard"
import { FilterSelect, type FilterOption } from "@/app/components/FilterSelect"
import { JobSearchBar } from "./_components/job-search-bar"
import { JobFiltersPanel } from "./_components/job-filters-panel"

const SORT_OPTIONS: FilterOption[] = [
  { label: "Most Recent", value: "most-recent" },
  { label: "Best Match", value: "best-match" },
  { label: "Highest Salary", value: "highest-salary" },
  { label: "Most Applicants", value: "most-applicants" },
]

const BrowseJobsPage = async ({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {

  const search = await searchParams

    console.log("Search params:", search)
    // TODO: implement the query-param wiring from the filter UI here.
    const jobs = await getJobs(search)

    return (
        <div className="bg-[#0a0a0b] pb-16">
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                {/* Search panel */}
                <JobSearchBar />

                {/* Filters + results */}
                <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                    <JobFiltersPanel jobs={jobs} />

                    <section>
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-lg font-semibold text-white">
                                Found {jobs.length} Professional Jobs
                            </h2>
                            {/* Handlers live inside FilterSelect — no logic yet. */}
                            <FilterSelect
                                inline
                                label="Sort by:"
                                placeholder="Most Recent"
                                options={SORT_OPTIONS}
                            />
                        </div>

                        {jobs.length === 0 ? (
                            <Card className="p-6 text-sm text-white/60">
                                No jobs found. Try adjusting your search.
                            </Card>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {jobs.map((job) => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BrowseJobsPage;

// jobs/search-results/?currentJobId=4487680554&
// keywords=full-time%20Digital%20Marketing%20
// Specialist%20or%20Search%20Engine%20Optimization
// %20Specialist%20or%20Brand%20Manager%20or%20Senior
// %20Brand%20Marketing%20Manager%2C%20on-site%20or
// %20hybrid&origin=PREFERENCES_LANDING
// &referralSearchId=
// 9hpc9VQpDxMbU%2BUVtRIO7Q%3D%3D&geoId=103363366&f_AL
// =true
