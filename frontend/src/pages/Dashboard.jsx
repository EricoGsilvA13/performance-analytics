import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
const [usuarios, setUsuarios] = useState([]);
const [usuarioId, setUsuarioId] = useState("");

const [estatistica, setEstatistica] = useState(null);

const [carregandoUsuarios, setCarregandoUsuarios] = useState(true);
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

        const resposta = await api.get("/usuarios/listar");

        setUsuarios(resposta.data);

        // Seleciona automaticamente o primeiro usuário
        if (resposta.data.length > 0) {
            setUsuarioId(resposta.data[0].id);
        }
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);

        if (error.response) {
            setErro(
                `Erro ${error.response.status}: ${
                    error.response.data?.detail ||
                    "Não foi possível buscar os usuários."
                }`
            );
        } else if (error.request) {
            setErro("O servidor não respondeu à requisição.");
        } else {
            setErro(`Erro: ${error.message}`);
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

        const resposta = await api.get(
            `/estatisticas/usuario/${id}`
        );

        setEstatistica(resposta.data);
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);

        if (error.response) {
            setErro(
                `Erro ${error.response.status}: ${
                    error.response.data?.detail ||
                    "Não foi possível buscar as estatísticas."
                }`
            );
        } else if (error.request) {
            setErro("O servidor não respondeu à requisição.");
        } else {
            setErro(`Erro: ${error.message}`);
        }
    } finally {
        setCarregandoEstatistica(false);
    }
}

function alterarUsuario(event) {
    setUsuarioId(Number(event.target.value));
}

const usuarioSelecionado = usuarios.find(
    (usuario) => usuario.id === usuarioId
);

return (
    <div>
        <h1>PERFORMANCE ANALYTICS</h1>

        <hr />

        <h2>Selecionar usuário</h2>

        {carregandoUsuarios ? (
            <p>Carregando usuários...</p>
        ) : (
            <select
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

        {usuarioSelecionado && (
            <h2>
                Usuário: {usuarioSelecionado.nome}
            </h2>
        )}

        {erro && <p>{erro}</p>}

        {carregandoEstatistica && (
            <p>Carregando estatísticas...</p>
        )}

        {estatistica && (
            <div>
                <div>
                    <h3>Taxa de Acerto</h3>

                    <p>
                        {estatistica.taxa_acerto.toFixed(2)}%
                    </p>
                </div>

                <div>
                    <h3>Taxa de Erro</h3>

                    <p>
                        {estatistica.taxa_erro.toFixed(2)}%
                    </p>
                </div>
            </div>
        )}
    </div>
);


}

export default Dashboard;
