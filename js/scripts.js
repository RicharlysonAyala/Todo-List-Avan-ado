// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const todoList = document.querySelector("#todo-list");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

// Iniciando o valor antigo de alguma variável
let oldInputValue;


// Funções


// Criando a função de salvar o "Todo"
const saveTodo = (text, done = 0, save = 1) => {
    // Criando div para agrupar todos os elementos
    const todo = document.createElement("div");
    todo.classList.add("todo");

    // Criando o todo title e adicionando na div
    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    // Criando doneBtn e adicionando na div
    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = `<i class="fa-solid fa-check"></i>`
    todo.appendChild(doneBtn);

    // Criando editBtn e adicionando na div
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`
    todo.appendChild(editBtn);

    // Criando deleteBtn e adicionando na div
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`
    todo.appendChild(deleteBtn);

    // Utilizando dados da localStorage
    if (done) {
        todo.classList.add("done")
    }

    if (save) {
        saveTodoLocalStorage({text, done})
    }

    // Adicionando a div no todoList
    todoList.appendChild(todo);

    // Limpando valor do input após a criação da TodoList e focando
    todoInput.value = "";
    todoInput.focus();
}

// Criando função de esconder e mostrar a Edit-Form
const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

// Criando função para atribuir o novo valor da edição
const updateTodo = (text) => {
    // Selecionando todos os "todos"
    const todos = document.querySelectorAll(".todo")

    // Percorrendo os todos até chegar no "todo" a ser editado
    todos.forEach((todo) => {
        // Selecionando o título do "todo" percorrido
        let todoTitle = todo.querySelector("h3")

        // Validação para a troca de título
        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;

            updateTodosLocalStorage(oldInputValue, text);
        }
    })
}

// Criando função para buscar dos "todos"
const getSearchTodos = (search) => {
    // Selecionando todos os "todos"
    const todos = document.querySelectorAll(".todo")

    // Percorrendo os "todos" para a busca
    todos.forEach((todo) => {
        // Selecionando o título do todo percorrido
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();
        
        // Convertendo a pesquisa para mínusculas
        const normalizedSearch = search.toLowerCase();

        // Fazendo isso quando apagar a busca vai ficar vísivel ate não entrar no if
        todo.style.display = "flex";

        // Desaparecer "todos" que não tiverem o valor do search
        if (!todoTitle.includes(normalizedSearch)) {
            todo.style.display = "none";
        }
    });
}

// Criando função para fazer o filtro de busca
const filterTodos = (filterValue) => {
    // Selecionando todos os todos
    const todos = document.querySelectorAll(".todo")

    switch (filterValue) {
        // Se for all todos os "todos" serão mostrados
        case "all":
            todos.forEach((todo) => todo.style.display = "flex");
            break;
        
        // Se for done apenas os "todos" feitos serão mostrados
        case "done":
            todos.forEach((todo) =>
             todo.classList.contains("done")
              ? (todo.style.display = "flex") 
              : (todo.style.display = "none")
            );
            break;

        // Se for "todo" apenas os "todos" a fazer serão mostrados
        case "todo":
            todos.forEach((todo) =>
            !todo.classList.contains("done")
             ? (todo.style.display = "flex") 
             : (todo.style.display = "none")
            );
            break;
        
        // Caso não for nada retorna
        default:
            break;
    }
}


// Eventos


// Adicionar todo ao list
todoForm.addEventListener("submit", (e) => {
    // Tirando o envio do botão
    e.preventDefault();
    
    // Pegando o valor do botão
    const inputValue = todoInput.value;

    // Validação do botão
    if (inputValue) {
        saveTodo(inputValue);
    }
});

// Funcionalidade dos 3 botões do TodoList
document.addEventListener("click", (e) => {
    // Descobrindo o elemento pelo target e guardando na variável
    const targetEl = e.target;

    // Pegando a div mais proxima do elemento e guardando na variável
    const parentEl = targetEl.closest("div");

    // Guardando o título em uma variável
    let todoTitle;

    // Validando e adicionando o título na variável
    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    // Verificando se é o doneBtn e atribuindo ou removendo a classe done
    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");

        updateTodosStatusLocalStorage(todoTitle);
    }

    // Verificando se é o removeBtn e removendo a list
    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();

        removeTodoLocalStorage(todoTitle);
    }

    // Verificando se é o editBtn e editando a list
    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();

        // Atribuindo os valores do h3 na variavel e no input (Pois é uma edição)
        editInput.value = todoTitle;
        oldInputValue = todoTitle;

    }
});

