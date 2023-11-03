import { useState, useEffect } from 'react'
import { useGlobalContext } from '../context'
import { evaluate } from 'mathjs';
import { NavLink } from 'react-router-dom'

export const ShoppingList = () => {
    const [combinedIngredients, setCombinedIngredients] = useState('')
    const [showIngredients, setShowIngredients] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    });

    const { monday, setMonday,
        tuesday, setTuesday,
        wednesday, setWednesday,
        thursday, setThursday,
        friday, setFriday,
        saturday, setSaturday,
        sunday, setSunday } = useGlobalContext();

    // create a global shopping list that combines all the items
    useEffect(() => {
        const ingredientLists = [].concat(
            (monday.ingredients ?? '').split('|'),
            (tuesday.ingredients ?? '').split('|'),
            (thursday.ingredients ?? '').split('|'),
            (friday.ingredients ?? '').split('|'),
            (saturday.ingredients ?? '').split('|'),
            (sunday.ingredients ?? '').split('|')
        );

        const combinedIngredients = combineIngredients(ingredientLists);
        setCombinedIngredients(combinedIngredients)
    }, [monday, tuesday, thursday, friday, saturday, sunday]);

    function combineIngredients(ingredientLists) {
        // Create an object to store the combined ingredients
        const combinedIngredients = {};

        // Iterate through each day's ingredient list
        ingredientLists.forEach((ingredients) => {
            const ingredientItems = ingredients.split('|');

            // Process each ingredient item
            ingredientItems.forEach((item) => {
                // Use a regular expression to extract quantity and description
                const match = item.match(/^(\d+(\s*\d*\/\d*)?)\s*(.+)/);

                if (match) {
                    const quantity = evaluate(match[1]); // Use mathjs to evaluate fractions
                    const description = match[3];

                    if (!isNaN(quantity) && description) {
                        // Remove leading/trailing spaces and punctuation
                        const cleanedDescription = description.replace(/[^a-zA-Z\s]/g, '');
                        // const cleanedItem = `${quantity} ${cleanedDescription}`;

                        // Check if the item already exists in the combinedIngredients
                        if (combinedIngredients[cleanedDescription]) {
                            // If it exists, add the quantities
                            combinedIngredients[cleanedDescription] += quantity;
                        } else {
                            // If it doesn't exist, initialize it
                            combinedIngredients[cleanedDescription] = quantity;
                        }
                    }
                }
            });
        });

        // Create the final combined ingredient list
        const finalIngredients = Object.keys(combinedIngredients).map(
            (key) => `${combinedIngredients[key]} ${key}`
        );

        return finalIngredients;
    }


    // Toggle the state for the clicked day to show more
    const handleShowMore = (day) => {
        setShowIngredients((prevShowIngredients) => ({
            ...prevShowIngredients,
            [day]: !prevShowIngredients[day],
        }));
    }

    // Function to render a day template
    const renderDayTemplate = (day) => {
        return showIngredients ? (
            <div key={day.recipeId} className="list">
                <h2>{day.day}</h2>
                <h2>{day.title}</h2>

                <p onClick={() => handleShowMore(day.day)}>
                    {showIngredients[day.day] ? 'show less...' : 'show more...'}
                </p>
                <button><svg stroke="#6684BE" fill="#6684BE" strokeWidth="1" viewBox="0 0 1024 1024" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path><path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg></button>
                {showIngredients[day.day] && (
                    <div>
                        {day.ingredients.split('|').map((item, index) => {
                            const match = item.match(/^(\d+(\s*\d*\/\d*)?)\s*(.+)/);
                            if (match) {
                                const quantity = evaluate(match[1]);
                                const description = match[3];
                                const formattedItem = quantity >= 1
                                    ? `${quantity} ${description}`
                                    : `${quantity * 100} ${description}`;
                                return (
                                    <p key={index}>
                                        {formattedItem}
                                    </p>
                                );
                            }
                            return (
                                <p key={index}>{item}</p>
                            );
                        })}
                    </div>
                )}
            </div>
        ) : (
            <p>Nothing selected for this day</p>
        );
    };


    return (
        <section className='container'>
            <div className="shopping-list-title">
                <h1>Your Shopping List</h1>
            </div>
            {!showIngredients ? (
                <div className='no-items'>
                    <h2>No items in your shopping list</h2>
                    <NavLink to='/shopping-list'>
                        <button>Search Recipes</button>
                    </NavLink>
                </div>
            ) : (
                <section className='shopping-list-page'>
                    <div className="chosen-list">
                        {monday.ingredients && renderDayTemplate({ day: 'Monday', ...monday })}
                        {tuesday.ingredients && renderDayTemplate({ day: 'Tuesday', ...tuesday })}
                        {wednesday.ingredients && renderDayTemplate({ day: 'Wednesday', ...wednesday })}
                        {thursday.ingredients && renderDayTemplate({ day: 'Thursday', ...thursday })}
                        {friday.ingredients && renderDayTemplate({ day: 'Friday', ...friday })}
                        {saturday.ingredients && renderDayTemplate({ day: 'Saturday', ...saturday })}
                        {sunday.ingredients && renderDayTemplate({ day: 'Sunday', ...sunday })}
                    </div>

                    <div className="shopping-list">
                        {combinedIngredients ? (
                            <p>{combinedIngredients}</p>
                        ) : (
                            <p>Nothing in the shopping List</p>
                        )}
                    </div>
                </section>
            )}
        </section>
    );
}
