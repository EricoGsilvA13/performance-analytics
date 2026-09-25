import { useEffect, useState } from "react";
import api from "../services/api";

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

        const resposta = await api.get("/sessoes/listar");

        setSessoes(resposta.data);
    } catch (error) {
        console.error("Erro ao buscar sessões:", error);

        if (error.response) {
            setErro(
                `Erro ${error.response.status}: ${error.response.statusText}`
            );
        } else if (error.request) {
            setErro("O servidor não respondeu à requisição.");
        } else {
            setErro(`Erro: ${error.message}`);
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
        setErro("Preencha todos os campos.");
        return;
    }

    try {
        setCadastrando(true);

        await api.post("/sessoes/criar", {
            usuario_id: Number(usuarioId),
            duracao: Number(duracao),
            tentativas: Number(tentativas),
            acertos: Number(acertos),
            erros: Number(erros),
            pontuacao: Number(pontuacao),
        });

        setMensagem("Sessão cadastrada com sucesso!");

        setUsuarioId("");
        setDuracao("");
        setTentativas("");
        setAcertos("");
        setErros("");
        setPontuacao("");

        // Atualiza a lista após o cadastro
        await buscarSessoes();
    } catch (error) {
        console.error("Erro ao cadastrar sessão:", error);

        if (error.response) {
            setErro(
                `Erro ${error.response.status}: ${
                    error.response.data?.detail ||
                    "Não foi possível cadastrar a sessão."
                }`
            );
        } else if (error.request) {
            setErro("O servidor não respondeu à requisição.");
        } else {
            setErro(`Erro: ${error.message}`);
        }
    } finally {
        setCadastrando(false);
    }
}

async function excluirSessao(sessaoId) {
    const confirmar = window.confirm(
        "Tem certeza que deseja excluir esta sessão?"
    );

    if (!confirmar) {
        return;
    }

    setErro("");
    setMensagem("");

    try {
        setExcluindo(sessaoId);

        await api.delete(`/sessoes/excluir/${sessaoId}`);

        setMensagem("Sessão excluída com sucesso!");

        // Atualiza a lista após a exclusão
        await buscarSessoes();
    } catch (error) {
        console.error("Erro ao excluir sessão:", error);

        if (error.response) {
            setErro(
                `Erro ${error.response.status}: ${
                    error.response.data?.detail ||
                    "Não foi possível excluir a sessão."
                }`
            );
        } else if (error.request) {
            setErro("O servidor não respondeu à requisição.");
        } else {
            setErro(`Erro: ${error.message}`);
        }
    } finally {
        setExcluindo(null);
    }
}

if (carregando) {
    return <p>Carregando sessões...</p>;
}

return (
    <div>
        <h1>Sessões</h1>

        <h2>Cadastrar sessão</h2>

        <form onSubmit={cadastrarSessao}>
            <div>
                <label htmlFor="usuarioId">ID do usuário:</label>
                <br />

                <input
                    id="usuarioId"
                    type="number"
                    value={usuarioId}
                    onChange={(event) => setUsuarioId(event.target.value)}
                    placeholder="Digite o ID do usuário"
                />
            </div>

            <br />

            <div>
                <label htmlFor="duracao">Duração:</label>
                <br />

                <input
                    id="duracao"
                    type="number"
                    value={duracao}
                    onChange={(event) => setDuracao(event.target.value)}
                    placeholder="Duração da sessão"
                />
            </div>

            <br />

            <div>
                <label htmlFor="tentativas">Tentativas:</label>
                <br />

                <input
                    id="tentativas"
                    type="number"
                    value={tentativas}
                    onChange={(event) => setTentativas(event.target.value)}
                    placeholder="Número de tentativas"
                />
            </div>

            <br />

            <div>
                <label htmlFor="acertos">Acertos:</label>
                <br />

                <input
                    id="acertos"
                    type="number"
                    value={acertos}
                    onChange={(event) => setAcertos(event.target.value)}
                    placeholder="Número de acertos"
                />
            </div>

            <br />

            <div>
                <label htmlFor="erros">Erros:</label>
                <br />

                <input
                    id="erros"
                    type="number"
                    value={erros}
                    onChange={(event) => setErros(event.target.value)}
                    placeholder="Número de erros"
                />
            </div>

            <br />

            <div>
                <label htmlFor="pontuacao">Pontuação:</label>
                <br />

                <input
                    id="pontuacao"
                    type="number"
                    value={pontuacao}
                    onChange={(event) => setPontuacao(event.target.value)}
                    placeholder="Pontuação"
                />
            </div>

            <br />

            <button type="submit" disabled={cadastrando}>
                {cadastrando ? "Cadastrando..." : "Cadastrar sessão"}
            </button>
        </form>

        <br />

        {mensagem && <p>{mensagem}</p>}

        {erro && <p>{erro}</p>}

        <hr />

        <h2>Lista de sessões</h2>

        {sessoes.length === 0 ? (
            <p>Nenhuma sessão encontrada.</p>
        ) : (
            <ul>
                {sessoes.map((sessao) => (
                    <li key={sessao.id}>
                        ID: {sessao.id} | Usuário: {sessao.usuario_id} |
                        Duração: {sessao.duracao} | Tentativas:{" "}
                        {sessao.tentativas} | Acertos: {sessao.acertos} |
                        Erros: {sessao.erros} | Pontuação:{" "}
                        {sessao.pontuacao} | Data:{" "}
                        {new Date(sessao.data_sessao).toLocaleString()}
                        {" "}

                        <button
                            onClick={() => excluirSessao(sessao.id)}
                            disabled={excluindo === sessao.id}
                        >
                            {excluindo === sessao.id
                                ? "Excluindo..."
                                : "Excluir"}
                        </button>
                    </li>
                ))}
            </ul>
        )}
    </div>
);


}

export default Sessoes;
