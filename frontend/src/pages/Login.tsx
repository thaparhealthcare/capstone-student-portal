import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  // const [rollNumber, setRollNumber] = useState("102203331");
  const [rollNumber, setRollNumber] = useState("");
  // const [password, setPassword] = useState("RaghavBhagat@06042004");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await login(rollNumber, password);
    if (data) {
      toast.success("Login Successful! 🎉");
      // SPA navigation – no page reload
      navigate("/dashboard", { replace: true });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: "url('/tiet_collage.jpg')" }}
    >
      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/40 bg-white/30 p-8 shadow-xl backdrop-blur-sm">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Student Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Roll Number */}
          <div>
            <label className="text-sm font-medium text-gray-800">
              Roll Number
            </label>
            <input
              type="text"
              placeholder="Enter Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
              className="mt-1 w-full rounded-lg bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-800">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs font-medium text-gray-900">
          © 2025 TIET Student Health Portal
        </p>
      </div>
    </div>
  );
}
