
const meals = document.getElementById("meals");

const getRandomMeal = async () => { 
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");  
    const data = await res.json();
    const randomMeal = data.meals[0];

    addMeal(randomMeal);
};

const addMeal = (mealData) => {
    const meal = document.createElement('div');
    meal.classList.add("meal");

    meal.innerHTML = `
        <div class="meal-header">
            <span class="random">Random Recipe</span>
            <img src="${mealData.strMealThumb}" alt="">
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button>
                <i class="fa-regular fa-heart"></i>
            </button>
        </div>`;

    meals.appendChild(meal);
}


getRandomMeal();