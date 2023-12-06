import React, { useState, useEffect } from 'react';
import './App.css';
import Todo, { TodoType } from './Todo';

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);

  // Initially fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:8080/');
        if (!response.ok) {
          console.log('Error fetching data');
          return;
        }

        const data = await response.json();

        // Ensure that data is an array before setting state
        if (Array.isArray(data)) {
          setTodos(data);
        }
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    console.log('FormData:', formData.get("title"));
    console.log('FormData:', formData.get("description"));
    try {
      const response = await fetch('http://localhost:8080/', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        console.log('Todo added successfully');

        // Optionally, you can fetch the updated todos here
      } else {
        console.log('Error adding todo');
      }
    } catch (e) {
      console.log('Could not connect to server. Ensure it is running. ' + e);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos.map((todo) => (
          <Todo key={todo.title + todo.description} title={todo.title} description={todo.description} />
        ))}
      </div>

      <h2>Add a Todo</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" name="title" autoFocus={true} />
        <input placeholder="Description" name="description" />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

export default App;
