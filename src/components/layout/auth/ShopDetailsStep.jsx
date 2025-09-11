import { Business } from '@mui/icons-material';
import {
  Zoom
  , Box
  , Typography
  , TextField
  , Autocomplete
  , Alert
} from '@mui/material';
import React from 'react'

export default function ShopDetailsStep({
  setFormData,
  getError,
  shopSuggestions,
  shopInput,
  setShopInput,
  selectedShop,
  setSelectedShop,
  shopValidationLoading,
  validateShopNameWithGoogle,
  shopValidationSuccess,
  setShopValidationSuccess,
  setShopSuggestions,
  setErrors
}) {
  return (
    <Zoom in={true}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Business color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Shop Information</Typography>
        </Box>

        <Autocomplete
          options={shopSuggestions}
          freeSolo
          value={selectedShop}
          inputValue={shopInput}
          loading={shopValidationLoading}
          onInputChange={(_, newInput) => {
            setShopInput(newInput);
            setSelectedShop(null);
            setFormData(prev => ({ ...prev, shopName: newInput }));
            setShopValidationSuccess(false);
            if (newInput && newInput.trim().length > 2) {
              validateShopNameWithGoogle(newInput.trim());
            } else {
              setShopSuggestions([]);
            }
          }}
          onChange={(_, newValue) => {
            setSelectedShop(newValue);
            if (newValue) {
              const mainText =
                newValue?.structured_formatting?.main_text ||
                newValue?.terms?.[0]?.value ||
                '';
              setFormData(prev => ({ ...prev, shopName: mainText }));
              setErrors(prev => ({ ...prev, shopName: '' }));
              setShopValidationSuccess(true);
            } else {
              setShopValidationSuccess(false);
            }
          }}
          isOptionEqualToValue={(opt, val) => opt.place_id === val.place_id}
          getOptionLabel={(opt) => {
            if (typeof opt === 'string') return opt;
            const main = opt?.structured_formatting?.main_text ?? '';
            const desc = opt?.description ?? '';
            return main ? main : desc;
          }}
          renderOption={(props, option) => {
            const main = option?.structured_formatting?.main_text ?? '';
            const desc = option?.description ?? '';
            return (
              <li {...props} key={option.place_id}>
                <Box>
                  <Typography fontWeight={600}>{main}</Typography>
                  <Typography variant="caption">{desc}</Typography>
                </Box>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search your shop on Google"
              fullWidth
              error={!!getError('shopName')}
              helperText={getError('shopName') || "Type at least 3 characters, then select your shop from the list"}
              sx={{ mb: 2 }}
            />
          )}
          noOptionsText={shopInput.length < 3 ? 'Keep typing your business name..' : 'No matches found'}
        />
        {shopValidationSuccess && (
          <Alert severity="success" sx={{ mt: 1 }}>
            Shop name validated successfully!
          </Alert>
        )}
      </Box>
    </Zoom>
  )
}
