import React, { useRef, useEffect, useState, useContext } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { StoreContext } from '../context/StoreContext';

const { width } = Dimensions.get('window');

export default function Header() {
  const { banners } = useContext(StoreContext);
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (banners.length === 0) return;

    const intervalId = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % banners.length;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: next * width, animated: true });
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [banners]);

  return (
    <View style={styles.headerContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
      >
        {banners.map((banner, idx) => (
          <Image
            key={banner.id ?? idx}
            source={{ uri: banner.image_url }}
            style={[styles.headerImage, { width }]}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    height: 150,
    resizeMode: 'cover',
  },
});
