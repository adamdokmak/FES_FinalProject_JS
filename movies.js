// API: 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1'
// https://api.themoviedb.org/3/search/movie?query=${input}&include_adult=false&language=en-US&page=1
// action: https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&page=1&with_genres=10759&without_genres=35%2C%2099%2C%2018%2C%2010751%2C10762%2C10763%2C10764%2C10767

let apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGYzZjQzMjlhNzA5ZWMwMmU3N2NmNTI1ZGRiOGE1YSIsInN1YiI6IjY1MTJlZDZmOGUyYmE2MDBlNDUxZTFmMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lppdx_WMWHzPM_V2xYBaSo636snaU8Vklq0J1iFijno'
let query = document.querySelector('.movies__container')
let noResult = document.querySelector('.nothing-found__screen')
let clearButton = document.querySelector('.clear-value')
let activeClass = document.querySelector('.filter')
let searchButton = document.querySelector('.search__button')
let searchField = document.getElementById('searchField')
let resultMessage = document.querySelector('.main__title')

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
    }
};

document.addEventListener('DOMContentLoaded', function () {
    checkQueryAndFetch()
    searchOrClear()
})

clearButton.addEventListener('click', function () {
    getDefault()
    urlUpdate()
})

async function checkQueryAndFetch() {
    let url = window.location.href
    let params = new URL(url).searchParams.get('search')
    if (params) {
        fetchData(params)
        searchField.value = params
        resultMessage.innerHTML = `Results for "${params}":`
    } else {
        getDefault()
    }
}

async function fetchData(params) {
    let apiURL = await fetch(`https://api.themoviedb.org/3/search/movie?query=${params}&include_adult=false&language=en-US&page=1`, options)
    renderPost(apiURL)
}

function urlUpdate() {
    let userInput = searchField.value
    const newState = {page: 'search', query: `${userInput}`};
    const newTitle = 'Find your movie';
    const newURL = `${window.location.origin}/FES_FinalProject_JS/movies.html?search=${userInput}`;
    history.pushState(newState, newTitle, newURL);
}

function searchOrClear() {
    if (searchField.value !== '') {
        searchButton.innerHTML = ''
        clearButton.innerHTML = `<i class="fa-solid fa-xmark" onClick="clearResults(); searchOrClear()"></i>`
    } else {
        clearButton.innerHTML = ''
        searchButton.innerHTML = `<i class="fa-solid fa-magnifying-glass" id="searchButton" onClick="getSearchResult(); searchOrClear()"></i>`
    }
}

async function renderPost(data) {
    document.querySelector('.movies__container').style.display = 'none'
    document.querySelector('.fa-spinner').style.display = 'block'
    let userInput = searchField.value
    let dataFE = await data.json()
    let movies = dataFE.results
    if (movies.length === 0) {
        resultMessage.innerHTML = `No results for "${userInput}":`
        document.querySelector('.fa-spinner').style.display = 'none'
        nothingFound()
    } else {
        noResult.innerHTML = ''
        query.innerHTML = movies.map((movies) => movieHTML(movies)).join('')
        document.querySelector('.movies__container').style.display = 'flex'
        document.querySelector('.fa-spinner').style.display = 'none'
    }
}

async function getDefault() {
    let data = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    await renderPost(data)
}

async function getSearchResult() {
    let userInput = searchField.value
    urlUpdate()
    let data;
    let url = window.location.href
    let params = new URL(url).searchParams
    if (userInput === '' && params.get('search') === '') {
        resultMessage.innerHTML = 'Top 20 movies:'
        data = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    } else {
        resultMessage.innerHTML = `Results for "${userInput}":`
        data = await fetch(`https://api.themoviedb.org/3/search/movie?query=${userInput}&include_adult=false&language=en-US&page=1`, options)
    }
    console.log(userInput)
    await renderPost(data)
}

function clearResults() {
    let filters = document.querySelectorAll('.filter');
    filters.forEach((filterElement) => filterElement.classList.remove('filter__active'));
    resultMessage.innerHTML = 'Top 20 movies:'
    let searchValue = document.getElementById('searchField')
    searchValue.value !== '' ? searchValue.value = "" : null
}

