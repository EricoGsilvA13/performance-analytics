import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>Performance</h2>
                <span>Analytics</span>
            </div>

            <nav className="sidebar-menu">

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/usuarios"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    Usuários
                </NavLink>

                <NavLink
                    to="/sessoes"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    Sessões
                </NavLink>

                <NavLink
                    to="/estatisticas"
                    className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                    }
                >
                    Estatísticas
                </NavLink>

            </nav>

        </aside>
    );
}

export default Sidebar;