import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, View, } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type Memory = {
  id: string;
  title: string;
  image: string;
};

type RootStackParamList = {
  Home: { memory?: Memory; mode?: 'add' | 'edit' } | undefined;
  Add: { memory?: Memory } | undefined;
};

type HomeNavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const route = useRoute<HomeRouteProp>();

  const [memories, setMemories] = useState<Memory[]>([
    { id: 'example-1', title: 'Example memory', image: 'https://reactnative.dev/img/tiny_logo.png' },
  ]);

  useEffect(() => {
    const incoming = route.params?.memory;
    const mode = route.params?.mode;
    if (!incoming || !mode) return;

    if (mode === 'add') {
      setMemories(prev => [{ ...incoming, id: incoming.id ?? Date.now().toString() }, ...prev]);
    } else if (mode === 'edit') {
      setMemories(prev => prev.map(m => (m.id === incoming.id ? incoming : m)));
    }

    navigation.setParams({ memory: undefined, mode: undefined });
  }, [route.params?.memory, route.params?.mode, navigation]);

  const onDelete = (id: string) => {
    const item = memories.find(m => m.id === id);
    if (!item) return;

    Alert.alert(
      'Delete memory',
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setMemories(prev => prev.filter(m => m.id !== id)),
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: Memory }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.img} resizeMode="cover" />
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

      <View style={styles.cardActions}>
        <Pressable
          onPress={() => navigation.navigate('Add', { memory: item })}
          style={styles.iconButton}
        >
          <MaterialIcons name="edit" size={22} color="#2b6cb0" />
        </Pressable>

        <Pressable onPress={() => onDelete(item.id)} style={styles.iconButton}>
          <MaterialIcons name="delete" size={22} color="#e53e3e" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Memories</Text>
        <Pressable onPress={() => navigation.navigate('Add')} style={styles.addIcon}>
          <MaterialIcons name="add-photo-alternate" size={28} color="green" />
        </Pressable>
      </View>

      <FlatList
        data={memories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No memories yet — add one 💚</Text>}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f7fafc', 
    padding: 16 
},
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 8 },
  header: { 
    fontSize: 22, 
    fontWeight: '700' 
  },
  addIcon: { 
    padding: 6 
},
  list: { 
    paddingBottom: 40 
},
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  img: { 
    width: '100%', 
    height: 190 },
  title: { 
    padding: 12, 
    fontSize: 16, 
    fontWeight: '600' 
},
  cardActions: { 
    position: 'absolute', 
    right: 10, 
    top: 10, 
    flexDirection: 'row', 
    gap: 8 
},
  iconButton: { 
    padding: 6, 
    marginLeft: 6, 
    backgroundColor: '#fff', 
    borderRadius: 6 
},
  emptyText: { 
    textAlign: 'center', 
    marginTop: 40, 
    color: '#4a5568' 
},
});
