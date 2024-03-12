// ** React Imports
import { useState, forwardRef, useEffect, useRef } from 'react'

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
import { addPaket } from 'src/store/apps/paket'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.id'

import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import CKeditorDesc from 'src/pages/paket/ckeditor/custom-editor'

import toast from 'react-hot-toast'
import axios from 'src/configs/axiosConfig'

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

const AddPaketWilayah = props => {
  // ** States
  const { show, toggle } = props
  const [editorLoaded, setEditorLoaded] = useState(true)
  const [description, setdescription] = useState('')
  const dispatch = useDispatch()
  const storedToken = window.localStorage.getItem('token')
  const schema = yup.object().shape({
    namePaket: yup
      .string()
      .min(3, obj => showErrors('Name Paket', obj.value.length, obj.min))
      .required()
    // description: yup
    //   .string()
    //   .min(3, obj => showErrors('Description', obj.value.length, obj.min))
    //   .required()
  })

  const defaultValues = {
    namePaket: '',
    price: '',
    description: ''
  }

  //   console.log(role)

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

  const editorRef = useRef()
  const { CKEditor, ClassicEditor } = editorRef.current || {}
  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
    }
  }, [])

  const onSubmit = async data => {
    const dataAll = JSON.stringify({ data })
    const customConfig = {
      data: data,
      description: description
    }
    // console.log(customConfig)
    await axios
      .post('/paket-add', customConfig, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(async response => {
        // console.log(response)
        dispatch(addPaket({ ...dataAll }))
        setdescription('')
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
                Add Paket
              </Typography>
            </Box>

            <Grid container spacing={6}>
              <Grid item sm={12} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='namePaket'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Nama Paket'
                        onChange={onChange}
                        placeholder='Wilayah A'
                        error={Boolean(errors.namePaket)}
                      />
                    )}
                  />
                  {errors.namePaket && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.namePaket.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={6}>
              <Grid item sm={12} xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <Controller
                    name='price'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Price'
                        onChange={onChange}
                        placeholder='Rp. ***'
                        error={Boolean(errors.price)}
                      />
                    )}
                  />
                  {errors.price && <FormHelperText sx={{ color: 'error.main' }}>{errors.price.message}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <>
                    {editorLoaded ? (
                      <CKEditor
                        type=''
                        name='desc'
                        editor={ClassicEditor}
                        data={description}
                        onChange={(event, editor) => {
                          const data = editor.getData()
                          setdescription(data)
                        }}
                      />
                    ) : (
                      <div>Editor loading</div>
                    )}
                  </>

                  {/* {errors.description && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                  )} */}
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

export default AddPaketWilayah
