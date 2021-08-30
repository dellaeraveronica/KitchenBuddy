const _ApiKey = () => {
    return '5cfcd50ef18742cbbf0b6e6d613a47da'
}

const _getBaseUrl = () => {
    return 'https://api.spoonacular.com';
}

export const searchRecipe = async (ingredients: string) => {
    console.log('ingredients', ingredients);
    const url = `${_getBaseUrl()}/recipes/findByIngredients?apiKey=${_ApiKey()}` + '&ingredients=' + ingredients + '?number=10';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const recipes = await response.json();
        console.log(recipes);
        return recipes;
    } catch (error) {
        console.error(error);
        return null;
    }
}
