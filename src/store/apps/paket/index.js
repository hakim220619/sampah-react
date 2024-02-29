import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Fetch Paket
export const fetchDataPaket = createAsyncThunk('appPaket/fetchData', async params => {
  const response = await axios.get('/api/paket', {
    params
  })
  return response.data
})

// ** Add Paket
export const addPaket = createAsyncThunk('appPaket/addPaket', async (data, { getState, dispatch }) => {
  return dispatch(fetchDataPaket(getState().paket.params))
})
export const editPaket = createAsyncThunk('appPaket/addPaket', async (data, { getState, dispatch }) => {
  return dispatch(fetchDataPaket(getState().paket.params))
})

// ** Delete Paket
export const deletePaket = createAsyncThunk('appPaket/deletePaket', async (id, { getState, dispatch }) => {
  const response = await axios.delete('/api/paket', {
    data: id
  })
  dispatch(fetchDataPaket(getState().paket.params))

  return response.data
})

export const appPaketSlice = createSlice({
  name: 'appPaket',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDataPaket.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appPaketSlice.reducer
