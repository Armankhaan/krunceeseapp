import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { ThemeContext } from '../../context/ThemeContext';

import { StoreContext } from '../../context/StoreContext';

export function Settings() {

  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [mode, setMode] = useState('Login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('92');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  const [forgot, setForgot] = useState(false);
  const [fpStep, setFpStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const [orders, setOrders] = useState([]);
  const nav = useNavigation();

  const paymentMethods = {
    0: 'Cash',
    1: 'Cash',
    1008: 'JazzCash',
    1009: 'Card',
  };

  const groupOrders = (ordersList) => {
    const grouped = [];
    for (let i = 0; i < ordersList.length; i += 2) {
      grouped.push(ordersList.slice(i, i + 2));
    }
    return grouped;
  };

  const {
    customerInfo,
    updateCustomerInfo,
    updateOrderDetails,
    updateUsername,
    clearCustomerInfo
  } = useContext(StoreContext);


  // console.log('Customer Info:', customerInfo);

  // useEffect(() => {
  //   if (!customerInfo?.id) return;

  //   const fetchOrders = async () => {
  //     try {
  //       const res = await axios.post(
  //         'hhttps://krc.shabanbabar.com/api/customer-orders',
  //         { phone_number: customerInfo.phone_number }
  //       );
  //       if (res.data.success) setOrders(res.data.orders);
  //       else Toast.show({ type: 'info', text1: 'No orders found' });
  //     } catch {
  //       Toast.show({ type: 'error', text1: 'Could not fetch orders' });
  //     }
  //   };

  //   fetchOrders();
  // }, [customerInfo]);


  const validatePhone = value => {
    if (!/^\d*$/.test(value)) return 'Only numbers allowed';
    if (value.length !== 12) return 'Must be 12 digits';
    if (!value.startsWith('92')) return 'Must start with 92';
    if (value[2] !== '3') return "After '92' must start with 3";
    return '';
  };
  const onPhoneChange = txt => {
    setPhone(txt);
    setPhoneError(validatePhone(txt));
  };

  const toastError = msg => Toast.show({ type: 'error', text1: msg });
  const toastSuccess = msg => Toast.show({ type: 'success', text1: msg });

  const handleSubmit = async () => {
    if (mode === 'Sign Up' && phoneError) {
      toastError(phoneError);
      return;
    }
    setLoading(true);
    try {
      let url;
      let payload = { email, password };
      if (mode === 'Sign Up') {
        url = 'https://krc.shabanbabar.com/api/customer/verify-otp';
        payload = { username, email, phone_number: phone, password };
      } else {
        url = 'hhttps://krc.shabanbabar.com/api/customer/login';
      }
      const res = await axios.post(url, payload);
      console.log('Response:', res.data);
      const customer = res.data.customer;
      updateUsername(customer.name);
      updateCustomerInfo(customer);
      updateOrderDetails(customer);
      toastSuccess(mode === 'Login' ? 'Login successful!' : 'Registration successful!');
      setTimeout(() => {
        setLoading(false);
        nav.navigate('HomeTabs', { screen: 'Home' });
      }, 500);
    } catch (e) {
      toastError(e.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  // Forgot‐password handlers
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        'hhttps://krc.shabanbabar.com/api/customer/forgot-otp',
        { email: forgotEmail }
      );
      toastSuccess('OTP sent—check your inbox');
      setFpStep(2);
    } catch (e) {
      toastError(e.response?.data?.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        'hhttps://krc.shabanbabar.com/api/customer/verify',
        { email: forgotEmail, otp }
      );
      toastSuccess('OTP verified');
      setFpStep(3);
    } catch (e) {
      toastError(e.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPass !== newPassConfirm) {
      toastError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        'hhttps://krc.shabanbabar.com/api/customer/reset-password',
        {
          email: forgotEmail,
          password: newPass,
          password_confirmation: newPassConfirm,
        }
      );
      toastSuccess('Password has been reset. You can now log in.');
      setForgot(false);
      setFpStep(1);
    } catch (e) {
      toastError(e.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  // if (customerInfo?.id) {
  //   return (
  //     <ScrollView contentContainerStyle={styles.loggedInContainer}>
  //       {/* --- Account Info --- */}


  //       <TouchableOpacity
  //         style={[styles.btn, styles.logoutBtn]}
  //         onPress={() => {
  //           nav.navigate('Root', {
  //             screen: 'HomeTabs',
  //             params: { screen: 'Home' },
  //           });
  //         }}
  //       >
  //         <Text style={styles.btnText}> Go to Home</Text>
  //       </TouchableOpacity>
  //       <Text style={styles.title}>ACCOUNT</Text>
  //       <View style={styles.infoRow}>
  //         <Text style={styles.value}>{customerInfo.name}</Text>
  //       </View>
  //       <View style={styles.infoRow}>
  //         <Text style={styles.value}>{customerInfo.email}</Text>
  //       </View>
  //       <View style={styles.infoRow}>
  //         <Text style={styles.value}>{customerInfo.phone_number}</Text>
  //       </View>
  //       <TouchableOpacity
  //         style={[styles.btn, styles.logoutBtn]}
  //         onPress={() => {
  //           clearCustomerInfo();
  //           nav.navigate('Root', {
  //             screen: 'HomeTabs',
  //             params: { screen: 'Account' },
  //           });
  //         }}
  //       >
  //         <Text style={styles.btnText}>Log Out</Text>
  //       </TouchableOpacity>

  //       {/* --- Order History --- */}
  //       <Text style={styles.sectionTitle}>Order History</Text>
  //       {orders.length === 0 ? (
  //         <Text style={styles.noOrders}>No orders found.</Text>
  //       ) : (
  //         orders.map(order => {
  //           const total = order.details.reduce(
  //             (sum, i) => sum + i.quantity * i.costeach,
  //             0
  //           );
  //           return (
  //             <View style={styles.orderCard} key={order.id}>
  //               {/* header */}
  //               <Text style={styles.orderMeta}>
  //                 <Text style={styles.metaLabel}>ID:</Text> {order.cc_transact}
  //               </Text>
  //               <Text style={styles.orderMeta}>
  //                 <Text style={styles.metaLabel}>Pay:</Text>{' '}
  //                 {paymentMethods[order.howpaid] || 'Unknown'}
  //               </Text>
  //               <Text style={styles.orderMeta}>
  //                 <Text style={styles.metaLabel}>Date:</Text>{' '}
  //                 {new Date(order.created_at).toLocaleDateString()}
  //               </Text>

  //               {/* items */}
  //               {order.details.map(item => (
  //                 <View style={styles.itemRow} key={item.id}>
  //                   <Text style={styles.itemName}>{item.product_full_name}</Text>
  //                   <Text style={styles.itemQty}>×{item.quantity}</Text>
  //                   <Text style={styles.itemCost}>{item.costeach}</Text>
  //                 </View>
  //               ))}

  //               {/* total */}
  //               <View style={styles.orderTotalRow}>
  //                 <Text style={styles.totalLabel}>Total:</Text>
  //                 <Text style={styles.totalValue}>{total}</Text>
  //               </View>
  //             </View>
  //           );
  //         })
  //       )}

  //     </ScrollView>
  //   );
  // }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{forgot ? 'Forgot Password' : mode}</Text>

        {!forgot ? (
          <>
            {mode === 'Sign Up' && (
              <TextInput
                placeholder="Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
            )}
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {mode === 'Sign Up' && (
              <>
                <TextInput
                  placeholder="Phone Number (92XXXXXXXXXX)"
                  style={styles.input}
                  value={phone}
                  onChangeText={onPhoneChange}
                  keyboardType="phone-pad"
                />
                {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}
              </>
            )}
            <TextInput
              placeholder="Password"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnText}>{mode}</Text>
              }
            </TouchableOpacity>

            {/* <View style={styles.footer}>
              <TouchableOpacity onPress={() => setForgot(true)}>
                <Text style={styles.link}>Forgot Password?</Text>
              </TouchableOpacity>
              <Text>
                {mode === 'Login' ? "Don't have an account? " : 'Already have one? '}
                <Text
                  onPress={() => setMode(m => m === 'Login' ? 'Sign Up' : 'Login')}
                  style={styles.link}
                >
                  {mode === 'Login' ? 'Sign Up' : 'Login'}
                </Text>
              </Text>
            </View> */}
          </>
        ) : (
          <View>
            {fpStep === 1 && (
              <>
                <Text style={styles.subtitle}>
                  Enter your email to receive a 6-digit OTP
                </Text>
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={[styles.btn, loading && styles.btnDisabled]}
                  onPress={handleSendOtp}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.btnText}>Send OTP</Text>
                  }
                </TouchableOpacity>
              </>
            )}

            {fpStep === 2 && (
              <>
                <Text style={styles.subtitle}>
                  Enter the OTP we just emailed you
                </Text>
                <TextInput
                  placeholder="OTP"
                  style={styles.input}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                />
                <TouchableOpacity
                  style={[styles.btn, loading && styles.btnDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.btnText}>Verify OTP</Text>
                  }
                </TouchableOpacity>
              </>
            )}

            {fpStep === 3 && (
              <>
                <Text style={styles.subtitle}>Set your new password</Text>
                <TextInput
                  placeholder="New password"
                  style={styles.input}
                  value={newPass}
                  onChangeText={setNewPass}
                  secureTextEntry
                />
                <TextInput
                  placeholder="Confirm password"
                  style={styles.input}
                  value={newPassConfirm}
                  onChangeText={setNewPassConfirm}
                  secureTextEntry
                />
                <TouchableOpacity
                  style={[styles.btn, loading && styles.btnDisabled]}
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.btnText}>Reset Password</Text>
                  }
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={() => { setForgot(false); setFpStep(1); }}
            >
              <Text style={[styles.link, { textAlign: 'center', marginTop: 16 }]}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Toast position="bottom" bottomOffset={20} />
    </KeyboardAvoidingView>
  );
}

export default Settings;

const getStyles = theme => {
  const isLight = !theme.dark;
  const borderColor = isLight ? '#ccc' : '#555';
  const bg = theme.colors.background;
  const card = isLight ? '#fafafa' : '#2a2a2a';
  const text = theme.colors.text;
  const primary = theme.colors.primary;

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: bg },
    content: { padding: 24, justifyContent: 'center', flexGrow: 1 },
    title: { fontSize: 32, marginBottom: 16, textAlign: 'center', fontWeight: '600', color: text },
    subtitle: { fontSize: 16, marginBottom: 8, textAlign: 'center', color: text },

    input: {
      borderWidth: 1,
      borderColor,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      backgroundColor: card,
      color: text,
    },

    btn: {
      backgroundColor: primary,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: bg, fontWeight: '600' },

    footer: { marginTop: 16, alignItems: 'center' },
    link: { color: primary, marginVertical: 8 },

    error: { marginBottom: 8 },

    // logged-in
    loggedInContainer: {
      padding: 24,
      backgroundColor: bg,
    },
    infoRow: { marginBottom: 12 },
    value: { color: text, fontSize: 18 },
    logoutBtn: { marginVertical: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '600', marginTop: 24, color: text },
    noOrders: { textAlign: 'center', color: text + '80', marginVertical: 16 },

    orderCard: {
      width: '100%',
      backgroundColor: card,
      borderRadius: 10,
      padding: 12,
      marginVertical: 8,
      borderWidth: 1,
      borderColor,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
    orderMeta: { fontSize: 12, marginBottom: 4, color: text },
    metaLabel: { fontWeight: '600', color: text },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      paddingVertical: 4,
    },
    itemName: { flex: 2, fontSize: 13, color: text },
    itemQty: { flex: 0.5, textAlign: 'center', color: text },
    itemCost: { flex: 1, textAlign: 'right', color: text },
    orderTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    totalLabel: { fontWeight: '600', color: text },
    totalValue: { fontWeight: '600', color: text },
  });
};
