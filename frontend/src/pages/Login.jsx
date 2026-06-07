import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post("https://skillsphere-backend-jz7a.onrender.com/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "client") navigate("/client");
      else if (res.data.user.role === "freelancer") navigate("/freelancer");
      else navigate("/client");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleLogin} className="space-y-4">
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
          <div className="flex justify-between items-center mb-1.5">
             <label className="block text-sm font-semibold text-[#30313d]">Password</label>
             <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot?</a>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="stripe-input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="stripe-btn disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-[#425466]">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
