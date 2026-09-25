import { useEffect, useState } from "react";
import api from "../services/api";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [cadastrando, setCadastrando] = useState(false);
    const [excluindo, setExcluindo] = useState(null);

    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        buscarUsuarios();
    }, []);

    async function buscarUsuarios() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await api.get("/usuarios/listar");

            setUsuarios(resposta.data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);

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

    async function cadastrarUsuario(event) {
        event.preventDefault();

        setErro("");
        setMensagem("");

        if (!nome.trim() || !email.trim()) {
            setErro("Preencha o nome e o e-mail.");
            return;
        }

        try {
            setCadastrando(true);

            await api.post("/usuarios/criar", {
                nome: nome,
                email: email,
            });

            setMensagem("Usuário cadastrado com sucesso!");

            setNome("");
            setEmail("");

            await buscarUsuarios();
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);

            if (error.response) {
                setErro(
                    `Erro ${error.response.status}: ${
                        error.response.data?.detail ||
                        "Não foi possível cadastrar o usuário."
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

    async function excluirUsuario(usuarioId) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este usuário?"
        );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");

        try {
            setExcluindo(usuarioId);

            await api.delete(`/usuarios/excluir/${usuarioId}`);

            setMensagem("Usuário excluído com sucesso!");

            // Atualiza a lista após a exclusão
            await buscarUsuarios();
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);

            if (error.response) {
                setErro(
                    `Erro ${error.response.status}: ${
                        error.response.data?.detail ||
                        "Não foi possível excluir o usuário."
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
        return <p>Carregando usuários...</p>;
    }

    return (
        <div>
            <h1>Usuários</h1>

            <h2>Cadastrar usuário</h2>

            <form onSubmit={cadastrarUsuario}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <br />

                    <input
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                        placeholder="Digite o nome"
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="email">E-mail:</label>
                    <br />

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Digite o e-mail"
                    />
                </div>

                <br />

                <button type="submit" disabled={cadastrando}>
                    {cadastrando ? "Cadastrando..." : "Cadastrar"}
                </button>
            </form>

            <br />

            {mensagem && <p>{mensagem}</p>}

            {erro && <p>{erro}</p>}

            <hr />

            <h2>Lista de usuários</h2>

            {usuarios.length === 0 ? (
                <p>Nenhum usuário encontrado.</p>
            ) : (
                <ul>
                    {usuarios.map((usuario) => (
                        <li key={usuario.id}>
                            ID: {usuario.id} | Nome: {usuario.nome} | E-mail:{" "}
                            {usuario.email}{" "}

                            <button
                                onClick={() => excluirUsuario(usuario.id)}
                                disabled={excluindo === usuario.id}
                            >
                                {excluindo === usuario.id
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

export default Usuarios;