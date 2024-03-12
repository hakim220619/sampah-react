import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'src/configs/axiosConfig'

// ** Fetch Wilayah
export const fetchDataWilayah = createAsyncThunk('appWilayah/fetchData', async params => {
  const storedToken = window.localStorage.getItem('token')
  const customConfig = {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + storedToken
    }
  }
  // console.log(customConfig)
  const response = await axios.get('/wilayah', customConfig)
  return response.data
})

// ** Add Wilayah
export const addWilayah = createAsyncThunk('appWilayah/addWilayah', async (data, { getState, dispatch }) => {
  return dispatch(fetchDataWilayah(getState().wilayah.params))
})
export const editWilayah = createAsyncThunk('appWilayah/addWilayah', async (data, { getState, dispatch }) => {
  return dispatch(fetchDataWilayah(getState().wilayah.params))
})

// ** Delete Wilayah
export const deleteWilayah = createAsyncThunk('appWilayah/deleteWilayah', async (id, { getState, dispatch }) => {
  const storedToken = window.localStorage.getItem('token')
  const customConfig = {
    id: id,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + storedToken
    }
  }
  const response = await axios.delete('/wilayah-delete/' + id, customConfig)
  dispatch(fetchDataWilayah(getState().wilayah.params))

  return response.data
})

export const appWilayahSlice = createSlice({
  name: 'appWilayah',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDataWilayah.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appWilayahSlice.reducer
