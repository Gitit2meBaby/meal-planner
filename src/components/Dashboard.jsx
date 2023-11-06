import { useGlobalContext } from '../context';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    const { recipe, loading, setMonday, monday, setTuesday,
        setWednesday, setThursday, setFriday, setSaturday, setSunday } = useGlobalContext();
    const [selectedRecipeId, setSelectedRecipeId] = useState(0);
    const [selectedRecipeIngredients, setSelectedRecipeIngredients] = useState("1 Dozen hard boiled eggs; shelled and cut into half|1/4 c Mayonnaise|1/2 lb Lump crab meat; shelled and picked for cartilage|1 ts Minced garlic|1 tb Minced capers|2 tb Caper juice|Salt|Freshly ground white pepper|1 tb Finely chopped fresh parsley leaves"
    );
    const [selectedRecipeServings, setSelectedRecipeServings] = useState(1);
    const [choicesComplete, setChoicesComplete] = useState(false)

    // change the value displayed depending on the slider value
    const handleSliderChange = (e) => {
        const servingsValue = e.target.value;
        setSelectedRecipeServings(servingsValue);
    };

    // Change ingredient display on click, set the selected ingredient to state
    const handleTitleClick = (recipeId, ingredients) => {
        setSelectedRecipeId(recipeId);
        setSelectedRecipeIngredients(ingredients);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!recipe || recipe.length === 0) {
        return <p>No data available.</p>;
    }

    const selectedRecipe = selectedRecipeId !== null ? recipe[selectedRecipeId] : null;

    // Move ingredient processing logic into handleTitleClick
    const updatedIngredients = selectedRecipeIngredients
        ? selectedRecipeIngredients.split('|').map((ingredient) => {
            const parts = ingredient.split(' ');
            const value = parseFloat(parts[0]);
            const unit = parts[1];
            const modifiedValue = value * selectedRecipeServings;
            return `${modifiedValue} ${unit} ${parts.slice(2).join(' ')}`;
        })
        : null;

    // Set Chosen Meal to the correct day
    const handleDayChoice = (e, day) => {
        //     e.target.classList.toggle('selected-btn');

        // Create a map that associates day names with their corresponding state setters
        const dayStateSetters = {
            'monday': setMonday,
            'tuesday': setTuesday,
            'wednesday': setWednesday,
            'thursday': setThursday,
            'friday': setFriday,
            'saturday': setSaturday,
            'sunday': setSunday,
        };

        const stateSetter = dayStateSetters[day];

        if (stateSetter) {
            const mealDetails = {
                recipeId: selectedRecipeId,
                ingredients: selectedRecipeIngredients,
                title: selectedRecipe.title,
                servings: selectedRecipeServings,
            };

            if (e.target.classList.contains('selected-btn')) {
                stateSetter(mealDetails);
            } else {
                stateSetter(''); // Reset the state if the button is unselected
                console.log(monday)
            }
        }

        const selectedButtons = document.querySelectorAll('.selected-btn');
        const selectedButtonsCount = selectedButtons.length;

        if (selectedButtonsCount === 6) {
            setChoicesComplete(true);
        } else {
            setChoicesComplete(false);
        }
    };

    return (
        <section className="dashboard">
            <div className="title">
                <h1>Dashboard</h1>
            </div>

            <div className="matches">
                <h2>Choose a Meal</h2>
                {recipe.map((item, index) => (
                    <div className="recipe-titles" key={index}>
                        <h3>{item.title}</h3>
                        <button onClick={() => handleTitleClick(index, item.ingredients, item.title)}
                            className={selectedRecipeId === index ? 'selected-btn' : ""}
                        >Select</button>
                    </div>
                ))}
            </div>

            <div className="ingredients">
                <h2>Ingredients</h2>
                {selectedRecipe && updatedIngredients && (
                    <p dangerouslySetInnerHTML={{ __html: updatedIngredients.join('<br>') }}></p>
                )}
            </div>

            <div className="servings">
                {selectedRecipe && (
                    <>
                        <input
                            type="range"
                            min="1"
                            max={selectedRecipe.servings.match(/\d+/g) * 4}
                            value={selectedRecipeServings || 0}
                            id="servingsSlider"
                            onChange={handleSliderChange}
                        />
                        <p>Servings - {selectedRecipeServings}</p>
                    </>
                )}
            </div>

            <div className="instructions">
                <h2>Effort to Make...</h2>
                {selectedRecipe && <p>{selectedRecipe.instructions}</p>}
            </div>

            <div className="choose">
                <h2>Choose a day</h2>
                <div className="btn-grid">
                    <button onClick={(e) => handleDayChoice(e, 'monday')}
                        className={(!monday === '') ? 'selected-btn' : ''}
                    >Monday</button>
                    <button onClick={(e) => handleDayChoice(e, 'tuesday')}>Tuesday</button>
                    <button onClick={(e) => handleDayChoice(e, 'wednesday')}>Wednesday</button>
                    <button onClick={(e) => handleDayChoice(e, 'thursday')}>Thursday</button>
                    <button onClick={(e) => handleDayChoice(e, 'friday')}>Friday</button>
                    <button onClick={(e) => handleDayChoice(e, 'saturday')}>Saturday</button>
                    <button onClick={(e) => handleDayChoice(e, 'sunday')}>Sunday</button>
                </div>
            </div>

            {choicesComplete &&
                <div className="choices-complete-modal">
                    <h3>Thats the week complete!</h3>
                    <p>Would you like to see your shopping list now?</p>
                    <Link to='/shopping-list'><button onClick={() => setChoicesComplete(false)}>See List</button></Link>
                    <button onClick={() => setChoicesComplete(false)}>Change Selection</button>
                </div>
            }
        </section>
    );
};