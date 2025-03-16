import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import Modal from "~/components/modal/Modal";
import "./styles.css";

export default function JoinScreen() {
    const navigate = useNavigate();
    const [showModal, setIsShowModal] = useState(false);

    const openModal = () => setIsShowModal(true);
    const closeModal = () => setIsShowModal(false);

    const handleJoinLobby = () => {
        navigate("/lobby");
    }

    return (
        <div className="join-screen">
            <img className="background" src="/CusBackground.png" alt="bg" />
            <div className="join-screen__menu">
                <img className="iceCream" src="/image 8-picaai.png" alt="iceCream" />
            </div>
            <div className="join-screen__buttons">
                <button className="join-screen__button" onClick={openModal}>
                    Join Lobby
                </button>
                <button className="join-screen__button" onClick={() => navigate("/game")}>
                    Create Lobby
                </button>
            </div>

            <Modal
                isOpen={showModal}
                onClose={closeModal}
                blurAmount="13px"
            >
                <div className="join-modal-content">
                    <h2 className="join-modal-title">Join Lobby</h2>
                    <div className="join-modal-forms">
                        <input
                            type="text"
                            placeholder="Enter Lobby Code"
                            className="join-modal-input"
                        />
                        <div className="join-modal-buttons">
                            <button className="join-modal-button-cancel" onClick={closeModal}>
                                Cancel
                            </button>
                            <button className="join-modal-button-join" onClick={handleJoinLobby}>
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}