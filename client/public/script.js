const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
const freeTry_element = document.getElementById("freeTry");
const remove_element = document.getElementById("form_input_data");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += ".";

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
              <div class="profile">
                      <img 
                        src=${isAi ? "bot.svg" : "user.svg"} 
                        alt="${isAi ? "bot" : "user"}" 
                      />
                  </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

export const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  // to clear the textarea input
  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // to focus scroll to the bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // specific message div
  const messageDiv = document.getElementById(uniqueId);

  // messageDiv.innerHTML = "..."
  loader(messageDiv);

  const response = await fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'

    typeText(messageDiv, parsedData);
    const freeTrail = localStorage.getItem("freeTrail");
    const FREE_TRAIL = JSON.parse(freeTrail);

    // Check if the element exists before modifying it
    if (freeTry_element) {
      if (FREE_TRAIL == 1) {
        const freeTrail = JSON.stringify(2);
        localStorage.setItem("freeTrail", freeTrail);
        freeTry_element.innerHTML = 2;
      } else if (FREE_TRAIL == 2) {
        const freeTrail = JSON.stringify(3);
        localStorage.setItem("freeTrail", freeTrail);
        freeTry_element.innerHTML = 3;
      } else if (FREE_TRAIL == 3) {
        const freeTrail = JSON.stringify(4);
        localStorage.setItem("freeTrail", freeTrail);
        freeTry_element.innerHTML = 4;
      } else if (FREE_TRAIL == 4) {
        const freeTrail = JSON.stringify(5);
        localStorage.setItem("freeTrail", freeTrail);
        freeTry_element.innerHTML = 5;
        remove_element.remove();
      } else if (FREE_TRAIL == "Pro Member") {
        // Handle pro member case (no further action needed here)
        console.log("Pro Member");
      } else {
        const freeTrail = JSON.stringify(1);
        localStorage.setItem("freeTrail", freeTrail);
        freeTry_element.innerHTML = 1;
      }
    } else {
      console.error("Element with id 'freeTry' not found.");
    }
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
