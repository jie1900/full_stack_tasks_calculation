import React, { useState, useEffect } from 'react';

const ToDo = ({todo, handleToggle, handleEditTask, handleDeleteTask, handleActivate, handleInactivate, getElapsedTime}) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(todo.name);
    const [newTag, setNewTag] = useState('');
    const [elapsedTime, setElapsedTime] = useState(getElapsedTime(todo.id));

    useEffect(() => {
        if (todo.isActive) {
            const interval = setInterval(() => {
                setElapsedTime(getElapsedTime(todo.id));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [todo.isActive, getElapsedTime, todo.id]);

    const handleClick = (e) => {
        e.preventDefault();
        handleToggle(e.currentTarget.id);
    }

    const handleNameClick = () => {
        setIsEditing(true);
    }

    const handleNameChange = (e) => {
        setEditedName(e.target.value);
    }

    const handleNameSubmit = (e) => {
        e.preventDefault();
        handleEditTask(todo.id, editedName, todo.tags);
        setIsEditing(false);
    }

    const handleAddTag = () => {
        if (newTag && !todo.tags.includes(newTag)) {
            handleEditTask(todo.id, todo.name, [...todo.tags, newTag]);
            setNewTag('');
        }
    }

    const handleRemoveTag = (tag) => {
        if (todo.tags.length <= 1) {
            alert("Each task must have at least one tag!");
            return;
        }
        const updatedTags = todo.tags.filter(t => t !== tag);
        handleEditTask(todo.id, todo.name, updatedTags);
    }

    return (
        <div className={todo.complete ? "todo strike" : "todo"}>
            {isEditing ? (
                <form onSubmit={handleNameSubmit}>
                    <input value={editedName} onChange={handleNameChange} />
                    <button type="submit">Save</button>
                </form>
            ) : (
                <div onClick={handleNameClick}>
                    {todo.id}. {todo.name}
                </div>
            )}
            <button onClick={() => todo.isActive ? handleInactivate(todo.id) : handleActivate(todo.id)}>
                {todo.isActive ? 'Inactivate' : 'Activate'}
            </button>
            {todo.isActive && <div>Elapsed Time: {Math.floor(elapsedTime / 1000)} seconds</div>}
            <div>{todo.description}</div>
            {todo.tags.map(tag => (
                <span key={tag}>
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>x</button>
                </span>
            ))}
            <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag..." />
            <button onClick={handleAddTag}>Add Tag</button>
            <button onClick={() => handleDeleteTask(todo.id)}>Delete Task</button>
        </div>
    );
};

export default ToDo;
