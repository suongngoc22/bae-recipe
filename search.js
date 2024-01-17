
const searchBtn = document.getElementById('search');
const searchTerm = document.getElementById('search-term');
const clearSearch = document.querySelector('.clear-search');
const ulSearchRecently = document.getElementById('searchTerms-recently');
const meals = document.getElementById("meals");
const modalLoading = document.querySelector(".modal");

const showLoading = () => {
    modalLoading.classList.add('open');
}
const stopLoading = () => {
    modalLoading.classList.remove('open');
}

async function getMealBySearch (term) {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);

    const resData = await res.json();
    const meals = resData.meals;
    
    return meals;
}

function addMeal (mealData, random) {
    const meal = document.createElement('div');
    meal.classList.add("meal");

    meal.innerHTML = `
        <div class="meal-header">
            <div class="random">
                ${random ? `<span>Random Recipe</span>` : ""}
            </div>
            <img src="${mealData.strMealThumb}" alt="">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>`;

    meals.prepend(meal);

    const favBtn = meal.querySelector(".meal-body .fav-btn");

    favBtn.addEventListener("click", () => {
        if (favBtn.classList.contains("active")) {
            removeMealLS(mealData.idMeal);
            favBtn.classList.remove("active");
        } else {
            addMealLS(mealData.idMeal);
            favBtn.classList.toggle("active");
        }
    });

    meal.addEventListener("click", () => {
        addMealDetailLS(mealData.idMeal);
        location.href = './meal.html';
    })
}

async function addMealLS (mealId) {
    const mealIds = getMealsLS();
    
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

async function removeMealLS (mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => mealId !== id)));
}

function getMealsLS () {
    const localMealIds = localStorage.getItem("mealIds");
    if (localMealIds) {
        return JSON.parse(localMealIds);
    }

    return [];
}

async function addMealDetailLS (mealId) {
    localStorage.setItem("mealDetail", JSON.stringify(mealId));
}

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        console.log(args);
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

searchTerm.addEventListener("input", debounce(async (e) => {
    meals.innerHTML = ``;
    const term = e.target.value;
    
    if (term !== '') {
        showLoading();
        const mealsData = await getMealBySearch(term);
        console.log(mealsData);
        clearSearch.classList.remove("hidden");
        if (mealsData && mealsData.length) {
            if (mealsData.length > 0) {
                mealsData.forEach(meal => {
                    addMeal(meal, false);
                });
                ulSearchRecently.classList.add("hidden");
            }
        }
        else {
            ulSearchRecently.classList.add("hidden");
            meals.innerHTML = `<span class="result-container">No data found</span>`;
        }
    } else {
        ulSearchRecently.classList.remove("hidden");
        clearSearch.classList.add("hidden");
    }
    stopLoading()
},500));

const searchTermsData = [
    {
        id: 1,
        term: "Banh trang tron"
    },
    {
        id: 2,
        term: "Pizza"
    },
    {
        id: 3,
        term: "Egg"
    },
    {
        id: 4,
        term: "Bubble tea"
    }
];

function addSearchRecently (searchRecentlyData) {
    const liSearchRecently = document.createElement('li');
    liSearchRecently.setAttribute("id", `searchTerm-${searchRecentlyData.id}`);
    
    const searchSpan = document.createElement('span');
    searchSpan.innerHTML = searchRecentlyData.term;

    const delIcon = document.createElement('i');
    delIcon.setAttribute('class', "fa-solid fa-xmark searchTerm-del");

    liSearchRecently.appendChild(searchSpan);
    liSearchRecently.appendChild(delIcon);
    
    delIcon?.addEventListener("click", () => {
        removeSearchRecently(searchRecentlyData.id);
    });

    liSearchRecently?.addEventListener("click", () => {
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        searchTerm.value = searchRecentlyData.term;
        searchTerm.dispatchEvent(event);
    });

    ulSearchRecently.appendChild(liSearchRecently);

}

function removeSearchRecently (id) {
    const deletedSearch = document.getElementById(`searchTerm-${id}`);
    if (deletedSearch) {
        deletedSearch.remove();
    }
}

function renderSearchRecently () {
    searchTermsData.forEach(s => {
        addSearchRecently(s);
    });
}

const backBtn = document.getElementById("back");
backBtn.addEventListener("click", () => {
    history.back();
})

clearSearch.addEventListener("click", () => {
    const event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    searchTerm.value = '';
    searchTerm.dispatchEvent(event);
})

renderSearchRecently();