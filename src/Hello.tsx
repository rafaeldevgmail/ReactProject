import React, { useState } from "react";
import {
  Box,
  Container,
  Stack,
  CardContent,
  Card,
  TextField,
  Button,
  Switch,
  Typography,
  Paper,
  Tab,
  Tabs,
  Alert,
} from "@mui/material";
// Importados os ícones
import { MdOutlineLightMode, MdOutlineDarkMode, MdAdd } from "react-icons/md";

const AddIcon = MdAdd as React.ElementType;
// Redeclarados os ícones como ElementType para o TypeScript não reclamar no Vite
const LightIcon = MdOutlineLightMode as React.ElementType;
const DarkIcon = MdOutlineDarkMode as React.ElementType;
export default function Hello() {
  return (
    <Stack spacing={3}>
      <Card elevation={0} sx={{ bgcolor: "background.paper", p: 1 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Olá!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Seu painel está atualizado. Hoje é&nbsp;
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            .
          </Typography>
        </CardContent>
      </Card>
      <Stack direction="row" spacing={2}>
        {/* <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ px: 3, py: 1.5, textTransform: "none", borderRadius: 10 }}
        >
          Novo Projeto
        </Button>

        <Button
          variant="outlined"
          sx={{ px: 3, py: 1.5, textTransform: "none", borderRadius: 10 }}
        >
          Configurações
        </Button> */}
      </Stack>
      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "action.hover",
          borderRadius: 4,
        }}
      >
        <Typography>Notificações Ativas</Typography>
        <Switch defaultChecked />
      </Box> */}
    </Stack>
  );
}
