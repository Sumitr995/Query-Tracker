/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInterceptor from "../utils/axiosInterceptor.js";
import { toast } from "../components/notification.js";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// --- NEW COMPONENT: Glowing Circular Progress Ring ---
const CircularTimer = ({ value, max, label }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Calculate offset based on value. If max is 0, default to 0 to avoid NaN.
  const strokeDashoffset = max > 0 ? circumference - (value / max) * circumference : 0;

  return (
    <div className="relative flex flex-col items-center justify-center group">
      <svg className="w-28 h-28 transform -rotate-90">
        {/* Background Track */}
        <circle 
          cx="56" cy="56" r={radius} 
          stroke="currentColor" strokeWidth="2" fill="transparent" 
          className="text-blue-500/10" 
        />
        {/* Animated Progress Ring */}
        <motion.circle
          cx="56" cy="56" r={radius}
          stroke="currentColor" strokeWidth="4" fill="transparent"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-blue-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"
          strokeLinecap="round"
        />
      </svg>
      {/* Inner Numbers */}
      <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-3xl font-black text-white font-tech tracking-tighter">
          {value.toString().padStart(2, '0')}
        </div>
      </div>
      {/* Label */}
      <div className="absolute bottom-1 text-[9px] font-black uppercase tracking-[0.3em] text-blue-500/80 bg-slate-900/80 px-2 py-0.5 rounded border border-blue-500/20">
        {label}
      </div>
    </div>
  );
};

// --- NEW HOOK: Fake Telemetry Data for HUD effect ---
function useTelemetry() {
  const [telemetry, setTelemetry] = useState("0x000000");
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry("0x" + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0'));
    }, 150);
    return () => clearInterval(interval);
  }, []);
  return telemetry;
}

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const telemetryData = useTelemetry();

  /** ================== Matrix Rain Effect ================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const letters = "0101QUERYTRACKER@#$";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)"; // Dark slate fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        // Match the blue Hacker theme
        ctx.fillStyle = Math.random() > 0.95 ? "#ffffff" : "#10b981"; 
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  /** ================== Countdown Logic ================== */
  useEffect(() => {
    const hackathonDate = new Date(2026, 2, 23, 9, 0, 0); // March 23, 2026

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = hackathonDate.getTime() - now.getTime();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  /** ================== Handlers ================== */
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInterceptor.post(
        "/user/login",
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Login Successful");
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userRole", res.data.role);
        navigate("/user/home");
      } else {
        toast.warn(res.data.message || "Login failed");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
      if (error.response && error.response.status === 401) {
        navigate("/user/login");
      }
    } finally {
      setLoading(false);
    }
  };

  /** ================== UI ================== */
  return (
    <div className="h-screen bg-slate-900 flex flex-col lg:flex-row overflow-hidden selection:bg-blue-500 selection:text-white font-sans text-[11px]">
      
      {/* Left: Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 overflow-hidden">
        <div className="w-full max-w-md scale-90 sm:scale-100 origin-center">
          
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-900 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <span className="text-2xl font-black text-blue-400 font-tech animate-pulse">QT</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-1 italic font-tech">ACCESS COMMAND</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">Enter credentials to initialize session</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute  top-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

            <form onSubmit={handleSubmit} className="space-y-6 ">
              <InputField
                label="Identifier / Email" id="email" name="email" type="email"
                value={formData.email} onChange={handleChange} placeholder="system@querytracker.io"
              />
              <InputField
                label="Security Key" id="password" name="password" type={showPassword ? "text" : "password"}
                value={formData.password} onChange={handleChange} placeholder="••••••••••••"
                toggleable onToggle={() => setShowPassword(!showPassword)} show={showPassword}
              />
              <motion.button
                type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-blue-900 hover:bg-blue-500 text-white font-black py-4 rounded-2xl uppercase tracking-widest transition-all shadow-lg flex items-center justify-center disabled:opacity-50 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center">
                  {loading ? <><span className="w-4 h-4 border-2 border-transparent border-t-current border-r-current rounded-full animate-spin mr-2"></span>Decoding...</> : "Execute Login"}
                </span>
              </motion.button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                New Register?{" "}
                <Link to="/user/register" className="text-blue-500 font-black hover:underline decoration-2 underline-offset-4">
                  Register Panel
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Hackathon Sci-Fi HUD Countdown */}
      <div className="hidden lg:flex flex-1 relative flex-col items-center justify-center text-white p-8 bg-slate-900 overflow-hidden">
        
        {/* Matrix Rain Background */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full opacity-40 pointer-events-none"></canvas>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.9)_100%)] z-10 pointer-events-none"></div>

        {/* HUD UI Layer */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative z-20 w-full max-w-xl">
          
          {/* Top HUD Frame */}
          <div className="flex justify-between items-end border-b border-blue-500/30 pb-2 mb-8">
            <div className="space-y-1">
              <div className="text-[10px] font-black text-blue-500 tracking-[0.4em] uppercase font-tech flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Target Deployment
              </div>
              <div className="text-xs font-tech text-slate-500 tracking-widest uppercase">System Lock Lift in:</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-blue-500/70 font-tech tracking-widest">SYNC: {telemetryData}</div>
              <div className="text-[8px] text-slate-500 font-tech tracking-widest uppercase">SECURE UPLINK ACTIVE</div>
            </div>
          </div>

          {/* Glowing Circular Counters */}
          <div className="flex space-x-4 justify-center bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/10 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
            {/* Days assume a rough max of 30 for the ring progress, adjust if your hackathon is further out */}
            <CircularTimer value={timeLeft.days} max={30} label="Days" />
            <CircularTimer value={timeLeft.hours} max={24} label="Hours" />
            <CircularTimer value={timeLeft.minutes} max={60} label="Mins" />
            <CircularTimer value={timeLeft.seconds} max={60} label="Secs" />
          </div>

          {/* Bottom HUD Frame */}
          <div className="mt-8 pt-4 border-t border-blue-500/30 flex justify-between items-start">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i} 
                  animate={{ height: [4, Math.random() * 16 + 4, 4] }} 
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "linear" }}
                  className="w-1.5 bg-blue-500/50"
                />
              ))}
            </div>
            <div className="text-[9px] font-tech text-blue-500 tracking-[0.5em] uppercase opacity-60">
              Awaiting credentials...
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

// Sub-component for inputs to keep the main render clean
const InputField = ({ label, id, name, type, value, onChange, placeholder, toggleable, onToggle, show }) => (
  <div className="space-y-3 font-bold uppercase tracking-widest relative">
    <label htmlFor={id} className="block text-slate-500 text-[10px]">
      {label}
    </label>
    <div className="relative">
      <input
        type={type} id={id} name={name} value={value} onChange={onChange} placeholder={placeholder} required
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-300"
      />
      {toggleable && (
        <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors">
          {show ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
        </button>
      )}
    </div>
  </div>
);

export default Login;