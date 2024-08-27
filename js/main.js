import ToDoItem from "../js/todoitem.js";
import TodoList from "../js/todolist.js";

const toDoList = new TodoList()

// launch app once ready 
document.addEventListener("readystatechange", (e) => { 
    if(e.target.readyState === "complete") { 
        initApp();
    }
})


const initApp = () => { 
    // add listeners
    const itemEntryForm = document.getElementById("itemEntryForm")
    itemEntryForm.addEventListener("submit", (event) => { 
        event.preventDefault()
        processSubmission()
    })

    document.getElementById("clearItems").addEventListener("click", () => { 
        const list = toDoList.getList()
        if (list.length) {
            const confirmed = confirm("Are you sure you want to delete all?")
            if (confirmed) { 
                toDoList.clearList()
                updateData(toDoList.getList())
                refreshPage()
            }
        }
    })
    // firebase getData
    // load list
    loadList()
    refreshPage()
    
}

const loadList = () => { 
    const storedList = localStorage.getItem("myList")
    if (typeof storedList !== "string") { 
        return
    }
    const parsedList = JSON.parse(storedList)
    console.log(parsedList)
    parsedList.forEach(item => { 
        const newToDo = createNewItem(item._id, item._item)
        console.log(item._id, item._item)
        toDoList.addItemToList(newToDo)
    })
}

const updateData = (listArray) => { 
    console.log(listArray)
    localStorage.setItem("myList", JSON.stringify(listArray))
} 


const refreshPage = () => { 
    clearListDisplay()
    renderList()
    clearItemEntryField()
    setFocusOnItemEntry()
}

const clearItemEntryField = () => {
    const input = document.getElementById("newItem")
    input.value = ""
}

const setFocusOnItemEntry = () => { 
    document.getElementById("newItem").focus()
}

const clearListDisplay = () => { 
    const parentElement = document.getElementById("listItems")
    deleteContent(parentElement)
}

const deleteContent = (parentElement) => { 
    let child = parentElement.lastElementChild; 
    while (child) {
        parentElement.removeChild(child)
        child = parentElement.lastElementChild
    }
}

const renderList = () => { 
    const list = toDoList.getList()
    list.forEach((item) => { 
        buildListItem(item)
    })
}

const buildListItem = (item) => { 
    const div = document.createElement("div")
    div.className = "item"
    const check = document.createElement("input")
    check.type = "checkbox"
    check.id = item.getId()
    check.tabIndex = 0
    const label = document.createElement("label")
    label.htmlFor = item.getId()
    label.textContent = item.getItem()
    div.appendChild(check)
    div.appendChild(label)
    const container = document.getElementById("listItems")
    container.appendChild(div)
    addClickListenerToCheckBox(check, label)
}

const addClickListenerToCheckBox = (check, label) => { 
    check.addEventListener("click", (e) => { 
        toDoList.removeItemFromList(check.id)
        updateData(toDoList.getList())
        setTimeout(() => {
            refreshPage()
        }, 1000);
    })
}
const processSubmission = () => { 
    const newEntryText = getNewEntry()
    if (!newEntryText.length) {
        return
    }
    const nextItemId = calcNextItemId()
    const toDoItem = createNewItem(nextItemId, newEntryText)
    toDoList.addItemToList(toDoItem)
    refreshPage()
    updateData(toDoList.getList())
}

const getNewEntry = () => { 
    return document.getElementById("newItem").value.trim()
}

const calcNextItemId = () => { 
    let nextItemId = 1
    const list = toDoList.getList()
    if (list.length > 0) { 
        nextItemId = list.length
    }
    return nextItemId
}

const createNewItem = (id, text) => { 
    const toDo = new ToDoItem()
    toDo.setId(id)
    toDo.setItem(text)
    return toDo
}

