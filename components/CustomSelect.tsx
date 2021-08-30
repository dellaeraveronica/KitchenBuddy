import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Colors from '../constants/Colors';

interface CustomSelectProps {
    value: string;
    onValueChange: (val: string) => void;
    items: {label: string, value: string}[];
    label?: string;
    placeholder?: string;
}

const CustomSelect = ({ value, onValueChange, items, label, placeholder }: CustomSelectProps) => {
    return(
        <>
            { label && <Text style={styles.label}>{label}</Text> }
            <RNPickerSelect
                value={value}
                placeholder={{ label: placeholder }}
                onValueChange={onValueChange}
                pickerProps={{
                    style: styles.textInputContainer,
                }}
                style={{ inputAndroid: styles.textInputContainer, inputIOS: styles.textInputContainer }}
                items={items}
            />
        </>
    )
}

const styles = StyleSheet.create({
    textInputContainer: {
        fontSize: 20,
        borderWidth: 1,
        borderRadius: 8,
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderColor: Colors.gunmetal,
        marginBottom: 16
    },
    label: {
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
        fontWeight: '600'
    }
});

export default CustomSelect;
