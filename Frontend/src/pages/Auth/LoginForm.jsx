import { useState } from "react";
import { loginApi } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone_no, setPhone] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ phone_no, password });
      login(res.data.access || res.data.token);
      navigate("/turfs");
    } catch {
      setError("Invalid phone or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <Input
        label="Phone number"
        placeholder="Enter phone"
        value={phone_no}
        onChange={(e) => setPhone(e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPass(e.target.value)}
      />

      <Button disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </Button>

    </form>
  );
}
