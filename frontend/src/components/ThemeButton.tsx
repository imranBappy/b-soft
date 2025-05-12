"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function ThemeButton() {
    const { setTheme, theme } = useTheme()
    return (
        <Button onClick={() => setTheme(theme === 'dark' ? "light" : 'dark')} variant="outline" className="  hidden md:flex shadow-none" size="icon">
            {
                theme === 'light' ? <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    : <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            }

        </Button>
    )
}
