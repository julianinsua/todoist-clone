import React, { createContext, useContext} from "react";
import { useProjects } from "../hooks";

/* This code only creates the context space, it will only be used once the provider is in place
 and the props are passed trough the value property, then the useProjects is called and that 
 retrieves the projects and puts them in the context to be used*/


 export const ProjectsContext = createContext();
/*Here we create an object that allows us to pass the children as props. Basically when we
use this function as a JSX element we can put JSX components inside and they will be 
enclosed by the provider and will have access to the context */
export const ProjectsProvider = ({children}) => {
    /**Here you need to use the deconstruction operator{ | }, because useProjects returns an object
     * consisting of projects and setProjects, so you need each one in a separate variable
     * so that you can adress it propperly
      */
    const { projects, setProjects } = useProjects(); //here you use the hook you imported and declareit as so

    return(
        <ProjectsContext.Provider value = {{ projects, setProjects }}>
            {children}
        </ProjectsContext.Provider>
    );
}

/*This line gives the useProjectsValue  the return value that is stored in the context. 
This is under the hooks documentation, but its actualy about context handling*/
export const useProjectsValue = () => useContext(ProjectsContext);