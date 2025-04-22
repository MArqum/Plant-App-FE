import React, { Component } from 'react';
import { Pressable, View, Text, Image } from 'react-native';
import TimeAgo from './time';

class DataItem extends Component {
    constructor(props) {
        super(props);
        this.data = props.data;
    }

    handlePress = () => {
        const { url, title } = this.data;
        this.props.onPress({ url, title });
    };

    render() {
        return (
            <Pressable onPress={this.handlePress} style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                <Image
                    source={{ uri: this.data.urlToImage || 'https://via.placeholder.com/150' }}
                    style={{ width: 50, height: 50, marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={2} style={{ fontWeight: 'bold' }}>{this.data.title}</Text>
                    <Text numberOfLines={2} style={{ color: 'gray' }}>{this.data.description}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <Text style={{ color: 'gray', marginRight: 5 }}>{this.data.source.name}</Text>
                        <TimeAgo time={this.data.publishedAt} />
                    </View>
                </View>
            </Pressable>
        );
    }
}

export default DataItem;
