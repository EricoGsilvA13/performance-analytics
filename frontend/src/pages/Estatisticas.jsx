import { useState } from "react";
import api from "../services/api";

function Estatisticas() {
    const [sessaoId, setSessaoId] = useState("");
    const [usuarioId, setUsuarioId] = useState("");

    const [estatisticaSessao, setEstatisticaSessao] = useState(null);
    const [estatisticaUsuario, setEstatisticaUsuario] = useState(null);

    const [carregandoSessao, setCarregandoSessao] = useState(false);
    const [carregandoUsuario, setCarregandoUsuario] = useState(false);

    const [erro, setErro] = useState("");

    async function buscarEstatisticaSessao(event) {
        event.preventDefault();

        setErro("");
        setEstatisticaSessao(null);

        if (!sessaoId) {
            setErro("Informe o ID da sessão.");
            return;
        }

        try {
            setCarregandoSessao(true);

            const resposta = await api.get(
                `/estatisticas/sessao/${sessaoId}`
            );

            setEstatisticaSessao(resposta.data);
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
            } else if (error.request) {
                setErro("O servidor não respondeu à requisição.");
            } else {
                setErro(`Erro: ${error.message}`);
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
            setErro("Informe o ID do usuário.");
            return;
        }

        try {
            setCarregandoUsuario(true);

            const resposta = await api.get(
                `/estatisticas/usuario/${usuarioId}`
            );

            setEstatisticaUsuario(resposta.data);
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
            } else if (error.request) {
                setErro("O servidor não respondeu à requisição.");
            } else {
                setErro(`Erro: ${error.message}`);
            }
        } finally {
            setCarregandoUsuario(false);
        }
    }

    return (
        <div>
            <h1>Estatísticas</h1>

            {erro && <p>{erro}</p>}

            <hr />

            <h2>Estatística da sessão</h2>

            <form onSubmit={buscarEstatisticaSessao}>
                <label htmlFor="sessaoId">
                    ID da sessão:
                </label>

                <br />

                <input
                    id="sessaoId"
                    type="number"
                    value={sessaoId}
                    onChange={(event) => setSessaoId(event.target.value)}
                    placeholder="Digite o ID da sessão"
                />

                <br />
                <br />

                <button
                    type="submit"
                    disabled={carregandoSessao}
                >
                    {carregandoSessao
                        ? "Consultando..."
                        : "Buscar estatística"}
                </button>
            </form>

            {estatisticaSessao && (
                <div>
                    <h3>Resultado da sessão</h3>

                    <p>
                        Sessão: {estatisticaSessao.sessao_id}
                    </p>

                    <p>
                        Taxa de acerto:{" "}
                        {estatisticaSessao.taxa_acerto.toFixed(2)}%
                    </p>

                    <p>
                        Taxa de erro:{" "}
                        {estatisticaSessao.taxa_erro.toFixed(2)}%
                    </p>
                </div>
            )}

            <hr />

            <h2>Estatística do usuário</h2>

            <form onSubmit={buscarEstatisticaUsuario}>
                <label htmlFor="usuarioId">
                    ID do usuário:
                </label>

                <br />

                <input
                    id="usuarioId"
                    type="number"
                    value={usuarioId}
                    onChange={(event) => setUsuarioId(event.target.value)}
                    placeholder="Digite o ID do usuário"
                />

                <br />
                <br />

                <button
                    type="submit"
                    disabled={carregandoUsuario}
                >
                    {carregandoUsuario
                        ? "Consultando..."
                        : "Buscar estatística"}
                </button>
            </form>

            {estatisticaUsuario && (
                <div>
                    <h3>Resultado do usuário</h3>

                    <p>
                        Usuário: {estatisticaUsuario.usuario_id}
                    </p>

                    <p>
                        Taxa de acerto:{" "}
                        {estatisticaUsuario.taxa_acerto.toFixed(2)}%
                    </p>

                    <p>
                        Taxa de erro:{" "}
                        {estatisticaUsuario.taxa_erro.toFixed(2)}%
                    </p>
                </div>
            )}
        </div>
    );
}

export default Estatisticas;