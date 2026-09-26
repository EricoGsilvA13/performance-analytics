import { useEffect, useState } from "react";

import api from "../services/api";

import "../styles/sessao.css";

function Sessoes() {

    const [sessoes, setSessoes] = useState([]);

    const [usuarioId, setUsuarioId] = useState("");
    const [duracao, setDuracao] = useState("");
    const [tentativas, setTentativas] = useState("");
    const [acertos, setAcertos] = useState("");
    const [erros, setErros] = useState("");
    const [pontuacao, setPontuacao] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [cadastrando, setCadastrando] = useState(false);
    const [excluindo, setExcluindo] = useState(null);

    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        buscarSessoes();
    }, []);

    async function buscarSessoes() {

        try {

            setCarregando(true);
            setErro("");

            const resposta =
                await api.get("/sessoes/listar");

            setSessoes(resposta.data);

        } catch (error) {

            console.error(
                "Erro ao buscar sessões:",
                error
            );

            if (error.response) {

                setErro(
                    `Erro ${error.response.status}: ${
                        error.response.data?.detail ||
                        "Não foi possível buscar as sessões."
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

            setCarregando(false);

        }
    }

    async function cadastrarSessao(event) {

        event.preventDefault();

        setErro("");
        setMensagem("");

        if (
            !usuarioId ||
            !duracao ||
            !tentativas ||
            !acertos ||
            !erros ||
            !pontuacao
        ) {

            setErro(
                "Preencha todos os campos."
            );

            return;
        }

        try {

            setCadastrando(true);

            await api.post(
                "/sessoes/criar",
                {
                    usuario_id: Number(usuarioId),
                    duracao: Number(duracao),
                    tentativas: Number(tentativas),
                    acertos: Number(acertos),
                    erros: Number(erros),
                    pontuacao: Number(pontuacao),
                }
            );

            setMensagem(
                "Sessão cadastrada com sucesso!"
            );

            setUsuarioId("");
            setDuracao("");
            setTentativas("");
            setAcertos("");
            setErros("");
            setPontuacao("");

            await buscarSessoes();

        } catch (error) {

            console.error(
                "Erro ao cadastrar sessão:",
                error
            );

            if (error.response) {

                setErro(
                    `Erro ${error.response.status}: ${
                        error.response.data?.detail ||
                        "Não foi possível cadastrar a sessão."
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

            setCadastrando(false);

        }
    }

    async function excluirSessao(sessaoId) {

        const confirmar =
            window.confirm(
                "Tem certeza que deseja excluir esta sessão?"
            );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");

        try {

            setExcluindo(sessaoId);

            await api.delete(
                `/sessoes/excluir/${sessaoId}`
            );

            setMensagem(
                "Sessão excluída com sucesso!"
            );

            await buscarSessoes();

        } catch (error) {

            console.error(
                "Erro ao excluir sessão:",
                error
            );

            setErro(
                "Não foi possível excluir a sessão."
            );

        } finally {

            setExcluindo(null);

        }
    }

    return (

        <div className="sessao-page">

            <div className="sessao-container">

                <div className="sessao-header">

                    <h2>Sessões</h2>

                    <p>
                        Registro das sessões de desempenho
                    </p>

                </div>

                {mensagem && (
                    <div className="sessao-success">
                        {mensagem}
                    </div>
                )}

                {erro && (
                    <div className="sessao-error">
                        {erro}
                    </div>
                )}

                <div className="sessao-form-card">

                    <h2>
                        Cadastrar sessão
                    </h2>

                    <form
                        className="sessao-form"
                        onSubmit={cadastrarSessao}
                    >

                        <div className="sessao-field">

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
                                placeholder="ID do usuário"
                            />

                        </div>

                        <div className="sessao-field">

                            <label htmlFor="duracao">
                                Duração
                            </label>

                            <input
                                id="duracao"
                                type="number"
                                value={duracao}
                                onChange={(event) =>
                                    setDuracao(
                                        event.target.value
                                    )
                                }
                                placeholder="Duração"
                            />

                        </div>

                        <div className="sessao-field">

                            <label htmlFor="tentativas">
                                Tentativas
                            </label>

                            <input
                                id="tentativas"
                                type="number"
                                value={tentativas}
                                onChange={(event) =>
                                    setTentativas(
                                        event.target.value
                                    )
                                }
                                placeholder="Tentativas"
                            />

                        </div>

                        <div className="sessao-field">

                            <label htmlFor="acertos">
                                Acertos
                            </label>

                            <input
                                id="acertos"
                                type="number"
                                value={acertos}
                                onChange={(event) =>
                                    setAcertos(
                                        event.target.value
                                    )
                                }
                                placeholder="Acertos"
                            />

                        </div>

                        <div className="sessao-field">

                            <label htmlFor="erros">
                                Erros
                            </label>

                            <input
                                id="erros"
                                type="number"
                                value={erros}
                                onChange={(event) =>
                                    setErros(
                                        event.target.value
                                    )
                                }
                                placeholder="Erros"
                            />

                        </div>

                        <div className="sessao-field">

                            <label htmlFor="pontuacao">
                                Pontuação
                            </label>

                            <input
                                id="pontuacao"
                                type="number"
                                value={pontuacao}
                                onChange={(event) =>
                                    setPontuacao(
                                        event.target.value
                                    )
                                }
                                placeholder="Pontuação"
                            />

                        </div>

                        <button
                            className="sessao-submit"
                            type="submit"
                            disabled={cadastrando}
                        >
                            {cadastrando
                                ? "Cadastrando..."
                                : "Cadastrar sessão"}
                        </button>

                    </form>

                </div>

                <div className="sessao-list-card">

                    <h2>
                        Sessões registradas
                    </h2>

                    {carregando ? (

                        <p className="sessao-loading">
                            Carregando sessões...
                        </p>

                    ) : sessoes.length === 0 ? (

                        <p className="sessao-empty">
                            Nenhuma sessão encontrada.
                        </p>

                    ) : (

                        <div className="sessao-list">

                            {sessoes.map((sessao) => (

                                <div
                                    className="sessao-item"
                                    key={sessao.id}
                                >

                                    <div className="sessao-id">
                                        #{sessao.id}
                                    </div>

                                    <div className="sessao-info">

                                        <span className="sessao-label">
                                            Usuário
                                        </span>

                                        <span className="sessao-value">
                                            {sessao.usuario_id}
                                        </span>

                                    </div>

                                    <div className="sessao-info">

                                        <span className="sessao-label">
                                            Tentativas
                                        </span>

                                        <span className="sessao-value">
                                            {sessao.tentativas}
                                        </span>

                                    </div>

                                    <div className="sessao-info">

                                        <span className="sessao-label">
                                            Pontuação
                                        </span>

                                        <span className="sessao-value">
                                            {sessao.pontuacao}
                                        </span>

                                    </div>

                                    <div className="sessao-info">

                                        <span className="sessao-label">
                                            Data
                                        </span>

                                        <span className="sessao-value">
                                            {new Date(
                                                sessao.data_sessao
                                            ).toLocaleString()}
                                        </span>

                                    </div>

                                    <button
                                        className="sessao-delete"
                                        onClick={() =>
                                            excluirSessao(
                                                sessao.id
                                            )
                                        }
                                        disabled={
                                            excluindo ===
                                            sessao.id
                                        }
                                    >
                                        {excluindo ===
                                        sessao.id
                                            ? "Excluindo..."
                                            : "Excluir"}
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Sessoes;