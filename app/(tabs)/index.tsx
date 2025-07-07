import { Image } from 'expo-image';
import { StyleSheet, View, Text, useWindowDimensions, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* HERO SECTION */}
      <View style={styles.hero}>

        <TouchableOpacity onPress={() => console.log("SIDEBAR BTN PRESSED")} style={styles.sidebarButton}> {/* SIDEBAR BUTTON */}
          <Image
            source={require('../../assets/images/sidebar_icon.png')} 
            style={[styles.icon, { width: width * 0.08, height: width * 0.08 }]}
          />
        </TouchableOpacity>

        <Image
          source={require('../../assets/images/6ixway_logo.png')} 
          style={[styles.logo, { width: width * 0.3, height: width * 0.3 }]}
        /> {/* LOGO */}

        <TouchableOpacity onPress={() => console.log("SETTINGS BTN PRESSED")} style={styles.settingsButton}> {/* SETTINGS BUTTON */}
          <Image
            source={require('../../assets/images/settings_icon.png')} 
            style={[styles.icon, { width: width * 0.08, height: width * 0.08 }]}
          />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Image 
            source={require('../../assets/images/searchIcon.png')}
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

        {/* Add A Photo */}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/add-photo')}>
          <Image
            source={require('../../assets/images/AddPhoto.png')}
            style={[styles.buttonImage, { width: width * 0.2, height: width * 0.2}]}
          />
          <Text style={styles.buttonText}>Add A Photo</Text>
        </TouchableOpacity>

        {/* 6ixMaps */}
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../assets/images/6ixMaps.png')}
            style={[styles.buttonImage, { width: width * 0.2, height: width * 0.2}]}
          />
          <Text style={styles.buttonText}>6ixMaps</Text>
        </TouchableOpacity>

        {/* Friends */}
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../assets/images/Friends.png')}
            style={[styles.buttonImage, { width: width * 0.2, height: width * 0.2}]}
          />
          <Text style={styles.buttonText}>Friends</Text>
        </TouchableOpacity>

        {/* Group Travel */}
        <TouchableOpacity style={styles.button}>
          <Image
            source={require('../../assets/images/GroupTravel.png')}
            style={[styles.buttonImage, { width: width * 0.2, height: width * 0.2}]}
          />
          <Text style={styles.buttonText}>Group Travel</Text>
        </TouchableOpacity>
      </View>

      {/* 6ixCatalogue */}
      <TouchableOpacity style={styles.catalogueButton}>
        <Text style={styles.catalogueButtonText}>▼ 6ixCatalogue</Text>
      </TouchableOpacity>
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
    justifyContent: 'center',
    marginTop: 10,
  },

  button: {
    width: '42%',
    alignItems: 'center',
    margin: 15,
  },

  buttonImage: {
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