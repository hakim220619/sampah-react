import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import url from 'src/configs/url'

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async params => {
  const URL = await url()
  const customConfig = {
    params,
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.NEXT_PUBLIC_JWT_SECRET
    }
  }
  const response = await axios.get(URL + '/api/users', customConfig)
  // console.log(response.data)
  return response.data
})

// ** Add User
export const addUser = createAsyncThunk('appUsers/addUser', async (data, { getState, dispatch }) => {
  return dispatch(fetchData(getState().user.params))
})
export const editUser = createAsyncThunk('appUsers/addUser', async (data, { getState, dispatch }) => {
  return dispatch(fetchData(getState().user.params))
})

// ** Delete User
export const deleteUser = createAsyncThunk('appUsers/deleteUser', async (id, { getState, dispatch }) => {
  const customConfig = {
    data: id,
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.NEXT_PUBLIC_JWT_SECRET
    }
  }
  const response = await axios.delete('/api/users', customConfig)
  dispatch(fetchData(getState().user.params))

  return response.data
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer
