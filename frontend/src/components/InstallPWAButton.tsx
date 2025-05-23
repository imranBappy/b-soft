"use client";

import React, { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
    prompt(): Promise<void>;
}

export default function InstallPWAButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        const onAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener("beforeinstallprompt", handler);
        window.addEventListener("appinstalled", onAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener("appinstalled", onAppInstalled);
        };
    }, []);

    const handleInstallClick = () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                setIsInstalled(true);
            }
            setDeferredPrompt(null);
        });
    };

    if (isInstalled || !deferredPrompt) return null;

    return (
        <button
            onClick={handleInstallClick}
            className="
          fixed bottom-6 left-10
          flex items-center gap-3
          bg-[#FFC400] text-black
          font-semibold
          px-4 py-2 rounded-xl
          shadow-md hover:bg-yellow-500
          hover:shadow-lg
          transform hover:scale-105
          transition duration-300 ease-in-out
        "
            aria-label="Install Bsoft App"
            title="Install Bsoft App"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Install Bsoft
        </button>

    );
}
