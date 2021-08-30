const _getBaseUrl = () => {
    return 'https://world.openfoodfacts.org';
}

export const getProduct = async (ean: string) => {
    const url = `${_getBaseUrl()}/api/v0/product/${ean}.json`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const product = await response.json();
        if (product.status === 0) {
            return null;
        }
        return product;
    } catch (error) {
        console.error(error);
        return null;
    }
}
