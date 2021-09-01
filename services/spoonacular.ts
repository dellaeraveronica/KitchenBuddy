const _ApiKey = () => {
    return '6553e03f70434b54b6593f83e2c0a812'
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
