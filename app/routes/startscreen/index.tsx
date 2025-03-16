import { useNavigate } from "@remix-run/react";
import "./styles.css";

export default function StartScreen() {
    const navigate = useNavigate();

    return (
        <div className="start-screen">
            <img className="logoImage" src="/Bad_Ice_Cream.webp" alt="Logo" />
            <div className="start-screen__menu">
                <img className="menuImage" src="/parte_cafe.png" alt="menu" />
                <div className="start-screen__buttons">
                    <button className="start-screen__button" onClick={() => navigate("/joinscreen")}>
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