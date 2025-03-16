import { useNavigate } from "@remix-run/react";
import "./styles.css";

export default function JoinScreen() {
    const navigate = useNavigate();

    return (
        <div className="join-screen">
            <img className="background" src="/CusBackground.png" alt="bg" />
            <div className="join-screen__menu">
                <img className="iceCream" src="/image 8-picaai.png" alt="iceCream" />
            </div>
            <div className="join-screen__buttons">
                <button className="join-screen__button" onClick={() => navigate("/lobby")}>
                    Join Lobby
                </button>
                <button className="join-screen__button" onClick={() => navigate("/game")}>
                    Create Lobby
                </button>
            </div>
        </div>
    );
}