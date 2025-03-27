import { createContext, useContext, useState, ReactNode, useEffect } from 'react';



interface UserData {
    userId?: string;
    id?: string;
    username?: string;
    [key: string]: any; // For any other properties in the response
}

// Define the context type
interface UserContextType {
    userData: UserData | null;
    setUserData: (data: UserData | string | null) => void;
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
    // Intentar cargar datos del usuario desde localStorage al inicializar
    const [userData, setUserDataState] = useState<UserData | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('userData');
            console.log("Initial userData from localStorage:", saved);
            return saved ? JSON.parse(saved) : null;
        }
        return null;
    });

    // Función mejorada para manejar diferentes tipos de entrada
    const setUserData = (data: UserData | string | null) => {
        console.log("setUserData called with:", data);

        let newUserData: UserData | null = null;

        if (typeof data === 'string') {
            newUserData = { userId: data };
            console.log("Creating UserData from string:", newUserData);
        }
        else if (data && typeof data === 'object') {
            newUserData = data;
            console.log("Using object as UserData:", newUserData);
        }
        else {
            console.log("Clearing UserData");
        }

        // Guardar en localStorage antes de actualizar el estado
        if (typeof window !== 'undefined') {
            if (newUserData) {
                console.log("Saving to localStorage:", JSON.stringify(newUserData));
                localStorage.setItem('userData', JSON.stringify(newUserData));
            } else {
                console.log("Removing from localStorage");
                localStorage.removeItem('userData');
            }
        }

        // Actualizar el estado con la nueva información
        console.log("Updating state with:", newUserData);
        setUserDataState(newUserData);
    };

    // Compute whether user is logged in
    const isLoggedIn = Boolean(userData && (userData.userId || userData.id));

    // Efecto para registrar cambios en userData (para depuración)
    useEffect(() => {
        console.log("UserContext - userData changed:", userData);
        console.log("UserContext - isLoggedIn:", isLoggedIn);
    }, [userData, isLoggedIn]);

    // Valor del contexto construido con los datos actuales
    const contextValue = {
        userData,
        setUserData,
        isLoggedIn
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}