// ** React Imports
import { useState, useEffect, useCallback, forwardRef } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser, editUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/components/TableHeader'
import AddUserDialog from 'src/pages/admin/AddUserDialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Fade from '@mui/material/Fade'
// ** Config
import authConfig from 'src/configs/auth'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axiosConfig from 'src/configs/axiosConfig'

const MySwal = withReactContent(Swal)
// ** Vars
const userRoleObj = {
  ADM: { icon: 'mdi-human-handsdown', color: 'error.main' },
  ADW: { icon: 'mdi-human-child', color: 'warning.main' },
  PLG: { icon: 'mdi-human-greeting', color: 'info.main' }
  // maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
  // subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
}
const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const userStatusObj = {
  ON: 'primary',
  OFF: 'warning'
}
const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const RowOptions = ({ id, fullName, email, role, state, phone, address, province, regency, district, village }) => {
  // ** Hooks
  const dispatch = useDispatch()
  // console.log(fullName)
  // ** State

  const [anchorEl, setAnchorEl] = useState(null)
  const [EditUserOpen, setEditUserOpen] = useState(false)
  const rowOptionsOpen = Boolean(anchorEl)
  const [show, setShow] = useState(false)
  const [fullNameEd, setFullname] = useState(fullName)
  const [emailEd, setEmail] = useState(email)
  const [roleEd, setRole] = useState(role)
  const [stateEd, setState] = useState(state)
  const [phoneEd, setPhone] = useState(phone)
  const [addressEd, setAddress] = useState(address)
  const [valuesProvince, setValProvince] = useState([])
  const [provinceED, setProvince] = useState(province)
  const [valuesRegency, setValRegency] = useState([])
  const [regencyED, setRegency] = useState()
  const [valuesDistrict, setValDistrict] = useState([])
  const [districtED, setDistrict] = useState()
  const [valuesVillage, setValVillage] = useState([])
  const [villageED, setVillage] = useState()
  const storedToken = window.localStorage.getItem('token')
  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        // console.log(id)
        dispatch(deleteUser(id))
        handleRowOptionsClose()
        toast.success('Successfully has been deleted.')
      }
    })
  }
  // const schema = yup.object().shape({
  //   address: yup.string().required(),
  //   email: yup.string().email().required(),
  //   phone: yup
  //     .number()
  //     .typeError('Contact Number field is required')
  //     .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
  //     .required(),
  //   fullName: yup
  //     .string()
  //     .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
  //     .required(),
  //   password: yup
  //     .string()
  //     .min(3, obj => showErrors('Password', obj.value.length, obj.min))
  //     .required()
  // })
  const defaultValues = {
    emailEd: email,
    roleEd: role,
    addressEd: address,
    fullNameEd: fullName,
    stateEd: state,
    phone: Number(phone),
    provinceED: province,
    regencyED: regency,
    districtED: district,
    villageED: village
  }
  const [values, setValues] = useState([])
  // const [role, setrole] = useState()
  //   console.log(role)

  console.log(defaultValues)
  const {
    reset,
    control,
    handleSubmit,

    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange'
    // resolver: yupResolver(schema)
  })

  useEffect(() => {
    axiosConfig
      .get('/getRole', {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(response => {
        setValues(response.data.data)
      })
    axiosConfig
      .get('/getProvince', {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(response => {
        setValProvince(response.data.data)
      })
  }, [])

  const onRegency = async id => {
    axiosConfig
      .get('/getRegency/' + id, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(response => response.data.data)
      .then(val => setValRegency(val))
  }
  const onDistrict = async id => {
    axiosConfig
      .get('/getDistrict/' + id, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(response => response.data.data)
      .then(val => setValDistrict(val))
  }
  const onVillage = async id => {
    axiosConfig
      .get('/getVillage/' + id, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(response => response.data.data)
      .then(val => setValVillage(val))
  }

  const onSubmit = async () => {
    const customConfig = {
      data: { id, fullNameEd, emailEd, roleEd, stateEd, phoneEd, addressEd },
      type: 'edit',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.NEXT_PUBLIC_JWT_SECRET
      }
    }
    await axios
      .post('/api/users', customConfig)
      .then(async response => {
        // console.log(response)
        dispatch(editUser({ id, fullNameEd, emailEd, roleEd, stateEd, phoneEd, addressEd, role }))
        setShow(false), setAnchorEl(null), reset()
        toast.success('Successfully Updatedd!')
      })
      .catch(() => {
        toast.error("Failed This didn't work.")
        console.log('gagal')
      })
  }

  return (
    <>
      <MenuItem onClick={() => setShow(true)} sx={{ '& svg': { mr: 2 } }}>
        <Icon icon='mdi:pencil-outline' fontSize={20} />
      </MenuItem>
      <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
        <Icon icon='mdi:delete-outline' fontSize={20} />
      </MenuItem>

      <Card>
        <Dialog
          fullWidth
          open={show}
          maxWidth='md'
          scroll='body'
          onClose={() => {
            setShow(false), setAnchorEl(null), reset()
          }}
          TransitionComponent={Transition}
          onBackdropClick={() => {
            setShow(false), setAnchorEl(null), reset()
          }}
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
                onClick={() => {
                  setShow(false), setAnchorEl(null), reset()
                }}
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
                <Icon icon='mdi:close' />
              </IconButton>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Edit Users
                </Typography>
              </Box>

              <Grid container spacing={6}>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                      value={fullNameEd}
                      label='Full Name'
                      onChange={e => setFullname(e.target.value)}
                      placeholder='John Doe'
                      error={Boolean(errors.fullName)}
                    />

                    {errors.fullName && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.fullName.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                      type='email'
                      value={emailEd}
                      label='Email'
                      onChange={e => setEmail(e.target.value)}
                      placeholder='johndoe@email.com'
                      error={Boolean(errors.email)}
                    />

                    {errors.email && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <InputLabel id='role-select'>Select Role</InputLabel>
                    <Select
                      fullWidth
                      value={roleEd}
                      id='select-role'
                      label='Select Role'
                      labelId='role-select'
                      onChange={e => setRole(e.target.value)}
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
                    <InputLabel id='role-select'>Select State</InputLabel>
                    <Select
                      fullWidth
                      value={stateEd}
                      id='select-state'
                      label='Select State'
                      labelId='state-select'
                      onChange={e => setState(e.target.value)}
                      inputProps={{ placeholder: 'Select State' }}
                    >
                      <MenuItem value='ON'>ON</MenuItem>
                      <MenuItem value='OFF'>OFF</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <InputLabel id='role-select'>Select Province</InputLabel>
                    <Select
                      fullWidth
                      value={provinceED}
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
                      value={regencyED}
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
                      value={districtED}
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
                      value={villageED}
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
                    <TextField
                      type='number'
                      value={phoneEd}
                      label='Phone'
                      onChange={e => setPhone(e.target.value)}
                      placeholder='(397) 294-5153'
                      error={Boolean(errors.phone)}
                    />

                    {errors.contact && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.contact.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                      value={addressEd}
                      label='Address'
                      onChange={e => setAddress(e.target.value)}
                      placeholder='Jl hr **'
                      error={Boolean(errors.address)}
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
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => {
                  setShow(false), setAnchorEl(null), reset()
                }}
              >
                Discard
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Card>
    </>
  )
}

const columns = [
  {
    flex: 0.2,
    minWidth: 250,
    field: 'fullName',
    headerName: 'Full Name',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.fullName}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'email',
    headerName: 'Email',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.email}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    field: 'role',
    minWidth: 150,
    headerName: 'Role',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3, color: userRoleObj[row.role].color } }}>
          <Icon icon={userRoleObj[row.role].icon} fontSize={20} />
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.role}
          </Typography>
        </Box>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 110,
    field: 'state',
    headerName: 'Status',
    renderCell: ({ row }) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.state}
          color={userStatusObj[row.state]}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'phone',
    headerName: 'Phone',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.phone}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'address',
    headerName: 'Address',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.address}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 150,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => (
      <RowOptions
        id={row.id}
        fullName={row.fullName}
        email={row.email}
        role={row.role}
        state={row.state}
        phone={row.phone}
        address={row.address}
        province={row.provinceId}
        regency={row.regencyId}
        district={row.districtId}
        village={row.villageId}
      />
    )
  }
]

const UserList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const dispatch = useDispatch()
  const store = useSelector(state => state.user)
  // console.log(store)
  useEffect(() => {
    dispatch(
      fetchData({
        q: value
      })
    )
  }, [dispatch, value])
  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddUserDialog = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDialog} name='Users' />
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </Grid>

      <AddUserDialog show={addUserOpen} toggle={toggleAddUserDialog} />
    </Grid>
  )
}

export default UserList
