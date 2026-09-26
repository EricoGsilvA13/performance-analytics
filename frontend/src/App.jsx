import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Sessoes from "./pages/Sessoes";
import Estatisticas from "./pages/Estatisticas";

import "./styles/layout.css";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route element={<Layout />}>

                    <Route
                        path="/"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/usuarios"
                        element={<Usuarios />}
                    />

                    <Route
                        path="/sessoes"
                        element={<Sessoes />}
                    />

                    <Route
                        path="/estatisticas"
                        element={<Estatisticas />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;