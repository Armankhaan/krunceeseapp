import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import md5 from 'md5';
import { useNavigation } from '@react-navigation/native';
import { StoreContext } from '../../context/StoreContext';
import { ThemeContext } from '../../context/ThemeContext';

const RED = '#D32F2F';

const PlaceOrderScreen = () => {
  const navigation = useNavigation();
  const { cartItems, customerInfo, orderDetails, updateOrderDetails, clearCart } =
    useContext(StoreContext);
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [jazzCashPhone, setJazzCashPhone] = useState('');
  const [CNIC, setCNIC] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [additional, setAdditional] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (!orderDetails?.orderType) {
  //     navigation.navigate('Profile');
  //   }
  // }, [orderDetails]);

  const getTotalCartAmount = () =>
    Math.round(
      Object.values(cartItems).reduce(
        (sum, item) =>
          sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
        0
      )
    );

  const handleSubmit = async () => {
    if (loading) return;
    if (!customerInfo) return navigation.navigate('Login');
    if (!cartItems || !Object.keys(cartItems).length) return navigation.navigate('Home');
    if (!paymentMethod)
      return Alert.alert('Error', 'Please select a payment method before proceeding!');
    if (!orderDetails?.orderType) {
      navigation.navigate('Profile');
    }
    setLoading(true);
    try {
      const now = Date.now();
      const cartHash = md5(JSON.stringify(cartItems));
      const lastTime = await AsyncStorage.getItem('lastOrderTime');
      const lastHash = await AsyncStorage.getItem('lastOrderHash');

      if (lastTime && lastHash === cartHash && (now - +lastTime) / 1000 < 30) {
        Alert.alert('Error', 'Order submitted recently. Please wait a moment.');
        setLoading(false);
        return;
      }

      const fullAddress = `${building}, ${floor}, ${street}, ${city}, ${additional}`;
      const addressAndPayment = {
        paymentMethod,
        address: fullAddress,
        ...(paymentMethod === 'JazzCash' && { jazzCashPhone, CNIC }),
      };

      await AsyncStorage.setItem('lastOrderTime', now.toString());
      await AsyncStorage.setItem('lastOrderHash', cartHash);
      await AsyncStorage.setItem('addressAndPayment', JSON.stringify(addressAndPayment));

      const payload = {
        cartItems,
        customerInfo,
        addressAndPayment,
        orderTotal: getTotalCartAmount(),
        contextData: { orderDetails },
      };
      updateOrderDetails(payload);

      const response = await axios.post(
        'https://krc.shabanbabar.com/api/mobile-place-order',
        payload
      );

      const transactId = response.data.apiResponse?.TRANSACT ?? null;
      clearCart();
      navigation.navigate('OrderSuccess', { transactId });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred while placing the order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Payment Method</Text>
      {/* <View style={styles.methodRow}>
        {['Cash on Delivery'].map(method => (
          <TouchableOpacity
            key={method}
            onPress={() => setPaymentMethod(method)}
            style={[
              styles.methodBtn,
              paymentMethod === method && styles.methodBtnSelected
            ]}
          >
            <Text style={styles.methodText}>{method}</Text>
          </TouchableOpacity>
        ))}
      </View> */}
      {/* 
      {paymentMethod === 'JazzCash' && (
        <View style={styles.section}>
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor={theme.colors.text + '80'}
            keyboardType="phone-pad"
            value={jazzCashPhone}
            onChangeText={setJazzCashPhone}
            style={styles.input}
          />
          <TextInput
            placeholder="CNIC last 6 digits"
            placeholderTextColor={theme.colors.text + '80'}
            keyboardType="number-pad"
            value={CNIC}
            onChangeText={setCNIC}
            style={styles.input}
          />
        </View>
      )} */}

      {orderDetails?.orderType === 'Delivery' && (
        <>
          <Text style={[styles.heading, { marginTop: 20 }]}>Delivery Address</Text>
          <View style={styles.section}>
            {['Building', 'Floor', 'Street', 'City'].map((field, i) => (
              <TextInput
                key={field}
                placeholder={field}
                placeholderTextColor={theme.colors.text + '80'}
                value={[building, floor, street, city][i]}
                onChangeText={[setBuilding, setFloor, setStreet, setCity][i]}
                style={styles.input}
              />
            ))}
            <TextInput
              placeholder="Additional info"
              placeholderTextColor={theme.colors.text + '80'}
              value={additional}
              onChangeText={setAdditional}
              style={[styles.input, { height: 80 }]}
              multiline
            />
          </View>
        </>
      )}

      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={styles.summaryText}>Sub Total</Text>
          <Text style={styles.summaryText}>Rs {getTotalCartAmount()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.summaryText}>Delivery Fee</Text>
          <Text style={styles.summaryText}>Rs 0</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.summaryText, styles.boldText]}>Total</Text>
          <Text style={[styles.summaryText, styles.boldText]}>Rs {getTotalCartAmount()}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.proceedBtn, loading && { opacity: 0.6 }]}
        disabled={loading}
      >
        <Text style={styles.proceedText}>
          {loading ? 'Processing...' : 'Place Order'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const getStyles = theme => {
  const isLight = !theme.dark;
  const border = isLight ? '#ccc' : '#555';
  const inputBg = isLight ? '#fff' : '#1f1f1f';
  const cardBg = isLight ? '#fafafa' : '#2a2a2a';
  const text = theme.colors.text;
  const primary = theme.colors.primary;

  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: text,
    },
    methodRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
    methodBtn: {
      padding: 12,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 4,
      backgroundColor: cardBg,
    },
    methodBtnSelected: {
      borderColor: RED,
      backgroundColor: RED + '20',
    },
    methodText: {
      color: text,
      fontWeight: '500',
    },
    section: {
      marginVertical: 8,
      backgroundColor: cardBg,
      padding: 8,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: border,
    },
    input: {
      borderWidth: 1,
      borderColor: border,
      borderRadius: 4,
      padding: 8,
      marginVertical: 4,
      backgroundColor: inputBg,
      color: text,
    },
    summary: {
      marginTop: 20,
      paddingVertical: 8,
      backgroundColor: cardBg,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: border,
      borderRadius: 6,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 4,
    },
    summaryText: {
      color: text,
      fontSize: 16,
    },
    boldText: {
      fontWeight: 'bold',
    },
    proceedBtn: {
      backgroundColor: RED,
      padding: 16,
      borderRadius: 4,
      alignItems: 'center',
      marginTop: 24,
    },
    proceedText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
};

export default PlaceOrderScreen;
