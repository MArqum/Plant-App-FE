import React, { Component } from "react";
import { Alert, View, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView, ScrollView } from "react-native";
import config from "../../../../config";
import DataItem from "./DataItem";
import Modal from "./modal";

console.log("DataItem:", DataItem);

const newsConfig = {
  baseUrl: "https://newsapi.org/v2/everything",
  apiKey: config.NEWS_API_KEY,
  query: "gardening",
};

export default class NewsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      data: [],
      page: 1, // Keep track of the page number
      setModalVisible: false,
      modalArticleData: {},
      refreshing: false, // Track refresh state
    };
  }

  // Fetch articles with pagination
  getArticles = async (page = 1) => {
    try {
      let response = await fetch(
        `${newsConfig.baseUrl}?apiKey=${newsConfig.apiKey}&q=${newsConfig.query}&page=${page}`
      );
      let result = await response.json();
      console.log("API Response:", result);

      return result.articles || [];
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong!");
      return [];
    }
  };

  // Load initial articles
  componentDidMount() {
    this.loadMoreArticles();
  }

  // Load more articles when user scrolls down
  loadMoreArticles = async () => {
    const { page, data } = this.state;
    this.setState({ isLoading: true });

    const newArticles = await this.getArticles(page);

    this.setState({
      data: [...data, ...newArticles], // Append new articles
      page: page + 1, // Increase page count
      isLoading: false,
    });
  };

  // Handle pull-to-refresh
  handleRefresh = async () => {
    this.setState({ refreshing: true, page: 1 });

    const newArticles = await this.getArticles(1);

    this.setState({
      data: newArticles, // Replace with new data
      refreshing: false,
    });
  };

  handleItemDataOnPress = (articleData) => {
    if (articleData.url) {
      this.setState({
        setModalVisible: true,
        modalArticleData: articleData,
      });
    } else {
      Alert.alert("No URL", "This article does not have a valid link.");
    }
  };


  handleModalClose = () => {
    this.setState({
      setModalVisible: false,
      modalArticleData: {},
    });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

          <FlatList
            data={this.state.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <DataItem onPress={() => this.handleItemDataOnPress(item)} data={item} />
            )}
            onEndReached={this.loadMoreArticles} // Load more on scroll
            onEndReachedThreshold={0.5} // Load more when 50% from bottom
            refreshing={this.state.refreshing} // Pull to refresh state
            onRefresh={this.handleRefresh} // Pull to refresh function
            ListFooterComponent={
              this.state.isLoading && (
                <View style={{ padding: 10, alignItems: "center" }}>
                  <ActivityIndicator size="large" color="#00f0ff" />
                </View>
              )
            }
          />
        </ScrollView>
        <Modal
          showModal={this.state.setModalVisible}
          articleData={this.state.modalArticleData}
          onClose={this.handleModalClose}
        />

      </SafeAreaView>
    );
  }
}