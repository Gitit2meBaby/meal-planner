import { useGlobalContext } from '../context';
import { useState } from 'react';

export const Dashboard = () => {
    const { recipe, loading, setMonday, setTuesday,
        setWednesday, setThursday, setFriday, setSaturday, setSunday } = useGlobalContext();
    const [selectedRecipeId, setSelectedRecipeId] = useState(0);
    const [selectedRecipeIngredients, setSelectedRecipeIngredients] = useState("1 Dozen hard boiled eggs; shelled and cut into half|1/4 c Mayonnaise|1/2 lb Lump crab meat; shelled and picked for cartilage|1 ts Minced garlic|1 tb Minced capers|2 tb Caper juice|Salt|Freshly ground white pepper|1 tb Finely chopped fresh parsley leaves"
    );
    const [selectedRecipeServings, setSelectedRecipeServings] = useState(1);


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
    const handleDayChoice = (day) => {
        const mealDetails = {
            recipeId: selectedRecipeId,
            ingredients: selectedRecipeIngredients,
            title: selectedRecipe.title,
            servings: selectedRecipeServings,
        };

        // Update the state with the chosen meal for the selected day
        switch (day) {
            case 'monday':
                setMonday(mealDetails);
                break;
            case 'tuesday':
                setTuesday(mealDetails);
                break;
            case 'wednesday':
                setWednesday(mealDetails);
                break;
            case 'thursday':
                setThursday(mealDetails);
                break;
            case 'friday':
                setFriday(mealDetails);
                break;
            case 'saturday':
                setSaturday(mealDetails);
                break;
            case 'sunday':
                setSunday(mealDetails);
                break;
            default:
                break;
        }
        console.log(mealDetails)
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
                        <button onClick={() => handleTitleClick(index, item.ingredients, item.title)}>Select</button>
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
                    <button onClick={() => handleDayChoice('monday')}>Monday</button>
                    <button onClick={() => handleDayChoice('tuesday')}>Tuesday</button>
                    <button onClick={() => handleDayChoice('wednesday')}>Wednesday</button>
                    <button onClick={() => handleDayChoice('thursday')}>Thursday</button>
                    <button onClick={() => handleDayChoice('friday')}>Friday</button>
                    <button onClick={() => handleDayChoice('saturday')}>Saturday</button>
                    <button onClick={() => handleDayChoice('sunday')}>Sunday</button>
                </div>
            </div>
        </section>
    );
};
