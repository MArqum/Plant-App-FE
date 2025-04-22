import React, { Component } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Button, Text } from '../elements/Index';

class GardenDesignCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [],
    };
  }

  addElement = (type) => {
    const newElement = {
      id: this.state.elements.length + 1,
      type,
      position: { x: 100, y: 100 },
      scale: 1,
    };
    this.setState({ elements: [...this.state.elements, newElement] });
  };

  saveDesign = () => {
    const { elements } = this.state;
    if (elements.length === 0) {
      Alert.alert('No Elements', 'Please add some elements to your design before saving.');
      return;
    }
    Alert.alert('Design Saved', 'Your garden design has been saved successfully!');
    this.props.navigation.goBack();
  };

  DraggableElement = ({ element }) => {
    const translateX = useSharedValue(element.position.x);
    const translateY = useSharedValue(element.position.y);
    const scale = useSharedValue(element.scale);

    const panGesture = (event) => {
      translateX.value = withSpring(event.translationX);
      translateY.value = withSpring(event.translationY);
    };

    const pinchGesture = (event) => {
      scale.value = withSpring(event.scale);
    };

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { scale: scale.value },
        ],
      };
    });

    return (
      <PanGestureHandler onGestureEvent={panGesture}>
        <PinchGestureHandler onGestureEvent={pinchGesture}>
          <Animated.View style={[styles.element, animatedStyle]}>
            <Text>{element.type}</Text>
          </Animated.View>
        </PinchGestureHandler>
      </PanGestureHandler>
    );
  };

  render() {
    const { image, width, height } = this.props.route.params;
    const { elements } = this.state;

    return (
      <View style={styles.container}>
        <Image source={{ uri: image }} style={[styles.gardenImage, { width: width * 50, height: height * 50 }]} />
        {elements.map((el) => (
          <this.DraggableElement key={el.id} element={el} />
        ))}
        <Button gradient onPress={() => this.addElement('🌳 Tree')}>
          <Text bold white center>Add Tree</Text>
        </Button>
        <Button gradient onPress={() => this.addElement('🌷 Flower')}>
          <Text bold white center>Add Flower</Text>
        </Button>
        <Button gradient onPress={this.saveDesign}>
          <Text bold white center>Save Design</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gardenImage: { resizeMode: 'cover', marginBottom: 10 },
  element: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
    borderRadius: 5,
  },
});

export default GardenDesignCanvas;
