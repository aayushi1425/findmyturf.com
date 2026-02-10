import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import PageLayout from "../components/PageLayout";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout>
      <Hero />
      <Features />
      <Footer />
    </PageLayout>
  );
}
