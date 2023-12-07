import { UserDto } from '@/dto/user.dto';
import { getProfile } from '@/utils/getProfile';
import { logout } from '@/utils/logout';
import { Action, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, thunkAPI) => {
    try {
      const response = await getProfile();
      return response;
    } catch (err: any) {
      console.log(err);
    }
  }
);

// export const resetAuthState = createAsyncThunk(
//   'auth/resetAuthState',
//   async (_, thunkAPI) => {
//     try {
//       const response = await logout();
//       return response;
//     } catch (err: any) {
//       console.log(err);
//     }
//   }
// );

type TAuthSliceState = {
  user?: UserDto;
};

const authSliceInitialState: TAuthSliceState = {
  user: undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState: authSliceInitialState,
  reducers: {
    resetAuthState: (state, action: Action<any>) => {
      state.user = undefined;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    // builder.addCase(resetAuthState.fulfilled, (state, action) => {
    //   state = authSliceInitialState;
    // });
  }
});

export const authReducer = authSlice.reducer;
export const { resetAuthState } = authSlice.actions;
