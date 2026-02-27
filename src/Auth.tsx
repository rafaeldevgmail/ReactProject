import React, { useState } from "react";
import { supabase } from "./supabase";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Tab,
  Tabs,
  Alert,
} from "@mui/material";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Cadastro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const { error } =
      tab === 0
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text:
          tab === 0
            ? "Login realizado!"
            : "Verifique seu e-mail para confirmar a conta!",
      });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper
        elevation={6}
        sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 3 }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Entrar" />
          <Tab label="Cadastrar" />
        </Tabs>

        <form onSubmit={handleAuth}>
          <Stack spacing={2}>
            <Typography variant="h5" textAlign="center" fontWeight="bold">
              {tab === 0 ? "Bem-vindo de volta" : "Criar nova conta"}
            </Typography>

            {message.text && (
              <Alert severity={message.type as any}>{message.text}</Alert>
            )}

            <TextField
              label="E-mail"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Senha"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? "Processando..." : tab === 0 ? "Entrar" : "Cadastrar"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
