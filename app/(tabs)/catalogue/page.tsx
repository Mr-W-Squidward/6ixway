import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, useWindowDimensions, Animated, FlatList } from 'react-native';
import * as Location from 'expo-location';
import { useFocusEffect, useRouter } from 'expo-router';


export default function TabTwoScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const bgFadeIn = useRef(new Animated.Value(0)).current; // start transparent
  const buttonTranslateY = useRef(new Animated.Value(0)).current;

  const [popularPlaces, setPopularPlaces] = useState<any[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);

  useFocusEffect(() => {
    bgFadeIn.setValue(0);
    buttonTranslateY.setValue(0);
  });


  useEffect(() => {
    bgFadeIn.setValue(0);
    fetchPopularPlaces();
    fetchNearbyPlaces();
  }, []);

  const fetchPopularPlaces = async () => {
    try {
      const res = await fetch('http://localhost:3000/places?mode=popular');
      const json = await res.json();
      setPopularPlaces((json.places || []).slice(0, 4));
    } catch (e) {
      console.error('Error fetching popular places:', e);
    }
  };

  const fetchNearbyPlaces = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    try {
      const res = await fetch(`http://localhost:3000/places?mode=nearby&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
      const json = await res.json();
      setNearbyPlaces((json.places || []).slice(0, 4));
    } catch (e) {
      console.error('Failed to fetch nearby places:', e);
    }
};

  const handleCataloguePress = () => {
    router.push('/home')
  };

  const renderPlaceIcons = (places: any[]) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
      {places.map((place, index) => {
        if (!place?.url || typeof place.url !== 'string') {
          console.warn(`Image ${index} missing or invalid URL:`, place.url);
          return (
            <View
              key={place.id || index}
              style={{
                width: width * 0.2,
                height: width * 0.2,
                margin: 5,
                borderRadius: 10,
                backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 10 }}>No URL</Text>
            </View>
          );
        }

        return (
          <FlatList
            data={popularPlaces}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.placeItem} key={item.id}>
                <Text style={styles.placeName}>{item.name}</Text>
                <Text style={styles.placeMeta}>
                  {item.photos_metadata[0]?.count || 0} reviews
                </Text>
              </View>
            )}
          />
        );
      })}
    </View>
  );
};


  return (
    <View style={styles.container}>
      {/* HERO SECTION */}
      <View style={styles.hero}>

        <TouchableOpacity onPress={() => console.log("SIDEBAR BTN PRESSED")} style={styles.sidebarButton}> {/* SIDEBAR BUTTON */}
          <Image
            source={require('../../../assets/images/sidebar_icon.png')} 
            style={[styles.icon, { width: width * 0.08, height: width * 0.08 }]}
          />
        </TouchableOpacity>

        <Image
          source={require('../../../assets/images/6ixway_logo.png')} 
          style={[styles.logo, { width: width * 0.3, height: width * 0.3 }]}
        /> {/* LOGO */}

        <TouchableOpacity onPress={() => console.log("SETTINGS BTN PRESSED")} style={styles.settingsButton}> {/* SETTINGS BUTTON */}
          <Image
            source={require('../../../assets/images/settings_icon.png')} 
            style={[styles.icon, { width: width * 0.08, height: width * 0.08 }]}
          />
        </TouchableOpacity>
      </View>

      {/* 6ixCatalogue Icon (press for it to hover towards the home screen page position 
      then fade into that screen (effectively a back button with a cool animation)) */}
      <Animated.View style={[styles.sixCatalogueButton, { transform: [{ translateY: buttonTranslateY }] }]}>
        <TouchableOpacity onPress={handleCataloguePress}>
          <Image
            source={require('../../../assets/images/SixCatalogueButton.png')}
            style={{ width: width * 0.2, height: width * 0.2, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      </Animated.View>


      <View style={styles.catalogueContainer}>
        <View style={styles.section}>
          <Text style={styles.header}>
            Most Popular
          </Text>
          {renderPlaceIcons(popularPlaces)}
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>
            Near You
          </Text>
          {renderPlaceIcons(nearbyPlaces)}
        </View>

        <View style={styles.section}>
          <Text style={styles.header}>
            Tags
          </Text>
          <Text style={{ color: 'white', textAlign: 'center' }}>Coming soon...</Text>
        </View>
      </View>
      <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: bgFadeIn, backgroundColor: 'black' }]} pointerEvents="none" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 30,
  },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  sixCatalogueButton: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  catalogueContainer: {
    paddingHorizontal: 20,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },

  section: {
    marginVertical: 20,
  },

  icon: {
    resizeMode: 'contain'
  },

  logo: {
    resizeMode: 'contain'
  },

  sidebarButton: {
    position: 'absolute',
    left: 20,
  },
    
  settingsButton: {
    position: 'absolute',
    right: 20,
  },

  header: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
    padding: 10,
  },
});