import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
const ProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const[fullName , setFullName]= useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setName(userData.username );
          setEmail(userData.email);
          setProfileImage(userData.image);
          setFullName(userData.fullName)
          console.log('User data:', userData.email);
        } else {
          console.log('⚠️ No user data found!');
        }
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        username: name,
        email: email,
        image: profileImage,
        fullName: fullName,
      });
      console.log('✅ Saved data:', { name, email, profileImage , fullName });
    }
    setIsEditing(false);
  };

  const pickImage = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => openCamera(),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => openGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const uploadImage = async (result) => {
    if (!result.canceled && result.assets) {
      const image = result.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', 'mennah');

      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/defvjnd0q/image/upload',
          {
            method: 'POST',
            body: formData,
          }
        );
        const data = await response.json();
        if (data.secure_url) {
          const imageUrl = data.secure_url;
          setProfileImage(imageUrl);

          if (auth.currentUser) {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
              image: imageUrl,
            });
            console.log('✅ Image URL updated in Firestore');
            Alert.alert('Success', 'Profile image updated successfully!');
          }
        } else {
          console.log('❌ Upload failed:', data);
          Alert.alert('Error', 'Image upload failed.');
        }
      } catch (error) {
        console.log('❌ Upload error:', error);
        Alert.alert('Error', 'Something went wrong during image upload.');
      }
    }
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    uploadImage(result);
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    uploadImage(result);
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/profile')}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
      <Text style={styles.header}>Profile Info</Text>
      <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text>No Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={[styles.input, !isEditing && styles.disabled]}
        editable={isEditing}
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>FullName:</Text>
      <TextInput
        style={[styles.input, !isEditing && styles.disabled]}
        editable={isEditing}
        value={fullName}
        onChangeText={setFullName}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={isEditing ? handleSave : handleEditToggle}
      >
        <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit Profile'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
   
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  disabled: {
    backgroundColor: '#f2f2f2',
    color: '#999',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileInfo;