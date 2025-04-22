import React, { Component } from 'react';
import { View, StyleSheet, Platform, Text, Image } from 'react-native';

let ViroARSceneNavigator;
let InitialARScene;

if (Platform.OS !== 'web') {
  try {
    ViroARSceneNavigator = require('@viro-community/react-viro').ViroARSceneNavigator;
    InitialARScene = require('./GardenARScene').default;
    console.log('ViroARSceneNavigator:', ViroARSceneNavigator);
  } catch (error) {
    console.error('Failed to load AR components:', error);
  }
}


class GardenARView extends Component {
  render() {
    const { route = {} } = this.props;
    const { image, width, height } = route.params || {};

    if (Platform.OS === 'web') {
      return (
        <View style={styles.webContainer}>
          <Text style={styles.webText}>AR is not supported on Web</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {image && <Image source={{ uri: image }} style={styles.previewImage} />}
        {ViroARSceneNavigator ? (
          <ViroARSceneNavigator
            autofocus={true}
            initialScene={{
              scene: InitialARScene,
              passProps: { image, width, height },
            }}
            style={styles.arView}
          />
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            AR component failed to load
          </Text>
        )}
      </View>
    );
    
  }
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  arView: { flex: 1 },
  webContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  webText: { fontSize: 18, fontWeight: 'bold' },
  previewImage: { width: 100, height: 100, position: 'absolute', top: 10, right: 10 },
});

export default GardenARView;