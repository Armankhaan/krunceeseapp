// src/screens/OrderSuccess.js
import React, { useContext } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native'
import { ThemeContext } from '../../context/ThemeContext'

export default function OrderSuccess() {
  const navigation = useNavigation()
  const { transactId } = useRoute().params
  const { theme } = useContext(ThemeContext)
  const styles = getStyles(theme)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Order Placed!</Text>
      <Text style={styles.subtitle}>Your transaction number is:</Text>
      <Text style={styles.transact}>
        {transactId !== null ? transactId : '—'}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeTabs' }],
            })
          )
        }}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  )
}

const getStyles = theme => {
  const isLight = !theme.dark
  const background = theme.colors.background
  const text = theme.colors.text
  const primary = theme.colors.primary

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
      color: text,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 4,
      color: text,
    },
    transact: {
      fontSize: 20,
      color: primary,
      marginBottom: 24,
    },
    button: {
      padding: 12,
      backgroundColor: primary,
      borderRadius: 6,
    },
    buttonText: {
      color: background,
      fontWeight: 'bold',
    },
  })
}
