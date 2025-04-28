import { JWT_TOKEN_KEY, ROLE_KEY } from "@/constants/auth.constants";
import { ME_QUERY } from "@/graphql/accounts/queries";
import authVerify from "@/lib/auth";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"


interface UserType {
    name: string,
    email: string,
    photo: string,
    role: string,
}
interface AuthType {
    isAuthenticated: Boolean;
    isLoading: Boolean;
    user: UserType | null;
    logout: () => void;
}

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<UserType | null>(null)
    const authData: any = authVerify()
    const router = useRouter()

    const logout = () => {
        localStorage.removeItem(JWT_TOKEN_KEY)
        localStorage.removeItem(ROLE_KEY)
        setIsAuthenticated(false)
        setIsLoading(false)
        router.push("/login")
    }

    useQuery(ME_QUERY, {
        onCompleted(data) {
            const { email, name, role, photo } = data.me
            setUser({
                email: email,
                name: name,
                role: role,
                photo: photo
            })
        },
        onError(error) {
            // logout()
            
        }
    })


    useEffect(() => {
        if (authData.error) {
            setIsAuthenticated(false)
        }
        if (authData.email && !authData?.error) {
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [authData])

    if (isAuthenticated) {
        return {
            isAuthenticated: isAuthenticated,
            isLoading: isLoading,
            user: user,
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