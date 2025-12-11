import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';

export default function FriendsScreen() {
  const [friends, setFriends] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const fetchFriends = async () => {
    const { data: myFriends } = await supabase
      .from('friends')
      .select('friend_id, profiles (username, location_lat, location_lon)')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    setFriends(myFriends || []);
  };

  const searchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, username')
      .ilike('username', `%${search}%`);
    
    setResults(data || []);
  };

  const addFriend = async (friendId: string) => {
    await supabase.from('friends').insert({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      friend_id: friendId,
    });
    fetchFriends();
  };

  const removeFriend = async (friendId: string) => {
    await supabase.from('friends').delete().match({
      user_id: (await supabase.auth.getUser()).data.user?.id,
      friend_id: friendId,
    })
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <View style={{ padding: 20}}>
      <Text>Friends</Text>
      <TextInput 
        placeholder='Search by username...'
        onChangeText={setSearch}
        onSubmitEditing={searchUsers}
        style={{ backgroundColor: '#f0f0f0', marginVertical: 10, padding: 10 }}
      />
    </View>
  )
}