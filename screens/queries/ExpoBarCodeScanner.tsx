import * as React from 'react';
import globalStyles from '../../styles/global';
import {Button, StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import { TabEntypoIcon } from '../../navigation';
import Colors from '../../constants/Colors';
import { Text } from '../../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import { getProduct as OFFGet } from '../../services/openFoodFacts';

const ExpoBarCodeScanner = () => {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [scanned, setScanned] = useState(false);
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
        console.log(type, data);
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        await OFFGet(data)
            .then( (res) => {
                console.log('OFF res', res);
                if(res){
                    setProduct(res);
                }
            })
            .catch( (err) => {
                console.log('Oops! something went wrong with OFF', err);
            });
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={[ globalStyles.contentContainer, globalStyles.paddedPage ]}>
            <View>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0, zIndex: 999 }}>
                    <TabEntypoIcon name='arrow-bold-left' color={Colors.paradisePink} />
                </TouchableOpacity>
                <Text style={styles.title}>Barcode Scanner</Text>
                <View style={styles.separator} />
            </View>
            <View style={styles.container}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={[ StyleSheet.absoluteFillObject, { alignSelf: 'center' } ]}
                />
                {scanned &&
                    <View style={{ marginTop: 35 }}>
                        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
                    </View>
                }
            </View>
            {product &&
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>{product.status_verbose}</Text>
                    <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>{product.product.code}</Text>
                    <Image source={{ uri: product.product.image_url }} style={styles.productImage} />
                    <Text>{product.product.product_name}</Text>
                    <Text>{product.product.quantity}</Text>
                    <Text style={{ fontSize: 8 }}>Powered by OFF (Open Food Facts)</Text>
                </View>
            }
            {scanned && !product && <Text style={{ textAlign: 'center', marginTop: 10 }}>Product not found!</Text>}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '35%',
        width: '100%',
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
    productImage: {
        height: 110,
        width: 110,
        borderRadius: 8,
        resizeMode: 'cover',
    },
});

export default ExpoBarCodeScanner;
