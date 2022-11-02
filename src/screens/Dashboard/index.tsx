import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { database } from '../../services/firebase';
import { Lab, Schedule } from '../../types';
import useStyles from './styles';
import FullCalendar, { EventClickArg } from '@fullcalendar/react';
import DayGridPlugin from '@fullcalendar/daygrid';
import ptBR from '@fullcalendar/core/locales/pt-br';
import { loadCurrentUser } from '../../utils/user';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User } from 'firebase/auth';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { addDays, addHours, endOfDay, isValid, startOfDay } from 'date-fns';
import { toast } from 'react-toastify';

interface ScheduleDashboard extends Schedule {
  isEditable: boolean
}

const Dashboard:React.FC = () => {
  const [data, setData] = useState<ScheduleDashboard[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [user, setUser] = useState<User>();
  const [openModal, setOpenModal] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [canRemove, setCanRemove] = useState(false);
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      lab: 0,
      date_start: addDays(new Date(), 2),
      date_end: addHours(addDays(new Date(), 2), 1)
    },
    validationSchema: Yup.object({
      lab: Yup
        .number()
        .min(1, 'Selecione um laboratório')
        .required('Laboratório é um campo obrigatório'),
      date_start: Yup
        .date()
        .min(new Date(), 'Data/hora deve ser maior que a hora atual')
        .required('Data/Hora inicial é obrigatório'),
      date_end: Yup
        .date()
        .min(Yup.ref('date_start'), 'Data/hora deve ser maior que a hora atual')
        .required('Data/Hora final é obrigatória')
    }),
    onSubmit: values => handleSaveModal(values)
  });

  useEffect(() => {
    loadCurrentUser().then(_user => {
      _user && setUser(_user);
    })
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribeSchedules = onSnapshot(
        collection(database, 'schedules'),
        (snapshot) => {
          const { docs } = snapshot;
          const _data:ScheduleDashboard[] = [];
          docs.forEach(element => {
            element.get('schedules')?.forEach((doc: any) => {
              const dateStart = new Timestamp(doc.date_start.seconds, doc.date_start.nanoseconds).toDate();
              const dateEnd = new Timestamp(doc.date_end.seconds, doc.date_end.nanoseconds).toDate();
              _data.push({
                lab: +doc.lab,
                dateStart,
                dateEnd,
                teacher: element.id,
                isEditable: element.id === user.uid
              })
            })
          });
          setData(_data)
        },
        (error) => {
          console.error(error);
        });
      const unsubscribeLabs = onSnapshot(
        collection(database, 'labs'),
        snapshot => {
          const { docs } = snapshot;
          setLabs(docs.map(doc => ({
            id: +doc.id,
            local: doc.get('local'),
            size: +doc.get('size')
          })));
        }
      );
      return () => {
        unsubscribeSchedules();
        unsubscribeLabs();
      };
    }
  }, [user])

  const handleOpenModal = () => {
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    formik.resetForm();
    setRemoving(false);
    setCanRemove(false);
    setOpenModal(false);
  }

  const handleSaveModal = async (values: {lab: number, date_start: Date, date_end: Date}) => {
    if (values.date_end > endOfDay(values.date_start)) {
      toast.warning('Reserva não pode ter mais de um dia');
      return;
    }
    const isValid = await validateHasSchedule(values);
    if (!isValid) {
      toast.warning('Já existe uma reserva para esse horário e laboratório selecionados');
      return;
    }
    const ref = doc(database, 'schedules', ''+user?.uid);
    const schedules:any[] = (await getDoc(ref)).get('schedules');
    schedules.push(values);
    await setDoc(ref, {schedules}, {merge: true});
    toast.success(`Reserva salva com sucesso`)
    handleCloseModal();
  }

  const handleOpenRemoveModal = (event:EventClickArg) => {
    const { extendedProps } = event.event;
    formik.setValues({
      date_end: extendedProps.event.dateEnd,
      date_start: extendedProps.event.dateStart,
      lab: extendedProps.event.lab
    });
    setRemoving(true);
    setCanRemove(extendedProps.event.isEditable)
    handleOpenModal()
  }

  const handleRemoveScheduleModal = async () => {
    const ref = doc(database, 'schedules', ''+user?.uid);
    const schedule = await getDoc(ref)
    const schedules:any[] = schedule.get('schedules');
    const index = schedules.findIndex((schedule) => {
      const scheduleToCompare = {
        date_end: new Timestamp(schedule.date_end.seconds, schedule.date_end.nanoseconds).toDate(),
        date_start: new Timestamp(schedule.date_start.seconds, schedule.date_start.nanoseconds).toDate(),
        lab: schedule.lab
      };
      const valuesToCompare = {
        date_end: formik.values.date_end,
        date_start: formik.values.date_start,
        lab: formik.values.lab
      };
      return JSON.stringify(scheduleToCompare) === JSON.stringify(valuesToCompare)
    });
    schedules.splice(index, 1);
    await setDoc(ref, {schedules}, {merge: true});
    toast.success(`Reserva removida com sucesso`)
    handleCloseModal();
  }

  const validateHasSchedule = async (schedule: any) => {
    const docs = (await getDocs(collection(database, 'schedules'))).docs;
    const schedules:any[] = [];
    docs.forEach(element => {
      element.get('schedules')?.forEach((doc: any) => {
        const date_start = new Timestamp(doc.date_start.seconds, doc.date_start.nanoseconds).toDate();
        const date_end = new Timestamp(doc.date_end.seconds, doc.date_end.nanoseconds).toDate();
        schedules.push({
          lab: +doc.lab,
          date_start,
          date_end
        })
      })
    });
    const schedulesOrderByStartDate = schedules.sort((a, b) => {
      if ( a.date_start < b.date_start ){
        return -1;
      }
      if ( a.date_start > b.date_start ){
        return 1;
      }
      return 0;
    });
    return !schedulesOrderByStartDate.some(item => {
      const { date_start, date_end } = schedule;
      return (date_start >= item.date_start && date_start <= item.date_end) || (date_end <= item.date_end && date_end >= item.date_start)
    })
  }

  return (
    <div className={classes.main}>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{`${removing ? 'Ver' : 'Criar'} reserva`}</DialogTitle>
          <DialogContent>
            <TextField
              error={Boolean(formik.touched.lab && formik.errors.lab)}
              helperText={formik.touched.lab && formik.errors.lab}
              onBlur={formik.handleBlur}
              value={formik.values.lab}
              onChange={formik.handleChange}
              name='lab'
              select
              fullWidth
              variant='standard'
              disabled={removing}
            >
              <MenuItem value='0'>Selecione um laboratório</MenuItem>
              {labs.map((lab, index) => (
                <MenuItem key={index} value={lab.id}>{lab.id} - {lab.local}</MenuItem>
              ))}
            </TextField>
            <DateTimePicker
              label='Data/Hora inicial'
              value={formik.values.date_start}
              onChange={value => formik.setFieldValue('date_start', isValid(value) ? value : null)}
              minDateTime={startOfDay(addDays(new Date(), 2))}
              disabled={removing}
              renderInput={params =>
                <TextField
                  {...params}
                  error={Boolean(formik.touched.date_start && formik.errors.date_start)}
                  helperText={formik.touched.date_start && formik.errors.date_start && String(formik.errors.date_start)}
                  onBlur={formik.handleBlur}
                  name='date_start'
                  margin='dense'
                  fullWidth
                  variant='standard'
                />
              }
            />
            <DateTimePicker
              label='Data/Hora final'
              value={formik.values.date_end}
              onChange={value => formik.setFieldValue('date_end', isValid(value) ? value : null)}
              minDateTime={addHours(formik.values.date_start, 1)}
              maxDateTime={endOfDay(formik.values.date_start)}
              disabled={removing}
              renderInput={params =>
                <TextField
                  {...params}
                  error={Boolean(formik.touched.date_end && formik.errors.date_end)}
                  helperText={formik.touched.date_end && formik.errors.date_end && String(formik.errors.date_end)}
                  onBlur={formik.handleBlur}
                  name='date_end'
                  margin='dense'
                  fullWidth
                  variant='standard'
                />
              }
            />
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' color='warning' onClick={handleCloseModal}>Cancelar</Button>
            {removing ? (
              canRemove && <Button variant='outlined' color='error' onClick={handleRemoveScheduleModal}>Remover</Button>
            ) : (
              <Button variant='outlined' color='success' type='submit'>Reservar</Button>
            )
            }
          </DialogActions>
        </form>
      </Dialog>
      <div>
        <Button variant='contained' onClick={handleOpenModal}>Criar Reserva</Button>
      </div>
      <FullCalendar
        plugins={[DayGridPlugin]}
        height='auto'
        locale={ptBR}
        headerToolbar={{
          left: 'title',
          right: 'today prev,next'
        }}
        events={data.map(event => ({
          title: `Láb ${event.lab.toString()}`,
          start: event.dateStart,
          end: event.dateEnd,
          color: event.isEditable ? (event.dateStart >= startOfDay(addDays(new Date(), 2)) ? '#FF6961' : '#153D2C ') : '',
          event,
          interactive: event.isEditable
        }))}
        displayEventTime
        displayEventEnd
        editable
        eventClick={handleOpenRemoveModal}
      />
      <strong>Legenda</strong>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Typography variant='caption' style={{color: '#FF6961'}}>(Sua reserva) Pode ser editado</Typography>
        <Typography variant='caption' style={{color: '#153D2C'}}>(Sua reserva) Não pode ser editado</Typography>
        <Typography variant='caption' style={{color: '#3788d8'}}>Reserva de outros</Typography>
      </div>
    </div>
  )
}
export default Dashboard;