// Sair da parte do edit
cancelEditBtn.addEventListener("click", (e) => {
    // Tirando o envio do botão
    e.preventDefault();

    toggleForms();
});

// Editando os valores
editForm.addEventListener("submit", (e) => {
    // Tirando o envio do botão
    e.preventDefault();

    // Pegando o novo valor do input para a edição
    const editInputValue = editInput.value;

    // Validação
    if (editInputValue) {
        updateTodo(editInputValue);
    }

    toggleForms();
});

// Funcionalidade de busca
searchInput.addEventListener("keyup", (e) => {
    // Guardando o valor do input em uma variável
    const search = e.target.value;
    
    getSearchTodos(search);
})

// Botão de apagar tudo na barra de pesquisa
eraseBtn.addEventListener("click", (e) => {
    // Tirando o envio do botão
    e.preventDefault();

    // Apagando tudo que estiver escrito dentro do input
    searchInput.value = "";

    // Resolvendo o problema de ao apertar o botão todos os "todos" sumir
    searchInput.dispatchEvent(new Event("keyup"));

    searchInput.focus();
})

// Troca dos filtros
filterBtn.addEventListener("change", (e) => {
    // Criando variável para salvar os valor do filter
    const filterValue = e.target.value;

    filterTodos(filterValue);
})

// Local Storage

// Criando função para pegar todos os "todos" da localStorage
const getTodosLocalStorage = () => {
    // Variável que vai guardar os "todos"
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
}

// Criando uma função para simplificar o algoritmo abaixo
const simplifyLoadTodos = (todos) => {
    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    });
}

// Criando função para carregar os dados da localStorage
const loadTodos = () => {
    // Pegando o array da localStorage ("todos")
    const todos = getTodosLocalStorage();

    // Percorrendo todos os "todos"
    simplifyLoadTodos(todos);
}

// Criando uma função para salvar os "Todos" na localStorage
const saveTodoLocalStorage = (todo) => {
    // Pegando o array da localStorage ("todos")
    const todos = getTodosLocalStorage();
    
    // Adicionando os valores no array
    todos.push(todo);

    // Salvando na local storage
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Criando uma função para simplificar o algoritmo abaixo
const simplifyRemoveTodo = (todos, todoText) => {
    // Percorrendo todos os "todos"
    const filteredTodos = todos.filter((todo) => todo.text !== todoText)

    return filteredTodos;
}

// Criando função para remover o "todo" da localStorage
const removeTodoLocalStorage = (todoText) => {
    // Pegando o array da localStorage ("todos")
    const todos = getTodosLocalStorage();

    // Filtrando apenas o todos os "todos" menos o que foi acionado o removeBtn
    const filteredTodos = simplifyRemoveTodo(todos, todoText);

    // Salvando na local storage
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

// Criando uma função para simplificar o algoritmo abaixo
const simplifyUpdateTodosStatus = (todos, todoText) => {
    todos.map((todo) => todo.text === todoText ? todo.done = !todo.done : null);
}

// Criando uma função para salvar o "todo" marcado com done
const updateTodosStatusLocalStorage = (todoText) => {
    // Pegando o array da localStorage ("todos")
    const todos = getTodosLocalStorage();

    // Editando o valor do done no localStorage caso a tarefa estiver concluida
    simplifyUpdateTodosStatus(todos, todoText);

    // Salvando na local storage
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Criando uma função para simplificar o algoritmo abaixo
const simplifyUpdateTodos = (todos, todoOldText, todoNewText) => {
    todos.map((todo) => todo.text === todoOldText ? todo.text = todoNewText : null);
}

// Criando uma função para alterar o valor do texto caso editar
const updateTodosLocalStorage = (todoOldText, todoNewText) => {
    // Pegando o array da localStorage ("todos")
    const todos = getTodosLocalStorage();

    // Editando o valor do text do "todo" caso a tarefa for editada
    simplifyUpdateTodos(todos, todoOldText, todoNewText);

    // Salvando na local storage
    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos();