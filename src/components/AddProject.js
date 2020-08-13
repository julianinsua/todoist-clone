import React, { useState } from "react";
import { firebase } from "../firebase";
import { generatePushId } from "../helpers";
import { useProjectsValue } from "../context";

/**AddProject is the component to be exported to the Sidebar component */
export const AddProject = ({ shouldShow = false }) => {
    const [show, setShow] = useState(shouldShow);
    const [projectName, setProjectName] = useState('');

    const projectId = generatePushId();
    const { projects, setProjects } = useProjectsValue();

    /**This declares the function that will add the new doc to firebase. it isn't called just yet because it's not addProject(). after adding it resets the values of projects
     * projectName and show (this last thing hides the input and buttons)
     */
    const addProject = () => 
        projectName &&
        firebase
            .firestore()    
            .collection('projects')
            .add({
                projectId, 
                name: projectName,
                userId: 'randomUser'
            })
            .then(() => {
                setProjects([...projects]);
                setProjectName('');
                setShow(false);
            });
    
            /**Here is where the stuff happens. The input and buttons are only showed if the show variable in state is true hence the show &&. here the value of
             * projectName is set by the input every time it changes. Once the submit button is clicked the addProject function is called and uses this value to 
             * add the project. Cancel button just toggles the value of show and since it only shows when show=true then it automatically hides the overlay. 
             */
    return (
        <div className = 'add-project' data-testid = "add-project">
            {show && (
                <div className = "add-project__input" data-testid = "add-project-inner">
                    <input
                        value = {projectName}
                        onChange = {e => setProjectName(e.target.value)}
                        className = "add-project__name"
                        data-testid = "project-name"
                        type = "text"
                        placeholder = "Name your project" 
                    />

                    <button 
                        className = "add-project__submit"
                        type = "button"
                        onClick = {() => addProject()}
                        data-testid = "add-project-submit"
                    >
                        Add project
                    </button>
                    <span
                        aria-label = "Cancel adding project"
                        data-testid = "hide-project-overlay"
                        className = "add-project__cancel"
                        onClick = {() => setShow(false)}
                    >
                        Cancel
                    </span>
                </div>
            )}

            <span className = "add-project__plus">+</span>
            <span 
                aria-label = "Add project"
                data-testid = "add-project-action"
                className = "add-project__text"
                onClick = {() => setShow(!show)}
            >
                Add Project
            </span>
        </div>
    );
};