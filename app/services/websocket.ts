const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:3000";

let ws : WebSocket | null = null;



export function createWebSocketConnection(path = ""): WebSocket {
    const wsUrl = `${WS_BASE_URL}${path}`;
    ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("WebSocket abierto:", wsUrl);
    ws.onclose = (event) => console.log("WebSocket cerrado:", event);
    ws.onerror = (error) => console.error("Error en WebSocket:", error);
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Match found ID one :", message.match.id);
        if (message.message === 'match-found') {
            console.log("Match found ID two :", message.match.id);
        }
    };

    return ws;
}

// Función para enviar mensajes por WebSocket
export function sendMessage(message: any): void {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.warn("WebSocket no está conectado. Intentando reconectar...");
    }
}

export {ws}