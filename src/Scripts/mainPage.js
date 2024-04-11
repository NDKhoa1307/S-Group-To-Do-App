import Task from "./components/task.js";
import { editPopUp, newTaskPopUp } from "./components/popUp.js";

var todoTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
todoTasks = todoTasks.filter((task) => task !== null);

var doingTasks = JSON.parse(localStorage.getItem("doingTasks")) || [];
doingTasks = doingTasks.filter((task) => task !== null);

var finishedTasks = JSON.parse(localStorage.getItem("finishedTasks")) || [];
finishedTasks = finishedTasks.filter((task) => task !== null);

var blockedTasks = JSON.parse(localStorage.getItem("blockedTasks")) || [];
blockedTasks = blockedTasks.filter((task) => task !== null);

// Render counter
const renderCounter = () => {
  const todo_counter = document.querySelector(".todo .counter");
  const doing_counter = document.querySelector(".doing .counter");
  const finished_counter = document.querySelector(".finished .counter");
  const blocked_counter = document.querySelector(".blocked .counter");

  let todoTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  let doingTasks = JSON.parse(localStorage.getItem("doingTasks")) || [];
  let finishedTasks = JSON.parse(localStorage.getItem("finishedTasks")) || [];
  let blockedTasks = JSON.parse(localStorage.getItem("blockedTasks")) || [];

  todo_counter.textContent = todoTasks.length;
  doing_counter.textContent = doingTasks.length;
  finished_counter.textContent = finishedTasks.length;
  blocked_counter.textContent = blockedTasks.length;
};

renderCounter();

const removeFunctionality = (task, status) => {
  let taskList = JSON.parse(localStorage.getItem(`${status}Tasks`)) || [];

  const category = task.querySelector(".category").textContent;
  const title_content = task.querySelector(".title_content").textContent;
  const content = task.querySelector(".content").textContent;
  const time = task.querySelector(".time").textContent;

  const delete_button = task.querySelector(".Trash");
  delete_button.style.cursor = "pointer";
  delete_button.addEventListener("click", () => {
    taskList = taskList.filter(
      (task) =>
        task.category !== category ||
        task.title_content !== title_content ||
        task.content !== content ||
        task.time.trim() !== time.trim()
    );
    task.remove();
    localStorage.setItem(`${status}Tasks`, JSON.stringify(taskList));

    renderCounter();
  });
};

const renderRemoveButton = (status) => {
  let taskList = JSON.parse(localStorage.getItem(`${status}Tasks`)) || [];
  const tasks = document.querySelectorAll(`.${status} li`);

  tasks.forEach((task) => {
    removeFunctionality(task, status);
  });
};

