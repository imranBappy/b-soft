"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
    AudioWaveform,
    BadgeCheck,
    Bell,
    BookOpen,
    Bot,
    ChevronRight,
    ChevronsUpDown,
    Command,
    CreditCard,
    Folder,
    Forward,
    Frame,
    GalleryVerticalEnd,
    LogOut,
    Map,
    MoreHorizontal,
    PieChart,
    Plus,
    Settings2,
    Sparkles,
    SquareTerminal,
    Trash2,
    Sun,
    Moon,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "next-themes";

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-9 w-9"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

export default function Page() {
    return (
        <ThemeProvider  attribute="class" defaultTheme="system" enableSystem>
            <PageContent  />
        </ThemeProvider>
    )
}

function PageContent() {
    const [activeTeam, setActiveTeam] = React.useState(data.teams[0])

    return (
        <div >
            <SidebarProvider >
                <Sidebar variant="sidebar" side="left" collapsible="icon">
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton
                                            size="lg"
                                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                        >
                                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                                <activeTeam.logo className="size-4" />
                                            </div>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">
                                                    {activeTeam.name}
                                                </span>
                                                <span className="truncate text-xs">
                                                    {activeTeam.plan}
                                                </span>
                                            </div>
                                            <ChevronsUpDown className="ml-auto" />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                        align="start"
                                        side="bottom"
                                        sideOffset={4}
                                    >
                                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                                            Teams
                                        </DropdownMenuLabel>
                                        {data.teams.map((team, index) => (
                                            <DropdownMenuItem
                                                key={team.name}
                                                onClick={() => setActiveTeam(team)}
                                                className="gap-2 p-2"
                                            >
                                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                                    <team.logo className="size-4 shrink-0" />
                                                </div>
                                                {team.name}
                                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="gap-2 p-2">
                                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                                <Plus className="size-4" />
                                            </div>
                                            <div className="font-medium text-muted-foreground">
                                                Add team
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Platform</SidebarGroupLabel>
                            <SidebarMenu>
                                {data.navMain.map((item) => (
                                    <Collapsible
                                        key={item.title}
                                        asChild
                                        defaultOpen={item.isActive}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title}>
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items?.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <a href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                            <SidebarGroupLabel>Projects</SidebarGroupLabel>
                            <SidebarMenu>
                                {data.projects.map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.name}</span>
                                            </a>
                                        </SidebarMenuButton>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <SidebarMenuAction showOnHover>
                                                    <MoreHorizontal />
                                                    <span className="sr-only">More</span>
                                                </SidebarMenuAction>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                className="w-48 rounded-lg"
                                                side="bottom"
                                                align="end"
                                            >
                                                <DropdownMenuItem>
                                                    <Folder className="text-muted-foreground" />
                                                    <span>View Project</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Forward className="text-muted-foreground" />
                                                    <span>Share Project</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <Trash2 className="text-muted-foreground" />
                                                    <span>Delete Project</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </SidebarMenuItem>
                                ))}
                                <SidebarMenuItem>
                                    <SidebarMenuButton className="text-sidebar-foreground/70">
                                        <MoreHorizontal className="text-sidebar-foreground/70" />
                                        <span>More</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton
                                            size="lg"
                                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                        >
                                            <Avatar className="h-8 w-8 rounded-lg">
                                                <AvatarImage
                                                    src={data.user.avatar}
                                                    alt={data.user.name}
                                                />
                                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-semibold">
                                                    {data.user.name}
                                                </span>
                                                <span className="truncate text-xs">
                                                    {data.user.email}
                                                </span>
                                            </div>
                                            <ChevronsUpDown className="ml-auto size-4" />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                        side="bottom"
                                        align="end"
                                        sideOffset={4}
                                    >
                                        <DropdownMenuLabel className="p-0 font-normal">
                                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                <Avatar className="h-8 w-8 rounded-lg">
                                                    <AvatarImage
                                                        src={data.user.avatar}
                                                        alt={data.user.name}
                                                    />
                                                    <AvatarFallback className="rounded-lg">
                                                        CN
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="grid flex-1 text-left text-sm leading-tight">
                                                    <span className="truncate font-semibold">
                                                        {data.user.name}
                                                    </span>
                                                    <span className="truncate text-xs">
                                                        {data.user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <Sparkles />
                                                Upgrade to Pro
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <BadgeCheck />
                                                Account
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <CreditCard />
                                                Billing
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Bell />
                                                Notifications
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <LogOut />
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                    <SidebarRail />
                </Sidebar>
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border bg-background dark:bg-background px-4">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Building Your Application
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <ThemeToggle />
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-background dark:bg-background">
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3 mt-3">
                            <div className="aspect-video rounded-xl bg-muted dark:bg-muted/20" />
                            <div className="aspect-video rounded-xl bg-muted dark:bg-muted/20" />
                            <div className="aspect-video rounded-xl bg-muted dark:bg-muted/20" />
                        </div>
                        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted dark:bg-muted/20 md:min-h-min" />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}