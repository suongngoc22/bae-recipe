
const searchBtn = document.getElementById('search');
const searchTerm = document.getElementById('search-term');
const searchRecently = document.getElementById('search-recently');
const meals = document.getElementById("meals");

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
        const meals = await getMealBySearch(term);
        console.log(meals);
        if (meals.length > 0) {
            meals.forEach(meal => {
                addMeal(meal, false);
            });
            searchRecently.classList.add("hidden");
        }
    } else {
        searchRecently.classList.remove("hidden");
    }
},500));