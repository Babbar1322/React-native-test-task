import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PaymentMethod {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
}

interface PaymentMethodState {
  methods: PaymentMethod[];
}

const initialState: PaymentMethodState = {
  methods: [],
};

const paymentMethodSlice = createSlice({
  name: 'paymentMethods',
  initialState,
  reducers: {
    addPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.methods.push(action.payload);
    },
    removePaymentMethod: (state, action: PayloadAction<string>) => {
      state.methods = state.methods.filter((method) => method.id !== action.payload);
    },
    setPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.methods = action.payload;
    },
    clearPaymentMethods: (state) => {
      state.methods = [];
    },
  },
});

export const {
  addPaymentMethod,
  removePaymentMethod,
  setPaymentMethods,
  clearPaymentMethods,
} = paymentMethodSlice.actions;

export default paymentMethodSlice.reducer;
