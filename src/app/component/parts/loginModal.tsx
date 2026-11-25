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
  FiLoader,
  FiX,
} from "react-icons/fi";
import { IoIosClose, IoMdMail } from "react-icons/io";
import { z } from "zod";
import OtpInput from "@/components/auth/OtpInput";
import {
  type EmailDomainSuggestion,
  getEmailDomainSuggestion,
} from "@/lib/email-validator";

// Validation schemas
const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name too long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username too long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores allowed",
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address")
      .superRefine((val, ctx) => {
        const suggestion = getEmailDomainSuggestion(val);
        if (suggestion) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Did you mean ${suggestion.suggested}? '${suggestion.originalDomain}' appears to be a typo.`,
          });
        }
      }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SigninFormData = z.infer<typeof signinSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

type ApiMessageResponse = {
  success?: boolean;
  error?: string;
  message?: string;
};

type CheckEmailResponse = ApiMessageResponse & {
  data?: {
    exists: boolean;
    email: string;
  };
};

type CheckUsernameResponse = ApiMessageResponse & {
  data?: {
    exists: boolean;
    username: string;
  };
};

type EmailAvailabilityStatus = "idle" | "incomplete" | "checking" | "available" | "error";

type EmailAvailabilityState = {
  email: string;
  status: EmailAvailabilityStatus;
  message: string | null;
};

type UsernameAvailabilityStatus = "idle" | "incomplete" | "checking" | "available" | "error";

type UsernameAvailabilityState = {
  username: string;
  status: UsernameAvailabilityStatus;
  message: string | null;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_CHECK_DEBOUNCE_MS = 450;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const USERNAME_CHECK_DEBOUNCE_MS = 450;

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  mode?: "login" | "signup";
  onSuccess?: () => void;
}

// Password validation rules type
interface PasswordRules {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
}



// Password Rules Display Component
function PasswordRulesDisplay({ rules }: { rules: PasswordRules }) {
  const rulesList = [
    { label: "At least 8 characters", met: rules.minLength },
    { label: "At least 1 uppercase letter", met: rules.hasUppercase },
    { label: "At least 1 lowercase letter", met: rules.hasLowercase },
    { label: "At least 1 number", met: rules.hasNumber },
  ];

  return (
    <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
      {rulesList.map((rule) => (
        <div
          key={rule.label}
          className={`flex items-center gap-2 text-sm transition-colors ${
            rule.met ? "text-green-600" : "text-gray-500"
          }`}
        >
          {rule.met ? (
            <FiCheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
          ) : (
            <FiX className="h-4 w-4 flex-shrink-0 text-gray-400" />
          )}
          <span>{rule.label}</span>
        </div>
      ))}
    </div>
  );
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

  // Password validation state
  const [passwordRules, setPasswordRules] = useState<PasswordRules>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });
  const [signupEmailAvailability, setSignupEmailAvailability] =
    useState<EmailAvailabilityState>({
      email: "",
      status: "idle",
      message: null,
    });
  const [emailDomainSuggestion, setEmailDomainSuggestion] =
    useState<EmailDomainSuggestion | null>(null);

  // Sign up (email OTP) stepper state
  const [signupStep, setSignupStep] = useState<
    "credentials" | "personal" | "otp"
  >("credentials");
  const [signupEmail, setSignupEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);
  const hasApple = !!providers?.apple;
  const hasFacebook = !!providers?.facebook;
  const hasAltProviders = hasApple || hasFacebook;
  const socialButtonWidth = hasApple && hasFacebook ? "w-1/2" : "w-full";
  const emailCheckCacheRef = useRef<Map<string, boolean>>(new Map());
  const emailCheckRequestsRef = useRef<Map<string, Promise<boolean>>>(
    new Map(),
  );
  const emailCheckDebounceRef = useRef<number | null>(null);
  const emailCheckRequestIdRef = useRef(0);

  // Username availability state
  const [signupUsernameAvailability, setSignupUsernameAvailability] =
    useState<UsernameAvailabilityState>({
      username: "",
      status: "idle",
      message: null,
    });
  const usernameCheckCacheRef = useRef<Map<string, boolean>>(new Map());
  const usernameCheckRequestsRef = useRef<Map<string, Promise<boolean>>>(
    new Map(),
  );
  const usernameCheckDebounceRef = useRef<number | null>(null);
  const usernameCheckRequestIdRef = useRef(0);

  // Form setup
  const signinForm = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isCheckingEmail = signupEmailAvailability.status === "checking";
  const isCheckingUsername = signupUsernameAvailability.status === "checking";

  // Utility function to validate password rules
  const validatePasswordRules = (password: string): PasswordRules => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
    };
  };

  const normalizeEmail = (email: string) => email.trim().toLowerCase();
  const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

  const clearPendingEmailCheck = () => {
    if (emailCheckDebounceRef.current !== null) {
      window.clearTimeout(emailCheckDebounceRef.current);
      emailCheckDebounceRef.current = null;
    }
  };

  const resetSignupOtpState = () => {
    setSignupStep("credentials");
    setSignupEmail("");
    setOtp("");
    setOtpVerified(false);
    setResendCooldown(0);
  };

  const resetSignupEmailAvailability = (email = "") => {
    setSignupEmailAvailability({
      email,
      status: "idle",
      message: null,
    });
    setEmailDomainSuggestion(null);
  };

  const switchToSignInWithEmail = (
    email: string,
    message = "We found an existing account for this email. Sign in to continue.",
  ) => {
    const normalizedEmail = normalizeEmail(email);

    clearPendingEmailCheck();
    emailCheckRequestIdRef.current += 1;
    resetSignupEmailAvailability();
    setError(null);
    setSuccess(message);
    setActiveMode("login");
    setShowEmailForm(true);
    signinForm.reset({
      email: normalizedEmail,
      password: "",
    });
    resetSignupOtpState();
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    const normalizedEmail = normalizeEmail(email);
    const cachedResult = emailCheckCacheRef.current.get(normalizedEmail);

    if (typeof cachedResult === "boolean") {
      return cachedResult;
    }

    const existingRequest = emailCheckRequestsRef.current.get(normalizedEmail);
    if (existingRequest) {
      return existingRequest;
    }

    const request = (async () => {
      const response = await fetch(
        `/api/auth/check-email?email=${encodeURIComponent(normalizedEmail)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        },
      );

      const data = (await response
        .json()
        .catch(() => null)) as CheckEmailResponse | null;

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Couldn't verify this email right now. Please try again.",
        );
      }

      const exists = data?.data?.exists ?? false;
      emailCheckCacheRef.current.set(normalizedEmail, exists);
      return exists;
    })();

    emailCheckRequestsRef.current.set(normalizedEmail, request);

    try {
      return await request;
    } finally {
      emailCheckRequestsRef.current.delete(normalizedEmail);
    }
  };

  const verifySignupEmailAvailability = async (
    email: string,
  ): Promise<"available" | "exists" | "error" | "invalid"> => {
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      resetSignupEmailAvailability(normalizedEmail);
      return "invalid";
    }

    const suggestion = getEmailDomainSuggestion(normalizedEmail);
    if (suggestion) {
      setEmailDomainSuggestion(suggestion);
      setSignupEmailAvailability({
        email: normalizedEmail,
        status: "error",
        message: `Did you mean ${suggestion.suggested}? '${suggestion.originalDomain}' appears to be a typo.`,
      });
      return "invalid";
    }

    const cachedResult = emailCheckCacheRef.current.get(normalizedEmail);
    if (typeof cachedResult === "boolean") {
      if (cachedResult) {
        switchToSignInWithEmail(normalizedEmail);
        return "exists";
      }

      setSignupEmailAvailability({
        email: normalizedEmail,
        status: "available",
        message: null,
      });
      return "available";
    }

    const requestId = ++emailCheckRequestIdRef.current;
    setSignupEmailAvailability({
      email: normalizedEmail,
      status: "checking",
      message: null,
    });

    try {
      const exists = await checkEmailExists(normalizedEmail);
      const latestEmail = normalizeEmail(signupForm.getValues("email"));

      if (
        requestId !== emailCheckRequestIdRef.current ||
        latestEmail !== normalizedEmail
      ) {
        return exists ? "exists" : "available";
      }

      if (exists) {
        switchToSignInWithEmail(normalizedEmail);
        return "exists";
      }

      setSignupEmailAvailability({
        email: normalizedEmail,
        status: "available",
        message: null,
      });
      return "available";
    } catch (error) {
      const latestEmail = normalizeEmail(signupForm.getValues("email"));

      if (
        requestId !== emailCheckRequestIdRef.current ||
        latestEmail !== normalizedEmail
      ) {
        return "error";
      }

      console.error("Error checking email:", error);
      setSignupEmailAvailability({
        email: normalizedEmail,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Couldn't verify this email right now. Please try again.",
      });
      return "error";
    }
  };

  const scheduleSignupEmailCheck = (email: string) => {
    const normalizedEmail = normalizeEmail(email);

    clearPendingEmailCheck();
    emailCheckRequestIdRef.current += 1;

    if (!normalizedEmail) {
      resetSignupEmailAvailability();
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setEmailDomainSuggestion(null);
      setSignupEmailAvailability({
        email: normalizedEmail,
        status: "incomplete",
        message: "Please enter a complete email address",
      });
      return;
    }

    const domainSuggestion = getEmailDomainSuggestion(normalizedEmail);
    setEmailDomainSuggestion(domainSuggestion);
    if (domainSuggestion) {
      setSignupEmailAvailability({
        email: normalizedEmail,
        status: "error",
        message: `Did you mean ${domainSuggestion.suggested}? '${domainSuggestion.originalDomain}' appears to be a typo.`,
      });
      return;
    }

    const cachedResult = emailCheckCacheRef.current.get(normalizedEmail);
    if (typeof cachedResult === "boolean") {
      if (cachedResult) {
        switchToSignInWithEmail(normalizedEmail);
        return;
      }

      setSignupEmailAvailability({
        email: normalizedEmail,
        status: "available",
        message: null,
      });
      return;
    }

    setSignupEmailAvailability({
      email: normalizedEmail,
      status: "checking",
      message: null,
    });

    emailCheckDebounceRef.current = window.setTimeout(() => {
      void verifySignupEmailAvailability(normalizedEmail);
    }, EMAIL_CHECK_DEBOUNCE_MS);
  };

  const handleSignupEmailChange = (email: string) => {
    if (error) {
      setError(null);
    }

    if (success) {
      setSuccess(null);
    }

    setOtpVerified(false);
    scheduleSignupEmailCheck(email);
  };

  const handleSignupEmailBlur = async (email: string) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return;
    }

    const domainSuggestion = getEmailDomainSuggestion(normalizedEmail);
    setEmailDomainSuggestion(domainSuggestion);
    if (domainSuggestion) {
      setSignupEmailAvailability({
        email: normalizedEmail,
        status: "error",
        message: `Did you mean ${domainSuggestion.suggested}? '${domainSuggestion.originalDomain}' appears to be a typo.`,
      });
      return;
    }

    clearPendingEmailCheck();
    await verifySignupEmailAvailability(normalizedEmail);
  };

  const handleApplyEmailSuggestion = (suggestedEmail: string) => {
    signupForm.setValue("email", suggestedEmail, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setEmailDomainSuggestion(null);
    scheduleSignupEmailCheck(suggestedEmail);
  };

  // --- Username availability check ---
  const normalizeUsername = (username: string) => username.trim().toLowerCase();
  const isValidUsername = (username: string) =>
    USERNAME_REGEX.test(username) && username.length >= 3;

  const clearPendingUsernameCheck = () => {
    if (usernameCheckDebounceRef.current !== null) {
      window.clearTimeout(usernameCheckDebounceRef.current);
      usernameCheckDebounceRef.current = null;
    }
  };

  const resetSignupUsernameAvailability = (username = "") => {
    setSignupUsernameAvailability({
      username,
      status: "idle",
      message: null,
    });
  };

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    const normalizedUsername = normalizeUsername(username);
    const cachedResult = usernameCheckCacheRef.current.get(normalizedUsername);

    if (typeof cachedResult === "boolean") {
      return cachedResult;
    }

    const existingRequest =
      usernameCheckRequestsRef.current.get(normalizedUsername);
    if (existingRequest) {
      return existingRequest;
    }

    const request = (async () => {
      const response = await fetch(
        `/api/auth/check-username?username=${encodeURIComponent(normalizedUsername)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        },
      );

      const data = (await response
        .json()
        .catch(() => null)) as CheckUsernameResponse | null;

      if (!response.ok || data?.success === false) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Couldn't verify this username right now. Please try again.",
        );
      }

      const exists = data?.data?.exists ?? false;
      usernameCheckCacheRef.current.set(normalizedUsername, exists);
      return exists;
    })();

    usernameCheckRequestsRef.current.set(normalizedUsername, request);

    try {
      return await request;
    } finally {
      usernameCheckRequestsRef.current.delete(normalizedUsername);
    }
  };

  const verifySignupUsernameAvailability = async (
    username: string,
  ): Promise<"available" | "taken" | "error" | "invalid"> => {
    const normalizedUsername = normalizeUsername(username);

    if (!isValidUsername(normalizedUsername)) {
      resetSignupUsernameAvailability(normalizedUsername);
      return "invalid";
    }

    const cachedResult =
      usernameCheckCacheRef.current.get(normalizedUsername);
    if (typeof cachedResult === "boolean") {
      if (cachedResult) {
        setSignupUsernameAvailability({
          username: normalizedUsername,
          status: "error",
          message: "This username is already taken",
        });
        return "taken";
      }

      setSignupUsernameAvailability({
        username: normalizedUsername,
        status: "available",
        message: null,
      });
      return "available";
    }

    const requestId = ++usernameCheckRequestIdRef.current;
    setSignupUsernameAvailability({
      username: normalizedUsername,
      status: "checking",
      message: null,
    });

    try {
      const exists = await checkUsernameExists(normalizedUsername);
      const latestUsername = normalizeUsername(
        signupForm.getValues("username"),
      );

      if (
        requestId !== usernameCheckRequestIdRef.current ||
        latestUsername !== normalizedUsername
      ) {
        return exists ? "taken" : "available";
      }

      if (exists) {
        setSignupUsernameAvailability({
          username: normalizedUsername,
          status: "error",
          message: "This username is already taken",
        });
        return "taken";
      }

      setSignupUsernameAvailability({
        username: normalizedUsername,
        status: "available",
        message: null,
      });
      return "available";
    } catch (error) {
      const latestUsername = normalizeUsername(
        signupForm.getValues("username"),
      );

      if (
        requestId !== usernameCheckRequestIdRef.current ||
        latestUsername !== normalizedUsername
      ) {
        return "error";
      }

      console.error("Error checking username:", error);
      setSignupUsernameAvailability({
        username: normalizedUsername,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Couldn't verify this username right now. Please try again.",
      });
      return "error";
    }
  };

  const scheduleSignupUsernameCheck = (username: string) => {
    const normalizedUsername = normalizeUsername(username);

    clearPendingUsernameCheck();
    usernameCheckRequestIdRef.current += 1;

    if (!normalizedUsername) {
      resetSignupUsernameAvailability();
      return;
    }

    if (!isValidUsername(normalizedUsername)) {
      setSignupUsernameAvailability({
        username: normalizedUsername,
        status: "incomplete",
        message:
          normalizedUsername.length < 3
            ? "Username must be at least 3 characters"
            : "Only letters, numbers, and underscores allowed",
      });
      return;
    }

    const cachedResult =
      usernameCheckCacheRef.current.get(normalizedUsername);
    if (typeof cachedResult === "boolean") {
      if (cachedResult) {
        setSignupUsernameAvailability({
          username: normalizedUsername,
          status: "error",
          message: "This username is already taken",
        });
        return;
      }

      setSignupUsernameAvailability({
        username: normalizedUsername,
        status: "available",
        message: null,
      });
      return;
    }

    setSignupUsernameAvailability({
      username: normalizedUsername,
      status: "checking",
      message: null,
    });

    usernameCheckDebounceRef.current = window.setTimeout(() => {
      void verifySignupUsernameAvailability(normalizedUsername);
    }, USERNAME_CHECK_DEBOUNCE_MS);
  };

  const handleSignupUsernameChange = (username: string) => {
    if (error) setError(null);
    if (success) setSuccess(null);
    scheduleSignupUsernameCheck(username);
  };

  const handleSignupUsernameBlur = async (username: string) => {
    const normalizedUsername = normalizeUsername(username);
    if (!normalizedUsername || !isValidUsername(normalizedUsername)) return;
    clearPendingUsernameCheck();
    await verifySignupUsernameAvailability(normalizedUsername);
  };


  // Load auth providers
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

  // Reset form and state when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      if (emailCheckDebounceRef.current !== null) {
        window.clearTimeout(emailCheckDebounceRef.current);
        emailCheckDebounceRef.current = null;
      }
      emailCheckRequestIdRef.current += 1;
      emailCheckCacheRef.current.clear();
      emailCheckRequestsRef.current.clear();
      setActiveMode(mode);
      setShowEmailForm(false);
      setError(null);
      setSuccess(null);
      signinForm.reset();
      signupForm.reset();
      setSignupStep("credentials");
      setSignupEmail("");
      setOtp("");
      setOtpVerified(false);
      setResendCooldown(0);
      setSignupEmailAvailability({
        email: "",
        status: "idle",
        message: null,
      });
      setSignupUsernameAvailability({
        username: "",
        status: "idle",
        message: null,
      });
      if (usernameCheckDebounceRef.current !== null) {
        window.clearTimeout(usernameCheckDebounceRef.current);
        usernameCheckDebounceRef.current = null;
      }
      usernameCheckRequestIdRef.current += 1;
      usernameCheckCacheRef.current.clear();
      usernameCheckRequestsRef.current.clear();
      setPasswordRules({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
      });
    }
  }, [open, mode, signinForm, signupForm]);

  useEffect(() => {
    return () => {
      if (emailCheckDebounceRef.current !== null) {
        window.clearTimeout(emailCheckDebounceRef.current);
      }
      if (usernameCheckDebounceRef.current !== null) {
        window.clearTimeout(usernameCheckDebounceRef.current);
      }
    };
  }, []);

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
        const domainSuggestion = getEmailDomainSuggestion(data.email);
        if (domainSuggestion) {
          setError(
            `Invalid email or password. Did you mean ${domainSuggestion.suggested}?`,
          );
        } else {
          setError("Invalid email or password");
        }
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

      if (!otpVerified) {
        setError("Please verify your email before creating an account.");
        setSignupStep("otp");
        return;
      }

      const normalizedEmail = data.email.trim().toLowerCase();
      const name = data.name.trim();

      const registrationData = {
        name,
        username: data.username,
        email: normalizedEmail,
        password: data.password,
        role: "client",
        provider: "email",
        token: "",
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

      setSuccess("Account created successfully! Signing you in...");

      // Automatically sign in the newly registered user
      const signInResult = await signIn("credentials", {
        email: normalizedEmail,
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
          window.dispatchEvent(new CustomEvent("tasa:open-onboarding"));
        }, 1000);
      } else {
        setError(
          "Account created, but automatic sign-in failed. Please sign in with your credentials.",
        );
        setTimeout(() => {
          switchToSignInWithEmail(
            normalizedEmail,
            "Account created! Please sign in with your credentials.",
          );
        }, 1500);
      }
    } catch (error) {
      console.error("Login modal signup error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async ({ email }: { email: string }) => {
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
          emailCheckCacheRef.current.set(normalizedEmail, true);
          switchToSignInWithEmail(
            normalizedEmail,
            "An account with this email already exists. Please sign in.",
          );
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
      setSuccess("Email verified! Enter your details to complete your account.");
      setSignupStep("personal");
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

    if (!isValid) return;

    const normalizedEmail = normalizeEmail(signupForm.getValues("email"));
    const domainSuggestion = getEmailDomainSuggestion(normalizedEmail);
    if (domainSuggestion) {
      setEmailDomainSuggestion(domainSuggestion);
      signupForm.setError("email", {
        type: "manual",
        message: `Did you mean ${domainSuggestion.suggested}? '${domainSuggestion.originalDomain}' appears to be a typo. Please fix it to receive your verification code.`,
      });
      return;
    }

    const availability = await verifySignupEmailAvailability(normalizedEmail);

    if (availability !== "available") {
      return;
    }

    setSignupEmail(normalizedEmail);
    // Send OTP to email and proceed to OTP verification step
    await handleSendOtp({ email: normalizedEmail });
  };

  const handleSignupSubmitFromPersonal = async () => {
    setError(null);
    setSuccess(null);

    const isValid = await signupForm.trigger(["name", "username"]);
    if (!isValid) return;

    const normalizedUsername = normalizeUsername(
      signupForm.getValues("username"),
    );
    const availability =
      await verifySignupUsernameAvailability(normalizedUsername);
    if (availability !== "available") return;

    // All validated — submit the form to create account
    await signupForm.handleSubmit(handleSignUp, handleSignUpInvalid)();
  };

  const handleSignUpInvalid: SubmitErrorHandler<SignupFormData> = (
    formErrors,
  ) => {
    if (formErrors.email || formErrors.password || formErrors.confirmPassword) {
      setSignupStep("credentials");
      return;
    }

    if (formErrors.name || formErrors.username) {
      setSignupStep("personal");
      return;
    }
  };

  const handleSignupStepperSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (signupStep === "credentials") {
      void handleSignupNextFromCredentials();
      return;
    }

    if (signupStep === "otp") {
      void handleVerifyOtp();
      return;
    }

    if (signupStep === "personal") {
      void handleSignupSubmitFromPersonal();
      return;
    }
  };

  const toggleMode = () => {
    clearPendingEmailCheck();
    emailCheckRequestIdRef.current += 1;
    clearPendingUsernameCheck();
    usernameCheckRequestIdRef.current += 1;
    setActiveMode(activeMode === "login" ? "signup" : "login");
    setShowEmailForm(false);
    setError(null);
    setSuccess(null);
    signinForm.reset();
    signupForm.reset();
    resetSignupOtpState();
    resetSignupEmailAvailability();
    resetSignupUsernameAvailability();
  };

  const signupEmailValue = signupForm.watch("email") ?? "";
  const normalizedSignupEmail = normalizeEmail(signupEmailValue);
  const signupEmailField = signupForm.register("email");
  const showSignupEmailAvailability =
    !signupForm.formState.errors.email &&
    !!normalizedSignupEmail &&
    isValidEmail(normalizedSignupEmail) &&
    signupEmailAvailability.email === normalizedSignupEmail;
  const showSignupEmailIncomplete =
    !signupForm.formState.errors.email &&
    !!normalizedSignupEmail &&
    !isValidEmail(normalizedSignupEmail) &&
    signupEmailAvailability.status === "incomplete" &&
    signupEmailAvailability.email === normalizedSignupEmail;

  const signupUsernameValue = signupForm.watch("username") ?? "";
  const normalizedSignupUsername = normalizeUsername(signupUsernameValue);
  const signupUsernameField = signupForm.register("username");
  const showSignupUsernameAvailability =
    !signupForm.formState.errors.username &&
    !!normalizedSignupUsername &&
    isValidUsername(normalizedSignupUsername) &&
    signupUsernameAvailability.username === normalizedSignupUsername;
  const showSignupUsernameIncomplete =
    !signupForm.formState.errors.username &&
    !!normalizedSignupUsername &&
    !isValidUsername(normalizedSignupUsername) &&
    signupUsernameAvailability.status === "incomplete" &&
    signupUsernameAvailability.username === normalizedSignupUsername;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      ref={modalRef}
      aria-label="Close login modal"
      onMouseDown={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden h-5/6 relative animate-in fade-in-0 zoom-in-95">
        {/* Left Side - Motivation & Image */}
        <div className="hidden md:flex w-1/2 h-full p-0 text-white bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0f172a] flex-col justify-between relative">
          <div className="p-8 pb-0 z-10 relative">
            <h2 className="text-3xl text-left font-bold mb-6 text-white">
              It all starts here <i className="text-2xl block">- Gain access</i>
            </h2>
            <ul className="space-y-4 mt-4 text-white text-lg">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-5 w-5 text-[#82C0CC] flex-shrink-0" />
                Quality work, Fast delivery
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-5 w-5 text-[#82C0CC] flex-shrink-0" />
                Skills for any project
              </li>
              <li className="flex items-center gap-2">
                <FiCheckCircle className="h-5 w-5 text-[#82C0CC] flex-shrink-0" />
                Skilled hands ready to deliver
              </li>
            </ul>
          </div>
          <div className="absolute bottom-0 h-3/5 w-full">
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
                    className="text-[#489FB5] hover:underline font-medium"
                    onClick={toggleMode}
                    disabled={isLoading}
                  >
                    {activeMode === "login" ? "Join here" : "Sign in"}
                  </button>
                </p>

                {/* Social Login Buttons */}
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
                    className="text-[#489FB5] hover:text-[#388295] font-medium"
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
                        className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#489FB5] focus:border-transparent"
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
                          className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-[#489FB5] focus:border-transparent pr-10"
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
                      className="w-full bg-[#334155] text-white p-3 rounded-lg hover:bg-[#1E293B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
                    {/* Stepper Progress Indicator */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            signupStep === "credentials"
                              ? "bg-[#334155] text-white"
                              : "bg-[#489FB5] text-white"
                          }`}
                        >
                          1
                        </span>
                        <span
                          className={`text-xs ${
                            signupStep === "credentials"
                              ? "font-semibold text-slate-900"
                              : "text-slate-500"
                          }`}
                        >
                          Account
                        </span>
                      </div>
                      <div className="flex-1 mx-2 h-0.5 bg-slate-200">
                        <div
                          className="h-full bg-[#334155] transition-all duration-300"
                          style={{
                            width: signupStep === "credentials" ? "0%" : "100%",
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            signupStep === "otp"
                              ? "bg-[#334155] text-white"
                              : signupStep === "personal"
                                ? "bg-[#489FB5] text-white"
                                : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          2
                        </span>
                        <span
                          className={`text-xs ${
                            signupStep === "otp"
                              ? "font-semibold text-slate-900"
                              : "text-slate-500"
                          }`}
                        >
                          Verify OTP
                        </span>
                      </div>
                      <div className="flex-1 mx-2 h-0.5 bg-slate-200">
                        <div
                          className="h-full bg-[#334155] transition-all duration-300"
                          style={{
                            width: signupStep === "personal" ? "100%" : "0%",
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            signupStep === "personal"
                              ? "bg-[#334155] text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          3
                        </span>
                        <span
                          className={`text-xs ${
                            signupStep === "personal"
                              ? "font-semibold text-slate-900"
                              : "text-slate-500"
                          }`}
                        >
                          Profile
                        </span>
                      </div>
                    </div>

                    {/* Hidden inputs for submission/validation */}
                    <input type="hidden" {...signupForm.register("email")} />

                    {signupStep === "credentials" && (
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="signupEmail"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email Address *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              id="signupEmail"
                              {...signupEmailField}
                              className={`w-full rounded-lg border p-3 pr-10 text-black focus:ring-2 focus:border-transparent ${
                                emailDomainSuggestion
                                  ? "border-amber-400 focus:ring-amber-500"
                                  : showSignupEmailAvailability &&
                                    signupEmailAvailability.status === "available"
                                  ? "border-green-400 focus:ring-green-500"
                                  : showSignupEmailAvailability &&
                                      signupEmailAvailability.status === "error"
                                    ? "border-red-300 focus:ring-red-500"
                                    : showSignupEmailIncomplete
                                      ? "border-amber-300 focus:ring-amber-500"
                                      : "border-gray-300 focus:ring-[#489FB5]"
                              }`}
                              placeholder="Enter your email"
                              disabled={isLoading}
                              onChange={(e) => {
                                signupEmailField.onChange(e);
                                handleSignupEmailChange(e.target.value);
                              }}
                              onBlur={(e) => {
                                signupEmailField.onBlur(e);
                                void handleSignupEmailBlur(e.target.value);
                              }}
                            />
                            {showSignupEmailAvailability &&
                              signupEmailAvailability.status === "checking" && (
                                <FiLoader className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-gray-400" />
                              )}
                            {showSignupEmailAvailability &&
                              !emailDomainSuggestion &&
                              signupEmailAvailability.status ===
                                "available" && (
                                <FiCheckCircle className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
                              )}
                            {((showSignupEmailAvailability &&
                              signupEmailAvailability.status === "error") ||
                              emailDomainSuggestion) && (
                              <FiAlertCircle className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500" />
                            )}
                            {showSignupEmailIncomplete && !emailDomainSuggestion && (
                              <FiAlertCircle className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500" />
                            )}
                          </div>

                          {/* Email typo suggestion interactive chip */}
                          {emailDomainSuggestion && (
                            <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-2.5 text-xs text-amber-900 animate-in fade-in duration-150 shadow-sm">
                              <div className="flex items-center gap-2 min-w-0">
                                <FiAlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                                <span className="truncate">
                                  Did you mean{" "}
                                  <strong className="underline font-semibold text-amber-950">
                                    {emailDomainSuggestion.suggested}
                                  </strong>
                                  ?
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleApplyEmailSuggestion(
                                    emailDomainSuggestion.suggested,
                                  )
                                }
                                className="px-2.5 py-1 bg-[#334155] text-white rounded-lg text-[11px] font-semibold hover:bg-[#1E293B] transition-colors flex-shrink-0 shadow-sm"
                              >
                                Fix email
                              </button>
                            </div>
                          )}

                          {signupForm.formState.errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {signupForm.formState.errors.email.message}
                            </p>
                          )}
                          {!signupForm.formState.errors.email &&
                            !emailDomainSuggestion &&
                            showSignupEmailAvailability &&
                            signupEmailAvailability.status === "checking" && (
                              <p className="mt-1 text-sm text-gray-500">
                                Checking email...
                              </p>
                            )}
                          {!signupForm.formState.errors.email &&
                            !emailDomainSuggestion &&
                            showSignupEmailAvailability &&
                            signupEmailAvailability.status === "available" && (
                              <p className="mt-1 text-sm text-green-600">
                                Email is available.
                              </p>
                            )}
                          {!signupForm.formState.errors.email &&
                            !emailDomainSuggestion &&
                            showSignupEmailAvailability &&
                            signupEmailAvailability.status === "error" &&
                            signupEmailAvailability.message && (
                              <p className="mt-1 text-sm text-red-500">
                                {signupEmailAvailability.message}
                              </p>
                            )}
                          {!emailDomainSuggestion &&
                            showSignupEmailIncomplete &&
                            signupEmailAvailability.message && (
                              <p className="mt-1 text-sm text-amber-600">
                                {signupEmailAvailability.message}
                              </p>
                            )}
                        </div>

                        <div>
                          <label
                            htmlFor="signupPassword"
                            title="At least 8 characters with letters and numbers"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="signupPassword"
                              {...signupForm.register("password")}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#489FB5] focus:border-transparent pr-10 text-black"
                              placeholder="Create a password"
                              disabled={isLoading}
                              onChange={(e) => {
                                signupForm.setValue("password", e.target.value);
                                const rules = validatePasswordRules(
                                  e.target.value,
                                );
                                setPasswordRules(rules);
                              }}
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
                            <p className="text-red-500 text-sm mt-1">
                              {signupForm.formState.errors.password.message}
                            </p>
                          )}

                          {/* Password Rules Display */}
                          <div className="mt-3 space-y-2">
                            <PasswordRulesDisplay rules={passwordRules} />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="confirmPassword"
                            title="Must match password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              {...signupForm.register("confirmPassword")}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#489FB5] focus:border-transparent pr-10 text-black"
                              placeholder="Confirm your password"
                              disabled={isLoading}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              disabled={isLoading}
                            >
                              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                          {signupForm.formState.errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                              {
                                signupForm.formState.errors.confirmPassword
                                  .message
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {signupStep === "otp" && (
                      <div className="space-y-4">
                        <div className="text-center space-y-1">
                          <h3 className="text-lg font-bold text-slate-900">
                            Verify your email
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600">
                            Enter the 6-digit code sent to{" "}
                            <span className="font-semibold text-slate-800">
                              {signupEmail}
                            </span>
                          </p>
                        </div>

                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          disabled={isLoading}
                          autoFocus
                        />

                        <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                          <button
                            type="button"
                            className="text-slate-600 hover:text-slate-900 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleSignupBackToEmail}
                            disabled={isLoading}
                          >
                            Change email
                          </button>

                          <button
                            type="button"
                            className="text-[#489FB5] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <div className="space-y-4">
                        {/* Verified Email Confirmation Badge */}
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                          <div className="flex items-center gap-2 text-slate-700 min-w-0">
                            <FiCheckCircle className="h-4 w-4 text-[#489FB5] flex-shrink-0" />
                            <span className="truncate">
                              Verified:{" "}
                              <strong className="text-slate-900">
                                {signupEmail}
                              </strong>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleSignupBackToEmail}
                            className="text-[#489FB5] hover:underline font-medium ml-2 flex-shrink-0"
                            disabled={isLoading}
                          >
                            Change
                          </button>
                        </div>

                        <div>
                          <label
                            htmlFor="signupName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Name *
                          </label>
                          <input
                            type="text"
                            id="signupName"
                            {...signupForm.register("name")}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#489FB5] focus:border-transparent text-black"
                            placeholder="Enter your name"
                            disabled={isLoading}
                          />
                          {signupForm.formState.errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {signupForm.formState.errors.name.message}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            Use your real name or business name to gain client trust.
                          </p>
                        </div>

                        <div>
                          <label
                            htmlFor="signupUsername"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Username *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="signupUsername"
                              {...signupUsernameField}
                              className={`w-full rounded-lg border p-3 pr-10 text-black focus:ring-2 focus:border-transparent ${
                                showSignupUsernameAvailability &&
                                signupUsernameAvailability.status === "available"
                                  ? "border-green-400 focus:ring-green-500"
                                  : showSignupUsernameAvailability &&
                                      signupUsernameAvailability.status === "error"
                                    ? "border-red-300 focus:ring-red-500"
                                    : showSignupUsernameIncomplete
                                      ? "border-amber-300 focus:ring-amber-500"
                                      : "border-gray-300 focus:ring-[#489FB5]"
                              }`}
                              placeholder="Choose a username"
                              disabled={isLoading}
                              onChange={(e) => {
                                signupUsernameField.onChange(e);
                                handleSignupUsernameChange(e.target.value);
                              }}
                              onBlur={(e) => {
                                signupUsernameField.onBlur(e);
                                void handleSignupUsernameBlur(e.target.value);
                              }}
                            />
                            {showSignupUsernameAvailability &&
                              signupUsernameAvailability.status === "checking" && (
                                <FiLoader className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-gray-400" />
                              )}
                            {showSignupUsernameAvailability &&
                              signupUsernameAvailability.status === "available" && (
                                <FiCheckCircle className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
                              )}
                            {showSignupUsernameAvailability &&
                              signupUsernameAvailability.status === "error" && (
                                <FiAlertCircle className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
                              )}
                            {showSignupUsernameIncomplete && (
                              <FiAlertCircle className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500" />
                            )}
                          </div>
                          {signupForm.formState.errors.username && (
                            <p className="text-red-500 text-sm mt-1">
                              {signupForm.formState.errors.username.message}
                            </p>
                          )}
                          {!signupForm.formState.errors.username &&
                            showSignupUsernameAvailability &&
                            signupUsernameAvailability.status === "checking" && (
                              <p className="mt-1 text-sm text-gray-500">
                                Checking username...
                              </p>
                            )}
                          {!signupForm.formState.errors.username &&
                            showSignupUsernameAvailability &&
                            signupUsernameAvailability.status === "available" && (
                              <p className="mt-1 text-sm text-green-600">
                                Username is available.
                              </p>
                            )}
                          {!signupForm.formState.errors.username &&
                            showSignupUsernameAvailability &&
                            signupUsernameAvailability.status === "error" &&
                            signupUsernameAvailability.message && (
                              <p className="mt-1 text-sm text-red-500">
                                {signupUsernameAvailability.message}
                              </p>
                            )}
                          {showSignupUsernameIncomplete &&
                            signupUsernameAvailability.message && (
                              <p className="mt-1 text-sm text-amber-600">
                                {signupUsernameAvailability.message}
                              </p>
                            )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      {signupStep === "personal" && (
                        <button
                          type="button"
                          className="w-1/3 border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          onClick={() => setSignupStep("credentials")}
                          disabled={isLoading}
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        className={`${
                          signupStep === "credentials" || signupStep === "otp"
                            ? "w-full"
                            : "w-2/3"
                        } bg-[#334155] text-white p-3 rounded-lg hover:bg-[#1E293B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
                        disabled={
                          isLoading ||
                          (signupStep === "credentials" && isCheckingEmail) ||
                          (signupStep === "personal" && isCheckingUsername) ||
                          (signupStep === "otp" &&
                            otp.replace(/\D/g, "").length !== 6)
                        }
                      >
                        {signupStep === "otp"
                          ? isLoading
                            ? "Verifying..."
                            : "Verify Code"
                          : signupStep === "personal"
                            ? isLoading
                              ? "Creating Account..."
                              : isCheckingUsername
                                ? "Checking..."
                                : "Create Account"
                            : signupStep === "credentials" && isCheckingEmail
                              ? "Checking..."
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
            <a href="/terms-of-service" className="underline">
              Terms of Service
            </a>{" "}
            and to occasionally receive emails from us. Please read our{" "}
            <a href="/privacy-policy" className="underline">
              Privacy Policy
            </a>{" "}
            to learn how we use your personal data.
          </p>
        </div>
      </div>
    </div>
  );
}
