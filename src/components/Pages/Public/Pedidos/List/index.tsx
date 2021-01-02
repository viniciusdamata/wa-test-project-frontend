import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Toolbar from 'components/Layout/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CardLoader from 'components/Shared/CardLoader';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import TableCellSortable from 'components/Shared/Pagination/TableCellSortable';
import TablePagination from 'components/Shared/Pagination/TablePagination';
import TableWrapper from 'components/Shared/TableWrapper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from 'mdi-react/RefreshIcon';
import EmptyAndErrorMessages from 'components/Shared/Pagination/EmptyAndErrorMessages';
import usePaginationObservable from 'hooks/usePagination';
import React, { Fragment, memo, useCallback, useState } from 'react';
import orderService from 'services/order';
import SearchField from 'components/Shared/Pagination/SearchField';
import ListItem from './ListItem';
import FormDialog from '../FormDialog';
import { IOrder } from 'interfaces/models/order';

const PedidosListPage = memo(() => {
  const [formOpened, setFormOpened] = useState(false);
  const [current, setCurrent] = useState<IOrder>();
  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => orderService.list(params),
    { orderBy: 'id', orderDirection: 'asc' },
    []
  );

  const handleEdit = useCallback((current: IOrder) => {
    setCurrent(current);
    setFormOpened(true);
  }, []);

  const handleCreate = useCallback(() => {
    setCurrent(null);
    setFormOpened(true);
  }, []);

  const formCallback = useCallback((order?: IOrder) => {
    setFormOpened(false);
    refresh();
  }, []);

  const formCancel = useCallback(() => setFormOpened(false), []);
  const { total, results } = data || ({ total: 0, results: [] } as typeof data);

  return (
    <Fragment>
      <Toolbar title='Pedidos' />
      <FormDialog opened={formOpened} order={current} onComplete={formCallback} onCancel={formCancel} />

      <Card>
        <CardLoader show={loading} />
        <CardContent>
          <Grid container justify='space-between' alignItems='center' spacing={2}>
            <Grid item xs={12} sm={6} lg={4}>
              <SearchField paginationParams={params} onChange={mergeParams} />
            </Grid>

            <Grid item xs={12} sm={'auto'}>
              <Button fullWidth variant='contained' color='primary' onClick={handleCreate}>
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableWrapper minWidth={500}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellSortable
                paginationParams={params}
                disabled={loading}
                onChange={mergeParams}
                column='description'
              >
                Descrição:
              </TableCellSortable>
              <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='quantity'>
                Quantidade:
              </TableCellSortable>
              <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='value'>
                Valor:
              </TableCellSortable>
              <TableCellActions>
                <IconButton disabled={loading} onClick={refresh}>
                  <RefreshIcon />
                </IconButton>
              </TableCellActions>
            </TableRow>
          </TableHead>
          <TableBody>
            <EmptyAndErrorMessages
              colSpan={3}
              error={error}
              loading={loading}
              hasData={results.length > 0}
              onTryAgain={refresh}
            />
            {results.map(order => (
              <ListItem key={order.id} order={order} onEdit={handleEdit} onDeleteComplete={refresh} />
            ))}
          </TableBody>
        </Table>
        <TablePagination total={total} disabled={loading} paginationParams={params} onChange={mergeParams} />
      </TableWrapper>
    </Fragment>
  );
});

export default PedidosListPage;
