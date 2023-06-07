const r = document.querySelector(':root');
const wrapper = document.getElementsByClassName('wrapper')[0];
const body = document.querySelector('body');

const themeButton = document.querySelector('.theme');
const resetButton = document.querySelector('.reset-button');
const nameButton = document.querySelector('.name-button');
const abvButton = document.querySelector('.abv-button');
const searchInput = document.querySelector('.search-input');
const basketContainer = document.querySelector('.basket-container');
const basket = document.querySelector('.basket');
const basketIcon = document.querySelector('.basket-icon');
const basketCount = document.querySelector('.basket-count');

var azSorted = false;
var abvSorted = false;
var beers = [];
var activeBeers = [];
// var inBasket = []; not currently using array of objects for basket



function themeToggle() {
    // body.classList.toggle('dark-mode');
    if(themeButton.innerHTML === `<i class="fa-regular fa-moon"></i>`) {
        themeButton.innerHTML = `<i class="fa-regular fa-sun"></i>`;
        r.style.setProperty('--background', 'rgba(0, 0, 0, 0.8)');
        r.style.setProperty('--main', 'rgba(255, 255, 255, 1)');
        r.style.setProperty('--card', 'rgba(0, 0, 0, 0.3)');
        r.style.setProperty('--highlight', 'rgba(0 , 0, 0, 0.8)');
    } else {
        themeButton.innerHTML = `<i class="fa-regular fa-moon"></i>`;
        r.style.setProperty('--background', 'rgba(0, 0, 0, 0.1)');
        r.style.setProperty('--main', 'rgba(0, 0, 0, 1)');
        r.style.setProperty('--card', 'rgba(0, 0, 0, 0.2)');
        r.style.setProperty('--highlight', 'rgba(0, 0, 0, 0.3)');
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
                        <button id="${item.id}" onclick="addToBasket(event)">+</button>
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
                        <button id="${item.id}" onclick="addToBasket(event)">+</button>
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
    }
}

function reset() {
    wrapper.innerHTML = '';
    activeBeers = [];
    beers.forEach((beer) => {
        showBeers(beer);
        activeBeers.push(beer);
    });
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

    // inBasket.push(selected);
    // basketCount.innerText = inBasket.length;

    const li = document.createElement('li');
    li.innerHTML = `<div class="basket-item">
                        <p>${selected.name}</p>
                        <button onclick="removeItem(event)">-</button>
                    </div>`;
    basket.appendChild(li);

    if (document.querySelectorAll('ul.basket li').length == 0) {
        basketCount.innerText = '';
        basketCount.classList.add('hidden');
        basket.classList.add('hidden');
    } else {
        basketCount.innerText = document.querySelectorAll('ul.basket li').length;
        basketCount.classList.remove('hidden');
    }
}

function showBasket() {
    if(document.querySelectorAll('.basket li').length == 0) {
        basket.classList.add('hidden');
    } else {
        basket.classList.toggle('hidden');
    }
}

function removeItem(e) {
    const toRemove = e.target.closest('li');
    toRemove.remove();

    if (document.querySelectorAll('ul.basket li').length == 0) {
        basketCount.innerText = '';
        basketCount.classList.add('hidden');
        basket.classList.add('hidden');
    } else {
        basketCount.innerText = document.querySelectorAll('ul.basket li').length;
        basketCount.classList.remove('hidden');
    }
    e.stopPropagation();
}

// function hideBasket(e) {
//     if(!e.target.matches('#basket') && !basket.classList.contains('hidden')) {
//         basket.classList.add('hidden');
//         console.log(e.target);
//     }
// }

document.addEventListener('click', function(e) {
    if(!basketContainer.contains(e.target) && !basketIcon.contains(e.target)){
        basket.classList.add('hidden');
    }
});

themeButton.addEventListener('click', themeToggle);

basketIcon.addEventListener('click', showBasket);

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
resetButton.addEventListener('click', reset);
nameButton.addEventListener('click', sortAZ);
abvButton.addEventListener('click', sortAbv);

getBeers();