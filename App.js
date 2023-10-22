import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import sounds from './sounds';

export default function App() {
  const [sound, setSound] = useState();
  const [markers, setMarkers] = useState([])

  const strings = [
    { string: 'e', yMin: 0, yMax: 55 },
    { string: 'B', yMin: 55, yMax: 90 },

    { string: 'G', yMin: 90, yMax: 130 },
    { string: 'D', yMin: 130, yMax: 170 },
    { string: 'A', yMin: 170, yMax: 210 },
    { string: 'E', yMin: 210, yMax: 250 },
  ]

  function placeMarker(x, y) {
    setMarkers(...markers, { x, y })
    console.log(markers)
  }

  async function playSound(string, fret) {
    try {
      const { sound } = await Audio.Sound.createAsync(sounds['paths'][`${string}-${fret}`])
      setSound(sound);
      await sound.playAsync();

    } catch (error) {
      console.log(`Could not play ${string}-${fret}`)
    }



  }

  function onPressFunction(e) {

    const x = e.nativeEvent.locationX
    const y = e.nativeEvent.locationY

    let string = "-1";
    let markerPos = {}
    for (let stringObj of strings) {
      if (y >= stringObj.yMin && y < stringObj.yMax) {
        string = stringObj.string
        markerPos.y = (stringObj.yMin + stringObj.yMax) / 2
      }
    }
    const fret = Math.round(x / 45) - 1
    markerPos.x = Math.round(x / 45) * 50
    if (fret < 0 || fret > 15 || string === "-1") {
      return
    }

    //console.log(`x: ${x}, y: ${y}`)
    console.log(`string: ${string}, fret: ${fret}`)

    playSound(string, fret)
    placeMarker(markerPos.x, markerPos.y)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Pressable onPress={onPressFunction}>
        <Image
          source={require('./assets/images/board.png')}
          style={{
            height: 250,
            width: 750,
          }}
        />
        {markers.map((marker) => {
          <Image
            source={require('./assets/icon.png')}
            style={{
              position: "absolute",
              x: marker.x,
              y: marker.y,
            }}
          />
        })}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#af0',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: "100%"
  },
});
