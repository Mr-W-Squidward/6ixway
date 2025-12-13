import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

export default function FriendsScreen() {
  const [friends, setFriends] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);

    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: 'white' }}>Friends feature is being migrated towards backend endpoints.</Text>
      </View>
    );
}