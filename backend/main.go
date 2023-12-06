package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Todo struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

var todos []Todo

func main() {
	http.HandleFunc("/", ToDoListHandler)
	http.ListenAndServe(":8080", nil)
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	if r.Method == http.MethodPost {
		// Parse the form data
		if err := r.ParseForm(); err != nil {
			http.Error(w, "Error parsing form data", http.StatusBadRequest)
			return
		}

		// Get the title and description from the form
		title := r.Form.Get("title")
		description := r.Form.Get("description")

		// Create a new Todo
		newTodo := Todo{
			Title:       title,
			Description: description,
		}

		// Add the newTodo to the todos list
		todos = append(todos, newTodo)

		// Respond with a success message
		fmt.Fprintf(w, "Todo added successfully\n")

		// Print the form data
		fmt.Printf("Title: %s, Description: %s\n", title, description)
		return
	}

	// Respond with the current list of todos for GET requests
	if err := json.NewEncoder(w).Encode(todos); err != nil {
		http.Error(w, "Error encoding todos", http.StatusInternalServerError)
		return
	}
}
