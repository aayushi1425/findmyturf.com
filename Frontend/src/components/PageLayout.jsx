import bgTurf from "../assets/bg-turf.jpg";

export default function PageLayout({ children }) {
  return (
    <div className="relative min-h-screen">
      {/* Background image behind content */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <img
          src={bgTurf}
          alt="Sports turf background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Foreground content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}

