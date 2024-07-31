import React from "react";

const Context = React.createContext({
    setErrorMessage: () => { },
    setReloadProcess: () => { },
    user: {},
    process: {},
    reloadProposals: {},
    setReloadProposals: () => { },
    reloadPreferences: {},
    setReloadPreferences: () => { },
    loadApprovedList: {},
    setLoadApprovedList: () => {}
});

export default Context;