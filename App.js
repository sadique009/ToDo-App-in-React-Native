import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import {
//   useFonts,
//   Inter_900Black,
// } from '@expo-google-fonts/inter';

// let [fontsLoaded] = useFonts({
//   Inter_900Black,
// });

const COLORS = { primary: "#331515", white: "#fff", secondary: "#CAE9F5" };

const App = () => {
  const [textInput, setTextInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    saveTodo(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput === "") {
      Alert.alert("Error occurred!", "please input todo");
    } else if (textInput && !toggle) {
      setTodos(
        todos.map((e) => {
          if (e.id === editItem) {
            return { ...e, task: textInput };
          }
          return e;
        })
      );
      setToggle(true);
      setTextInput("");
      setEditItem(null);
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput("");
    }
  };

  const saveTodo = async (todos) => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", jsonValue);
    } catch (err) {
      console.log(err);
    }
  };

  const getTodos = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodo = (todoId) => {
    const newTodos = todos.filter((item) => item.id != todoId);
    setTodos(newTodos);
  };

  const editTodo = (id) => {
    const newEdit = todos.find((e) => {
      return e.id === id;
    });
    setToggle(false);
    setTextInput(newEdit.task);
    setEditItem(id);
  };

  const clearTodos = () => {
    Alert.alert("Confirm ", "clear all todos?", [
      { text: "yes", onPress: () => setTodos([]) },
      { text: "no" },
    ]);
  };

  const ListItem = ({ todo }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: COLORS.primary,
            }}
          >
            {todo?.task}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.actionIcon, { backgroundColor: "crimson" }]}
          onPress={() => deleteTodo(todo?.id)}
        >
          <Icon name="remove-circle" size={20} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => editTodo(todo?.id)}>
          <View
            style={[styles.actionIcon, { backgroundColor: "maroon" }]}
            onPress={() => editTodo(todo?.id)}
          >
            <Icon name="edit" size={20} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.secondary }}>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 30,
            color: COLORS.primary,
          }}
        >
          TO DO APP
        </Text >
        <Icon style={[styles.actionIcon, { backgroundColor: "white" }]} name="delete" size={30} color="black" onPress={clearTodos} />
      </View>

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Add A Todo"
            value={textInput}
            onChangeText={(text) => setTextInput(text)}
            multiline
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            {toggle ? (
              <View style={styles.iconContainer}>
                <Icon name="add" color={COLORS.white} size={30} />
              </View>
            ) : (
              <View style={styles.iconContainer}>
                <Icon name="edit" color={COLORS.white} size={30} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom:10,
    paddingTop: 40,
    paddingLeft: 30,
    paddingRight: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth:5,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    
  },
  actionIcon: {
    height: 30,
    width: 30,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    borderRadius: 30,
  },
  footer: {
    marginTop:20,
    position: "relative",
    bottom: 0,
    backgroundColor: COLORS.secondary,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 5,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    elevation: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
