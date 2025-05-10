import { Tabs } from 'expo-router';
import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';


export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor:Colors.lightPrim,
      }}
    >
      <Tabs.Screen 
        name='home'
        options={{
          headerShown:false,
          tabBarIcon:({color}) => <Ionicons name="home" size={24} color={color} />
        }}
        />
      <Tabs.Screen 
        name='favorite'
        options={{
          headerShown:false,
          tabBarIcon:({color}) => <Ionicons name="heart-outline" size={24} color={color} />
        }}
        />
      <Tabs.Screen 
        name='AI'
        options={{
          headerShown:false,
          tabBarIcon:({color}) => <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />
        }}
        />
      <Tabs.Screen 
        name='profile'
        options={{
          headerShown:false,
          tabBarIcon:({color}) => <Ionicons name="person-sharp" size={24} color={color} />
        }}
        />
        <Tabs.Screen
            name="login"
            options={{
              tabBarButton: () => null, 
              tabBarStyle: { display: 'none' }, 
            }}
        />
    </Tabs>
  );
}
