import React, { useState, useRef } from 'react';

const TurfGallery = ({ images = [] }) => {
    const [current, setCurrent] = useState(0);
    const startX = useRef(0);

    if (!images.length) {
        return (
            <div className="rounded-md bg-slate-100 p-4 text-sm text-slate-500 text-center">
                No photos yet.
            </div>
        );
    }

    const prev = () => {
        setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
    };

    const next = () => {
        setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    };

    // Basic swipe support
    const onTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
        const diff = startX.current - e.changedTouches[0].clientX;
        if (diff > 50) next();
        if (diff < -50) prev();
    };

    return (
        <div className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            {/* IMAGE */}
            <div
                className="relative h-56 md:h-64 lg:h-72"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <img
                    key={current}
                    src={images[current].image_url || images[current].image}
                    alt={`Turf ${current + 1}`}
                    className="h-full w-full object-cover transition-opacity duration-300"
                    loading="lazy"
                />
            </div>

            {/* LEFT ARROW */}
            <button
                type="button"
                onClick={prev}
                className="
                    absolute left-3 top-1/2 -translate-y-1/2
                    rounded-full bg-white/90 p-2 shadow
                    hover:bg-white transition
                "
            >
                ←
            </button>

            {/* RIGHT ARROW */}
            <button
                type="button"
                onClick={next}
                className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    rounded-full bg-white/90 p-2 shadow
                    hover:bg-white transition
                "
            >
                →
            </button>

            {/* DOTS */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`h-2 w-2 rounded-full ${index === current
                                ? 'bg-white'
                                : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TurfGallery;
