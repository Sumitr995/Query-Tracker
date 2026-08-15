import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axiosInterceptor from "../utils/axiosInterceptor.js";
import { FiArrowLeft, FiUser, FiMail, FiUsers, FiPhone, FiCheckCircle, FiClock, FiLogOut } from "react-icons/fi";
import { toast } from "../components/notification.js";

function Profile() {
  const [user, setUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();
  // const canvasRef = useRef(null); // Removed as matrix rain effect is no longer used

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [profileRes, teamRes] = await Promise.all([
          axiosInterceptor.get("/user/profile"),
          axiosInterceptor.get("/user/team")
        ]);
        setUser(profileRes.data.user);
        setTeamMembers(teamRes.data.members || []);
      } catch (error) {
        console.error("Critical: Data link failure", error);
        toast.error("System sync failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleAdminRequest = async () => {
    if (requesting) return;
    setRequesting(true);
    try {
      const res = await axiosInterceptor.put("/user/request-admin");
      setUser(res.data.user);
      toast.success("Elevation protocol initiated. Awaiting council approval.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Request protocol failed.");
    } finally {
      setRequesting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    toast.info("Termination successful. Node offline.");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="h-screen bg-bg-deep flex items-center justify-center font-tech text-primary animate-pulse">
        ESTABLISHING DATA LINK...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep text-text-main relative overflow-hidden font-sans selection:bg-primary selection:text-white">
      {/* Top Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-6xl mx-auto">
        <Link to="/user/home" className="flex items-center space-x-2 text-text-muted hover:text-primary font-extrabold transition-colors group uppercase  tracking-widest text-[10px]">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Return to Dashboard</span>
        </Link>
        <button onClick={handleLogout} className="flex items-center space-x-2 text-red-800 hover:text-red-400 transition-colors uppercase font-black tracking-widest text-[10px]">
          <FiLogOut />
          <span>Terminate Session</span>
        </button>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface/80 backdrop-blur-3xl border border-border rounded-[48px] overflow-hidden shadow-2xl h-full"
            >
              {/* Header/Cover */}
              <div className="h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative border-b border-border/10">
                <div className="absolute -bottom-16 left-12">
                  <div className="relative group">
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={user?.profilePic}
                      alt="Profile"
                      className="w-32 h-32 rounded-3xl object-cover border-4 border-surface shadow-primary-glow bg-surface group-hover:grayscale-0 grayscale transition-all duration-500"
                    />
                    {user?.isApproved && (
                      <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-xl shadow-lg">
                        <FiCheckCircle size={16} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-20 px-12 pb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase font-tech text-text-main mb-1">
                      {user?.name}
                    </h1>
                    <p className="text-text-muted font-bold uppercase tracking-[0.3em] text-[10px]">
                      @{user?.username} • {user?.role} NODE
                    </p>
                  </div>
                  <div className="flex items-center px-6 py-3 bg-bg-deep border border-border rounded-2xl">
                    <span className={`w-2 h-2 rounded-full mr-3 ${user?.isApproved ? 'bg-primary shadow-primary-glow' : 'bg-yellow-500 animate-pulse'}`}></span>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {user?.isApproved ? 'Verified Operator' : 'Approval Pending'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Detailed Info */}
                  <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-primary tracking-[0.4em] uppercase font-tech border-b border-border pb-4">Core Metadata</h3>

                    <InfoItem icon={<FiMail />} label="Electronic Mail" value={user?.email} />
                    <InfoItem icon={<FiUsers />} label="Assigned Team" value={user?.teamName} />
                    <InfoItem icon={<FiPhone />} label="Contact Number" value={user?.contact} />

                    {!user?.isAdminRequested && user?.role !== 'admin' && (
                      <button
                        onClick={handleAdminRequest}
                        disabled={requesting}
                        className="mt-6 w-full py-4 border border-primary/40 hover:bg-primary/5 transition-all text-[10px] font-black uppercase tracking-widest rounded-2xl"
                      >
                        {requesting ? "Verifying..." : "Request Access Elevation"}
                      </button>
                    )}
                    {user?.isAdminRequested && (
                      <div className="mt-6 w-full py-4 text-[#FFB000] border border-[#FFB000]/20 bg-[#FFB000]/5 text-[10px] font-black uppercase tracking-widest rounded-2xl text-center">
                        Elevation Pending Approve
                      </div>
                    )}
                  </div>

                  {/* Status & Stats */}
                  <div className="space-y-6">
                    <h3 className="text-[11px] font-black text-primary tracking-[0.4em] uppercase font-tech border-b border-border pb-4">Activity Logs</h3>

                    <div className="p-6 bg-bg-deep rounded-3xl border border-border/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Presence Status</span>
                        <span className="text-[9px] font-bold text-primary px-2 py-1 bg-primary/10 rounded-lg">ONLINE</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center text-xs">
                          <FiClock className="mr-3 text-text-muted" />
                          <span className="text-text-muted uppercase font-bold tracking-widest text-[9px]">Last Sequence: </span>
                          <span className="ml-2 font-black text-text-main text-[10px] tracking-tight">{new Date(user?.updatedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <FiUser className="mr-3 text-text-muted" />
                          <span className="text-text-muted uppercase font-bold tracking-widest text-[9px]">Node Created: </span>
                          <span className="ml-2 font-black text-text-main text-[10px]">{new Date(user?.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Team / Social Sidebar */}
          <div className="lg:col-span-4">
            <h3 className="text-[11px] font-black text-primary tracking-[0.4em] uppercase font-tech mb-6 px-4">Teammates</h3>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member._id} className={`p-4 rounded-3xl border transition-all ${member._id === user?._id ? 'bg-primary/5 border-primary/30' : 'bg-surface/50 border-border hover:border-white/20'}`}>
                  <div className="flex items-center gap-4">
                    <img
                      src={member.profilePic || `https://api.dicebear.com/9.x/avataaars/svg?seed=${member.username}`}
                      alt={member.username}
                      className="w-10 h-10 rounded-xl border border-white/10 grayscale hover:grayscale-0 transition-grayscale bg-bg-deep"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-black uppercase truncate">{member.name}</span>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
                        @{member.username} {member._id === user?._id && '• (YOU)'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <div className="group flex items-start space-x-4 p-2 transition-all">
    <div className="mt-1 p-2.5 bg-bg-deep rounded-xl border border-border group-hover:border-primary/50 group-hover:text-primary transition-all shadow-sm">
      {React.cloneElement(icon, { size: 16 })}
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{label}</span>
      <span className={`text-sm font-bold tracking-wide ${value ? 'text-text-main' : 'text-primary animate-pulse'}`}>
        {value || (label === "Assigned Team" ? "INITIALIZING..." : "ACCESS_DENIED")}
      </span>
    </div>
  </div>
);

export default Profile;
