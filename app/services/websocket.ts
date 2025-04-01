const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:3000";

let ws : WebSocket | null = null;

export function createWebSocketConnection(path = ""): WebSocket {
    const wsUrl = `${WS_BASE_URL}${path}`;
    ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("WebSocket abierto:", wsUrl);
    ws.onclose = (event) => console.log("WebSocket cerrado:", event);
    ws.onerror = (error) => console.error("Error en WebSocket:", error);

    return ws;
}

export {ws}