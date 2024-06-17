const form = document.querySelector("#todoAddForm");
const addInput = document.querySelector("#todoName")
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0]
const secondCardBody = document.querySelectorAll(".card-body")[1]
const clearButton = document.querySelector("#clearButton")
const filterInput = document.querySelector("#todoSearch")
let sortingSelect = document.querySelector("#sortingSelect")
let todos = []

runEvents();

function runEvents() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", pageLoaded);
    secondCardBody.addEventListener("click", removeTodoToUI);
    // secondCardBody.addEventListener("click", editTodoToUI);
    secondCardBody.addEventListener("click", doneTodoToUI);
    clearButton.addEventListener("click", allTodosClear);
    filterInput.addEventListener("keyup", filter)
    sortingSelect.addEventListener("input", sort);
}

function pageLoaded() {
    checkTodosFromStorage();
    todos.forEach((todo) => { addTodoToUI(todo) }
    )
    saveData()
}
function sort(e) {
    const selectValue = e.target.value;
    var todoLists = document.querySelectorAll(".list-group-item");
    var checkedItems = [];
    var uncheckedItems = [];

    if (selectValue === "1") {
        todoLists.forEach((todo) => {
            if (todo.className.includes("checked")) {
                checkedItems.push(todo);
            } else {
                uncheckedItems.push(todo);
            }
        });

        todoList.innerHTML = "";

        checkedItems.forEach((item) => {
            todoList.appendChild(item);
        });

        uncheckedItems.forEach((item) => {
            todoList.appendChild(item);
        });
    }
    if (selectValue === "2") {
        todoLists.forEach((todo) => {
            if (todo.className.includes("checked")) {
                checkedItems.push(todo);
            } else {
                uncheckedItems.push(todo);
            }
        });

        todoList.innerHTML = "";
        uncheckedItems.forEach((item) => {
            todoList.appendChild(item);
        });
        checkedItems.forEach((item) => {
            todoList.appendChild(item);
        });
    }
    if (selectValue === "3") {
        var todoListsArray = Array.from(todoLists);
        todoListsArray.sort((a,b)=>a.textContent.localeCompare(b.textContent))
        todoList.innerHTML = "";
        todoListsArray.forEach((item) => {
            todoList.appendChild(item)
        })
    }
    if (selectValue === "4") {
        var todoListsArray = Array.from(todoLists);
        todoListsArray.sort((a,b)=>b.textContent.localeCompare(a.textContent))
        todoList.innerHTML = "";
        todoListsArray.forEach((item) => {
            todoList.appendChild(item)
        })
    }
}
function filter(e) {
    const filterValue = e.target.value.toLowerCase().trim();
    const todoLists = document.querySelectorAll(".list-group-item")
    if (todoLists.length > 0) {
        todoLists.forEach((todo) => {
            if (todo.textContent.toLowerCase().trim().includes(filterValue)) {
                todo.setAttribute("style", "display:block")
            }
            else {
                todo.setAttribute("style", "display:none !important")
            }
            saveData()
        })
    } else {
        showAlert("warning", "Todo yoxdur")
        saveData()
    }
}
function allTodosClear() {
    const todoList = document.querySelectorAll(".list-group-item")
    if (todoList.length > 0) {
        todoList.forEach((todo) => {
            todo.remove()
        })

        todos = []
        localStorage.setItem("todos", JSON.stringify(todos))
        showAlert("success", "Hamısı uğurla silindi")
    } else {
        showAlert("warning", "Silmək üçün ən azı 1 dənə olmalıdır.")
    }
}
function removeTodoToUI(e) {
    if (e.target.className === "fa fa-remove") {
        const todo = e.target.parentElement.parentElement;
        todo.remove()

        removeTodoFromStorage(todo.textContent);
        showAlert("danger", "Todo silindi")
    }
}
function removeTodoFromStorage(removeTodo) {
    checkTodosFromStorage();
    todos.forEach((todo, index) => {
        if (removeTodo === todo) {
            todos.splice(index, 1)
        }
    });
    saveData()
    // localStorage.setItem("todos", JSON.stringify(todos));
}
// function editTodoToUI(e) {
//     if (e.target.className === "fa-solid fa-pen-to-square") {
//         const todo = e.target.parentElement;
//         todo.textContent = addInput.value;
//     }
// }//editi de duzelt
function doneTodoToUI(e) {
    if (e.target.className === "fa-solid fa-check") {
        const todo = e.target.parentElement.parentElement;
        // todo.setAttribute("style", "background : green !important");
        // todo.style.color = "white"
        todo.className += " checked"
        console.log(todo.className)
        // doneTodoToStorage(todo)
        showAlert("success", "Uğurla tamamladınız")
        saveData()
    }
}
function saveData() {
    localStorage.setItem("todoList", todoList.innerHTML)
}
function showTask() {
    todoList.innerHTML = localStorage.getItem("todoList")
}
function addTodo(e) {
    const inputText = addInput.value.trim();
    if (inputText == null || inputText == "") {

        showAlert("warning", "Zəhmət olmasa Todo əlavə edin!")
        saveData()

    } else {
        addTodoToUI(inputText)
        addTodoToStorage(inputText);
        showAlert("success", "Todo əlavə olundu")
        saveData()
    }

    e.preventDefault();
}
function addTodoToUI(newTodo) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.textContent = newTodo;

    const a = document.createElement("a")
    a.href = "#"
    a.className = "delete-item"

    const iDelete = document.createElement("i");
    iDelete.className = "fa fa-remove";
    const iEdit = document.createElement("i")
    iEdit.className = "fa-solid fa-pen-to-square"
    const iDone = document.createElement("i");
    iDone.className = "fa-solid fa-check"

    a.appendChild(iDelete)
    a.appendChild(iDone)
    // a.appendChild(iEdit)
    li.appendChild(a)
    todoList.appendChild(li)
    addInput.value = "";
    saveData()
}
function addTodoToStorage(newTodo) {
    checkTodosFromStorage();
    todos.push(newTodo)
    // localStorage.setItem("todos", JSON.stringify(todos))
    saveData()

}
function checkTodosFromStorage(params) {
    if (localStorage.getItem("todos") === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem("todos"))
        saveData()
    }
}
function showAlert(type, message) {
    const div = document.createElement("div")
    div.className = "alert alert-" + type;
    div.textContent = message;
    firstCardBody.appendChild(div)
    setTimeout(() => {
        div.remove()
    }, 2500)
    saveData()
}
showTask()
