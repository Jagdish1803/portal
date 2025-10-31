"use client"

import * as React from "react"
import {
  Building2,
  CalendarCheck,
  FileText,
  Tags,
  AlertCircle,
  User,
  LayoutDashboard,
  Clock,
  Shield,
  ArrowLeft,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useQuery } from "@tanstack/react-query"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/employee-panel",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Attendance",
      url: "/employee-panel/attendance",
      icon: CalendarCheck,
    },
    {
      title: "My Leaves",
      url: "/employee-panel/my-leaves",
      icon: Clock,
      items: [
        {
          title: "Apply Leave",
          url: "/employee-panel/my-leaves/apply",
        },
        {
          title: "Leave History",
          url: "/employee-panel/my-leaves/history",
        },
      ],
    },
    {
      title: "My Tags & Work",
      url: "/employee-panel/my-tags",
      icon: Tags,
      items: [
        {
          title: "Submit Logs",
          url: "/employee-panel/my-tags/submit",
        },
        {
          title: "View History",
          url: "/employee-panel/my-tags/history",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "My Issues",
      url: "/employee-panel/my-issues",
      icon: AlertCircle,
    },
    {
      title: "My Profile",
      url: "/employee-panel/my-profile",
      icon: User,
    },
  ],
}

export function EmployeeAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Check if user is admin
  const { data: authData } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me')
      if (!response.ok) return null
      return response.json()
    }
  })

  const isAdmin = authData?.employee?.role === 'ADMIN'
  const isTeamLeader = authData?.employee?.role === 'TEAMLEADER'
  const canAccessAdminPanel = isAdmin || isTeamLeader

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/employee-panel">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground border border-sidebar-border">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Employee Portal</span>
                  <span className="truncate text-xs">My Workspace</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        
        {/* Show admin panel link if user is admin or team leader */}
        {canAccessAdminPanel && (
          <div className="px-3 py-2 mt-2 border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/" className="flex items-center gap-2 text-sm">
                    <Shield className="size-4" />
                    <span>Switch to Admin Panel</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
