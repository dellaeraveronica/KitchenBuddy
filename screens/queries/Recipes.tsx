import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useCollection} from 'react-firebase-hooks/firestore';
import * as firebase from 'firebase';
import { Text, View } from '../../components/Themed';
import globalStyles from '../../styles/global';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import { TabEntypoIcon } from '../../navigation';
import Colors from '../../constants/Colors';
import moment from 'moment';
import CustomTextInput from '../../components/CustomTextInput';
import { dataEntry } from '../AddIngredient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Recipes = () => {
    const navigation = useNavigation();
    const [recipes, setRecipes] = useState<dataEntry[] | undefined>(undefined);
    const [search, setSearch] = useState<string>('');

    const [getAllRecipes, loading, error] = useCollection(
        firebase.default.firestore().collection('Recipes')
            .orderBy('createdAt', 'asc'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    useEffect( () => {
        const recipesFirestore = getAllRecipes?.docs
            .map( (doc) => {
                return { dbID: doc.id, ...doc.data() as any }}
            )
            .filter( (current) => current.title?.toLowerCase().includes( search.toLowerCase() ));
        setRecipes(recipesFirestore);
    }, [getAllRecipes, search]);

    return(
        <View style={[ globalStyles.contentContainer, globalStyles.paddedPage ]}>
            { loading ? (
                <View>
                    <Text>Getting groceries data...</Text>
                </View>
            ) : (
                <>
                    <View>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0, zIndex: 999 }}>
                            <TabEntypoIcon name='arrow-bold-left' color={Colors.paradisePink} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Recipes to be prepared</Text>
                        <View style={styles.separator} />
                    </View>
                    <CustomTextInput label="Search" placeholder="Enter a recipe title" value={search} onChangeText={setSearch} />
                    <KeyboardAwareScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} style={{ marginBottom: 50 }}>
                        { recipes && recipes.map( (recipe: any, index: number) => {
                            return(
                                <React.Fragment key={index}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Schedule', { id: recipe.dbID, preparedAt: moment(recipe.preparedAt.toDate()).toDate() })}>
                                        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                                        <Text>{recipe.id}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Title:</Text> {recipe.title}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>To be prepared at:</Text> {recipe.preparedAt ? moment(recipe.preparedAt.toDate()).format('LLL') : ''}</Text>
                                    </TouchableOpacity>
                                    { index !== recipes.length - 1 &&
                                    <View style={{ borderWidth: 0.5, borderColor: Colors.tiffanyBlue, marginVertical: 10 }} /> }
                                </React.Fragment>
                            )
                        }) }
                    </KeyboardAwareScrollView>
                </>
            )}
        </View>
    )
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
    },
   recipeImage: {
        height: 110,
        width: 110,
        borderRadius: 8,
        resizeMode: 'cover',
        alignSelf: 'center'
    },
});

export default Recipes;
