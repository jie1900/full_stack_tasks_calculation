import React, { useState, useEffect } from "react";
import Header from "./Header";
import ToDoList from "./ToDoList";
import ToDoForm from "./ToDoForm";
import ToDo from "./Todo";
import moment from "moment";
import "./Items.css";


export default function Items() {
  let [toDoList, setToDoList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  useEffect(() => {
    getTasks();
  }, []);
  const getTasks = () => {
    fetch("http://localhost:3010/tasks/")
      .then((response) => response.json())
      .then((data) => setToDoList(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const handleToggle = (id) => {
    let mapped = toDoList.map((task) => {
      return task.id === Number(id)
        ? {
            ...task,
            complete: !task.complete,
          }
        : {
            ...task,
          };
    });
    setToDoList(mapped);
  };

  const handleFilter = () => {
    let filtered = toDoList.filter((task) => {
      return !task.complete;
    });
    setToDoList(filtered);
  };

  const handleEditTask = (id, newName, newTags) => {
    fetch(`http://localhost:3010/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        tags: newTags,
      }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        const updatedTasks = toDoList.map((task) =>
          task.id === id
            ? {
                ...task,
                name: newName,
                tags: newTags,
              }
            : task
        );
        setToDoList(updatedTasks);
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const handleDeleteTask = (id) => {
    fetch(`http://localhost:3010/tasks/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          const updatedTasks = toDoList.filter((task) => task.id !== id);
          setToDoList(updatedTasks);
        } else {
          console.error("Error deleting task:", response.statusText);
        }
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const addTask = (taskData) => {
    if (taskData.tags.length === 0) {
      alert("Please add at least one tag for the task.");
      return;
    }
    fetch("http://localhost:3010/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...taskData,
        complete: false,
        isActive: false,
        startTime: null,
        totalActiveTime: 0,
      }),
    })
      .then((response) => response.json())
      .then((newTask) => {
        setToDoList((prevList) => [
          ...prevList,
          {
            ...newTask,
            complete: false,
          },
        ]);
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const handleTagSelect = (tag) => {
    setSelectedTags((prevTags) => [...prevTags, tag]);
  };

  const handleTagDeselect = (tag) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const clearTagFilter = () => {
    setSelectedTags([]);
  };

  const displayedTasks = toDoList.filter(task => {
    return selectedTags.every(tag => task.tags.includes(tag));
});

  const handleDragStart = (event, index) => {
    setDraggedItemIndex(index);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    if (draggedItemIndex !== null) {
      const tasks = [...toDoList];
      const draggedTask = tasks[draggedItemIndex];
      tasks.splice(draggedItemIndex, 1);
      tasks.splice(index, 0, draggedTask);
      setToDoList(tasks);
    }
    setDraggedItemIndex(null);
  };

  const handleActivate = (id) => {
    fetch(`http://localhost:3010/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: 1,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        getTasks();
      });
  };

  const handleInactivate = (id) => {
    fetch(`http://localhost:3010/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: 0,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        getTasks();
      });
  };
  const getElapsedTime = (taskId) => {
    const task = toDoList.find((t) => t.id === taskId);
    console.log("Task:", task);

    if (task && task.isActive) {
      let totalActiveTime = 0;
      task?.records?.forEach((v) => {
        if (v.endTime) {
          totalActiveTime += moment(v.endTime).diff(moment(v.startTime), "s");
        } else {
          totalActiveTime += moment().diff(
            moment(v.startTime),
            "s"
          );
        }
      });
      console.log("totalActiveTime = ", totalActiveTime);
      return totalActiveTime * 1000;
    }
    return 0;
  };

  const existingTags = Array.from(
    new Set(toDoList.flatMap((task) => task.tags))
  );


  return (
    <div className="container">
      <Header />

      <div className="tag-filter">
        {existingTags.map(tag => (
          <button
            key={tag}
            className={`tag-button ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => {
              if (selectedTags.includes(tag)) {
                handleTagDeselect(tag);
              } else {
                handleTagSelect(tag);
              }
            }}
          >
            {tag}
          </button>
        ))}
        <button className="clear-filter" onClick={clearTagFilter}>Clear Filters</button>
      </div>

      <div className="task-list">
        {displayedTasks.map((todo, index) => (
          <div
            key={todo.id}
            className="task-item"
            draggable="true"
            onDragStart={(event) => handleDragStart(event, index)}
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, index)}
          >
            <ToDo
              todo={todo}
              handleToggle={handleToggle}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              handleActivate={handleActivate}
              handleInactivate={handleInactivate}
              getElapsedTime={getElapsedTime}
            />
          </div>
        ))}
      </div>

      <ToDoForm addTask={addTask} existingTags={existingTags} />
    </div>
  );
}
