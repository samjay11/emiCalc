import React from 'react';
import { Box, Typography, TextField, Container, Slider, Radio, RadioGroup, FormControlLabel, Switch } from '@mui/material';
import './App.css';
import { lightBlue } from '@mui/material/colors';

function App() {
  const [principalAmount, setPrincipalAmount] = React.useState(500000);
  const [interest, setInterest] = React.useState(10);
  const [tenure, setTenure] = React.useState(1);
  const [paymentTerm, setPaymentTerm] = React.useState('month');
  const [installment, setInstallment] =  React.useState(0);
  const [interestOnly, setInterestOnly] = React.useState(false);
  const [interestOnlyTenure, setInterestOnlyTenure] = React.useState(0);
  const [interestOnlyPayment, setInterestOnlyPayment] = React.useState({
    interest: 0,
    PMT: 0,
  });

  React.useEffect(() => {
    interestOnly === false ? calculateInstallment() : calculateInterestOnly();
  }, [principalAmount, interest, tenure, paymentTerm, interestOnly, interestOnlyTenure, calculateInstallment, calculateInterestOnly]);

  function calculateInstallment() {
    const r = paymentTerm === 'month' ? (interest / 12) / 100 : (interest / 52) / 100;
    const n = paymentTerm === 'month' ? tenure * 12 : tenure * 52;
    const factor = Math.pow(1+r,n);
    const EMI = (principalAmount * r * factor) / (factor - 1);
    setInstallment(EMI);
  }

  function calculateInterestOnly() {
    const r = paymentTerm === 'month' ? (interest / 12) / 100 : (interest / 52) / 100;
    const interestPayment = principalAmount * r;
    const n = paymentTerm === 'month' ? (tenure - interestOnlyTenure) * 12 : (tenure - interestOnlyTenure) * 52;
    const factor = Math.pow(1+r,-n);
    const PMT = interestPayment / (1 - factor);
    setInterestOnlyPayment({interest: interestPayment, PMT: PMT});
  }
  
  return (
    <div className="App">
      <Typography sx={{ mt: 5 }} variant='h3'>EMI CALCULATOR</Typography>
      <Container component="main" maxWidth="xs">
        <Box component='form' noValidate sx={{
            mt: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <TextField
            id='principal'
            label='Principal Amount $'
            name='pAmount'
            type='number'
            autoFocus
            fullWidth
            value={principalAmount}
            onChange={e => setPrincipalAmount(e.target.value === '' ? 0 : Number(e.target.value))}
          ></TextField>
          <Slider
            valueLabelDisplay="auto"
            step={50000}
            min={100000}
            max={100000000}
            value={typeof principalAmount === 'number' ? principalAmount : 0}
            onChange={e => setPrincipalAmount(e.target.value)}
          />
          <TextField
            id='interest'
            label='Interest Rate %'
            name='interest'
            type='number'
            fullWidth
            autoFocus
            value={interest}
            onChange={e => setInterest(e.target.value === '' ? 0 : Number(e.target.value))}
          ></TextField>
          <Slider
            defaultValue={10}
            valueLabelDisplay="auto"
            step={0.1}
            min={1}
            max={25}
            value={typeof interest === 'number' ? interest : 0}
            onChange={e => setInterest(e.target.value)}
          />
          <TextField
            id='tenure'
            label='Tenure (yrs)'
            name='tenure'
            type='number'
            fullWidth
            autoFocus
            value={tenure}
            onChange={e => setTenure(e.target.value === '' ? 0 : Number(e.target.value))}
          ></TextField>
          <Slider
            defaultValue={1}
            valueLabelDisplay="auto"
            step={1}
            min={1}
            max={40}
            value={typeof tenure === 'number' ? tenure : 0}
            onChange={e => setTenure(e.target.value)}
          />
          <FormControlLabel
           control={ 
            <Switch 
             checked={interestOnly} 
             onChange={e => setInterestOnly(e.target.checked)}
            />} 
           label="Interest Only Payment"
          />
          { interestOnly === true  && 
          <>
            <TextField
              id='interestOnlyTensure'
              label='Interest Only Tenure (yrs)'
              name='tenure'
              type='number'
              fullWidth
              autoFocus
              value={interestOnlyTenure}
              onChange={e => setInterestOnlyTenure(e.target.value === '' ? 0 : Number(e.target.value))}
            ></TextField>
            <Slider
              defaultValue={1}
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={40}
              value={typeof interestOnlyTenure === 'number' ? interestOnlyTenure : 0}
              onChange={e => setInterestOnlyTenure(e.target.value)}
            />
          </>
          }
          <Typography variant='h6'>Select Installment Paying Term</Typography>
          <RadioGroup 
          row
          value={paymentTerm}
          onChange={e => setPaymentTerm(e.target.value)}
          >
            <FormControlLabel value="month" control={<Radio />} label="Monthly" />
            <FormControlLabel value="week" control={<Radio />} label="Weekly" />
          </RadioGroup>
          <Box sx={{ p: 2, width: '100%'}}>
            { interestOnly === false ?
             <Typography>Your installment is ${installment.toFixed(2)}</Typography>
             :
             <>
              { tenure > interestOnlyTenure ? 
                <>
                { paymentTerm === 'month' ?
                  <Typography>Your installment for first {interestOnlyTenure*12} months is ${interestOnlyPayment.interest.toFixed(2)} and ${interestOnlyPayment.PMT.toFixed(2)} for remaining.
                  </Typography>
                  :
                  <Typography>Your installment for first {interestOnlyTenure*52} weeks is ${interestOnlyPayment.interest.toFixed(2)} and ${interestOnlyPayment.PMT.toFixed(2)} for remaining.
                  </Typography>
                }
                </>
                :
                <Typography>Interest only tenure can't be more than actual tenure.</Typography>
              }
             </>
            }
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default App;