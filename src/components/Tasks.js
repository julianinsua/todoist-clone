import React, { useState, useEffect } from 'react';
import { Checkbox } from "./Checkbox";
import { useTasks } from "../hooks"
import { collatedTasks } from "../constants";
import { collatedTasksExist, getTitle, getCollatedTitle } from "../helpers";
import { useSelectedProjectValue, useProjectsValue } from "../context";

export const Tasks = () => {
    const { selectedProject } = useSelectedProjectValue();
    const { projects } = useProjectsValue();
    const {tasks} = useTasks(selectedProject);

    let projectName = '';

    if (collatedTasksExist(selectedProject) && selectedProject) {
        projectName = getCollatedTitle(collatedTasks, selectedProject).name;
    };

    if (projects && projects.length > 0 && selectedProject && !collatedTasksExist(selectedProject)) {
        projectName = getTitle(projects, selectedProject).name;
    };

    

    useEffect(()=>{
        document.title = `${projectName}: Todoist`;
    });


    return (
        <div className="tasks" data-test-id = "tasks">
            <h2 data-testid = "project-name">{projectName}</h2>
            <ul className="tasks__list">
                {tasks.map( task => (
                <li key={`${task.id}`}>
                    <Checkbox key = {task.id} />
                <span>{task.task}</span>
                </li>)              
                )}
            </ul>
        </div>
    );
};


