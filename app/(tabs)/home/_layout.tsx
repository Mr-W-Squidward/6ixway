import { Stack } from 'expo-router';

export default function HomeLayout() {

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add_a_photo" options={{ title: 'Add Photo' }} />
      <Stack.Screen name="add_a_photo/review" options={{ title: 'Review' }}/>
    </Stack>
  )
}