import React, { useState } from "react";
import { X, Mail, Lock, User, MapPin, Eye, EyeOff, Loader2, ArrowLeft, RotateCw } from "lucide-react";

// Reusable input field to avoid repeating the same Tailwind block 5 times
function InputField({ icon: Icon, label, ...inputProps }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          {...inputProps}
          className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
        />
      </div>
    </div>
  );
}

// Helper to build the user object from API response
function buildUser(apiUser, formData) {
  return {
    id: apiUser.id || apiUser._id,
    name: apiUser.name || formData.name,
    email: apiUser.email || formData.email,
    location: formData.location?.trim() || "Neighborhood Member",
    reliabilityScore: "100%",
    sellerRating: 5.0,
    sellerTrades: 0,
  };
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", location: "", password: "" });

  if (!isOpen) return null;

  const resetAndClose = () => {
    setStep("form");
    setOtp("");
    setError("");
    setSuccessMsg("");
    setLoading(false);
    onClose();
  };

  const updateField = (field, value) => setFormData({ ...formData, [field]: value });

  // POST helper to reduce repeated fetch boilerplate
  const postAPI = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { res, data };
  };

  // Handle Sign In or Sign Up form submission
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isSignUp) {
        const { res, data } = await postAPI("/api/auth/register", {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });
        if (!res.ok) throw new Error(data.message || "Registration failed");
        setSuccessMsg(data.message || "OTP sent to your email!");
        setStep("otp");
      } else {
        const { res, data } = await postAPI("/api/auth/login", {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });
        if (!res.ok) {
          // Unverified account — let them enter OTP
          if (res.status === 403) { setError(data.message); setStep("otp"); return; }
          throw new Error(data.message || "Login failed");
        }
        if (data.token) localStorage.setItem("token", data.token);
        onAuthSuccess(buildUser(data.user, formData));
        resetAndClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) { setError("Please enter the 6-digit code"); return; }
    setError("");
    setLoading(true);

    try {
      const { res, data } = await postAPI("/api/auth/verify-otp", {
        email: formData.email.trim().toLowerCase(),
        otp: otp.trim(),
      });
      if (!res.ok) throw new Error(data.message || "Invalid or expired OTP");
      if (data.token) localStorage.setItem("token", data.token);
      onAuthSuccess(buildUser(data.user, formData));
      resetAndClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const { res, data } = await postAPI("/api/auth/register", {
        name: formData.name.trim() || "User",
        email: formData.email.trim().toLowerCase(),
        password: formData.password || "TempPassword123!",
      });
      if (!res.ok) throw new Error(data.message || "Could not resend OTP");
      setSuccessMsg("Fresh OTP sent to your email!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Common button style
  const btnPrimary = "w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={resetAndClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-10">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {step === "otp" ? "Verify Email" : isSignUp ? "Create Account" : "Welcome Back"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {step === "otp"
                ? "Enter the 6-digit code sent to your email"
                : isSignUp
                  ? "Join NearNest to buy, rent, and share nearby"
                  : "Sign in to manage your listings"}
            </p>
          </div>
          <button onClick={resetAndClose} className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sign In / Sign Up Toggle */}
        {step === "form" && (
          <div className="p-4 pb-0">
            <div className="grid grid-cols-2 p-1 bg-gray-100/80 dark:bg-gray-700/80 rounded-2xl">
              {["Sign In", "Sign Up"].map((label, i) => {
                const active = i === 0 ? !isSignUp : isSignUp;
                return (
                  <button
                    key={label}
                    onClick={() => { setIsSignUp(i === 1); setError(""); setSuccessMsg(""); }}
                    className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${active ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs" : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error / Success Alerts */}
        <div className="px-6 pt-3">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 rounded-xl text-xs text-red-700 dark:text-red-300">
              • {error}
            </div>
          )}
          {successMsg && !error && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
              ✓ {successMsg}
            </div>
          )}
        </div>

        {/* STEP 1: Login / Register Form */}
        {step === "form" ? (
          <form onSubmit={handleSubmitForm} className="p-6 pt-3 space-y-3.5 text-sm">
            {isSignUp && (
              <InputField icon={User} label="Full Name *" type="text" required placeholder="e.g. Aarav Sharma"
                value={formData.name} onChange={(e) => updateField("name", e.target.value)} />
            )}

            <InputField icon={Mail} label="Email Address *" type="email" required placeholder="you@example.com"
              value={formData.email} onChange={(e) => updateField("email", e.target.value)} />

            {isSignUp && (
              <InputField icon={MapPin} label="Your Neighborhood / Area" type="text" placeholder="e.g. Hostels, Block A"
                value={formData.location} onChange={(e) => updateField("location", e.target.value)} />
            )}

            {/* Password with show/hide toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"} required placeholder="••••••••"
                  value={formData.password} onChange={(e) => updateField("password", e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className={btnPrimary}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>{isSignUp ? "Sending OTP..." : "Signing In..."}</span></>
                : <span>{isSignUp ? "Continue with Email OTP" : "Sign In to NearNest"}</span>}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="p-6 pt-3 space-y-4 text-sm">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200">
              Code sent to: <strong className="text-gray-900 dark:text-white">{formData.email}</strong>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1.5">6-Digit Verification Code</label>
              <input type="text" maxLength={6} required autoFocus value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="123456"
                className="w-full py-3 bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white tracking-widest text-center font-mono font-bold text-lg focus:outline-none focus:border-emerald-500 transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">Expires in 10 minutes.</p>
            </div>

            <button type="submit" disabled={loading || otp.length < 6} className={btnPrimary}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Verifying...</span></>
                : <span>Verify & Complete Registration</span>}
            </button>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button type="button" onClick={() => { setStep("form"); setError(""); }}
                className="inline-flex items-center space-x-1 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" /><span>Change email</span>
              </button>
              <button type="button" onClick={handleResendOtp} disabled={loading}
                className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer disabled:opacity-50">
                <RotateCw className="w-3.5 h-3.5" /><span>Resend OTP</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="p-3.5 bg-gray-50/70 dark:bg-gray-900/70 border-t border-gray-100 dark:border-gray-700 text-center text-[11px] text-gray-400">
          Hyperlocal Trust • Zero Spam • Campus & Neighborhood
        </div>
      </div>
    </div>
  );
}
