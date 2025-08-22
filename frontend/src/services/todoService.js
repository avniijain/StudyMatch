const API_URL = "http://localhost:5000/api/todo";

// fetch all tasks
export const getTodos = async (token) => {
  const res = await fetch(`${API_URL}/display`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// add task
export const addTodo = async (todo, token) => {
  const res = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(todo),
  });
  return res.json();
};

// update task
export const updateTodo = async (id, todo, token) => {
  const res = await fetch(`${API_URL}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(todo),
  });
  return res.json();
};

// delete task
export const deleteTodo = async (id, token) => {
  await fetch(`${API_URL}/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Toggle completion status of a task
export const toggleTodo = async (id, token) => {
  if (!token) {
    throw new Error("No token provided. User must be logged in.");
  }

  const res = await fetch(`${API_URL}/toggle/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || "Failed to toggle todo");
  }

  const data = await res.json();
  return data;
};
