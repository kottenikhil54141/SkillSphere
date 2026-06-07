import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("https://skillsphere-backend-jz7a.onrender.com/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registered successfully");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Register failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the premium freelance marketplace"
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Full Name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="stripe-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="stripe-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="stripe-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#30313d] mb-1.5">Account Type</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="stripe-input"
          >
            <option value="client">Client (Hire Talent)</option>
            <option value="freelancer">Freelancer (Find Work)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="stripe-btn disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-[#425466]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
