import { useEffect, useState } from "react";

import api from "../services/api";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line
} from "recharts";

import "../styles/dashboard.css";

function Dashboard() {

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioId, setUsuarioId] = useState("");

    const [sessoes, setSessoes] = useState([]);
    const [estatistica, setEstatistica] = useState(null);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarDashboard();
    }, []);

    async function carregarDashboard() {

        try {

            setCarregando(true);
            setErro("");

            const [
                usuariosResponse,
                sessoesResponse
            ] = await Promise.all([
                api.get("/usuarios/listar"),
                api.get("/sessoes/listar")
            ]);

            setUsuarios(usuariosResponse.data);
            setSessoes(sessoesResponse.data);

            if (usuariosResponse.data.length > 0) {

                setUsuarioId(
                    usuariosResponse.data[0].id
                );
            }

        } catch (error) {

            console.error(
                "Erro ao carregar dashboard:",
                error
            );

            if (error.response) {

                setErro(
                    `Erro ${error.response.status}: ${
                        error.response.data?.detail ||
                        "Não foi possível carregar os dados."
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

    useEffect(() => {

        if (usuarioId) {
            buscarEstatistica(usuarioId);
        }

    }, [usuarioId]);

    async function buscarEstatistica(id) {

        try {

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

            } else {

                setErro(
                    "Não foi possível conectar ao servidor."
                );
            }
        }
    }

    function alterarUsuario(event) {

        const valor = event.target.value;

        setUsuarioId(
            valor ? Number(valor) : ""
        );
    }

    /*
     * Sessões do usuário selecionado
     */
    const sessoesUsuario =
        sessoes.filter(
            (sessao) =>
                sessao.usuario_id === usuarioId
        );


    /*
     * ==========================
     * INDICADORES
     * ==========================
     */

    const totalSessoes =
        sessoesUsuario.length;

    const melhorPontuacao =
        sessoesUsuario.length > 0
            ? Math.max(
                ...sessoesUsuario.map(
                    (sessao) =>
                        sessao.pontuacao
                )
            )
            : 0;

    const pontuacaoMedia =
        sessoesUsuario.length > 0
            ? sessoesUsuario.reduce(
                (total, sessao) =>
                    total + sessao.pontuacao,
                0
            ) / sessoesUsuario.length
            : 0;

    const tempoTotalSegundos =
        sessoesUsuario.reduce(
            (total, sessao) =>
                total + sessao.duracao,
            0
        );

    const horas =
        Math.floor(
            tempoTotalSegundos / 3600
        );

    const minutos =
        Math.floor(
            (tempoTotalSegundos % 3600) / 60
        );

    const segundos =
        tempoTotalSegundos % 60;

    function formatarTempo() {

        if (horas > 0) {
            return `${horas}h ${minutos}min`;
        }

        if (minutos > 0) {
            return `${minutos}min ${segundos}s`;
        }

        return `${segundos}s`;
    }


    /*
     * ==========================
     * GRÁFICO DE ACERTOS / ERROS
     * ==========================
     */

    const dadosAcertosErros = [
        {
            nome: "Acertos",
            valor: sessoesUsuario.reduce(
                (total, sessao) =>
                    total + sessao.acertos,
                0
            )
        },
        {
            nome: "Erros",
            valor: sessoesUsuario.reduce(
                (total, sessao) =>
                    total + sessao.erros,
                0
            )
        }
    ];


    /*
     * ==========================
     * GRÁFICO DE PONTUAÇÃO
     * ==========================
     */

    const dadosPontuacao =
        sessoesUsuario.map(
            (sessao, index) => ({
                sessao: `Sessão ${index + 1}`,
                pontuacao: sessao.pontuacao
            })
        );


    /*
     * ==========================
     * EVOLUÇÃO DE DESEMPENHO
     * ==========================
     */

    const dadosEvolucao =
        sessoesUsuario.map(
            (sessao, index) => ({

                sessao: index + 1,

                pontuacao: sessao.pontuacao,

                acertos:
                    sessao.tentativas > 0
                        ? (
                            sessao.acertos /
                            sessao.tentativas
                        ) * 100
                        : 0
            })
        );


    /*
     * Usuário selecionado
     */

    const usuarioSelecionado =
        usuarios.find(
            (usuario) =>
                usuario.id === usuarioId
        );


    /*
     * Loading
     */

    if (carregando) {

        return (
            <div className="dashboard">

                <div className="dashboard-loading-container">

                    <p>
                        Carregando dashboard...
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="dashboard">

            <div className="dashboard-header">

                <div>

                    <h2>
                        Dashboard
                    </h2>

                    <p>
                        Visão geral do desempenho
                        do usuário
                    </p>

                </div>

            </div>


            {/* USUÁRIO */}

            <div className="dashboard-user-selector">

                <label htmlFor="usuario">
                    Usuário
                </label>

                <select
                    id="usuario"
                    value={usuarioId}
                    onChange={alterarUsuario}
                >

                    <option value="">
                        Selecione um usuário
                    </option>

                    {usuarios.map(
                        (usuario) => (

                            <option
                                key={usuario.id}
                                value={usuario.id}
                            >
                                {usuario.nome}
                                {" - ID: "}
                                {usuario.id}
                            </option>

                        )
                    )}

                </select>

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


            {usuarioSelecionado && (

                <>

                    {/* ==========================
                        CARDS
                    =========================== */}

                    <div className="dashboard-cards">

                        <div className="dashboard-card">

                            <div className="dashboard-card-icon">
                                📊
                            </div>

                            <div>

                                <h3>
                                    Total de sessões
                                </h3>

                                <div className="dashboard-card-value">
                                    {totalSessoes}
                                </div>

                                <span className="dashboard-card-description">
                                    Sessões realizadas
                                </span>

                            </div>

                        </div>


                        <div className="dashboard-card">

                            <div className="dashboard-card-icon">
                                🏆
                            </div>

                            <div>

                                <h3>
                                    Melhor pontuação
                                </h3>

                                <div className="dashboard-card-value">
                                    {melhorPontuacao}
                                </div>

                                <span className="dashboard-card-description">
                                    Maior pontuação registrada
                                </span>

                            </div>

                        </div>


                        <div className="dashboard-card">

                            <div className="dashboard-card-icon">
                                📈
                            </div>

                            <div>

                                <h3>
                                    Pontuação média
                                </h3>

                                <div className="dashboard-card-value">
                                    {pontuacaoMedia.toFixed(2)}
                                </div>

                                <span className="dashboard-card-description">
                                    Média das sessões
                                </span>

                            </div>

                        </div>


                        <div className="dashboard-card">

                            <div className="dashboard-card-icon">
                                ⏱️
                            </div>

                            <div>

                                <h3>
                                    Tempo total de uso
                                </h3>

                                <div className="dashboard-card-value">
                                    {formatarTempo()}
                                </div>

                                <span className="dashboard-card-description">
                                    Tempo acumulado
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ==========================
                        GRÁFICOS
                    =========================== */}

                    {sessoesUsuario.length > 0 && (

                        <div className="dashboard-charts">


                            {/* PIZZA */}

                            <div className="dashboard-chart-card">

                                <div className="dashboard-chart-header">

                                    <h2>
                                        Acertos e erros
                                    </h2>

                                    <span>
                                        Desempenho geral
                                    </span>

                                </div>

                                <div className="dashboard-chart">

                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >

                                        <PieChart>

                                            <Pie
                                                data={
                                                    dadosAcertosErros
                                                }
                                                dataKey="valor"
                                                nameKey="nome"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={95}
                                                label
                                            >

                                                <Cell fill="#16a34a" />

                                                <Cell fill="#dc2626" />

                                            </Pie>

                                            <Tooltip />

                                            <Legend />

                                        </PieChart>

                                    </ResponsiveContainer>

                                </div>

                            </div>


                            {/* BARRAS */}

                            <div className="dashboard-chart-card">

                                <div className="dashboard-chart-header">

                                    <h2>
                                        Pontuação por sessão
                                    </h2>

                                    <span>
                                        Comparação das sessões
                                    </span>

                                </div>

                                <div className="dashboard-chart">

                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >

                                        <BarChart
                                            data={
                                                dadosPontuacao
                                            }
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="sessao"
                                            />

                                            <YAxis />

                                            <Tooltip />

                                            <Bar
                                                dataKey="pontuacao"
                                                fill="#2563eb"
                                                radius={[
                                                    6,
                                                    6,
                                                    0,
                                                    0
                                                ]}
                                            />

                                        </BarChart>

                                    </ResponsiveContainer>

                                </div>

                            </div>


                            {/* LINHA */}

                            <div className="dashboard-chart-card dashboard-chart-full">

                                <div className="dashboard-chart-header">

                                    <div>

                                        <h2>
                                            Evolução de desempenho
                                        </h2>

                                        <span>
                                            Acompanhamento por sessão
                                        </span>

                                    </div>

                                </div>

                                <div className="dashboard-chart">

                                    <ResponsiveContainer
                                        width="100%"
                                        height={350}
                                    >

                                        <LineChart
                                            data={
                                                dadosEvolucao
                                            }
                                        >

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                            />

                                            <XAxis
                                                dataKey="sessao"
                                                label={{
                                                    value: "Sessão",
                                                    position: "insideBottom",
                                                    offset: -5
                                                }}
                                            />

                                            <YAxis />

                                            <Tooltip />

                                            <Legend />

                                            <Line
                                                type="monotone"
                                                dataKey="pontuacao"
                                                name="Pontuação"
                                                stroke="#2563eb"
                                                strokeWidth={3}
                                                dot={{
                                                    r: 5
                                                }}
                                                activeDot={{
                                                    r: 7
                                                }}
                                            />

                                            <Line
                                                type="monotone"
                                                dataKey="acertos"
                                                name="Taxa de acerto (%)"
                                                stroke="#16a34a"
                                                strokeWidth={3}
                                                dot={{
                                                    r: 5
                                                }}
                                            />

                                        </LineChart>

                                    </ResponsiveContainer>

                                </div>

                            </div>

                        </div>

                    )}


                    {sessoesUsuario.length === 0 && (

                        <div className="dashboard-empty">

                            <h3>
                                Nenhuma sessão encontrada
                            </h3>

                            <p>
                                Este usuário ainda não possui
                                sessões registradas.
                            </p>

                        </div>

                    )}


                    {/* ==========================
                        DESEMPENHO
                    =========================== */}

                    {estatistica && (

                        <div className="dashboard-section">

                            <div className="dashboard-section-header">

                                <h2>
                                    Desempenho geral
                                </h2>

                                <span>
                                    Taxas calculadas
                                </span>

                            </div>


                            <div className="dashboard-performance">

                                <div className="performance-item">

                                    <div className="performance-header">

                                        <span>
                                            Taxa de acerto
                                        </span>

                                        <strong>
                                            {estatistica.taxa_acerto.toFixed(2)}%
                                        </strong>

                                    </div>

                                    <div className="performance-bar">

                                        <div
                                            className="performance-bar-success"
                                            style={{
                                                width:
                                                    `${estatistica.taxa_acerto}%`
                                            }}
                                        />

                                    </div>

                                </div>


                                <div className="performance-item">

                                    <div className="performance-header">

                                        <span>
                                            Taxa de erro
                                        </span>

                                        <strong>
                                            {estatistica.taxa_erro.toFixed(2)}%
                                        </strong>

                                    </div>

                                    <div className="performance-bar">

                                        <div
                                            className="performance-bar-error"
                                            style={{
                                                width:
                                                    `${estatistica.taxa_erro}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                </>

            )}

        </div>
    );
}

export default Dashboard;