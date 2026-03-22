import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import type { ClientSafeProvider } from "next-auth/react";
import { getProviders, getSession, signIn } from "next-auth/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { type SubmitErrorHandler, useForm } from "react-hook-form";
import { FaApple, FaEye, FaEyeSlash, FaFacebook } from "react-icons/fa";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiSearch,
} from "react-icons/fi";
import { IoIosClose, IoMdMail } from "react-icons/io";
import { z } from "zod";
import OtpInput from "@/components/auth/OtpInput";

// Validation schemas
const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name too long"),
    middleName: z.string().max(50, "Middle name too long").optional(),
    surname: z
      .string()
      .min(1, "Surname is required")
      .max(50, "Surname too long"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
    phone: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^\+?[1-9]\d{0,15}$/, "Invalid mobile number format"),
    whatsapp: z
      .string()
      .min(1, "WhatsApp number is required")
      .regex(/^\+?[1-9]\d{0,15}$/, "Invalid WhatsApp number format"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SigninFormData = z.infer<typeof signinSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const signupEmailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type SignupEmailFormData = z.infer<typeof signupEmailSchema>;

type ApiMessageResponse = {
  success?: boolean;
  error?: string;
  message?: string;
};

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  mode?: "login" | "signup";
  onSuccess?: () => void;
}

// Location data types
interface Country {
  country: string;
  iso2: string;
  iso3: string;
}

interface State {
  name: string;
  state_code: string;
}

interface City {
  name: string;
}

