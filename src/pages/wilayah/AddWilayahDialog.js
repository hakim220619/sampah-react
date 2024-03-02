// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** Config
import authConfig from 'src/configs/auth'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { addWilayah } from 'src/store/apps/wilayah'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.id'

// ** Third Party Components
import toast from 'react-hot-toast'
import axiosConfig from 'src/configs/axiosConfig'

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})
const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const AddDialogWilayah = props => {
  // ** States
  const { show, toggle } = props
  const [options, setOptions] = useState()
  const storedToken = window.localStorage.getItem('token')
  const dispatch = useDispatch()
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
      .required(),
    description: yup
      .string()
      .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
      .required()
  })

  const defaultValues = {
    name: '',
    description: ''
  }

  // const [values, setValues] = useState([])

  const [role, setrole] = useState()
  const [valuesUsers, setValUsers] = useState([])
  const [usersId, setUsers] = useState()

  //   console.log(role)
  useEffect(() => {
    // console.log(customConfig)
    axiosConfig
      .get('/users-wilayah', {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(response => setValUsers(response.data.data))
  }, [])

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    // console.log(dataAll)
    const dataAll = {
      data: data,
      usersId: usersId
    }
    await axiosConfig
      .post('/wilayah', dataAll, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(async response => {
        // console.log(response)
        dispatch(addWilayah({ ...data, usersId }))
        reset()
        toggle()
        toast.success('Successfully Added!')
      })
      .catch(() => {
        toast.error("Failed This didn't work.")
        console.log('gagal')
      })
  }

  const handleclose = event => {
    toggle()
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => handleclose(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => handleclose(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              position: 'relative',
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <IconButton
              size='small'
              onClick={() => handleclose(false)}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                Add Wilayah
              </Typography>
            </Box>

            <Grid container spacing={6}>
              <Grid item sm={12} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Nama Wilayah'
                        onChange={onChange}
                        placeholder='Wilayah A'
                        error={Boolean(errors.name)}
                      />
                    )}
                  />
                  {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item sm={12} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <InputLabel id='users-select'>Select Users</InputLabel>
                  <Select
                    fullWidth
                    value={usersId}
                    id='select-users'
                    label='Select Users'
                    labelId='users-select'
                    onChange={e => setUsers(e.target.value)}
                    inputProps={{ placeholder: 'Select Users' }}
                  >
                    {valuesUsers.map((opts, i) => (
                      <MenuItem key={i} value={opts.id}>
                        {opts.fullName} - {opts.propinsi} - {opts.kabupaten} - {opts.kecamatan} - {opts.desa}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='description'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Description'
                        onChange={onChange}
                        placeholder='qwerty **'
                        error={Boolean(errors.description)}
                      />
                    )}
                  />
                  {errors.description && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label='Make this default shipping address'
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      color: 'text.secondary'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Button variant='contained' sx={{ mr: 2 }} type='submit'>
              Submit
            </Button>
            <Button variant='outlined' color='secondary' onClick={() => handleclose(false)}>
              Discard
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  )
}

export default AddDialogWilayah
