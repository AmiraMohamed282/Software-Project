// import {
//   FlatList,
//   Image,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { FontAwesome, Ionicons } from "@expo/vector-icons";
// import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
// import { db } from "../../../firebase/config";
// import { router } from "expo-router";
// import { useAuth } from "../../../firebase/auth";

// export default function admin() {

//   const { logout } = useAuth();
//   return (
//     <ScrollView>
//       <View>
//         {/* Header */}
//         <View style={styles.header}>
//           <View
//             style={{
//               flex: 1,
//               flexDirection: "row",
//               justifyContent: "space-between",
//             }}
//           >
//             <Text style={{ fontSize: 30, fontWeight: 500, color: "white" }}>
//               Admin Page
//             </Text>
//             <Pressable
//              onPress={() => logout()}
//             >
//               <Ionicons name="log-out" size={35} color="white" />
//               <Text style={{ fontSize: 20, fontWeight: 500, color: "white" }}>
//                 Sign Out
//               </Text>
//             </Pressable>
//           </View>
//           <View style={styles.searchBarContainer}>
//             <TextInput
//               placeholder="Search"
//               style={styles.textinput}
//               // onChangeText={setSearchTitle}
//               // value={searchTitle}
//             />
//             <FontAwesome name="search" style={styles.searchBtn} size={27} />
//           </View>
//         </View>

//         <View style={{ flex: 1 }}>
//           <FlatList
//             // data={basicData}
//             numColumns={1}
//             renderItem={({ item }) => (
//               <View>
//                 <Pressable
//                   style={styles.container}
//                   onPress={() =>
//                     router.push({
//                       pathname: `../Update/${item.id}`,
//                       params: {
//                         PersonName: item.contactPerson,
//                         Email: item.email,
//                         Adress: item.adress,
//                         ProfileImage: item.image,
//                       },
//                     })
//                   }
//                 >
//                   <View
//                     style={[styles.card, styles.boxWithShadow, styles.item]}
//                   >
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       <View style={{ flex: 1.6 }}>
//                         <View
//                           style={{ flexDirection: "row", marginBottom: 10 }}
//                         >
//                           <Text style={styles.title}>Name:</Text>
//                           <Text style={{ fontSize: 15 }}>
//                             {" "}
//                             {item.contactPerson}
//                           </Text>
//                         </View>
//                         <View
//                           style={{ flexDirection: "row", marginBottom: 10 }}
//                         >
//                           <Text style={styles.title}>Email:</Text>
//                           <Text style={{ fontSize: 15 }}> {item.email}</Text>
//                         </View>
//                         <View
//                           style={{ flexDirection: "row", marginBottom: 10 }}
//                         >
//                           <Text style={styles.title}>Adress:</Text>
//                           <Text style={{ fontSize: 15 }}> {item.adress}</Text>
//                         </View>
//                         <View
//                           style={{ flexDirection: "row", marginBottom: 10 }}
//                         >
//                           <Text style={styles.title}>Works on:</Text>
//                           <Text style={{ fontSize: 15 }}>
//                             {" "}
//                             {item.category.name}
//                           </Text>
//                         </View>
//                       </View>
//                       <View>
//                         <Image
//                           source={{ uri: item.image }}
//                           style={styles.image}
//                         />
//                       </View>
//                     </View>
//                     <FontAwesome
//                       name="trash-o"
//                       color="#003C43"
//                       // onPress={() => deleteBusiness(item)}
//                       style={styles.todoIcon}
//                     />
//                   </View>
//                 </Pressable>
//               </View>
//             )}
//             ListEmptyComponent={
//               <View style={styles.emptyList}>
//                 <Text style={styles.emptyListText}>NO Services Found</Text>
//               </View>
//             }
//           />
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     padding: 20,
//     paddingTop: 40,
//     backgroundColor: "#003C43",
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//   },
//   textinput: {
//     padding: 7,
//     paddingHorizontal: 16,
//     backgroundColor: "white",
//     borderRadius: 8,
//     width: "85%",
//     fontSize: 16,
//   },
//   searchBarContainer: {
//     marginTop: 15,
//     display: "flex",
//     flexDirection: "row",
//     gap: 10,
//     marginBottom: 10,
//   },
//   searchBtn: {
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 8,
//   },
//   // //////////////////
//   item: {
//     backgroundColor: "#E3FEF7",

//     marginHorizontal: 10,
//     textAlign: "center",
//     borderRadius: 15,
//     borderWidth: 1,
//     borderStyle: "solid",
//     flex: 1,
//     overflow: false,
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: "bold",
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: 8,
//     paddingVertical: 25,
//     paddingHorizontal: 25,
//     width: "90%",
//     marginVertical: 10,
//   },
//   boxWithShadow: {
//     shadowColor: "black",
//     shadowOffset: { width: 9, height: 2 },
//     shadowOpacity: 0.5,
//     shadowRadius: 2,
//     elevation: 5, // Use elevation for Android
//   },
//   todoIcon: {
//     marginTop: 5,
//     fontSize: 26,
//     textAlign: "right",
//   },
//   emptyList: {
//     marginTop: 20,
//     backgroundColor: "#003C43",
//     padding: 20,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: "black",
//   },
//   emptyListText: {
//     fontWeight: "bold",
//     textAlign: "center",
//     fontSize: 30,
//     color: "white",
//   },
//   image: {
//     borderRadius: 20,
//     justifyContent: "flex-end",
//     width: 100,
//     height: 150,
//   },
// });






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

  const { logout } = useAuth();

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
      router.replace('/Login'); 
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

