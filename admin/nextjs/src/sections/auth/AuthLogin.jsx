'use client';
import PropTypes from 'prop-types';

// @next
import { useRouter } from 'next/navigation';

import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import { useForm } from 'react-hook-form';

// @project
import { APP_DEFAULT_PATH } from '@/config';
import { emailSchema, passwordSchema } from '@/utils/validation-schema/common';
import api from '@/lib/api';

// @icons
import { IconEye, IconEyeOff } from '@tabler/icons-react';

/***************************  AUTH - LOGIN  ***************************/

export default function AuthLogin({ inputSx }) {
  const router = useRouter();
  const theme = useTheme();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (formData) => {
    setIsProcessing(true);
    setLoginError('');

    try {
      const res = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, refreshToken, user, tenant } = res.data;

      // Only allow super admins to access the admin panel
      if (!user.isSuperAdmin) {
        setLoginError('Accès réservé aux super administrateurs');
        setIsProcessing(false);
        return;
      }

      // Store tokens and user info
      localStorage.setItem('tunierp_admin_access_token', accessToken);
      localStorage.setItem('tunierp_admin_refresh_token', refreshToken);
      localStorage.setItem('tunierp_admin_user', JSON.stringify(user));

      router.push(APP_DEFAULT_PATH);
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur de connexion';
      setLoginError(message);
      setIsProcessing(false);
    }
  };

  const commonIconProps = { size: 16, color: theme.vars.palette.grey[700] };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <Box>
            <InputLabel>Email</InputLabel>
            <OutlinedInput
              {...register('email', emailSchema)}
              placeholder="super@tunierp.tn"
              fullWidth
              error={Boolean(errors.email)}
              sx={inputSx}
            />
            {errors.email?.message && <FormHelperText error>{errors.email.message}</FormHelperText>}
          </Box>

          <Box>
            <InputLabel>Mot de passe</InputLabel>
            <OutlinedInput
              {...register('password', passwordSchema)}
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder="Entrez votre mot de passe"
              fullWidth
              error={Boolean(errors.password)}
              endAdornment={
                <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? <IconEye {...commonIconProps} /> : <IconEyeOff {...commonIconProps} />}
                </InputAdornment>
              }
              sx={inputSx}
            />
            {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
          </Box>
        </Stack>

        <Button
          type="submit"
          color="primary"
          variant="contained"
          disabled={isProcessing}
          endIcon={isProcessing && <CircularProgress color="secondary" size={16} />}
          sx={{ minWidth: 120, mt: { xs: 1, sm: 4 }, '& .MuiButton-endIcon': { ml: 1 } }}
        >
          Connexion
        </Button>

        {loginError && (
          <Alert sx={{ mt: 2 }} severity="error" variant="filled" icon={false}>
            {loginError}
          </Alert>
        )}
      </form>
    </>
  );
}
