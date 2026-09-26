import { useLocation } from "react-router-dom";

function Navbar() {

    const location = useLocation();

    function obterTitulo() {

        switch (location.pathname) {
            case "/":
                return "Dashboard";

            case "/usuarios":
                return "Usuários";

            case "/sessoes":
                return "Sessões";

            case "/estatisticas":
                return "Estatísticas";

            default:
                return "Performance Analytics";
        }
    }

    return (
        <header className="navbar">

            <div>
                <h1>{obterTitulo()}</h1>
                <p>Sistema de acompanhamento de desempenho</p>
            </div>

            <div className="navbar-status">
                <span className="status-indicator"></span>
                Sistema online
            </div>

        </header>
    );
}

export default Navbar;