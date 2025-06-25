'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoSortableItemProps {
  id: string;
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function TodoSortableItem({ id, todo, onToggle, onDelete }: TodoSortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        flex items-center space-x-4 p-4 border rounded-lg bg-white/90 backdrop-blur-sm
        ${isDragging ? 'shadow-lg opacity-50' : 'hover:shadow-md'}
        ${todo.completed ? 'opacity-60' : ''}
        transition-all duration-200
      `}
    >
      <div {...listeners} className="cursor-move text-teal-400">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </div>
      
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
      />
      
      <div className="flex-1">
        <p className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {todo.text}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {todo.createdAt.toLocaleDateString()}
        </p>
      </div>
      
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-400 hover:text-red-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

export default function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const loadTodos = () => {
    if (typeof window !== 'undefined') {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        const parsedTodos: TodoItem[] = JSON.parse(savedTodos).map((todo: { id: string; text: string; completed: boolean; createdAt: string }) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        setTodos(parsedTodos);
      }
    }
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompletedTodos = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-800">
          待办事项 ({pendingCount} 待完成, {completedCount} 已完成)
        </h1>
        {completedCount > 0 && (
          <button
            onClick={clearCompletedTodos}
            className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors duration-200"
          >
            清除已完成
          </button>
        )}
      </div>

      {/* 添加新待办事项 */}
      <div className="mb-6 p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-teal-200">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="添加新的待办事项..."
            className="flex-1 px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            onClick={addTodo}
            disabled={!newTodo.trim()}
            className="px-6 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
          >
            添加
          </button>
        </div>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg">
          <svg className="mx-auto h-12 w-12 text-teal-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-teal-800 mb-2">暂无待办事项</h3>
          <p className="text-teal-600">添加你的第一个待办事项开始管理任务吧！</p>
        </div>
      ) : (
        <>
          <div className="mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-teal-100">
            <p className="text-sm text-teal-700">
              💡 提示：拖拽待办事项可以重新排序，点击复选框标记完成状态
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={todos.map(todo => todo.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {todos.map((todo) => (
                  <TodoSortableItem
                    key={todo.id}
                    id={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}