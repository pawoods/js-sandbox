const themeButton = document.querySelector('.theme');
const pageButtons = document.querySelectorAll('.page');
const wrapper = document.getElementsByClassName('wrapper')[0];
const body = document.querySelector('body');
var page = 1;
var url = `https://api.punkapi.com/v2/beers`;

function themeToggle() {
    body.classList.toggle('dark-mode');
    if(themeButton.innerHTML === `<i class="fa-regular fa-moon"></i>`) {
        themeButton.innerHTML = `<i class="fa-regular fa-sun"></i>`;
    } else {
        themeButton.innerHTML = `<i class="fa-regular fa-moon"></i>`;
    }
}

function getBeers() {
    fetch(url).then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Network Response Error");
    }
    })
    .then(data => {
        data.forEach((item) =>{
            showBeers(item);
        })
    })
.catch((error) => console.error("Fetch Error:", error));
}


function showBeers(item) {
    const div = document.createElement('div');
    
    div.className = "card"
    div.innerHTML = `<h2>${item.name} - ${item.abv}%</h2>
                    <h3>${item.tagline}</h3>
                    <p>${item.description}</p>
                    `;
    wrapper.appendChild(div);
}

function paginationButton(e) {
    wrapper.innerHTML = ``;
    page = Math.floor(e.target.innerHTML);
    url = `https://api.punkapi.com/v2/beers?page=${page}`;
    getBeers();
}

console.log(pageButtons);
pageButtons.forEach(pageButton => {pageButton.addEventListener('click', paginationButton)});
themeButton.addEventListener('click', themeToggle);
getBeers();