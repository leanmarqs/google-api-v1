import {
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'

import { useForm, useWatch, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema } from '../schemas/formSchema'
import type { FormData } from '../schemas/formSchema'
import { useEffect } from 'react'
import { useRef } from 'react'

function Form() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      nome: '',
      email: '',
      tipo: 'Aula',
      nomeEvento: '',
      detalheOutro: '',
      inicio: null,
      termino: null,
    },
  })

  const tipoSelecionado = useWatch({ control, name: 'tipo' })
  const inicioRef = useRef<ReturnType<typeof dayjs> | null>(null)

  useEffect(() => {
    if (tipoSelecionado !== 'Evento') setValue('nomeEvento', '')
    if (tipoSelecionado !== 'Outro') setValue('detalheOutro', '')
  }, [tipoSelecionado, setValue])

  const onSubmit = (data: FormData) => {
    console.log('Dados válidos:', data)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br'>
      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, width: 500, mx: 'auto' }}>
          <Typography variant='h5' color='textSecondary' gutterBottom>
            Formulário de Reserva
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label='Nome'
                {...register('nome')}
                error={!!errors.nome}
                color={
                  !dirtyFields.nome
                    ? 'primary'
                    : errors.nome
                      ? 'error'
                      : 'success'
                }
                helperText={errors.nome?.message}
                fullWidth
              />

              <TextField
                label='Email'
                {...register('email')}
                error={!!errors.email}
                color={
                  !dirtyFields.email
                    ? 'primary'
                    : errors.email
                      ? 'error'
                      : 'success'
                }
                helperText={errors.email?.message}
                fullWidth
              />

              <FormControl error={!!errors.tipo}>
                <FormLabel>Tipo</FormLabel>
                <Controller
                  name='tipo'
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel
                        value='Aula'
                        control={<Radio />}
                        label='Aula'
                      />
                      <FormControlLabel
                        value='Reunião'
                        control={<Radio />}
                        label='Reunião'
                      />
                      <FormControlLabel
                        value='Evento'
                        control={<Radio />}
                        label='Evento'
                      />
                      <FormControlLabel
                        value='Outro'
                        control={<Radio />}
                        label='Outro'
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>

              {tipoSelecionado === 'Evento' && (
                <TextField
                  label='Nome do Evento'
                  {...register('nomeEvento')}
                  error={!!errors.nomeEvento}
                  color={
                    !dirtyFields.nomeEvento
                      ? 'primary'
                      : errors.nomeEvento
                        ? 'error'
                        : 'success'
                  }
                  helperText={errors.nomeEvento?.message}
                  fullWidth
                />
              )}

              {tipoSelecionado === 'Outro' && (
                <TextField
                  label='Detalhar tipo de reserva'
                  {...register('detalheOutro')}
                  error={!!errors.detalheOutro}
                  color={
                    !dirtyFields.detalheOutro
                      ? 'primary'
                      : errors.detalheOutro
                        ? 'error'
                        : 'success'
                  }
                  helperText={errors.detalheOutro?.message}
                  fullWidth
                />
              )}

              <Stack direction='row' spacing={2}>
                <Controller
                  name='inicio'
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      label='Início'
                      value={field.value ?? null}
                      onChange={(v) => {
                        field.onChange(v)
                        inicioRef.current = v
                      }}
                      format='DD/MM/YYYY HH:mm'
                      disablePast
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.inicio,
                          helperText: errors.inicio?.message,
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name='termino'
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      label='Término'
                      value={field.value ?? null}
                      onChange={field.onChange}
                      format='DD/MM/YYYY HH:mm'
                      disablePast
                      minDateTime={inicioRef.current ?? undefined}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.termino,
                          helperText: errors.termino?.message,
                        },
                      }}
                    />
                  )}
                />
              </Stack>

              <Button type='submit' variant='contained' disabled={isSubmitting}>
                Enviar
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  )
}

export default Form
