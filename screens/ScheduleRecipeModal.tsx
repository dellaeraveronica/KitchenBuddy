import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {Alert, Button, Platform, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View } from '../components/Themed';
import globalStyles from '../styles/global';
import CustomTextInput from '../components/CustomTextInput';
import {cancelRecipe, editRecipePreparedAt, quickAddGrocery} from '../services/ingredients';
import {useEffect, useState} from 'react';
import Colors from '../constants/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomDatePicker from '../components/CustomDatePicker';
import {useCollection, useDocument} from 'react-firebase-hooks/firestore';
import * as firebase from 'firebase';
import {dataEntry} from './AddIngredient';
import moment from 'moment';
import {groceryEntry} from './GroceriesList';

const ScheduleRecipeModal = () => {
    const navigation = useNavigation();
    const router = useRoute();
    const [prepDate, setPrepDate] = useState<Date | undefined>(undefined);
    const [ingredients, setIngredients] = useState<dataEntry[] | undefined>(undefined);
    const [currentRecipe, setcurrentRecipe] = useState<any | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { id, preparedAt } = router?.params as { id: string, preparedAt: Date };

    const [getAllIngredientsFromThisRecipe, loading, error] = useCollection(
        firebase.default.firestore().collection('Ingredients').where( 'recipeId', '==', id ),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [getCurrentRecipe, loadingRecipe, errorRecipe] = useDocument(
        firebase.default.firestore().doc('Recipes/' + id),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    useEffect( () => {
        const ingredientsFirestore = getAllIngredientsFromThisRecipe?.docs
            .map( (doc) => {
                return { id: doc.id, ...doc.data() as dataEntry }}
            )
        const currentRecipeFirestore = getCurrentRecipe?.data();
        setIngredients(ingredientsFirestore);
        setcurrentRecipe(currentRecipeFirestore);
        console.log(currentRecipeFirestore, 'end')
        }, [getAllIngredientsFromThisRecipe, getCurrentRecipe]);

    const handleSubmit = () => {
        setIsLoading(true);
        console.log(id, prepDate);
        try {
            editRecipePreparedAt(id, prepDate || preparedAt)
                .then( () => { Alert.alert('Success!', 'Recipe edited successfully'); })
                .finally( () => setIsLoading(false));
        } catch (e) {
            console.error('Submit failed', e);
        }
    }

    const handleCancelSubmit = () => {
        setIsLoading(true);
        const ids = ingredients?.map( (current) => current.id );
        try {
            if(ids) {
                cancelRecipe(ids as string[])
                    .then( () => { Alert.alert('Success!', 'Recipe canceled successfully'); })
                    .finally( () => setIsLoading(false));
            }
        } catch (e) {
            console.error('Submit failed', e);
        }
    }

    const addMissingIngredientToGroceries = (missingIngredient: { amount: number, name: string }) => {
        setIsLoading(true);
        try {
            quickAddGrocery({
                name: missingIngredient.name,
                category: '',
                confection_type: '',
                quantity: missingIngredient.amount,
                exp_date: moment().add(2, 'weeks').toDate(),
                createdAt: moment().toDate(),
                updatedAt: moment().toDate(),
                preparedAt: prepDate || preparedAt,
                recipeId: id
            } as groceryEntry)
                .then( () => { Alert.alert('Success!', 'Grocery added successfully'); })
                .finally( () => setIsLoading(false));
        } catch (e) {
            console.error('Submit failed', e);
        }
    }

    return (
        <View style={[ globalStyles.contentContainer, globalStyles.paddedPage ]}>
            <View>
                <Text style={styles.title}>Edit recipe preparation date</Text>
                <View style={styles.separator} />
            </View>
            <KeyboardAwareScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} style={{ marginBottom: 30 }}>
                <Text>{currentRecipe?.title}</Text>
                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Missed ingredients</Text>
                { currentRecipe?.missedIngredients && currentRecipe.missedIngredients
                    .map( (currentMissed: any, index: number) => {
                    return(
                        <>
                            { ingredients?.findIndex( (current) => current.name === currentMissed.name ) === -1
                            &&
                            <TouchableOpacity onPress={ () => addMissingIngredientToGroceries({ amount: currentMissed.amount, name: currentMissed.name })}>
                                <Text style={{ marginLeft: 16 }}>{ currentMissed.name }</Text>
                            </TouchableOpacity>
                            }
                        </>
                    )
                })}
                { currentRecipe?.usedIngredients && currentRecipe.usedIngredients.map( (currentUsed: any, index: number) => {
                    return(
                        <>
                        { ingredients?.findIndex( (current) => current.name === currentUsed.name ) === -1
                        &&
                            <TouchableOpacity onPress={ () => addMissingIngredientToGroceries({ amount: currentUsed.amount, name: currentUsed.name })}>
                                <Text style={{ marginLeft: 16 }}>{ currentUsed.name }</Text>
                            </TouchableOpacity>
                        }
                        </>
                    )
                })}
                <View style={{ marginTop: 10 }}>
                    <CustomDatePicker label="Preparation date" onDateChange={setPrepDate} date={prepDate || preparedAt} />
                </View>
                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Ingredients available: {ingredients?.length || 0}</Text>
                { ingredients && ingredients.map( (currentIngredient, index) => {
                    return(
                        <>
                            { currentRecipe?.preparedAt.toDate() > currentIngredient.exp_date.toDate() && <Text>Ingredient below will expire before its usage</Text> }
                            <View style={{ flexDirection: 'row' }} key={index}>
                                <Text style={{ color: currentIngredient.exp_date.toDate() < preparedAt ? 'red' : 'green'  }}>{currentIngredient.name}</Text>
                                <Text>&nbsp;&nbsp;&nbsp;&nbsp; Exp. date: {currentIngredient.exp_date.toDate().toLocaleDateString()}</Text>
                            </View>
                        </>
                    )
                }) }
            </KeyboardAwareScrollView>
            <View style={{ marginVertical: 30, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Button disabled={isLoading || !prepDate} title="Save" onPress={handleSubmit} />
                <Button disabled={isLoading || ( ingredients !== undefined && ingredients.length > 0 ? false : true )} title="Cancel Recipe" onPress={handleCancelSubmit} />
            </View>
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: Colors.separator
    },
});

export default ScheduleRecipeModal;
