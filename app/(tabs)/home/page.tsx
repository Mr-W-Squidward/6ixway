import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import { useRef } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const bgFade = useRef(new Animated.Value(1)).current;
  const buttonTranslateY = useRef(new Animated.Value(0)).current;

  useFocusEffect(() => {
    bgFade.setValue(1);
    buttonTranslateY.setValue(0);
});

  return (
    <Animated.View style={{flex: 1, backgroundColor: 'black', paddingTop: 30, opacity: bgFade}}>
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

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Image 
            source={require('../../../assets/images/searchIcon.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='Looking for a place nearby?'
            placeholderTextColor='gray'
          />
        </View>
      </View>

      {/* GRID OF BUTTONS */}
      <View style={styles.grid}> 
        <TouchableOpacity style={styles.button} onPress={() => router.push('/home/add_a_photo/page')}>
          <View style={[styles.circle, { width: width * 0.22, height: width * 0.22, borderRadius: (width * 0.22) / 2 }]}> 
            <Image
              source={require('../../../assets/images/AddPhoto.png')}
              style={styles.iconInside}
            />
          </View>
          <Text style={styles.buttonText}>Add A Photo</Text>
        </TouchableOpacity>

        {/* 6ixMaps */}
        <TouchableOpacity style={styles.button}>
          <View style={[styles.circle, { width: width * 0.22, height: width * 0.22, borderRadius: (width * 0.22) / 2 }]}> 
            <Image
              source={require('../../../assets/images/6ixMaps.png')}
              style={styles.iconInside}
            />
          </View>
          <Text style={styles.buttonText}>6ixMaps</Text>
        </TouchableOpacity>

        {/* Friends */}
        <TouchableOpacity style={styles.button}>
          <View style={[styles.circle, { width: width * 0.22, height: width * 0.22, borderRadius: (width * 0.22) / 2 }]}> 
            <Image
              source={require('../../../assets/images/Friends.png')}
              style={styles.iconInside}
            />
          </View>
          <Text style={styles.buttonText}>Friends</Text>
        </TouchableOpacity>

        {/* Group Travel */}
        <TouchableOpacity style={styles.button}>
          <View style={[styles.circle, { width: width * 0.22, height: width * 0.22, borderRadius: (width * 0.22) / 2 }]}> 
            <Image
              source={require('../../../assets/images/GroupTravel.png')}
              style={styles.iconInside}
            />
          </View>
          <Text style={styles.buttonText}>Group Travel</Text>
        </TouchableOpacity>
      </View>

        {/* 6ixCatalogue */}
      <Animated.View style={[styles.sixCatalogueButton, { transform: [{ translateY: buttonTranslateY }] }]}>
        <TouchableOpacity onPress={() => router.push('/catalogue/page')}>
          <Image
            source={require('../../../assets/images/SixCatalogueButton.png')}
            style={[styles.icon, {width: width * 0.2, height: width * 0.2 }]}
          />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
          
const styles = StyleSheet.create({
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

  sidebarButton: {
    position: 'absolute',
    left: 20,
  },
    
  settingsButton: {
    position: 'absolute',
    right: 20,
  },

  icon: {
    resizeMode: 'contain'
  },

  logo: {
    resizeMode: 'contain'
  },

  searchContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    width: '90%',
    paddingHorizontal: 10,
  },

  searchIcon: {
    width: 17,
    height: 17,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: 'black',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    marginTop: 22,
  },

  button: {
    width: '45%',
    alignItems: 'center',
    marginVertical: 12,
  },

  buttonImage: {
    resizeMode: 'contain',
  },

  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },

  iconInside: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },

  buttonText: {
    color: 'white',
    marginTop: 5,
    fontSize: 13,
  },

  catalogueButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 25,
    alignSelf: 'center',
    marginTop: 50,
  },

  catalogueButtonText: {
    color: 'white',
    fontSize: 16,
  },
});