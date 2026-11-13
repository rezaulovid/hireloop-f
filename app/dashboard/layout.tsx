import { SidebarProvider } from "@/components/ui/sidebar"

import { DashboardSidebar } from "../components/DashboardSidebar"
import { DashboardSearchProvider, DashboardTopbar } from "./_components/dashboard-topbar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider className="dark min-h-svh bg-[#08080a] text-[#EDEDEF]">
            <DashboardSearchProvider>
                <DashboardSidebar />
                <div className="flex min-h-svh w-full flex-1 flex-col bg-[#08080a]">
                    <DashboardTopbar />
                    <div className="flex-1">{children}</div>
                </div>
            </DashboardSearchProvider>
        </SidebarProvider>
    )
}

export default DashboardLayout
