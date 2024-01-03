import React, { useState } from 'react';
import ToDo from './Todo';

const ToDoList = ({toDoList, handleToggle, handleEditTask, handleDeleteTask, handleFilter}) => {
    const [draggingItem, setDraggingItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);

    const handleDragStart = (index) => {
        setDraggingItem(index);
    };

    const handleDragOver = (index) => {
        setDragOverItem(index);
    };

    const handleDrop = () => {
        if (draggingItem !== null && dragOverItem !== null && draggingItem !== dragOverItem) {
            const newList = [...toDoList];
            const draggingTask = newList[draggingItem];
            newList.splice(draggingItem, 1);
            newList.splice(dragOverItem, 0, draggingTask);
            toDoList = newList;
        }
        setDraggingItem(null);
        setDragOverItem(null);
    };

    return (
        <div>
            {toDoList.map((todo, index) => (
                <div
                    key={todo.id}
                    draggable="true"
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={() => handleDragOver(index)}
                    onDrop={handleDrop}
                >
                    <ToDo
                        todo={todo}
                        handleToggle={handleToggle}
                        handleEditTask={handleEditTask}
                        handleDeleteTask={handleDeleteTask}
                    />
                </div>
            ))}
            <button style={{margin: '20px'}} onClick={handleFilter}>Clear Completed</button>
        </div>
    );
};

export default ToDoList;
