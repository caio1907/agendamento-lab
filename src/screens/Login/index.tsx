import React from 'react';
import { Box, Button, Container, TextField } from '@mui/material';
import { setLoading } from '../../utils/loadingState';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from '../../services/firebase';
import { translateMessageErrorToPTBR } from '../../utils/messageErrorsFirebase';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface IData {
  email: string,
  password: string
}

const Login:React.FC = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('E-mail inválido')
        .max(255)
        .required('E-mail é obrigatório'),
      password: Yup
        .string()
        .max(255)
        .required('Senha é obrigatória')
    }),
    onSubmit: (values) => signIn(values)
  });

  const signIn = ({email, password}: IData) => {
    setLoading(true);
    toast.dismiss();
    signInWithEmailAndPassword(auth, email, password).then(() => {
      setLoading(false)
    }).catch(error => {
      toast.error(translateMessageErrorToPTBR(error.code) ?? error.message);
      setLoading(false)
      formik.setSubmitting(false);
    })
  }

  return (
    <Box
      component='main'
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100%',
        height: '100vh'
      }}
    >
      <Container maxWidth='sm'>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            error={Boolean(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            label='E-mail'
            margin='normal'
            name='email'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type='email'
            value={formik.values.email}
            variant='outlined'
            autoFocus
          />
          <TextField
            error={Boolean(formik.touched.password && formik.errors.password)}
            fullWidth
            helperText={formik.touched.password && formik.errors.password}
            label='Senha'
            margin='normal'
            name='password'
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type='password'
            value={formik.values.password}
            variant='outlined'
          />
          <Box sx={{ py: 2 }}>
            <Button
              color='primary'
              disabled={formik.isSubmitting}
              fullWidth
              size='large'
              type='submit'
              variant='contained'
            >
              Entrar
            </Button>
          </Box>
          {/* <Typography component='h1' variant='h5' color='primary'>
            Entrar
          </Typography>
          <Grid item>
            <Box
              component='form'
              onSubmit={signIn}
              noValidate
              autoComplete='off'
            >
              <TextField
                error={Boolean(data.email && !validateEmail(data.email))}
                type='email'
                required
                label='E-mail'
                autoFocus
                autoComplete='username'
                value={data.email}
                onChange={evt => setData(prev => ({...prev, email: evt.target.value}))}
              />
              <TextField
                error={Boolean(data.password && data.password.length <= 5)}
                type='password'
                required
                label='Senha'
                autoComplete='current-password'
                value={data.password}
                onChange={evt => setData(prev => ({...prev, password: evt.target.value}))}
              />
              <Button
                type='submit'
                sx={{
                  margin: theme.spacing(3, 0, 2)
                }}
                disabled={!validateEmail(data.email) || data.password.length <= 5}
              >
                Entrar
              </Button>
            </Box>
          </Grid> */}
        </form>
      </Container>
    </Box>
  )
}
export default Login
