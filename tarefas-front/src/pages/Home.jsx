import { useEffect, useState } from "react";
import api from "../api/api";
import "./Home.css";

const colors = ["#FFEB3B", "#FF9800", "#F44336", "#4CAF50", "#2196F3", "#9C27B0", "#B0BEC5", "#8BC34A"];

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showColors, setShowColors] = useState(null);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    api.get("/tasks")
      .then(response => setTasks(response.data))
      .catch(error => console.error("Erro ao carregar tarefas:", error));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    api.post("/tasks", { title, description, color: selectedColor, is_favorite: false })
      .then(() => {
        setTitle("");
        setDescription("");
        fetchTasks();
      })
      .catch(error => console.error("Erro ao adicionar tarefa:", error));
  };

  const updateTask = (id, updatedData) => {
    api.put(`/tasks/${id}`, updatedData)
      .then(() => fetchTasks())
      .catch(error => console.error("Erro ao atualizar tarefa:", error));
  };

  const deleteTask = (id) => {
    api.delete(`/tasks/${id}`)
      .then(() => fetchTasks())
      .catch(error => console.error("Erro ao excluir tarefa:", error));
  };

  // Função para iniciar o arrasto
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  // Permitir que um item seja solto aqui
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Quando um item é solto, reorganizar a lista
  const handleDrop = (targetTask) => {
    if (!draggedTask || draggedTask.id === targetTask.id) return;

    const newTasks = [...tasks];
    const draggedIndex = newTasks.findIndex(t => t.id === draggedTask.id);
    const targetIndex = newTasks.findIndex(t => t.id === targetTask.id);

    newTasks.splice(draggedIndex, 1); 
    newTasks.splice(targetIndex, 0, draggedTask);

    setTasks(newTasks);
    setDraggedTask(null);

    // (Opcional) Atualizar a ordem no banco de dados
    api.put("/tasks/reorder", { tasks: newTasks.map(task => task.id) })
      .catch(error => console.error("Erro ao reordenar tarefas:", error));
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

      <h2>Favoritas</h2>
      <div className="task-container">
        {tasks.filter(task => task.is_favorite).map(task => (
          <div 
            key={task.id} 
            className={`task-card ${task.is_favorite ? 'favorite' : ''}`}
            style={{ backgroundColor: task.color }}
            draggable
            onDragStart={() => handleDragStart(task)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(task)}
          >
            <div className="task-header">
              <input 
                type="text" 
                value={task.title} 
                onChange={(e) => updateTask(task.id, { title: e.target.value })} 
                className="task-title"
              />
              <button 
                onClick={() => updateTask(task.id, { is_favorite: !task.is_favorite })} 
                className="fav-btn"
              >
                {task.is_favorite ? "★" : "☆"}
              </button>
            </div>
            <textarea 
              value={task.description} 
              onChange={(e) => updateTask(task.id, { description: e.target.value })} 
              className="task-desc"
            />
            <div className="task-actions">
              <button onClick={() => deleteTask(task.id)} className="delete-btn">🗑</button>
            </div>
          </div>
        ))}
      </div>

      <h2>Outras</h2>
      <div className="task-container">
        {tasks.filter(task => !task.is_favorite).map(task => (
          <div 
            key={task.id} 
            className="task-card"
            style={{ backgroundColor: task.color }}
            draggable
            onDragStart={() => handleDragStart(task)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(task)}
          >
            <div className="task-header">
              <input 
                type="text" 
                value={task.title} 
                onChange={(e) => updateTask(task.id, { title: e.target.value })} 
                className="task-title"
              />
              <button 
                onClick={() => updateTask(task.id, { is_favorite: !task.is_favorite })} 
                className="fav-btn"
              >
                {task.is_favorite ? "★" : "☆"}
              </button>
            </div>
            <textarea 
              value={task.description} 
              onChange={(e) => updateTask(task.id, { description: e.target.value })} 
              className="task-desc"
            />
            <div className="task-actions">
              <button onClick={() => deleteTask(task.id)} className="delete-btn">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