const editFunctionality = (task, status) => {
  if (
    document.querySelector(".new_task_pop_up") ||
    document.querySelector(".edit_pop_up")
  ) {
    return;
  }

  let taskList =
    JSON.parse(localStorage.getItem(`${status}Tasks`)).filter(
      (task) => task !== null
    ) || [];
  const edit_button = task.querySelector(".Edit");
  
  // Navigate and display menu
  const main = document.querySelector("main");
  main.insertAdjacentHTML("beforeend", editPopUp(status));
  const edit_pop_up = document.querySelector(".edit_pop_up");
  edit_pop_up.style.display = "flex";

  // Getting the value for input fields
  const category = edit_pop_up.querySelector(".category_input");
  const title_content = edit_pop_up.querySelector(".title_input");
  const content = edit_pop_up.querySelector(".content_input");
  const time = edit_pop_up.querySelector(".time_input");

  // Getting the original value of each tasks
  const category_value = task.querySelector(".category").textContent;
  const title_content_value = task.querySelector(".title_content").textContent;
  const content_value = task.querySelector(".content").textContent;
  const time_value = task
    .querySelector(".time")
    .textContent.trim()
    .split(" ")
    .join("T");

  // Setting the original value of each tasks
  category.value = category_value;
  title_content.value = title_content_value;
  content.value = content_value;
  time.value = time_value;

  // Submitting the changes
  const submit_button = document.querySelector(".edit_pop_up .sumbit");
  submit_button.style.cursor = "pointer";
  submit_button.addEventListener("click", () => {
    const validation = checkValidInput(edit_pop_up);
    if (!validation) {
      return;
    }

    const new_category = edit_pop_up.querySelector(".category_input").value;
    const new_title_content = edit_pop_up.querySelector(".title_input").value;
    const new_content = edit_pop_up.querySelector(".content_input").value;
    const new_time = edit_pop_up
      .querySelector(".time_input")
      .value.split("T")
      .join(" ");
    const new_status = edit_pop_up
      .querySelector(".status_state input:checked")
      .id.split("_")[0];

    task.querySelector(".category").textContent = new_category;
    task.querySelector(".title_content").textContent = new_title_content;
    task.querySelector(".content").textContent = new_content;
    task.querySelector(".time .time_content").textContent = new_time;

    taskList = taskList.map((task) => {
      if (
        task.category === category_value &&
        task.title_content === title_content_value &&
        task.content === content_value &&
        task.time === time_value.split("T").join(" ")
      ) {
        task.category = edit_pop_up.querySelector(".category_input").value;
        task.title_content = edit_pop_up.querySelector(".title_input").value;
        task.content = edit_pop_up.querySelector(".content_input").value;
        task.time = edit_pop_up
          .querySelector(".time_input")
          .value.split("T")
          .join(" ");
      }
      return task;
    });

    if (status !== new_status) {
      taskList = taskList.filter(
        (task) =>
          task.category !== category_value ||
          task.title_content !== title_content_value ||
          task.content !== content_value ||
          task.time !== time_value.split("T").join(" ")
      );
      const new_status_taskList =
        JSON.parse(localStorage.getItem(`${new_status}Tasks`)) || [];

      new_status_taskList.push({
        category: new_category,
        title_content: new_title_content,
        content: new_content,
        time: new_time,
      });
      task.remove();
      localStorage.setItem(`${status}Tasks`, JSON.stringify(taskList));
      localStorage.setItem(
        `${new_status}Tasks`,
        JSON.stringify(new_status_taskList)
      );
      edit_pop_up.remove();

      // Render new status task
      const new_status_list = document.querySelector(`.${new_status} ul`);
      const new_task = Task(
        new_category,
        new_title_content,
        new_content,
        new_time
      );
      new_status_list.insertAdjacentHTML("beforeend", new_task);
      renderRemoveButton(new_status);
      renderEditButtons(new_status);
      renderCounter();

      const new_status_tasks = document.querySelectorAll(`.${new_status} li`);
      new_status_tasks.forEach((task) => dragNormalElem(task, new_status));

      return;
    }

    localStorage.setItem(`${status}Tasks`, JSON.stringify(taskList));
    edit_pop_up.remove();
  });

  // Closing the pop up
  document.addEventListener("click", (e) => {
    if (!edit_pop_up.contains(e.target) && e.target !== edit_button) {
      edit_pop_up.remove();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      edit_pop_up.remove();
    }
  });

  const close_button = document.querySelector(".edit_pop_up .close");
  close_button.style.cursor = "pointer";
  close_button.addEventListener("click", () => {
    edit_pop_up.remove();
  });
};

// Render edit buttons
const renderEditButtons = (status) => {
  // Get tasklist from local storage
  let taskList =
    JSON.parse(localStorage.getItem(`${status}Tasks`)).filter(
      (task) => task !== null
    ) || [];

  if (taskList.length === 0) {
    return;
  }

  const tasks = document.querySelectorAll(`.${status} li`);
  tasks.forEach((task) => {
    const edit_button = task.querySelector(".Edit");
    edit_button.style.cursor = "pointer";
    edit_button.addEventListener("click", async () => {
      editFunctionality(task, status);
    });
  });
};

