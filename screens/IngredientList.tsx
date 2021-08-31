import * as React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import Colors from '../constants/Colors';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';

const IngredientList = () => {
    const navigation = useNavigation();

    return(
        <View style={[ globalStyles.contentContainer, globalStyles.paddedPage ]}>
            <View>
                <Text style={styles.title}>Ingredient list</Text>
                <View style={styles.separator} />
            </View>
            <View>
                <Button title="Missing data" onPress={() => navigation.navigate('MissingData')} />
                <Button title="Recently added" onPress={() => navigation.navigate('RecentlyAdded')} />
                <Button title="Recently bought" onPress={() => navigation.navigate('RecentlyBought')} />
                <Button title="Low quantity" onPress={() => navigation.navigate('LowQuantity')} />
                <Button title="Same location" onPress={() => navigation.navigate('SameLocation')} />
                <Button title="Same category" onPress={() => navigation.navigate('SameCategory')} />
                <Button title="Same confection type" onPress={() => navigation.navigate('SameConfection')} />
                <Button title="Barcode Scanner" onPress={() => navigation.navigate('ExpoBarCodeScanner')} />
                <Button title="Recipes" onPress={() => navigation.navigate('Recipes')} />
            </View>
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
});

export default IngredientList
