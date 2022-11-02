import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import useStyles from './styles';
import { database } from '../../services/firebase';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Lab as LabType } from '../../types';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Lab: React.FC = () => {
  const classes = useStyles();
  const [data, setData] = useState<LabType[]>([]);
  const [editing, setEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: 0,
      local: '',
      size: 0
    },
    validationSchema: Yup.object({
      id: Yup
        .number()
        .min(1, 'Prenncha o código')
        .required('Código é obrigatório'),
      local: Yup
        .string()
        .max(255)
        .required('Local é obrigatório'),
      size: Yup
        .number()
        .min(1, 'Preencha a capacidade')
        .required('Capacidade é obrigatória')
    }),
    onSubmit: values => handleSaveModal(values)
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    formik.resetForm();
    setOpenModal(false);
    setEditing(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, 'labs'),
      (snapshot) => {
        const { docs } = snapshot;
        setData(
          docs.map(doc => {
            return {
              id: +doc.id,
              local: doc.get('local'),
              size: doc.get('size')
            };
          })
        )
      },
      (error) => {
        console.error(error);
      });
    return unsubscribe;
  }, []);

  const handleSaveModal = async (dataModal:LabType) => {
    if (!editing && data.map(doc => doc.id).some((id) => id === dataModal.id)) {
      toast.warning(`O laboratório ${dataModal.id} já está cadastrado.`)
      return;
    }
    await setDoc(doc(database, 'labs', ''+dataModal.id), {
      local: dataModal.local,
      size: dataModal.size
    });
    toast.success(`Laboratório ${dataModal.id} salvo com sucesso`)
    handleCloseModal();
  }

  const handleDeleteLab = async (id: number) => {
    // TODO Validar sem tem alguma reserva
    if (window.confirm(`Deseja deletar o laboratório ${id}?`)) {
      await deleteDoc(doc(database, 'labs', id.toString()))
      toast.success(`Laboratório ${id} removido com sucesso.`)
    }
  }

  const handleEditLab = (lab: LabType) => {
    setEditing(true);
    formik.setValues(lab);
    handleOpenModal();
  }

  return (
    <div style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      width: '100%'
    }}>
      <Dialog onClose={handleCloseModal} open={openModal}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Adicionar laboratório</DialogTitle>
          <DialogContent>
            <TextField
              error={Boolean(formik.touched.id && formik.errors.id)}
              helperText={formik.touched.id && formik.errors.id}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.id}
              name='id'
              autoFocus
              margin="dense"
              id="cod"
              label="Código"
              type="number"
              fullWidth
              variant="standard"
              disabled={editing}
            />
            <TextField
              error={Boolean(formik.touched.local && formik.errors.local)}
              helperText={formik.touched.local && formik.errors.local}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.local}
              name='local'
              margin="dense"
              id="local"
              label="Local"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              error={Boolean(formik.touched.size && formik.errors.size)}
              helperText={formik.touched.size && formik.errors.size}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.size}
              name='size'
              margin="dense"
              id="size"
              label="Capacidade"
              type="number"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' color='warning' onClick={handleCloseModal}>Cancelar</Button>
            <Button variant='outlined' color='success' type='submit'>Salvar</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Box sx={{ pb: 2 }}>
        <Button variant='outlined' color='success' onClick={handleOpenModal}>Cadastrar</Button>
      </Box>
      <div style={{
        width: '100%'
      }}>
        <TableContainer className={classes.table} component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Local</TableCell>
                <TableCell>Capacidade</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>{row.local}</TableCell>
                  <TableCell>{row.size}</TableCell>
                  <TableCell align="center">
                    <Button variant='outlined' color='warning' onClick={() => handleEditLab(row)}>Editar</Button>
                    <Button variant='outlined' color='error' sx={{ ml: 1 }} onClick={() => handleDeleteLab(row.id)}>Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}
export default Lab;
