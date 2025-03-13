import { useEffect, useState } from "react";
import api from "../api/api";
import "./Home.css";

const colors = [
  "#FFEB3B", "#FF9800", "#F44336", "#4CAF50", "#2196F3",
  "#9C27B0", "#B0BEC5", "#8BC34A", "#FFFFFF",
];

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showColors, setShowColors] = useState(null);
  const [editingDescription, setEditingDescription] = useState(null);
  const [tempDescriptions, setTempDescriptions] = useState({});
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    api.get("/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Erro ao carregar tarefas:", error));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    api.post("/tasks", { title, description, color: "#FFFFFF", is_favorite: false })
      .then(() => {
        setTitle("");
        setDescription("");
        fetchTasks();
      })
      .catch((error) => console.error("Erro ao adicionar tarefa:", error));
  };

  const updateTask = (id, updatedData) => {
    api.put(`/tasks/${id}`, updatedData)
      .then(() => fetchTasks())
      .catch((error) => console.error("Erro ao atualizar tarefa:", error));
  };

  const deleteTask = (id) => {
    api.delete(`/tasks/${id}`)
      .then(() => fetchTasks())
      .catch((error) => console.error("Erro ao excluir tarefa:", error));
  };

  const toggleFavorite = (task) => {
    updateTask(task.id, { is_favorite: !task.is_favorite });
  };

  const toggleDescriptionEdit = (task) => {
    if (editingDescription === task.id) {
      updateTask(task.id, { description: tempDescriptions[task.id] || "" });
      setEditingDescription(null);
    } else {
      setEditingDescription(task.id);
      setTempDescriptions((prev) => ({ ...prev, [task.id]: task.description }));
    }
  };

  return (
    <div className="dashboard">
      <h1>Minhas Tarefas</h1>
      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      {["Favoritas", "Outras"].map((categoria, index) => (
        <div key={index}>
          <h2>{categoria}</h2>
          <div className="task-container">
            {tasks
              .filter((task) => (categoria === "Favoritas" ? task.is_favorite : !task.is_favorite))
              .map((task) => (
                <div
                  key={task.id}
                  className="task-card"
                  style={{ backgroundColor: task.color, cursor: "grab" }}
                >
                  <div className="task-header">
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, { title: e.target.value })}
                      className="task-title"
                    />
                    <button onClick={() => toggleFavorite(task)} className="fav-btn">
                      {task.is_favorite ? "★" : "☆"}
                    </button>
                  </div>

                  <div className="task-desc-container">
                    {editingDescription === task.id ? (
                      <textarea
                        value={tempDescriptions[task.id] || ""}
                        onChange={(e) =>
                          setTempDescriptions((prev) => ({
                            ...prev,
                            [task.id]: e.target.value,
                          }))
                        }
                        className="task-desc-edit"
                      />
                    ) : (
                      <p className="task-desc">{task.description || "Sem descrição"}</p>
                    )}
                  </div>

                  <div className="task-actions">
                    <button onClick={() => toggleDescriptionEdit(task)} className="edit-desc-btn">
                      {editingDescription === task.id ? "💾 Salvar" : "✏️ Editar"}
                    </button>

                    <button
                      onClick={() => setShowColors(task.id === showColors ? null : task.id)}
                      className="color-picker-btn"
                    >
                      🎨
                    </button>

                    {showColors === task.id && (
                      <div className="color-options">
                        {colors.map((color) => (
                          <button
                            key={color}
                            style={{ backgroundColor: color }}
                            className="color-option"
                            onClick={() => {
                              updateTask(task.id, { color });
                              setShowColors(null);
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <button onClick={() => deleteTask(task.id)} className="delete-btn">
                      🗑
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
