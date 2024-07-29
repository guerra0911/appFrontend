import React, { useState } from 'react';
import { View, Image, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';

const PostImagesGrid = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <View>
      {images.length === 1 && (
        <View style={styles.singleImageContainer}>
          <TouchableOpacity onPress={() => openImage(images[0])}>
            <Image source={{ uri: images[0] }} style={styles.singleImage} resizeMode="cover" />
          </TouchableOpacity>
          <View style={styles.bottomPadding}></View>
        </View>
      )}
      {images.length === 2 && (
        <View style={styles.twoImagesContainerWrapper}>
          <View style={styles.twoImagesContainer}>
            <TouchableOpacity onPress={() => openImage(images[0])} style={styles.imageWrapper}>
              <Image source={{ uri: images[0] }} style={styles.twoImages} resizeMode="cover" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openImage(images[1])} style={styles.imageWrapper}>
              <Image source={{ uri: images[1] }} style={styles.twoImages} resizeMode="cover" />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomPadding}></View>
        </View>
      )}
      {images.length === 3 && (
        <View style={styles.threeImagesContainerWrapper}>
          <View style={styles.twoImagesContainer}>
            <TouchableOpacity onPress={() => openImage(images[0])} style={styles.imageWrapper}>
              <Image source={{ uri: images[0] }} style={styles.twoImages} resizeMode="cover" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openImage(images[1])} style={styles.imageWrapper}>
              <Image source={{ uri: images[1] }} style={styles.twoImages} resizeMode="cover" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => openImage(images[2])} style={styles.fullWidthImageWrapper}>
            <Image source={{ uri: images[2] }} style={styles.thirdImage} resizeMode="cover" />
          </TouchableOpacity>
          <View style={styles.bottomPadding}></View>
        </View>
      )}

      <Modal visible={!!selectedImage} transparent={true} onRequestClose={closeImage}>
        <TouchableOpacity style={styles.modalBackground} onPress={closeImage} activeOpacity={1}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeImage} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  singleImageContainer: {
    width: '100%',
    aspectRatio: 1, // This maintains the image ratio, adjust as needed
  },
  singleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  twoImagesContainerWrapper: {
    width: '100%',
  },
  twoImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: '48%', // Ensure the wrapper takes up the correct width
  },
  fullWidthImageWrapper: {
    width: '100%',
    marginTop: 10,
  },
  twoImages: {
    width: '100%',
    aspectRatio: 1, // Ensure the height is proportional to width
    borderRadius: 10,
  },
  threeImagesContainerWrapper: {
    width: '100%',
  },
  thirdImage: {
    width: '100%',
    aspectRatio: 2 / 1, // Half the height of the two images above
    borderRadius: 10,
  },
  bottomPadding: {
    height: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 110,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});

export default PostImagesGrid;
