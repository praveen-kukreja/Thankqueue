"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession, signIn } from "next-auth/react";
import CustomUserSearch from "./searchbox";

// Define the User type to match CustomUserSearch component
type User = {
  employee_id: number;
  employee_name: string;
  username: string;
};

export default function ThankYou() {
  return (
    <SessionProvider>
      <ThankYouForm />
    </SessionProvider>
  );
}

export function ThankYouForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [helper, setHelper] = useState("");
  const [description, setDescription] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({ helper: "", description: "", apiError: "" });


  const validateForm = () => {
    let isValid = true;
    const newErrors = { helper: "", description: "", apiError: "" };

    if (!helper.trim()) {
      newErrors.helper = "Helper's name is required.";
      isValid = false;
    }

    if (description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const thankYouData = {
        helper: helper.trim(),
        description: description.trim(),
      };

      const response = await fetch("/api/thankyou", {
        method: "POST",
        body: JSON.stringify({ session, thankYouData }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (!response.ok) {
        setErrors((prev) => ({ ...prev, apiError: result.message || "An error occurred. Please try again." }));
        return;
      }

      setFormSubmitted(true);

      // Clear form
      setHelper("");
      setDescription("");
      setErrors({ helper: "", description: "", apiError: "" });
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors((prev) => ({ ...prev, apiError: "Network error. Please try again later." }));
    }
  };

  const handleUserSelect = (user: User) => {
    setHelper(user.employee_name);
    setErrors((prev) => ({ ...prev, helper: "" })); // Clear helper error if user is selected
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg">You need to be signed in to view this page.</p>
        <button
          onClick={() => signIn()}
          className="mt-4 px-4 py-2 bg-thank-you-gradient text-white rounded font-semibold tracking-wide"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold mb-4">Send a Thank You</h1>

      {formSubmitted && (
        <p className="text-green-500 bg-green-100 border border-green-500 rounded px-4 py-2">
          Thank you submitted successfully!
        </p>
      )}

      {errors.apiError && (
        <p className="text-red-500 bg-red-100 border border-red-500 rounded px-4 py-2">
          {errors.apiError}
        </p>
      )}

      <form className="flex flex-col space-y-4 w-1/2" onSubmit={handleSubmit}>
        <div>
          <label className="text-lg">Helper's Name:</label>
          <CustomUserSearch onUserSelect={handleUserSelect} />
          {errors.helper && <p className="text-red-500 text-sm mt-1">{errors.helper}</p>}
        </div>

        <div>
          <label className="text-lg">Describe the Help:</label>
          <textarea
            style={{ color: "black" }}
            name="description"
            className={`border px-4 py-2 rounded w-full dark:text-white ${
              errors.description ? "border-red-500" : ""
            }`}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              setFormSubmitted(false)
              setErrors((prev) => ({ ...prev, description: "" }));
            }
            }
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-thank-you-gradient text-white rounded font-semibold tracking-wide"
          style={{ cursor: "pointer" }}
        >
          Submit
        </button>
      </form>

      <h1 className="text-3xl font-bold mb-4">Approve a Thank Request?</h1>
      <button
        onClick={() => router.push("/thank-you/approve-requests")}
        className="mt-4 px-4 py-2 bg-thank-you-gradient text-white rounded tracking-wide"
      >
        Take me to pending thank requests
      </button>
    </div>
  );
}
