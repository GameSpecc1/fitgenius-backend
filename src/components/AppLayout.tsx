"use client";

import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  BotMessageSquare,
  Calculator,
  Camera,
  CreditCard,
  Dumbbell,
  Goal,
  LayoutDashboard,
  NotebookText,
  UtensilsCrossed,
} from "lucide-react";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chatbot", label: "Fitness Chatbot", icon: BotMessageSquare },
  { href: "/workout-generator", label: "Workout Generator", icon: Dumbbell },
  { href: "/workout-tracker", label: "Workout Tracker", icon: NotebookText },
  { href: "/meal-suggester", label: "Meal Suggestions", icon: UtensilsCrossed },
  { href: "/goal-tracker", label: "Goal Tracker", icon: Goal },
  { href: "/macro-tracker", label: "Macro Tracker", icon: Calculator },
  { href: "/equipment-identifier", label: "Equipment ID", icon: Camera },
  { href: "/billing", label: "Billing", icon: CreditCard },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <Link href="/" className="flex items-center gap-2">
              <Dumbbell className="size-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground font-headline">FitGenius</h1>
            </Link>
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="absolute top-2 left-2 md:hidden">
          <SidebarTrigger/>
        </div>
        <div className="p-4 pt-12 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
