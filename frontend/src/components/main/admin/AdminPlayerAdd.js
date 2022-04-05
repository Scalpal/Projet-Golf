import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Axios from 'axios';

import SpecialAlert from './SpecialAlert';

function AdminPlayerAdd() {

  // Datas from database
  const [ genders, setGenders ] = useState([]); 

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [adress, setAdress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [genderSelected, setGenderSelected] = useState('');


  // Alertes 
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [mediumError, setMediumError] = useState(false);
  const [mediumErrorMessage, setMediumErrorMessage] = useState('')

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(async() => {
    const datas = await Axios.get('http://localhost:3001/admin/player/add');

    setGenders(datas.data)
  },[]);

  console.log(genders);
  useEffect(() => {
    if(success){
        setTimeout(() => {
            setSuccess(false);
        }, 3000)
    }

    if(mediumError){
      setTimeout(() => {
          setMediumError(false);
      }, 3000)
  }

    if(error){
        setTimeout(() => {
            setError(false);
        }, 3000)
    }
  }, [success,mediumError,error])

  // Fonction pour vérifier si une string contient des lettres
  function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  };

  //Fonction pour vérifier que l'age est supérieur à 18 ans
  function isOverEighteen(birthday) {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    var age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if(age > 17){
      return true;
    }else{
      return false;
    }
}

  const addPlayer = async() => {

    if(lastName.length > 0 && firstName.length > 0 && adress.length > 0 && phoneNumber.length > 0 && genderSelected.length > 0){
      if(containsAnyLetter(phoneNumber)){
        setError(true);
        setErrorMessage('Veuillez saisir un numéro de téléphone correct.')
      }else{
        if(isOverEighteen(birthDate)){
          const result = await Axios.post("http://localhost:3001/admin/player/add", {
            lastName: lastName,
            firstName: firstName,
            playerAdress: adress,
            playerPhone: phoneNumber,
            playerBirthDate: birthDate,
            genre: genderSelected,
          });
          setSuccess(true);
          setSuccessMessage(result.data.message);
        }else{
          setError(true);
          setErrorMessage('Le joueur doit avoir au moins 18 ans.');
        }
      }
    }else{
      setError(true);
      setErrorMessage('Veuillez remplir les champs.');
    }
  };

  // console.log(typeof birthDate);

  // console.log(isOverEighteen(birthDate));
  // console.log(lastName)
  // console.log(firstName)
  // console.log(adress)
  // console.log(phoneNumber)
  // console.log(birthDate)

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "rgb(230,230,230)",
        padding: "25px 25px"
      }}
    > 
      <Box 
        className='inner-container'
      >
        <h1 className='main-title'> Ajout d'un joueur </h1>

        <ul className='separator-list'>
            <li></li>
            <li></li>
            <li></li>
        </ul> 

        {/* Contient les champs du formulaire  */}
        <Grid container spacing={1}
          sx={{
            width: "50%",
            margin: "auto auto",
            paddingBottom: "30px"
          }}
        >
          <Grid item xs={6}>
            <FormControl sx={{width: "100%"}}>
              <OutlinedInput 
                placeholder='Nom' 
                onChange={(e) => {setLastName(e.target.value)}}
                sx={{
                  marginBottom: "20px",
                }}
              /> 
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl sx={{width: "100%"}} >
              <OutlinedInput 
                placeholder='Prénom' 
                onChange={(e) => {setFirstName(e.target.value)}}
              /> 
            </FormControl>
          </Grid>

          <Grid item xs={12}> 
            <FormControl sx={{ width: "100%"}}>
              <OutlinedInput 
                placeholder='Adresse' 
                onChange={(e) => {setAdress(e.target.value)}}
                sx={{
                  marginBottom: "20px",
                }}
              /> 
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <input 
              type="tel" 
              onChange={(e) => {setPhoneNumber(e.target.value)}}
              pattern="^[0-9]{3,45}$" 
              maxLength={10}
              minLength={10}
              className="player-tel-input"
              placeholder='Numéro de téléphone'
              required
            />
          </Grid>

          <Grid item xs={6}>
            <input 
              type="date" 
              onChange={(e) => {setBirthDate(new Date(e.target.value))}}
              className="player-birthdate-input"
            />
          </Grid>

          <Grid container item xs={6} direction="row" justifyContent="center" sx={{margin: "0 auto"}}>
            <FormControl
              sx={{
                  width: "80%",
                  marginBottom: "30px",
              }}
            >
              <InputLabel id="demo-simple-select-label">Genre</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={genderSelected}
                label="Tournoi"
                required
                onChange={(e) => {setGenderSelected(e.target.value)}}
                >
                  {genders.map((gender) => {
                    const genre = gender.genre;
                    return(
                        <MenuItem value={genre}> {genre} </MenuItem>
                    )
                  })}
              </Select>
            </FormControl>
          </Grid>

          <Grid container item xs={12} direction="row" justifyContent="center">
            {errorMessage.length < 1 ? (
              <Button 
                variant="contained"
                color="success"
                onClick={addPlayer}
              >
                Ajouter le joueur
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={addPlayer}
                sx={{
                  backgroundColor: "rgb(194,63,56)",
                  color: "white",
                  "&:hover":{
                    backgroundColor: "rgb(140, 45, 38)"
                  }
                }}
              >
                Veuillez remplir les champs
              </Button>
            )}
          </Grid>
        </Grid>
        
        <SpecialAlert 
          success={success}
          successMessage={successMessage}

          mediumError={mediumError}
          mediumErrorMessage={mediumErrorMessage}

          error={error}
          errorMessage={errorMessage}
        />

      </Box>
    </Box>
  )
}

export default AdminPlayerAdd;