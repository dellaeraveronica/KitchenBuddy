import * as React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {dataEntry} from '../AddIngredient';
import {useCollection} from 'react-firebase-hooks/firestore';
import * as firebase from 'firebase';
import {Text, View} from '../../components/Themed';
import globalStyles from '../../styles/global';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {TabEntypoIcon, TabFA5Icon} from '../../navigation';
import Colors from '../../constants/Colors';
import moment from 'moment';
import CustomTextInput from '../../components/CustomTextInput';
import {freezeIngredient, openIngredient} from '../../services/ingredients';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const RecentlyAdded = () => {
    const navigation = useNavigation();
    const [ingredients, setIngredients] = useState<dataEntry[] | undefined>(undefined);
    const [search, setSearch] = useState<string>('');

    const [getAllIngredients, loading, error] = useCollection(
        firebase.default.firestore().collection('Ingredients')
            .orderBy('createdAt', 'desc'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    useEffect( () => {
        const ingredientsFirestore = getAllIngredients?.docs
            .map( (doc) => {
                return { id: doc.id, ...doc.data() as dataEntry }}
            )
            .filter( (current) => current.name?.toLowerCase().includes( search.toLowerCase() ));
        setIngredients(ingredientsFirestore);
    }, [getAllIngredients, search]);

    return(
        <View style={[ globalStyles.contentContainer, globalStyles.paddedPage ]}>
            { loading ? (
                <View>
                    <Text>Getting ingredients data...</Text>
                </View>
            ) : (
                <>
                    <View>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0, zIndex: 999 }}>
                            <TabEntypoIcon name='arrow-bold-left' color={Colors.paradisePink} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Ingredients recently added</Text>
                        <View style={styles.separator} />
                    </View>
                    <CustomTextInput label="Search" placeholder="Enter a name" value={search} onChangeText={setSearch} />
                    <KeyboardAwareScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} style={{ marginBottom: 50 }}>
                        { ingredients && ingredients.map( (ingredient: dataEntry, index: number) => {
                            return(
                                <React.Fragment key={index}>
                                    <TouchableOpacity onPress={() => navigation.navigate('EditIngredient', { data: ingredient })}>
                                        <Text>{ingredient.id}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Name:</Text> {ingredient.name}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Brand:</Text> {ingredient.brand}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Category:</Text> {ingredient.category}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Location:</Text> {ingredient.location}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Confection:</Text> {ingredient.confection_type}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Ripeness:</Text> {ingredient.ripeness}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>is frozen?:</Text> {ingredient.isFrozen ? 'Yes' : 'No'}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>is opened?:</Text> {ingredient.isOpened ? 'Yes' : 'No'}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Created at:</Text> {ingredient.createdAt ? moment(ingredient.createdAt.toDate()).format('LLL') : ''}</Text>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            disabled={ingredient.isFrozen || ingredient.isOpened}
                                            onPress={ () => freezeIngredient(ingredient.id as string, ingredient.exp_date.toDate()) }
                                            style={[styles.actionButton, { backgroundColor: ingredient.isFrozen ? '#2f95dc' : Colors.gunmetal + '33' }]}>
                                            <TabFA5Icon name='ice-cream' color={Colors.white} size={20} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            disabled={ingredient.isFrozen || ingredient.isOpened}
                                            onPress={ () => openIngredient(ingredient.id as string, ingredient.exp_date.toDate()) }
                                            style={[styles.actionButton, { backgroundColor: ingredient.isOpened ? Colors.freesia : Colors.gunmetal + '33' }]}>
                                            <TabFA5Icon name='dropbox' color={Colors.white} size={20} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={ () => navigation.navigate('EditIngredient', { data: ingredient }) }
                                            style={[styles.actionButton, { backgroundColor: Colors.orange }]}>
                                            <TabEntypoIcon name='edit' color={Colors.white} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                    { index !== ingredients.length - 1 &&
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
    }
});

export default RecentlyAdded;
