/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, Entypo, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import EditIngredientModal from '../screens/EditIngredientModal';
import NotFoundScreen from '../screens/NotFoundScreen';
import AddIngredient from '../screens/AddIngredient';
import ExpiringSoon from '../screens/ExpiringSoon';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import IngredientList from '../screens/IngredientList';
import MissingData from '../screens/queries/MissingData';
import RecentlyAdded from '../screens/queries/RecentlyAdded';
import SameLocation from '../screens/queries/SameLocation';
import SameCategory from '../screens/queries/SameCategory';
import SameConfection from '../screens/queries/SameConfection';
import ExpoBarCodeScanner from '../screens/queries/ExpoBarCodeScanner';
import GroceriesList from '../screens/GroceriesList';
import RecentlyBought from '../screens/queries/RecentlyBought';
import LowQuantity from '../screens/queries/LowQuantity';
import QuickAddModal from '../screens/QuickAddModal';
import SpoonacularModal from '../screens/SpoonacularModal';
import Recipes from '../screens/queries/Recipes';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="EditIngredient" component={EditIngredientModal} options={{ headerShown: false}} />
        <Stack.Screen name="QuickAddGrocery" component={QuickAddModal} options={{ headerShown: false}} />
        <Stack.Screen name="Spoonacular" component={SpoonacularModal} options={{ headerShown: false}} />
      </Stack.Group>
      <Stack.Screen name="MissingData" component={MissingData} options={{ headerShown: false}} />
      <Stack.Screen name="RecentlyAdded" component={RecentlyAdded} options={{ headerShown: false}} />
      <Stack.Screen name="RecentlyBought" component={RecentlyBought} options={{ headerShown: false}} />
      <Stack.Screen name="LowQuantity" component={LowQuantity} options={{ headerShown: false}} />
      <Stack.Screen name="SameLocation" component={SameLocation} options={{ headerShown: false}} />
      <Stack.Screen name="SameCategory" component={SameCategory} options={{ headerShown: false}} />
      <Stack.Screen name="SameConfection" component={SameConfection} options={{ headerShown: false}} />
      <Stack.Screen name="ExpoBarCodeScanner" component={ExpoBarCodeScanner} options={{ headerShown: false}} />
      <Stack.Screen name="Recipes" component={Recipes} options={{ headerShown: false}} />
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="AddIngredient"
      screenOptions={{
        tabBarActiveTintColor: '#111',
        tabBarStyle: {backgroundColor: Colors.tiffanyBlue}
      }}>
      <BottomTab.Screen
        name="AddIngredient"
        component={AddIngredient}
        options={{
          title: 'Add Ingredient',
          tabBarIcon: ({ color }) => <TabEntypoIcon name="add-to-list" color={Colors.paradisePink} />,
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="ExpiringSoon"
        component={ExpiringSoon}
        options={{
          title: 'About to expire',
          tabBarIcon: ({ color }) => <TabMaterialCIcon name="clock-alert" color={Colors.paradisePink} />,
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="IngredientList"
        component={IngredientList}
        options={{
          title: 'Ingredient list',
          tabBarIcon: ({ color }) => <TabEntypoIcon name="list" color={Colors.paradisePink} />,
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="GroceriesList"
        component={GroceriesList}
        options={{
            title: 'Groceries list',
            tabBarIcon: ({ color }) => <TabMaterialIcon name="local-grocery-store" color={Colors.paradisePink} />,
            headerShown: false
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
export function TabFAIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

export function TabEntypoIcon(props: {
    name: React.ComponentProps<typeof Entypo>['name'];
    color: string;
    size?: number;
}) {
    return <Entypo size={30} style={{ marginBottom: -3 }} {...props} />;
}

export function TabMaterialCIcon(props: {
    name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
    color: string;
}) {
    return <MaterialCommunityIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}

export function TabFA5Icon(props: {
    name: React.ComponentProps<typeof FontAwesome5>['name'];
    color: string;
    size?: number;
}) {
    return <FontAwesome5 size={30} style={{ marginBottom: -3 }} {...props} />;
}

export function TabMaterialIcon(props: {
    name: React.ComponentProps<typeof MaterialIcons>['name'];
    color: string;
    size?: number;
}) {
    return <MaterialIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}


