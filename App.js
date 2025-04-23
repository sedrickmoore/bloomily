import { useFonts } from 'expo-font';
import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { setBackgroundColorAsync } from 'expo-system-ui';

export default function App() {
  const [fontsLoaded] = useFonts({
    'PressStart2P': require('./assets/fonts/PressStart2P-Regular.ttf'),
    'Nunio': require('./assets/fonts/Nunito-VariableFont_wght.ttf'),
    'Quicksand': require('./assets/fonts/Quicksand-VariableFont_wght.ttf')
  });

  const sound = useRef();

  useEffect(() => {
    const playMusic = async () => {
      const { sound: playbackObj } = await Audio.Sound.createAsync(
        require('./assets/audio/music/temp_theme.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      sound.current = playbackObj;
      await sound.current.playAsync();
    };

    playMusic();

    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    setBackgroundColorAsync('lightgreen');
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Bloomily!🌺</Text>
      <Text style={styles.body_text}>Coming soon...</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PressStart2P',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  body_text:{
    fontFamily: 'Quicksand',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  }
});
