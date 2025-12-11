import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '@/supabase';
import { useLocalSearchParams } from 'expo-router';

const dummyReviews = [
  {id: 1, user: 'Mahian', rating: 2, text: 'this app sick but bun the place!'},
  {id: 2, user: 'Lajina', rating: 4, text: 'ayeee we tipsy here fr'},
  {id: 3, user: 'Pasa', rating: 3, text: 'mmmmmmhmm'},
  {id: 4, user: 'Misa Amane', rating: 5, text: 'WE LITTY FR FR!'},
  {id: 5, user: 'Bakugo', rating: 1, text: 'OI OI OI. THIS PLACE IS BUNS!'},
]

export default function review() {
  const router = useRouter();
  const { uri, placeId } = useLocalSearchParams();
  console.log("Photo URI param received:", uri);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const TAGS = ['Park', "Beach", "Trail", "Scenic"];
  const stars = [1, 2, 3, 4, 5];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  const onSubmit = async () => {
    if (!uri) {
      return Alert.alert('No photo selected.', 'Please take/pick a photo.'); // helkp bro no work!!!
    }

    setSubmitting(true);
    try {
      // insert a metadata row
      const { error } = await supabase.from('photos_metadata').insert([{
        url: uri,
        rating,
        tags: selectedTags,
        status: 'pending',
    }]);

      if (error) throw error;
      Alert.alert('Submitted!', 'Your review has been successfully submitted.');
      router.back();
      router.back();

    } catch (e: any) {
      console.error(e);
      Alert.alert('Submission failed', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button! */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text>{'<--'}</Text>
      </TouchableOpacity>

      {/* Photo Preview */}
      {typeof uri === 'string' && uri ? (
        <Image source={{ uri }} style={styles.photo} />
      ) : (
        <Text style={{ color: 'white', marginBottom: 16 }}>No photo selected.</Text>
      )}

      {/* Rating Section */}
      <Text style={styles.label}>Your Rating</Text>
      <View style={styles.row}>
        {stars.map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <FontAwesome 
              name={rating >= star ? 'star' : 'star-o'} 
              size={32} 
              color="gold" 
              style={{ marginHorizontal: 4}}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Tags Section */}
      <Text style={styles.label}>Tags</Text>
      {TAGS.map((tag) => (
        <TouchableOpacity key={tag} onPress={() => toggleTag(tag)} style={styles.tagRow}>
          <FontAwesome 
            name={selectedTags.includes(tag) ? 'check-square-o' : 'square-o'}
            size={24}
            color="gold"
          />
          <Text style={styles.tagText}>{tag}</Text>
        </TouchableOpacity>
      ))}

      {/* Submit boi */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={onSubmit}
        disabled={submitting}
      >
        <Text>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'black',
  },
  back: {
    color: 'white',
    fontSize: 18,
    marginBottom: 16,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
})