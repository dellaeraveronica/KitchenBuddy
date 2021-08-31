/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {dataEntry} from './screens/AddIngredient';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  EditIngredient: { data: dataEntry };
  NotFound: undefined;
  QuickAddGrocery: undefined;
  MissingData: undefined;
  RecentlyAdded: undefined;
  RecentlyBought: undefined;
  LowQuantity: undefined;
  SameLocation: undefined;
  SameCategory: undefined;
  SameConfection: undefined;
  ExpoBarCodeScanner: undefined;
  Recipes: undefined;
  Spoonacular: { data: { name: string | undefined, id: string | undefined }[] | undefined, closestExpDate: string };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  AddIngredient: undefined;
  ExpiringSoon: undefined;
  IngredientList: undefined;
  GroceriesList: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
