import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import axios from "axios";
import Logo from "../components/Logo";

export default function ClientDashboard() {
  const [gigs, setGigs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [proposals, setProposals] = useState({});
  const [activeGigId, setActiveGigId] = useState(null);
  const [activeReceiverId, setActiveReceiverId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [payments, setPayments] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProposals = async (gigId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/proposals/${gigId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProposals((prev) => ({
        ...prev,
        [gigId]: res.data,
      }));
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

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  const fetchGigs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/gigs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGigs(res.data);

      res.data.forEach((gig) => {
        fetchProposals(gig._id);
      });
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchGigs();
    fetchNotifications();
    fetchPayments();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleCreateGig = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/gigs",
        {
          title,
          description,
          budget: Number(budget),
          deadline,
          category,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setDescription("");
      setBudget("");
      setDeadline("");
      setCategory("");
      fetchGigs();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create gig");
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/proposals/${proposalId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGigs();
      fetchNotifications();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to accept proposal");
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/proposals/${proposalId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGigs();
      fetchNotifications();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject proposal");
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

  const openChat = (gigId, freelancerId) => {
    setActiveGigId(gigId);
    setActiveReceiverId(freelancerId);
  };

  const releasePayment = async (gigId, amount) => {
    try {
      await axios.post(
        "http://localhost:5000/api/payments",
        {
          gigId,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Payment released");
      fetchPayments();
      fetchGigs();
      fetchNotifications();
    } catch (error) {
      alert(error.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-stripe-bg text-stripe-text font-sans pb-20">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-stripe-border px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-6">
           <Logo />
           <div className="h-5 w-px bg-stripe-border hidden sm:block"></div>
           <span className="font-semibold text-sm text-[#425466] hidden sm:block">Client Console</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-semibold text-xs text-[#6366f1] bg-[#eef2ff] px-3 py-1.5 rounded-full">Client Mode</span>
          <button onClick={handleLogout} className="font-semibold text-sm text-[#425466] hover:text-[#0a2540] transition-colors">Sign out</button>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto p-6 md:p-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#0a2540] mb-4 tracking-tight">Overview</h1>
          <p className="text-[#425466] text-lg max-w-xl font-medium">
            Manage your projects, review proposals, and authorize payments seamlessly.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Gigs", value: gigs.length },
            { label: "Open", value: gigs.filter(g => g.status === "open").length },
            { label: "In Progress", value: gigs.filter(g => g.status === "in_progress").length },
            { label: "Payments", value: payments.length }
          ].map((stat, idx) => (
            <div key={idx} className="stripe-panel p-6 flex flex-col justify-between">
              <span className="font-semibold text-sm text-[#425466] mb-4">{stat.label}</span>
              <span className="text-3xl font-bold text-[#0a2540]">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Create Gig & Notifications */}
          <div className="lg:col-span-4 space-y-8">
            <div className="stripe-panel p-8">
              <h2 className="text-xl font-bold text-[#0a2540] mb-6 tracking-tight">
                Create New Project
              </h2>
              <form onSubmit={handleCreateGig} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Project Title</label>
                  <input className="stripe-input" type="text" placeholder="e.g. Redesign Landing Page" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Description</label>
                  <textarea className="stripe-input min-h-[100px] resize-y" placeholder="Detail the scope of work..." value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Budget ($)</label>
                    <input className="stripe-input" type="number" placeholder="0.00" value={budget} onChange={(e) => setBudget(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Deadline</label>
                    <input className="stripe-input" type="text" placeholder="MM/DD/YYYY" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Category</label>
                  <input className="stripe-input" type="text" placeholder="e.g. Design, Development" value={category} onChange={(e) => setCategory(e.target.value)} required />
                </div>
                <button type="submit" className="stripe-btn">
                  Publish Project
                </button>
              </form>
            </div>

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
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${note.read ? 'bg-gray-300' : 'bg-[#6366f1]'}`}></div>
                      </div>
                      <div>
                        <p className={`text-sm ${note.read ? 'text-[#425466]' : 'text-[#0a2540] font-medium group-hover:text-[#6366f1]'}`}>{note.message}</p>
                        <p className="text-xs text-[#425466] mt-1">{new Date(note.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Active Projects */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-2xl font-bold text-[#0a2540] tracking-tight">
              Active Projects & Proposals
            </h2>
            
            <div className="space-y-6">
              {gigs.length === 0 ? (
                <div className="stripe-panel p-12 text-center bg-white border-dashed">
                   <p className="text-[#425466] font-medium">You haven't created any projects yet.</p>
                </div>
              ) : (
                gigs.map((gig) => (
                  <div key={gig._id} className="stripe-panel p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-[#0a2540] tracking-tight">{gig.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        gig.status === 'open' ? 'bg-[#eef2ff] text-[#6366f1]' : 
                        gig.status === 'in_progress' ? 'bg-[#f0fdf4] text-[#16a34a]' : 
                        'bg-[#f1f5f9] text-[#64748b]'
                      }`}>
                        {gig.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-[#425466] text-sm mb-6 leading-relaxed max-w-3xl font-medium">{gig.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-[#f8fafc] p-4 rounded-xl border border-stripe-border">
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
                       <div>
                          <span className="block text-xs font-semibold text-[#64748b] mb-1">Project ID</span>
                          <span className="text-sm font-bold text-[#0a2540]">{gig._id.slice(-6)}</span>
                       </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#0a2540] mb-4">Proposals ({proposals[gig._id]?.length || 0})</h4>
                      <div className="space-y-4">
                        {proposals[gig._id]?.length > 0 ? (
                          proposals[gig._id].map((proposal) => (
                            <div key={proposal._id} className="border border-stripe-border rounded-xl p-5 bg-white">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-bold text-[#0a2540]">{proposal.freelancer?.name}</p>
                                  <p className="text-xs font-semibold text-[#64748b] mt-1">Bid: ${proposal.bidAmount} • Est. Time: {proposal.estimatedDays} days</p>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                                  proposal.status === 'accepted' ? 'bg-[#f0fdf4] text-[#16a34a]' :
                                  proposal.status === 'rejected' ? 'bg-[#fef2f2] text-[#dc2626]' :
                                  'bg-[#fffbeb] text-[#d97706]'
                                }`}>
                                  {proposal.status}
                                </span>
                              </div>
                              <p className="text-sm text-[#425466] mb-5 font-medium bg-[#f8fafc] p-3 rounded-lg">{proposal.coverLetter}</p>

                              {proposal.status === "pending" && (
                                <div className="flex gap-3">
                                  <button onClick={() => handleAccept(proposal._id)} className="px-5 py-2 bg-[#0a2540] hover:bg-[#0f172a] text-white text-sm font-semibold rounded-lg transition-colors">
                                    Accept Proposal
                                  </button>
                                  <button onClick={() => handleReject(proposal._id)} className="px-5 py-2 bg-white hover:bg-[#f8fafc] text-[#425466] border border-stripe-border text-sm font-semibold rounded-lg transition-colors">
                                    Decline
                                  </button>
                                </div>
                              )}

                              {proposal.status === "accepted" && (
                                <div className="flex gap-3">
                                  <button onClick={() => openChat(gig._id, proposal.freelancer._id)} className="px-5 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
                                    Message
                                  </button>
                                  <button onClick={() => releasePayment(gig._id, proposal.bidAmount)} className="px-5 py-2 bg-[#10b981] hover:bg-[#059669] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
                                    Release Payment
                                  </button>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm font-medium text-[#64748b] bg-[#f8fafc] p-4 rounded-xl border border-stripe-border border-dashed text-center">No proposals received yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
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