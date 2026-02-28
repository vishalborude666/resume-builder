import React from 'react'
import { Plus, Trash2 } from "lucide-react";


const ProjectForm = ({ data = [], onChange }) => {

    const addProject = () => {
        const newProject = {
            name: "",
            type: "",
            description: "",
        };
        if (onChange) onChange([...data, newProject]);
    };

    const removeProject = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    }

    const updateProject = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div>
            <div>
                <div>

                    <div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 text-lg font-semibold' >
                                <h3>Projects</h3>
                                <p className='text-sm text-gray-500'>Add your project details</p>
                            </div>
                            <button onClick={addProject} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
                                <Plus className='w-4 h-4' />
                                Add Project
                            </button>
                        </div>

                        <div className='space-y-4 mg-6'>
                            {data.map((project, index) => (
                                <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                                    <div className='flex justify-between items-start'>
                                        <h4>Project #{index + 1}</h4>
                                        <button onClick={() => removeProject(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                            <Trash2 className='w-4 h-4' />
                                        </button>
                                    </div>

                                    <div className='grid gap-3'>
                                        <input
                                            value={project.name || ""}
                                            onChange={(e) => updateProject(index, "name", e.target.value)}
                                            type="text"
                                            placeholder='Project Name'
                                            className='px-3 py-2 text-sm rounded-lg'
                                        />

                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                            <input
                                                value={project.type || ""}
                                                onChange={(e) => updateProject(index, "type", e.target.value)}
                                                type="type"
                                                placeholder='Project type'
                                                className='px-3 py-2 text-sm rounded-lg'
                                            />

                                            <textarea
                                                rows={4}
                                                value={project.description || ""}
                                                onChange={(e) => updateProject(index, "description", e.target.value)}
                                                type="text"
                                                placeholder='Project Description'
                                                className='w-full px-3 py-2 text-sm rounded-lg resize-none'
                                            />
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProjectForm;