// Check if the input is valid
const checkValidInput = (pop_up) => {
  const category_input = pop_up.querySelector(".category_input");
  const title_input = pop_up.querySelector(".title_input");
  const content_input = pop_up.querySelector(".content_input");

  let category_flag = true;
  let title_flag = true;
  let content_flag = true;

  if (category_input.value.length === 0) {
    category_input.style.border = "1px solid red";
    category_flag = false;
  } else {
    category_input.style.border = "1px solid green";
  }

  if (title_input.value.length === 0) {
    title_input.style.border = "1px solid red";
    title_flag = false;
  } else {
    title_input.style.border = "1px solid green";
  }

  if (content_input.value.length === 0) {
    content_input.style.border = "1px solid red";
    content_flag = false;
  } else {
    content_input.style.border = "1px solid green";
  }

  return category_flag && title_flag && content_flag;
};

// Render tasks when the page is loaded
(() => {
  // Render todo tasks
  if (todoTasks.length > 0) {
    const todo_list = document.querySelector(".todo ul");
    todoTasks.forEach((task) => {
      const new_task = Task(
        task.category,
        task.title_content,
        task.content,
        task.time
      );
      todo_list.insertAdjacentHTML("beforeend", new_task);
    });
    renderRemoveButton("todo");
    renderEditButtons("todo");
    renderCounter();
  }
  // Render doing tasks
  if (doingTasks.length > 0) {
    const doing_list = document.querySelector(".doing ul");
    doingTasks.forEach((task) => {
      const new_task = Task(
        task.category,
        task.title_content,
        task.content,
        task.time
      );
      doing_list.insertAdjacentHTML("beforeend", new_task);
    });
    renderRemoveButton("doing");
    renderEditButtons("doing");
    renderCounter();
  }

  // Render finished tasks
  if (finishedTasks.length > 0) {
    const finished_list = document.querySelector(".finished ul");
    finishedTasks.forEach((task) => {
      const new_task = Task(
        task.category,
        task.title_content,
        task.content,
        task.time
      );
      finished_list.insertAdjacentHTML("beforeend", new_task);
    });
    renderRemoveButton("finished");
    renderEditButtons("finished");
    renderCounter();
  }

  // Render blocked tasks
  if (blockedTasks.length > 0) {
    const blocked_list = document.querySelector(".blocked ul");
    blockedTasks.forEach((task) => {
      const new_task = Task(
        task.category,
        task.title_content,
        task.content,
        task.time
      );
      blocked_list.insertAdjacentHTML("beforeend", new_task);
    });
    renderRemoveButton("blocked");
    renderEditButtons("blocked");
    renderCounter();
  }
})();

const new_task_button = document.querySelector(".adding_new_task");
new_task_button.addEventListener("click", () => {
  if (document.querySelector(".edit_pop_up", ".new_task_pop_up")) {
    return;
  }

  const main = document.querySelector("main");
  main.insertAdjacentHTML("beforeend", newTaskPopUp());
  const new_task_pop_up = document.querySelector(".new_task_pop_up");
  new_task_pop_up.style.display = "flex";
  document.addEventListener("click", (e) => {
    if (!new_task_pop_up.contains(e.target) && e.target !== new_task_button) {
      new_task_pop_up.remove();
    }
  });

  const submit_button = document.querySelector(".new_task_pop_up .sumbit");
  submit_button.addEventListener("click", () => {
    const validation = checkValidInput(new_task_pop_up);

    if (!validation) {
      return;
    }

    let category = new_task_pop_up.querySelector(".category_input").value;
    let title_content = new_task_pop_up.querySelector(".title_input").value;
    let content = new_task_pop_up.querySelector(".content_input").value;
    let time = new_task_pop_up
      .querySelector(".time_input")
      .value.split("T")
      .join(" ");

    const task = Task(category, title_content, content, time);
    const todo_list = document.querySelector(".todo ul");
    todo_list.insertAdjacentHTML("beforeend", task);

    todoTasks.push({
      category: category,
      title_content: title_content,
      content: content,
      time: time,
    });

    localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
    new_task_pop_up.remove();
    renderRemoveButton("todo");
    renderEditButtons("todo");
    renderCounter();
    const todo_tasks = document.querySelectorAll(".todo li");
    todo_tasks.forEach((task) => dragNormalElem(task, "todo"));
  });

  // Closing the pop up
  const close_button = document.querySelector(".new_task_pop_up .close");
  close_button.addEventListener("click", () => {
    new_task_pop_up.remove();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      new_task_pop_up.remove();
    }
  });
});

