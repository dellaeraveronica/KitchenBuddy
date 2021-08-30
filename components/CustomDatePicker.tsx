import * as React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet } from 'react-native';
import CustomTextInput from './CustomTextInput';
import {useState} from 'react';
import Colors from '../constants/Colors';

interface CustomDatePickerProps {
    onDateChange: (date: Date | undefined) => void;
    date: Date;
    label?: string;
}

const CustomDatePicker = ({ onDateChange, label, date }: CustomDatePickerProps) => {
    const [show, setShow] = useState(false);

    return (
        <>
            {/*<TouchableOpacity onPress={() => setShow(true)}>*/}
            {/*    <CustomTextInput*/}
            {/*        label={label}*/}
            {/*        placeholder="Enter a date"*/}
            {/*        value={date.toLocaleDateString()}*/}
            {/*        onChangeText={() => null}*/}
            {/*        readOnly={true}*/}
            {/*        viewStyle={{ zIndex: -1 }}*/}
            {/*    />*/}
            {/*</TouchableOpacity>*/}
            { label && <Text style={styles.label}>{label}</Text> }
            <DateTimePicker
                onChange={ (evt, date) => { onDateChange(date); setShow(false) }}
                value={date}
                display="compact"
            />
        </>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
        fontWeight: '600'
    }
});


export default CustomDatePicker;
