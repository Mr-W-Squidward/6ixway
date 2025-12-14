import { Stack } from 'expo-router';

export default function HomeLayout() {

  return (
    <Stack>
      <Stack.Screen name="page" options={{ headerShown: false }} />
      <Stack.Screen name="add_a_photo/page" options={{ title: 'Add Photo' }} />
      <Stack.Screen name="add_a_photo/review" options={{ title: 'Review' }}/>
    </Stack>
  )
}