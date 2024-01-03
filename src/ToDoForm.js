import React, { useState } from 'react';

const ToDoForm = ({ addTask, existingTags }) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const allTags = [...tags.split(',').map(tag => tag.trim()), selectedTag].filter(Boolean);
        addTask({
            name: taskName,
            description: description,
            tags: allTags
        });
        setTaskName("");
        setDescription("");
        setTags("");
        setSelectedTag("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name..."
            />
            <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description..."
            />
            <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter new tags (comma-separated)..."
            />
            <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                <option value="">Select an existing tag</option>
                {existingTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>
            <button>Create A Task</button>
        </form>
    );
};

export default ToDoForm;
