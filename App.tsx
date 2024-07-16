import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Switch, Image, Alert } from 'react-native';
import Section from './component/Section';
import TextInputDemo from './component/TextInputDemo';

interface Todo {
  id: number;
  title: string;
  content: string;
  completed: boolean;
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [incompleteCount, setIncompleteCount] = useState<number>(0);

  useEffect(() => {
    const completed = todos.filter(todo => todo.completed).length;
    const incomplete = todos.length - completed;
    setCompletedCount(completed);
    setIncompleteCount(incomplete);
  }, [todos]);

  const addTodo = () => {
    if (editId !== null) {
      setTodos(todos.map(todo => (todo.id === editId ? { ...todo, title, content } : todo)));
      setEditId(null);
    } else {
      const newTodo: Todo = { id: Date.now(), title, content, completed: false };
      setTodos([...todos, newTodo]);
    }
    setTitle('');
    setContent('');
  };

  const deleteTodo = (id: number) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => setTodos(todos.filter(todo => todo.id !== id)) },
    ]);
  };

  const toggleTodoStatus = (id: number) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const editTodo = (todo: Todo) => {
    setTitle(todo.title);
    setContent(todo.content);
    setEditId(todo.id);
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <Section style={styles.todoItem} >
      <View style={styles.todoHeader}>
        <Text style={item.completed ? styles.completedTitle : styles.incompleteTitle}>{item.title}</Text>
        <Switch
          value={item.completed}
          onValueChange={() => toggleTodoStatus(item.id)}
        />
      </View>
      <Text style={styles.todoContent}>Content: {item.content}</Text>
      <View style={styles.todoActions}>
        <TouchableOpacity onPress={() => editTodo(item)} style={styles.actionButton}>
          <Image source={require('../lab2/component/img/edit.png')} style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.actionButton}>
          <Image source={require('../lab2/component/img/bin.png')} style={styles.actionIcon} />
        </TouchableOpacity>
      </View>
    </Section>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <Text style={styles.countText}>Completed: {completedCount} | Incomplete: {incompleteCount}</Text>
      <TextInputDemo
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInputDemo
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <Button title={editId !== null ? 'Edit Todo' : 'Add Todo'} onPress={addTodo} />
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  countText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  list: {
    paddingBottom: 20,
  },
  todoItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
  incompleteTitle: {
    color: 'green',
    fontSize: 20,
    fontWeight: 'bold',
  },
  todoContent: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  todoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    marginHorizontal: 10,
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
});

export default App;
