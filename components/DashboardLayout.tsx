"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ChevronDown, LayoutDashboard, Package, Store, LogOut, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dashboard } from "./Dashboard";
import { ProductsAnalytics } from "./ProductsAnalytics";
import { BusinessesManagement } from "./BusinessesManagement";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export function DashboardLayout() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUserAndLoadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }
        setUser(user);

        // Fetch businesses (In a real app, filter by owner_id or user role context)
        // Currently api.businesses.list() returns all, we should probably filter client side or update API.
        // For MVP assuming the list returns accessible businesses or we filter.
        // Wait, the API returns ALL businesses. We must filter by user.id if we want logic to make sense.
        // But let's check api.businesses.list implementation again.
        // It calls /api/businesses (GET).
        // Let's assume for now we filter client side to avoid editing API if not needed, 
        // OR better, we edit the API later. For now, let's just fetch.
        
        const { businesses: allBusinesses } = await api.businesses.list();
        // Simple filter for MVP:
        const myBusinesses = allBusinesses.filter((b: any) => b.owner_id === user.id);

        if (myBusinesses.length === 0) {
          router.push("/onboarding");
          return;
        }

        setBusinesses(myBusinesses);
        setSelectedBusiness(myBusinesses[0]);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndLoadData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!selectedBusiness) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white px-4 lg:px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 md:gap-6">
            <h2 className="text-blue-600 text-lg md:text-xl font-bold">QRPay</h2>

            {/* Business Selector - Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden md:flex items-center gap-2 bg-white rounded-lg text-gray-700">
                  <Store className="w-4 h-4 text-gray-500" />
                  <span className="max-w-[150px] lg:max-w-none truncate">{selectedBusiness.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white">
                {businesses.map((business) => (
                  <DropdownMenuItem key={business.id} onClick={() => setSelectedBusiness(business)}>
                    {business.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/onboarding")}>
                  + Create New Business
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Profile Avatar */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8 md:h-9 md:w-9 cursor-pointer">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs md:text-sm">
                    {user?.user_metadata?.full_name?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Business Selector */}
        <div className="md:hidden mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between gap-2 bg-white rounded-lg text-gray-700">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{selectedBusiness.name}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] bg-white">
              {businesses.map((business) => (
                <DropdownMenuItem key={business.id} onClick={() => setSelectedBusiness(business)}>
                  {business.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/onboarding")}>
                + Create New Business
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          {/* Tabs - Responsive */}
          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            <TabsList className="bg-transparent p-0 rounded-none inline-flex min-w-full sm:min-w-0 gap-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg mr-2 flex-1 sm:flex-none text-xs sm:text-sm px-4 py-2 border-0"
              >
                <LayoutDashboard className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg mr-2 flex-1 sm:flex-none text-xs sm:text-sm px-4 py-2 border-0"
              >
                <Package className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger
                value="businesses"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg flex-1 sm:flex-none text-xs sm:text-sm px-4 py-2 border-0"
              >
                <Store className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Businesses</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <Dashboard businessId={selectedBusiness.id} />
          </TabsContent>

          <TabsContent value="products" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <ProductsAnalytics businessId={selectedBusiness.id} />
          </TabsContent>

          <TabsContent value="businesses" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <BusinessesManagement userBusinesses={businesses} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