function nothingFound() {
    query.innerHTML = ''
    noResult.innerHTML =
        `<h1 class="no-result__text"> Sorry, we couldn't <br>find what you're searching for..</h1>
         <i class="fa-regular fa-face-frown-open"></i>`
}

function redirectSearch() {
    let userInput = searchField.value
    window.location.replace(`${window.location.origin}/FES_FinalProject_JS/movies.html?search=${userInput}`)
}

function movieHTML(movies) {
    let releaseDate = movies.release_date || movies.first_air_date || ''
    if (movies.poster_path) {
        return `<div class="movie__poster">
            <img src="https://image.tmdb.org/t/p/original/${movies.poster_path}" alt="">
            <div class="movie__poster--text regulated-z">
                <h1 class="movie__poster--title">${movies.title || movies.name}</h1>
                <h2 class="movie__poster--sub-title">${releaseDate.slice(0, 4)}</h2>
                <h3 class="movie__poster--rating">${Number(movies.vote_average).toFixed(1)}/10</h3>
            </div>
        </div>`
    } else {
        return `<div class="movie__poster">
            <img src="assets/noimage.webp" alt="" class="noimage">
            <div class="movie__poster--text regulated-z">
                <h1 class="movie__poster--title">${movies.title || movies.name}</h1>
                <h2 class="movie__poster--sub-title">${releaseDate.slice(0, 4)}</h2>
                <h3 class="movie__poster--rating">${Number(movies.vote_average).toFixed(1)}/10</h3>
            </div>
        </div>`
    }
}

function toggleActive(filter) {
    let filters = document.querySelectorAll('.filter');
    let filterClass = document.querySelector(`.${filter}`);
    if (!filterClass.className.includes('filter__active')) {
        filters.forEach(filter => {
            if (filter.className.includes('filter__active')) {
                filter.classList.remove('filter__active');
            }
        });
        filterClass.classList.add('filter__active');
    } else {
        filterClass.classList.remove('filter__active');
    }
}

async function filterAction() {
    let data = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&page=1&with_genres=10759&without_genres=35%2C%2099%2C%2018%2C%2010751%2C10762%2C10763%2C10764%2C10767`, options)
    let active = document.querySelector('.filter1')
    if (active.className.includes('filter__active')) {
        reloadDaTing()
        resultMessage.innerHTML = 'Action Movies:'
        renderPost(data)
    } else {
        reloadDaTing()
        resultMessage.innerHTML = 'Top 20 movies:'
        getDefault()
    }
}

async function filterComedy() {
    let data = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1&with_genres=35&without_genres=28%2C%2027%2C%2010749%2C%2053`, options)
    let active = document.querySelector('.filter2')
    if (active.className.includes('filter__active')) {
        reloadDaTing()
        resultMessage.innerHTML = 'Comedy Movies:'
        renderPost(data)
    } else {
        reloadDaTing()
        resultMessage.innerHTML = 'Top 20 movies:'
        getDefault()
    }
}

async function filterHorror() {
    let data = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1&with_genres=27&without_genres=28%2C%2035%2C%2010749%2C%2053`, options)
    let active = document.querySelector('.filter3')
    if (active.className.includes('filter__active')) {
        reloadDaTing()
        resultMessage.innerHTML = 'Horror Movies:'
        renderPost(data)
    } else {
        reloadDaTing()
        resultMessage.innerHTML = 'Top 20 movies:'
        getDefault()
    }
}

async function filterRomance() {
    let data = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1&with_genres=10749&without_genres=27%2C%20%2053%2C%2028`, options)
    let active = document.querySelector('.filter4')
    if (active.className.includes('filter__active')) {
        reloadDaTing()
        resultMessage.innerHTML = 'Romance Movies:'
        renderPost(data)
    } else {
        reloadDaTing()
        resultMessage.innerHTML = 'Top 20 movies:'
        getDefault()
    }
}

function btnLoadingState() {
    document.querySelector('.fa-magnifying-glass').style.display = 'none'
    document.querySelector('.fa-spinner').style.display = 'block'
}

function reloadDaTing() {
    urlUpdate()
    searchOrClear()
}

getDefault()
