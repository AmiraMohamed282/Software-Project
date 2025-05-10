import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import dietData from "../assets/diet_plans.json"; 
import { useAuth } from "../firebase/auth";
import { router } from "expo-router";

export default function AdminDietPlans() {
  const [diets, setDiets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDiet, setCurrentDiet] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { logout, loadUserFromStorage } = useAuth();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    meals: {
      breakfast: { name: "", ingredients: "" },
      lunch: { name: "", ingredients: "" },
      dinner: { name: "", ingredients: "" },
    },
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const user = await loadUserFromStorage();
        if (!user || user.email !== "admin@email.com") {
          console.warn("Unauthorized access attempt detected.");
          router.replace("/Login"); // Redirect to login page
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        router.replace("/Login"); // Redirect to login page on error
      }
    };

    checkAdminAccess();
  }, []);

  useEffect(() => {
    const checkAndImportData = async () => {
      const snapshot = await getDocs(collection(db, "dietPlans"));
      if (snapshot.empty) {
        for (const diet of dietData.diets) {
          await addDoc(collection(db, "dietPlans"), diet);
        }
        console.log("📥 Data imported to Firestore.");
      }
    };

    checkAndImportData();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "dietPlans"), (snapshot) => {
      setDiets(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const handleSave = async () => {
    const newDiet = {
      ...form,
      meals: {
        breakfast: {
          name: form.meals.breakfast.name,
          ingredients: form.meals.breakfast.ingredients.split(","),
        },
        lunch: {
          name: form.meals.lunch.name,
          ingredients: form.meals.lunch.ingredients.split(","),
        },
        dinner: {
          name: form.meals.dinner.name,
          ingredients: form.meals.dinner.ingredients.split(","),
        },
      },
    };

    try {
      if (currentDiet) {
        await updateDoc(doc(db, "dietPlans", currentDiet.id), newDiet);
      } else {
        await addDoc(collection(db, "dietPlans"), newDiet);
      }
      resetForm();
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      description: "",
      meals: {
        breakfast: { name: "", ingredients: "" },
        lunch: { name: "", ingredients: "" },
        dinner: { name: "", ingredients: "" },
      },
    });
    setCurrentDiet(null);
    setModalVisible(false);
  };

  const handleEdit = (diet) => {
    setCurrentDiet(diet);
    setForm({
      ...diet,
      meals: {
        breakfast: {
          name: diet.meals.breakfast.name,
          ingredients: diet.meals.breakfast.ingredients.join(","),
        },
        lunch: {
          name: diet.meals.lunch.name,
          ingredients: diet.meals.lunch.ingredients.join(","),
        },
        dinner: {
          name: diet.meals.dinner.name,
          ingredients: diet.meals.dinner.ingredients.join(","),
        },
      },
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "dietPlans", id));
  };

  const filteredDiets = diets.filter((diet) =>
    diet.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Diet Plans</Text>

        <Pressable
          onPress={() => handleLogout()}
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
        >
          <Ionicons name="log-out" size={28} color="#30633e" />
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#30633e" }}>
            Sign Out
          </Text>
        </Pressable>
      </View>

      <TextInput
        placeholder="Search by name..."
        value={searchText}
        onChangeText={setSearchText}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
          borderColor: "#ccc",
          marginBottom: 10,
        }}
      />
      <Pressable onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text style={{ color: "white", fontSize: 18 }}>+ Add New</Text>
      </Pressable>

      <FlatList
        data={filteredDiets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>Category: {item.category}</Text>
            <Text>Breakfast: {item.meals.breakfast.name}</Text>
            <Text>Lunch: {item.meals.lunch.name}</Text>
            <Text>Dinner: {item.meals.dinner.name}</Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Pressable onPress={() => handleEdit(item)}>
                <Text style={{ color: "blue" }}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => handleDelete(item.id)}>
                <FontAwesome name="trash" size={24} color="red" />
              </Pressable>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={{ padding: 20 }}>
          <Text style={styles.title}>
            {currentDiet ? "Edit" : "Add"} Diet Plan
          </Text>

          <TextInput
            placeholder="Name"
            value={form.name}
            onChangeText={(val) => setForm({ ...form, name: val })}
            style={styles.input}
          />
          <TextInput
            placeholder="Category"
            value={form.category}
            onChangeText={(val) => setForm({ ...form, category: val })}
            style={styles.input}
          />
          <TextInput
            placeholder="Description"
            multiline
            value={form.description}
            onChangeText={(val) => setForm({ ...form, description: val })}
            style={styles.input}
          />

          {["breakfast", "lunch", "dinner"].map((meal) => (
            <View key={meal}>
              <Text style={styles.subtitle}>{meal.toUpperCase()}</Text>
              <TextInput
                placeholder="Meal Name"
                value={form.meals[meal].name}
                onChangeText={(val) =>
                  setForm({
                    ...form,
                    meals: {
                      ...form.meals,
                      [meal]: { ...form.meals[meal], name: val },
                    },
                  })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Ingredients (comma separated)"
                value={form.meals[meal].ingredients}
                onChangeText={(val) =>
                  setForm({
                    ...form,
                    meals: {
                      ...form.meals,
                      [meal]: { ...form.meals[meal], ingredients: val },
                    },
                  })
                }
                style={styles.input}
              />
            </View>
          ))}

          <Pressable onPress={handleSave} style={styles.saveButton}>
            <Text style={{ color: "white", textAlign: "center" }}>Save</Text>
          </Pressable>

          <Pressable onPress={resetForm} style={{ marginTop: 10 }}>
            <Text style={{ color: "red", textAlign: "center" }}>Cancel</Text>
          </Pressable>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: "#f2f2f2",
    marginVertical: 8,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontWeight: "600",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#30633e",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
});

