import React, { Component } from 'react';
import { Platform, View, Text } from 'react-native';

if (Platform.OS !== 'web') {
  var { ViroARScene, ViroText, Viro3DObject, ViroAmbientLight, ViroImage } = require('@viro-community/react-viro');
}

class GardenARScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isARInitialized: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isARInitialized: true });
    }, 1000);
  }

  render() {
    const { image, width, height, showTree } = this.props.sceneNavigator.viroAppProps || {};


    if (Platform.OS === 'web') {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            AR is not supported on Web
          </Text>
        </View>
      );
    }

    if (!this.state.isARInitialized) {
      return null;
    }

    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" />

        <ViroText
          text={`Garden Dimensions: ${width}m x ${height}m`}
          position={[0, 0.5, -1]}
          style={{ fontSize: 20, color: 'white' }}
        />

        {image && (
          <ViroImage
            source={{ uri: image }}
            position={[0, 0, -1]}
            scale={[1, 1, 1]}
            width={2}
            height={1.5}
          />
        )}

        {showTree && (
          <Viro3DObject
            source={require('../../assets/tree.obj')}
            resources={[require('../../assets/tree.mtl')]}
            position={[0, -1, -2]}
            scale={[0.1, 0.1, 0.1]}
            type="OBJ"
          />
        )}

      </ViroARScene>
    );
  }

}

export default GardenARScene;
