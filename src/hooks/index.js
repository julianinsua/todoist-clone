import { useState, useEffect } from "react";
import { firebase } from "../firebase";
import { collatedTasksExist } from "../helpers";
import { moment } from "moment";

///////////////////////////////////////////////////////
//
//                      TASK HOOK
//
///////////////////////////////////////////////////////
/*This hook manages the dataflow from the database to the react state of the tasks. 
Once you select a project it fetches the tasks asociated whit it, allso checks for 
changes in the state and the database and makes sure it all gets to the return. The user 
in this hook is given statically*/

//The parameter gives the selected project, the component returns the asociated tasks
export const useTasks = selectedProject => {
    //use the hooks function notation to set the state, as default give it an empty array 
    //of tasks. Also create a place in the state to store archived Tasks.
    const [tasks, setTasks] = useState([]);
    const [archivedTasks, setArchivedTasks] = useState([]);
    
    console.log(selectedProject);
    console.log(!collatedTasksExist(selectedProject));
    /*the array at the end of the function tells the useEffect function that if what is on 
    the array doesen't change don't re-run the effect.  useEffect manages the secondary 
    effects of the component. once it is mounted it will  call the function inside.*/
    useEffect (() => {
            //First get all the tasks asociated to the user.
            let unsubscribe = firebase
                .firestore()
                .collection('tasks')
                .where('userId', '==', 'randomUser');

            /**
                //Filter the tasks acording to de project selected, or today or inbox.
            /*First condition checks if there is a project selected and it doesent belong
            to the collated tasks array. This is done by the imported 
            function collatedTasksExist. If true, filter all the tasks in unsuscribe that have
            that project ID 
            unsubscribe =  
                selectedProject && !collatedTasksExist(selectedProject) 
                ? (unsubscribe = unsubscribe.where('projectId', '==', selectedProject)) 
                : selectedProject === 'TODAY' 
                ? (unsubscribe = unsubscribe.where('date', '==', moment().format('DD/MM/YYYY')))
                : selectedProject === 'INBOX' || selectedProject === 0 
                ? (unsubscribe = unsubscribe.where('date', '==', '')) 
                : unsubscribe;*/
            
            /*onSnapshot es un listener que se activa cuando hay algun cambio en los docs 
            seleccionados en la base de datos. Esta funcion lo que hace es una vez que esta 
            seleccionado el proyecto y unsuscribe tiene los docs asociados a esa seleccion 
            es ver si cambian. si lo hacen se ejecuta la funcion. el parametro snapshot tiene 
            asociados los docs que estan en unsuscribe*/
            unsubscribe = unsubscribe.onSnapshot(snapshot => {
                /*new tasks mapea cada uno de los docs y los mete en un arrey con un id y con 
                toda la informacion que hay en ese doc, usa el recurso que vi en redux de hacer 
                una copia directa usando ...*/
                const newTasks = snapshot.docs.map(task => ({
                    id: task.id,
                    ...task.data(),
                }));
                /* Now that I have all the tasks in all the cases posible I need to set them 
                into the state, this will put whatever I do into the state under "Tasks". 
                It won't change the newTasks array so I can still use it later*/
                setTasks(
                    /* I add the filter in case the slected project is next 7 days and filter 
                    newTasks acordingly, And only keep tasks that are not archived*/
                    selectedProject === 'NEXT_7'
                    ? newTasks.filter(
                        task => moment(task.date, 'DD-MM-YYYY').diff(moment(), 'days') <= 7 
                        && task.archived !== true
                    )
                    /*If the project selected is not next 7 days, then just filter the ones 
                    that are not archived */
                    : newTasks.filter(task => task.archived !== true)
                );
                
                setArchivedTasks(
                    newTasks.filter(task => task.archived !== false)
                );
            });

            return () => unsubscribe();
        },
    [selectedProject]);

    return {tasks, archivedTasks}; //Aca son muy importantes las llaves, antes puse corchetes y no anduvo
};


///////////////////////////////////////////////////////
//
//                      PROJECT HOOK
//
///////////////////////////////////////////////////////
/*This Hook manages the data flow from the database to the state of all the 
projects that the user has stored. Here the user is already defined statically */


export const useProjects = () => {
    /*Just create a space in the state to store the projects */
    const [projects, setProjects] = useState([]);
    /*Just manages the secondary effects once the component is mounted or updated */
    useEffect(
        () => {
            /*Just get all the projecs under the user ID and orther them by project ID.
            the get() function is very similar to the snapshot, just doesen't listen 
            all the time. Suposedly, you wont change that much your projects.*/
            firebase
                .firestore()
                .collection('projects')
                .where('userId', '==', 'randomUser')
                .orderBy('projectId')
                .get()
                .then(snapshot => {
                    const allProjects = snapshot.docs.map(project => ({
                        ...project.data(),
                        docId: project.id,
                    }))
                    /*This condition ensures you don't enter an infinite loop. 
                    This is a posibility since you are checking if projects change 
                    while seting them.*/
                    if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
                        setProjects(allProjects);
                    }
                });
            
    },[projects]);

    return {projects, setProjects};
};
