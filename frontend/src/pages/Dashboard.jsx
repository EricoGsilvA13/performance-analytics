import { useEffect, useState } from "react";

import api from "../services/api";

import "../styles/dashboard.css";

function Dashboard() {

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioId, setUsuarioId] = useState("");

    const [estatistica, setEstatistica] = useState(null);

    const [carregandoUsuarios, setCarregandoUsuarios] =
        useState(true);

    const [carregandoEstatistica, setCarregandoEstatistica] =
        useState(false);

    const [erro, setErro] = useState("");

    useEffect(() => {
        buscarUsuarios();
    }, []);

    async function buscarUsuarios() {

        try {

            setCarregandoUsuarios(true);
            setErro("");

            const resposta =
                await api.get("/usuarios/listar");

            setUsuarios(resposta.data);

            if (resposta.data.length > 0) {
                setUsuarioId(resposta.data[0].id);
            }

        } catch (error) {

            console.error(
                "Erro ao buscar usuários:",
                error
            );

            if (error.response) {

                setErro(
                    `Erro ${error.response.status}: ${
                        error.response.data?.detail ||
                        "Não foi possível buscar os usuários."
                    }`
                );

            } else if (error.request) {

                setErro(
                    "O servidor não respondeu à requisição."
                );

            } else {

                setErro(
                    `Erro: ${error.message}`
                );
            }

        } finally {

            setCarregandoUsuarios(false);

        }
    }

    useEffect(() => {

        if (usuarioId) {
            buscarEstatistica(usuarioId);
        }

    }, [usuarioId]);

    async function buscarEstatistica(id) {

        try {

            setCarregandoEstatistica(true);
            setErro("");
            setEstatistica(null);

            const resposta =
                await api.get(
                    `/estatisticas/usuario/${id}`
                );

            setEstatistica(resposta.data);

        } catch (error) {

            console.error(
                "Erro ao buscar estatísticas:",
                error
            );

            if (error.response) {

                setErro(
                    `Erro ${error.response.status}: ${
                        error.response.data?.detail ||
                        "Não foi possível buscar as estatísticas."
                    }`
                );

            } else if (error.request) {

                setErro(
                    "O servidor não respondeu à requisição."
                );

            } else {

                setErro(
                    `Erro: ${error.message}`
                );
            }

        } finally {

            setCarregandoEstatistica(false);

        }
    }

    function alterarUsuario(event) {

        const valor = event.target.value;

        setUsuarioId(
            valor ? Number(valor) : ""
        );
    }

    const usuarioSelecionado = usuarios.find(
        (usuario) => usuario.id === usuarioId
    );

    return (

        <div className="dashboard">

            <div className="dashboard-header">

                <div>

                    <h2>Visão geral</h2>

                    <p>
                        Acompanhamento do desempenho do usuário
                    </p>

                </div>

            </div>

            <div className="dashboard-user-selector">

                <label htmlFor="usuario">
                    Usuário
                </label>

                {carregandoUsuarios ? (

                    <p className="dashboard-loading">
                        Carregando usuários...
                    </p>

                ) : (

                    <select
                        id="usuario"
                        value={usuarioId}
                        onChange={alterarUsuario}
                    >

                        <option value="">
                            Selecione um usuário
                        </option>

                        {usuarios.map((usuario) => (

                            <option
                                key={usuario.id}
                                value={usuario.id}
                            >
                                {usuario.nome} - ID: {usuario.id}
                            </option>

                        ))}

                    </select>

                )}

            </div>

            {usuarioSelecionado && (

                <div className="dashboard-selected-user">

                    Usuário selecionado:{" "}
                    <strong>
                        {usuarioSelecionado.nome}
                    </strong>

                </div>

            )}

            {erro && (

                <div className="dashboard-error">
                    {erro}
                </div>

            )}

            {carregandoEstatistica && (

                <p className="dashboard-loading">
                    Carregando estatísticas...
                </p>

            )}

            {estatistica && (

                <div className="dashboard-cards">

                    <div className="dashboard-card success">

                        <h3>
                            Taxa de acerto
                        </h3>

                        <div className="dashboard-card-value">
                            {estatistica.taxa_acerto.toFixed(2)}%
                        </div>

                    </div>

                    <div className="dashboard-card error">

                        <h3>
                            Taxa de erro
                        </h3>

                        <div className="dashboard-card-value">
                            {estatistica.taxa_erro.toFixed(2)}%
                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;