import { useNavigate } from "@remix-run/react";
import "./styles.css";
import React from "react";

export default function StartScreen() {
    const navigate = useNavigate();

    return (
        <div className="start-screen">
            <img className="logoImage" src="../../public/Bad_Ice_Cream.webp" alt="Logo" />
            <div className="start-screen__menu">
                <img className="menuImage" src="../../public/parte_cafe.png" alt="menu" />
                <div className="start-screen__buttons">
                    <button className="start-screen__button" onClick={() => navigate("/game")}>
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