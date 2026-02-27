import React, { useState, useMemo, useEffect } from "react";
import Dashboard from "./Dashboard";
import Auth from "./Auth";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Badge,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Switch,
} from "@mui/material";
import { supabase } from "./supabase";
// Importados os ícones
import { MdOutlineLightMode, MdOutlineDarkMode, MdAdd } from "react-icons/md";
import { getCustomTheme } from "./theme";
import Hello from "./Hello";

// Redeclarados os ícones como ElementType para o TypeScript não reclamar no Vite
const LightIcon = MdOutlineLightMode as React.ElementType;
const DarkIcon = MdOutlineDarkMode as React.ElementType;
const AddIcon = MdAdd as React.ElementType;

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [status, setStatus] = useState<"conectando" | "online" | "erro">(
    "conectando"
  );
  // useMemo evita que o tema seja recalculado toda vez que o componente renderizar
  const theme = useMemo(() => getCustomTheme(darkMode), [darkMode]);
  const [session, setSession] = useState<any>(null);
  useEffect(() => {
    async function checkConnection() {
      try {
        const response = await supabase
          .from("any_table")
          .select("count", { count: "exact", head: true });

        // O status vem da resposta, não necessariamente de dentro do objeto error
        if (response.error) {
          if (response.status === 401) {
            setStatus("erro");
          } else {
            setStatus("online"); // Se for 404 (tabela não existe), a conexão está ok!
          }
        } else {
          setStatus("online");
        }
      } catch (err) {
        setStatus("erro");
      }
    }
    checkConnection();

    // 1. Pega a sessão atual ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Escuta mudanças (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "light" }}
          >
            DASHBOARD ANALYTICS
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Badge
              variant="dot"
              color={
                status === "online"
                  ? "success"
                  : status === "erro"
                  ? "error"
                  : "warning"
              }
            />
            <Typography
              variant="caption"
              sx={{ textTransform: "capitalize", fontWeight: "bold" }}
            >
              DB Status
            </Typography>
          </Box>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {/* Usadas as constantes tipadas aqui */}
            {darkMode ? <LightIcon /> : <DarkIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      {!session ? (
        <Auth />
      ) : (
        <Box sx={{ width: "100%" }}>
          <Hello />
          <Dashboard />
        </Box>
      )}
    </ThemeProvider>
  );
}
