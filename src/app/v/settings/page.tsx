"use client";

import {
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { Toaster, toast } from "sonner";
import ImageCropModal from "@/components/ui/ImageCropModal";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import {
  type Category,
  type Skill,
  type VendorData,
  type VendorUpdateData,
  vendorApi,
} from "@/lib/vendor";
import { useVendorHeader } from "../context";
import VendorDashboard from "../dashboard/page";

// Location data types
interface CountryData {
  name?: string;
  country?: string;
  iso2?: string;
  iso3?: string;
}

interface StateData {
  name: string;
  state_code: string;
}

interface CityData {
  name: string;
}

export default function VendorSettings() {
  const { data: session, update } = useSession();
  const { setTitle, setDescription } = useVendorHeader();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Email verification states
  const [originalEmail, setOriginalEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const [vendorData, setVendorData] = useState<VendorData | null>(null);

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (email && originalEmail && email !== originalEmail) {
      setEmailVerified(false);
    } else if (email === originalEmail) {
      setEmailVerified(true);
      setIsOtpSent(false);
      setOtpCode("");
    }
  }, [email, originalEmail]);

  // Profile image upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");

  // Set header title and description
  useEffect(() => {
    setTitle("Settings");
    setDescription("Manage your profile and services");
  }, [setTitle, setDescription]);

  // Category and skills selection
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillTypes, setSkillTypes] = useState<
    Record<string, "core" | "peripheral">
  >({});
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [hasLoadedInitialSkills, setHasLoadedInitialSkills] = useState(false);
  const [openSkillDropdown, setOpenSkillDropdown] = useState<string | null>(
    null,
  );

  // Location search and loading states
  const [countriesList, setCountriesList] = useState<CountryData[]>([]);
  const [statesList, setStatesList] = useState<StateData[]>([]);
  const [citiesList, setCityDataList] = useState<CityData[]>([]);

  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch vendor data on mount
  useEffect(() => {
    if (session?.user?.id && session?.authToken && !vendorData) {
      fetchVendorData();
    }
  }, [session, vendorData]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    fetchCountries();

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setCountryDropdownOpen(false);
        setStateDropdownOpen(false);
        setCityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch skills when category changes
  useEffect(() => {
    if (selectedCategorySlug) {
      fetchSkillsByCategory(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);

  // Auto-select category when vendor data loads and categories are available
  useEffect(() => {
    if (category && categories.length > 0 && !hasLoadedInitialSkills) {
      const matchingCategory = categories.find((cat) => cat.name === category);
      if (matchingCategory) {
        setSelectedCategorySlug(matchingCategory.slug);
        setHasLoadedInitialSkills(true);
      }
    }
  }, [category, categories, hasLoadedInitialSkills]);

  const fetchVendorData = async () => {
    try {
      if (!session?.user?.id || !session?.authToken) {
        setMessage({ type: "error", text: "Authentication required" });
        return;
      }

      const result = await vendorApi.getById(
        session.user.id,
        session.authToken,
      );

      if (result.success && result.data) {
        const data = result.data;
        setVendorData(data);

        // Populate form fields

        if (!isEditingEmail && !isOtpSent) {
          setEmail(data.email || "");
          setOriginalEmail(data.email || "");
        } else if (isOtpSent) {
          // If OTP is sent, we still want to keep originalEmail updated to the server's last known email
          // but we MUST NOT update the 'email' state which is the new email being verified
          setOriginalEmail(data.email || "");
        }

        if (!loading) {
          // Don't clobber if we are in the middle of an update
          setName(data.name || "");
          setProfileImage(data.profileImage || "");
          setBio(data.bio || "");
          setMobile(data.mobile || "");
          setWhatsapp(data.whatsapp || "");
          setCountry(data.country || "");
          setState(data.state || "");
          setCity(data.city || "");
          setCategory(data.category || "");
        }
        setSelectedCategorySlug(""); // Will be set when categories load

        // Load location data lists if vendor has data
        if (data.country) {
          fetchStates(data.country);
          if (data.state) {
            fetchCities(data.country, data.state);
          }
        }

        // Extract skill names and set up skill types
        const coreSkillNames =
          data.coreSkills?.map((skill) => skill.name) || [];
        const peripheralSkillNames =
          data.peripheralSkills?.map((skill) => skill.name) || [];

        const allSkills = [...coreSkillNames, ...peripheralSkillNames];
        const newSkillTypes: Record<string, "core" | "peripheral"> = {};

        coreSkillNames.forEach((skill) => (newSkillTypes[skill] = "core"));
        peripheralSkillNames.forEach(
          (skill) => (newSkillTypes[skill] = "peripheral"),
        );

        setSelectedSkills(allSkills);
        setSkillTypes(newSkillTypes);

        return data;
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to load vendor data",
        });
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      setMessage({ type: "error", text: "Failed to load vendor data" });
    }
  };

  const handleSendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (email === originalEmail) {
      toast.error("The new email is the same as the current email");
      return;
    }

    setSendingOtp(true);
    try {
      if (!session?.user?.id || !session?.authToken) {
        toast.error("Authentication required");
        return;
      }

      const result = await vendorApi.requestEmailChange(
        session.user.id,
        session.authToken,
        originalEmail,
        email,
      );

      if (result.success) {
        setIsOtpSent(true);
        toast.success("Verification code sent to your new email");
      } else {
        if (result.status === 429) {
          toast.error("Too many requests. Please try again in a few minutes.");
        } else if (result.status === 409) {
          toast.error("This email is already taken by another account.");
        } else {
          toast.error(
            result.error ||
              result.message ||
              "Failed to send verification code",
          );
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An error occurred while sending OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }
    setVerifyingOtp(true);
    try {
      if (!session?.user?.id || !session?.authToken) {
        toast.error("Authentication required");
        return;
      }

      const result = await vendorApi.verifyEmailChange(
        session.user.id,
        session.authToken,
        otpCode,
      );

      if (result.success) {
        setEmailVerified(true);
        setIsOtpSent(false);
        setOtpCode("");
        setOriginalEmail(email); // Update original email state
        setIsEditingEmail(false);

        // Update session explicitly
        await update({
          ...session,
          user: {
            ...session?.user,
            email: email,
          },
        });

        toast.success("Email changed successfully.");

        // Optionally refresh vendor data
        await fetchVendorData();
      } else {
        if (result.status === 400) {
          toast.error("Invalid or expired OTP.");
        } else if (result.status === 429) {
          toast.error("Too many requests. Please try again in a few minutes.");
        } else {
          toast.error(result.error || result.message || "Invalid OTP");
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("An error occurred while verifying OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Location API Functions
  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries",
      );
      const data = await response.json();
      if (data.error === false && data.data) {
        setCountriesList(data.data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchStates = async (countryName: string) => {
    setLoadingStates(true);
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country: countryName }),
        },
      );
      const data = await response.json();
      if (data.error === false && data.data) {
        setStatesList(data.data.states);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (countryName: string, stateName: string) => {
    setLoadingCities(true);
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country: countryName, state: stateName }),
        },
      );
      const data = await response.json();
      if (data.error === false && data.data) {
        setCityDataList(data.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  // Selection Handlers
  const handleCountrySelect = (countryName: string) => {
    setCountry(countryName);
    setCountryDropdownOpen(false);
    setCountrySearch("");

    // Reset state and city
    setState("");
    setCity("");
    setStatesList([]);
    setCityDataList([]);

    // Fetch states for selected country
    fetchStates(countryName);
  };

  const handleStateSelect = (stateName: string) => {
    setState(stateName);
    setStateDropdownOpen(false);
    setStateSearch("");

    // Reset city
    setCity("");
    setCityDataList([]);

    // Fetch cities for selected state
    fetchCities(country, stateName);
  };

  const handleCitySelect = (cityName: string) => {
    setCity(cityName);
    setCityDropdownOpen(false);
    setCitySearch("");
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const result = await vendorApi.getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
        // Set category slug if category name matches
        const currentCategoryName = category;
        const matchingCategory = result.data.find(
          (cat) => cat.name === currentCategoryName,
        );
        if (matchingCategory) {
          setSelectedCategorySlug(matchingCategory.slug);
          setHasLoadedInitialSkills(true);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchSkillsByCategory = async (categorySlug: string) => {
    setIsLoadingSkills(true);
    try {
      const result = await vendorApi.getSkillsByCategory(categorySlug);
      if (result.success && result.data) {
        setAvailableSkills(result.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoadingSkills(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async (blob: Blob) => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", blob, "profile.jpg");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.id}/image`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${session.authToken}`,
          },
        },
      );

      const result = await response.json();

      if (result.success) {
        // According to the snippet, successful response has result.data.user.profileImage
        const imageUrl =
          result.data?.user?.profileImage ||
          result.imageUrl ||
          result.data?.imageUrl;
        if (imageUrl) {
          setProfileImage(imageUrl);
          // Update the session explicitly
          await update({
            ...session,
            user: {
              ...session?.user,
              image: imageUrl,
            },
          });
          toast.success("Profile picture updated successfully");
        } else {
          const freshData = await fetchVendorData();
          // After fetching fresh data, update the session
          if (freshData?.profileImage) {
            await update({
              ...session,
              user: {
                ...session?.user,
                image: freshData.profileImage,
              },
            });
          }
          toast.success("Profile picture updated");
        }
      } else {
        toast.error(
          result.message || (result as any).error || "Failed to upload image",
        );
      }
    } catch (error) {
      console.error("Error in handleCropSave:", error);
      toast.error("An error occurred while uploading the image");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillToggle = (skillName: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skillName)) {
        // Remove skill
        const updatedSkillTypes = { ...skillTypes };
        delete updatedSkillTypes[skillName];
        setSkillTypes(updatedSkillTypes);
        return prev.filter((s) => s !== skillName);
      } else {
        // Check limits before adding
        const currentCoreCount = prev.filter(
          (s) => skillTypes[s] === "core",
        ).length;
        const currentPeripheralCount = prev.filter(
          (s) => skillTypes[s] === "peripheral",
        ).length;

        // Default to peripheral for new skills
        if (currentPeripheralCount >= 5) {
          toast.error("Maximum 5 peripheral skills allowed");
          return prev;
        }

        setSkillTypes((prev) => ({
          ...prev,
          [skillName]: "peripheral",
        }));
        return [...prev, skillName];
      }
    });
  };

  const handleSkillTypeChange = (
    skillName: string,
    type: "core" | "peripheral",
  ) => {
    // Check limits before changing type
    const currentCoreCount = selectedSkills.filter(
      (s) => skillTypes[s] === "core",
    ).length;
    const currentPeripheralCount = selectedSkills.filter(
      (s) => skillTypes[s] === "peripheral",
    ).length;

    if (type === "core") {
      // If changing to core, check if we're at the limit
      // If this skill is already peripheral, subtract 1 from peripheral count
      const isCurrentlyPeripheral = skillTypes[skillName] === "peripheral";
      const newCoreCount = isCurrentlyPeripheral
        ? currentCoreCount
        : currentCoreCount - 1;

      if (newCoreCount >= 2) {
        toast.error("Maximum 2 core skills allowed");
        return;
      }
    } else {
      // If changing to peripheral, check if we're at the limit
      const isCurrentlyCore = skillTypes[skillName] === "core";
      const newPeripheralCount = isCurrentlyCore
        ? currentPeripheralCount
        : currentPeripheralCount - 1;

      if (newPeripheralCount >= 5) {
        toast.error("Maximum 5 peripheral skills allowed");
        return;
      }
    }

    setSkillTypes((prev) => ({
      ...prev,
      [skillName]: type,
    }));
  };

  const handleSaveProfile = async () => {
    if (email !== originalEmail && !emailVerified) {
      toast.error("Please verify your new email address before saving");
      return;
    }
    setLoading(true);
    setMessage(null);

    try {
      if (!session?.user?.id || !session?.authToken) {
        setMessage({ type: "error", text: "Authentication required" });
        return;
      }

      const updateData: VendorUpdateData = {
        name,
        bio,
        mobile,
        whatsapp,
        country,
        state,
        city,
      };

      const result = await vendorApi.updateById(
        session.user.id,
        session.authToken,
        updateData,
        "PATCH",
      );

      if (result.success) {
        toast.success("Profile information updated successfully");
        setMessage({
          type: "success",
          text: "Profile information updated successfully",
        });
        const freshData = await fetchVendorData();
        if (freshData) {
          // Update session to reflect changes in sidebar and header
          await update({
            ...session,
            user: {
              ...session?.user,
              name: freshData.name,
              email: freshData.email,
              image: freshData.profileImage,
            },
          });
        }
      } else {
        const errorMsg =
          result.message ||
          (result as any).error ||
          "Failed to update profile information";
        toast.error(errorMsg);
        setMessage({
          type: "error",
          text: errorMsg,
        });
      }
    } catch (error) {
      console.error("Error updating profile information:", error);
      toast.error("Failed to update profile information");
      setMessage({
        type: "error",
        text: "Failed to update profile information",
      });
    } finally {
      setLoading(false);
    }
  };

  const findSkillId = (skillName: string): string => {
    const availableMatch = availableSkills.find((s) => s.name === skillName);
    if (availableMatch)
      return availableMatch._id || (availableMatch as any).id || "";

    const coreMatch = vendorData?.coreSkills?.find((s) => s.name === skillName);
    if (coreMatch) return coreMatch._id || coreMatch.id || "";

    const peripheralMatch = vendorData?.peripheralSkills?.find(
      (s) => s.name === skillName,
    );
    if (peripheralMatch) return peripheralMatch._id || peripheralMatch.id || "";

    const skillMatch = vendorData?.skills?.find((s) => s.name === skillName);
    if (skillMatch) return skillMatch._id || skillMatch.id || "";

    return "";
  };

  const handleSaveSkills = async () => {
    setLoading(true);
    setMessage(null);

    try {
      if (!session?.user?.id || !session?.authToken) {
        setMessage({ type: "error", text: "Authentication required" });
        return;
      }

      // Separate skills by type
      const coreSkillNames = selectedSkills.filter(
        (skill) => skillTypes[skill] === "core",
      );
      const peripheralSkillNames = selectedSkills.filter(
        (skill) => skillTypes[skill] === "peripheral",
      );

      const coreSkillIds = coreSkillNames
        .map((name) => findSkillId(name))
        .filter((id) => id !== "");

      const peripheralSkills = peripheralSkillNames
        .map((name) => findSkillId(name))
        .filter((id) => id !== "");

      const skills = [...coreSkillIds, ...peripheralSkills];

      const updateData = {
        category,
        coreSkillIds,
        peripheralSkills,
        skills,
      };

      const result = await vendorApi.updateById(
        session.user.id,
        session.authToken,
        updateData,
        "PATCH",
      );

      if (result.success) {
        toast.success("Skills and category updated successfully");
        setMessage({
          type: "success",
          text: "Skills and category updated successfully",
        });
        // Refresh vendor data
        await fetchVendorData();
      } else {
        toast.error(result.message || "Failed to update skills");
        setMessage({
          type: "error",
          text: result.message || "Failed to update skills",
        });
      }
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("Failed to update skills");
      setMessage({ type: "error", text: "Failed to update skills" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <LoadingOverlay
        isVisible={loading || (!vendorData && !!session?.user?.id)}
      />
      <Toaster />
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-xs ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-6 mb-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Profile Information
        </h2>

        {/* Profile Image */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center overflow-hidden shadow-sm">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-lg font-semibold">
                  {name?.charAt(0).toUpperCase() || "V"}
                </span>
              )}
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Change Photo</span>
              </button>
              <p className="text-[11px] text-indigo-500 mt-1">
                JPG, PNG or GIF. Max 2MB
              </p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-black px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#334155] focus:border-transparent transition-all"
            placeholder="Enter your display name"
          />
        </div>

        {/* Slug */}
        <div className="mb-4">
          <label
            htmlFor="slug"
            className="block text-xs font-medium text-gray-700 mb-1.5"
          >
            Profile Slug
          </label>
          <input
            id="slug"
            type="text"
            value={vendorData?.slug || ""}
            readOnly
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none transition-all"
            placeholder="No profile slug assigned"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Your unique profile identifier used in your public URL:{" "}
            {vendorData?.slug
              ? `/vendors/${vendorData.slug}`
              : "Not generated yet"}
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-gray-700">
              Email Address
            </label>
            {!isEditingEmail ? (
              <button
                type="button"
                onClick={() => setIsEditingEmail(true)}
                className="text-[10px] text-[#334155] font-semibold hover:underline"
              >
                Change Email
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsEditingEmail(false);
                  setEmail(originalEmail);
                }}
                className="text-[10px] text-red-600 font-semibold hover:underline"
              >
                Cancel
              </button>
            )}
          </div>
          <div className="space-y-2">
            <div className="relative">
              <input
                type="email"
                value={email}
                readOnly={!isEditingEmail}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#334155] focus:border-transparent transition-all ${
                  !isEditingEmail
                    ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                    : "text-black"
                }`}
                placeholder="Enter your email address"
              />
              {!isEditingEmail && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <Check className="w-3.5 h-3.5 text-green-500" />
                </div>
              )}
            </div>
            {isEditingEmail && email !== originalEmail && (
              <div className="flex flex-col space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-600 font-medium">
                    Verify your new email
                  </span>
                  {emailVerified ? (
                    <span className="text-[10px] text-green-600 font-bold flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-600 font-bold flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      Pending Verification
                    </span>
                  )}
                </div>
                {!emailVerified && !isOtpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                    className="w-full flex items-center justify-center space-x-2 py-1.5 bg-[#334155] text-white rounded text-[11px] hover:bg-[#475569] transition-colors disabled:opacity-50"
                  >
                    {sendingOtp ? (
                      <RotateCcw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Mail className="w-3 h-3" />
                    )}
                    <span>
                      {sendingOtp ? "Sending OTP..." : "Send Verification Code"}
                    </span>
                  </button>
                )}
                {isOtpSent && !emailVerified && (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="6-digit code"
                        value={otpCode}
                        onChange={(e) =>
                          setOtpCode(e.target.value.replace(/\D/g, ""))
                        }
                        className="flex-1 text-[11px] px-3 py-1.5 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#334155]"
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={verifyingOtp}
                        className="px-4 py-1.5 bg-green-600 text-white rounded text-[11px] hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                      >
                        {verifyingOtp ? "Checking..." : "Verify"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={sendingOtp}
                      className="text-[10px] text-[#334155] hover:underline font-medium"
                    >
                      Didn't get code? Resend
                    </button>
                  </div>
                )}
              </div>
            )}
            <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
              <span className="font-medium text-gray-700">Note:</span> If you
              previously used Google Sign-In, your original Google account will
              remain linked and can still be used to log in, even after updating
              your primary email address.
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full text-black px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#334155] focus:border-transparent transition-all resize-none"
            placeholder="Tell us about yourself and your expertise"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Mobile
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full text-black px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#334155] focus:border-transparent transition-all"
              placeholder="+1234567890"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              WhatsApp
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full text-black px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#334155] focus:border-transparent transition-all"
              placeholder="+1234567890"
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative dropdown-container">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Country
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-[#334155] bg-white transition-all"
              >
                <span>{country || "Select Country"}</span>
                <FiChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {countryDropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
                  <div className="p-2 border-b border-gray-100 bg-gray-50">
                    <div className="relative">
                      <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-[#334155] text-black"
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {loadingCountries ? (
                      <div className="p-3 text-center text-gray-500 text-[11px]">
                        Loading...
                      </div>
                    ) : (
                      countriesList
                        .filter((c) => {
                          const countryName =
                            c?.name ||
                            c?.country ||
                            (typeof c === "string" ? c : "");
                          return countryName
                            .toLowerCase()
                            .includes(countrySearch.toLowerCase());
                        })
                        .map((c) => (
                          <button
                            key={
                              c.iso2 ||
                              (typeof c === "string"
                                ? c
                                : Math.random().toString())
                            }
                            type="button"
                            onClick={() =>
                              handleCountrySelect(
                                c?.name ||
                                  c?.country ||
                                  (typeof c === "string" ? c : ""),
                              )
                            }
                            className="w-full px-3 py-2 text-left text-[11px] text-gray-700 hover:bg-gray-50 hover:text-[#334155] transition-colors"
                          >
                            {c?.name ||
                              c?.country ||
                              (typeof c === "string" ? c : "")}
                          </button>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative dropdown-container">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              State
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  country && setStateDropdownOpen(!stateDropdownOpen)
                }
                disabled={!country}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-[#334155] bg-white transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <span>
                  {state || (country ? "Select State" : "Select Country first")}
                </span>
                <FiChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {stateDropdownOpen && country && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
                  <div className="p-2 border-b border-gray-100 bg-gray-50">
                    <div className="relative">
                      <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search states..."
                        value={stateSearch}
                        onChange={(e) => setStateSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-[#334155] text-black"
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {loadingStates ? (
                      <div className="p-3 text-center text-gray-500 text-[11px]">
                        Loading...
                      </div>
                    ) : statesList.length > 0 ? (
                      statesList
                        .filter((s) =>
                          s?.name
                            ?.toLowerCase()
                            .includes(stateSearch.toLowerCase()),
                        )
                        .map((s) => (
                          <button
                            key={s.state_code}
                            type="button"
                            onClick={() => handleStateSelect(s.name)}
                            className="w-full px-3 py-2 text-left text-[11px] text-gray-700 hover:bg-gray-50 hover:text-[#334155] transition-colors"
                          >
                            {s.name}
                          </button>
                        ))
                    ) : (
                      <div className="p-3 text-center text-gray-500 text-[11px]">
                        No states found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative dropdown-container">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              City
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => state && setCityDropdownOpen(!cityDropdownOpen)}
                disabled={!state}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-[#334155] bg-white transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <span>
                  {city || (state ? "Select City" : "Select State first")}
                </span>
                <FiChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {cityDropdownOpen && state && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
                  <div className="p-2 border-b border-gray-100 bg-gray-50">
                    <div className="relative">
                      <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search cities..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-[#334155] text-black"
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {loadingCities ? (
                      <div className="p-3 text-center text-gray-500 text-[11px]">
                        Loading...
                      </div>
                    ) : citiesList.length > 0 ? (
                      citiesList
                        .filter((c) => {
                          const cityName = typeof c === "string" ? c : c?.name;
                          return cityName
                            ?.toLowerCase()
                            ?.includes(citySearch.toLowerCase());
                        })
                        .map((c, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() =>
                              handleCitySelect(
                                typeof c === "string" ? c : c?.name,
                              )
                            }
                            className="w-full px-3 py-2 text-left text-[11px] text-gray-700 hover:bg-gray-50 hover:text-[#334155] transition-colors"
                          >
                            {typeof c === "string" ? c : c?.name}
                          </button>
                        ))
                    ) : (
                      <div className="p-3 text-center text-gray-500 text-[11px]">
                        No cities found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Profile Button */}
        <div className="flex justify-end mt-6 border-t border-gray-50 pt-4">
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-[#334155] text-white rounded-lg text-xs font-medium hover:bg-[#475569] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{loading ? "Updating..." : "Update Profile Info"}</span>
          </button>
        </div>
      </div>

      {/* Skills Selection Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 lg:p-6 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Skills Selection
        </h2>

        {/* Selected Skills Summary */}
        {selectedSkills.length > 0 && (
          <div className="border-t border-gray-100 pt-4 mb-6">
            <h3 className="text-xs font-semibold text-gray-900 mb-3">
              Category: {category}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-medium text-gray-600 mb-1.5">
                  Core Skills (max 2)
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills
                    .filter((skill) => skillTypes[skill] === "core")
                    .map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center space-x-1.5 px-2 py-1 bg-[#334155] text-white rounded text-[11px]"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleSkillToggle(skill)}
                          className="hover:text-gray-200 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  {selectedSkills.filter(
                    (skill) => skillTypes[skill] === "core",
                  ).length === 0 && (
                    <p className="text-[11px] text-gray-400 italic">
                      No core skills selected
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-600 mb-1.5">
                  Peripheral Skills (max 5)
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills
                    .filter((skill) => skillTypes[skill] === "peripheral")
                    .map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center space-x-1.5 px-2 py-1 bg-gray-100 text-gray-700 rounded text-[11px]"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleSkillToggle(skill)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  {selectedSkills.filter(
                    (skill) => skillTypes[skill] === "peripheral",
                  ).length === 0 && (
                    <p className="text-[11px] text-gray-400 italic">
                      No peripheral skills selected
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Category
          </label>
          <select
            value={selectedCategorySlug}
            onChange={(e) => {
              const slug = e.target.value;
              setSelectedCategorySlug(slug);
              const selectedCat = categories.find((cat) => cat.slug === slug);
              if (selectedCat) {
                setCategory(selectedCat.name);
              }
            }}
            className="w-full px-3 py-2 border border-gray-200 mb-2 rounded-lg text-xs text-black focus:outline-none focus:ring-2 focus:ring-[#334155] focus:border-transparent transition-all"
            disabled={isLoadingCategories}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          {isLoadingCategories && (
            <p className="text-[11px] text-gray-500 mt-1">
              Loading categories...
            </p>
          )}
        </div>

        {!selectedCategorySlug ? (
          <p className="text-xs text-gray-500">
            Select a category above to view available skills.
          </p>
        ) : isLoadingSkills ? (
          <p className="text-xs text-gray-500">Loading skills...</p>
        ) : availableSkills.length === 0 ? (
          <p className="text-xs text-gray-500">
            No skills available for this category.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
              {availableSkills.map((skill) => {
                const skillName = skill.name || "";
                const isSelected = selectedSkills.includes(skillName);
                const skillType = skillTypes[skillName];
                const isDropdownOpen = openSkillDropdown === skillName;

                return (
                  <div
                    key={skill._id || skill.slug || skillName}
                    className="relative"
                  >
                    <div
                      onClick={() => handleSkillToggle(skillName)}
                      className={`w-full rounded-lg border px-3 py-2 text-xs font-medium transition cursor-pointer text-left ${
                        isSelected
                          ? "border-[#334155] bg-[#334155]/10 text-[#334155]"
                          : "border-gray-200 bg-white text-gray-700 hover:border-[#334155]/50 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{skillName}</span>
                        {isSelected && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenSkillDropdown(
                                isDropdownOpen ? null : skillName,
                              );
                            }}
                            className="ml-2 text-[#334155] hover:text-[#475569]"
                          >
                            {isDropdownOpen ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    {isSelected && isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="p-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSkillTypeChange(skillName, "core");
                              setOpenSkillDropdown(null);
                            }}
                            className={`w-full text-left px-2 py-1.5 text-[10px] rounded transition ${
                              skillType === "core"
                                ? "bg-[#334155] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            Core
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSkillTypeChange(skillName, "peripheral");
                              setOpenSkillDropdown(null);
                            }}
                            className={`w-full text-left px-2 py-1.5 text-[10px] rounded transition ${
                              skillType === "peripheral"
                                ? "bg-[#334155] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            Peripheral
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Save Skills Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSkills}
          disabled={loading}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#334155] text-white rounded-lg text-xs font-medium hover:bg-[#475569] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{loading ? "Saving Skills..." : "Save Category & Skills"}</span>
        </button>
      </div>
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={imageToCrop}
        onCropSave={handleCropSave}
      />
    </div>
  );
}
