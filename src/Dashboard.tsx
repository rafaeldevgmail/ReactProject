import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  LabelList,
} from "recharts";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import {
  MdTrendingUp,
  MdPeople,
  MdAttachMoney,
  MdShowChart,
} from "react-icons/md";

// Paleta de Cores Premium
const COLORS = {
  primary: "#6366f1", // Indigo modern
  success: "#10b981", // Emerald
  danger: "#f43f5e", // Rose
  warning: "#f59e0b", // Amber
  text: "#64748b", // Slate
  grid: "#f1f5f9",
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>({
    sales: [],
    categories: [],
    performance: [],
    stats: { totalRevenue: 0, activeUsers: 0, conversion: 0 }, // Campos para os KPIs
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: sales } = await supabase
        .from("sales")
        .select("*")
        .order("created_at");
      const { data: cats } = await supabase
        .from("categories")
        .select("name, products(count)");
      const { data: perf } = await supabase
        .from("targets")
        .select("*, teams(team_name)");

      // --- CÁLCULOS DOS KPIs ---
      // Soma total da coluna 'amount' da tabela sales
      const totalRevenue =
        sales?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

      // Contagem de produtos totais (somando os counts das categorias)
      const totalProducts =
        cats?.reduce((acc, curr) => acc + (curr.products[0]?.count || 0), 0) ||
        0;

      setData({
        sales: sales || [],
        categories:
          cats?.map((c) => ({
            name: c.name,
            //produtos por categoria ou 0
            value: c.products[0]?.count || 0,
          })) || [],
        performance:
          perf?.map((p) => ({
            name: p.teams?.team_name || "Time",
            Meta: p.target_value,
            Realizado: p.achieved_value,
            //realizado / meta * 100 -> arredonda para inteiro
            pct: ((p.achieved_value / p.target_value) * 100).toFixed(0),
          })) || [],
        stats: {
          totalRevenue,
          activeUsers: totalProducts, // Exemplo: usando total de produtos como ativos
          conversion: (totalRevenue / 15000).toFixed(1), // Exemplo de lógica de conversão
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Componente de Tooltip Customizado (Padrão SaaS)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "white",
            p: 1.5,
            border: "1px solid #e2e8f0",
            borderRadius: 2,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            sx={{ mb: 0.5 }}
          >
            {label}
          </Typography>
          {payload.map((entry: any, i: number) => (
            <Typography
              key={i}
              variant="body2"
              sx={{ fontWeight: "bold", color: entry.color }}
            >
              {entry.name}:{" "}
              {entry.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress strokeWidth={2} />
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* 1. Header com Resumos (KPI Cards) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <KPICard
          title="Receita Total"
          value={data.stats.totalRevenue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={<MdAttachMoney />}
          trend="+12%"
        />
        <KPICard
          title="Conversão"
          value={`${data.stats.conversion}%`}
          icon={<MdShowChart />}
          trend="+0.4%"
        />
        <KPICard
          title="Ativos"
          value={data.stats.activeUsers.toLocaleString("pt-BR")}
          icon={<MdPeople />}
          trend="+18%"
        />
      </Grid>

      <Grid container spacing={3}>
        {/* 2. Gráfico de Área (Mais elegante que linha pura) */}
        <Grid item xs={12} md={8}>
          <StyledCard
            title="Performance de Vendas"
            subtitle="Evolução mensal de receita"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.sales}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.primary}
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.primary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={COLORS.grid}
                />
                <XAxis
                  dataKey="created_at"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: COLORS.text, fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: COLORS.text, fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </StyledCard>
        </Grid>

        {/* 3. Donut Chart com Centro Vazio */}
        <Grid item xs={12} md={4}>
          <StyledCard
            title="Mix de Produtos"
            subtitle="Distribuição por categoria"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categories}
                  innerRadius={70}
                  outerRadius={90}
                  dataKey="value"
                  paddingAngle={8}
                >
                  {data.categories.map((_: any, i: number) => (
                    <Cell
                      key={i}
                      fill={
                        [COLORS.primary, COLORS.success, COLORS.warning][i % 3]
                      }
                      cornerRadius={10}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </StyledCard>
        </Grid>

        {/* 4. Bar Chart com Gradiente e Porcentagem */}
        <Grid item xs={12}>
          <StyledCard
            title="Meta vs Realizado"
            subtitle="Comparativo de performance por equipe"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.performance} barGap={8}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={COLORS.grid}
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f1f5f9", radius: [10, 10, 0, 0] }} // Cria uma sombra fixa atrás da barra no hover
                  content={<CustomTooltip />}
                />
                <Legend align="right" verticalAlign="top" iconType="circle" />
                <Bar
                  dataKey="Meta"
                  fill="#9fe5ce"
                  radius={[4, 4, 4, 4]}
                  barSize={40}
                ></Bar>
                <Bar
                  dataKey="Realizado"
                  fill={COLORS.success}
                  radius={[4, 4, 4, 4]}
                  barSize={40}
                >
                  <LabelList
                    dataKey="pct"
                    position="top"
                    formatter={(val: string) => `${val}%`}
                    style={{
                      fill: COLORS.text,
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}

// Sub-componentes para manter o código limpo e elegante
function KPICard({ title, value, icon, trend }: any) {
  return (
    <Grid item xs={12} sm={4}>
      <Card sx={{ borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, textTransform: "uppercase" }}
            >
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", my: 0.5 }}>
              {value}
            </Typography>
            <Chip
              label={trend}
              size="small"
              sx={{
                bgcolor: "#ecfdf5",
                color: "#10b981",
                fontWeight: "bold",
                fontSize: "10px",
              }}
            />
          </Box>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f5f3ff",
              color: COLORS.primary,
              borderRadius: 3,
              fontSize: 30,
            }}
          >
            {icon}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}

function StyledCard({ title, subtitle, children }: any) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        border: "1px solid #f1f5f9",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 3 }}
        >
          {subtitle}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}
