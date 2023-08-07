import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import './style.scss';
import {useEffect, useState} from "react";
import ThemeContext from 'context/ThemeContext';

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
    compareValFn: any
): (
    a: { [key in Key]: any },
    b: { [key in Key]: any },
) => number {
    return order === 'desc'
        ? (a, b) => -compareValFn(a[orderBy], b[orderBy])
        : (a, b) => compareValFn(a[orderBy], b[orderBy]);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        // console.log('sort-order:', order);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export interface HeadCell {
    id: any;
    label: string;
    renderValFn: any;
    compareValFn: any;
    className: string;
}

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
    order: Order;
    orderBy: string;
    headCells: HeadCell[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {order, orderBy, onRequestSort, headCells } =
        props;
    const createSortHandler =
        (property: any) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };
        const { theme } = React.useContext(ThemeContext)
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'center'}
                        padding={'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        className={`text_color_3_${theme}`}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function EnhancedTable(props) {
    const { theme } = React.useContext(ThemeContext)

    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = useState(props.orderBy);
    const {headCells, rows} = props;
    const [visibleRows, setVisibleRows] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isShowAll, setIsShowAll] = useState(false);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: any,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    useEffect(() => {
        console.log('change-order');
        for (let i = 0; i < headCells.length; i ++) {
            if (headCells[i].id == orderBy) {
                let sortData = stableSort(rows, getComparator(order, orderBy, headCells[i].compareValFn));
                if (!isShowAll) {
                    let data = sortData.slice(0, 14);
                    setVisibleRows(data);
                } else {
                    setVisibleRows(sortData);
                }

            }
        }
        if (rows.length > 14 && !isShowAll) {
            setHasMore(true);
        } else {
            setHasMore(false);
        }
    }, [order, orderBy, isShowAll])

    const renderData = (header, row) => {
        let data = row[header.id];
        if (!data) {
            return '';
        }
        if (header.className.indexOf('is-spec') >= 0) {
            data = header.renderValFn(row);
        } else {
            data = header.renderValFn(data);
        }

        let result = '';
        if (typeof data == 'object') {
            result = data.join('');
        } else {
            result = data;
        }
        if (header.className.indexOf('is-percent') >= 0) {
            // @ts-ignore
            if (Number(result) == result) {
                result += '%';
            }
        }
        return result;
    }

    const showAll = () => {
        setIsShowAll(true);
    }

    return (
        <Box sx={{ width: '100%' }} className={`enhance-table-container`}>
            <Paper sx={{ width: '100%', mb: 2 }}  className={`border_${theme}`}>
                <TableContainer>
                    <Table
                        // sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            headCells={headCells}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={index}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {headCells.map((item, hindex) => (
                                            <TableCell key={index + '-' + hindex} className={`${item.className} text_color_1_${theme}`} align={'center'}>
                                                {renderData(item, row)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {hasMore && (
                    <div className={"show-btn-box"}>
                        <button onClick={showAll} className="btn-show"><span>Show all data</span></button>
                    </div>
                )}

            </Paper>
        </Box>
    );
}