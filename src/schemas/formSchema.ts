import { z } from 'zod'
import dayjs, { Dayjs } from 'dayjs'

export const formSchema = z
  .object({
    nome: z.string().min(4, 'Informe o nome'),
    email: z.string().email('Email inválido'),
    tipo: z.enum(['Aula', 'Reunião', 'Evento', 'Outro']),
    nomeEvento: z.string().optional(),
    detalheOutro: z.string().optional(),
    predio: z.string().min(1, 'Selecione um prédio'),
    sala: z.string().min(1, 'Selecione uma sala'),

    inicio: z.custom<Dayjs | null>(
      (v) => v === null || (dayjs.isDayjs(v) && v.isValid()),
      { message: 'Informe uma data de início válida' },
    ),

    termino: z.custom<Dayjs | null>(
      (v) => v === null || (dayjs.isDayjs(v) && v.isValid()),
      { message: 'Informe uma data de término válida' },
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.inicio) {
      ctx.addIssue({
        code: 'custom',
        path: ['inicio'],
        message: 'Informe a data de início',
      })
      return
    }

    if (!data.termino) {
      ctx.addIssue({
        code: 'custom',
        path: ['termino'],
        message: 'Informe a data de término',
      })
      return
    }

    if (data.termino.isBefore(data.inicio)) {
      ctx.addIssue({
        code: 'custom',
        path: ['termino'],
        message: 'O término não pode ser anterior ao início',
      })
    }
  })

  // 👇 ESTE é o export que você estava tentando importar
export type FormData = z.infer<typeof formSchema>