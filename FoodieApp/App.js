import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const foodLabels = {
    0: 'Apple Pie',
    1: 'Baby Back Ribs',
    2: 'Baklava',
    3: 'Beef Carpaccio',
    4: 'Beef Tartare',
    5: 'Beet Salad',
    6: 'Beignets',
    7: 'Bibimbap',
    8: 'Bread Pudding',
    9: 'Breakfast Burrito',
    10: 'Bruschetta',
    11: 'Caesar Salad',
    12: 'Cannoli',
    13: 'Caprese Salad',
    14: 'Carrot Cake',
    15: 'Ceviche',
    16: 'Cheesecake',
    17: 'Cheese Plate',
    18: 'Chicken Curry',
    19: 'Chicken Quesadilla',
    20: 'Chicken Wings',
    21: 'Chocolate Cake',
    22: 'Chocolate Mousse',
    23: 'Churros',
    24: 'Clam Chowder',
    25: 'Club Sandwich',
    26: 'Crab Cakes',
    27: 'Creme Brulee',
    28: 'Croque Madame',
    29: 'Cup Cakes',
    30: 'Deviled Eggs',
    31: 'Donuts',
    32: 'Dumplings',
    33: 'Edamame',
    34: 'Eggs Benedict',
    35: 'Escargots',
    36: 'Falafel',
    37: 'Filet Mignon',
    38: 'Fish and Chips',
    39: 'Foie Gras',
    40: 'French Fries',
    41: 'French Onion Soup',
    42: 'French Toast',
    43: 'Fried Calamari',
    44: 'Fried Rice',
    45: 'Frozen Yogurt',
    46: 'Garlic Bread',
    47: 'Gnocchi',
    48: 'Greek Salad',
    49: 'Grilled Cheese Sandwich',
    50: 'Grilled Salmon',
    51: 'Guacamole',
    52: 'Gyoza',
    53: 'Hamburger',
    54: 'Hot and Sour Soup',
    55: 'Hot Dog',
    56: 'Huevos Rancheros',
    57: 'Hummus',
    58: 'Ice Cream',
    59: 'Lasagna',
    60: 'Lobster Bisque',
    61: 'Lobster Roll Sandwich',
    62: 'Macaroni and Cheese',
    63: 'Macarons',
    64: 'Miso Soup',
    65: 'Mussels',
    66: 'Nachos',
    67: 'Omelette',
    68: 'Onion Rings',
    69: 'Oysters',
    70: 'Pad Thai',
    71: 'Paella',
    72: 'Pancakes',
    73: 'Panna Cotta',
    74: 'Peking Duck',
    75: 'Pho',
    76: 'Pizza',
    77: 'Pork Chop',
    78: 'Poutine',
    79: 'Prime Rib',
    80: 'Pulled Pork Sandwich',
    81: 'Ramen',
    82: 'Ravioli',
    83: 'Red Velvet Cake',
    84: 'Risotto',
    85: 'Samosa',
    86: 'Sashimi',
    87: 'Scallops',
    88: 'Seaweed Salad',
    89: 'Shrimp and Grits',
    90: 'Spaghetti Bolognese',
    91: 'Spaghetti Carbonara',
    92: 'Spring Rolls',
    93: 'Steak',
    94: 'Strawberry Shortcake',
    95: 'Sushi',
    96: 'Tacos',
    97: 'Takoyaki',
    98: 'Tiramisu',
    99: 'Tuna Tartare',
    100: 'Waffles'
}

const pickImage = async () => {
  console.log('Uploading image...');
  setLoading(true);

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled) {
    console.log('Image URI:', result.uri);
    setImage(result.uri);
    predictImage(result.uri);
  } else {
    setLoading(false);
  }
};

const predictImage = async (selectedImageURI) => {
  console.log('Predicting image...', selectedImageURI);
  const formData = new FormData();
  formData.append('image', { uri: selectedImageURI, name: 'image.jpg', type: 'image/jpeg' });

  try {
    const response = await fetch('http://192.168.1.101:8000/predict', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await response.json();
    console.log('Server Response:', result);

    const predictionLabel = result;
    const foodPrediction = foodLabels[predictionLabel];

    console.log(predictionLabel, foodPrediction);
    setPrediction(foodPrediction);
  } catch (error) {
    console.error('Error predicting image:', error);
  } finally {
    setLoading(false);
  }
};

return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Foodie Finder</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
            {prediction && <Text style={styles.prediction}>{prediction}</Text>}
          </View>
        )
      )}
      <StatusBar style="auto" />
    </ScrollView>
  </GestureHandlerRootView>
);
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
  uploadButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  prediction: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
  },
});
