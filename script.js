const meals = document.getElementById("meals");
const favMeals = document.getElementById("fav-meals");

async function getRandomMeal () { 
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");  
    const data = await res.json();
    const randomMeal = data.meals[0];

    addMeal(randomMeal, true);
};

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
            <h4 class="meal-name">${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>`;

    meals.prepend(meal);

    const favBtn = meal.querySelector(".meal-body .fav-btn");

    favBtn.addEventListener("click", () => {
        if (favBtn.classList.contains("active")) {
            // thi remove no khoi danh sach yeu thich
            removeMealLS(mealData.idMeal);
            favBtn.classList.remove("active");
        } else {
            addMealLS(mealData.idMeal);
            favBtn.classList.toggle("active");
            console.log(mealData.idMeal);
        }
        fetchFavMeals();
    });
}


async function getMealById (idMeal) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
    const res = await fetch(url);

    const resData = await res.json();
    const meal =  resData.meals[0];

    return meal;
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

async function fetchFavMeals() {
    favMeals.innerHTML = ``;
    const mealIds = getMealsLS();
    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        const meal = await getMealById(mealId);
        addMealFav(meal);   
    }
}

function addMealFav (mealData) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
        <img src=${mealData.strMealThumb} 
            alt=${mealData.strMeal}
        />
        <span>${mealData.strMeal}</span>
        <div class="fav-meal-context hidden" id="fav-meal-context-${mealData.idMeal}"> 
            <span class="fav-meal-detail">See detail</span>
            <span class="fav-meal-delete">Delete</span>
        </div>
    `;
    
    // context menu
    const favMealContexts = favMeal.getElementsByClassName("fav-meal-context");
    
    favMeal.addEventListener("click", () => {
        for (let i = 0; i < favMealContexts.length; i++) {
            
            if (favMealContexts[i].id !== `fav-meal-context-${mealData.idMeal}`) {
                favMealContexts[i].classList.add("hidden");          
            } else {
                favMealContexts[i].classList.toggle("hidden");
            }
        }
    });

    //delete action
    const btnDelete = favMeal.querySelector(".fav-meal-delete");

    btnDelete.addEventListener("click", () => {
        removeMealLS(mealData.idMeal);
        fetchFavMeals();
    });

    favMeals.appendChild(favMeal);
}

getRandomMeal();
fetchFavMeals();

const searchBtn = document.getElementById('search');
searchBtn.addEventListener("click", () => {
    location.href = './search.html';
});

const reloadBtn = document.getElementById('reload-btn');
reloadBtn.addEventListener("click", getRandomMeal);

// https://coolors.co/visualizer/cbe896-fffffc-beb7a4-ff7f11-ff1b1c