export default function LoginModal({
  open,
  onClose,
  mode = "login",
  onSuccess,
}: LoginModalProps) {
  const [activeMode, setActiveMode] = useState<"login" | "signup">(mode);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sign up (email OTP) stepper state
  const [signupStep, setSignupStep] = useState<
    "credentials" | "personal" | "contact" | "otp"
  >("credentials");
  const [signupEmail, setSignupEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);
  const hasGoogle = !!providers?.google;
  const hasApple = !!providers?.apple;
  const hasFacebook = !!providers?.facebook;
  const hasAltProviders = hasApple || hasFacebook;
  const socialButtonWidth = hasApple && hasFacebook ? "w-1/2" : "w-full";

  // Location state
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Dropdown states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Search states
  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  // Loading states
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Form setup
  const signinForm = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupEmailForm = useForm<SignupEmailFormData>({
    resolver: zodResolver(signupEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      whatsapp: "",
      country: "",
      state: "",
      city: "",
    },
  });

  // API Functions
  const fetchCountries = async () => {
    setLoadingCountries(true);

    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries",
      );
      const data = await response.json();
      if (data.error === false && data.data) {
        const flattenedData = data.data.flat();
        setCountries(flattenedData);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchStates = async (country: string) => {
    setLoadingStates(true);
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country }),
        },
      );
      const data = await response.json();
      if (data.error === false && data.data && data.data.states) {
        setStates(data.data.states);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (country: string, state: string) => {
    setLoadingCities(true);
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country, state }),
        },
      );
      const data = await response.json();
      if (data.error === false && data.data) {
        console.log("Fetched cities:", data.data);
        setCities(data.data);
      } else {
        console.log("No cities data received:", data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setCountryDropdownOpen(false);
        setStateDropdownOpen(false);
        setCityDropdownOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    getProviders()
      .then((result) => {
        if (active) setProviders(result);
      })
      .catch((err) => {
        console.error("Failed to load auth providers:", err);
        if (active) setProviders(null);
      });
    return () => {
      active = false;
    };
  }, [open]);

  // Handle country selection
  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    signupForm.setValue("country", country);
    setCountryDropdownOpen(false);
    setCountrySearch("");

    // Reset state and city
    setSelectedState("");
    setSelectedCity("");
    signupForm.setValue("state", "");
    signupForm.setValue("city", "");
    setStates([]);
    setCities([]);

    // Fetch states for selected country
    fetchStates(country);
  };

  // Handle state selection
  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    signupForm.setValue("state", state);
    setStateDropdownOpen(false);
    setStateSearch("");

    // Reset city
    setSelectedCity("");
    signupForm.setValue("city", "");
    setCities([]);

    // Fetch cities for selected state
    fetchCities(selectedCountry, state);
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    signupForm.setValue("city", city);
    setCityDropdownOpen(false);
    setCitySearch("");
  };

  // Reset form and state when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      setActiveMode(mode);
      setShowEmailForm(false);
      setError(null);
      setSuccess(null);
      signinForm.reset();
      signupEmailForm.reset();
      signupForm.reset();
      setSignupStep("credentials");
      setSignupEmail("");
      setOtp("");
      setOtpVerified(false);
      setResendCooldown(0);

      // Reset location selections
      setSelectedCountry("");
      setSelectedState("");
      setSelectedCity("");
      setStates([]);
      setCities([]);
    }
  }, [open, mode, signinForm, signupEmailForm, signupForm]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = window.setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [resendCooldown]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      if (!providers?.google) {
        setError("Google sign-in is not configured.");
        return;
      }
      setIsLoading(true);
      setError(null);

      // Get current page for redirect
      const currentPath = window.location.pathname;
      const redirectUrl = currentPath === "/" ? "/" : currentPath;

      const result = await signIn("google", {
        redirect: false,
        callbackUrl: redirectUrl,
      });

      if (result?.error) {
        if (result.error === "OAuthAccountNotLinked") {
          setError(
            "An account with this email already exists. Please sign in with your original method.",
          );
        } else {
          setError("Failed to sign in with Google. Please try again.");
        }
      } else if (result?.ok) {
        setSuccess("Successfully signed in with Google!");
        setTimeout(async () => {
          const session = await getSession();
          if (session) {
            if (session.authToken) {
              localStorage.setItem("auth_token", session.authToken);
            }
            onSuccess?.();
            onClose();
            // Force a page reload to ensure fresh session data in all components
            window.location.reload();
          } else {
            setSuccess(null);
            setError(
              "Sign in successful but session not established. Please try again.",
            );
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Facebook Sign In
  const handleFacebookSignIn = async () => {
    try {
      if (!providers?.facebook) {
        setError("Facebook sign-in is not configured.");
        return;
      }
      setIsLoading(true);
      setError(null);

      // Get current page for redirect
      const currentPath = window.location.pathname;
      const redirectUrl = currentPath === "/" ? "/" : currentPath;

      const result = await signIn("facebook", {
        redirect: false,
        callbackUrl: redirectUrl,
      });

      if (result?.error) {
        if (result.error === "OAuthAccountNotLinked") {
          setError(
            "An account with this email already exists. Please sign in with your original method.",
          );
        } else {
          setError("Failed to sign in with Facebook. Please try again.");
        }
      } else if (result?.ok) {
        setSuccess("Successfully signed in with Facebook!");
        setTimeout(async () => {
          const session = await getSession();
          if (session) {
            if (session.authToken) {
              localStorage.setItem("auth_token", session.authToken);
            }
            onSuccess?.();
            onClose();
            // Stay on current page instead of redirecting to dashboard
            window.location.reload();
          } else {
            setSuccess(null);
            setError(
              "Sign in successful but session not established. Please try again.",
            );
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Apple Sign In
  const handleAppleSignIn = async () => {
    try {
      if (!providers?.apple) {
        setError("Apple sign-in is not configured.");
        return;
      }
      setIsLoading(true);
      setError(null);

      // Get current page for redirect
      const currentPath = window.location.pathname;
      const redirectUrl = currentPath === "/" ? "/" : currentPath;

      const result = await signIn("apple", {
        redirect: false,
        callbackUrl: redirectUrl,
      });

      if (result?.error) {
        if (result.error === "OAuthAccountNotLinked") {
          setError(
            "An account with this email already exists. Please sign in with your original method.",
          );
        } else {
          setError("Failed to sign in with Apple. Please try again.");
        }
      } else if (result?.ok) {
        setSuccess("Successfully signed in with Apple!");
        setTimeout(async () => {
          const session = await getSession();
          if (session) {
            if (session.authToken) {
              localStorage.setItem("auth_token", session.authToken);
            }
            onSuccess?.();
            onClose();
            // Stay on current page instead of redirecting to dashboard
            window.location.reload();
          } else {
            setSuccess(null);
            setError(
              "Sign in successful but session not established. Please try again.",
            );
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Apple sign-in error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email/Password Sign In
  const handleSignIn = async (data: SigninFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login modal sign in error:", result.error);
        setError("Invalid email or password");
      } else if (result?.ok) {
        setSuccess("Successfully signed in!");
        setTimeout(async () => {
          const session = await getSession();
          if (session?.authToken) {
            localStorage.setItem("auth_token", session.authToken);
          }
          onSuccess?.();
          onClose();
        }, 1000);
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch (error) {
      console.error("Login modal sign in error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // if (!otpVerified) {
      //   setError("Please verify your email before creating an account.");
      //   setSignupStep("otp");
      //   return;
      // }


      const normalizedEmail = data.email.trim().toLowerCase();
      const name =
        `${data.firstName} ${data.middleName ? `${data.middleName} ` : ""}${data.surname}`.trim();

      const registrationData = {
        name,
        email: normalizedEmail,
        password: data.password,
        role: "client",
        provider: "email",
        token: "",
        mobile: data.phone,
        whatsapp: data.whatsapp,
        country: data.country,
        state: data.state,
        city: data.city,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Signup error response:", result);
        console.error("Response status:", response.status);
        setError(result.error || result.message || "Failed to create account");
        return;
      }

      // Account created successfully, now send OTP and go to verify step
      setSuccess("Account created successfully! Just one more thing....");

      // Automatically send OTP
      try {
        const otpResponse = await fetch("/api/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail }),
        });
        if (otpResponse.ok) {
          setResendCooldown(30);
        }
      } catch (otpErr) {
        console.error("Failed to auto-send OTP:", otpErr);
      }

      setSignupStep("otp");
    } catch (error) {
      console.error("Login modal signup error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async ({ email }: SignupEmailFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const normalizedEmail = email.trim().toLowerCase();

      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as ApiMessageResponse;

      if (!response.ok || result.success === false) {
        const rawMessage = result.error || result.message || "";
        if (
          /email is already verified/i.test(rawMessage) ||
          /already verified/i.test(rawMessage)
        ) {
          setError(null);
          setSuccess(
            "An account with this email already exists. Please sign in.",
          );
          setActiveMode("login");
          setShowEmailForm(true);
          signinForm.setValue("email", normalizedEmail, {
            shouldDirty: true,
            shouldValidate: true,
          });
          signinForm.setValue("password", "", {
            shouldDirty: false,
            shouldValidate: false,
          });
          setSignupStep("credentials");
          setSignupEmail("");
          setOtp("");
          setOtpVerified(false);
          return;
        }
        if (
          /user not found/i.test(rawMessage) ||
          /does not exist/i.test(rawMessage)
        ) {
          setSignupEmail(normalizedEmail);
          signupForm.setValue("email", normalizedEmail, {
            shouldDirty: true,
            shouldValidate: false,
          });
          setOtp("");
          setOtpVerified(false);
          setSignupStep("otp");
          setResendCooldown(30);
          setSuccess("OTP sent. Check your email.");
          return;
        }
        setError(result.error || result.message || "Failed to send OTP");
        return;
      }

      setSignupEmail(normalizedEmail);
      signupForm.setValue("email", normalizedEmail, {
        shouldDirty: true,
        shouldValidate: false,
      });
      setOtp("");
      setOtpVerified(false);
      setSignupStep("otp");
      setResendCooldown(30);
      setSuccess(result.message || "OTP sent. Check your email.");
    } catch (error) {
      console.error("Send OTP error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!signupEmail || resendCooldown > 0) return;
    await handleSendOtp({ email: signupEmail });
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      if (!signupEmail) {
        setError("Please enter your email first.");
        setSignupStep("credentials");
        return;
      }

      const normalizedOtp = otp.replace(/\D/g, "").slice(0, 6);
      if (normalizedOtp.length !== 6) {
        setError("Enter the 6-digit code.");
        return;
      }


      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, code: normalizedOtp }),
      });

      const result = (await response
        .json()
        .catch(() => ({}))) as ApiMessageResponse;

      if (!response.ok || result.success === false) {
        setError(result.error || result.message || "Failed to verify OTP");
        return;
      }

      setOtpVerified(true);
      setSuccess("Email verified! Signing you in...");

      // Final sign in after OTP verification
      const data = signupForm.getValues();
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        const session = await getSession();
        if (session?.authToken) {
          localStorage.setItem("auth_token", session.authToken);
        }
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1000);
      } else {
        setError(
          "Verification successful, but failed to sign in automatically. Please try signing in manually.",
        );
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupBackToEmail = () => {
    setError(null);
    setSuccess(null);
    setOtp("");
    setOtpVerified(false);
    setSignupStep("credentials");
  };

  const handleSignupNextFromCredentials = async () => {
    setError(null);
    setSuccess(null);

    const isValid = await signupForm.trigger([
      "email",
      "password",
      "confirmPassword",
    ]);

    if (isValid) {
      setSignupEmail(signupForm.getValues("email").trim().toLowerCase());
      setSignupStep("personal");
    }
  };

  const handleSignupNextFromPersonal = async () => {
    setError(null);
    setSuccess(null);

    const isValid = await signupForm.trigger([
      "firstName",
      "middleName",
      "surname",
    ]);

    if (isValid) setSignupStep("contact");
  };


  const handleSignUpInvalid: SubmitErrorHandler<SignupFormData> = (
    formErrors,
  ) => {
    if (
      formErrors.email ||
      formErrors.password ||
      formErrors.confirmPassword
    ) {
      setSignupStep("credentials");
      return;
    }

    if (formErrors.firstName || formErrors.surname || formErrors.middleName) {
      setSignupStep("personal");
      return;
    }

    if (
      formErrors.phone ||
      formErrors.whatsapp ||
      formErrors.country ||
      formErrors.state ||
      formErrors.city
    ) {
      setSignupStep("contact");
      return;
    }
  };

  const handleSignupStepperSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (signupStep === "credentials") {
      void handleSignupNextFromCredentials();
      return;
    }

    if (signupStep === "personal") {
      void handleSignupNextFromPersonal();
      return;
    }

    if (signupStep === "contact") {
      signupForm.handleSubmit(handleSignUp, handleSignUpInvalid)(e);
      return;
    }

    if (signupStep === "otp") {
      void handleVerifyOtp();
      return;
    }
  };

  const toggleMode = () => {
    setActiveMode(activeMode === "login" ? "signup" : "login");
    setShowEmailForm(false);
    setError(null);
    setSuccess(null);
    signinForm.reset();
    signupEmailForm.reset();
    signupForm.reset();
    setSignupStep("credentials");
    setSignupEmail("");
    setOtp("");
    setOtpVerified(false);
    setResendCooldown(0);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      ref={modalRef}
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden h-5/6 relative animate-in fade-in-0 zoom-in-95">
        {/* Left Side - Motivation & Image */}
        <div className="hidden md:flex w-1/2 h-full p-0 text-white bg-gradient-to-b from-teal-600 via-teal-700 to-teal-800 flex-col justify-between relative">
          <div className="p-8 pb-0 z-10">

            <h2 className="text-3xl text-left font-bold mb-6 text-white">
              It all starts here <i className="text-2xl block">- Gain access</i>
            </h2>
            <ul className="space-y-4 mt-4 text-white text-lg">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-5 w-5 text-teal-300 flex-shrink-0" />
                Quality work, Fast delivery
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-5 w-5 text-teal-300 flex-shrink-0" />
                Skills for any project
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-5 w-5 text-teal-300 flex-shrink-0" />
                Skilled hands ready to deliver
              </li>
            </ul>
          </div>
          <div className="relative h-3/5 w-full">
            <Image
              src="/image/signUp_modal.png"
              alt="Work"
              fill
              sizes="100"
              style={{ objectFit: "cover" }}
              className="object-cover"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col h-full relative bg-white overflow-y-auto">
          <button
            type="button"
            onClick={onClose}
            className="p-2 absolute top-4 right-4 hover:bg-gray-100 rounded-full z-20"
            aria-label="Close login modal"
            disabled={isLoading}
          >
            <IoIosClose className="w-6 h-6 text-gray-500" />
          </button>

          <div className="flex justify-between items-center mb-6 mt-10">
            <h2 className="text-2xl font-bold text-gray-800">
              {activeMode === "login" ? "Sign in to your account" : "Join TASA"}
            </h2>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <FiCheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          <div className="space-y-4 flex-grow">
            {!showEmailForm ? (
              <>
                <p className="text-gray-600 text-left">
                  {activeMode === "login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    className="text-teal-600 hover:underline font-medium"
                    onClick={toggleMode}
                    disabled={isLoading}
                  >
                    {activeMode === "login" ? "Join here" : "Sign in"}
                  </button>
                </p>

                {/* Social Login Buttons */}
                {hasGoogle && (
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <Image
                      src="/icons/google-icon.svg"
                      alt="Google"
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-700">Continue with Google</span>
                  </button>
                )}

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowEmailForm(true)}
                  disabled={isLoading}
                >
                  <IoMdMail className="h-5 w-5 text-black" />
                  <span className="text-gray-700">Continue with email</span>
                </button>

                {hasAltProviders && (
                  <>
                    <div className="flex items-center justify-between my-4">
                      <div className="border-t border-gray-200 w-full"></div>
                      <span className="px-4 text-gray-500 text-sm">OR</span>
                      <div className="border-t border-gray-200 w-full"></div>
                    </div>

                    <div className="flex gap-4">
                      {hasApple && (
                        <button
                          type="button"
                          className={`${socialButtonWidth} flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                          onClick={handleAppleSignIn}
                          disabled={isLoading}
                        >
                          <FaApple className="w-5 h-5 text-gray-800" />
                          <span className="text-gray-700">Apple</span>
                        </button>
                      )}
                      {hasFacebook && (
                        <button
                          type="button"
                          className={`${socialButtonWidth} flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                          onClick={handleFacebookSignIn}
                          disabled={isLoading}
                        >
                          <FaFacebook className="w-5 h-5 text-[#1877f3]" />
                          <span className="text-gray-700">Facebook</span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Email Form */
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="text-teal-600 hover:text-teal-700"
                    disabled={isLoading}
                  >
                    Back
                  </button>
                  <span className="text-gray-600">
                    {activeMode === "login"
                      ? "Sign in with email"
                      : "Create account with email"}
                  </span>
                </div>

                {activeMode === "login" ? (
                  /* Sign In Form */
                  <form
                    onSubmit={signinForm.handleSubmit(handleSignIn)}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...signinForm.register("email")}
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter your email"
                        disabled={isLoading}
                      />
                      {signinForm.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {signinForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          {...signinForm.register("password")}
                          className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10"
                          placeholder="Enter your password"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          disabled={isLoading}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {signinForm.formState.errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {signinForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                  </form>
                ) : (
                  /* Sign Up Form */
                  <form
                    onSubmit={handleSignupStepperSubmit} /* STEPPER */
                    className="space-y-4"
                  >
                    {/* Hidden inputs for submission/validation */}
                    <input type="hidden" {...signupForm.register("email")} />
                    <input type="hidden" {...signupForm.register("country")} />
                    <input type="hidden" {...signupForm.register("state")} />
                    <input type="hidden" {...signupForm.register("city")} />

                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                      <span>
                        Step{" "}
                        {signupStep === "credentials"
                          ? 1
                          : signupStep === "personal"
                            ? 2
                            : signupStep === "contact"
                              ? 3
                              : 4}{" "}
                        of 4
                      </span>
                      {otpVerified && (
                        <span className="text-teal-700">Email verified</span>
                      )}
                    </div>

                    {signupStep === "credentials" && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="signupEmail"
                            {...signupForm.register("email")}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                            placeholder="Enter your email"
                            disabled={isLoading}
                          />
                          {signupForm.formState.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.email.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="signupPassword" title="At least 8 characters with letters and numbers" className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="signupPassword"
                              {...signupForm.register("password")}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10 text-black"
                              placeholder="Create a password"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              disabled={isLoading}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                          {signupForm.formState.errors.password && (
                            <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.password.message}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" title="Must match password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              {...signupForm.register("confirmPassword")}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10 text-black"
                              placeholder="Confirm your password"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              disabled={isLoading}
                            >
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                          {signupForm.formState.errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{signupForm.formState.errors.confirmPassword.message}</p>
                          )}
                        </div>
                      </div>
                    )}


                    {signupStep === "otp" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-teal-700 font-medium bg-teal-50 p-2 rounded-lg border border-teal-100">
                          <FiCheckCircle className="h-5 w-5" />
                          <span>Account created successfully!</span>
                        </div>

                        <p className="text-xl font-bold text-teal-800 animate-pulse text-center">
                          Just one more thing....
                        </p>

                        <div className="text-sm text-gray-700">
                          Enter the 6-digit code sent to{" "}
                          <span className="font-medium">{signupEmail}</span>.
                        </div>

                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          disabled={isLoading}
                          autoFocus
                        />

                        <div className="flex items-center justify-between text-sm">
                          <button
                            type="button"
                            className="text-gray-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSignupBackToEmail}
                            disabled={isLoading}
                          >
                            Change email
                          </button>

                          <button
                            type="button"
                            className="text-teal-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleResendOtp}
                            disabled={
                              isLoading || resendCooldown > 0 || !signupEmail
                            }
                          >
                            {resendCooldown > 0
                              ? `Resend in ${resendCooldown}s`
                              : "Resend OTP"}
                          </button>
                        </div>
                      </div>
                    )}
                    {signupStep === "personal" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              First Name *
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              {...signupForm.register("firstName")}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                              placeholder="First name"
                              disabled={isLoading}
                            />
                            {signupForm.formState.errors.firstName && (
                              <p className="text-red-500 text-sm mt-1">
                                {signupForm.formState.errors.firstName.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="surname"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Surname *
                            </label>
                            <input
                              type="text"
                              id="surname"
                              {...signupForm.register("surname")}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                              placeholder="Surname"
                              disabled={isLoading}
                            />
                            {signupForm.formState.errors.surname && (
                              <p className="text-red-500 text-sm mt-1">
                                {signupForm.formState.errors.surname.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="middleName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Middle Name (Optional)
                          </label>
                          <input
                            type="text"
                            id="middleName"
                            {...signupForm.register("middleName")}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                            placeholder="Middle name"
                            disabled={isLoading}
                          />
                          {signupForm.formState.errors.middleName && (
                            <p className="text-red-500 text-sm mt-1">
                              {signupForm.formState.errors.middleName.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {signupStep === "contact" && (
                      <>
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            {...signupForm.register("phone")}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                            placeholder="+1 (555) 123-4567"
                            disabled={isLoading}
                          />
                          {signupForm.formState.errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              {signupForm.formState.errors.phone.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="whatsapp"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            WhatsApp Number *
                          </label>
                          <input
                            type="tel"
                            id="whatsapp"
                            {...signupForm.register("whatsapp")}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-black"
                            placeholder="+1 (555) 123-4567"
                            disabled={isLoading}
                          />
                          {signupForm.formState.errors.whatsapp && (
                            <p className="text-red-500 text-sm mt-1">
                              {signupForm.formState.errors.whatsapp.message}
                            </p>
                          )}
                        </div>

                        {/* Location Fields */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            Location Information
                          </h3>

                          {/* Country Dropdown */}
                          <div className="relative dropdown-container">
                            <span className="block text-sm font-medium text-gray-700 mb-1">
                              Country *
                            </span>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    !countryDropdownOpen &&
                                    countries.length === 0
                                  ) {
                                    fetchCountries();
                                  }
                                  setCountryDropdownOpen(!countryDropdownOpen);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between"
                              >
                                <span
                                  className={
                                    selectedCountry
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                  }
                                >
                                  {selectedCountry || "Select Country"}
                                </span>
                                <FiChevronDown className="w-4 h-4 text-gray-400" />
                              </button>

                              {countryDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                  <div className="p-2 border-b border-gray-200">
                                    <div className="relative">
                                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <input
                                        type="text"
                                        placeholder="Search countries..."
                                        value={countrySearch}
                                        onChange={(e) =>
                                          setCountrySearch(e.target.value)
                                        }
                                        className="w-full pl-10 pr-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                      />
                                    </div>
                                  </div>
                                  <div className="h-48 overflow-y-auto">
                                    {loadingCountries ? (
                                      <div className="p-3 text-center text-gray-500">
                                        Loading countries...
                                      </div>
                                    ) : countries.length === 0 ? (
                                      <div className="p-3 text-center text-gray-500">
                                        No countries loaded
                                      </div>
                                    ) : (
                                      countries
                                        .filter((country) => {
                                          if (!countrySearch.trim())
                                            return true;
                                          return country.country
                                            .toLowerCase()
                                            .includes(
                                              countrySearch.toLowerCase(),
                                            );
                                        })
                                        .map((country, index) => (
                                          <button
                                            key={index}
                                            type="button"
                                            onClick={() =>
                                              handleCountrySelect(
                                                String(country.country),
                                              )
                                            }
                                            className="w-full px-3 py-2 text-left text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                          >
                                            {country.country}
                                          </button>
                                        ))
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            {signupForm.formState.errors.country && (
                              <p className="mt-1 text-sm text-red-600">
                                {signupForm.formState.errors.country.message}
                              </p>
                            )}
                          </div>

                          {/* State Dropdown */}
                          <div className="relative dropdown-container">
                            <span className="block text-sm font-medium text-gray-700 mb-1">
                              State *
                            </span>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  selectedCountry &&
                                  setStateDropdownOpen(!stateDropdownOpen)
                                }
                                disabled={!selectedCountry}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between disabled:bg-gray-50 disabled:cursor-not-allowed"
                              >
                                <span
                                  className={
                                    selectedState
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                  }
                                >
                                  {selectedState ||
                                    (selectedCountry
                                      ? "Select State"
                                      : "Select Country First")}
                                </span>
                                <FiChevronDown className="w-4 h-4 text-gray-400" />
                              </button>

                              {stateDropdownOpen && selectedCountry && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                  <div className="p-2 border-b border-gray-200">
                                    <div className="relative">
                                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <input
                                        type="text"
                                        placeholder="Search states..."
                                        value={stateSearch}
                                        onChange={(e) =>
                                          setStateSearch(e.target.value)
                                        }
                                        className="w-full pl-10 pr-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                      />
                                    </div>
                                  </div>
                                  <div className="h-48 overflow-y-auto">
                                    {loadingStates ? (
                                      <div className="p-3 text-center text-gray-500">
                                        Loading states...
                                      </div>
                                    ) : (
                                      states
                                        .filter((state) => {
                                          if (!stateSearch.trim()) return true;
                                          return state?.name
                                            ?.toLowerCase()
                                            ?.includes(
                                              stateSearch.toLowerCase(),
                                            );
                                        })
                                        .map(
                                          (state) =>
                                            state?.name && (
                                              <button
                                                key={state.state_code}
                                                type="button"
                                                onClick={() =>
                                                  handleStateSelect(state.name)
                                                }
                                                className="w-full px-3 py-2 text-left text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                              >
                                                {state.name}
                                              </button>
                                            ),
                                        )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            {signupForm.formState.errors.state && (
                              <p className="mt-1 text-sm text-red-600">
                                {signupForm.formState.errors.state.message}
                              </p>
                            )}
                          </div>

                          {/* City Dropdown */}
                          <div className="relative dropdown-container">
                            <span className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                            </span>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  selectedState &&
                                    setCityDropdownOpen(!cityDropdownOpen);
                                }}
                                disabled={!selectedState}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between disabled:bg-gray-50 disabled:cursor-not-allowed"
                              >
                                <span
                                  className={
                                    selectedCity
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                  }
                                >
                                  {selectedCity ||
                                    (selectedState
                                      ? "Select City"
                                      : "Select State First")}
                                </span>
                                <FiChevronDown className="w-4 h-4 text-gray-400" />
                              </button>

                              {cityDropdownOpen && selectedState && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                  <div className="p-2 border-b border-gray-200">
                                    <div className="relative">
                                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                      <input
                                        type="text"
                                        placeholder="Search cities..."
                                        value={citySearch}
                                        onChange={(e) =>
                                          setCitySearch(e.target.value)
                                        }
                                        className="w-full pl-10 pr-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                      />
                                    </div>
                                  </div>
                                  <div className="h-48 overflow-y-auto">
                                    {loadingCities ? (
                                      <div className="p-3 text-center text-gray-500">
                                        Loading cities...
                                      </div>
                                    ) : cities.length > 0 ? (
                                      (() => {
                                        console.log(
                                          "Rendering cities array:",
                                          cities,
                                        );
                                        console.log("First city:", cities[0]);
                                        console.log(
                                          "Cities length:",
                                          cities.length,
                                        );
                                        return cities;
                                      })()
                                        .filter((city) => {
                                          if (!citySearch.trim()) return true;
                                          const cityName =
                                            typeof city === "string"
                                              ? city
                                              : city?.name;
                                          return cityName
                                            ?.toLowerCase()
                                            ?.includes(
                                              citySearch.toLowerCase(),
                                            );
                                        })
                                        .map((city, index) => {
                                          const cityName =
                                            typeof city === "string"
                                              ? city
                                              : city?.name;
                                          return cityName ? (
                                            <button
                                              key={index}
                                              type="button"
                                              onClick={() =>
                                                handleCitySelect(cityName)
                                              }
                                              className="w-full px-3 py-2 text-left text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                            >
                                              {cityName}
                                            </button>
                                          ) : null;
                                        })
                                    ) : (
                                      <div className="p-3 text-center text-gray-500">
                                        No cities available for this state
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            {signupForm.formState.errors.city && (
                              <p className="mt-1 text-sm text-red-600">
                                {signupForm.formState.errors.city.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}


                    <div className="flex gap-3">
                      {signupStep !== "credentials" && signupStep !== "otp" && (
                        <button
                          type="button"
                          className="w-1/3 border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => {
                            if (signupStep === "personal") setSignupStep("credentials");
                            else if (signupStep === "contact") setSignupStep("personal");
                          }}
                          disabled={isLoading}
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        className={`${
                          signupStep === "credentials" ? "w-full" : "w-2/3"
                        } bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        disabled={
                          isLoading ||
                          (signupStep === "otp" &&
                            otp.replace(/\D/g, "").length !== 6)
                        }
                      >
                        {signupStep === "otp"
                          ? isLoading
                            ? "Verifying..."
                            : "Verify OTP"
                          : signupStep === "contact"
                            ? isLoading
                              ? "Creating Account..."
                              : "Create Account"
                            : "Next"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-8">
            By joining, you agree to the TASA{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and to occasionally receive emails from us. Please read our{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>{" "}
            to learn how we use your personal data.
          </p>
        </div>
      </div>
    </div>
  );
}
