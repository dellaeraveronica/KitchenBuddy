import * as React from 'react';
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import globalStyles from '../styles/global';
import Colors from '../constants/Colors';
import { useCollection } from 'react-firebase-hooks/firestore';
import * as firebase from 'firebase';
import { useEffect, useState } from 'react';
import { buyIngredient } from '../services/ingredients';
import { TabMaterialIcon} from '../navigation';
import { useNavigation } from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export interface groceryEntry {
    id?: string;
    name: string;
    quantity: number;
    category: string;
    confection_type: string;
    exp_date: any;
    createdAt: any;
    updatedAt: any;
    deletedAt: any;
}

const today = new Date();

const GroceriesList = () => {
    const navigation = useNavigation();
    const [getAllGroceries, loading, error] = useCollection(
        firebase.default.firestore().collection('Groceries'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const [groceries, setGroceries] = useState<groceryEntry[] | undefined>(undefined);

    useEffect( () => {
        const groceriesFirestore = getAllGroceries?.docs
            .map( (doc) => {
                return { id: doc.id, ...doc.data() as groceryEntry }}
            )
            .filter( (current) => !current.deletedAt)
        setGroceries(groceriesFirestore);
    }, [getAllGroceries])

    return(
        <View style={[ globalStyles.contentContainer, globalStyles.paddedPage ]}>
            { loading ? (
                <View>
                    <Text>Getting groceries data...</Text>
                </View>
            ) : (
                <>
                    <View>
                        <Text style={styles.title}>Groceries list</Text>
                        <View style={styles.separator} />
                    </View>
                    <KeyboardAwareScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} >
                        { groceries && groceries.map( (grocery: groceryEntry, index: number) => {
                            return(
                                <React.Fragment key={index}>
                                    <TouchableOpacity onPress={ () => null }>
                                        <Text>{grocery.id}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Name:</Text> {grocery.name}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Quantity:</Text> {grocery.quantity}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Category:</Text> {grocery.category}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Confection type:</Text> {grocery.confection_type}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Exp. date:</Text> {grocery.exp_date?.toDate()}</Text>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={ () => buyIngredient(grocery.id as string, {
                                                name: grocery.name,
                                                quantity: grocery.quantity || 1,
                                                category: grocery.category || '',
                                                confection_type: grocery.confection_type || '',
                                                ripeness: '',
                                                location: '',
                                                brand: '',
                                                exp_date: grocery.exp_date || today,
                                                boughtAt: new Date(),
                                                createdAt: new Date(),
                                                updatedAt: new Date(),
                                            }) }
                                            style={[styles.actionButton, { backgroundColor: Colors.gunmetal }]}>
                                            <TabMaterialIcon name='add-shopping-cart' color={Colors.white} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                    { index !== groceries.length - 1 &&
                                    <View style={{ borderWidth: 0.5, borderColor: Colors.tiffanyBlue, marginVertical: 10 }} /> }
                                </React.Fragment>
                            )
                        }) }
                    </KeyboardAwareScrollView>
                    <Button title="Quick-add" onPress={() => navigation.navigate('QuickAddGrocery')} />
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


export default GroceriesList;
