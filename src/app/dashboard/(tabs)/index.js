import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  useWindowDimensions,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const supabaseUrl = 'https://ktezclohitsiegzhhhgo.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const primaryColor = '#1B1B41';
const secondaryColor = '#1C1C3F';
const accentColor = '#FDAD00';
const textColor = '#333';
const lightTextColor = '#666';
const white = '#FFFFFF';

export default function ItemList() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const isTablet = width >= 768;
  const isLargeScreen = width >= 1024;

  const horizontalListPadding = isWeb ? 30 : 20;
  const itemGap = isWeb ? 30 : 20;

  const getCardWidth = () => {
    const totalHorizontalSpace = width - horizontalListPadding * 2;
    const calculatedGap = itemGap;

    if (isLargeScreen) {
      const totalGapWidth = (4 - 1) * calculatedGap;
      return (totalHorizontalSpace - totalGapWidth) / 4;
    }
    if (isTablet) {
      const totalGapWidth = (3 - 1) * calculatedGap;
      return (totalHorizontalSpace - totalGapWidth) / 3;
    }
    const totalGapWidth = (2 - 1) * calculatedGap;
    return (totalHorizontalSpace - totalGapWidth) / 2;
  };

  const CARD_WIDTH = getCardWidth();
  const numColumns = isLargeScreen ? 4 : isTablet ? 3 : 2;

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [likedItems, setLikedItems] = useState({});
  const [loading, setLoading] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;
  const searchAnimation = useRef(new Animated.Value(0)).current;

  const categories = [
    { name: 'All', icon: 'grid-outline', color: accentColor },
    { name: 'Books', icon: 'book-outline', color: accentColor },
    { name: 'Shoes', icon: 'footsteps-outline', color: accentColor },
    { name: 'Clothes', icon: 'shirt-outline', color: accentColor },
    { name: 'Foods', icon: 'fast-food-outline', color: accentColor },
  ];

  const initialHeaderHeight = Platform.OS === 'ios' ? 120 : isWeb ? 90 : 100;
  const collapsedHeaderHeight = Platform.OS === 'ios' ? 80 : isWeb ? 70 : 70;
  const categoriesHeight = 60;

  const topContentHeight = initialHeaderHeight + categoriesHeight;

  const headerHeightAnimated = scrollY.interpolate({
    inputRange: [0, initialHeaderHeight - collapsedHeaderHeight],
    outputRange: [initialHeaderHeight, collapsedHeaderHeight],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const headerElevation = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 8],
    extrapolate: 'clamp',
  });

  const searchWidth = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [40, isLargeScreen ? width * 0.3 : isTablet ? width * 0.4 : width * 0.6],
  });

  const logoOpacity = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const fetchItems = async (category) => {
    setLoading(true);
    let query = supabase.from('items').select('*');
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching items:', error);
    } else {
      setItems(data);
      setFilteredItems(data);
    }
    setLoading(false);
  };

  const fetchLikedItems = async () => {
    const { data: cartItems, error } = await supabase.from('cart').select('itemname');
    if (error) {
      console.error('Error fetching liked items:', error);
    } else {
      const likedItemsMap = {};
      cartItems.forEach((like) => {
        likedItemsMap[like.itemname] = true;
      });
      setLikedItems(likedItemsMap);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems(selectedCategory);
    await fetchLikedItems();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchItems(selectedCategory);
    fetchLikedItems();
  }, [selectedCategory]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 0);
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = items.filter(item =>
        item.itemname?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchText, items]);

  const toggleSearch = () => {
    if (searchVisible) {
      setSearchText('');
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setSearchVisible(false);
      });
    } else {
      setSearchVisible(true);
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const toggleLike = async (item) => {
    const itemId = item.id || item.itemname;
    const isLiked = likedItems[itemId];

    const heartScale = new Animated.Value(1);
    const animateLike = () => {
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    };

    if (isLiked) {
      const { error } = await supabase.from('cart').delete().eq('itemname', item.itemname);
      if (error) {
        console.error('Error removing from cart:', error.message);
      } else {
        setLikedItems((prev) => ({ ...prev, [itemId]: false }));
        animateLike();
      }
    } else {
      const { data: existingItem, error: checkError } = await supabase
        .from('cart')
        .select('id')
        .eq('itemname', item.itemname)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking cart:', checkError.message);
        return;
      }

      if (!existingItem) {
        const { error } = await supabase.from('cart').insert([
          {
            itemname: item.itemname,
            description: item.description,
            price: item.price,
            category: item.category,
            address: item.address,
            image: item.image || 'https://example.com/placeholder.png',
          },
        ]);

        if (error) {
          console.error('Error adding to cart:', error.message);
        } else {
          setLikedItems((prev) => ({ ...prev, [itemId]: true }));
          animateLike();
        }
      } else {
        console.log('Item already exists in the cart.');
      }
    }
  };

  const renderItem = ({ item, index }) => {
    const isLiked = likedItems[item.id || item.itemname];
    const itemScale = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(itemScale, {
        toValue: 0.97,
        friction: 4,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(itemScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
    };

    const calculateMargins = () => {
      const gap = itemGap;
      const totalItems = filteredItems.length;
      const itemsInRow = numColumns;
      const col = index % itemsInRow;

      const isLastItemInRow = (col === itemsInRow - 1) || (index === totalItems - 1 && (index + 1) % itemsInRow !== 0);
      const isFirstItemInRow = col === 0;

      const marginLeft = isFirstItemInRow ? horizontalListPadding : gap / 2;
      const marginRight = isLastItemInRow ? horizontalListPadding : gap / 2;

      return { marginLeft, marginRight };
    };

    const margins = calculateMargins();

    return (
      <Animated.View
        style={[
          styles.itemContainer,
          {
            width: CARD_WIDTH,
            transform: [{ scale: itemScale }],
            marginBottom: isWeb ? 30 : 20,
            ...margins,
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.itemInnerContainer}
        >
          <View style={styles.itemImageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.itemImage}
              defaultSource={{ uri: 'https://placehold.co/400x200/E0E0E0/333333?text=No+Image' }}
              onError={(e) => {
                console.log('Image loading error', e.nativeEvent.error);
              }}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradientOverlay}
            />
            <View style={styles.priceTag}>
              <Text style={styles.itemPrice}>
                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(item.price || 0)}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.likeButton,
                isLiked ? styles.likedButton : {}
              ]}
              onPress={() => toggleLike(item)}
            >
              <FontAwesome
                name={isLiked ? 'heart' : 'heart-o'}
                size={18}
                color={isLiked ? '#FF5252' : white}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.itemDetails}>
            <View style={styles.itemNameCategoryRow}>
              <Text style={styles.itemName} numberOfLines={1}>{item.itemname || 'Unnamed Product'}</Text>
              {item.category && (
                <View style={[styles.categoryBadge, { backgroundColor: accentColor }]}>
                  <Text style={styles.categoryBadgeText}>{item.category}</Text>
                </View>
              )}
            </View>
            <Text style={styles.itemDescription} numberOfLines={2}>{item.description || 'No description available'}</Text>
            {item.seller && (
              <View style={styles.itemSellerContainer}>
                <Ionicons name="person-circle-outline" size={16} color={accentColor} />
                <Text style={styles.itemSeller} numberOfLines={1}>{item.seller}</Text>
              </View>
            )}
            {item.address && (
              <View style={styles.itemAddressContainer}>
                <Ionicons name="location-outline" size={14} color={accentColor} />
                <Text style={styles.itemAddress} numberOfLines={1}>{item.address}</Text>
              </View>
            )}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('inbox')}
              >
                <MaterialCommunityIcons name="chat-processing-outline" size={20} color={accentColor} />
                <Text style={styles.actionButtonText}>Chat</Text>
              </TouchableOpacity>
              <View style={styles.buttonDivider} />
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('cart')}
              >
                <MaterialCommunityIcons name="cart-outline" size={20} color={accentColor} />
                <Text style={styles.actionButtonText}>Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getCategoryColor = (category) => {
    const categoryObj = categories.find(cat => cat.name === category);
    return accentColor;
  };

  const renderHeader = () => (
    <>
      {!isWeb && <StatusBar barStyle="light-content" backgroundColor={primaryColor} />}
      <Animated.View style={[
        styles.header,
        {
          height: headerHeightAnimated,
          opacity: headerOpacity,
          elevation: headerElevation,
          shadowOpacity: headerElevation.interpolate({
            inputRange: [0, 8],
            outputRange: [0, 0.3],
          })
        }
      ]}>
        <LinearGradient
          colors={[primaryColor, secondaryColor]}
          style={styles.headerGradient}
        >
          <View style={[
            styles.headerContent,
            isWeb && styles.webHeaderContent
          ]}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.iconButton}>
              <MaterialIcons name="menu" size={26} color={accentColor} />
            </TouchableOpacity>

            <View style={[
              styles.logoContainer,
              isWeb && styles.webLogoContainer
            ]}>
              <Animated.View style={{ opacity: logoOpacity }}>
                <Image source={require('../../../assets/OfficialBuyNaBay.png')} style={styles.logoImage} />
              </Animated.View>

              {!searchVisible ? (
                <Animated.Text style={[styles.logoText, { opacity: logoOpacity }]}>
                  BuyNaBay
                </Animated.Text>
              ) : null}

              {searchVisible && (
                <Animated.View style={[styles.searchContainer, { width: searchWidth }]}>
                  <Ionicons name="search" size={20} color={accentColor} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search products..."
                    placeholderTextColor="#B0B0B0"
                    autoFocus
                  />
                  {searchText ? (
                    <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearSearch}>
                      <Ionicons name="close-circle" size={18} color="#B0B0B0" />
                    </TouchableOpacity>
                  ) : null}
                </Animated.View>
              )}
            </View>

            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
                <Ionicons name={searchVisible ? "close" : "search"} size={24} color={accentColor} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('cart')} style={styles.cartButton}>
                <Ionicons name="cart-outline" size={24} color={accentColor} />
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </>
  );

  const renderCategories = () => (
    <View style={styles.categoriesWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // Apply horizontal padding to the content container
        contentContainerStyle={[
          styles.categoryScrollViewContent, // New style for content container
          isWeb && styles.webCategoryContainer // Keep web styles if needed
        ]}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item.name}
            onPress={() => setSelectedCategory(item.name)}
            style={[
              styles.categoryButton,
              selectedCategory === item.name && {
                 ...styles.activeCategory,
                 backgroundColor: 'rgba(253, 173, 0, 0.15)'
               },
              isWeb && styles.webCategoryButton
            ]}
          >
            <View
               style={[
                styles.categoryIconWrapper,
                selectedCategory === item.name && { backgroundColor: accentColor }
              ]}
            >
              <Ionicons
                 name={item.icon}
                 size={22}
                 color={selectedCategory === item.name ? primaryColor : accentColor}
               />
            </View>
            <Text
               style={[
                styles.categoryText,
                selectedCategory === item.name && { color: primaryColor, fontWeight: '600' }
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.topContentContainer, { height: topContentHeight, backgroundColor: primaryColor }]}>
        {renderHeader()}
        {renderCategories()}
      </View>

      {isWeb ? (
        <ScrollView
          contentContainerStyle={[styles.webListContent, { paddingTop: topContentHeight }]}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={accentColor}
              colors={[accentColor]}
             />
          }
        >
          {filteredItems.length > 0 ? (
            <View style={styles.webGridContainer}>
              {filteredItems.map((item, index) => renderItem({ item, index }))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="shopping-search" size={80} color={accentColor} />
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySubText}>
                {searchText ? "Try different keywords" : "Items will appear here"}
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          renderItem={renderItem}
          numColumns={numColumns}
          key={numColumns}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={accentColor}
              colors={[accentColor]}
             />
          }
          contentContainerStyle={[styles.listContent, { paddingTop: topContentHeight }]}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="shopping-search" size={80} color={accentColor} />
              <Text style={styles.emptyText}>No items found</Text>
              <Text style={styles.emptySubText}>
                {searchText ? "Try different keywords" : "Items will appear here"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F9',
  },
  topContentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: primaryColor,
  },
  header: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 50 : Platform.OS === 'web' ? 20 : 30,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(253, 173, 0, 0.2)',
  },
  headerGradient: {
    flex: 1,
    overflow: 'hidden',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  webHeaderContent: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  iconButton: {
    padding: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  webLogoContainer: {
    justifyContent: 'flex-start',
    marginLeft: 20,
  },
  logoImage: {
    width: 28,
    height: 34,
    resizeMode: 'contain',
    marginRight: 8,
  },
  logoText: {
    fontSize: 22,
    color: white,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  searchContainer: {
    height: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 21,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: accentColor,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: white,
    outline: 'none',
    fontFamily: 'Poppins',
  },
  clearSearch: {
    padding: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 2,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: white,
  },
  cartBadgeText: {
    color: white,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  categoriesWrapper: {
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 5,
    width: '100%',
  },
  categoryContainer: {
    // Removed paddingHorizontal from here
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
   categoryScrollViewContent: {
    paddingHorizontal: 12, // Added padding to the content container
    flexDirection: 'row',
    alignItems: 'center',
  },
  webCategoryContainer: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    justifyContent: 'center',
  },
  categoryButton: {
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 8, // Keep marginHorizontal for spacing between buttons
    borderRadius: 12,
    minWidth: 70,
  },
  webCategoryButton: {
    cursor: 'pointer',
    minWidth: 100,
  },
  categoryIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: lightTextColor,
    marginTop: 4,
    fontFamily: 'Poppins',
  },
  activeCategory: {
    backgroundColor: 'rgba(253, 173, 0, 0.15)',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  webListContent: {
    paddingTop: 20,
    paddingBottom: 20,
    minHeight: '100%',
    paddingHorizontal: 0,
  },
  webGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    paddingHorizontal: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: primaryColor,
    marginTop: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  emptySubText: {
    fontSize: 14,
    color: lightTextColor,
    marginTop: 8,
    fontFamily: 'Poppins',
  },
  itemContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: white,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemInnerContainer: {
    flex: 1,
  },
  itemImageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  priceTag: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(27, 27, 65, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  itemPrice: {
    color: white,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  likeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    cursor: Platform.OS === 'web' ? 'pointer' : 'default',
  },
  likedButton: {
  },
  itemDetails: {
    padding: 12,
  },
  itemNameCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: textColor,
    flexShrink: 1,
    marginRight: 8,
    fontFamily: 'Poppins',
  },
  categoryBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: white,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  itemDescription: {
    fontSize: 12,
    color: lightTextColor,
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  itemSellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemSeller: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
    fontFamily: 'Poppins',
  },
  itemAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemAddress: {
    fontSize: 11,
    color: '#777',
    marginLeft: 4,
    fontFamily: 'Poppins',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: textColor,
    marginLeft: 4,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  buttonDivider: {
    width: 1,
    backgroundColor: '#EEE',
    marginHorizontal: 10,
  },
});
