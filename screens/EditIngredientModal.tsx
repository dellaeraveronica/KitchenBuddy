import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {Alert, Button, Platform, ScrollView, StyleSheet} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import globalStyles from '../styles/global';
import CustomTextInput from '../components/CustomTextInput';
import CustomSelect from '../components/CustomSelect';
import CustomDatePicker from '../components/CustomDatePicker';
import {
  dataEntry,
  fridgeLocations,
  ingredientCategories,
  ingredientConfectionTypes,
  ingredientRipeness
} from './AddIngredient';
import {addIngredient, editIngredient} from '../services/ingredients';
import moment from 'moment';
import {useState} from 'react';
import Colors from '../constants/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const EditIngredientModal = () => {
  const router = useRoute();
  const navigation = useNavigation();
  const {data} = router.params as { data: dataEntry };
  const [name, setName] = useState<string>(data.name || '');
  const [brand, setBrand] = useState<string>(data.brand || '');
  const [category, setCategory] = useState<string>(data.category || '');
  const [location, setLocation] = useState<string>(data.location || '');
  const [confectionType, setConfectionType] = useState<string>(data.confection_type || '');
  const [ripeness, setRipeness] = useState<string>( data.ripeness || '');
  const [quantity, setQuantity] = useState<number>( data.quantity || 1);
  const [expDate, setExpDate] = useState<Date | undefined>(data.exp_date.toDate() || new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    setIsLoading(true);
    try {
      editIngredient(data.id as string, {
        name,
        brand,
        category,
        location,
        confection_type: confectionType,
        ripeness,
        quantity,
        exp_date: expDate,
        updatedAt: moment().toDate()
      } as Partial<dataEntry>)
          .then( () => { Alert.alert('Success!', 'Ingredient edited successfully'); })
          .finally( () => setIsLoading(false));
    } catch (e) {
      console.error('Submit failed', e);
    }
  }

  return (
      <View style={[ globalStyles.contentContainer, globalStyles.paddedPage ]}>
        <View>
          <Text style={styles.title}>Edit ingredient</Text>
          <View style={styles.separator} />
        </View>
        <KeyboardAwareScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} style={{ marginBottom: 30 }}>
          <CustomTextInput label="Name *" placeholder="Enter a name" value={name} onChangeText={setName} />
          <CustomTextInput label="Brand" placeholder="Enter a brand name" value={brand} onChangeText={setBrand} />
          <CustomSelect label="Category" placeholder="Select a category" value={category} onValueChange={setCategory} items={ingredientCategories} />
          <CustomSelect label="Location" placeholder="Select a location" value={location} onValueChange={setLocation} items={fridgeLocations} />
          <CustomSelect label="Confection Type" placeholder="Select a confection type" value={confectionType} onValueChange={setConfectionType} items={ingredientConfectionTypes} />
          <CustomSelect label="Ripeness" placeholder="Select a ripeness" value={ripeness} onValueChange={setRipeness} items={ingredientRipeness} />
          <CustomTextInput isNumeric label="Quantity" placeholder="Enter a quantity" value={quantity.toString()} onChangeText={(val:string) => setQuantity(+val)} />
          <CustomDatePicker label="Expiration Date" onDateChange={setExpDate} date={expDate || new Date} />
        </KeyboardAwareScrollView>
        <View style={{ marginVertical: 30 }}>
          <Button disabled={isLoading || !name} title="Edit" onPress={handleSubmit} />
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

export default EditIngredientModal;
