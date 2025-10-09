"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaGoogle, FaApple } from "react-icons/fa";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiSearch,
} from "react-icons/fi";

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
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

// Location data types
interface Country {
  name: string;
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

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Watch form values
  const watchedCountry = watch("country");
  const watchedState = watch("state");
  const watchedCity = watch("city");

  // API Functions
  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries"
      );
      const data = await response.json();
      if (data.error === false && data.data) {
        setCountries(data.data);
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
        }
      );
      const data = await response.json();
      if (data.error === false && data.data) {
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
        }
      );
      const data = await response.json();
      if (data.error === false && data.data) {
        setCities(data.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  // Load countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle country selection
  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setValue("country", country);
    setCountryDropdownOpen(false);
    setCountrySearch("");

    // Reset state and city
    setSelectedState("");
    setSelectedCity("");
    setValue("state", "");
    setValue("city", "");
    setStates([]);
    setCities([]);

    // Fetch states for selected country
    fetchStates(country);
  };

  // Handle state selection
  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setValue("state", state);
    setStateDropdownOpen(false);
    setStateSearch("");

    // Reset city
    setSelectedCity("");
    setValue("city", "");
    setCities([]);

    // Fetch cities for selected state
    fetchCities(selectedCountry, state);
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setValue("city", city);
    setCityDropdownOpen(false);
    setCitySearch("");
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn("apple", { callbackUrl: "/" });
    } catch (error) {
      setError("Apple sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || result.message || "Registration failed");
        return;
      }

      setSuccess("Account created successfully! You can now sign in.");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (error) {
      console.error("Signup form error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="/auth/signin"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              sign in to your existing account
            </a>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Hidden inputs for form validation */}
          <input type="hidden" {...register("country")} />
          <input type="hidden" {...register("state")} />
          <input type="hidden" {...register("city")} />
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
              <FiAlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md flex items-center">
              <FiCheckCircle className="w-5 h-5 mr-2" />
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Surname
                </label>
                <input
                  {...register("surname")}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Surname"
                />
                {errors.surname && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.surname.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="middleName"
                className="block text-sm font-medium text-gray-700"
              >
                Middle Name (Optional)
              </label>
              <input
                {...register("middleName")}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Middle name"
              />
              {errors.middleName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.middleName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number (Optional)
              </label>
              <input
                {...register("phone")}
                type="tel"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between"
                  >
                    <span
                      className={
                        selectedCountry ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {selectedCountry || "Select Country"}
                    </span>
                    <FiChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {countryDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search countries..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {loadingCountries ? (
                          <div className="p-3 text-center text-gray-500">
                            Loading countries...
                          </div>
                        ) : (
                          countries
                            .filter((country) =>
                              country.name
                                .toLowerCase()
                                .includes(countrySearch.toLowerCase())
                            )
                            .map((country) => (
                              <button
                                key={country.iso2}
                                type="button"
                                onClick={() =>
                                  handleCountrySelect(country.name)
                                }
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                              >
                                {country.name}
                              </button>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* State Dropdown */}
              <div className="relative dropdown-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
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
                        selectedState ? "text-gray-900" : "text-gray-500"
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
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search states..."
                            value={stateSearch}
                            onChange={(e) => setStateSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {loadingStates ? (
                          <div className="p-3 text-center text-gray-500">
                            Loading states...
                          </div>
                        ) : (
                          states
                            .filter((state) =>
                              state.name
                                .toLowerCase()
                                .includes(stateSearch.toLowerCase())
                            )
                            .map((state) => (
                              <button
                                key={state.state_code}
                                type="button"
                                onClick={() => handleStateSelect(state.name)}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                              >
                                {state.name}
                              </button>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.state.message}
                  </p>
                )}
              </div>

              {/* City Dropdown */}
              <div className="relative dropdown-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      selectedState && setCityDropdownOpen(!cityDropdownOpen)
                    }
                    disabled={!selectedState}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-teal-500 focus:border-teal-500 flex items-center justify-between disabled:bg-gray-50 disabled:cursor-not-allowed"
                  >
                    <span
                      className={
                        selectedCity ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {selectedCity ||
                        (selectedState ? "Select City" : "Select State First")}
                    </span>
                    <FiChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {cityDropdownOpen && selectedState && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search cities..."
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {loadingCities ? (
                          <div className="p-3 text-center text-gray-500">
                            Loading cities...
                          </div>
                        ) : (
                          cities
                            .filter((city) =>
                              city.name
                                .toLowerCase()
                                .includes(citySearch.toLowerCase())
                            )
                            .map((city, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleCitySelect(city.name)}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                              >
                                {city.name}
                              </button>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGoogle className="w-5 h-5" />
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                onClick={handleAppleSignIn}
                disabled={isLoading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaApple className="w-5 h-5" />
                <span className="ml-2">Apple</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
