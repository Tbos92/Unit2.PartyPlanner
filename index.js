// define API URLS
const COHORT = "2407-FTB-ET-WEB-PT";
const eventsAPI_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const guestsAPI_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/guests`;
const rsvpsAPI_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/rsvps`;

// Define state
const state = {
  events: [],
};

// Define list of events and querySelect its location ID in index.html
const eventsList = document.querySelector("#events");

// Define the button used to add events to the site, queryselect to it in index.html
// then add event listener for button submit
const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

// Sync state with the API and rerender
async function render() {
  await getEvents();
  renderEvents();
}
render();

// Update state with events from API
async function getEvents() {
  try {
    const response = await fetch(eventsAPI_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

// Render events from state

function renderEvents() {
  // If no events, then display message to that effect
  if (!state.events.length) {
    eventsList.innerHTML = "<li>No Events Found.</li>";
    return;
  }
  // generate event details
  const eventCards = state.events.map((event) => {
    const eventCard = document.createElement("li");
    eventCard.innerHTML = `
    <h2>${event.name}</h2>
    <p>${event.description}</p>
    <p>${event.date}</p>
    <p>${event.location}</p>
    `;
    // add a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    eventCard.append(deleteButton);

    // access correct event id
    deleteButton.addEventListener("click", () => deleteEvent(event.id));

    // return the generated event details
    return eventCard;
  });
  eventsList.replaceChildren(...eventCards);
}

// ask API to delete event card and rerender
async function deleteEvent(id) {
  try {
    const response = await fetch(`${eventsAPI_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Event could not be deleted.");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
// Ask API to create new event based on form data
async function addEvent(event) {
  event.preventDefault();

  try {
    const response = await fetch(eventsAPI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: addEventForm.date.value,
        location: addEventForm.location.value,
      }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
