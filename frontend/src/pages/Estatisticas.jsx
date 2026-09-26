import { useState } from "react";

import api from "../services/api";

import "../styles/estatistica.css";

function Estatisticas() {

    const [sessaoId, setSessaoId] = useState("");
    const [usuarioId, setUsuarioId] = useState("");

    const [estatisticaSessao, setEstatisticaSessao] =
        useState(null);

    const [estatisticaUsuario, setEstatisticaUsuario] =
        useState(null);

    const [carregandoSessao, setCarregandoSessao] =
        useState(false);

    const [carregandoUsuario, setCarregandoUsuario] =
        useState(false);

    const [erro, setErro] = useState("");

    async function buscarEstatisticaSessao(event) {

        event.preventDefault();

        setErro("");
        setEstatisticaSessao(null);

        if (!sessaoId) {

            setErro(
                "Informe o ID da sessão."
            );

            return;
        }

        try {

            setCarregandoSessao(true);

            const resposta =
                await api.get(
                    `/estatisticas/sessao/${sessaoId}`
                );

            setEstatisticaSessao(
                resposta.data
            );

        } catch (error) {

            console.error(
                "Erro ao buscar estatística da sessão:",
                error
            );

            if (error.response) {

                setErro(
                    `Erro ${error.response.status}: ${
                        error.response.data?.detail ||
                        "Não foi possível buscar a estatística da sessão."
                    }`
                );

            } else {

                setErro(
                    "Não foi possível conectar ao servidor."
                );
            }

        } finally {

            setCarregandoSessao(false);

        }
    }

    async function buscarEstatisticaUsuario(event) {

        event.preventDefault();

        setErro("");
        setEstatisticaUsuario(null);

        if (!usuarioId) {

            setErro(
                "Informe o ID do usuário."
            );

            return;
        }

        try {

            setCarregandoUsuario(true);

            const resposta =
                await api.get(
                    `/estatisticas/usuario/${usuarioId}`
                );

            setEstatisticaUsuario(
                resposta.data
            );

        } catch (error) {

            console.error(
                "Erro ao buscar estatística do usuário:",
                error
            );

            if (error.response) {

                setErro(
                    `Erro ${error.response.status}: ${
                        error.response.data?.detail ||
                        "Não foi possível buscar a estatística do usuário."
                    }`
                );

            } else {

                setErro(
                    "Não foi possível conectar ao servidor."
                );
            }

        } finally {

            setCarregandoUsuario(false);

        }
    }

    return (

        <div className="estatistica-page">

            <div className="estatistica-container">

                <div className="estatistica-header">

                    <h2>Estatísticas</h2>

                    <p>
                        Análise de desempenho
                    </p>

                </div>

                {erro && (
                    <div className="estatistica-error">
                        {erro}
                    </div>
                )}

                {/* =========================
                    SESSÃO
                ========================= */}

                <div className="estatistica-section">

                    <h2>
                        Estatística da sessão
                    </h2>

                    <form
                        className="estatistica-form"
                        onSubmit={
                            buscarEstatisticaSessao
                        }
                    >

                        <div className="estatistica-field">

                            <label htmlFor="sessaoId">
                                ID da sessão
                            </label>

                            <input
                                id="sessaoId"
                                type="number"
                                value={sessaoId}
                                onChange={(event) =>
                                    setSessaoId(
                                        event.target.value
                                    )
                                }
                                placeholder="Digite o ID"
                            />

                        </div>

                        <button
                            className="estatistica-button"
                            type="submit"
                            disabled={
                                carregandoSessao
                            }
                        >
                            {carregandoSessao
                                ? "Consultando..."
                                : "Buscar estatística"}
                        </button>

                    </form>

                    {estatisticaSessao && (

                        <div className="estatistica-result">

                            <div className="estatistica-card acerto">

                                <h3>
                                    Taxa de acerto
                                </h3>

                                <div className="estatistica-value">

                                    {estatisticaSessao
                                        .taxa_acerto
                                        .toFixed(2)}
                                    %

                                </div>

                            </div>

                            <div className="estatistica-card erro">

                                <h3>
                                    Taxa de erro
                                </h3>

                                <div className="estatistica-value">

                                    {estatisticaSessao
                                        .taxa_erro
                                        .toFixed(2)}
                                    %

                                </div>

                            </div>

                        </div>

                    )}

                </div>

                {/* =========================
                    USUÁRIO
                ========================= */}

                <div className="estatistica-section">

                    <h2>
                        Estatística do usuário
                    </h2>

                    <form
                        className="estatistica-form"
                        onSubmit={
                            buscarEstatisticaUsuario
                        }
                    >

                        <div className="estatistica-field">

                            <label htmlFor="usuarioId">
                                ID do usuário
                            </label>

                            <input
                                id="usuarioId"
                                type="number"
                                value={usuarioId}
                                onChange={(event) =>
                                    setUsuarioId(
                                        event.target.value
                                    )
                                }
                                placeholder="Digite o ID"
                            />

                        </div>

                        <button
                            className="estatistica-button"
                            type="submit"
                            disabled={
                                carregandoUsuario
                            }
                        >
                            {carregandoUsuario
                                ? "Consultando..."
                                : "Buscar estatística"}
                        </button>

                    </form>

                    {estatisticaUsuario && (

                        <div className="estatistica-result">

                            <div className="estatistica-card acerto">

                                <h3>
                                    Taxa de acerto
                                </h3>

                                <div className="estatistica-value">

                                    {estatisticaUsuario
                                        .taxa_acerto
                                        .toFixed(2)}
                                    %

                                </div>

                            </div>

                            <div className="estatistica-card erro">

                                <h3>
                                    Taxa de erro
                                </h3>

                                <div className="estatistica-value">

                                    {estatisticaUsuario
                                        .taxa_erro
                                        .toFixed(2)}
                                    %

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Estatisticas;