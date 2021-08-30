import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {Alert, Button, Platform, ScrollView, StyleSheet} from 'react-native';
import { Text, View } from '../components/Themed';
import globalStyles from '../styles/global';
import CustomTextInput from '../components/CustomTextInput';
import {quickAddGrocery} from '../services/ingredients';
import {useState} from 'react';
import Colors from '../constants/Colors';
import {useNavigation, useRoute} from '@react-navigation/native';

const QuickAddModal = () => {
    const navigation = useNavigation();
    const [name, setName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = () => {
        setIsLoading(true);
        try {
            quickAddGrocery({ name, createdAt: new Date() })
                .then( () => { Alert.alert('Success!', 'Grocery added successfully'); reset(); })
                .finally( () => setIsLoading(false));
        } catch (e) {
            console.error('Submit failed', e);
        }
    }

    const reset = () => {
        setName('');
    }

    return (
        <View style={[ globalStyles.contentContainer, globalStyles.paddedPage ]}>
            <View>
                <Text style={styles.title}>Edit ingredient</Text>
                <View style={styles.separator} />
            </View>
            <ScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} style={{ marginBottom: 30 }}>
                <CustomTextInput label="Name *" placeholder="Enter a name" value={name} onChangeText={setName} />
            </ScrollView>
            <View style={{ marginVertical: 30 }}>
                <Button disabled={isLoading || !name} title="Quick add" onPress={handleSubmit} />
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

export default QuickAddModal;
