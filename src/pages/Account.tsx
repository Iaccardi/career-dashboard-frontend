import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import '../globals.css';

const Account = ({ authToken }) => {
  const jobCategories = [
    "Accounting & Finance Jobs",
    "IT Jobs",
    "Sales Jobs",
    "Customer Services Jobs",
    "Engineering Jobs",
    "HR & Recruitment Jobs",
    "Healthcare & Nursing Jobs",
    "Hospitality & Catering Jobs",
    "PR, Advertising & Marketing Jobs",
    "Logistics & Warehouse Jobs",
    "Teaching Jobs",
    "Trade & Construction Jobs",
    "Admin Jobs",
    "Legal Jobs",
    "Creative & Design Jobs",
    "Graduate Jobs",
    "Retail Jobs",
    "Consultancy Jobs",
    "Manufacturing Jobs",
    "Scientific & QA Jobs",
    "Social Work Jobs",
    "Travel Jobs",
    "Energy, Oil & Gas Jobs",
    "Property Jobs",
    "Charity & Voluntary Jobs",
    "Domestic Help & Cleaning Jobs",
    "Maintenance Jobs",
    "Part-Time Jobs",
    "Other/General Jobs",
    "Unknown",
  ];

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    careerField: '',
    degree: '',
    expectedSalary: '',
    skills: '',
    experienceLevel: '',
  });

  const [errors, setErrors] = useState({
    email: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    const isValidEmail = /\S+@\S+\.\S+/.test(userData.email);
    if (!isValidEmail) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    } else {
      newErrors.email = '';
    }
    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (authToken) {
      axios
        .get('https://career-dashboard-9b2b8318a630.herokuapp.com/api/users/userdata', {
          headers: { Authorization: `Bearer ${authToken}` },
        })
        .then((response) => {
          const user = response.data;
          setUserData(user);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [authToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    axios
      .post(
        'https://career-dashboard-9b2b8318a630.herokuapp.com/api/users/updateAccount', // Hardcoded API URL
        userData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      )
      .then((response) => {
        if (response.data.success) {
          alert('Account information updated successfully');
        } else {
          alert('Error updating account information: ' + response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error updating account information:', error);
        alert('Error updating account information');
      });
  };

  return (
    <Container className="account-container">
      <h1 className='account-heading'>Account Settings</h1>
      <form className="account-container" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Career Field</InputLabel>
              <Select
                label="Career Field"
                name="careerField"
                value={userData.careerField}
                onChange={handleInputChange}
              >
                {jobCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Degree"
              name="degree"
              value={userData.degree}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Expected Salary"
              name="expectedSalary"
              value={userData.expectedSalary}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Skills"
              name="skills"
              value={userData.skills}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Experience Level"
              name="experienceLevel"
              value={userData.experienceLevel}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary">
          Update Account
        </Button>
      </form>
    </Container>
  );
};

export default Account;
