import React, { useEffect, useRef, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import { useMsal } from '@azure/msal-react';
import { getEmbedDetails, getReports } from '../services/apiService';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemButton } from '@mui/material';
import { loginRequest } from '../authConfig';
import { ApiCallWithLoader } from './loader.js';
import { jwtDecode } from 'jwt-decode';

const PowerBIReport = (props) => {
    const [pages, setPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState(null);
    const { instance, accounts } = useMsal();
    const [embedDetails, setEmbedDetails] = useState(null);
    const [loading, setLoading] = useState(false);


    const [decodedToken, setDecodedToken] = useState(null);


    const onRefresh = () => {
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getEmbedDetails(props.reportID, props.workspaceID).then(res => {
                    setEmbedDetails(res.data.embedUrl);
                    setPages(res.data.embedUrl.pages)
                    setSelectedPage(res.data.embedUrl.pages[0])
                });
            })
    }

    useEffect(() => {
        if (embedDetails?.token) {
            const decoded = decodeToken(embedDetails.token);
            setDecodedToken(decoded);

            if (decoded && decoded.exp) {
                const currentTime = Date.now() / 1000; // Convert to seconds
                const expirationTime = decoded.exp - currentTime;

                if (expirationTime > 0) {
                    // Set a timer to refresh the token before expiration
                    const timer = setTimeout(() => {
                        onRefresh();
                    }, (expirationTime - 60) * 1000); // Refresh 1 minute before expiry

                    return () => clearTimeout(timer); // Cleanup the timer
                }
            }
        }
    }, [embedDetails, onRefresh]);

    const decodeToken = (token) => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Failed to decode JWT token:', error);
            return null;
        }
    };


    useEffect(() => {
        setLoading(true);
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                getEmbedDetails(props.reportID, props.workspaceID).then(res => {
                    setEmbedDetails(res.data.embedUrl);
                    setPages(res.data.embedUrl.pages)
                    setSelectedPage(res.data.embedUrl.pages[0])
                    setLoading(false);
                });
            });

    }, [props])

    const embedConfig = {
        type: 'report',
        id: embedDetails?.id,
        embedUrl: embedDetails?.embedUrl,
        accessToken: embedDetails?.token,
        tokenType: models.TokenType.Embed,
        pageName: selectedPage?.name,
        settings: {
            panes: {
                pageNavigation: { visible: false }, // Hide the default horizontal tabs
            },
        },
    };

    const changePage = (pageName) => {
        const page = pages.find((p) => p.name === pageName);
        if (page) {
            // page.setActive(); // Switch to the selected page
            setSelectedPage(page);
        }
    };

    return (

        <div style={{ display: 'flex', height: '100vh' }}>
            {embedDetails ?
                <>
                    {/* Vertical Navigation Menu */}
                    <List style={{ width: '240px', borderRight: '1px solid #ccc' }}>
                        {pages.map((page) => (
                            <ListItem
                                button
                                key={page.name}
                                className={selectedPage?.name === page.name ? 'selected' : ''}
                            >
                                <ListItemButton
                                    selected={selectedPage?.name === page.name}
                                    className='listBtn'
                                    onClick={() => changePage(page.name)}>
                                    {page.displayName}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    {/* Power BI Report Embed */}
                    <div style={{ flex: 1, height: "100vh" }}>
                        <PowerBIEmbed
                            embedConfig={embedConfig}
                            cssClassName="report-style-class"
                        />
                    </div>
                </> : null}

            <ApiCallWithLoader loading={loading} />
        </div>
    );
};

export default PowerBIReport;
