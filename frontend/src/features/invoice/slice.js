import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { set, get } from './service';
import { MOCK } from './mock';

const initialState = {
  invoice: null, // MOCK,
  laborPrices: {},
  materialPrices: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Create new invoice
export const setInvoice = createAsyncThunk(
  'invoice/create',
  async (paid, thunkAPI) => {
    try {
      const { invoice } = thunkAPI.getState().invoice;
      // const token = thunkAPI.getState().auth.user.token;
      // return await set(id, data, token);
      const material = [...invoice.material];
      material.sort((a, b) => new Date(a.date) - new Date(b.date));
      const data = {
        ...invoice,
        material,
        paid,
      };
      return await set(invoice.id, data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Update invoice
export const updateInvoice = createAsyncThunk(
  'invoice/update',
  async ({ index, data }, thunkAPI) => {
    try {
      const { invoice } = thunkAPI.getState().invoice;
      return {
        ...invoice,
        days: {
          ...invoice.days,
          [index]: data,
        },
      };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Update invoice
export const updateMaterial = createAsyncThunk(
  'invoice/updateMaterial',
  async (material, thunkAPI) => {
    try {
      const { invoice } = thunkAPI.getState().invoice;
      return {
        ...invoice,
        material,
      };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
// Update invoice
export const updateLabors = createAsyncThunk(
  'invoice/updateLabors',
  async (labor, thunkAPI) => {
    try {
      const { invoice } = thunkAPI.getState().invoice;
      return {
        ...invoice,
        labor: { ...labor },
      };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);
// Update invoice
export const updateMaterialPrices = createAsyncThunk(
  'invoice/updateMaterialPrices',
  async (prices, thunkAPI) => {
    try {
      return prices;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateLaborPrices = createAsyncThunk(
  'invoice/updateLaborPrices',
  async (prices, thunkAPI) => {
    try {
      return prices;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get user invoice
export const getInvoice = createAsyncThunk(
  'invoice/getAll',
  async (id, thunkAPI) => {
    try {
      // const token = thunkAPI.getState().auth.user.token;
      // return await get(id, token);
      // return MOCK;
      return await get(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.invoice = action.payload;
      })
      .addCase(setInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoice = action.payload;
      })
      .addCase(setInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload);
        state.invoice = action.payload;
      })
      .addCase(getInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoice = action.payload;
      })
      .addCase(updateLabors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.invoice = action.payload;
      })
      .addCase(updateMaterialPrices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.materialPrices = action.payload;
      })
      .addCase(updateLaborPrices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.laborPrices = action.payload;
      });
  },
});

export const { reset } = invoiceSlice.actions;
export default invoiceSlice.reducer;
