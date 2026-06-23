"use client";

import { Briefcase, MessageSquare, User, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { userApi } from "@/lib/user";
import { useClientHeader } from "../context";
import AccountCompletion from "@/components/dashboard/AccountCompletion";

export default function ClientDashboard() {
  const { data: session } = useSession();
  const { setTitle, setDescription } = useClientHeader();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  // Set header title and description
  useEffect(() => {
    setTitle("Dashboard");
    setDescription(
      "Manage your projects and find the perfect talent for your needs",
    );
  }, [setTitle, setDescription]);

  useEffect(() => {
    if (session?.user?.id && session?.authToken && !userData) {
      fetchUserData();
    } else if (!session) {
      setLoading(false);
    }
  }, [session, userData]);

  const fetchUserData = async () => {
    try {
      if (!session?.user?.id || !session?.authToken) return;
      const result = await userApi.getById(session.user.id, session.authToken);
      if (result.success && result.data) {
        setUserData(result.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[400px]">
      {/* Loading Overlay */}
      <LoadingOverlay isVisible={loading} />

      {/* Account Completion Status */}
      <AccountCompletion />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#334155] via-[#475569] to-[#334155] rounded-2xl p-6 lg:p-8 mb-8 shadow-xl text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-lg overflow-hidden">
              {userData?.profileImage || session?.user?.image ? (
                <img
                  src={userData?.profileImage || session?.user?.image}
                  alt={userData?.name || session?.user?.name || "User"}
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
              Welcome back, {userData?.name || session?.user?.name || "Client"}!
            </h2>
            {userData?.username && (
              <p className="text-teal-300 font-medium text-sm mb-3">
                @{userData.username}
              </p>
            )}
            <p className="text-white/80 text-sm max-w-xl">
              Post projects, browse our vetted talent network, and bring your
              ideas to life with TASA professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active Projects
              </h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-teal-50 rounded-lg">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Hires
              </h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Messages
              </h3>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-1.5 h-6 bg-[#334155] rounded-full mr-3"></span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center p-5 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all text-left group">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#334155]">
                Post a Project
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Create a new project and find the perfect talent for your needs.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-all">
              <span className="text-xl font-light text-gray-400 group-hover:text-gray-600">
                →
              </span>
            </div>
          </button>

          <button className="flex items-center p-5 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all text-left group">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#334155]">
                Browse Talent
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Explore our network of vetted African professionals.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-all">
              <span className="text-xl font-light text-gray-400 group-hover:text-gray-600">
                →
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
