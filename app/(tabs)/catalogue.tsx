import { StyleSheet, View, Text } from 'react-native';

export default function TabTwoScreen() {
  return (
    <View>
      <View>
        <Text style={styles.header}>
          Most Popular
        </Text>
      </View>

      <View>
        <Text style={styles.header}>
          Near You
        </Text>
      </View>

      <View>
        <Text style={styles.header}>
          MOST POPULAR
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});
