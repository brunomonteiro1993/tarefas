import { useEffect, useState } from "react";
import api from "../api/api";
import "./Home.css";

const colors = [
  "#BAE2FF", "#B9FFDD", "#FFE8AC", "#FFCAB9", "#F99494",
  "#9DD6FF", "#ECA1FF", "#DAFF8B", "#FFA285", "#CDCDCD",
  "#979797", "#A99A7C"
];

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showColors, setShowColors] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const [headerVisible, setHeaderVisible] = useState(true);

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

    api.post("/tasks", {
      title,
      description,
      color: "#FFFFFF",
      is_favorite: isFavorite
    })
      .then(() => {
        setTitle("");
        setDescription("");
        setIsFavorite(false);
        fetchTasks();
      })
      .catch((error) => console.error("Erro ao adicionar tarefa:", error));
  };

  const toggleFavoriteNewTask = () => {
    setIsFavorite((prev) => !prev);
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
    const updatedTask = { ...task, is_favorite: !task.is_favorite };

    api.put(`/tasks/${task.id}`, updatedTask)
      .then(() => fetchTasks())
      .catch((error) => console.error("Erro ao favoritar/desfavoritar tarefa:", error));
  };

  const toggleEditMode = (task) => {
    if (editingTaskId === task.id) {
      updateTask(task.id, { title: tempTitle, description: tempDescription });
      setEditingTaskId(null);
    } else {
      setEditingTaskId(task.id);
      setTempTitle(task.title);
      setTempDescription(task.description);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
      (task.color?.toLowerCase().includes(searchTerm.toLowerCase()) || "");
    return matchesSearch;
  });

  return (
    <div className="dashboard container d-flex flex-column align-items-center mt-4">
      {!headerVisible && (
        <button
          onClick={() => setHeaderVisible(true)}
          className="open-header-btn position-fixed"
          style={{ top: "20px", right: "20px" }}
        >
          Abrir Header
        </button>
      )}
      {headerVisible && (
        <div className="header">
          <img src="/assets/header.svg" alt="" width="24" height="24" />
          <p className="pHeader">CoreNotes</p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Pesquisar notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setHeaderVisible(false)}
            className="close-header-btn position-fixed"
            style={{ top: "20px", right: "20px" }}
          >
            <img src="/assets/deletar.svg" alt="Fechar" width="24" height="24" />
          </button>
        </div>
      )}

      <form className="task-form w-100 p-4 border rounded shadow mt-5"
        onSubmit={addTask}>
        <div className="mb-3">
          <div className="d-flex align-items-center">
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              style={{ border: 'none' }}
            />
            <button
              type="button"
              onClick={toggleFavoriteNewTask}
              className={`favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
            >
              <img
                src={isFavorite ? "/assets/favoritoCor.svg" : "/assets/favorito.svg"}
                alt="Favorito"
                width="24"
                height="24"
              />
            </button>
          </div>
        </div>

        <hr className="hr-full-width" />

        <div className="mb-3">
          <textarea
            placeholder="Criar nota..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            rows="3"
            style={{ border: 'none' }}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary w-50">Adicionar</button>
        </div>
      </form>

      {["Favoritas", "Outras"].map((categoria, index) => (
        <div key={index} className="container mt-4">
          <h2 className="mb-3">{categoria}</h2>
          <div className="row">
            {filteredTasks
              .filter((task) => categoria === "Favoritas" ? task.is_favorite : !task.is_favorite)
              .map((task) => (
                <div key={task.id} className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
                  <div className={`task-card p-3 w-100 ${task.is_favorite ? "favorite-task" : ""}`}
                    style={{ backgroundColor: task.color }}>

                    {/* Cabeçalho da Tarefa */}
                    <div className="task-header">
                      {editingTaskId === task.id ? (
                        <input
                          type="text"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          className="task-title form-control"
                          style={{ backgroundColor: task.color }}
                        />
                      ) : (
                        <p className="task-title">{task.title}</p>
                      )}
                      <button onClick={() => toggleFavorite(task)}>
                        <img
                          src={task.is_favorite ? "/assets/favoritoCor.svg" : "/assets/favorito.svg"}
                          alt="Ícone de Favorito"
                          width="24"
                          height="24"
                        />
                      </button>
                    </div>

                    <hr
                      className="task-divider"
                      style={{
                        backgroundColor: task.color === "#FFFFFF" ? "#D9D9D9" : "#FFFFFF",
                        height: "2px",
                        width: "100%",
                        marginBottom: "20px",
                      }}
                    />


                    {/* Corpo da Tarefa */}
                    <div className="task-desc-container">
                      {editingTaskId === task.id ? (
                        <textarea
                          value={tempDescription}
                          onChange={(e) => setTempDescription(e.target.value)}
                          className="form-control"
                          style={{ backgroundColor: task.color }}
                        />
                      ) : (
                        <p className="task-desc">{task.description || "Sem descrição"}</p>
                      )}
                    </div>

                    {/* Rodapé da Tarefa */}
                    <div className="task-footer">
                      <div className="task-actions d-flex justify-content-between">
                        <div className="d-flex">
                          <button onClick={() => toggleEditMode(task)}>
                            <img src="/assets/editar.svg" alt="Editar" width="24" height="24" />
                          </button>
                          <button onClick={() => setShowColors(task.id === showColors ? null : task.id)}>
                            <img src="/assets/cor.svg" alt="Mudar Cor" width="24" height="24" />
                          </button>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="delete-btn">
                          <img src="/assets/deletar.svg" alt="Deletar" width="24" height="24" />
                        </button>
                      </div>

                      {/* Opções de cores */}
                      {showColors === task.id && (
                        <div className="color-options d-flex mt-2 position-absolute">
                          {colors.map((color) => (
                            <button
                              key={color}
                              style={{ backgroundColor: color, width: 25, height: 25 }}
                              className="border-0 rounded-circle m-1"
                              onClick={() => { updateTask(task.id, { color }); setShowColors(null); }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
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
