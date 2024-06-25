import React, { useState } from 'react';
import { View, Image, Alert } from 'react-native';
import api from '../api';

import CustomButton from './CustomButton';
import FormField from './FormField';

const EditProfileForm = ({ setModalVisible }) => {
  const [username, setUsername] = useState('');
  const [uploading, setUploading] = useState(false);


  const handleSubmit = async () => {
    setUploading(true);

    const formData = new FormData();

    if (username.trim()) {
      formData.append('username', username);
    }

    try {
      const response = await api.put('/api/user/me/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Profile updated successfully!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      Alert.alert('Error updating profile. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <FormField
        value={username}
        placeholder="Username"
        handleChangeText={setUsername}
        otherStyles="mt-0"
        multiline={false}
      />
      
      <CustomButton
        title="Submit"
        handlePress={handleSubmit}
        containerStyles="mt-4"
        isLoading={uploading}
      />
    </View>
  );
};

export default EditProfileForm;