"use client";

import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ChevronDown, LayoutDashboard, Package, Store, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dashboard } from "./Dashboard";
import { ProductsAnalytics } from "./ProductsAnalytics";
import { BusinessesManagement } from "./BusinessesManagement";

export function DashboardLayout() {
  const [selectedBusiness, setSelectedBusiness] = useState("AudioTech Store");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                  <span className="max-w-[150px] lg:max-w-none truncate">{selectedBusiness}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-white">
                <DropdownMenuItem onClick={() => setSelectedBusiness("AudioTech Store")}>
                  AudioTech Store
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedBusiness("Mobile Accessories Hub")}>
                  Mobile Accessories Hub
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedBusiness("Tech Gadgets Pro")}>
                  Tech Gadgets Pro
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Profile Avatar */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 md:h-9 md:w-9 cursor-pointer">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs md:text-sm">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile Business Selector */}
        <div className="md:hidden mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between gap-2 bg-white rounded-lg text-gray-700">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{selectedBusiness}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] bg-white">
              <DropdownMenuItem onClick={() => setSelectedBusiness("AudioTech Store")}>
                AudioTech Store
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedBusiness("Mobile Accessories Hub")}>
                Mobile Accessories Hub
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedBusiness("Tech Gadgets Pro")}>
                Tech Gadgets Pro
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
            <Dashboard />
          </TabsContent>

          <TabsContent value="products" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <ProductsAnalytics />
          </TabsContent>

          <TabsContent value="businesses" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            <BusinessesManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}