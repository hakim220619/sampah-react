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
import { addUser } from 'src/store/apps/user'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.id'
import toast from 'react-hot-toast'

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

const AddDialogUsers = props => {
  // ** States
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
  const { show, toggle } = props
  const [options, setOptions] = useState()
  // const [role, setRole] = useState([])
  const dispatch = useDispatch()
  const schema = yup.object().shape({
    address: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup
      .number()
      .typeError('Contact Number field is required')
      .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
      .required(),
    fullName: yup
      .string()
      .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
      .required(),
    password: yup
      .string()
      .min(3, obj => showErrors('Password', obj.value.length, obj.min))
      .required()
  })

  const defaultValues = {
    email: '',
    role: '',
    address: '',
    fullName: '',
    password: '',
    phone: ''
  }

  const [values, setValues] = useState([])

  const [role, setrole] = useState()
  const [valuesProvince, setValProvince] = useState([])
  const [province, setProvince] = useState()
  const [valuesRegency, setValRegency] = useState([])
  const [regency, setRegency] = useState()
  const [valuesDistrict, setValDistrict] = useState([])
  const [district, setDistrict] = useState()
  const [valuesVillage, setValVillage] = useState([])
  const [village, setVillage] = useState()

  //   console.log(role)
  // useEffect(() => {
  //   const storedToken = window.localStorage.getItem('token')
  //   axios
  //     .get('/api/role', {
  //       headers: {
  //         Authorization: storedToken
  //       }
  //     })
  //     .then(response => response.data.data)
  //     .then(val => setValues(val))
  //   axios
  //     .get('/api/province', {
  //       headers: {
  //         Authorization: storedToken
  //       }
  //     })
  //     .then(response => response.data.data)
  //     .then(val => setValProvince(val))
  //   // console.log(province)
  //   // console.log(regency)
  //   // console.log(changeRegency)
  // }, [])

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
  const onRegency = async data => {
    axios
      .get('/api/regency', {
        params: {
          data
        },
        headers: {
          Authorization: storedToken
        }
      })
      .then(response => response.data.data)
      .then(val => setValRegency(val))
  }
  const onDistrict = async data => {
    axios
      .get('/api/district', {
        params: {
          data
        },
        headers: {
          Authorization: storedToken
        }
      })
      .then(response => response.data.data)
      .then(val => setValDistrict(val))
  }
  const onVillage = async data => {
    axios
      .get('/api/village', {
        params: {
          data
        },
        headers: {
          Authorization: storedToken
        }
      })
      .then(response => response.data.data)
      .then(val => setValVillage(val))
  }

  const onSubmit = async data => {
    const dataAll = JSON.stringify()
    // console.log(dataAll)
    const customConfig = {
      data: data,
      role: role,
      province: province,
      regency: regency,
      district: district,
      village: village,
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.NEXT_PUBLIC_JWT_SECRET
      }
    }
    console.log(customConfig)
    await axios
      .post('/api/users', customConfig)
      .then(async response => {
        // console.log(response)
        dispatch(addUser({ ...data, role, province, regency, district, village }))
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
                Add Users
              </Typography>
            </Box>

            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='fullName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Full Name'
                        onChange={onChange}
                        placeholder='John Doe'
                        error={Boolean(errors.fullName)}
                      />
                    )}
                  />
                  {errors.fullName && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.fullName.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='email'
                        value={value}
                        label='Email'
                        onChange={onChange}
                        placeholder='johndoe@email.com'
                        error={Boolean(errors.email)}
                      />
                    )}
                  />
                  {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item sm={6} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='password'
                        value={value}
                        label='Password'
                        onChange={onChange}
                        placeholder='*******'
                        error={Boolean(errors.password)}
                      />
                    )}
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <InputLabel id='role-select'>Select Role</InputLabel>
                  <Select
                    fullWidth
                    value={role}
                    id='select-role'
                    label='Select Role'
                    labelId='role-select'
                    onChange={e => setrole(e.target.value)}
                    inputProps={{ placeholder: 'Select Role' }}
                  >
                    {values.map((opts, i) => (
                      <MenuItem key={i} value={opts.code}>
                        {opts.roleName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <InputLabel id='role-select'>Select Province</InputLabel>
                  <Select
                    fullWidth
                    value={province}
                    id='select-province'
                    label='Select Province'
                    labelId='Province-select'
                    onChange={e => {
                      onRegency(e.target.value), setProvince(e.target.value)
                    }}
                    inputProps={{ placeholder: 'Select Province' }}
                  >
                    {valuesProvince.map((opts, i) => (
                      <MenuItem key={i} value={opts.id}>
                        {opts.nama}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <InputLabel id='role-select'>Select Regency</InputLabel>
                  <Select
                    fullWidth
                    value={regency}
                    id='select-regency'
                    label='Select Regency'
                    labelId='Regency-select'
                    onChange={e => {
                      setRegency(e.target.value), onDistrict(e.target.value)
                    }}
                    inputProps={{ placeholder: 'Select Regency' }}
                  >
                    {valuesRegency.map((opts, i) => (
                      <MenuItem key={i} value={opts.id}>
                        {opts.nama}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <InputLabel id='role-select'>Select District</InputLabel>
                  <Select
                    fullWidth
                    value={district}
                    id='select-district'
                    label='Select District'
                    labelId='District-select'
                    onChange={e => {
                      setDistrict(e.target.value), onVillage(e.target.value)
                    }}
                    inputProps={{ placeholder: 'Select District' }}
                  >
                    {valuesDistrict.map((opts, i) => (
                      <MenuItem key={i} value={opts.id}>
                        {opts.nama}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <InputLabel id='role-select'>Select Village</InputLabel>
                  <Select
                    fullWidth
                    value={village}
                    id='select-village'
                    label='Select Village'
                    labelId='Village-select'
                    onChange={e => setVillage(e.target.value)}
                    inputProps={{ placeholder: 'Select Village' }}
                  >
                    {valuesVillage.map((opts, i) => (
                      <MenuItem key={i} value={opts.id}>
                        {opts.nama}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={12} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='phone'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='text'
                        value={value}
                        label='Phone'
                        onChange={onChange}
                        placeholder='(62) 857-5153'
                        error={Boolean(errors.phone)}
                      />
                    )}
                  />
                  {errors.contact && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.contact.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='address'
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Address'
                        onChange={onChange}
                        placeholder='Jl hr **'
                        error={Boolean(errors.address)}
                      />
                    )}
                  />
                  {errors.company && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.company.message}</FormHelperText>
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

export default AddDialogUsers
