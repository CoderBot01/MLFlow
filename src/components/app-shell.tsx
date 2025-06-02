
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Archive,
  Sparkles,
  GitCompareArrows,
  Settings2,
  UserCircle2,
  PanelLeft,
  Search,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/icons/logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/models", label: "Model Management", icon: Archive },
  { href: "/insights", label: "AI Insights", icon: Sparkles },
  { href: "/experiments", label: "Experiments", icon: GitCompareArrows },
];

function AppHeader() {
  const { isMobile } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {isMobile && <SidebarTrigger className="sm:hidden"><PanelLeft /></SidebarTrigger>}
      <Link href="/" className="flex items-center gap-2 font-semibold mr-auto">
        <Logo className="h-6 w-6 text-primary" />
        <span className="text-lg">MLFlow</span>
      </Link>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <UserCircle2 className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold group-data-[collapsible=icon]:hidden">
             <Logo className="h-6 w-6 text-primary" />
             <span className="text-lg text-sidebar-foreground">MLFlow</span>
          </Link>
          <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                  className={cn(
                    pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "group-data-[collapsible=icon]:justify-center" 
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="group-data-[collapsible=icon]:justify-center">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={{ children: "Settings", className: "group-data-[collapsible=icon]:block hidden"}}
                className={cn(
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "group-data-[collapsible=icon]:justify-center"
                )}
              >
                <Link href="#">
                  <Settings2 className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col">
           <AppHeader />
           <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-auto">
             {children}
           </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
