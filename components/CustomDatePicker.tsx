import * as React from 'react';
import {Button, Platform, Pressable, Text, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet } from 'react-native';
import {useState} from 'react';

interface CustomDatePickerProps {
    onDateChange: (date: Date | undefined) => void;
    date: Date;
    label?: string;
}

const CustomDatePicker = ({ onDateChange, label, date }: CustomDatePickerProps) => {
    const [show, setShow] = useState(false);

    return (
        <>
            { label && <Text style={styles.label}>{label} {Platform.OS === 'android' && date.toLocaleDateString()}</Text> }
            <>
                { Platform.OS === 'android' && <Button title={'Change date'} onPress={() => setShow(true)} /> }
                { Platform.OS === 'ios' && <DateTimePicker
                    onChange={ (evt, date) => { onDateChange(date); setShow(false) }}
                    value={date}
                    display="default"
                    mode="date"
                /> }
                { show && Platform.OS === 'android' && <DateTimePicker
                    onChange={ (evt, date) => { onDateChange(date); setShow(false) }}
                    value={date}
                    display="default"
                    mode="date"
                /> }
            </>
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
