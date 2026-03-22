'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: string
    email: string
    name: string
    phone?: string
    operator?: string
}

interface UserContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    register: (userData: any) => Promise<void>
    logout: () => void
    loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            try {
                // Get token from cookie (fallback to localStorage if needed)
                const getCookie = (name: string) => document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))?.pop() || localStorage.getItem(name);
                const token = getCookie('token');

                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
                const res = await fetch(`${apiUrl}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (res.ok && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                    document.cookie = 'token=; Max-Age=0; path=/;';
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error("Auth check error:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        checkUser();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()

        if (res.ok) {
            setUser(data.user)
            router.push('/dashboard')
        } else {
            throw new Error(data.error)
        }
    }

    const register = async (userData: any) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })

        const data = await res.json()

        if (res.ok) {
            setUser(data.user)
            router.push('/dashboard')
        } else {
            throw new Error(data.error)
        }
    }

    const logout = async () => {
        // Supprimer le cookie via une requête API (à implémenter si besoin, ou juste clear statique)
        // Pour l'instant on réinitialise l'état
        setUser(null)
        // Optional: a call to /api/auth/logout could clear the cookie properly
        document.cookie = 'token=; Max-Age=0; path=/;'
        router.push('/login')
    }

    return (
        <UserContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}
