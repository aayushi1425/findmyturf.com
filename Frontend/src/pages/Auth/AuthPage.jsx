import { useState } from "react";
import AuthTabs from "../../components/auth/authTabs";
import RoleToggle from "../../components/auth/roleToggle";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthPage() {
  const [tab,setTab]=useState("login");
  const [role,setRole]=useState("user");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAEFEF]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[380px] space-y-6">
        <h1 className="text-2xl font-bold text-center">FindMyTurf</h1>
        <AuthTabs tab={tab} setTab={setTab}/>
        {tab==="signup" && <RoleToggle role={role} setRole={setRole}/>}
        {tab==="login" ? <LoginForm/> : <SignupForm role={role}/>}
      </div>
    </div>
  );
}
