import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert, Platform, Touchable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { supabase } from '@/supabase';
import * as FileSystem from 'expo-file-system';

export default function addPhotoScreen() {
  const router = useRouter();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permStatus, setPermStatus] = useState<'undetermined' | 'granted' | 'denied'>('undetermined');
  const [uploading, setUploading] = useState(false);

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

  setUploading(true);
  try {
    // Fetch local file as blob
    const response = await fetch(photoUri);
    const blob = await response.blob();
    if (!blob) throw new Error("Failed to convert image to blob.");

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

    // Upload to Supabase
    const { error: uploadErr } = await supabase
      .storage
      .from('photos')
      .upload(filename, blob, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadErr) throw uploadErr;

    // Get public URL
    const { data } = supabase.storage.from('photos').getPublicUrl(filename);
    if (!data?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded photo.');
    }

    console.log('Public URL:', data.publicUrl);

    router.push(`/review?uri=${encodeURIComponent(data.publicUrl)}`);

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