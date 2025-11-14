import { Business } from '@mui/icons-material';
import {
  Zoom
  , Box
  , Typography
  , TextField
  , Autocomplete
  , Alert
} from '@mui/material';
import React, { useEffect } from 'react'

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

  // useEffect(() => {
  //   console.log("shopsuggestions updated:", shopSuggestions);
  //   console.log("Number of suggestions:", shopSuggestions.length);
  //   console.log("First suggestion:", shopSuggestions[0]);
  // }, [shopSuggestions]);

  return (
    <Zoom in={true}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Business color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Shop Information</Typography>
        </Box>

        
        {/* <Box sx={{ mb: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption">
            Debug: {shopSuggestions.length} suggestions found
          </Typography>
        </Box> */}

        <Autocomplete
          options={shopSuggestions}
          freeSolo
          value={selectedShop}
          inputValue={shopInput}
          loading={shopValidationLoading}
          onInputChange={(_, newInput) => {
            // console.log("Input changed to:", newInput);
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
            // console.log("Selection changed:", newValue);
            setSelectedShop(newValue);
            if (newValue) {
              setFormData(prev => ({ ...prev, shopName: newValue.name }));
              setErrors(prev => ({ ...prev, shopName: '' }));
              setShopValidationSuccess(true);
            } else {
              setShopValidationSuccess(false);
            }
          }}
          isOptionEqualToValue={(option, value) => {
            const isEqual = option?.place_id === value?.place_id;
            // console.log("Option equality check:", option, value, isEqual);
            return isEqual;
          }}
          getOptionLabel={(option) => {
            if (typeof option === "string") return option;
            return option?.name || "";
          }}
          renderOption={(props, option) => {
            // console.log("Rendering option:", option);
            return (
              <li {...props} key={option.place_id}>
                <Box>
                  <Typography fontWeight={600}>{option.name}</Typography>
                  <Typography variant="caption">{option.address}</Typography>
                </Box>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Type your full business name. If it doesn’t appear, keep typing to load more results."
              placeholder='Search your shop on Google'
              fullWidth
              error={!!getError('shopName')}
              helperText={getError('shopName') || "Type at least 3 characters, then select your shop"}
              sx={{ mb: 2 }}
            />
          )}
          noOptionsText={shopInput.length < 3 ? 'Keep typing your business name..' : 'No matches found'}
          filterOptions={(x) => x}
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