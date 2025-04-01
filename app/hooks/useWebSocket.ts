import { useEffect, useState } from "react";
import { createWebSocketConnection } from "../services/websocket";

export function useWebSocket(path: string) {
    const [data, setData] = useState<any>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = createWebSocketConnection(path);
        setWs(socket);

        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                setData(message);
            } catch (error) {
                console.error("Error procesando el mensaje WebSocket:", error);
            }
        };

        return () => {
            socket.close();
        };
    }, [path]);

    // Función para enviar mensajes por WebSocket
    const sendMessage = (message: any) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket no está conectado. Intentando reconectar...");
        }
    };

    return { data, ws, sendMessage };
}
