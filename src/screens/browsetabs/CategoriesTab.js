import React from 'react';
import { Dimensions, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Import useNavigation
import PropTypes from 'prop-types';
import { Block, Card, Badge, Text } from '../../elements/Index';
import { theme, mocks } from '../../constants';

const { width } = Dimensions.get('window');

const CategoriesTab = ({ categories = mocks.categories }) => {
  const navigation = useNavigation(); // ✅ Get navigation directly

  const onCategoryClicked = (categoryName) => {
    navigation.navigate('explore', { category: categoryName });
  };

  const renderCategory = (category) => (
    <TouchableOpacity key={category.id} onPress={() => onCategoryClicked(category.name)}>
      <Card center middle shadow style={styles.category}>
        <Badge margin={[0, 0, 15, 0]} size={theme.sizes.base * 3} color={theme.colors.badgeTint}>
          <Image source={category.image} />
        </Badge>
        <Text medium height={20}>{category.name}</Text>
        <Text gray caption>{`${category.count} Products`}</Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: theme.sizes.base * 2 }}>
      <Block row space="between" style={styles.categories}>
        {categories.map(renderCategory)}
      </Block>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    minWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxWidth: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
    maxHeight: (width - theme.sizes.padding * 2.4 - theme.sizes.base) / 2,
  },
});

export default CategoriesTab;