// Drag and drop elements for normal size window
const dragNormalElem = (elem, status) => {
  // Wipe mobile drag function
  elem.mouseDown = null;
  let dragElement = (elem) => {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    elem.onmousedown = (event) => {
      if (elem.querySelector(".edit").contains(event.target)) {
        if (elem.querySelector(".Edit").contains(event.target)) {
          return editFunctionality(elem, status);
        } else {
          return removeFunctionality(elem);
        }
      }
      return mouseDown(event);
    };

    elem.style.backgroundColor = "white";

    // Mouse down event
    function mouseDown(event) {
      event = event || window.event;
      event.preventDefault();
      pos3 = event.clientX;
      pos4 = event.clientY;

      elem.style.maxWidth = `${elem.offsetWidth}px`;
      elem.style.position = "fixed";
      elem.style.top = pos4 - elem.offsetHeight / 2 + "px";
      elem.style.left = pos3 - elem.offsetWidth / 2 + "px";
      elem.style.zIndex = "1";

      document.onmouseup = mouseUp;
      document.onmousemove = elementDrag;
    }

    // Element drag event
    function elementDrag(event) {
      event = event || window.event;
      event.preventDefault();
      pos1 = pos3 - event.clientX;
      pos2 = pos4 - event.clientY;
      pos3 = event.clientX;
      pos4 = event.clientY;
      elem.style.top = elem.offsetTop - pos2 + "px";
      elem.style.left = elem.offsetLeft - pos1 + "px";
    }

    // Mouse up event
    function mouseUp() {
      document.onmouseup = null;
      document.onmousemove = null;

      // Get bounding boxes dimension of elements
      const todo_list = document.querySelector(".todo");
      const doing_list = document.querySelector(".doing");
      const finished_list = document.querySelector(".finished");
      const blocked_list = document.querySelector(".blocked");

      if (pos3 < window.innerWidth / 2) {
        const todo_list_rect = todo_list.getBoundingClientRect();
        const doing_list_rect = doing_list.getBoundingClientRect();
        const middle_section =
          todo_list_rect.right +
          (doing_list_rect.left - todo_list_rect.right) / 2;
        if (pos3 <= middle_section) {
          var new_status = "todo";
        } else {
          var new_status = "doing";
        }
      } else {
        const finished_list_rect = finished_list.getBoundingClientRect();
        const blocked_list_rect = blocked_list.getBoundingClientRect();
        const middle_section =
          finished_list_rect.right +
          (blocked_list_rect.left - finished_list_rect.right) / 2;
        if (pos3 >= middle_section) {
          var new_status = "blocked";
        } else {
          var new_status = "finished";
        }
      }

      if (status !== new_status) {
        // Get the tasklist from local storage
        let taskList = JSON.parse(localStorage.getItem(`${status}Tasks`)) || [];

        // Get the task content
        const category = elem.querySelector(".category").textContent;
        const title_content = elem.querySelector(".title_content").textContent;
        const content = elem.querySelector(".content").textContent;
        const time = elem.querySelector(".time").textContent;

        // Remove the task from the current status
        taskList = taskList.filter(
          (task) =>
            task.category !== category ||
            task.title_content !== title_content ||
            task.content !== content ||
            task.time.trim() !== time.trim()
        );
        localStorage.setItem(`${status}Tasks`, JSON.stringify(taskList));

        // Add the task to the new status
        const new_status_taskList =
          JSON.parse(localStorage.getItem(`${new_status}Tasks`)) || [];

        new_status_taskList.push({
          category: category,
          title_content: title_content,
          content: content,
          time: time.trim(),
        });

        // Update the local storage
        localStorage.setItem(
          `${new_status}Tasks`,
          JSON.stringify(new_status_taskList)
        );

        // Remove the task from the current status
        elem.remove();

        // Adding the task to the new status
        const new_status_list = document.querySelector(`.${new_status} ul`);
        const new_task = Task(category, title_content, content, time);
        new_status_list.insertAdjacentHTML("beforeend", new_task);
      }

      // Reset mouseDown properties
      const new_status_tasks = document.querySelectorAll(`.${new_status} li`);
      new_status_tasks.forEach((task) => {
        if (window.innerWidth >= 1024) {
          dragNormalElem(task, new_status);
        } else {
          dragMobileElem(task, new_status);
        }
      });

      // Render buttons
      renderCounter();
      renderEditButtons(new_status);
      renderRemoveButton(new_status);

      // Reset the properties set on mouseDown
      elem.style.removeProperty("max-width");
      elem.style.position = "relative";
      elem.style.removeProperty("top");
      elem.style.removeProperty("left");
      elem.style.backgroundColor = "white";
      elem.style.zIndex = "0";
    }
  };

  elem.mouseDown = dragElement(elem);
  renderCounter();
  renderEditButtons(status);
  renderRemoveButton(status);
};

