import React from 'react';
import { Box, Typography, TextField, Container, Slider, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import './App.css';
import { lightBlue } from '@mui/material/colors';

function App() {
  const [principalAmount, setPrincipalAmount] = React.useState(500000);
  const [interest, setInterest] = React.useState(10);
  const [tenure, setTenure] = React.useState(1);
  const [paymentTerm, setPaymentTerm] = React.useState('month');
  const [installment, setInstallment] =  React.useState(0);

  React.useEffect(() => {
    calculateInstallment();
  }, [principalAmount, interest, tenure, paymentTerm]);

  function calculateInstallment() {
    const r = paymentTerm === 'month' ? (interest / 12) / 100 : (interest / 52) / 100;
    const n = paymentTerm === 'month' ? tenure * 12 : tenure * 52;
    const factor = Math.pow(1+r,n);
    const EMI = (principalAmount * r * factor) / (factor - 1);
    setInstallment(EMI);
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
            id='tensure'
            label='Tenure (yrs)'
            name='tensure'
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
          <Typography variant='h6'>Select Installment Paying Term</Typography>
          <RadioGroup 
          row
          value={paymentTerm}
          onChange={e => setPaymentTerm(e.target.value)}
          >
            <FormControlLabel value="month" control={<Radio />} label="Monthly" />
            <FormControlLabel value="week" control={<Radio />} label="Weekly" />
          </RadioGroup>
          <Box sx={{ backgroundColor: lightBlue, p: 2, width: '100%'}}>
          <Typography>Your Installment: ${installment.toFixed(2)}</Typography>
        </Box>
        </Box>
        </Container>
    </div>
  );
}

export default App;