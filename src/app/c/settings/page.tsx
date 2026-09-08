"use client";

import {
  Camera,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Toaster, toast } from "sonner";
import ImageCropModal from "@/components/ui/ImageCropModal";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { type UserData, userApi } from "@/lib/user";
import { useClientHeader } from "../context";

// Location data types
interface CountryData {
  name?: string;
  country?: string;
}

interface StateData {
  name: string;
}

interface CityData {
  name: string;
}

export default function ClientSettings() {
  const { data: session, update } = useSession();
  const { setTitle, setDescription } = useClientHeader();
  const [loading, setLoading] = useState(false);

  // Form states
  const [userData, setUserData] = useState<UserData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [bio, setBio] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [profileImage, setProfileImage] = useState("");

  // Location states
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [countriesList, setCountriesList] = useState<CountryData[]>([]);
  const [statesList, setStatesList] = useState<StateData[]>([]);
  const [citiesList, setCitiesList] = useState<CityData[]>([]);

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const [loadingLocations, setLoadingLocations] = useState(false);

  // Email change states
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Image state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");

  // Set header
  useEffect(() => {
    setTitle("Settings");
    setDescription("Manage your personal information and account preferences");
  }, [setTitle, setDescription]);

  // Initial fetch
  useEffect(() => {
    if (session?.user?.id && session?.authToken) {
      fetchUserData();
      fetchCountries();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      if (!session?.user?.id || !session?.authToken) return;
      setLoading(true);
      const result = await userApi.getById(session.user.id, session.authToken);
      if (result.success && result.data) {
        const data = result.data;
        setUserData(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setOriginalEmail(data.email || "");
        setProfileImage(data.profileImage || "");
        // Assuming metadata/extended user fields exist or handling them gracefully
        setBio((data as any).bio || "");
        setMobile((data as any).mobile || "");
        setWhatsapp((data as any).whatsapp || "");
        setCountry((data as any).country || "");
        setState((data as any).state || "");
        setCity((data as any).city || "");

        if ((data as any).country) {
          fetchStates((data as any).country);
          if ((data as any).state) {
            fetchCities((data as any).country, (data as any).state);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Location API Helpers (using same service as vendor)
  const fetchCountries = async () => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries",
      );
      const data = await response.json();
      if (!data.error) setCountriesList(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStates = async (countryName: string) => {
    setLoadingLocations(true);
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryName }),
        },
      );
      const data = await response.json();
      if (!data.error) setStatesList(data.data.states);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLocations(false);
    }
  };

  const fetchCities = async (countryName: string, stateName: string) => {
    setLoadingLocations(true);
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryName, state: stateName }),
        },
      );
      const data = await response.json();
      if (!data.error) setCitiesList(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleCountrySelect = (cName: string) => {
    setCountry(cName);
    setCountryDropdownOpen(false);
    setCountrySearch("");
    setState("");
    setCity("");
    setStatesList([]);
    setCitiesList([]);
    fetchStates(cName);
  };

  const handleStateSelect = (sName: string) => {
    setState(sName);
    setStateDropdownOpen(false);
    setStateSearch("");
    setCity("");
    setCitiesList([]);
    fetchCities(country, sName);
  };

  const handleCitySelect = (cityName: string) => {
    setCity(cityName);
    setCityDropdownOpen(false);
    setCitySearch("");
  };

  // Profile Save
  const handleSaveProfile = async () => {
    if (email !== originalEmail && !isOtpSent) {
      toast.error("Please verify your new email or revert to original.");
      return;
    }

    setLoading(true);
    try {
      if (!session?.user?.id || !session?.authToken) return;
      const updateData = { name, bio, mobile, whatsapp, country, state, city };
      const result = await userApi.updateById(
        session.user.id,
        session.authToken,
        updateData,
      );

      if (result.success) {
        toast.success("Profile updated successfully");
        await update({ ...session, user: { ...session?.user, name } });
        await fetchUserData();
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Email Change Logic
  const handleSendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    setSendingOtp(true);
    try {
      if (!session?.user?.id || !session?.authToken) {
        toast.error("Session error. Please try again.");
        return;
      }
      const result = await userApi.requestEmailChange(
        session.user.id,
        session.authToken,
        originalEmail,
        email,
      );
      if (result.success) {
        setIsOtpSent(true);
        toast.success("OTP sent to your new email");
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Error sending OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }
    setVerifyingOtp(true);
    try {
      if (!session?.user?.id || !session?.authToken) {
        toast.error("Session error. Please try again.");
        return;
      }
      const result = await userApi.verifyEmailChange(
        session.user.id,
        session.authToken,
        otpCode,
      );
      if (result.success) {
        setOriginalEmail(email);
        setIsEditingEmail(false);
        setIsOtpSent(false);
        setOtpCode("");
        toast.success("Email verified and updated");
        await update({ ...session, user: { ...session?.user, email } });
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Verification error");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Image Upload Logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async (blob: Blob) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", blob, "profile.jpg");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${session?.user.id}/image`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${session?.authToken}` },
        },
      );

      const result = await response.json();
      if (result.success) {
        const newImg = result.data?.user?.profileImage || profileImage;
        setProfileImage(newImg);
        await update({ ...session, user: { ...session?.user, image: newImg } });
        toast.success("Profile image updated");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
      setIsCropModalOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <LoadingOverlay isVisible={loading} />
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={imageToCrop}
        onCropSave={handleCropSave}
      />
      <Toaster position="top-right" />

      {/* Profile Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Profile Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update your personal details and how you're seen
            </p>
          </div>
          <div className="flex sm:block">
            <button
              onClick={handleSaveProfile}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#334155] text-white rounded-xl hover:bg-[#1e293b] transition-all font-medium text-sm shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <User className="w-10 h-10 text-gray-300" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-[#334155] text-white rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-gray-900 text-lg">
                {name || "Client"}
              </h3>
              <p className="text-sm text-gray-500">
                JPG, GIF or PNG. Max size of 2MB
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-sm font-semibold text-[#334155] hover:underline"
              >
                Change Photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-[#334155] transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#334155]/5 focus:border-[#334155] outline-none transition-all text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  disabled={!isEditingEmail}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-11 pr-24 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#334155]/5 focus:border-[#334155] outline-none transition-all text-sm ${!isEditingEmail ? "opacity-70 cursor-not-allowed" : ""}`}
                />
                {!isEditingEmail ? (
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#334155] hover:underline"
                  >
                    Change
                  </button>
                ) : (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setIsEditingEmail(false);
                        setEmail(originalEmail);
                        setIsOtpSent(false);
                      }}
                      className="text-xs font-bold text-gray-400"
                    >
                      Cancel
                    </button>
                    {!isOtpSent && (
                      <button
                        onClick={handleSendOtp}
                        disabled={sendingOtp}
                        className="text-xs font-bold text-[#334155]"
                      >
                        {sendingOtp ? "..." : "Verify"}
                      </button>
                    )}
                  </div>
                )}
              </div>
              {isOtpSent && (
                <div className="mt-3 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
                  <input
                    type="text"
                    value={otpCode}
                    maxLength={6}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, ""))
                    }
                    className="flex-1 px-4 py-2 bg-white border border-[#334155] rounded-lg text-sm tracking-widest text-center font-bold outline-none"
                    placeholder="ENTER OTP"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp}
                    className="px-6 py-2 bg-[#334155] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#1e293b]"
                  >
                    {verifyingOtp ? "..." : "CONFIRM"}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-[#334155] transition-colors" />
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#334155]/5 focus:border-[#334155] outline-none transition-all text-sm"
                  placeholder="+234 ..."
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                WhatsApp Number
              </label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-green-500/70" />
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#334155]/5 focus:border-[#334155] outline-none transition-all text-sm"
                  placeholder="+234 ..."
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Short Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#334155]/5 focus:border-[#334155] outline-none transition-all text-sm min-h-[100px] resize-none"
              placeholder="Tell us a bit about yourself..."
            />
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 lg:p-8 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-3 text-[#334155]" />
            Location
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your location, you can still access vendors from any location
          </p>
        </div>

        <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Country */}
          <div className="space-y-2 flex-1 relative dropdown-container">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Country
            </label>
            <div
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-white transition-all text-sm"
            >
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className={country ? "text-gray-900" : "text-gray-400"}>
                  {country || "Select Country"}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${countryDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {countryDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 border-b border-gray-50">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#334155]/5"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="max-h-[250px] overflow-y-auto">
                  {countriesList
                    .filter((c) => {
                      const name = c.name || c.country || "";
                      return name
                        .toLowerCase()
                        .includes(countrySearch.toLowerCase());
                    })
                    .map((c, i) => {
                      const name = c.name || c.country;
                      return (
                        <div
                          key={i}
                          onClick={() => handleCountrySelect(name || "")}
                          className="px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer transition-colors"
                        >
                          {name}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* State */}
          <div className="space-y-2 flex-1 relative dropdown-container">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              State / Province
            </label>
            <div
              onClick={() =>
                country && setStateDropdownOpen(!stateDropdownOpen)
              }
              className={`flex items-center justify-between px-4 py-3 border rounded-xl transition-all text-sm ${!country ? "bg-gray-100 cursor-not-allowed border-gray-100" : "bg-gray-50 border-gray-100 cursor-pointer hover:bg-white"}`}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className={state ? "text-gray-900" : "text-gray-400"}>
                  {state || "Select State"}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${stateDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {stateDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                <div className="p-2 border-b border-gray-50">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg text-sm outline-none"
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                  />
                </div>
                <div className="max-h-[250px] overflow-y-auto">
                  {loadingLocations ? (
                    <div className="p-4 text-center text-xs text-gray-400">
                      Loading...
                    </div>
                  ) : (
                    statesList
                      .filter((s) =>
                        (s.name || "")
                          .toLowerCase()
                          .includes(stateSearch.toLowerCase()),
                      )
                      .map((s, i) => (
                        <div
                          key={i}
                          onClick={() => handleStateSelect(s.name)}
                          className="px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer"
                        >
                          {s.name}
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* City */}
          <div className="space-y-2 flex-1 relative dropdown-container">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              City
            </label>
            <div
              onClick={() => state && setCityDropdownOpen(!cityDropdownOpen)}
              className={`flex items-center justify-between px-4 py-3 border rounded-xl transition-all text-sm ${!state ? "bg-gray-100 cursor-not-allowed border-gray-100" : "bg-gray-50 border-gray-100 cursor-pointer hover:bg-white"}`}
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className={city ? "text-gray-900" : "text-gray-400"}>
                  {city || "Select City"}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${cityDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {cityDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                <div className="p-2 border-b border-gray-50">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 bg-gray-50 border-none rounded-lg text-sm outline-none"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                  />
                </div>
                <div className="max-h-[250px] overflow-y-auto">
                  {loadingLocations ? (
                    <div className="p-4 text-center text-xs text-gray-400">
                      Loading...
                    </div>
                  ) : (
                    citiesList
                      .filter((c) => {
                        const cityName =
                          typeof c === "string" ? c : (c as any).name || "";
                        return cityName
                          .toLowerCase()
                          .includes(citySearch.toLowerCase());
                      })
                      .map((c, i) => {
                        const cityName =
                          typeof c === "string" ? c : (c as any).name;
                        return (
                          <div
                            key={i}
                            onClick={() => handleCitySelect(cityName)}
                            className="px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 cursor-pointer"
                          >
                            {cityName}
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Final Save Button */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={handleSaveProfile}
          className="flex items-center space-x-2 px-10 py-2 bg-[#334155] text-white rounded-2xl hover:bg-[#1e293b] transition-all font-bold text-base shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          <Save className="w-5 h-5" />
          <span>Save All Changes</span>
        </button>
      </div>
    </div>
  );
}