const dragMobileElem = (elem, status) => {
  elem.onmousedown = null;
};

window.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth >= 1024) {
    const todo_tasks = document.querySelectorAll(".todo li");
    const doing_tasks = document.querySelectorAll(".doing li");
    const finished_tasks = document.querySelectorAll(".finished li");
    const blocked_tasks = document.querySelectorAll(".blocked li");

    todo_tasks.forEach((task) => dragNormalElem(task, "todo"));
    doing_tasks.forEach((task) => dragNormalElem(task, "doing"));
    finished_tasks.forEach((task) => dragNormalElem(task, "finished"));
    blocked_tasks.forEach((task) => dragNormalElem(task, "blocked"));
  } else {
    const todo_tasks = document.querySelectorAll(".todo li");
    const doing_tasks = document.querySelectorAll(".doing li");
    const finished_tasks = document.querySelectorAll(".finished li");
    const blocked_tasks = document.querySelectorAll(".blocked li");

    todo_tasks.forEach((task) => dragMobileElem(task, "todo"));
    doing_tasks.forEach((task) => dragMobileElem(task, "doing"));
    finished_tasks.forEach((task) => dragMobileElem(task, "finished"));
    blocked_tasks.forEach((task) => dragMobileElem(task, "blocked"));
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    const todo_tasks = document.querySelectorAll(".todo li");
    const doing_tasks = document.querySelectorAll(".doing li");
    const finished_tasks = document.querySelectorAll(".finished li");
    const blocked_tasks = document.querySelectorAll(".blocked li");

    todo_tasks.forEach((task) => dragNormalElem(task, "todo"));
    doing_tasks.forEach((task) => dragNormalElem(task, "doing"));
    finished_tasks.forEach((task) => dragNormalElem(task, "finished"));
    blocked_tasks.forEach((task) => dragNormalElem(task, "blocked"));
  } else {
    const todo_tasks = document.querySelectorAll(".todo li");
    const doing_tasks = document.querySelectorAll(".doing li");
    const finished_tasks = document.querySelectorAll(".finished li");
    const blocked_tasks = document.querySelectorAll(".blocked li");

    todo_tasks.forEach((task) => dragMobileElem(task, "todo"));
    doing_tasks.forEach((task) => dragMobileElem(task, "doing"));
    finished_tasks.forEach((task) => dragMobileElem(task, "finished"));
    blocked_tasks.forEach((task) => dragMobileElem(task, "blocked"));
  }
});
