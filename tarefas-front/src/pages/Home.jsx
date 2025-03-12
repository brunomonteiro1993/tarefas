import { useEffect, useState } from "react";
import api from "../api/api";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Buscar tarefas da API
  const fetchTasks = () => {
    api.get("/tasks")
      .then(response => setTasks(response.data))
      .catch(error => console.error("Erro ao carregar tarefas:", error));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Cadastrar nova tarefa
  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    api.post("/tasks", { title })
      .then(() => {
        setTitle("");
        fetchTasks();
      })
      .catch(error => console.error("Erro ao adicionar tarefa:", error));
  };

  // Marcar como favorita
  const toggleFavorite = (id, isFavorite) => {
    api.put(`/tasks/${id}`, { is_favorite: !isFavorite })
      .then(() => fetchTasks())
      .catch(error => console.error("Erro ao favoritar tarefa:", error));
  };

  return (
    <div>
      <h1>Minhas Tarefas</h1>

      {/* Formulário para adicionar tarefa */}
      <form onSubmit={addTask}>
        <input 
          type="text" 
          placeholder="Digite uma tarefa..." 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      {/* Lista de Tarefas */}
      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ flex: 1 }}>{task.title}</span>
            <button onClick={() => toggleFavorite(task.id, task.is_favorite)}>
              {task.is_favorite ? "★ Favorito" : "☆ Favoritar"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
