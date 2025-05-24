"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
    prompt(): Promise<void>;
}

export default function InstallPWAButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);


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

    const handleHideClick = () => {
        setIsHidden(true);
        localStorage.setItem("pwa-hidden", "true");
    };

    useEffect(() => {
        const isHidden = localStorage.getItem("pwa-hidden");
        if (isHidden) {
            setIsHidden(true);
        }
    }, []);

    if (isInstalled || !deferredPrompt || isHidden) return null;

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div
                className="flex items-center rounded-md overflow-hidden shadow-lg"
            >
                <Button
                    onClick={handleInstallClick}
                    className="flex rounded-r-none items-center space-x-2 px-6 py-3 text-sm sm:text-base md:text-lg font-playfair"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                        />
                    </svg>
                    <span>Install App</span>
                </Button>

                <Button
                    variant={'destructive'}
                    onClick={handleHideClick}
                    className="flex items-center rounded-l-none space-x-2 px-3 py-3 text-sm sm:text-base md:text-lg font-playfair"
                >
                    <span>
                        <X />
                    </span>
                </Button>
            </div>
        </div>

    );
}
