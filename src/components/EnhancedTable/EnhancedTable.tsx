import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableFooter from "@mui/material/TableFooter";
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
import EndStakeButton from "../EndStakeButton/EndStakeButton";
import JSBI from "@pulsex/jsbi";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: false,
        },
    },
};

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
    const {headCells, rows, onEndStake, footerCells, onGoodStake} = props;
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
    }, [order, orderBy, isShowAll, rows])

    const renderData = (header, row) => {
        if (header.className.indexOf('is-chart') >= 0) {
            let data = row[header.id];
            if (row.tableType == 'start' && !row.lockedDay) {
                return '';
            }
            if (row.tableType == 'end' && row.apyDaily.length === 0) {
                return ' --- ';
            }

            let labels = [];
            for (let i = 0; i < row.apyDaily.length; i ++) {
                labels.push(i);
            }

            data = {
                labels,
                datasets: [
                    {
                        fill: true,
                        label: 'Dataset 2',
                        data: row.apyDaily,
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            };

            return <Line options={options} data={data} />;

        } else {
            let data = row[header.id];
            if (!data && data !== 0) {
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
                if (result != 'Pending' && result != 'Cancelled') {
                    result += '%';
                }
            }
            return result;
        }
    }

    const showAll = () => {
        setIsShowAll(true);
    }

    const renderFooterData = (footer) => {
        let sum = JSBI.zero;
        for (let i = 0; i < rows.length; i ++) {
            let value = rows[i][footer.key];
            if ("[object String]" === Object.prototype.toString.call(value)) {
                value = JSBI.fromString(value);
                if (JSBI.nonZeroDefined(value)) {
                    sum = JSBI.add(sum, value);
                }
            } else if ("[object Array]" === Object.prototype.toString.call(value)) {
                if (JSBI.nonZeroDefined(value)) {
                    sum = JSBI.add(sum, value);
                }
            }
        }

        let data = footer.renderValFn(sum);
        return data.join('');
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
                                                
                                                {onEndStake && hindex === headCells.length - 1 &&
                                                    <>
                                                        {
                                                            renderData(headCells[2], row) == 'Pending' ? (
                                                                <button className={`bg_${theme} ${renderData(headCells[2], row)} text_color_1_${theme}`} onClick={()=>onEndStake(row.stakeId, true)}>End Stake</button>
                                                            ) : (
                                                                <EndStakeButton index={visibleRows.length - index - 1} stakeId={row.stakeId} onEndStake={onEndStake} onGoodStake={onGoodStake}/>
                                                            )
                                                        }
                                                    </>
                                                }
                                            </TableCell>
                                        ))}

                                    </TableRow>
                                );
                            })}
                        </TableBody>
                        {
                            footerCells && footerCells.length > 0 && (
                                <TableFooter>
                                    <TableRow>
                                        {
                                            footerCells.map((item, index) => (
                                                <TableCell key={'footer-' + index} align={item.isLabel ? 'right' : 'center'} colSpan={item.colspan}>
                                                    {item.isLabel && item.label}
                                                    {!item.isLabel && renderFooterData(item)}
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableFooter>
                            )
                        }
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