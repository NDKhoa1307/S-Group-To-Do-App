function editPopUp(status) {
  return `<div class="edit_pop_up">
      <header>
        <h1>Edit task</h1>
        <div class="close">x</div>
      </header>
      <input type="text" class="category_input"/>
      <input type="text" class="title_input" />
      <input type="text" class="content_input" />
      <input type="datetime-local" class="time_input" />
      <div class="status_state">
        <div>
          <input
            type="radio"
            name="status"
            id="todo_check"
            ${status === "todo" ? "checked" : ""}
          />
          <span for="todo_check">Todo</span>
        </div>

        <div>
          <input 
            type="radio" 
            name="status" 
            id="doing_check" 
            ${status === "doing" ? "checked" : ""}
          />
          <span for="doing_check">Doing</span>
        </div>

        <div>
          <input
            type="radio"
            name="status"
            id="finished_check"
            ${status === "finished" ? "checked" : ""}
          />
          <span for="finished_check">Finished</span>
        </div>

        <div>
          <input
            type="radio"
            name="status"
            id="blocked_check"
            ${status === "blocked" ? "checked" : ""}
          />
          <span for="blocked_check">Blocked</span>
        </div>
      </div>
      <button class="sumbit">Sumbit</button>
    </div>`;
}

function newTaskPopUp() {
  return `<div class="new_task_pop_up">
      <header>
        <h1>Add new todo</h1>
        <span class="close">x</span>
      </header>
      <input type="text" class="category_input" placeholder = "Category. e.g: Marketing,..."/>
      <input type="text" class="title_input" placeholder = "Title"/>
      <input type="text" class="content_input" placeholder = "Content"/>
      <input type="datetime-local" class = "time_input" value = "${new Date()
        .toISOString()
        .slice(0, -5)}"/>
      <button class="sumbit">Sumbit</button>
    </div>`;
}

export { editPopUp, newTaskPopUp };
