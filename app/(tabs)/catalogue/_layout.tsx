import { Stack } from 'expo-router';

export default function CatalogueLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}