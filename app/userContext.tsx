import { createContext, useContext, useState, ReactNode } from 'react';

interface UserData {
    userId?: string;
    id?: string;
    username?: string;
    [key: string]: any; // For any other properties in the response
}

// Define the context type
interface UserContextType {
    userData: UserData | null;
    setUserData: (data: UserData | null) => void;
    isLoggedIn: boolean;
}

// Create the context with default values
const UserContext = createContext<UserContextType>({
    userData: null,
    setUserData: () => { },
    isLoggedIn: false
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Provider component that will wrap your app
export function UserProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<UserData | null>(null);

    // Compute whether user is logged in
    const isLoggedIn = Boolean(userData && (userData.userId || userData.id));

    return (
        <UserContext.Provider value={{ userData, setUserData, isLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
}