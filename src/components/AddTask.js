import React, { useState } from "react";
import { FaRegListAlt, FaRegCalendarAlt } from "react-icons/fa";
import moment from "moment";
import {firebase} from "../firebase";
import {useSelectedProjectValue} from "../context";
import { ProjectOverlay } from "./ProjectOverlay";
import { TaskDate } from "./TaskDate";

/**There are two ways to add a task one is in the main task area
 * the secondone is in the quick add button on the nav bar. Thats why we need
 * a showAddTaskMain, this will have all the customs of the main.
 * and the showShouldmain, is the trigger to show it. The same goes for the Quick
 * showQuikAddTask shows the overlay and setShowQuickAddTask stores the quick add.
 */

export const AddTask = ({
    showAddTaskMain = true, 
    showShouldMain = false,
    showQuickAddTask,
    setShowQuickAddTask, 
}) => {
    const [task, setTask] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const [project, setProject] = useState('');
    const [showMain, setShowMain] = useState(showShouldMain);
    const [showProjectOverlay, setShowProjectOverlay] = useState(false);
    const [showTaskDate, setShowTaskDate] = useState(false);
    //This is taken from context thanks to the providers in the app.js file
    const { selectedProject } = useSelectedProjectValue();

    /**This function will add the new task when a button is clicked*/
    const addTask = () => {
        const projectId = project || selectedProject;
        let collatedDate = '';

        if (projectId === 'TODAY') {
            collatedDate = moment().format('DD/MM/YYYY');
        } else if (projectId === 'NEXT_7'){
            collatedDate = moment()
                .add(7, 'days')
                . format('DD/MM/YYYY');
        };

        return (task && 
            projectId && 
            firebase
            .firestore()
            .collection('tasks')
            .add({
                archived: false,
                projectId, //This is the same that doing projectId: projectId,
                task,//This is the same that doing task: task,
                date: collatedDate || taskDate,
                userId: 'randomUser'
            })
            .then(() => {
                setTask('');
                setProject('');
                setShowMain('');
                setShowProjectOverlay(false);
            })
        );
    };

    return (
        <div
            className = {showQuickAddTask ? 'add-task add-task__overlay':'add-task'}
            data-testid = "add-task-comp"
        >
            {showAddTaskMain && (
                <div
                    className = "add-task__shallow"
                    data-testid = "show-main-action"
                    onClick = {() => setShowMain(!showMain)}
                >
                    <span className = "add-task__plus">+</span>
                    <span className = "add-task__text">Add Task</span>
                </div>
            )}

            {( showMain || showQuickAddTask ) && (
                <div className = "add-task__main" data-testid = "add-task-main">
                    {showQuickAddTask && (
                        <>
                            <div data-testid = "quick-add-task">
                                <h2 className = "header">Quick add task</h2>
                                <span
                                    className = "add-task__cancel-x"
                                    data-testid = "add-task-quick-cancel"
                                    onClick = { () => {
                                        setShowMain(false);
                                        setShowProjectOverlay(false);
                                        setShowQuickAddTask(false);
                                    }}
                                >
                                    X
                                </span>
                            </div>
                        </>
                    )} 
                    <ProjectOverlay 
                        setProject = {setProject}
                        showProjectOverlay = {showProjectOverlay}
                        setShowProjectOverlay = {setShowProjectOverlay}
                    />
                    <TaskDate 
                        setTaskDate = {setTaskDate}
                        showTaskDate = {showTaskDate}
                        setShowTaskDate = {setShowTaskDate}
                    />
                    <input 
                        className = "add-task__content"
                        data-testid = "add-task-content"
                        type = "text"
                        value = {task}
                        onChange = {e => setTask(e.target.value)}
                    />
                    <button
                        type = "button"
                        className = "add-task__submit"
                        data-testid = "add-task__submit"
                        onClick = {() => showQuickAddTask ? addTask() && setShowQuickAddTask(false) : addTask()}
                    >
                        Add Task
                    </button>
                    {!showQuickAddTask && (
                        <span
                            className = "add-task__cancel"
                            data-testid = "add-task-main-cancel"
                            onClick = {() => {
                                setShowMain(false);
                                setShowProjectOverlay(false);
                            }}
                        >Cancel</span>
                    )}
                    <span
                        className = "add-task__project"
                        data-testid = "show-project-overlay"
                        onClick = {() => setShowProjectOverlay(!showProjectOverlay)}
                    >
                        <FaRegListAlt />
                    </span>
                    <span
                        className = "add-task__date"
                        data-testid = "show-task-date-overlay"
                        onClick = {() => setShowTaskDate(!showTaskDate)}
                    >
                        <FaRegCalendarAlt />
                    </span>
                </div>
            )}
        </div>

    );
};