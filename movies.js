// API: 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1'
// https://api.themoviedb.org/3/search/movie?query=${input}&include_adult=false&language=en-US&page=1

let apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGYzZjQzMjlhNzA5ZWMwMmU3N2NmNTI1ZGRiOGE1YSIsInN1YiI6IjY1MTJlZDZmOGUyYmE2MDBlNDUxZTFmMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lppdx_WMWHzPM_V2xYBaSo636snaU8Vklq0J1iFijno'
let query = document.querySelector('.movies__container')
let noResult = document.querySelector('.nothing-found__screen')
let clearButton = document.querySelector('.clear-value')
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
    const newTitle = 'Search Results for "example"';
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
    let userInput = searchField.value
    let dataFE = await data.json()
    let movies = dataFE.results
    if (movies.length === 0) {
        resultMessage.innerHTML = `No results for "${userInput}":`
        nothingFound()
    } else {
        noResult.innerHTML = ''
        query.innerHTML = movies.map((movies) => movieHTML(movies)).join('')
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
        resultMessage.innerHTML = 'Results:'
        data = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    } else {
        data = await fetch(`https://api.themoviedb.org/3/search/movie?query=${userInput}&include_adult=false&language=en-US&page=1`, options)
    }
    console.log(userInput)
    await renderPost(data)
}

function clearResults() {
    resultMessage.innerHTML = 'Results:'
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
    if (movies.poster_path) {
        return `<div class="movie__poster">
            <img src="https://image.tmdb.org/t/p/original/${movies.poster_path}" alt="">
            <div class="movie__poster--text regulated-z">
                <h1 class="movie__poster--title">${movies.title}</h1>
                <h2 class="movie__poster--sub-title">${movies.release_date.slice(0, 4)}</h2>
                <h3 class="movie__poster--rating">${Number(movies.vote_average).toFixed(1)}/10</h3>
            </div>
        </div>`
    } else {
        return `<div class="movie__poster">
            <img src="assets/noimage.webp" alt="" class="noimage">
            <div class="movie__poster--text regulated-z">
                <h1 class="movie__poster--title">${movies.title}</h1>
                <h2 class="movie__poster--sub-title">${movies.release_date.slice(0, 4)}</h2>
                <h3 class="movie__poster--rating">${Number(movies.vote_average).toFixed(1)}/10</h3>
            </div>
        </div>`
    }
}

getDefault()
