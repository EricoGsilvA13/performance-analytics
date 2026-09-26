import { useEffect, useState } from "react";

import api from "../services/api";

import "../styles/usuario.css";

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

            const resposta =
                await api.get("/usuarios/listar");

            setUsuarios(resposta.data);

        } catch (error) {

            console.error(
                "Erro ao buscar usuários:",
                error
            );

            setErro(
                "Não foi possível carregar os usuários."
            );

        } finally {

            setCarregando(false);

        }
    }

    async function cadastrarUsuario(event) {

        event.preventDefault();

        setErro("");
        setMensagem("");

        if (!nome.trim() || !email.trim()) {

            setErro(
                "Preencha todos os campos."
            );

            return;
        }

        try {

            setCadastrando(true);

            await api.post(
                "/usuarios/criar",
                {
                    nome: nome.trim(),
                    email: email.trim()
                }
            );

            setMensagem(
                "Usuário cadastrado com sucesso!"
            );

            setNome("");
            setEmail("");

            await buscarUsuarios();

        } catch (error) {

            console.error(
                "Erro ao cadastrar usuário:",
                error
            );

            if (error.response) {

                setErro(
                    error.response.data?.detail ||
                    "Não foi possível cadastrar o usuário."
                );

            } else {

                setErro(
                    "Não foi possível conectar ao servidor."
                );
            }

        } finally {

            setCadastrando(false);

        }
    }

    async function excluirUsuario(id) {

        const confirmar =
            window.confirm(
                "Tem certeza que deseja excluir este usuário?"
            );

        if (!confirmar) {
            return;
        }

        setErro("");
        setMensagem("");

        try {

            setExcluindo(id);

            await api.delete(
                `/usuarios/excluir/${id}`
            );

            setMensagem(
                "Usuário excluído com sucesso!"
            );

            await buscarUsuarios();

        } catch (error) {

            console.error(
                "Erro ao excluir usuário:",
                error
            );

            setErro(
                "Não foi possível excluir o usuário."
            );

        } finally {

            setExcluindo(null);

        }
    }

    return (

        <div className="usuario-page">

            <div className="usuario-container">

                <div className="usuario-header">

                    <h2>Usuários</h2>

                    <p>
                        Gerenciamento dos usuários do sistema
                    </p>

                </div>

                {mensagem && (
                    <div className="usuario-success">
                        {mensagem}
                    </div>
                )}

                {erro && (
                    <div className="usuario-error">
                        {erro}
                    </div>
                )}

                <div className="usuario-form-card">

                    <h2>
                        Cadastrar usuário
                    </h2>

                    <form
                        className="usuario-form"
                        onSubmit={cadastrarUsuario}
                    >

                        <div className="usuario-field">

                            <label htmlFor="nome">
                                Nome
                            </label>

                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(event) =>
                                    setNome(event.target.value)
                                }
                                placeholder="Nome do usuário"
                            />

                        </div>

                        <div className="usuario-field">

                            <label htmlFor="email">
                                E-mail
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="email@exemplo.com"
                            />

                        </div>

                        <button
                            className="usuario-button"
                            type="submit"
                            disabled={cadastrando}
                        >
                            {cadastrando
                                ? "Cadastrando..."
                                : "Cadastrar"}
                        </button>

                    </form>

                </div>

                <div className="usuario-table-card">

                    {carregando ? (

                        <p className="usuario-loading">
                            Carregando usuários...
                        </p>

                    ) : usuarios.length === 0 ? (

                        <p className="usuario-empty">
                            Nenhum usuário encontrado.
                        </p>

                    ) : (

                        <table className="usuario-table">

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>Nome</th>

                                    <th>E-mail</th>

                                    <th>Ação</th>

                                </tr>

                            </thead>

                            <tbody>

                                {usuarios.map((usuario) => (

                                    <tr key={usuario.id}>

                                        <td>
                                            {usuario.id}
                                        </td>

                                        <td>
                                            {usuario.nome}
                                        </td>

                                        <td>
                                            {usuario.email}
                                        </td>

                                        <td>

                                            <button
                                                className="usuario-delete"
                                                onClick={() =>
                                                    excluirUsuario(
                                                        usuario.id
                                                    )
                                                }
                                                disabled={
                                                    excluindo ===
                                                    usuario.id
                                                }
                                            >
                                                {excluindo ===
                                                usuario.id
                                                    ? "Excluindo..."
                                                    : "Excluir"}
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Usuarios;