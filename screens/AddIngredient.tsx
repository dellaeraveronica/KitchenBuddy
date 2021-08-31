import * as React from 'react';
import {Alert, Button, ScrollView, StyleSheet, TextInput} from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import globalStyles from '../styles/global';
import CustomTextInput from '../components/CustomTextInput';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';
import { addIngredient } from '../services/ingredients';
import moment from 'moment';
import Colors from '../constants/Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export interface dataEntry {
  id?: string;
  name: string | undefined;
  brand: string | undefined;
  category: string | undefined;
  location: string | undefined;
  confection_type: string | undefined;
  ripeness: string | undefined;
  exp_date: any;
  isFrozen: boolean;
  isOpened: boolean;
  quantity: number;
  createdAt: any;
  updatedAt: any;
  boughtAt?: any;
}

export const fridgeLocations: {label: string, value: string, key: string}[] = [
  { label: 'Fridge', value: '0', key: 'fridge0' },
  { label: 'Freezer', value: '1', key: 'fridge1' },
  { label: 'Pantry', value: '2', key: 'fridge2' }
]

export const ingredientCategories: {label: string, value: string, key: string}[] = [
  { label: 'Fruit', value: '0', key: 'cat0' },
  { label: 'Vegetable', value: '1', key: 'cat1' },
  { label: 'Dairy', value: '2', key: 'cat2' },
  { label: 'Fish', value: '3', key: 'cat3' },
  { label: 'Meat', value: '4', key: 'cat4' },
  { label: 'Liquid', value: '5', key: 'cat5' }
]

export const ingredientConfectionTypes: {label: string, value: string, key: string}[] = [
  { label: 'Fresh', value: '0', key: 'con0' },
  { label: 'Canned', value: '1', key: 'con1' },
  { label: 'Frozen', value: '2', key: 'con2' },
  { label: 'Cured', value: '3', key: 'con3' },
]

export const ingredientRipeness: {label: string, value: string, key: string}[] = [
  { label: 'Green', value: '0', key: 'rip0' },
  { label: 'Ripe/Mature', value: '1', key: 'rip1' },
  { label: 'Advanced', value: '2', key: 'rip2' },
  { label: 'Too ripe', value: '3', key: 'rip3' },
]

const AddIngredient = () => {
  const navigation: RootTabScreenProps<'AddIngredient'> = useNavigation()

  const [name, setName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [confectionType, setConfectionType] = useState<string>('');
  const [ripeness, setRipeness] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [expDate, setExpDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const reset = () => {
    setName('');
    setBrand('');
    setCategory('');
    setLocation('');
    setConfectionType('');
    setRipeness('');
    setQuantity(1);
    setExpDate(new Date);
  }

  const handleSubmit = () => {
    setIsLoading(true);
    try {
      addIngredient({
        name,
        brand,
        category,
        location,
        confection_type: confectionType,
        ripeness,
        quantity,
        isFrozen: false,
        isOpened: false,
        exp_date: expDate,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate()
      } as dataEntry)
          .then( () => { reset(); Alert.alert('Success!', 'Ingredient added successfully') })
          .finally( () => setIsLoading(false));
    } catch (e) {
      console.error('Submit failed', e);
    }
  }

  return (
    <View style={[ globalStyles.contentContainer, globalStyles.paddedPage ]}>
      <View>
        <Text style={styles.title}>Add ingredient</Text>
        <View style={styles.separator} />
      </View>
      <KeyboardAwareScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} style={{ marginBottom: 30 }}>
        <CustomTextInput label="Name *" placeholder="Enter a name" value={name} onChangeText={setName} />
        <CustomTextInput label="Brand" placeholder="Enter a brand name" value={brand} onChangeText={setBrand} />
        <CustomSelect label="Category" placeholder="Select a category" value={category} onValueChange={setCategory} items={ingredientCategories} />
        <CustomSelect label="Location" placeholder="Select a location" value={location} onValueChange={setLocation} items={fridgeLocations} />
        <CustomSelect label="Confection Type" placeholder="Select a confection type" value={confectionType} onValueChange={setConfectionType} items={ingredientConfectionTypes} />
        <CustomSelect label="Ripeness" placeholder="Select a ripeness" value={ripeness} onValueChange={setRipeness} items={ingredientRipeness} />
        <CustomTextInput isNumeric label="Quantity" placeholder="Enter a quantity" value={quantity.toString()} onChangeText={(val: string) => setQuantity(+val)} />
        <CustomDatePicker label="Expiration Date" onDateChange={setExpDate} date={expDate || new Date} />
      </KeyboardAwareScrollView>
      <Button disabled={isLoading || !name} title="Add" onPress={handleSubmit} />
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

export default AddIngredient;
