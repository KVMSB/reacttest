import React, { useEffect, useState } from 'react';
import { MsalProvider, useMsal, useIsAuthenticated } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './authConfig';
import './styles/App.css';
import { ProfileData } from './components/ProfileData';
import { callMsGraph } from './graph';
import { PageLayout } from './components/PageLayout';
import { appSettings } from './constants';
import axios from 'axios';
import { getReports } from './services/apiService';
import PowerBIReport from './components/powerBiReport';

// Ensure the instance is initialized at the root level
const msalInstance = new PublicClientApplication(msalConfig);

const MainContent = () => {
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
const [workSpaceDetails, setWorkSpaceDetails] = useState();
const [allWorkSpaceDetails, setAllWorkSpaceDetails] = useState();

    const [noAccess, setNoAccess] = useState(false);
    useEffect(() => {
        const login = async () => {
            try {
                // Ensure MSAL instance is ready before using it
                if (!instance.getAllAccounts().length) {
                    await instance.initialize();
                }

                // Handle redirect response if returning from Azure login
                const response = await instance.handleRedirectPromise();
                if (response) {
                    console.log('Login successful:', response);

                } else if (!isAuthenticated) {
                    // If not authenticated, redirect to login
                    await instance.loginRedirect(loginRequest);
                }
            } catch (error) {
                console.error('Login error:', error);
            }
        };

        login();
    }, [instance, isAuthenticated]);

    useEffect(()=>{
        if(isAuthenticated){
            instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
            getReports( response.idToken).then((res)=>{
                if(!res?.data){
                    setNoAccess(true);
                }
                else{
                setAllWorkSpaceDetails(res?.data);
                    
                setWorkSpaceDetails(res?.data[0]);
                }
            })
        })
        }
    },[isAuthenticated])

    return (
      <PageLayout accounts={accounts[0]} workSpaceDetails={workSpaceDetails} allWorkSpaceDetails={allWorkSpaceDetails} setWorkSpaceDetails={setWorkSpaceDetails}>
        <div className="App">
            {isAuthenticated ? (
                <>
                 {workSpaceDetails && !noAccess?<PowerBIReport {...workSpaceDetails}/>:<p>You don't have access. Please contact your adminstrator</p>}
                 </>
            ) : (
                <p>Redirecting to login...</p>
            )}
        </div>
        </PageLayout>
    );
};

const App = () => (
    <MsalProvider instance={msalInstance}>
        <MainContent />
    </MsalProvider>
);

export default App;
