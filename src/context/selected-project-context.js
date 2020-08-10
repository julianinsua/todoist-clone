import React, { createContext, useContext, useState } from "react";

export const SelectedProjectContext = createContext();
/*Here we create an object that allows us to pass the children as props. Basically when we
use this function as a JSX element we can put JSX components inside and they will be 
enclosed by the provider and will have access to the context */
export const SelectedProjectProvider = ({children}) => {
    /*Create the hook to the state (default value is 'INBOX')and pass it to the context trough 
    the provider in the return statement. this lets you get what project is selected and pass 
    it to the context*/
    const [selectedProject, setSelectedProject] = useState('INBOX'); 

    return(
        <SelectedProjectContext.Provider value = {{ selectedProject, setSelectedProject }}>
            {children}
        </SelectedProjectContext.Provider>
    );
}

/*This line returns the context once it is set by the provider, the selected project is 
stored in state  and pased through context to childs*/
export const useSelectedProjectValue = () => useContext(SelectedProjectContext);