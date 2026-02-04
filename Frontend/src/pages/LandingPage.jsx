import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import PageLayout from "../components/PageLayout";
import { ListShimmerGrid, TurfCardShimmer } from "../components/Shimmers";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 px-6 py-20">
            <ListShimmerGrid count={3} renderItem={() => <TurfCardShimmer />} />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Hero />
      <Features />
      <Footer />
    </PageLayout>
  );
}
