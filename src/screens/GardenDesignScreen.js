import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Block, Input, Button, Text } from '../elements/Index';
import { theme } from '../constants';
import ARView from '../components/ARView';

class GardenDesignScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      width: '',
      height: '',
      isARActive: false,
    };
  }

  selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow access to the gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      this.setState({ image: result.assets[0].uri, isARActive: false });
    }
  };

  openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow access to the camera.');
      return;
    }

    this.setState({ isARActive: true });
  };

  navigateToDesignCanvas = () => {
    const { image, width, height } = this.state;
    if (!image || !width || !height) {
      Alert.alert('Missing Information', 'Please upload an image and enter dimensions.');
      return;
    }
    this.props.navigation.navigate('GardenDesignCanvas', {
      image,
      width,
      height,
    });    
  };

  render() {
    const { image, width, height, isARActive } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Garden Design</Text>
          <Block middle>
            {isARActive ? (
              <ARView onClose={() => this.setState({ isARActive: false })} />
            ) : (
              <>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <Input
                  label="Width (m)"
                  style={styles.input}
                  defaultValue={width}
                  onChangeText={(text) => this.setState({ width: text })}
                  keyboardType="numeric"
                />
                <Input
                  label="Height (m)"
                  style={styles.input}
                  defaultValue={height}
                  onChangeText={(text) => this.setState({ height: text })}
                  keyboardType="numeric"
                />
                <Button gradient onPress={this.selectImage}>
                  <Text bold white center>Select Image</Text>
                </Button>
                <Button gradient onPress={this.openCamera}>
                  <Text bold white center>Open AR Camera</Text>
                </Button>
                <Button gradient onPress={this.navigateToDesignCanvas}>
                  <Text bold white center>Start Designing</Text>
                </Button>
              </>
            )}
          </Block>
        </Block>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  input: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: { width: 300, height: 200, marginBottom: 10 },
});

export default GardenDesignScreen;
