import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
