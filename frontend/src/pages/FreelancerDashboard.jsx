import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import axios from "axios";
import Logo from "../components/Logo";

export default function FreelancerDashboard() {
  const [gigs, setGigs] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("");
  const [myProposals, setMyProposals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [activeGigId, setActiveGigId] = useState(null);
  const [activeReceiverId, setActiveReceiverId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchGigs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/gigs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGigs(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const fetchMyProposals = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/proposals/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyProposals(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notifications/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchNotifications();
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const fetchMyPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPayments(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchGigs();
    fetchMyProposals();
    fetchNotifications();
    fetchMyPayments();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!selectedGig) return;

    try {
      await axios.post(
        "http://localhost:5000/api/proposals",
        {
          gigId: selectedGig._id,
          coverLetter,
          bidAmount: Number(bidAmount),
          estimatedDays: Number(estimatedDays),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Proposal submitted");
      setCoverLetter("");
      setBidAmount("");
      setEstimatedDays("");
      setSelectedGig(null);
      fetchMyProposals();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit proposal");
    }
  };

  const openChat = (gigId, clientId) => {
    setActiveGigId(gigId);
    setActiveReceiverId(clientId);
  };

  return (
    <div className="min-h-screen bg-stripe-bg text-stripe-text font-sans pb-20">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-stripe-border px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-6">
           <Logo />
           <div className="h-5 w-px bg-stripe-border hidden sm:block"></div>
           <span className="font-semibold text-sm text-[#425466] hidden sm:block">Freelancer Console</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-semibold text-xs text-[#059669] bg-[#ecfdf5] px-3 py-1.5 rounded-full">Freelancer Mode</span>
          <button onClick={handleLogout} className="font-semibold text-sm text-[#425466] hover:text-[#0a2540] transition-colors">Sign out</button>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto p-6 md:p-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#0a2540] mb-4 tracking-tight">Opportunities</h1>
          <p className="text-[#425466] text-lg max-w-xl font-medium">
            Find the right projects, submit winning proposals, and track your active contracts.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Available Gigs", value: gigs.length },
            { label: "Proposals Sent", value: myProposals.length },
            { label: "Accepted Bids", value: myProposals.filter(p => p.status === "accepted").length },
            { label: "Payments", value: myPayments.length }
          ].map((stat, idx) => (
            <div key={idx} className="stripe-panel p-6 flex flex-col justify-between">
              <span className="font-semibold text-sm text-[#425466] mb-4">{stat.label}</span>
              <span className="text-3xl font-bold text-[#0a2540]">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Apply Panel & Notifications */}
          <div className="lg:col-span-4 space-y-8">
            <div className="stripe-panel p-8">
              <h2 className="text-xl font-bold text-[#0a2540] mb-6 tracking-tight">
                Submit Proposal
              </h2>
              
              {selectedGig ? (
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="mb-4 p-4 bg-[#f8fafc] rounded-xl border border-stripe-border">
                    <span className="block text-xs font-semibold text-[#64748b] mb-1">Applying for:</span>
                    <strong className="text-sm font-bold text-[#0a2540]">{selectedGig.title}</strong>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Cover Letter</label>
                    <textarea className="stripe-input min-h-[120px] resize-y" placeholder="Detail your approach and experience..." value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Bid Amount ($)</label>
                      <input className="stripe-input" type="number" placeholder="0.00" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Est. Days</label>
                      <input className="stripe-input" type="number" placeholder="Days" value={estimatedDays} onChange={(e) => setEstimatedDays(e.target.value)} required />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setSelectedGig(null)} className="w-1/3 bg-white hover:bg-[#f8fafc] text-[#425466] border border-stripe-border text-sm font-semibold rounded-lg transition-colors py-3">
                      Cancel
                    </button>
                    <button type="submit" className="w-2/3 stripe-btn !mt-0">
                      Submit Bid
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-10 bg-[#f8fafc] rounded-xl border border-stripe-border border-dashed">
                  <p className="text-sm font-medium text-[#64748b]">Select a project from the board to apply.</p>
                </div>
              )}
            </div>

            {/* Notifications Panel */}
            <div className="stripe-panel p-8">
              <h2 className="text-xl font-bold text-[#0a2540] mb-6 tracking-tight">
                Recent Activity
              </h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length === 0 ? (
                  <p className="text-sm text-[#425466]">No recent activity.</p>
                ) : (
                  notifications.map((note) => (
                    <div key={note._id} onClick={() => markNotificationRead(note._id)} className="cursor-pointer group flex gap-3 border-b border-stripe-border last:border-0 pb-3 last:pb-0">
                      <div className="pt-1">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${note.read ? 'bg-gray-300' : 'bg-[#10b981]'}`}></div>
                      </div>
                      <div>
                        <p className={`text-sm ${note.read ? 'text-[#425466]' : 'text-[#0a2540] font-medium group-hover:text-[#10b981]'}`}>{note.message}</p>
                        <p className="text-xs text-[#425466] mt-1">{new Date(note.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Available Gigs */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-2xl font-bold text-[#0a2540] tracking-tight">
              Project Board
            </h2>
            
            <div className="space-y-6">
              {gigs.length === 0 ? (
                <div className="stripe-panel p-12 text-center bg-white border-dashed">
                  <p className="text-[#425466] font-medium">No projects available at the moment.</p>
                </div>
              ) : (
                gigs.map((gig) => {
                  const hasApplied = myProposals.some(p => p.gig?._id === gig._id || p.gig === gig._id);
                  const isSelected = selectedGig?._id === gig._id;

                  return (
                    <div key={gig._id} className={`stripe-panel p-8 transition-colors ${isSelected ? 'ring-2 ring-[#6366f1] bg-[#f8fafc]' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-[#0a2540] tracking-tight">{gig.title}</h3>
                        {hasApplied && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f0fdf4] text-[#16a34a]">APPLIED</span>}
                      </div>
                      
                      <p className="text-[#425466] text-sm mb-6 leading-relaxed max-w-3xl font-medium">{gig.description}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#f8fafc] p-4 rounded-xl border border-stripe-border">
                         <div className="flex gap-6 sm:gap-8">
                            <div>
                               <span className="block text-xs font-semibold text-[#64748b] mb-1">Budget</span>
                               <span className="text-sm font-bold text-[#0a2540]">${gig.budget}</span>
                            </div>
                            <div>
                               <span className="block text-xs font-semibold text-[#64748b] mb-1">Deadline</span>
                               <span className="text-sm font-bold text-[#0a2540]">{gig.deadline}</span>
                            </div>
                            <div>
                               <span className="block text-xs font-semibold text-[#64748b] mb-1">Category</span>
                               <span className="text-sm font-bold text-[#0a2540]">{gig.category}</span>
                            </div>
                         </div>

                        {!hasApplied && (
                          <button
                            onClick={() => setSelectedGig(gig)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isSelected ? 'bg-[#0a2540] text-white' : 'bg-white border border-stripe-border text-[#0a2540] hover:bg-[#f8fafc]'}`}
                          >
                            {isSelected ? 'Selected' : 'Apply Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}

              {/* My Proposals Section */}
              {myProposals.length > 0 && (
                <div className="pt-8">
                  <h2 className="text-2xl font-bold text-[#0a2540] tracking-tight mb-6">
                    Active Contracts & Bids
                  </h2>
                  <div className="space-y-6">
                     {myProposals.map((proposal) => (
                        <div key={proposal._id} className="stripe-panel p-6">
                          <div className="flex justify-between items-start mb-4">
                             <h4 className="text-lg font-bold text-[#0a2540]">{proposal.gig?.title || "Unknown Project"}</h4>
                             <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                                proposal.status === 'pending' ? 'bg-[#fffbeb] text-[#d97706]' :
                                proposal.status === 'accepted' ? 'bg-[#f0fdf4] text-[#16a34a]' :
                                'bg-[#fef2f2] text-[#dc2626]'
                              }`}>
                                {proposal.status.toUpperCase()}
                              </span>
                          </div>
                          <div className="flex gap-6 mb-5">
                            <div>
                               <span className="block text-xs font-semibold text-[#64748b] mb-1">Bid Amount</span>
                               <span className="text-sm font-bold text-[#0a2540]">${proposal.bidAmount}</span>
                            </div>
                            <div>
                               <span className="block text-xs font-semibold text-[#64748b] mb-1">Est. Time</span>
                               <span className="text-sm font-bold text-[#0a2540]">{proposal.estimatedDays} Days</span>
                            </div>
                          </div>
                          <p className="text-sm text-[#425466] mb-5 font-medium bg-[#f8fafc] p-4 rounded-xl border border-stripe-border">{proposal.coverLetter}</p>
                          
                          {proposal.status === "accepted" && (
                            <button
                              onClick={() => {
                                const clientId = proposal.gig?.client?._id || proposal.gig?.client;
                                if (!clientId) { alert("Client information not loaded"); return; }
                                openChat(proposal.gig._id, clientId);
                              }}
                              className="px-5 py-2.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                            >
                              Open Message Thread
                            </button>
                          )}
                        </div>
                     ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeGigId && activeReceiverId && (
        <ChatBox gigId={activeGigId} receiverId={activeReceiverId} onClose={() => {setActiveGigId(null); setActiveReceiverId(null);}} />
      )}
    </div>
  );
}