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

const renderRemoveButton = (status) => {
  let taskList = JSON.parse(localStorage.getItem(`${status}Tasks`)) || [];
  const tasks = document.querySelectorAll(`.${status} li`);

  tasks.forEach((task) => {
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
      renderCounter();
      localStorage.setItem(`${status}Tasks`, JSON.stringify(taskList));
    });
  });
};

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
      if (
        document.querySelector(".new_task_pop_up") ||
        document.querySelector(".edit_pop_up")
      ) {
        return;
      }

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
      const title_content_value =
        task.querySelector(".title_content").textContent;
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
        const new_title_content =
          edit_pop_up.querySelector(".title_input").value;
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
            task.title_content =
              edit_pop_up.querySelector(".title_input").value;
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

      const close_button = document.querySelector(".edit_pop_up .close");
      close_button.style.cursor = "pointer";
      close_button.addEventListener("click", () => {
        edit_pop_up.remove();
      });
    });
  });
};

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

  const close_button = document.querySelector(".new_task_pop_up .close");
  close_button.addEventListener("click", () => {
    new_task_pop_up.remove();
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
  });
});

// Drag and drop elements for normal size window
const dragNormalElem = (elem) => {
  let dragElement = (elem) => {
    let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
    elem.onmousedown = mouseDown;
    elem.style.backgroundColor = "white";
    
    function mouseDown(e) {
      elem.style.maxWidth = "371px";
      elem.style.position = "absolute";
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      elem.style.top = pos3;
      elem.style.left = pos4;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elem.style.top = elem.offsetTop - pos2 + "px";
      elem.style.left = elem.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      elem.style.removeProperty("max-width");
      elem.style.position = "relative";
      elem.style.removeProperty("top");
      elem.style.removeProperty("left");
      elem.style.backgroundColor = "white";
    }
  };

  dragElement(elem);
};

window.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth > 768) {
    const todo_tasks = document.querySelectorAll(".todo li");
    const doing_tasks = document.querySelectorAll(".doing li");
    const finished_tasks = document.querySelectorAll(".finished li");
    const blocked_tasks = document.querySelectorAll(".blocked li");

    todo_tasks.forEach((task) => dragNormalElem(task));
    doing_tasks.forEach((task) => dragNormalElem(task));
    finished_tasks.forEach((task) => dragNormalElem(task));
    blocked_tasks.forEach((task) => dragNormalElem(task));
  }
});
