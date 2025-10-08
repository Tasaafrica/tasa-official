"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";
import {
  Settings,
  Shield,
  Camera,
  Edit3,
  Save,
  X,
  Bell,
  Upload,
  Trash2,
  User,
  Crop,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Link from "next/link";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { update } = useSession();

  // Edit state management
  const [isEditing, setIsEditing] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
    bio: "",
  });

  // Display state (only updates when saved)
  const [displayData, setDisplayData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
    bio: "",
  });

  // UI state
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Image editor modal state
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [cropper, setCropper] = useState<Cropper | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // If canceling edit, reset to original data
      fetchUserProfile();
    }
  };

  // API Functions
  const fetchUserProfile = async () => {
    if (!user?.id) return;

    console.log("Fetching user profile for ID:", user.id);
    setIsLoadingProfile(true);
    try {
      const response = await fetch(`/api/user/${user.id}?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      const data = await response.json();

      console.log("API Response Status:", response.status);
      console.log("API Response Data:", data);

      if (response.ok && data.success) {
        const userData = data.data.user || data.data;
        const newData = {
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          location: userData.location || "",
          bio: userData.bio || "",
        };
        console.log("Processed Profile Data:", newData);
        setProfileData(newData);
        setDisplayData(newData);

        // Fetch profile image if available
        if (userData.image) {
          setImagePreview(userData.image);
        } else {
          // If no image in profile data, try to fetch it separately
          fetchProfileImage();
        }
      } else {
        console.error(
          "API Error:",
          data.error || "Failed to fetch profile data"
        );
        setMessage({
          type: "error",
          text: data.error || "Failed to fetch profile data",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch profile data",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Fetch profile image specifically
  const fetchProfileImage = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `/api/user/${user.id}/image?t=${Date.now()}`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );
      const data = await response.json();
      //console.log("Profile image fetched:", data);

      if (response.ok && data.success && data.data.profileImage) {
        setImagePreview(data.data.profileImage);
        // console.log("Profile image fetched:", data.data.profileImage);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  const updateUserProfile = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setIsEditing(false); // Exit edit mode after successful save
        // Refresh profile data from server to get the latest data
        await fetchUserProfile();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const uploadProfileImage = async (file: File) => {
    if (!user?.id) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/user/${user.id}/image`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: "Profile image updated successfully!",
        });
        setImagePreview(data.data.imageUrl);
        // Refresh profile data to get latest image info
        fetchUserProfile();
        // Update the session to reflect the new image in the header
        await update({
          ...user,
          image: data.data.imageUrl,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to upload image",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage({ type: "error", text: "Failed to upload image" });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProfileImage = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/user/${user.id}/image`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: "Profile image deleted successfully!",
        });
        setImagePreview(null);
        // Refresh profile data to get latest state
        fetchUserProfile();
        // Update the session to remove the image from the header
        await update({
          ...user,
          image: null,
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to delete image",
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setMessage({ type: "error", text: "Failed to delete image" });
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Image editor functions
  const openImageEditor = () => {
    setIsImageEditorOpen(true);
  };

  const closeImageEditor = () => {
    if (cropper) {
      (cropper as any).destroy();
      setCropper(null);
    }
    setIsImageEditorOpen(false);
    setSelectedImage(null);
    // Don't clear imagePreview - keep the cropped image
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);

        // Initialize Cropper.js after image loads
        setTimeout(() => {
          if (imageRef.current && !cropper) {
            const newCropper = new Cropper(imageRef.current, {
              aspectRatio: 1, // Square crop
              viewMode: 1,
              dragMode: "move",
              autoCropArea: 0.8,
              restore: false,
              guides: true,
              center: true,
              highlight: true,
              cropBoxMovable: true,
              cropBoxResizable: true,
              toggleDragModeOnDblclick: false,
            } as any);
            setCropper(newCropper);
          } else if (cropper && imageRef.current) {
            (cropper as any).replace(result);
          }
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  };

  // Cropper.js handlers
  const handleRotate = () => {
    if (cropper) {
      (cropper as any).rotate(90);
    }
  };

  const handleZoomIn = () => {
    if (cropper) {
      (cropper as any).zoom(0.1);
    }
  };

  const handleZoomOut = () => {
    if (cropper) {
      (cropper as any).zoom(-0.1);
    }
  };

  const handleReset = () => {
    if (cropper) {
      (cropper as any).reset();
    }
  };

  const applyImageChanges = () => {
    if (!cropper) return;

    try {
      // Get cropped canvas from Cropper.js
      const canvas = (cropper as any).getCroppedCanvas({
        width: 300,
        height: 300,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (canvas) {
        // Convert canvas to data URL and set as preview
        const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setImagePreview(croppedDataUrl);

        // Convert canvas to blob and upload
        canvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              const file = new File([blob], "profile-image.jpg", {
                type: "image/jpeg",
              });
              uploadProfileImage(file);
            }
          },
          "image/jpeg",
          0.9
        );

        // Close the editor
        closeImageEditor();
      }
    } catch (error) {
      console.error("Error applying image changes:", error);
      setMessage({ type: "error", text: "Failed to process image" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your profile
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-teal-600">
                TASA
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-teal-50 to-gray-50 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {/* Profile Picture */}
                <div className="relative group">
                  {imagePreview || user.image ? (
                    <img
                      src={imagePreview || user.image || ""}
                      alt={displayData.name || "User"}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                      {getUserInitials(displayData.name || "User")}
                    </div>
                  )}

                  {/* Edit Icon Overlay - Only visible in edit mode */}
                  {isEditing && (
                    <button
                      onClick={openImageEditor}
                      disabled={isUploading}
                      className="absolute inset-0 bg-black opacity-80 rounded-full flex items-center justify-center group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      ) : (
                        <Camera className="w-6 h-6 text-white" />
                      )}
                    </button>
                  )}
                </div>

                {/* User Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {displayData.name || "User"}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {displayData.email || "No email"}
                  </p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    <div className="w-2 h-2 rounded-full mr-2 bg-teal-500"></div>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>
              </div>

              {/* Edit Toggle Button */}
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <button
                    onClick={toggleEditMode}
                    className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={updateUserProfile}
                      disabled={isSaving}
                      className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={toggleEditMode}
                      className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Loading State */}
            {isLoadingProfile && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="ml-3 text-gray-600">Loading profile...</span>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Profile Content - Only show when not loading */}
            {!isLoadingProfile && (
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {profileData.name || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {profileData.email || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {profileData.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        placeholder="City, State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {profileData.location || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                    />
                  ) : (
                    <p className="text-gray-900 py-2 whitespace-pre-wrap">
                      {profileData.bio || "No bio provided"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Editor Modal */}
      {isImageEditorOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Profile Picture
              </h3>
              <button
                onClick={closeImageEditor}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {!imagePreview ? (
                /* Image Selection */
                <div className="text-center py-8">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-select"
                  />
                  <label
                    htmlFor="image-select"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-colors cursor-pointer"
                  >
                    <Camera className="w-6 h-6 mr-2 text-gray-400" />
                    <span className="font-medium text-gray-700">
                      Select Profile Picture
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG up to 2MB
                  </p>
                </div>
              ) : (
                /* Cropper.js Interface */
                <div className="space-y-4">
                  {/* Cropper Container */}
                  <div
                    className="relative bg-gray-100 rounded-lg overflow-hidden mx-auto"
                    style={{ width: "400px", height: "400px" }}
                  >
                    {imagePreview ? (
                      <img
                        ref={imageRef}
                        src={imagePreview}
                        alt="Crop preview"
                        className="max-w-full max-h-full"
                        style={{ display: "block" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No image selected</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="space-y-3">
                    {/* Zoom Controls */}
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={handleZoomOut}
                        className="flex items-center px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <ZoomOut className="w-4 h-4 mr-1" />
                        Zoom Out
                      </button>
                      <button
                        onClick={handleZoomIn}
                        className="flex items-center px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <ZoomIn className="w-4 h-4 mr-1" />
                        Zoom In
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={handleRotate}
                        className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Rotate 90°
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex items-center px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="text-center text-xs text-gray-500">
                    <p>
                      Drag to move, resize the crop box, or use controls below
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                {imagePreview && (
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Change Image
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={closeImageEditor}
                  className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyImageChanges}
                  disabled={!selectedImage}
                  className="px-4 py-1 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Save className="w-3 h-3 mr-1" />
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
