import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { StoreContext } from '../../context/StoreContext';
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, MapPin, Building2 } from 'lucide-react-native';

export function LocationSelection() {
  const { theme } = useContext(ThemeContext);
  const { tradeAreas, handleSelectSubRegion, loading, selectedBranch } = useContext(StoreContext);
  const navigation = useNavigation();

  const [selectedArea, setSelectedArea] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [selectedArea]);

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
  };

  const handleSubRegionSelect = async (subRegion) => {
    await handleSelectSubRegion(subRegion);
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeTabs' }],
    });
  };

  const styles = getStyles(theme);

  if (loading && !tradeAreas.length) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectedArea ? `Select Sub-region in ${selectedArea.name}` : 'Select your Region'}
        </Text>
        <Text style={styles.subtitle}>
          {selectedArea 
            ? 'Choose your specific area to find the nearest branch' 
            : 'Find your city to see available stores'}
        </Text>
      </View>

      <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
        {!selectedArea ? (
          <FlatList
            data={tradeAreas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemCard}
                onPress={() => handleAreaSelect(item)}
              >
                <View style={styles.itemIconContainer}>
                  <MapPin size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.itemTextContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSubtext}>{item.sub_regions.length} Sub-regions</Text>
                </View>
                <ChevronRight size={20} color={theme.colors.text} opacity={0.3} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={{ flex: 1 }}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => setSelectedArea(null)}
            >
              <Text style={styles.backButtonText}>← Change Region</Text>
            </TouchableOpacity>
            <FlatList
              data={selectedArea.sub_regions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemCard}
                  onPress={() => handleSubRegionSelect(item)}
                >
                  <View style={[styles.itemIconContainer, { backgroundColor: '#fef2f2' }]}>
                    <Building2 size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSubtext}>Tap to resolve branch</Text>
                  </View>
                  <ChevronRight size={20} color={theme.colors.text} opacity={0.3} />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
            />
          </View>
        )}
      </Animated.View>

      {loading && (
        <View style={styles.overlayLoader}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loaderText}>Resolving Branch...</Text>
        </View>
      )}
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 60,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    opacity: 0.6,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  itemSubtext: {
    fontSize: 13,
    color: theme.colors.text,
    opacity: 0.4,
    fontWeight: '500',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 8,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  overlayLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loaderText: {
    color: '#fff',
    marginTop: 12,
    fontWeight: '700',
    fontSize: 16,
  }
});
