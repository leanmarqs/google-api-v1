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
  MenuItem,
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
    reset,
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
      predio: '',
      sala: '',
    },
  })

  const tipoSelecionado = useWatch({ control, name: 'tipo' })
  const predioSelecionado = useWatch({ control, name: 'predio' })
  const predioValue = useWatch({ control, name: 'predio' })
  const salaValue = useWatch({ control, name: 'sala' })

  const inicioRef = useRef<ReturnType<typeof dayjs> | null>(null)

  useEffect(() => {
    if (tipoSelecionado !== 'Evento') setValue('nomeEvento', '')
    if (tipoSelecionado !== 'Outro') setValue('detalheOutro', '')
  }, [tipoSelecionado, setValue])

  useEffect(() => {
    setValue('sala', '')
  }, [predioSelecionado, setValue])

  const handleReset = () => {
    reset()
  }

  const salas =
    predioSelecionado === 'Central de Aulas 1'
      ? Array.from(
          { length: 10 },
          (_, i) => `Sala ${String(i + 1).padStart(2, '0')}`,
        )
      : predioSelecionado === 'Central de Aulas 2'
        ? Array.from(
            { length: 15 },
            (_, i) => `Sala ${String(i + 1).padStart(2, '0')}`,
          )
        : []

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

              <Stack direction='row' spacing={2}>
                <Controller
                  name='predio'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label='Prédio'
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      error={!!errors.predio}
                      helperText={errors.predio?.message}
                      fullWidth
                    >
                      <MenuItem value='Central de Aulas 1'>
                        Central de Aulas 1
                      </MenuItem>
                      <MenuItem value='Central de Aulas 2'>
                        Central de Aulas 2
                      </MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  name='sala'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label='Sala'
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      error={!!errors.sala}
                      helperText={errors.sala?.message}
                      fullWidth
                      disabled={!predioValue}
                    >
                      {salas.map((sala) => (
                        <MenuItem key={sala} value={sala}>
                          {sala}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Stack>

              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                <Button variant='outlined' onClick={handleReset}>
                  Limpar
                </Button>

                <Button
                  type='submit'
                  variant='contained'
                  disabled={isSubmitting}
                >
                  Enviar
                </Button>
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  )
}

export default Form
