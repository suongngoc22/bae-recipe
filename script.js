
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
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>`;

    meals.appendChild(meal);

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
    const res = await fetch("www.themealdb.com/api/json/v1/1/lookup.php?i=" + idMeal);

    const resData = await res.json();
    const meal =  resData.meals[0];

    return meal;
}

async function getMealBySearch (term) {
    const meal = await fetch("www.themealdb.com/api/json/v1/1/search.php?s=" + term);
}



async function addMealLS (mealId) {
    const mealIds = getMealsLS();

    console.log(mealId);
    console.log(mealIds);
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));

    
}

async function removeMealLS (mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => mealId !== id)));
}

function getMealsLS () {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    const mealIds = getMealsLS();
    console.log(mealIds);

    // for (let i = 0; i < mealIds.length; i++) {
    //     const mealId = mealIds[i];
    //     let meal = await getMealById(mealId);
    //     addMealFav(meal);   
    // }
}

function addMealFav (mealData) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
        <li>
            <img src=${mealData.strMealThumb} 
                alt=${mealData.strMeal}
            />
            <span>${mealData.strMeal}</span>
        </li> `;

    favMeals.appendChild(favMeal);
}

getRandomMeal();
fetchFavMeals();

// https://coolors.co/visualizer/cbe896-fffffc-beb7a4-ff7f11-ff1b1c