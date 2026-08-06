/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInterceptor from "../utils/axiosInterceptor";
import { toast } from "../components/notification.js";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// --- CUSTOM HOOK: Terminal Typing Effect ---
function useTerminalBootSequence() {
  const lines = [
    "Initializing secure environment...",
    "Establishing VPN tunnel...",
    "Deploying CI/CD pipeline protocols...",
    "Running Trivy container scan...",
    "[OK] Zero vulnerabilities detected.",
    "[OK] Buffer overflow protections active.",
    "Bypassing mainframe firewall...",
    "Access Granted.",
    "Awaiting new user protocol..."
  ];

  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= lines.length) return;

    const line = lines[lineIndex];
    if (charIndex < line.length) {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + line[charIndex]);
        setCharIndex((c) => c + 1);
      }, Math.random() * 40 + 20); // Variable typing speed like a real human/machine
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, line]);
        setCurrentLine("");
        setCharIndex(0);
        setLineIndex((l) => l + 1);
      }, 600); // Pause before next line
      return () => clearTimeout(timeout);
    }
  }, [charIndex, lineIndex]);

  return { displayedLines, currentLine, isComplete: lineIndex >= lines.length };
}

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    teamName: "",
    contact: "",
    password: "",
    confirmPassword: "",
    isAdminRequested: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const terminal = useTerminalBootSequence();

  // --- UPGRADED MATRIX RAIN EFFECT ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Handle resize
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Characters: Katakana + Latin + Numerals + Symbols
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const drops = Array(columns).fill(1);

    function draw() {
      // Dark slate background with opacity for the fading trail effect
      ctx.fillStyle = "rgba(15, 23, 42, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        
        // 5% chance the lead character is bright white, otherwise hacker green
        if (Math.random() > 0.95) {
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.fillStyle = "#10b981"; // Tailwind Emerald-500 (Classic Hacker Green)
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly to create staggered rain
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 33); // ~30fps
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.teamName.trim()) newErrors.teamName = "Team Name is required";
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required";
    } else if (!/^[0-9]{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact must be 10 digits";
    }
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await axiosInterceptor.post("/user/register", formData);
      if (res.status === 201 || res.data?.status === "success") {
        toast.success(res.data.message);
        navigate("/user/login");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error(err.response.data?.message || "Conflict: Network channel busy.");
      } else {
        toast.error(err.response?.data?.message || "Protocol Failure: Sync rejected.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row selection:bg-emerald-500 selection:text-white overflow-hidden bg-slate-900 font-sans text-[11px]">
      
      {/* LEFT SIDE: Registration Form */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 overflow-hidden lg:h-screen lg:overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-[40px] p-8 shadow-2xl relative group my-8 lg:my-auto"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-t-[40px]"></div>

          <h1 className="text-3xl font-black text-slate-900 mb-6 italic tracking-widest font-tech uppercase">
            INITIALIZING <span className="text-blue-600">REGISTRATION</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "name", placeholder: "Full Name" },
                { name: "username", placeholder: "Username" },
              ].map((field) => (
                <div key={field.name} className="space-y-1">
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full placeholder:text-slate-500 bg-slate-50 border ${errors[field.name] ? "border-red-500" : "border-slate-200 focus:border-emerald-500"} rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-bold uppercase tracking-widest`}
                  />
                  {errors[field.name] && <p className="text-red-500 text-[8px] font-bold mt-1 ml-2">{errors[field.name]}</p>}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Network Email"
                  className={`w-full placeholder:text-slate-500 bg-slate-50 border ${errors.email ? "border-red-500" : "border-slate-200 focus:border-emerald-500"} rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-bold uppercase tracking-widest`}
                />
                {errors.email && <p className="text-red-500 text-[8px] font-bold mt-1 ml-2">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="Group / Team Name"
                  className={`w-full placeholder:text-slate-500 bg-slate-50 border ${errors.teamName ? "border-red-500" : "border-slate-200 focus:border-emerald-500"} rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-bold uppercase tracking-widest`}
                />
                {errors.teamName && <p className="text-red-500 text-[8px] font-bold mt-1 ml-2">{errors.teamName}</p>}
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  className={`w-full placeholder:text-slate-500 bg-slate-50 border ${errors.contact ? "border-red-500" : "border-slate-200 focus:border-emerald-500"} rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-bold uppercase tracking-widest`}
                />
                {errors.contact && <p className="text-red-500 text-[8px] font-bold mt-1 ml-2">{errors.contact}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative space-y-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full placeholder:text-slate-500 bg-slate-50 border ${errors.password ? "border-red-500" : "border-slate-200 focus:border-emerald-500"} rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-bold uppercase tracking-widest`}
                />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 cursor-pointer hover:text-emerald-500 transition-colors">
                  {showPassword ? <AiOutlineEyeInvisible size={14} /> : <AiOutlineEye size={14} />}
                </span>
                {errors.password && <p className="text-red-500 text-[8px] font-bold mt-1 ml-2">{errors.password}</p>}
              </div>

              <div className="relative space-y-1">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Verify Password"
                  className={`w-full placeholder:text-slate-500 bg-slate-50 border ${errors.confirmPassword ? "border-red-500" : "border-slate-200 focus:border-emerald-500"} rounded-xl px-4 py-3 text-slate-900 focus:outline-none transition-all font-bold uppercase tracking-widest`}
                />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-slate-400 cursor-pointer hover:text-emerald-500 transition-colors">
                  {showConfirmPassword ? <AiOutlineEyeInvisible size={14} /> : <AiOutlineEye size={14} />}
                </span>
                {errors.confirmPassword && <p className="text-red-500 text-[8px] font-bold mt-1 ml-2">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input 
                type="checkbox" 
                id="isAdminRequested"
                name="isAdminRequested"
                checked={formData.isAdminRequested}
                onChange={handleChange}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 border-slate-300 bg-white" 
              />
              <label htmlFor="isAdminRequested" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 cursor-pointer hover:text-emerald-600 transition-colors">
                Request System Elevation (Admin Permissions)
              </label>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-blue-500 text-white hover:bg-emerald-500 hover:text-white font-black rounded-xl py-4 uppercase tracking-[0.2em] transition-all flex items-center justify-center disabled:opacity-50 mt-2 relative overflow-hidden group shadow-lg"
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              disabled={loading}
            >
              <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">{loading ? "INITIALIZING..." : "JOIN NETWORK"}</span>
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/user/login" className="text-slate-600 font-black uppercase tracking-[0.2em] hover:text-blue-500 transition-colors underline decoration-2 underline-offset-4">
              Return to Login Panel
            </Link>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Hacker Matrix Aesthetic */}
      <div className="hidden lg:block flex-1 relative bg-slate-900 overflow-hidden">
        
        {/* Full Screen Matrix Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-80"></canvas>
        
        {/* Radial Vignette to focus the center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.8)_100%)] z-10 pointer-events-none"></div>

        {/* Floating Terminal Display */}
        <div className="absolute inset-0 z-20 flex items-center justify-center p-12 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full max-w-lg bg-slate-900/60 backdrop-blur-md border border-emerald-500/30 rounded-lg p-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-4 border-b border-emerald-500/20 pb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              <span className="ml-2 text-emerald-500/70 text-[10px] font-tech tracking-widest">root@query-tracker:~</span>
            </div>

            {/* Terminal Output */}
            <div className="font-tech text-[12px] leading-loose text-emerald-400 tracking-wider h-[250px] overflow-hidden flex flex-col justify-end">
              {terminal.displayedLines.map((line, index) => (
                <div key={index} className={line.includes("[OK]") ? "text-emerald-300" : "text-emerald-500/80"}>
                  <span className="text-emerald-500/50 mr-2">{'>'}</span>{line}
                </div>
              ))}
              {!terminal.isComplete && (
                <div className="text-emerald-400">
                  <span className="text-emerald-500/50 mr-2">{'>'}</span>
                  {terminal.currentLine}
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-emerald-400 ml-1 translate-y-1"
                  />
                </div>
              )}
              {terminal.isComplete && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="mt-4 text-emerald-300 font-bold"
                >
                  <span className="text-emerald-500/50 mr-2">{'>'}</span>
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2 h-4 bg-emerald-400 ml-1 translate-y-1" />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Register;