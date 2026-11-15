import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User, CheckCircle2, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminSwitch?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAdminSwitch }) => {
  if (!isOpen) return null;

  const {
    loginCustomer,
    registerCustomer,
    requestPasswordResetOtp,
    verifyOtpAndResetPassword,
  } = useAuth();
  const { language, t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verifyOtp'>('login');

  // Login inputs
  const [loginIdentifier, setLoginIdentifier] = useState('01711002233');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('01');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot password inputs
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Status feedback
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = loginCustomer(loginIdentifier, loginPassword);
    if (res.success) {
      onClose();
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (regPassword !== regConfirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (regPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    const cleanPhone = regPhone.replace(/\s+/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid 11-digit Bangladesh mobile number (e.g., 01341422732).',
      });
      return;
    }

    const res = registerCustomer({
      fullName: regName,
      email: regEmail,
      mobileNumber: cleanPhone,
      password: regPassword,
    });

    if (res.success) {
      onClose();
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!resetIdentifier.trim()) {
      setMessage({ type: 'error', text: 'Please enter your registered email or mobile number.' });
      return;
    }

    const res = requestPasswordResetOtp(resetIdentifier);
    if (res.code) {
      setDemoCodeHint(res.code);
      setOtpCode(res.code); // auto fill for smooth review
    }
    setMode('verifyOtp');
    setMessage({ type: 'success', text: res.message });
  };

  const handleVerifyOtpAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    const res = verifyOtpAndResetPassword(resetIdentifier, otpCode, newPassword);
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        setMode('login');
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  };

  // Quick Demo account fill
  const handleQuickCustomer = () => {
    setLoginIdentifier('01711002233');
    setLoginPassword('password123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111111] text-white p-6 text-center relative border-b border-zinc-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] p-0.5 mx-auto mb-2 overflow-hidden bg-black">
            <img
              src="/public/assets/aistudio/image_fe4b7042.png"
              alt="MNS Brand"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <h3 className="font-serif text-xl font-bold tracking-wide">
            {mode === 'login' && 'Sign in to MNS Fashion'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'verifyOtp' && 'Enter Verification Code'}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {mode === 'login' && 'Access order history, tracking & express checkout'}
            {mode === 'register' && 'Join MNS for bespoke luxury collections & privileges'}
            {mode === 'forgot' && 'We will send a 6-digit OTP code to your device'}
            {mode === 'verifyOtp' && 'Verify your identity and set a new password'}
          </p>
        </div>

        {/* Tab switch for Login / Register */}
        {(mode === 'login' || mode === 'register') && (
          <div className="flex border-b border-zinc-200 bg-zinc-50 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => {
                setMode('login');
                setMessage(null);
              }}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-zinc-950 border-b-2 border-[#D4AF37]'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Customer Login
            </button>
            <button
              onClick={() => {
                setMode('register');
                setMessage(null);
              }}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-zinc-950 border-b-2 border-[#D4AF37]'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              New Registration
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs">
          {message && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                message.type === 'error'
                  ? 'bg-rose-50 border border-rose-200 text-rose-700'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-zinc-700 font-semibold block mb-1">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="01711002233 or name@example.com"
                    className="w-full text-xs p-3 pl-9 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-zinc-700 font-semibold">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setMessage(null);
                    }}
                    className="text-[11px] text-[#B89628] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-3 pl-9 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-600">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                  <span>Remember this device</span>
                </label>

                <button
                  type="button"
                  onClick={handleQuickCustomer}
                  className="text-[#B89628] hover:underline font-semibold"
                >
                  Fill Demo User
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-[#111111] hover:bg-zinc-800 text-[#D4AF37] text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sign In
              </button>

              {onAdminSwitch && (
                <div className="pt-2 text-center border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onAdminSwitch();
                    }}
                    className="text-[11px] text-zinc-500 hover:text-zinc-900"
                  >
                    Need Staff Access? <span className="font-bold text-[#B89628]">Open Admin Console</span>
                  </button>
                </div>
              )}
            </form>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="text-zinc-700 font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Shakil Mahmud"
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white"
                />
              </div>

              <div>
                <label className="text-zinc-700 font-semibold block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="shakil@example.com"
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white"
                />
              </div>

              <div>
                <label className="text-zinc-700 font-semibold block mb-1">
                  Mobile Number (BD) *
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="01341422732"
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-700 font-semibold block mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-700 font-semibold block mb-1">Confirm *</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat"
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#D4AF37] hover:bg-[#B89628] text-[#111111] text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Create Account
              </button>
            </form>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="text-zinc-700 font-semibold block mb-1">
                  Registered Email or Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  placeholder="01711002233 or name@example.com"
                  className="w-full text-xs p-3 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#111111] hover:bg-zinc-800 text-[#D4AF37] text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
              >
                Send 6-Digit Verification Code
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setMessage(null);
                }}
                className="w-full text-center text-xs text-zinc-500 hover:text-zinc-900"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* MODE: VERIFY OTP AND NEW PASSWORD */}
          {mode === 'verifyOtp' && (
            <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
              {demoCodeHint && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800">
                  Demo SMS code dispatched: <span className="font-mono font-bold">{demoCodeHint}</span>
                </div>
              )}

              <div>
                <label className="text-zinc-700 font-semibold block mb-1">
                  6-Digit Verification Code (OTP) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center text-lg tracking-widest font-mono p-2.5 rounded-lg border border-zinc-300 bg-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-700 font-semibold block mb-1">New Password *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-zinc-700 font-semibold block mb-1">Confirm New *</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat"
                    className="w-full text-xs p-2.5 rounded-lg border border-zinc-300 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D4AF37] hover:bg-[#B89628] text-[#111111] text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
              >
                Update Password & Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
