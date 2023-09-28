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
let currentPage = 1


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

function movieHTML(movies) {
    let releaseDate = movies.release_date || movies.first_air_date || ''
    let movieTitle = movies.title || movies.name
    if (movies.poster_path) {
        return `<div class="movie__poster">
            <img class="poster__image" src="https://image.tmdb.org/t/p/original/${movies.poster_path}" loading="lazy" alt="Movies Poster">
            <div class="movie__poster--text regulated-z">
                <h1 class="movie__poster--title">${movieTitle}</h1>
                <h2 class="movie__poster--sub-title">${releaseDate.slice(0, 4)}</h2>
                <h3 class="movie__poster--rating">${Number(movies.vote_average).toFixed(1)}/10</h3>
            </div>
        </div>`
    } else {
        return `<div class="movie__poster">
            <img src="assets/noimage.webp" alt="Movies Poster" loading="lazy" class="noimage">
            <div class="movie__poster--text regulated-z">
                <h1 class="movie__poster--title">${movieTitle}</h1>
                <h2 class="movie__poster--sub-title">${releaseDate.slice(0, 4)}</h2>
                <h3 class="movie__poster--rating">${Number(movies.vote_average).toFixed(1)}/10</h3>
            </div>
        </div>`
    }
}

async function fetchData(params) {
    moviesLoadingState()
    let apiURL = await fetch(`https://api.themoviedb.org/3/search/movie?query=${params}&include_adult=false&language=en-US&page=1`, options)
    renderPost(apiURL)
}

function urlUpdate() {
    let userInput = searchField.value
    const newState = {page: 'search', query: `${userInput}`};
    const newTitle = 'Find your movie';
    const newURL = `${window.location.origin}/movies.html?search=${userInput}`;
    history.pushState(newState, newTitle, newURL);
}

function searchOrClear() {
    if (searchField.value !== '') {
        searchButton.innerHTML = ''
        clearButton.innerHTML = `<i class="fa-solid fa-xmark" onClick="clearResults(); searchOrClear()"></i>`
    } else {
        clearButton.innerHTML = ''
        searchButton.innerHTML = `<i class="fa-solid fa-magnifying-glass" id="searchButton" onClick="getSearchResult(); searchOrClear(); moviesLoadingState()"></i>`
    }
}

clearButton.addEventListener('click', function () {
    getDefault()
    urlUpdate()
})


function clearResults() {
    let filters = document.querySelectorAll('.filter');
    filters.forEach((filterElement) => filterElement.classList.remove('filter__active'));
    resultMessage.innerHTML = 'Top Movies:'
    let searchValue = document.getElementById('searchField')
    searchValue.value !== '' ? searchValue.value = "" : null
}

function nothingFound() {
    query.innerHTML = ''
    noResult.innerHTML =
        `<h1 class="no-result__text"> Sorry, we couldn't <br>find what you're searching for..</h1>
         <i class="fa-regular fa-face-frown-open"></i>`
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
    moviesLoadingState()
    let data = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&page=1&with_genres=10759&without_genres=35%2C%2099%2C%2018%2C%2010751%2C10762%2C10763%2C10764%2C10767`, options)
    let pageData = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&page=1&with_genres=10759&without_genres=35%2C%2099%2C%2018%2C%2010751%2C10762%2C10763%2C10764%2C10767`, options)
    let active = document.querySelector('.filter1')
    if (active.className.includes('filter__active')) {
        fetchURLAndSearch()
        resultMessage.innerHTML = 'Action Movies:'
        renderPost(data)
        pageUpdate(pageData)
    } else {
        fetchURLAndSearch()
        resultMessage.innerHTML = 'Top Movies:'
        getDefault()
    }
}

async function filterComedy() {
    moviesLoadingState()
    let data = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1&with_genres=35&without_genres=28%2C%2027%2C%2010749%2C%2053`, options)
    let pageData = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1&with_genres=35&without_genres=28%2C%2027%2C%2010749%2C%2053`, options)
    let active = document.querySelector('.filter2')
    if (active.className.includes('filter__active')) {
        fetchURLAndSearch()
        resultMessage.innerHTML = 'Comedy Movies:'
        renderPost(data)
        pageUpdate(pageData)
    } else {
        fetchURLAndSearch()
        resultMessage.innerHTML = 'Top Movies:'
        getDefault()
    }
}

