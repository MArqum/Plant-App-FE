import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Image, Modal, TextInput, Button, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { TabView, SceneMap } from 'react-native-tab-view';
import { GalleryTab, ArticlesTab, CategoriesTab } from './browsetabs/Index';
import { Block, Text } from '../elements/Index';
import { theme, mocks } from '../constants';
import { Menu, Divider, Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import config from '../../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_BASE_URL = config.API_BASE_URL;

export default class BrowseTabScreen extends React.Component {
  state = {
    index: 0,
    menuVisible: false,
    chatVisible: false,
    messages: [],
    newMessage: '',
    image: null,
    role: '', // Store role in state
    routes: [
      { key: 'inspirations', title: 'Inspirations' },
      { key: 'shop', title: 'Articles' },
      { key: 'products', title: 'Products' },
    ],
    userId: null, // Will be fetched from AsyncStorage
    isProfessional: false, // Will be fetched from AsyncStorage
  };


  componentDidMount() {
    this.loadUserData();
  }

  loadUserData = async () => {
    try {
      let userId = await AsyncStorage.getItem('userId');
      userId = JSON.parse(userId);  // ✅ Ensure proper format
      console.log("Parsed User ID:", userId);
  
      const role = await AsyncStorage.getItem('role');
      console.log("User Role:", role);
  
      if (!userId) {
        console.error("Error: userId not found in AsyncStorage");
        alert("User ID not found. Please log in again.");
        return;
      }
  
      this.setState({ userId, role }, () => {
        this.fetchMessages(); // Now fetch messages after userId is set
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };
  
  
  

  // Fetch messages based on user role
  fetchMessages = async () => {
    try {
      if (!this.state.userId) {
        console.error("fetchMessages: userId is null");
        return;
      }
  
      let url = this.state.isProfessional
        ? `${API_BASE_URL}/chat/user-chats`
        : `${API_BASE_URL}/chat/user-chat/${this.state.userId}`;
  
      const response = await axios.get(url);
      this.setState({ messages: Array.isArray(response.data) ? response.data : [] });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  

  handleTabChange = (index) => this.setState({ index });

  // Toggle menu visibility
  openMenu = () => this.setState({ menuVisible: true });
  closeMenu = () => this.setState({ menuVisible: false });

  // Handle navigation when selecting an item from the menu
  onMenuItemClicked = async (screen) => {
    if (screen === 'login') {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                await AsyncStorage.clear(); // Clears all stored data
                this.setState({ role: null }); // Reset role in state
                this.props.navigation.replace('login'); // Redirect to login
              } catch (error) {
                console.error('Error clearing AsyncStorage:', error);
              }
            },
          },
        ]
      );
    } else {
      this.props.navigation.navigate(screen);
    }
  };
  

  // Open chatbox modal
  openChatbox = () => this.setState({ chatVisible: true });

  // Close chatbox modal
  closeChatbox = () => this.setState({ chatVisible: false });

  // Handle message sending
  sendMessage = async () => {
  let { userId, newMessage, image } = this.state;

  if (!userId) {
    console.error("Error: userId is null");
    alert("User ID not found. Please log in again.");
    return;
  }

  // Ensure userId is a valid MongoDB ObjectID
  if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
    console.error("Error: Invalid userId format:", userId);
    alert("Invalid user ID. Please log in again.");
    return;
  }

  const messageData = {
    userId,
    text: newMessage,
    image, // Ensure image URL is properly set
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/chat/send-message`, messageData);
    console.log("Message sent:", response.data);

    // Add the new message to the state
    this.setState(prevState => ({
      messages: [...prevState.messages, messageData],
      newMessage: '',
      image: null,
    }));
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
};

  
  
  


  uploadImage = async () => {
    const { image, userId } = this.state;
    if (!image) return null;
  
    let formData = new FormData();
    formData.append('file', {
      uri: image,
      type: 'image/jpeg',
      name: 'chat-image.jpg',
    });
  
    formData.append('userId', userId); // FIXED: Include userId
  
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };
  

  // Pick an image from gallery
  pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to continue.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      this.setState({ image: result.assets[0].uri });
    }
  };


  renderMessages = ({ item }) => (
    <View style={item.isProfessional ? styles.professionalMsg : styles.userMsg}>
      {item.image && <Image source={{ uri: item.image }} style={styles.imagePreview} />}
      <Text style={[styles.messageText, { color: '#FFFFFF' }]}>{item.text}</Text>
    </View>
  );
   


  // Render the header with the menu and avatar
  renderHeader = () => {
    const { role } = this.state; // Get role from state
    console.log("Render Header Role:", this.state.role);
    return (
      <Block flex={false} center row space="between" style={styles.header}>
        <Text h1 bold>Main Menu</Text>
  
        {/* Dropdown Menu */}
        <Menu
          visible={this.state.menuVisible}
          onDismiss={this.closeMenu}
          anchor={
            <TouchableOpacity onPress={this.openMenu}>
              <Image source={this.props.profile.avatar} style={styles.avatar} />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => this.onMenuItemClicked('settings')} title="Settings" />
          <Menu.Item onPress={() => this.onMenuItemClicked('explore')} title="Explore" />
          <Menu.Item onPress={() => this.onMenuItemClicked('products')} title="Products" />
          <Divider />
          {role === 'user' && (
            <>
              <Menu.Item onPress={() => this.onMenuItemClicked('GardenDesign')} title="Garden Design" />
              <Divider />
            </>
          )}
          <Menu.Item onPress={() => this.onMenuItemClicked('login')} title="Logout" />
        </Menu>
      </Block>
    );
  };
  

  renderTabs = (props) => {
    return (
      <View style={styles.tabs}>
        {props.navigationState.routes.map((route, index) => this.renderTab(route.title, index))}
      </View>
    );
  };

  renderTab = (routeTitle, routeIndex) => {
    const isActive = routeIndex === this.state.index;
    return (
      <TouchableOpacity
        key={`tab-${routeTitle}`}
        onPress={() => this.setState({ index: routeIndex })}
        style={[styles.tab, isActive ? styles.activeTab : null]}
      >
        <Text size={16} medium gray={!isActive} secondary={isActive}>
          {routeTitle}
        </Text>
      </TouchableOpacity>
    );
  };

  renderScene = SceneMap({
    products: CategoriesTab,
    inspirations: GalleryTab,
    shop: ArticlesTab,
  });

  render() {
    return (
      <Provider>
        <Block>
          {this.renderHeader()}
          <TabView
            navigationState={this.state}
            renderScene={this.renderScene}
            renderTabBar={this.renderTabs}
            onIndexChange={this.handleTabChange}
          />

          {/* Chatbox Icon */}
          <TouchableOpacity onPress={() => this.setState({ chatVisible: true })} style={styles.chatboxIcon}>
            <Text>💬</Text>
          </TouchableOpacity>

          {/* Chatbox Modal */}
          <Modal visible={this.state.chatVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.chatbox}>
                <Text>Chat with Professional</Text>

                {/* Display Messages */}
                <FlatList
                  data={this.state.messages}
                  renderItem={this.renderMessages}
                  keyExtractor={(item, index) => index.toString()}
                />

                {/* Input for Message */}
                <TextInput
                  style={styles.input}
                  placeholder="Type your message"
                  value={this.state.newMessage}
                  onChangeText={(text) => this.setState({ newMessage: text })}
                />

                {/* Buttons */}
                <Button title="Send Message" onPress={this.sendMessage} />
                <Button title="Pick Image" onPress={this.pickImage} />
                <Button title="Close Chat" onPress={() => this.setState({ chatVisible: false })} />
              </View>
            </View>
          </Modal>
        </Block>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
    paddingTop: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base,
    alignItems: 'center',
  },
  avatar: {
    height: theme.sizes.base * 2.4,
    width: theme.sizes.base * 2.4,
    borderRadius: theme.sizes.base * 1.2,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: theme.sizes.base,
  },
  activeTab: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
  },
  chatboxIcon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chatbox: {
    width: Dimensions.get('window').width - 40,
    height: 400,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 20,
  },
  userMsg: {
    backgroundColor: '#1ABC9C', // Lighter color for user messages
    color: '#FFFFFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  professionalMsg: {
    backgroundColor: '#2C3E50', // Dark color for professional messages
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: {
    color: '#FFFFFF', // White text for contrast
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: theme.colors.gray2,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

BrowseTabScreen.propTypes = {
  profile: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.object),
  tabs: PropTypes.arrayOf(PropTypes.string),
};

BrowseTabScreen.defaultProps = {
  profile: mocks.profile,
  categories: mocks.categories,
  tabs: ['Products', 'Inspirations', 'Articles'],
};
