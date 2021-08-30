import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useCollection} from 'react-firebase-hooks/firestore';
import * as firebase from 'firebase';
import { Text, View } from '../../components/Themed';
import globalStyles from '../../styles/global';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { TabEntypoIcon, TabFA5Icon } from '../../navigation';
import Colors from '../../constants/Colors';
import moment from 'moment';
import CustomTextInput from '../../components/CustomTextInput';
import { dataEntry } from '../AddIngredient';

const LowQuantity = () => {
    const navigation = useNavigation();
    const [groceries, setGroceries] = useState<dataEntry[] | undefined>(undefined);
    const [search, setSearch] = useState<string>('');

    const [getAllGroceries, loading, error] = useCollection(
        firebase.default.firestore().collection('Ingredients')
            .orderBy('quantity', 'asc').limit(10),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    useEffect( () => {
        const groceriesFirestore = getAllGroceries?.docs
            .map( (doc) => {
                return { id: doc.id, ...doc.data() as dataEntry }}
            )
            .filter( (current) => current.quantity < 5)
            .filter( (current) => current.name?.toLowerCase().includes( search.toLowerCase() ));;
        setGroceries(groceriesFirestore);
    }, [getAllGroceries, search]);

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
                        <Text style={styles.title}>Ingredients on low quantity</Text>
                        <View style={styles.separator} />
                    </View>
                    <CustomTextInput label="Search" placeholder="Enter a name" value={search} onChangeText={setSearch} />
                    <ScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} style={{ marginBottom: 50 }}>
                        { groceries && groceries.map( (grocery: dataEntry, index: number) => {
                            return(
                                <React.Fragment key={index}>
                                    <TouchableOpacity onPress={() => navigation.navigate('EditIngredient', { data: grocery })}>
                                        <Text>{grocery.id}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Name:</Text> {grocery.name}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Quantity:</Text> {grocery.quantity}</Text>
                                        <Text><Text style={{ fontWeight: 'bold' }}>Created at:</Text> {grocery.createdAt ? moment(grocery.createdAt.toDate()).format('LLL') : ''}</Text>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <TouchableOpacity
                                            onPress={ () => navigation.navigate('EditIngredient', { data: grocery }) }
                                            style={[styles.actionButton, { backgroundColor: Colors.orange }]}>
                                            <TabEntypoIcon name='edit' color={Colors.white} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                    { index !== groceries.length - 1 &&
                                    <View style={{ borderWidth: 0.5, borderColor: Colors.tiffanyBlue, marginVertical: 10 }} /> }
                                </React.Fragment>
                            )
                        }) }
                    </ScrollView>
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

export default LowQuantity;
