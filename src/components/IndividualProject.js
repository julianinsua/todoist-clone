import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useProjectsValue, useSelectedProjectValue } from "../context";
import { firebase } from "../firebase";

/**Passing the parameter {project} destructures it, so now you can acces it as project.property
 * this lests you use each one of the keys and values stored inside the project object.
 */
export const IndividualProject = ({ project }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    /**You use the deconstructor operator { | } because useProjectsValue
     * returns an object with both projects and setProjects and you need 
     * to adress them separately*/
    const { projects, setProjects } = useProjectsValue();
    const { setSelectedProject } = useSelectedProjectValue();

    /**This is why its important to have de docId in the projects element
     * so you can retrive it and feed it to the delete function.
     */
    const deleteProject = (docId) => {
        /**Just selects the project in firebase and delete it
         * then it runs a function to refresh the project and 
         * selects to the inbox project instead.
         */
        firebase
            .firestore()
            .collection('projects')
            .doc(docId)
            .delete()
            .then(() => {
                /**This refreshes the projects */
                setProjects([...projects]);
                /**This returns the selected project to 'INBOX */
                setSelectedProject('INBOX');
            });
    };
        
    return (
        /**This is a fragment, have to check it out in the documentation */
        <>
            <span className = "sidebar__dot">•</span>
            <span className = "sidebar__project-name">{project.name}</span>
            <span className = "sidebar__project-delete" 
                data-testid = "delete-project" 
                onClick = {() => {setShowConfirm(!showConfirm)}}
            >
                <FaTrashAlt />
                {showConfirm && (
                    <div className = "project-delete-modal">
                        <div className = "project-delete-modal__inner">
                            <p>are you sure you want to delete this project</p>
                            <button 
                                type = "button" 
                                onClick = {() => {deleteProject(project.docId)}}
                            >
                                Delete
                                
                            </button>
                            <span 
                                onClick = {() => setShowConfirm(!showConfirm)}
                            >
                                Cancel
                            </span>
                        </div>
                    </div>
                )}
            </span>
        </>
    ); 
};
