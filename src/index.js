// Base URL for API
const baseURL = 'http://localhost:3000';

// Function to fetch films from the server
async function fetchFilms() {
    try {
        const response = await fetch(`${baseURL}/films`);
        if (!response.ok) {
            throw new Error('Failed to fetch films');
        }
        const films = await response.json();
        renderFilmList(films);
    } catch (error) {
        console.error(error);
    }
}

// Function to render the film list in the side menu
function renderFilmList(films) {
    const filmsList = document.getElementById('films');
    filmsList.innerHTML = ''; // Clear previous content
    films.forEach(film => {
        const li = document.createElement('li');
        li.textContent = film.title;
        li.classList.add('film', 'item');
        li.id = `film-${film.id}`; 
        li.addEventListener('click', () => renderFilmDetails(film));
        
        // delete button
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';

        deleteButton.classList.add('ui', 'button', 'positive', 'small','spacer');
        deleteButton.addEventListener('click', event => {
            event.stopPropagation(); // Prevents event propagation to the li element
            deleteFilm(film.id);
        });
        li.appendChild(deleteButton);

        filmsList.appendChild(li);
    });
}

// Function to render film details in the showing info section
function renderFilmDetails(film) {
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const filmInfo = document.getElementById('film-info');
    const showtime = document.getElementById('showtime');
    const ticketNum = document.getElementById('ticket-num');
    const buyTicketBtn = document.getElementById('buy-ticket');

    poster.src = film.poster;
    poster.alt = film.title;
    title.textContent = film.title;
    runtime.textContent = `${film.runtime} minutes`;
    filmInfo.textContent = film.description;
    showtime.textContent = film.showtime;
    const remainingTickets = film.capacity - film.tickets_sold;
    ticketNum.textContent = `${remainingTickets} remaining tickets`;

    if (remainingTickets <= 0) {
        buyTicketBtn.textContent = 'Sold Out';
        buyTicketBtn.disabled = true;
    } else {
        buyTicketBtn.textContent = 'Buy Ticket';
        buyTicketBtn.disabled = false;
        buyTicketBtn.onclick = () => buyTickets(film.id);
    }
}

// Function to buy tickets for a film
async function buyTickets(filmId) {
    try {
        // Fetch the film details to get the current number of tickets sold
        const response = await fetch(`${baseURL}/films/${filmId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch film details');
        }
        const film = await response.json();
        
        // Check if tickets are available
        if (film.tickets_sold >= film.capacity) {
            console.log('Tickets are sold out.');
            return;
        }
        
        // Increment the number of tickets sold
        film.tickets_sold++;
        
        // Update the film details on the server
        const updateResponse = await fetch(`${baseURL}/films/${filmId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tickets_sold: film.tickets_sold
            })
        });
        if (!updateResponse.ok) {
            throw new Error('Failed to update film details');
        }
        
        // Render the updated film details
        renderFilmDetails(film);
    } catch (error) {
        console.error(error);
    }
}

// Function to delete a film from the server and UI
async function deleteFilm(filmId) {
    try {
        const response = await fetch(`${baseURL}/films/${filmId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete film');
        }
        const filmItem = document.getElementById(`film-${filmId}`);
        if (filmItem) {
            filmItem.remove();
        }
    } catch (error) {
        console.error(error);
    }
}
fetchFilms();