async function filterHorror() {
    moviesLoadingState()
    let data = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1&with_genres=27&without_genres=28%2C%2035%2C%2010749%2C%2053`, options)
    let pageData = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1&with_genres=27&without_genres=28%2C%2035%2C%2010749%2C%2053`, options)
    let active = document.querySelector('.filter3')
    if (active.className.includes('filter__active')) {
        fetchURLAndSearch()
        resultMessage.innerHTML = 'Horror Movies:'
        renderPost(data)
        pageUpdate(pageData)
    } else {
        fetchURLAndSearch()
        resultMessage.innerHTML = 'Top Movies:'
        getDefault()
    }
}

async function filterRomance() {
    moviesLoadingState()
    let data = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1&with_genres=10749&without_genres=27%2C%20%2053%2C%2028`, options)
    let pageData = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1&with_genres=10749&without_genres=27%2C%20%2053%2C%2028`, options)
    let active = document.querySelector('.filter4')
    if (active.className.includes('filter__active')) {
        fetchURLAndSearch()
        resultMessage.innerHTML = 'Romance Movies:'
        renderPost(data)
        pageUpdate(pageData)

    } else {
        fetchURLAndSearch()
        resultMessage.innerHTML = 'Top Movies:'
        getDefault()
    }
}

function btnLoadingState() {
    document.querySelector('.fa-magnifying-glass').style.display = 'none'
    document.querySelector('.fa-spinner').style.display = 'block'
}

function moviesLoadingState() {

    document.querySelector('.page__move--container').style.display = 'none'
    document.querySelector('.page__selector').style.display = 'none'
    document.querySelector('.movies__container').style.display = 'none'
    document.querySelector('.fa-spinner').style.display = 'block'
}

function fetchURLAndSearch() {
    urlUpdate()
    searchOrClear()
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
    }
    document.querySelector('.page__move--container').style.display = 'flex'
    document.querySelector('.page__selector').style.display = 'flex'
    document.querySelector('.movies__container').style.display = 'flex'
    document.querySelector('.fa-spinner').style.display = 'none'
}

async function getDefault() {
    moviesLoadingState()
    let movieData = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`, options)
    let pageData = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`, options)
    await renderPost(movieData)
    await pageUpdate(pageData)
}

async function getSearchResult() {
    let userInput = searchField.value
    urlUpdate()
    let movieData;
    let pageData;
    let url = window.location.href
    let params = new URL(url).searchParams
    if (userInput === '' && params.get('search') === '') {
        resultMessage.innerHTML = 'Top Movies:'
        movieData = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
        pageData = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    } else {
        resultMessage.innerHTML = `Results for "${userInput}":`
        movieData = await fetch(`https://api.themoviedb.org/3/search/movie?query=${userInput}&include_adult=false&language=en-US&page=1`, options)
        pageData = await fetch(`https://api.themoviedb.org/3/search/movie?query=${userInput}&include_adult=false&language=en-US&page=1`, options)
    }
    await renderPost(movieData)
    await pageUpdate(pageData)
}

function redirectSearch() {
    let userInput = searchField.value
    window.location.replace(`${window.location.origin}/movies.html?search=${userInput}`)
}

async function pageUpdate(data) {
    let dataFE = await data.json()
    let page = dataFE.page
    let totalPages = dataFE.total_pages
    document.querySelector('.page__selector').innerHTML = `Page ${page} of ${totalPages}`
}

async function nextPage() {
    let maxPageData = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`, options)
    let movies = await maxPageData.json()
    let totalPages = movies.total_pages
    if (currentPage !== totalPages) {
        currentPage++
    }
    let data = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`, options)
    let pageData = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`, options)
    renderPost(data)
    pageUpdate(pageData)

}

async function previousPage() {
    if (currentPage !== 1) {
        currentPage--
    }
    let data = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`, options)
    let pageData = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`, options)
    renderPost(data)
    pageUpdate(pageData)
}