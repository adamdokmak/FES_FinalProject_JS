// API: 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1'
// https://api.themoviedb.org/3/search/movie?query=${input}&include_adult=false&language=en-US&page=1

let apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNGYzZjQzMjlhNzA5ZWMwMmU3N2NmNTI1ZGRiOGE1YSIsInN1YiI6IjY1MTJlZDZmOGUyYmE2MDBlNDUxZTFmMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lppdx_WMWHzPM_V2xYBaSo636snaU8Vklq0J1iFijno'
let query = document.querySelector('.movies__container')

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
    }
};

document.addEventListener('DOMContentLoaded', function () {
    checkQueryAndFetch()
})

function checkQueryAndFetch() {
    let url = window.location.href
    let params = new URL(url).searchParams.get('search')
    if (params !== null && params !== '') {
        fetchData(params)
    } 
    else {
        getDefault()
    }
}

async function fetchData(params) {
    let apiURL = await fetch(`https://api.themoviedb.org/3/search/movie?query=${params}&include_adult=false&language=en-US&page=1`)
    renderPost(apiURL)
}

function movieHTML(movies) {
    return `<div class="movie__poster">
            <img src="https://image.tmdb.org/t/p/original/${movies.poster_path}" alt="">
            <div class="movie__poster--text regulated-z">
                <h1 class="movie__poster--title">${movies.title}</h1>
                <h2 class="movie__poster--sub-title">${movies.release_date.slice(0, 4)}</h2>
                <h3 class="movie__poster--rating">${Number(movies.vote_average).toFixed(1)}/10</h3>
            </div>
        </div>`
}

async function renderPost(data) {
    let dataFE = await data.json()
    let movies = dataFE.results
    query.innerHTML = movies.map((movies) => movieHTML(movies)).join('')
}

async function getDefault() {
    let data = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    await renderPost(data)
}

async function getSearchResult() {
    let userInput = document.getElementById('searchField').value
    urlTest()
    let data = await fetch(`https://api.themoviedb.org/3/search/movie?query=${userInput}&include_adult=false&language=en-US&page=1`, options)
    let url = window.location.href
    let params = new URL(url).searchParams
    if (params.get('search') === '') {
        getDefault()
    }
    await renderPost(data)
}

function redirectSearch() {
    let userInput = document.getElementById('searchField').value
    window.location.replace(`http://localhost:63342/FES_FinalProject_JS/movies.html?search=${userInput}`)
}


function urlTest() {
    let userInput = document.getElementById('searchField').value
    const newState = {page: 'search', query: `${userInput}`};
    const newTitle = 'Search Results for "example"';
    const newURL = `http://localhost:63342/FES_FinalProject_JS/movies.html?search=${userInput}`;
    history.pushState(newState, newTitle, newURL);
}

getDefault()
