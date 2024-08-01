/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 5 - 2024
 */
'use strict';

const INITIAL_FILMS = [
    // Data Structure: id, title, favorite, watchDate, rating
    [1, 'Big Data Processing and Analytics', 6, 30],
    [2, 'Computer Architecture', 10, 23],
    [3, 'Computer Network Technologies and Services', 6, 27],
    [4, 'Data Science and Data Base Technology', 8, 28],
    [5, 'Machine Learning and Pattern Regconigtion', 6, 26],
    [6, 'Software Engineering', 8, 30],
    [7, 'Web Application I', 6, 27],
    [8, 'System and Devices Programming', 10, ''],
    [9, 'Advance Machine Learning', 6, 25],
    [10, 'Large Language Model', 6, 26],
    [11, 'Computational Intelligent', 6, ''],
    [12, 'Network Security', 6, 24],
    [13, 'Machine Learning in Application', 6, 25],
    [14, 'Thesis', 30, ''],

];

// --- Selectors --- //
const filmsList = document.getElementById('films-list');
const filterLinks = document.querySelectorAll('#films-filters li a');

// --- Functions Definitions --- /

/******************
 *   Exercise 1   *
 ******************/

/**
 * Create a single film enclosed in a <li> tag.
 * @param {Film} film The film object.
 */
function createFilmInList(film) {

    const filmNode = document.createElement('li');
    filmNode.id = "film-" + film.id;
    filmNode.className = 'list-group-item';


    const filmContent = `<div class="row gy-2">
                        <div class="col-6 col-xl-3 favorite-title d-flex gap-2 align-items-center">
                            ${film.title}
                        </div>
                        <div class="col-3 col-xl-3 favorite-title d-flex gap-2 align-items-center">
                            ${film.credit}
                        </div>
                        <div class="col-3 col-xl-3 favorite-title d-flex gap-2 align-items-center">
                            ${film.grade}
                        </div>
                    </div>`;

    filmNode.innerHTML = filmContent;
    return filmNode;
}

/**
 * Fill the list of films with the given array of films
 * @param {Array<Film>} films The array of films to display.
 */
function createFilmsList(films) {
    for (const film of films) {
        const filmNode = createFilmInList(film);
        filmsList.appendChild(filmNode);
    }

    addEventListenersToFilms();
}

/**
 * Function to destroy the <ul></ul> list of films.
 */
function clearFilmsList() {
    filmsList.innerHTML = '';
}

/******************
 *   Exercise 2   *
 ******************/

/**
 * Function to manage film filtering in the web page.
 * @param {string}   filterId  The filter node id.
 * @param {string}   titleText The text to put in the film list content h1 header.
 * @param {function} filterFn  The function that does the filtering and returns an array of gilms.
 */
function filterFilms(filterId, titleText, filterFn) {
    // if called without parameters, repeat last used filter
    if (!filterId) ({ filterId, titleText, filterFn } = filterFilms.currentFilter);

    // Reset the appearance of all filters
    filterLinks.forEach(node => {
        node.classList.remove('active');
        node.classList.add('link-dark');
    });

    // Give the active appearance to the newly selected filter
    const activeFilter = document.getElementById(filterId);
    activeFilter.classList.add('active');
    activeFilter.classList.remove('link-dark');

    // Set the title of the film list
    document.getElementById("filter-title").innerText = titleText;

    clearFilmsList();
    createFilmsList(filterFn());

    // remember last used filter
    filterFilms.currentFilter = { filterId, titleText, filterFn };
}


const filmLibrary = new FilmLibrary();
INITIAL_FILMS.forEach(f => {
    filmLibrary.addNewFilm(new Film(...f));
});
createFilmsList(filmLibrary.list);

// --- Creating Event Listeners for filters --- //

/******************
 *   Exercise 3   *
 ******************/

/**
 * Add event listeners to the films in the list to manage the delete action.
 * Event listeners should be registered each time the list is re-rendered
 */
function addEventListenersToFilms() {
    Array.from(filmsList.children).forEach(filmNode => {
        const id = parseInt(filmNode.id.split('-')[1]);
        const deleteIcons = filmNode.querySelectorAll('.bi-trash');

        deleteIcons.forEach(icon => {
            icon.addEventListener('click', event => {
                filmLibrary.deleteFilm(id);
                filmNode.remove();
            });
        });
    });
}

// --- Model --- //
function Film(id, title, credit, grade) {
    this.id = id;
    this.title = title;
    this.credit = credit;
    this.grade = grade;
}


// --- Library --- //
function FilmLibrary() {
    this.list = [];

    this.addNewFilm = (film) => {
        if (!this.list.some(f => f.id === film.id))
            this.list.push(film);
        else
            throw new Error('Duplicate id');
    };

    this.deleteFilm = (id) => {
        const newList = this.list.filter(function (film, index, arr) {
            return film.id !== id;
        })
        this.list = newList;
    }

}
