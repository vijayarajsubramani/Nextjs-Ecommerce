import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

const steps = ['Checkout', 'Address', 'Payment'];
interface Tprops{
    val?:number
}

const PaymentProgress:React.FC<Tprops>=({val})=> {
    const isStepFailed = (step: number) => {
        return step === val;
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={1}>
                {steps.map((label, index) => {
                    const labelProps: {optional?: React.ReactNode;error?: boolean;} = {};
                    if (isStepFailed(index)) {
                        labelProps.optional = (
                            <Typography variant="caption" color="error">
                                Alert Message
                            </Typography>
                        );
                        labelProps.error = true;
                    }

                    return (
                        <Step key={label}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
}
export default PaymentProgress