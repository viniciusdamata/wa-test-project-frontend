import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';

import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import { IOrder } from 'interfaces/models/order';
import React, { forwardRef, Fragment, memo, useCallback } from 'react';
import { tap } from 'rxjs/operators';
import orderService from 'services/order';

import * as yup from 'yup';

interface IProps {
  opened: boolean;
  order?: IOrder;
  onComplete: (order: IOrder) => void;
  onCancel: () => void;
}

const validationSchema = yup.object().shape<IOrder>({
  description: yup.string().required(),
  quantity: yup.number().required(),
  value: yup.number().required()
});

const useStyle = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

const FormDialog = memo((props: IProps) => {
  const classes = useStyle(props);

  const formik = useFormikObservable<IOrder>({
    validationSchema,
    onSubmit(model) {
      return orderService.save(model).pipe(
        tap(order => {
          Toast.show(`${order.description} foi salva`);
          props.onComplete(order);
        }),
        logError(true)
      );
    }
  });

  const handleEnter = useCallback(() => {
    formik.setValues(props.order ?? formik.initialValues, false);
  }, [formik, props.order]);

  const handleExit = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  return (
    <Dialog
      open={props.opened}
      disableBackdropClick
      disableEscapeKeyDown
      onEnter={handleEnter}
      onExited={handleExit}
      TransitionComponent={Transition}
    >
      {formik.isSubmitting && <LinearProgress color='primary' />}

      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{formik.values.id ? 'Editar' : 'Novo'} Usuário</DialogTitle>
        <DialogContent className={classes.content}>
          <Fragment>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label='Descricao:' name='description' formik={formik} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label='Quantidade:' name='quantity' formik={formik} />
              </Grid>
            </Grid>

            <TextField label='Valor:' name='value' formik={formik} />

            <FormControl component='fieldset'>
              <FormLabel component='legend'>Acesso</FormLabel>

              <FormGroup></FormGroup>
            </FormControl>
          </Fragment>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>Cancelar</Button>
          <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

const Transition = memo(
  forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default FormDialog;
