import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserData {
    userId?: string;
    id?: string;
    username?: string;
    matchId?: string;
    [key: string]: any; // Para cualquier otra propiedad en la respuesta
}

// Define el tipo del contexto
interface UserContextType {
    userData: UserData | null;
    setUserData: (data: UserData | string | null) => void;
    isLoggedIn: boolean;
}

// Crea el contexto con valores predeterminados
const UserContext = createContext<UserContextType>({
    userData: null,
    setUserData: () => { },
    isLoggedIn: false
});

// Hook personalizado para usar el contexto de usuario
export const useUser = () => useContext(UserContext);

// Componente proveedor que envolverá tu aplicación
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
            // Si es un string, lo tratamos como userId (comportamiento original)
            newUserData = { ...userData, userId: data };
            console.log("Creating UserData from string:", newUserData);
        }
        else if (data && typeof data === 'object') {
            // Si es un objeto, actualizamos solo las propiedades proporcionadas
            newUserData = { ...userData, ...data };
            console.log("Merging with existing UserData:", newUserData);
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

    // Calcular si el usuario ha iniciado sesión
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