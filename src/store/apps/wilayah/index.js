import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Fetch Wilayah
export const fetchDataWilayah = createAsyncThunk('appWilayah/fetchData', async params => {
  const customConfig = {
    params,
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.NEXT_PUBLIC_JWT_SECRET
    }
  }
  // console.log(customConfig)
  const response = await axios.get('/api/wilayah', customConfig)
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
  const customConfig = {
    data: id,
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.NEXT_PUBLIC_JWT_SECRET
    }
  }
  const response = await axios.delete('/api/wilayah', customConfig)
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
