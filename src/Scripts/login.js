const email_input = document.querySelector(".email input");
const password_input = document.querySelector(".password input");

var email_flag, password_flag;

const validate_email = () => {
  const email_reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const email_value = email_input.value;
  const status = document.querySelector(".email span");
  if (email_value === "") {
    email_input.style.border = "1px solid red";
    status.innerHTML = "This field is required";
    status.style.color = "red";
    email_input.style.outline = "none";
    return false;
  } else if (!email_reg.test(email_value)) {
    email_input.style.border = "1px solid red";
    status.innerHTML = "Invalid email";
    status.style.color = "red";
    email_input.style.outline = "none";
    return false;
  } else {
    email_input.style.border = "1px solid rgba(0, 0, 0, 0.1)";
    status.innerHTML = "";
    return true;
  }
};

const validate_password = () => {
  const password_value = password_input.value;
  const status = document.querySelector(".password span");
  if (password_value === "") {
    password_input.style.border = "1px solid red";
    status.innerHTML = "This field is required";
    status.style.color = "red";
    password_input.style.outline = "none";
    return false;
  } else {
    password_input.style.border = "1px solid rgba(0, 0, 0, 0.1)";
    status.innerHTML = "";
    return true;
  }
};

email_input.addEventListener("blur", () => {
  email_flag = validate_email();
});
password_input.addEventListener("blur", () => {
  password_flag = validate_password();
});

const login_button = document.querySelector(".login_button");
login_button.addEventListener("click", async () => {
  email_flag = validate_email();
  password_flag = validate_password();
  if (email_flag && password_flag) {
    const email = email_input.value;
    const password = password_input.value;
    const url = "https://recruitment-api.pyt1.stg.jmr.pl/login";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: email,
        password: password,
      }),
    });

    
    const data = await response.json();
    const message = data.message;
    const status = data.status;

    if (status == 'error'){
      const status = document.querySelector(".login_button span");
      status.innerHTML = "Wrong username or password!";

      const email_input = document.querySelector(".email input");
      const password_input = document.querySelector(".password input");

      email_input.style.border = "1px solid red";
      password_input.style.border = "1px solid red";
    }
    else{
      window.location.href = './mainPage.html'
    }
  }
});
