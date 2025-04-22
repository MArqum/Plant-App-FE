import React, { Component } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text, Animated, FlatList } from 'react-native';
import { ViroARSceneNavigator, ViroARScene, Viro3DObject } from '@viro-community/react-viro';

const PLANTS = [
  {
    id: '1',
    name: '🌱 Small Plant',
    model: require('../../assets/winter-trees.obj'),
    texture: require('../../assets/winter-trees.mtl'),
  },
  {
    id: '2',
    name: '🌳 Big Tree',
    model: require('../../assets/tree.obj'),
    texture: require('../../assets/tree.mtl'),
  },
];

class ARView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: true,
      objects: [],
      isPickerVisible: false,
      selectedType: null,
    };
    this.slideAnim = new Animated.Value(0);
    this.arNavigatorRef = React.createRef();
  }

  togglePicker = (type) => {
    this.setState({ isPickerVisible: true, selectedType: type });
    Animated.timing(this.slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  closePicker = () => {
    Animated.timing(this.slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => this.setState({ isPickerVisible: false, selectedType: null }));
  };

  selectObject = (item) => {
    const newObject = {
      id: Date.now(),
      model: item.model,
      texture: item.texture,
      position: [0, 0, -1],
      isDraggable: true,
    };
    this.setState((prevState) => ({
      objects: [...prevState.objects, newObject],
    }));
    this.closePicker();
  };

  handleCapture = async () => {
    if (this.arNavigatorRef.current) {
      this.arNavigatorRef.current
        ._arSceneRef
        ._viroInternalModule
        .takeScreenshot('design_capture', true)
        .then((res) => {
          console.log('Screenshot Result:', res);
          Alert.alert('Captured!', 'Screenshot saved.');
          this.props.onClose?.();
        })
        .catch((err) => {
          console.error('Screenshot Error:', err);
        });
    }
  };

  renderPicker() {
    const slideUp = this.slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <Animated.View style={[styles.picker, { transform: [{ translateY: slideUp }] }]}>
        <FlatList
          data={PLANTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.pickerItem} onPress={() => this.selectObject(item)}>
              <Text style={styles.buttonText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.button} onPress={this.closePicker}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  render() {
    const { hasPermission, isPickerVisible } = this.state;

    if (!hasPermission) {
      return (
        <View style={styles.centered}>
          <Text>Waiting for camera permission...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ViroARSceneNavigator
          ref={this.arNavigatorRef}
          style={StyleSheet.absoluteFill}
          initialScene={{ scene: GardenARScene }}
          viroAppProps={{
            image: 'https://your-image-url.com/image.jpg', // can be replaced dynamically
            width: 5,
            height: 3,
            objects: this.state.objects,
          }}
        />

        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={() => this.togglePicker('plant')}>
            <Text style={styles.buttonText}>Add Plant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.togglePicker('tree')}>
            <Text style={styles.buttonText}>Add Tree</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.handleCapture}>
            <Text style={styles.buttonText}>Capture Design</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.props.onClose}>
            <Text style={styles.buttonText}>Close AR</Text>
          </TouchableOpacity>
        </View>

        {isPickerVisible && this.renderPicker()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: { color: 'white' },
  picker: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  pickerItem: {
    padding: 10,
    backgroundColor: 'gray',
    marginVertical: 5,
    borderRadius: 10,
  },
});

export default ARView;
