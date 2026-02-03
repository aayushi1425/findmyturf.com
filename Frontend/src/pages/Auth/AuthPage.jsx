import { useState } from "react";
import RoleToggle from "../../components/auth/RoleToggle";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthPage() {

  const [role, setRole] = useState("user");
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl border p-8 space-y-6">

        <h1 className="text-xl font-bold text-center">
          FindMyTurf
        </h1>

        {/* USER | BUSINESS toggle — always visible */}
        <RoleToggle role={role} setRole={setRole} />

        {/* FORM */}
        {mode === "login"
          ? <LoginForm role={role} />
          : <SignupForm role={role} />
        }

        {/* Switch login/signup */}
        <p className="text-center text-sm text-slate-500">

          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-black font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-black font-medium"
              >
                Login
              </button>
            </>
          )}

        </p>

      </div>
    </div>
  );
}
