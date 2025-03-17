# Gerenciador de Tarefas (CoreNotes)

Este é um projeto full-stack para gerenciamento de tarefas no estilo notas adesivas, permitindo cadastrar, editar, excluir, favoritar e organizar tarefas por cores.

## Tecnologias Utilizadas

### Frontend:
- React.js (Vite)
- Bootstrap 5
- Axios

### Backend:
- PHP
- MySQL
- Laravel

---

### 🔧 Pré-requisitos

1. [Instalar o Laragon](https://laragon.org/download/)
2. Ter o Node.js instalado (recomenda-se a versão LTS)
3. Ter o Composer instalado para gerenciar dependências do Laravel
4. Criar um banco de dados MySQL no Laragon chamado `tarefas_db`

---

##  Como Rodar o Backend (API)

1 - Configurar o Backend (Laravel) no Laragon
Copie a pasta do backend para o diretório do Laragon (C:\laragon\www\tarefas-api)
No terminal do Laragon, vá até a pasta do backend:

2- No terminal do Laragon, vá até a pasta do backend:
cd C:\laragon\www\corenotes-api

3- Instale as dependências do Laravel:
composer install

4- Copie o arquivo de configuração .env e edite com os dados do banco:
cp .env.example .env
Edite o .env e configure a conexão do banco de dados MySQL do Laragon:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tarefas_db
DB_USERNAME=root
DB_PASSWORD=admin

5- Gere a chave da aplicação
php artisan key:generate

6- Execute as migrações e seeders:
php artisan migrate --seed

7- Inicie o servidor:
php artisan serve

/*******-----******/

##  Como Rodar o Frontend
1- Abrir um terminal integrado na pasta tarefas-api

2- Instale as dependências no terminar usando o comando:
npm install

3- Inicie o servidor de desenvolvimento
npm run dev

/*******-----******/


O que foi feito?
- Implementação da funcionalidade de gerenciamento de tarefas no componente `Home`.
- Integração com a API Laravel para criar, listar, editar, deletar e favoritar tarefas.
- Adição da opção de pesquisar tarefas pelo título, descrição e cor.
- Implementação da funcionalidade de alteração de cor das tarefas com um seletor de cores.
- Melhoria na experiência de edição inline das tarefas (título e descrição).
- Implementação da funcionalidade de favoritar tarefas e categorizá-las em "Favoritas" e "Outras".
- Ajuste no layout utilizando Bootstrap para melhor responsividade e organização.

  Como foi feito?
- Utilização do `useState` para gerenciar o estado local das tarefas, títulos e descrições temporárias, favoritos e pesquisa.
- Uso do `useEffect` para buscar as tarefas da API assim que o componente for montado.
- Criação de funções para cada operação CRUD (`fetchTasks`, `addTask`, `updateTask`, `deleteTask`).
- Implementação de filtros dinâmicos para busca e categorização de tarefas.
- Uso de botões e inputs estilizados para melhorar a experiência do usuário ao editar e gerenciar tarefas.
- Aplicação de classes do Bootstrap para tornar a interface responsiva e visualmente agradável.

  Como testar?
1. Inicie o servidor da API Laravel e garanta que ele esteja rodando corretamente.
2. Inicie o projeto React com `npm run dev`.
3. Acesse a aplicação e realize as seguintes verificações:
   - Criar uma nova tarefa e verificar se ela aparece na lista.
   - Editar o título e a descrição de uma tarefa.
   - Alternar o status de favorito de uma tarefa.
   - Alterar a cor de uma tarefa e garantir que a atualização é persistida.
   - Pesquisar por uma tarefa pelo título, descrição ou cor.
   - Deletar uma tarefa e verificar se ela foi removida corretamente.
   - Alternar a exibição do cabeçalho para verificar o comportamento do botão de "Abrir Header".

  Observações
- Todas as requisições à API utilizam `axios` e tratam erros com `catch` para evitar falhas inesperadas.
- Foi aplicada uma estrutura modular para facilitar a manutenção do código.
- O código está pronto para receber futuras melhorias, como a reordenação de tarefas via `drag and drop`.




### 1️⃣ Clone o repositório
```sh
git clone https://github.com/brunomonteiro1993/tarefas.git
