import { createClient } from "@supabase/supabase-js";

// No Vite, acesso às variáveis:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: Variáveis de ambiente do Supabase não encontradas!");
}

// Função de teste
const testConnection = async () => {
  const { data, error } = await supabase
    .from("SUA_TABELA")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Erro na conexão:", error.message);
  } else {
    console.log("Conectado com sucesso! Dados:", data);
  }
};

testConnection();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
