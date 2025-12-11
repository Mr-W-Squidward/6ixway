import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert, Platform, Touchable, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { supabase } from '@/supabase';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';

async function addOrGetPlace(name: string, lat: number, long: number) {
  const { data: existing, error } = await supabase
    .from('places')
    .select('id')
    .eq('name', name)
    .maybeSingle();

  if (error) {
    console.error('Error checking existing place:', error);
    return null;
  }

  if (existing) return existing;

  // if not found, insert new place

  const { data: inserted, error: insertError } = await supabase
    .from('places')
    .insert([{ name, latitude: lat, longitude: long, popularity_score: 1, created_at: new Date().toISOString() }])
    .select()
    .single();
  
  if (insertError) { 
    console.error('Error inserting new place:', insertError);
    return null;
  }

  return inserted;
}

export default function addPhotoScreen() {
  const router = useRouter();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permStatus, setPermStatus] = useState<'undetermined' | 'granted' | 'denied'>('undetermined');
  const [uploading, setUploading] = useState(false);
  const [placeName, setPlaceName] = useState('');

  // ask for permissions to access the camera and photo library
  useEffect(() => {
    (async () => {
      const { status: lib } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (Platform.OS === 'ios') {
        const { status: cam } = await ImagePicker.requestCameraPermissionsAsync();
        setPermStatus(cam === 'granted' && lib === 'granted' ? 'granted' : 'denied');
      } else {
        setPermStatus(lib === 'granted' ? 'granted' : 'denied');
      }
    })();
  }, []);

  if (permStatus === 'undetermined') {
    return <View style={styles.centered}><Text style={styles.text}>Checking permissions...</Text></View>
  }

  if (permStatus === 'denied') {
    return <View style={styles.centered}><Text style={styles.text}>Permission required to continue</Text></View>
  }

  // pick an image from the photo library
  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8})
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    } else {
      Alert.alert('No image selected');
    }
  }

  // open camera UI to take a photo
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    } else {
      Alert.alert('No photo taken');
    }
  }

  // uploading to SUPABASE
  const confirmAndUpload = async () => {
  if (!photoUri) {
    return Alert.alert('No photo selected.', 'Please take/pick a photo.');
  }

  if (!placeName.trim()) {
    Alert.alert('Place name is required', 'Please enter a name for the place.');
    return;
  }

  setUploading(true);
  try {
    const response = await fetch(photoUri);
    const blob = await response.blob();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const place = await addOrGetPlace(placeName.trim(), latitude, longitude);
    if (!place) throw new Error('Failed to find or insert place');
    const placeId = place.id;

    // Upload photo to Supabase storage
    const { error: uploadErr } = await supabase.storage.from('photos').upload(filename, blob, {
      contentType: 'image/jpeg',
      upsert: false,
    });
    if (uploadErr) throw uploadErr;

    const { data } = supabase.storage.from('photos').getPublicUrl(filename);
    const photoUrl = data?.publicUrl;
    if (!photoUrl) throw new Error('Could not get public photo URL.');

    // Insert metadata to photos_metadata
    const { error: insertErr } = await supabase.from('photos_metadata').insert([
      {
        url: photoUrl,
        place_id: Number(placeId),
        rating: 4, // user can edit
        tags: ['Park'], // default for now;
        status: 'pending',
        uploaded_at: new Date()
      },
    ]);
    if (insertErr) throw insertErr;

    // Done! Navigate back or show success
    Alert.alert('Upload complete!');
    router.push(`/review?uri=${encodeURIComponent(photoUrl)}&placeId=${placeId}`);

  } catch (e: any) {
    console.error(e);
    Alert.alert('Upload failed', e.message);
  } finally {
    setUploading(false);
  }
};


  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>{'<--'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ width: 60 }} />

      {/* Preview or Buttons */}
      <Text style={styles.text}>Name this Place</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Scarborough Bluffs"
        placeholderTextColor="#888"
        value={placeName}
        onChangeText={setPlaceName}
      />

      <View style={styles.previewContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.text}>No photo selected</Text>
        )}
      </View> 

      { /* Action Buttons */}
      <View style={styles.buttonRow}>
        {photoUri ? (
          <>
            <TouchableOpacity style={styles.useBtn} onPress={confirmAndUpload} disabled={uploading}>
              <Text style={styles.useText}>{uploading ? 'Uploading...' : ' Use Photo'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.retakeBtn} onPress={() => setPhotoUri(null)} disabled={uploading}>
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.actionBtn} onPress={takePhoto} disabled={uploading}>
              <Text style={styles.actionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={pickFromGallery} disabled={uploading}>
              <Text style={styles.actionText}>Pick From Gallery</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    paddingTop: 50,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 30,
  },

  back: { 
    color: 'white',
    fontSize: 18,
  },

  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
  },

  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },

  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  actionBtn: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 8,
  },

  actionText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  useBtn: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },

  useText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  retakeBtn: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: '#f44336',
  },

  retakeText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
})