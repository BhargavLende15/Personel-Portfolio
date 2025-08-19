import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import { counterItems } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const AnimatedCounter = () => {
    const counterRef = useRef(null);
    const countersRef = useRef([]);
    const cardRefs = useRef([]);

    // Mouse move handler for glow effect
    const handleMouseMove = (index) => (e) => {
        const card = cardRefs.current[index];
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;

        let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
        angle = (angle + 360) % 360;

        card.style.setProperty("--start", angle + 60);
    };

    useGSAP(() => {
        countersRef.current.forEach((counter, index) => {
            const numberElement = counter.querySelector(".counter-number");
            const item = counterItems[index];

            // Set initial value to 0
            gsap.set(numberElement, { innerText: "0" });

            // Counting animation
            gsap.to(numberElement, {
                innerText: item.value,
                duration: 2.5,
                ease: "power2.out",
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: "#counter",
                    start: "top center",
                },
                onComplete: () => {
                    numberElement.textContent = `${item.value}${item.suffix}`;
                },
            });
        }, counterRef);
    }, []);

    return (
        <div id="counter" ref={counterRef} className="padding-x-lg xl:mt-0 mt-32">
            <div className="mx-auto grid-4-cols">
                {counterItems.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        ref={(el) => el && (cardRefs.current[index] = el)}
                        onMouseMove={handleMouseMove(index)}
                        className="card card-border rounded-lg p-10 flex flex-col justify-center
                       hover:bg-zinc-800 transition-colors cursor-pointer relative overflow-hidden block"
                    >
                        <div className="glow"></div>
                        <div
                            ref={(el) => el && (countersRef.current[index] = el)}
                            className="relative z-10 w-full h-full flex flex-col justify-center"
                        >
                            <div className="counter-number text-white-50 text-5xl font-bold mb-2">
                                0 {item.suffix}
                            </div>
                            <div className="text-white-50 text-lg">{item.label}</div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default AnimatedCounter;