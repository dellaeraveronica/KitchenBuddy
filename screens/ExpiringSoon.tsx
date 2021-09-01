import * as React from 'react';
import {Button, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View } from '../components/Themed';
import globalStyles from '../styles/global';
import { useEffect, useState } from 'react';
import {
  dataEntry,
  fridgeLocations,
  ingredientCategories,
  ingredientConfectionTypes,
  ingredientRipeness
} from './AddIngredient';
import {useCollection, useCollectionOnce} from 'react-firebase-hooks/firestore';
import * as firebase from "firebase";
import Colors from '../constants/Colors';
import moment from 'moment';
import CustomTextInput from '../components/CustomTextInput';
import { TabEntypoIcon, TabFA5Icon } from '../navigation';
import { freezeIngredient, openIngredient } from '../services/ingredients';
import { useNavigation } from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const today = new Date();

const ExpiringSoon = () => {
  const navigation = useNavigation();
  const [expIngredients, setExpIngredients] = useState<dataEntry[] | undefined>(undefined);
  const [getAllExpIngredients, loading, error] = useCollection(
      firebase.default.firestore().collection('Ingredients')
          .where('exp_date', '>=', today).orderBy('exp_date', 'asc'),
      {
        snapshotListenOptions: { includeMetadataChanges: true },
      }
  );
  const [search, setSearch] = useState<string>('');

  useEffect( () => {
    const expIngredientsFirestore = getAllExpIngredients?.docs
        .map( (doc) => {
          return { id: doc.id, ...doc.data() as dataEntry }}
        )
        .filter( (current) => moment(current.exp_date?.toDate()).diff(new Date(), 'days') <= 7 )
        .filter( (current) => current.name?.toLowerCase().includes( search.toLowerCase() ));
    const expRipeFirestore = getAllExpIngredients?.docs
        .map( (doc) => {
          return { id: doc.id, ...doc.data() as dataEntry }}
        )
        .filter( (current) => moment(current.updatedAt?.toDate()).diff(new Date(), 'days') <= 3
            && (current.ripeness === '1' || current.ripeness === '3')
            && !current.isFrozen
        )
        .filter( (current) => current.name?.toLowerCase().includes( search.toLowerCase() ));

    const ids = new Set(expIngredientsFirestore?.map(d => d.id));
    if(expIngredientsFirestore && expRipeFirestore){
      const merged = [...expIngredientsFirestore as dataEntry[], ...(expRipeFirestore as dataEntry[]).filter(d => !ids.has(d.id as string))];
      setExpIngredients(merged);
    } else {
      setExpIngredients(expIngredientsFirestore);
    }
  }, [getAllExpIngredients, search]);

  const _toMultiSelectData = () => {
    return expIngredients?.map( (exp) => {
      return { name: exp.name, id: exp.id }
    })
  }

  return (
      <View style={[ globalStyles.contentContainer, globalStyles.paddedPage ]}>
        { loading ? (
            <View>
              <Text>Getting ingredients data...</Text>
            </View>
        ) : (
            <>
              <View>
                <Text style={styles.title}>About to expire</Text>
                <View style={styles.separator} />
              </View>
              <CustomTextInput label="Search" placeholder="Enter a name" value={search} onChangeText={setSearch} />
              <KeyboardAwareScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} >
                { expIngredients && expIngredients.map( (expIngredient: dataEntry, index: number) => {
                  return(
                      <React.Fragment key={index}>
                        <TouchableOpacity onPress={ () => navigation.navigate('EditIngredient', { data: expIngredient }) }>
                          <Text>{expIngredient.id}</Text>
                          <Text><Text style={{ fontWeight: 'bold' }}>Name:</Text> {expIngredient.name}</Text>
                          <Text><Text style={{ fontWeight: 'bold' }}>Brand:</Text> {expIngredient.brand}</Text>
                          <Text><Text style={{ fontWeight: 'bold' }}>Category:</Text> {expIngredient.category ? ingredientCategories[+expIngredient.category].label : ''}</Text>
                          <Text><Text style={{ fontWeight: 'bold' }}>Location:</Text> {expIngredient.location ? fridgeLocations[+expIngredient.location].label : ''}</Text>
                          <Text><Text style={{ fontWeight: 'bold' }}>Confection:</Text> {expIngredient.confection_type ? ingredientConfectionTypes[+expIngredient.confection_type].label : ''}</Text>
                          <Text><Text style={{ fontWeight: 'bold' }}>Ripeness:</Text> {expIngredient.ripeness ? ingredientRipeness[+expIngredient.ripeness].label : ''}</Text>
                          <Text><Text style={{ fontWeight: 'bold' }}>is frozen?:</Text> {expIngredient.isFrozen ? 'Yes' : 'No'}</Text>
                          <Text><Text style={{ fontWeight: 'bold' }}>is opened?:</Text> {expIngredient.isOpened ? 'Yes' : 'No'}</Text>
                          <Text>{moment(expIngredient.exp_date.toDate()).diff(new Date(), 'days')} days remaining</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                          <TouchableOpacity
                              disabled={expIngredient.isFrozen || expIngredient.isOpened}
                              onPress={ () => freezeIngredient(expIngredient.id as string, expIngredient.exp_date.toDate()) }
                              style={[styles.actionButton, { backgroundColor: expIngredient.isFrozen ? '#2f95dc' : Colors.gunmetal + '33' }]}>
                            <TabFA5Icon name='ice-cream' color={Colors.white} size={20} />
                          </TouchableOpacity>
                          <TouchableOpacity
                              disabled={expIngredient.isFrozen || expIngredient.isOpened}
                              onPress={ () => openIngredient(expIngredient.id as string, expIngredient.exp_date.toDate()) }
                              style={[styles.actionButton, { backgroundColor: expIngredient.isOpened ? Colors.freesia : Colors.gunmetal + '33' }]}>
                            <TabFA5Icon name='dropbox' color={Colors.white} size={20} />
                          </TouchableOpacity>
                          <TouchableOpacity
                              onPress={ () => navigation.navigate('Spoonacular', { data: [ { name: expIngredient.name, id: expIngredient.id } ], closestExpDate: (new Date()).toLocaleDateString() }) }
                              style={[styles.actionButton, { backgroundColor: Colors.gunmetal }]}>
                            <TabFA5Icon name='search' color={Colors.white} size={20} />
                          </TouchableOpacity>
                          <TouchableOpacity
                              onPress={ () => navigation.navigate('EditIngredient', { data: expIngredient }) }
                              style={[styles.actionButton, { backgroundColor: Colors.orange }]}>
                            <TabEntypoIcon name='edit' color={Colors.white} size={20} />
                          </TouchableOpacity>
                        </View>
                        { index !== expIngredients.length - 1 && <View style={{ borderWidth: 0.5, borderColor: Colors.tiffanyBlue, marginVertical: 10 }} /> }
                      </React.Fragment>
                  )
                }) }
              </KeyboardAwareScrollView>
            </>
        )}
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

export default ExpiringSoon;
