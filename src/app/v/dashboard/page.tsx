"use client";

import { Star, TrendingUp, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { vendorApi } from "@/lib/vendor";
import { useVendorHeader } from "../context";
import AccountCompletion from "@/components/dashboard/AccountCompletion";

export default function VendorDashboard() {
  const { data: session } = useSession();
  const { setTitle, setDescription } = useVendorHeader();
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState<any>(null);
  const [stats, setStats] = useState({
    activeOrders: 0,
    totalEarnings: 0,
    clientReviews: 0,
    rating: 0,
  });

  // Set header title and description
  useEffect(() => {
    setTitle("Dashboard");
    setDescription(
      "Manage your services, track orders, and grow your business",
    );
  }, [setTitle, setDescription]);

  useEffect(() => {
    if (session?.user?.id && session?.authToken && !vendorData) {
      fetchVendorData();
    } else if (!session) {
      setLoading(false);
    }
  }, [session, vendorData]);

  const fetchVendorData = async () => {
    try {
      if (!session?.user?.id || !session?.authToken) {
        return;
      }

      const result = await vendorApi.getById(
        session.user.id,
        session.authToken,
      );

      if (result.success && result.data) {
        setVendorData(result.data);
        console.log("Vendor Data:", result.data);
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Extract skills from vendor data
  const skills = vendorData?.skills || [];
  const coreSkills = skills
    .filter((s: any) => s.type === "core")
    .map((s: any) => s.name);
  const peripheralSkills = skills
    .filter((s: any) => s.type === "peripheral")
    .map((s: any) => s.name);
  const allSkills = [...coreSkills, ...peripheralSkills];

  return (
    <div className="relative min-h-[600px]">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={loading} />

      {/* Account Completion Status */}
      <AccountCompletion />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#334155] via-[#475569] to-[#334155] rounded-2xl p-6 lg:p-8 mb-6 shadow-xl text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-lg overflow-hidden">
              {vendorData?.profileImage || session?.user?.image ? (
                <img
                  src={vendorData?.profileImage || session?.user?.image}
                  alt={vendorData?.name || session?.user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold mb-1">
              {vendorData?.name || session?.user?.name || "Welcome back!"}
            </h2>
            {vendorData?.username && (
              <p className="text-teal-300 font-medium text-sm mb-2">
                @{vendorData.username}
              </p>
            )}
            <p className="text-white/80 text-sm mb-4">
              {vendorData?.bio || "Vendor"}
            </p>

            {/* Skills */}
            {allSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                {allSkills.slice(0, 4).map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30"
                  >
                    {skill}
                  </span>
                ))}
                {allSkills.length > 4 && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30">
                    +{allSkills.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Rating */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                <Star className="w-5 h-5 fill-teal-400 text-teal-400" />
                <span className="text-2xl font-bold">
                  {stats.rating || "4.5"}
                </span>
              </div>
              <p className="text-white/70 text-xs">Rating</p>
            </div>

            {/* Total Earnings */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                <TrendingUp className="w-5 h-5 text-teal-400" />
                <span className="text-2xl font-bold">
                  ₦{stats.totalEarnings || "0"}
                </span>
              </div>
              <p className="text-white/70 text-xs">
                Total Earnings{" "}
                <span className="text-teal-400">(Coming Soon)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5 shadow-sm">
          <h3 className="text-xs font-medium text-gray-500 mb-2">
            Active Orders
          </h3>
          <p className="text-2xl font-semibold text-gray-900">
            {stats.activeOrders}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5 shadow-sm">
          <h3 className="text-xs font-medium text-gray-500 mb-2">
            Total Earnings
          </h3>
          <p className="text-2xl font-semibold text-gray-900">
            ₦{stats.totalEarnings}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5 shadow-sm">
          <h3 className="text-xs font-medium text-gray-500 mb-2">
            Client Reviews
          </h3>
          <p className="text-2xl font-semibold text-gray-900">
            {stats.clientReviews}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex-1">
              <h3 className="text-xs font-medium text-gray-900">
                Manage Services
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Update your skills and service offerings
              </p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="flex-1">
              <h3 className="text-xs font-medium text-gray-900">View Orders</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Track and manage your active orders
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
