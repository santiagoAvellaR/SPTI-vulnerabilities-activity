import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { useUser } from "../../userContext";
import api from "../../services/api";
import "./styles.css";

export default function StartScreen() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { setUserData } = useUser();

    const handleStartGame = async () => {
        console.log("handleStartGame");
        setError("");
        try {

            const response = await api.post("/rest/users", {
            }, {
                withCredentials: false,
            });

            console.log("API response:", response.data);
            setUserData(response.data);
            navigate("/joinscreen");
        }
        catch (error) {
            console.error("Error in handleStartGame:", error);

            const Error = (error as any);

            if (Error.response) {
                // The server responded with a status code outside the 2xx range
                setError(`Server error: ${Error.response.data?.message || Error.response.statusText}`);
            } else if (Error.request) {
                // The request was made but no response was received
                setError("Network error: Unable to reach the server");
            } else {
                // Something else happened in setting up the request
                setError(`Error: ${Error.message}`);
            }
        }
    }

    return (
        <div className="start-screen">
            <img className="logoImage" src="/Bad_Ice_Cream.webp" alt="Logo" />
            <div className="start-screen__menu">
                <img className="menuImage" src="/parte_cafe.png" alt="menu" />
                <div className="start-screen__buttons">
                    <button
                        className="start-screen__button"
                        onClick={handleStartGame}
                    >
                        Start Game
                    </button>
                    <button className="start-screen__button" onClick={() => navigate("/help")}>
                        help
                    </button>
                </div>
            </div>
        </div>
    );
}