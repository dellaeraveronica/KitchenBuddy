import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {Alert, Button, Platform, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View } from '../components/Themed';
import globalStyles from '../styles/global';
import {
    dataEntry,
} from './AddIngredient';
import {addIngredient, addRecipe} from '../services/ingredients';
import moment from 'moment';
import {useState} from 'react';
import Colors from '../constants/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TabEntypoIcon, TabFA5Icon} from '../navigation';
import {searchRecipe} from '../services/spoonacular';
import MultiSelect from 'react-native-multiple-select';

export interface recipeEntry {
    id?: string;
    title: string | undefined;
    ingredients: string | undefined;
    preparedAt: any;
}

const SpoonacularModal = () =>  {
    const router = useRoute();
    const navigation = useNavigation();
    const {data, closestExpDate} = router.params as { data: dataEntry[], closestExpDate: any };
    const [search, setSeach] = useState<string>('');
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const addMissingIngredient = (missingIngredient: { amount: number, name: string }) => {
        setIsLoading(true);
        try {
            addIngredient({
                name: missingIngredient.name,
                brand: '',
                category: '',
                location: '',
                confection_type: '',
                ripeness: '',
                quantity: missingIngredient.amount,
                exp_date: closestExpDate.toDate(),
                createdAt: moment().toDate(),
                updatedAt: moment().toDate(),
                boughtAt: moment().toDate()
            } as dataEntry)
                .then( () => { Alert.alert('Success!', 'Ingredient added successfully'); })
                .finally( () => setIsLoading(false));
        } catch (e) {
            console.error('Submit failed', e);
        }
    }

    const scheduleRecipe = () => {
        setIsLoading(true);
        try {
            addRecipe({
                title: '',
                ingredients: '',
                preparedAt: '',
            } as recipeEntry)
                .then( () => { Alert.alert('Success!', 'Recipe scheduled successfully'); })
                .finally( () => setIsLoading(false));
        } catch (e) {
            console.error('Submit failed', e);
        }
    }

    const _toSeparatedByComma = () => {
        const strings = selectedItems.map( (item: any) => {
            return data.find( (val: any) => item === val.id );
        })
        return strings.join(',')
    }

    const searchRecipes = () => {
        setIsLoading(true);
        try {
            searchRecipe(_toSeparatedByComma())
                .then( (recipes) => { setRecipes(recipes) })
                .finally( () => setIsLoading(false));
        } catch (e) {
            console.error('Search failed', e);
        }
    }

    return (
        <View style={[ globalStyles.contentContainer, globalStyles.paddedPage ]}>
            <View>
                <Text style={styles.title}>Search recipe</Text>
                <View style={styles.separator} />
            </View>
            <MultiSelect
                hideTags
                items={data}
                uniqueKey="id"
                selectedItems={selectedItems}
                selectText="Pick Ingredients"
                searchInputPlaceholderText="Search Ingredients..."
                onChangeInput={ (text)=> console.log(text)}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                hideSubmitButton
                onSelectedItemsChange={ (items) => { console.log(items); setSelectedItems(items) } }
            />
            <ScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} style={{ marginBottom: 30 }}>
                { recipes.length > 0 && recipes.map( (recipe: any, index: number) => {
                    return(
                        <React.Fragment key={index}>
                            <Text><Text style={{ fontWeight: 'bold' }}>Name:</Text> {recipe.title}</Text>
                            { recipe.missedIngredientCount > 0 && recipe.missedIngredients.map( (missedIngredient: any) =>
                                    <TouchableOpacity onPress={() => addMissingIngredient({
                                        name: missedIngredient.name,
                                        amount: missedIngredient.amount,
                                    })}>
                                        <Text>{missedIngredient.name}</Text>
                                    </TouchableOpacity>
                                )
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <TouchableOpacity
                                    onPress={ () => addRecipe(recipe) }
                                    style={[styles.actionButton, { backgroundColor: Colors.orange }]}>
                                    <TabEntypoIcon name='plus' color={Colors.white} size={20} />
                                </TouchableOpacity>
                            </View>
                            { index !== recipes.length - 1 &&
                            <View style={{ borderWidth: 0.5, borderColor: Colors.tiffanyBlue, marginVertical: 10 }} /> }
                        </React.Fragment>
                    )
                }) }
            </ScrollView>
            <View style={{ marginVertical: 30 }}>
                <Button disabled={isLoading || !selectedItems.length} title="Search on Spoonacular" onPress={searchRecipes} />
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
    actionButton: {
        height: 24,
        width: 24,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 6,
        marginTop: 6
    }
});

export default SpoonacularModal;
