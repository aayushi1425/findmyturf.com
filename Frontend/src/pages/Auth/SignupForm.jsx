import { useState } from "react";
import { registerUser, registerOwner, loginApi } from "../../services/auth.service";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import { useNavigate } from "react-router-dom";

export default function SignupForm({ role }) {
  const { login } = useAuth();
  const [f, setF] = useState({});
  const navigate = useNavigate();

  const set = (k,v)=>setF({...f,[k]:v});

  const submit = async (e) => {
    e.preventDefault();

    if(role==="user"){
      await registerUser({
        name:f.name,
        phone_no:f.phone,
        password:f.password
      });
    } else {
      await registerOwner({
        name:f.name,
        phone_no:f.phone,
        password:f.password,
        business_name:f.business,
        tenant:f.tenant
      });
    }

    const res = await loginApi({
      phone_no:f.phone,
      password:f.password
    });

    login(res.data.access || res.data.token);

    navigate("/login");
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Name" onChange={e=>set("name",e.target.value)} />
      <Input label="Phone" onChange={e=>set("phone",e.target.value)} />
      <Input label="Password" type="password" onChange={e=>set("password",e.target.value)} />

      {role==="business" && (
        <>
          <Input label="Business Name" onChange={e=>set("business",e.target.value)} />
          <Input label="Tenant" onChange={e=>set("tenant",e.target.value)} />
        </>
      )}

      <Button>Signup</Button>
    </form>
  );
}
