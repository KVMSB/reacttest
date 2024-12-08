import React, { useEffect, useState } from "react";
import { callMsGraph } from "../graph";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { getReports } from "../services/apiService";
import PowerBIReport from "./powerBiReport";

/**
 * Renders information about the user obtained from MS Graph
 * @param props 
 */
export const ProfileData = (props) => {
    const { instance, accounts } = useMsal();

    const [graphData, setGraphData] = useState(null);
    useEffect(() => {
        if (!graphData) {
            RequestProfileData();
            
        }
    }, [graphData])
    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                console.log(response);
                callMsGraph(response.accessToken).then((response) => {
                    setGraphData(response)
                   
                });
            });
    }

    return (
        <div id="profile-div">
            <p><strong>First Name: </strong> {graphData?.givenName}</p>
            <p><strong>Last Name: </strong> {graphData?.surname}</p>
            <p><strong>Email: </strong> {graphData?.userPrincipalName}</p>
            <p><strong>Id: </strong> {graphData?.id}</p>
         
        </div>
    );
};