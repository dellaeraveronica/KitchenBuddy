import * as React from 'react';
import {StyleSheet, Text, TextInput, TextStyle, View, ViewStyle} from 'react-native';
import Colors from '../constants/Colors';

interface CustomTextInputProps {
    viewStyle?: ViewStyle;
    textStyle?: TextStyle;
    label?: string;
    onChangeText: (val: string) => void;
    value: string | undefined;
    placeholder: string | undefined;
    readOnly?: boolean;
    isNumeric?: boolean;
}

const CustomTextInput = ({ viewStyle, textStyle, onChangeText, value, label, placeholder, readOnly, isNumeric }: CustomTextInputProps) => {
    return(
        <>
            { label && <Text style={styles.label}>{label}</Text> }
            <View style={[viewStyle, styles.inputContainer]}>
                <TextInput style={[textStyle, styles.textInputContainer]}
                           onChangeText={onChangeText}
                           value={value}
                           placeholder={placeholder}
                           editable={!readOnly}
                           pointerEvents={readOnly ? 'none' : 'auto'}
                           keyboardType={ isNumeric ? "numeric" : "default" }
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        borderWidth: 1,
        borderRadius: 8,
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderColor: Colors.gunmetal,
        marginBottom: 16
    },
    textInputContainer: {
        fontSize: 20
    },
    label: {
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
        fontWeight: '600'
    }
});

export default CustomTextInput;
