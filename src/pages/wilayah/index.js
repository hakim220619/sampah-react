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
import { fetchDataWilayah, deleteWilayah, editWilayah } from 'src/store/apps/wilayah'

// ** Third Party Components
import axios from 'src/configs/axiosConfig'

// ** Custom Table Components Imports
import TableHeader from 'src/components/TableHeader'
import AddWilayahDialog from 'src/pages/wilayah/AddWilayahDialog'
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

const MySwal = withReactContent(Swal)

// ** Vars
const userRoleObj = {
  ADM: { icon: 'mdi:laptop', color: 'error.main' },
  ADW: { icon: 'mdi:cog-outline', color: 'warning.main' },
  PLG: { icon: 'mdi:pencil-outline', color: 'info.main' }
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
  OFF: 'error'
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

const RowOptions = ({ id, userId, name, description, state }) => {
  // ** Hooks
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState(null)
  const [EditUserOpen, setEditUserOpen] = useState(false)
  const rowOptionsOpen = Boolean(anchorEl)
  const [show, setShow] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [nameEd, setName] = useState(name)
  const [userIdEd, setUserId] = useState(userId)
  const [descriptionEd, setDescription] = useState(description)
  const [stateEd, setState] = useState(state)
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
        dispatch(deleteWilayah(id))
        handleRowOptionsClose()
        toast.success('Successfully has been deleted.')
      }
    })
  }

  const defaultValues = {
    nameEd: name,
    userIdEd: userId,
    stateEd: state,
    descriptionEd: description
  }
  const [valuesUsers, setValUsers] = useState([])

  useEffect(() => {
    axios
      .get('/users', {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(response => response.data.allData)
      .then(val => {
        setValUsers(val)
      })
  }, [])

  const {
    reset,
    control,
    handleSubmit,

    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange'
  })

  const onSubmit = async () => {
    const customConfig = {
      data: { id, userIdEd, nameEd, descriptionEd, stateEd, type: 'edit' },
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.NEXT_PUBLIC_JWT_SECRET
      }
    }
    await axios
      .post('/api/wilayah', customConfig)
      .then(async response => {
        dispatch(editWilayah({ id, userIdEd, nameEd, descriptionEd, stateEd, type: 'edit' }))
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
                  Edit Wilayah
                </Typography>
              </Box>

              <Grid container spacing={6}>
                <Grid item sm={12} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <InputLabel id='users-select'>Select Users</InputLabel>
                    <Select
                      fullWidth
                      value={userIdEd}
                      id='select-users'
                      label='Select Users'
                      labelId='users-select'
                      onChange={e => setUserId(e.target.value)}
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
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                      value={nameEd}
                      label='Name'
                      onChange={e => setName(e.target.value)}
                      placeholder='John Doe'
                      error={Boolean(errors.nameEd)}
                    />
                  </FormControl>
                  {errors.nameEd && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.nameEd.message}</FormHelperText>
                  )}
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
                <Grid item sm={12} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                      value={descriptionEd}
                      label='Description'
                      onChange={e => setDescription(e.target.value)}
                      placeholder='asd****'
                      error={Boolean(errors.descriptionEd)}
                    />
                  </FormControl>
                  {errors.descriptionEd && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.descriptionEd.message}</FormHelperText>
                  )}
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
    minWidth: 40,
    field: 'no',
    headerName: 'No',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.no}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 350,
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
    minWidth: 300,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.name}
        </Typography>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 350,
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
    flex: 0.15,
    field: 'description',
    minWidth: 350,
    headerName: 'Description',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.description}
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
      <RowOptions id={row.id} userId={row.userId} name={row.name} description={row.description} state={row.state} />
    )
  }
]

const WilayahList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const dispatch = useDispatch()
  const store = useSelector(state => state.wilayah)
  useEffect(() => {
    dispatch(
      fetchDataWilayah({
        q: value
      })
    )
  }, [dispatch, value])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddWilayahDialog = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddWilayahDialog} name='Wilayah' />
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
      <AddWilayahDialog show={addUserOpen} toggle={toggleAddWilayahDialog} />
    </Grid>
  )
}

export default WilayahList
