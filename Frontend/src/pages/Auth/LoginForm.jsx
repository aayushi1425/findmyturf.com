import { useState } from "react";
import { loginApi } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";

export default function LoginForm() {
  const { login } = useAuth();
  const [phone_no, setPhone] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginApi({ phone_no, password });
      login(res.data.access || res.data.token);
      navigate("/turfs")
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <Input label="Phone" value={phone_no} onChange={e=>setPhone(e.target.value)} />
      <Input label="Password" type="password" value={password} onChange={e=>setPass(e.target.value)} />
      <Button>Login</Button>
    </form>
  );
}
