import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile:{
        name:'',
        profile:'',
    },
    logged:false,
    plugins:[]
  },
  reducers: {
    login:(state, action) => {
      
    },
    logout:(state, action) => {
      
    },
    getPlugins:(state, action) => {
      state.value += action.payload
    }
  }
})

export const { login, logout, getPlugins } = userSlice.actions

export default userSlice.reducer