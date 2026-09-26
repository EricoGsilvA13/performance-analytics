import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";
import Sessoes from "./pages/Sessoes";
import Estatisticas from "./pages/Estatisticas";

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/">Dashboard</Link>
                {" | "}
                <Link to="/usuarios">Usuários</Link>
                {" | "}
                <Link to="/sessoes">Sessões</Link>
                {" | "}
                <Link to="/estatisticas">Estatísticas</Link>
            </nav>

            <hr />

            <Routes>
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;