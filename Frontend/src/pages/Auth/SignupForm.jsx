import { useState } from "react";
import {
  registerUser,
  registerOwner,
  loginApi
} from "../../services/auth.service";

import useAuth from "../../hooks/useAuth";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import { useNavigate } from "react-router-dom";

export default function SignupForm({ role }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [f, setF] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setF({ ...f, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "user") {
        await registerUser({
          name: f.name,
          phone_no: f.phone,
          password: f.password,
        });
      } else {
        await registerOwner({
          name: f.name,
          phone_no: f.phone,
          password: f.password,
          business_name: f.business,
          tenant: f.tenant,
        });
      }

      const res = await loginApi({
        phone_no: f.phone,
        password: f.password,
      });

      login(res.data.access || res.data.token);
      navigate("/turfs");

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">

      <Input label="Full name"
        onChange={(e) => set("name", e.target.value)} />

      <Input label="Phone number"
        onChange={(e) => set("phone", e.target.value)} />

      <Input label="Password" type="password"
        onChange={(e) => set("password", e.target.value)} />

      {role === "business" && (
        <>
          <Input label="Business name"
            onChange={(e) => set("business", e.target.value)} />

          <Input label="Tenant ID"
            onChange={(e) => set("tenant", e.target.value)} />
        </>
      )}

      <Button disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>

    </form>
  );
}
