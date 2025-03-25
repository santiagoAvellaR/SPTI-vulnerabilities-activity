import React from "react";
import { UserProvider } from "./userContext";

export default function App() {
    return (
        <UserProvider children = {undefined}>
            
        </UserProvider>
    );
}
