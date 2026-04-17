// src/components/TableSelector.jsx
import React from 'react';
import { Modal, View, Text, Pressable, FlatList, StyleSheet } from 'react-native';

export default function TableSelector({
  visible,
  onClose,
  onSelect,
  selectedTable,
  tables = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, status: 'available' })),
  theme,
}) {
  const renderItem = ({ item }) => {
    const isSelected = selectedTable === item.id;
    const isDisabled = item.status === 'reserved';

    return (
      <Pressable
        disabled={isDisabled}
        onPress={() => onSelect(item.id)}
        style={[
          styles.cell,
          { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
          isSelected && { borderColor: theme.colors.primary, borderWidth: 2 },
          isDisabled && { opacity: 0.4 },
        ]}
      >
        <Text style={[styles.cellText, { color: theme.colors.text }]}>Table {item.id}</Text>
        <Text style={[styles.badge, { color: isDisabled ? '#b00020' : theme.colors.primary }]}>
          {isDisabled ? 'Reserved' : 'Free'}
        </Text>
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Select a Table</Text>

          <FlatList
            data={tables}
            keyExtractor={(item) => String(item.id)}
            numColumns={3}
            renderItem={renderItem}
            contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
            columnWrapperStyle={{ gap: 10 }}
          />

          <Pressable onPress={onClose} style={[styles.doneBtn]}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '80%' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  cell: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  cellText: { fontSize: 14, fontWeight: '600' },
  badge: { marginTop: 4, fontSize: 12 },
  doneBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  doneText: { color: '#fff', fontWeight: '700' },
});
