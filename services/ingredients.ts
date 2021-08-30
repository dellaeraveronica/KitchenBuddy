import * as firebase from "firebase";
import { dataEntry } from '../screens/AddIngredient';
import moment from 'moment';
import { groceryEntry } from '../screens/GroceriesList';
import {recipeEntry} from '../screens/SpoonacularModal';

const collectionPath = 'Ingredients';
const groceriesPath = 'Groceries';
const recipesPath = 'Recipes';

export const addIngredient = async (data: dataEntry) => {
    await firebase.default.firestore().collection(collectionPath).add(data)
        .then( () => console.log('Ingredient added successfully!') )
        .catch( (err) => console.error('Something went wrong', err) )
}

export const quickAddGrocery = async (data: Partial<groceryEntry> ) => {
    await firebase.default.firestore().collection(groceriesPath).add(data)
        .then( () => console.log('Grocery added successfully!') )
        .catch( (err) => console.error('Something went wrong', err) )
}

export const editIngredient = async (id:string, data: Partial<dataEntry>) => {
    await firebase.default.firestore().collection(collectionPath).doc(id).update(data)
        .then( () => console.log('Ingredient edited successfully!') )
        .catch( (err) => console.error('Something went wrong', err) )
}

export const freezeIngredient = async (id: string, exp_date: Date) => {
    await firebase.default.firestore().collection(collectionPath).doc(id).update({
        exp_date: moment(exp_date).add(6, 'months').toDate(),
        isFrozen: true,
        updatedAt: new Date()
    })
        .then( () => console.log('Ingredient updated successfully!') )
        .catch( (err) => console.error('Something went wrong', err) )
}

export const openIngredient = async (id: string, exp_date: Date) => {
    await firebase.default.firestore().collection(collectionPath).doc(id).update({
        exp_date: moment(exp_date).diff(new Date(), 'hours') > 6 ?
            moment(new Date()).add(6, 'hours').toDate() : exp_date,
        isOpened: true,
        updatedAt: new Date()
    })
        .then( () => console.log('Ingredient updated successfully!') )
        .catch( (err) => console.error('Something went wrong', err) )
}

export const buyIngredient = async (id: string, data: Partial<dataEntry>) => {
    console.log(id);
    await firebase.default.firestore().collection(collectionPath).add(data)
        .then( async () => { console.log('Ingredient bought successfully!');
            await firebase.default.firestore().collection('Groceries').doc(id).delete();
        })
        .catch( (err) => console.error('Something went wrong', err) )
}

export const addRecipe = async (data: recipeEntry) => {
    await firebase.default.firestore().collection(recipesPath).add(data)
        .then( async () => console.log('Recipe scheduled successfully!'))
        .catch( (err) => console.error('Something went wrong', err) )
}

