import React, {useState, useEffect} from 'react';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

function SpecialAlert({success, successMessage,mediumError,mediumErrorMessage,error,errorMessage}) {


    return (
        <React.Fragment>

            {/* Success alert */}
            <Slide
                direction="left"
                in={success}
                timeout={1200}
                mountOnEnter
                unmountOnExit
            >
                <Alert
                    variant="filled" 
                    severity="success"
                    sx={{
                        position: "fixed",
                        top: "30px",
                        right: "30px",
                        }}
                >
                    {successMessage}
                </Alert>
            </Slide>


            {/* Medium error alert  */}
            <Slide
                direction="left"
                in={mediumError}
                timeout={1200}
                mountOnEnter
                unmountOnExit
            >
                <Alert
                    variant="filled" 
                    severity="warning"
                    sx={{
                        position: "fixed",
                        top: "30px",
                        right: "30px",
                        }}
                >
                    {mediumErrorMessage}
                </Alert>
            </Slide>


            {/* Medium error alert */}
            <Slide
                direction='left'
                in={error}
                mountOnEnter
                unmountOnExit
                timeout={1200}
            >
                <Alert
                    variant="filled" 
                    severity="error"
                    sx={{
                        position: "fixed",
                        top: "30px",
                        right: "30px",
                        }}
                >
                    {errorMessage}
                </Alert>
            </Slide>
        </React.Fragment>
    )
}

export default SpecialAlert;