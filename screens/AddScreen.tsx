import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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

type AddNavProp = NativeStackNavigationProp<RootStackParamList, 'Add'>;
type AddRouteProp = RouteProp<RootStackParamList, 'Add'>;

const AddScreen: React.FC = () => {
  const navigation = useNavigation<AddNavProp>();
  const route = useRoute<AddRouteProp>();

  const editingMemory = route.params?.memory;

  const [title, setTitle] = useState<string>(editingMemory?.title ?? '');
  const [imageUri, setImageUri] = useState<string | null>(editingMemory?.image ?? null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
        (async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission', 'Permission to access photos is required to upload an image.');
        }
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled === false && result.assets?.length) {
        setImageUri(result.assets[0].uri);
      } else if ((result as any).uri) {        setImageUri((result as any).uri);
      }
    } catch (e) {
      console.error('Image pick error', e);
      Alert.alert('Error', 'Could not pick image.');
    }
  };

  const onSave = () => {
    if (!title.trim() || !imageUri) {
      Alert.alert('Missing fields', 'Please provide a title and select an image.');
      return;
    }

    setSaving(true);

    const memory: Memory = {
      id: editingMemory?.id ?? Date.now().toString(),
      title: title.trim(),
      image: imageUri,
    };
    navigation.navigate('Home', { memory, mode: editingMemory ? 'edit' : 'add' });

    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{editingMemory ? 'Edit memory' : 'Add memory'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Memory title"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
        <Text style={styles.uploadText}>{imageUri ? 'Change image' : 'Pick image'}</Text>
      </TouchableOpacity>

      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" /> : null}

      <TouchableOpacity
        style={[styles.saveBtn, saving && { opacity: 0.7 }]}
        onPress={onSave}
        disabled={saving}
      >
        <Text style={styles.saveText}>{editingMemory ? 'Save changes' : 'Add memory'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
},
  header: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 10 
},
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  uploadBtn: {
    borderWidth: 1,
    borderColor: '#a0aec0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  uploadText: { 
    fontWeight: '600' 
},
  preview: { 
    width: '100%', 
    height: 220, 
    marginTop: 12, 
    borderRadius: 8 },
  saveBtn: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { 
    color: '#fff', 
    fontWeight: '700' },
});
