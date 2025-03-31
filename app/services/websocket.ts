const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:3000";

export function createWebSocketConnection(path = ""): WebSocket {
    const wsUrl = `${WS_BASE_URL}${path}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("WebSocket abierto:", wsUrl);
    ws.onclose = (event) => console.log("WebSocket cerrado:", event);
    ws.onerror = (error) => console.error("Error en WebSocket:", error);

    return ws;
}

