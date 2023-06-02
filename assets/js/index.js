const wrapper = document.getElementsByClassName('wrapper')[0];
const body = document.querySelector('body');

const themeButton = document.querySelector('.theme');
const resetButton = document.querySelector('.reset-button');
const nameButton = document.querySelector('.name-button');
const abvButton = document.querySelector('.abv-button');
const searchInput = document.querySelector('.search-input');
const basketCount = document.querySelector('.basket-count');

var azSorted = false;
var abvSorted = false;
var beers = [];
var activeBeers = [];
var basket = [];



function themeToggle() {
    body.classList.toggle('dark-mode');
    if(themeButton.innerHTML === `<i class="fa-regular fa-moon"></i>`) {
        themeButton.innerHTML = `<i class="fa-regular fa-sun"></i>`;
    } else {
        themeButton.innerHTML = `<i class="fa-regular fa-moon"></i>`;
    }
}

function getBeers() {
    wrapper.innerHTML = '';
    beers = [];
    activeBeers = [];
    for( let page = 1; page <= 13; page++) {
        let url = `https://api.punkapi.com/v2/beers?page=${page}`;
        fetch(url).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Network Response Error");
        }
        })
        .then(data => {
            data.forEach((beer) =>{
                showBeers(beer);
                beers.push(beer);
                activeBeers.push(beer);
            })
        })
        .catch((error) => console.error("Fetch Error:", error));
    }
}

function showBeers(item) {
    if (item.image_url) {
        const div = document.createElement('div');

        div.className = "card-container"
        div.innerHTML = `<div class="card">
                        <img src="${item.image_url}" alt="${item.name} image">
                        <h2>${item.name} - ${item.abv}%</h2>
                        <h3 class="hidden">${item.tagline}</h3>
                        <p class="hidden">${item.description}</p>
                        <button id="${item.id}" onclick="addToBasket(event)">Add to Basket</button>
                        </div>`;
        wrapper.appendChild(div);
        div.onclick = function(e){
            if (!e.target.matches('button')) {
                this.children[0].children[2].classList.toggle('hidden');
                this.children[0].children[3].classList.toggle('hidden');
                this.classList.toggle('active-card');
            }
        };
        div.onmouseenter = function(){
            this.children[0].classList.add('hl');
            this.children[0].classList.add('hl');  
        };
        div.onmouseover = function(){
            this.children[0].classList.add('hl');
            this.children[0].classList.add('hl');  
        };
        div.onmouseleave = function(){
            this.children[0].classList.remove('hl');
            this.children[0].classList.remove('hl');  
        };
    } else {
        const div = document.createElement('div');

        div.className = "card-container"
        div.innerHTML = `<div class="card">
                        <h2>${item.name} - ${item.abv}%</h2>
                        <h3 class="hidden">${item.tagline}</h3>
                        <p class="hidden">${item.description}</p>
                        <button id="${item.id}" onclick="addToBasket(event)">Add to Basket</button>
                        </div>`;
        wrapper.appendChild(div);
        div.onclick = function(e){
            if (!e.target.matches('button')) {
                this.children[0].children[1].classList.toggle('hidden');
                this.children[0].children[2].classList.toggle('hidden');
                this.classList.toggle('active-card');
            }
        };
        div.onmouseenter = function(){
            this.classList.add('hl');
            this.classList.add('hl');  
        };
        div.onmouseover = function(){
            this.classList.add('hl');
            this.classList.add('hl');  
        };
        div.onmouseleave = function(){
            this.classList.remove('hl');
            this.classList.remove('hl');  
        };
    }
}

function findMatches(wordToMatch, beers) {
    return beers.filter(beer => {
        const regex = new RegExp(wordToMatch, 'gi');
        return beer.name.match(regex) || beer.tagline.match(regex) || beer.description.match(regex)
    });
}

function displayMatches() {
    wrapper.innerHTML = '';
    activeBeers = findMatches(this.value, beers);
    activeBeers.forEach((beer) => {
        showBeers(beer);
    });
    // console.log(searchBeers);
}

function sortAZ() {
    if (azSorted === false) {
        wrapper.innerHTML = '';
        azSorted = true;
        abvSorted = false;
        nameButton.innerText = `Sort by name: Z-A`;
        abvButton.innerHTML = `Sort by Abv: <i class="fa-solid fa-arrow-up"></i>`;
        activeBeers.sort((a, b) => (a.name > b.name ? 1 : -1));
        activeBeers.forEach((beer) => {
            showBeers(beer);
        });
    } else {
        wrapper.innerHTML = '';
        azSorted = false;
        abvSorted = false;
        nameButton.innerText = `Sort by name: A-Z`;
        abvButton.innerHTML = `Sort by Abv: <i class="fa-solid fa-arrow-up"></i>`;
        activeBeers.sort((a, b) => (a.name > b.name ? -1 : 1));
        activeBeers.forEach((beer) => {
            showBeers(beer);
        });
    }
}

function sortAbv() {
    if (abvSorted === false) {
        wrapper.innerHTML = '';
        abvSorted = true;
        azSorted = false;
        abvButton.innerHTML = `Sort by Abv: <i class="fa-solid fa-arrow-down"></i>`;
        nameButton.innerHTML = `Sort by name: A-Z`;
        activeBeers.sort((a, b) => (a.abv > b.abv ? 1 : -1));
        activeBeers.forEach((beer) => {
            showBeers(beer);
        });
    } else {
        wrapper.innerHTML = '';
        abvSorted = false;
        azSorted = false;
        abvButton.innerHTML = `Sort by Abv: <i class="fa-solid fa-arrow-up"></i>`;
        nameButton.innerText = `Sort by name: A-Z`;
        activeBeers.sort((a, b) => (a.abv > b.abv ? -1 : 1));
        activeBeers.forEach((beer) => {
            showBeers(beer);
        });
    }
}

function addToBasket(e) {
    const i = e.target.id;
    const selected = beers.find(x => x.id == i);

    basket.push(selected);
    basketCount.innerText = basket.length;
}

themeButton.addEventListener('click', themeToggle);

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
resetButton.addEventListener('click', getBeers);
nameButton.addEventListener('click', sortAZ);
abvButton.addEventListener('click', sortAbv);

getBeers();