
"use client";

import { usePathname, useRouter } from "next/navigation";
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
  SidebarFooter,
  SidebarSeparator,
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
  Lock,
  LogIn,
  LogOut,
  NotebookText,
  UtensilsCrossed,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";


const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, pro: false },
  { href: "/chatbot", label: "Fitness Chatbot", icon: BotMessageSquare, pro: false },
  { href: "/workout-generator", label: "Workout Generator", icon: Dumbbell, pro: false },
  { href: "/workout-tracker", label: "Workout Tracker", icon: NotebookText, pro: false },
  { href: "/meal-suggester", label: "Meal Suggestions", icon: UtensilsCrossed, pro: false },
  { href: "/goal-tracker", label: "Goal Tracker", icon: Goal, pro: false },
  { href: "/macro-tracker", label: "Macro Tracker", icon: Calculator, pro: true },
  { href: "/equipment-identifier", label: "Equipment ID", icon: Camera, pro: true },
  { href: "/billing", label: "Billing", icon: CreditCard, pro: false },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPro] = useState(true); // TODO: Replace with actual user subscription status
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsMounted(true);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };
  
  const isAuthenticated = !!user;

  useEffect(() => {
    if (isMounted && !isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
    }
  }, [isMounted, isAuthenticated, pathname, router]);

  if (!isMounted) {
    return null; // or a loading spinner
  }
  
  // Since these pages don't need the layout
  if (pathname === "/login" || pathname === "/signup") {
    return <>{children}</>;
  }

  if (!isAuthenticated && pathname !== '/login') {
    return null; // or a loading spinner
  }

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
            {menuItems.map((item) => {
              const isDisabled = (item.pro && !isPro);
              const MappedIcon = (item.pro && !isPro) ? Lock : item.icon;
              return (
              <SidebarMenuItem key={item.href}>
                <Link href={isDisabled ? "#" : item.href} className={cn(isDisabled && "cursor-not-allowed")}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    disabled={isDisabled}
                  >
                    <MappedIcon />
                    <span className="flex items-center justify-between w-full">
                        {item.label}
                        {item.pro && <Badge variant="secondary" className="text-xs">Pro</Badge>}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )})}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarMenu>
            {isMounted && (
              isAuthenticated ? (
                  <SidebarMenuItem>
                     <SidebarMenuButton onClick={handleLogout}>
                        <LogOut />
                        <span>Sign Out</span>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              ) : (
                <>
                  <SidebarMenuItem>
                    <Link href="/login">
                      <SidebarMenuButton isActive={pathname === "/login"}>
                        <LogIn />
                        <span>Sign In / Login</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                   <SidebarMenuItem>
                    <Link href="/signup">
                      <SidebarMenuButton isActive={pathname === "/signup"}>
                        <UserPlus />
                        <span>Sign Up</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </>
              )
            )}
          </SidebarMenu>
        </SidebarFooter>
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
