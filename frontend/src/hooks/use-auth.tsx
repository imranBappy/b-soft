import { JWT_TOKEN_KEY, ROLE_KEY } from "@/constants/auth.constants";
import authVerify, { AuthVerifyResult } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"


const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const authData: AuthVerifyResult = authVerify()
    const router = useRouter()

    const logout = () => {
        localStorage.removeItem(JWT_TOKEN_KEY)
        localStorage.removeItem(ROLE_KEY)
        setIsAuthenticated(false)
        setIsLoading(false)
        router.push("/login")
    }

  


    useEffect(() => {
        if ('error' in authData) {
            setIsAuthenticated(false)
        } else {
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [authData])

    if (isAuthenticated) {
        return {
            isAuthenticated: isAuthenticated,
            isLoading: isLoading,
            logout: logout
        }
    }
    if (!isAuthenticated) {
        return {
            isAuthenticated: isAuthenticated,
            isLoading: isLoading,
            user: null,
            logout: logout
        }
    }

}

export default useAuth