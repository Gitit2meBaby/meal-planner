import React, { useState, useContext, useEffect, useCallback } from 'react';

const AppContext = React.createContext();


const AppProvider = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState('')
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState('')
    const [monday, setMonday] = useState('')
    const [tuesday, setTuesday] = useState('')
    const [wednesday, setWednesday] = useState('')
    const [thursday, setThursday] = useState('')
    const [friday, setFriday] = useState('')
    const [saturday, setSaturday] = useState('')
    const [sunday, setSunday] = useState('')

    useEffect(() => {
        if (searchKeyword) {
            fetchRecipe(searchKeyword);
        } else {
            fetchRecipe('eggs')
        }
    }, [searchKeyword]);

    // API call for the recipe data
    const fetchRecipe = useCallback(async (searchKeyword) => {
        setLoading(true);
        try {
            const apiKey = '5Vzv7A+EONJ8disrlftlOQ==VZpmD3LFlPyaOuYv';
            const headers = new Headers({
                'X-Api-Key': apiKey
            });

            const url = `https://api.api-ninjas.com/v1/recipe?query=${searchKeyword}`

            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
                contentType: 'application/json',
            });

            const recipeData = await response.json();
            setRecipe(recipeData);
            setLoading(false);
            console.log(recipeData);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }, []);


    useEffect(() => {

        const apiKey = '5Vzv7A+EONJ8disrlftlOQ==VZpmD3LFlPyaOuYv';
        const url = 'https://api.api-ninjas.com/v1/recipe?query=eggs';

        fetch(url, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey
            }
        })
            .then(response => response.json())
            .then(data =>
                setRecipe(data))
            .catch(error => console.error(error));
    }, []);


    return (
        <AppContext.Provider value={{
            searchKeyword, setSearchKeyword,
            loading, setLoading,
            recipe, setRecipe,
            fetchRecipe,
            monday, setMonday,
            tuesday, setTuesday,
            wednesday, setWednesday,
            thursday, setThursday,
            friday, setFriday,
            saturday, setSaturday,
            sunday, setSunday
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppProvider, AppContext };
