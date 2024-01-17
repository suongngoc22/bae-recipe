const mealDetailContainer = document.getElementById("meal-info-container");

function getMealDetailLS () {
    const mealId = localStorage.getItem("mealDetail");
    return JSON.parse(mealId);
}

async function getMealById (idMeal) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
    const res = await fetch(url);

    const resData = await res.json();
    const meal =  resData.meals[0];

    return meal;
}

function addMealDetail (meal) {
    console.log(meal);
    const mealInfo = document.createElement('div');
    mealInfo.classList.add("meal-info");

    //ingredients
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal['strIngredient'+i]) {
            if (meal['strMeasure'+i] !== '' && meal['strMeasure'+i].trim() !== '') {
                ingredients.push(`${meal['strIngredient'+i]} - ${meal['strMeasure'+i]}`);
            } else {
                ingredients.push(`${meal['strIngredient'+i]}`);
            }
        } else {
            break;
        }
    };

    mealInfo.innerHTML = `
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p>${meal.strInstructions}</p>
        <ul>
            ${ingredients.map(ing => `<li> ${ing} </li>`).join("")}
        </ul>`;

    mealDetailContainer.appendChild(mealInfo);
}

async function fetchMealDetail() {
    const mealId = getMealDetailLS();
    if (mealId) {
        const mealDetail = await getMealById(mealId);
        addMealDetail(mealDetail);
    }
}

fetchMealDetail();

// header
const backBtn = document.getElementById("back");
backBtn.addEventListener("click", () => {
    history.back();
})

const searchBtn = document.getElementById('search');
searchBtn.addEventListener("click", () => {
    location.href = './search.html';
});

// click search recently