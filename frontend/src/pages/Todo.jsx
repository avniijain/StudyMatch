import React, { useState, useEffect } from 'react';
import { Plus, Check, X, BookOpen, Edit2, Calendar } from 'lucide-react';
import {getTodos, addTodo, updateTodo, deleteTodo, toggleTodo} from '../services/todoService';

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [dueDateValue, setDueDateValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const token = localStorage.getItem('token');

  useEffect(()=>{
    const fetchTodos = async() =>{
      const data= await getTodos(token);
      setTodos(data);
    };
    fetchTodos();
  },[token]);

  const handleAdd = async()=>{
    if(inputValue.trim()){
      const newTodo = await addTodo({
        title: inputValue.trim(), dueDate: dueDateValue
      },token);
      setTodos([...todos,newTodo]);
      setInputValue("");
      setDueDateValue("");
    }
  };

  const handleToggle = async (id) => {
  try {
    if (!token) {
      console.warn("User not logged in");
      return;
    }

    // Optimistically update UI
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    // Call backend to toggle
    const updatedTodo = await toggleTodo(id, token);

    // Update state with confirmed backend data
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo._id === id ? updatedTodo : todo))
    );
  } catch (err) {
    console.error("Failed to toggle todo:", err.message);
    // Optionally revert optimistic update if needed
  }
};

  const handleDelete = async(id)=>{
    await deleteTodo(id,token);
    setTodos(todos.filter((t)=> t._id !==id));
  }

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.title);
    setEditDueDate(todo.dueDate || '');
  };

  const handleSaveEdit = async()=>{
    if(editText.trim()){
      const updated = await updateTodo(editingId,{
        title:editText.trim(), dueDate:editDueDate},token);
     setTodos(todos.map((t) => (t._id === editingId ? updated : t)));
      setEditingId(null);
      setEditText("");
      setEditDueDate("");
    }
  }

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditDueDate('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const dueDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Tasks</h1>
          <p className="text-gray-600">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>

        {/* Add Todo Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-400" />
                <input
                  type="date"
                  value={dueDateValue}
                  onChange={(e) => setDueDateValue(e.target.value)}
                  className="px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">No tasks yet. Add one above to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className={`flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors ${
                    todo.completed ? 'opacity-75' : ''
                  }`}
                >
                  <button
                    onClick={() => handleToggle(todo._id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {todo.completed && <Check size={14} />}
                  </button>
                  
                  {editingId === todo._id ? (
                    <div className="flex-1 flex flex-col gap-3">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <span
                        className={`block text-gray-900 font-medium transition-all duration-200 ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : ''
                        }`}
                      >
                        {todo.title}
                      </span>
                      {todo.dueDate && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${
                          isOverdue(todo.dueDate) && !todo.completed
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}>
                          <Calendar size={12} />
                          <span>Due {formatDate(todo.dueDate)}</span>
                          {isOverdue(todo.dueDate) && !todo.completed && (
                            <span className="text-red-500 font-medium ml-1">• Overdue</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {editingId === todo._id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(todo)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(todo._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-gray-900">Progress</span>
              <span className="text-sm text-gray-600 font-medium">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}