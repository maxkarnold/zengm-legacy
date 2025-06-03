import classNames from 'classnames';
import orderBy from 'lodash.orderby';
import React, { useState, useEffect, useCallback } from 'react';
import textContent from 'react-addons-text-content';
import { g, helpers } from '../../common';
import { HelpPopover } from '.';
import clickable from '../wrappers/clickable';
import type { SortOrder, SortType } from '../../common/types';

type FilterHeaderProps = {
    cols: {
        title: string;
    }[];
    filters: string[];
    handleFilterUpdate: (event: React.ChangeEvent<HTMLInputElement>, i: number) => void;
};

const FilterHeader: React.FC<FilterHeaderProps> = ({ cols, filters, handleFilterUpdate }) => {
    return (
        <tr>
            {cols.map(({ title }, i) => {
                const filter = filters[i] === undefined ? '' : filters[i];
                return (
                    <th key={i}>
                        <input
                            onChange={event => handleFilterUpdate(event, i)}
                            style={{ border: '1px solid #ccc', fontWeight: 'normal', fontSize: '12px', width: '100%' }}
                            type="text"
                            value={filter}
                        />
                    </th>
                );
            })}
        </tr>
    );
};

type HeaderProps = {
    cols: {
        desc?: string;
        sortSequence?: SortOrder[];
        title: string;
        width?: string;
    }[];
    enableFilters: boolean;
    filters: string[];
    handleColClick: (event: React.MouseEvent, i: number) => void;
    handleFilterUpdate: (event: React.ChangeEvent<HTMLInputElement>, i: number) => void;
    sortBys: [number, SortOrder][];
    superCols?: {
        colspan: number;
        desc?: string;
        title: string;
    }[];
};

const Header: React.FC<HeaderProps> = ({ cols, enableFilters, filters, handleColClick, handleFilterUpdate, sortBys, superCols }) => {
    return (
        <thead>
            {superCols && (
                <tr>
                    {superCols.map(({ colspan, desc, title }, i) => (
                        <th
                            key={i}
                            colSpan={colspan}
                            style={{ textAlign: 'center' }}
                            title={desc}
                        >
                            {title}
                        </th>
                    ))}
                </tr>
            )}
            <tr>
                {cols.map(({ desc, sortSequence, title, width }, i) => {
                    let className;
                    if (sortSequence && sortSequence.length === 0) {
                        className = null;
                    } else {
                        className = 'sorting';
                        for (const sortBy of sortBys) {
                            if (sortBy[0] === i) {
                                className = sortBy[1] === 'asc' ? 'sorting_asc' : 'sorting_desc';
                                break;
                            }
                        }
                    }
                    return (
                        <th
                            className={className}
                            key={i}
                            onClick={event => handleColClick(event, i)}
                            title={desc}
                            style={width ? { width } : undefined}
                        >
                            {title}
                        </th>
                    );
                })}
            </tr>
            {enableFilters && <FilterHeader cols={cols} filters={filters} handleFilterUpdate={handleFilterUpdate} />}
        </thead>
    );
};

type RowProps = {
    clicked: boolean;
    row: {
        classNames?: string[];
        data: any[];
    };
    toggleClicked: () => void;
};

const Row = clickable<RowProps>(({ clicked, row, toggleClicked }) => {
    return (
        <tr className={classNames(row.classNames, { warning: clicked })} onClick={toggleClicked}>
            {row.data.map((value = null, i) => {
                if (value !== null && value.hasOwnProperty('value')) {
                    return <td className={classNames(value.classNames)} key={i}>{value.value}</td>;
                }
                return <td key={i}>{value}</td>;
            })}
        </tr>
    );
});

const getSearchVal = (val: any): string => {
    try {
        let sortVal;
        if (React.isValidElement(val)) {
            sortVal = textContent(val);
        } else {
            sortVal = val;
        }

        if (sortVal !== undefined && sortVal !== null && sortVal.toString) {
            return sortVal.toString().toLowerCase();
        }
        return '';
    } catch (err) {
        console.error(`getSearchVal error on val "${val}"`, err);
        return '';
    }
};

const getSortVal = (value: any = null, sortType?: SortType): number | string | null => {
    try {
        let val;
        let sortVal;

        if (value !== null && value.hasOwnProperty('value')) {
            val = value.value;
        } else {
            val = value;
        }

        if (React.isValidElement(val)) {
            sortVal = textContent(val);
        } else {
            sortVal = val;
        }

        if (sortType === 'number') {
            if (sortVal === null) {
                return -Infinity;
            } else if (typeof sortVal !== 'number') {
                return parseFloat(sortVal);
            }
            return val;
        }
        if (sortType === 'lastTen') {
            if (sortVal === null) {
                return null;
            }
            return parseInt(sortVal.split('-')[0], 10);
        }
        if (sortType === 'draftPick') {
            if (sortVal === null) {
                return null;
            }
            let [pick, round] = sortVal.split('-');

            if (round === "BAN" && pick <= 3) {
                pick += 0;
            } else if (round === "PICK" && pick <= 3) {
                pick += 100;
            } else if (round === "BAN" && pick > 3) {
                pick += 1000;
            } else if (round === "PICK" && pick > 3) {
                pick += 10000;
            }
            return parseInt(pick, 10);
        }
        if (sortType === 'name') {
            if (sortVal === null) {
                return null;
            }
            const parts = sortVal.split(' (')[0].split(' ');
            return parts[parts.length - 1];
        }
        // TODO: Uncomment this when we figure out sortTypes
        // if (sortType === 'champion') {
        //     if (sortVal === null) {
        //         return null;
        //     }
        //     return sortVal;
        // }
        if (sortType === 'currency') {
            if (sortVal === null) {
                return -Infinity;
            }
            if (sortVal.includes('B')) {
                return parseFloat(sortVal.replace('$', '')) * 1000;
            }
            return parseFloat(sortVal.replace('$', ''));
        }
        return sortVal;
    } catch (err) {
        console.error(`getSortVal error on val "${String(value)}" and sortType "${String(sortType)}"`, err);
        return null;
    }
};

type InfoProps = {
    end: number;
    numRows: number;
    numRowsUnfiltered: number;
    start: number;
};

const Info: React.FC<InfoProps> = ({ end, numRows, numRowsUnfiltered, start }) => {
    const filteredText = numRows !== numRowsUnfiltered ? ` (filtered from ${numRowsUnfiltered})` : null;
    return <div className="dataTables_info hidden-xs">{start} to {end} of {numRows}{filteredText}</div>;
};

type PagingProps = {
    currentPage: number;
    numRows: number;
    onClick: (page: number) => void;
    perPage: number;
};

const Paging: React.FC<PagingProps> = ({ currentPage, numRows, onClick, perPage }) => {
    const showPrev = currentPage > 1;
    const showNext = numRows > (currentPage * perPage);

    const numPages = Math.ceil(numRows / perPage);
    let firstShownPage = currentPage <= 3 ? 1 : currentPage - 2;
    while (firstShownPage > 1 && (numPages - firstShownPage < 4)) {
        firstShownPage -= 1;
    }
    let lastShownPage = firstShownPage + 4;
    if (lastShownPage > numPages) {
        lastShownPage = numPages;
    }

    const numberedPages = [];
    for (let i = firstShownPage; i <= lastShownPage; i++) {
        numberedPages.push(
            <li key={i} className={i === currentPage ? 'active' : ''}>
                <a onClick={() => onClick(i)}>{i}</a>
            </li>
        );
    }

    return (
        <div className="dataTables_paginate paging_bootstrap">
            <ul className="pagination">
                <li className={classNames('prev', { disabled: !showPrev })}>
                    <a onClick={() => showPrev && onClick(currentPage - 1)}>← Prev</a>
                </li>
                {numberedPages}
                <li className={classNames('next', { disabled: !showNext })}>
                    <a onClick={() => showNext && onClick(currentPage + 1)}>Next →</a>
                </li>
            </ul>
        </div>
    );
};

type DataTableProps = {
    cols: {
        desc?: string;
        sortSequence?: SortOrder[];
        sortType?: SortType;
        title: string;
        width?: string;
    }[];
    defaultSort: [number, SortOrder];
    footer?: any[];
    name: string;
    pagination?: boolean;
    rows: any[];
    superCols?: {
        colspan: number;
        desc?: string;
        title: string;
    }[];
};

const DataTable: React.FC<DataTableProps> = ({
    cols,
    defaultSort,
    footer,
    name,
    pagination = false,
    rows,
    superCols
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [enableFilters, setEnableFilters] = useState(false);
    const [filters, setFilters] = useState<string[]>(cols.map(() => ''));
    const [perPage, setPerPage] = useState(() => {
        const savedPerPage = parseInt(localStorage.getItem('perPage') || '10', 10);
        return isNaN(savedPerPage) ? 10 : savedPerPage;
    });
    const [searchText, setSearchText] = useState('');
    const [sortBys, setSortBys] = useState<[number, SortOrder][]>(() => {
        const sortCacheKey = `DataTableSort:${name}`;
        const savedSortBys = localStorage.getItem(sortCacheKey);
        return savedSortBys ? JSON.parse(savedSortBys) : [defaultSort];
    });

    const handleColClick = useCallback((event: React.MouseEvent, i: number) => {
        const col = cols[i];

        if (col.sortSequence && col.sortSequence.length === 0) {
            return;
        }

        let found = false;
        let newSortBys = helpers.deepCopy(sortBys);

        const nextOrder = (col2: typeof col, sortBy: [number, SortOrder]) => {
            const sortSequence = col2.sortSequence;
            if (sortSequence) {
                let j = sortSequence.indexOf(sortBy[1]) + 1;
                if (j >= sortSequence.length) {
                    j = 0;
                }
                return sortSequence[j];
            }
            return sortBy[1] === 'asc' ? 'desc' : 'asc';
        };

        if (event.shiftKey) {
            for (const sortBy of newSortBys) {
                if (sortBy[0] === i) {
                    sortBy[1] = nextOrder(col, sortBy);
                    found = true;
                    break;
                }
            }

            if (!found) {
                newSortBys.push([i, col.sortSequence ? col.sortSequence[0] : 'asc']);
                found = true;
            }
        }

        if (!found && newSortBys.length === 1 && newSortBys[0][0] === i) {
            newSortBys[0][1] = nextOrder(col, newSortBys[0]);
            found = true;
        }

        if (!found) {
            newSortBys = [[i, col.sortSequence ? col.sortSequence[0] : 'asc']];
        }

        const sortCacheKey = `DataTableSort:${name}`;
        localStorage.setItem(sortCacheKey, JSON.stringify(newSortBys));

        setCurrentPage(1);
        setSortBys(newSortBys);
    }, [cols, sortBys, name]);

    const handleEnableFilters = useCallback(() => {
        setEnableFilters(prev => !prev);
    }, []);

    const handleFilterUpdate = useCallback((event: React.ChangeEvent<HTMLInputElement>, i: number) => {
        setFilters(prev => {
            const newFilters = [...prev];
            newFilters[i] = event.target.value;
            return newFilters;
        });
    }, []);

    const handlePaging = useCallback((newPage: number) => {
        if (newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    }, [currentPage]);

    const handlePerPage = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPerPage = parseInt(event.target.value, 10);
        if (!isNaN(newPerPage) && newPerPage !== perPage) {
            localStorage.setItem('perPage', String(newPerPage));
            setCurrentPage(1);
            setPerPage(newPerPage);
        }
    }, [perPage]);

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(1);
        setSearchText(event.target.value.toLowerCase());
    }, []);

    type FilterValue = {
        direction?: '>' | '<' | '=';
        number: number;
        original: string;
    } | string;

    const processedFilters = enableFilters ? filters.map((filter, i) => {
        if (cols[i].sortType === 'number' || cols[i].sortType === 'currency') {
            let numberStr = filter.replace(/[^0-9.<>]/g, '');
            let direction: '>' | '<' | '=' | undefined;
            if (numberStr[0] === '>' || numberStr[0] === '<' || numberStr[0] === '=') {
                direction = numberStr[0];
                numberStr = numberStr.slice(1);
            }
            const parsedNumber = parseFloat(numberStr);

            return {
                direction,
                original: filter,
                number: parsedNumber,
            };
        }
        return filter.toLowerCase();
    }) : [];

    const skipFiltering = searchText === '' && !enableFilters;

    const rowsFiltered = skipFiltering ? rows : rows.filter(row => {
        if (searchText !== '') {
            let found = false;
            for (let i = 0; i < row.data.length; i++) {
                if (getSearchVal(row.data[i]).includes(searchText)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }

        if (enableFilters) {
            for (let i = 0; i < row.data.length; i++) {
                const filter = processedFilters[i];

                if (typeof filter === 'string') {
                    if (filter === '') {
                        continue;
                    }
                    if (!getSearchVal(row.data[i]).includes(filter)) {
                        return false;
                    }
                } else {
                    if (Number.isNaN(filter.number)) {
                        continue;
                    }

                    const sortVal = getSortVal(row.data[i], cols[i].sortType);
                    if (sortVal === null || typeof sortVal === 'string') {
                        continue;
                    }

                    const numericVal = Number(sortVal);
                    if (isNaN(numericVal)) {
                        continue;
                    }

                    if (filter.direction === '>' && numericVal < filter.number) {
                        return false;
                    } else if (filter.direction === '<' && numericVal > filter.number) {
                        return false;
                    } else if (filter.direction === '=' && numericVal !== filter.number) {
                        return false;
                    } else if (filter.direction === undefined && !getSearchVal(row.data[i]).includes(filter.original)) {
                        return false;
                    }
                }
            }
        }

        return true;
    });

    const start = 1 + (currentPage - 1) * perPage;
    let end = start + perPage - 1;
    if (end > rowsFiltered.length) {
        end = rowsFiltered.length;
    }

    let sortedRows = orderBy(
        rowsFiltered,
        sortBys.map(sortBy => row => getSortVal(row.data[sortBy[0]], cols[sortBy[0]].sortType)),
        sortBys.map(sortBy => sortBy[1])
    );

    if (pagination) {
        sortedRows = sortedRows.slice(start - 1, end);
    }

    const aboveTable = pagination ? (
        <div>
            <div className="dataTables_length">
                <label>
                    <select
                        className="form-control input-sm"
                        onChange={handlePerPage}
                        style={{ width: '75px' }}
                        value={perPage}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select> per page
                </label>
            </div>
            <div className="dataTables_filter">
                <HelpPopover placement="bottom" style={{ marginRight: '6px' }} title="Filtering">
                    <p>The main search box looks in all columns, but you can filter on the values in specific columns by clicking the "Filter" button <span className="glyphicon glyphicon-filter" /> and entering text below the column headers.</p>
                    <p>For numeric columns, you can enter "&gt;50" to show values greater than or equal to 50, "&lt;50" for the opposite, and "=50" for values exactly equal to 50.</p>
                </HelpPopover>
                <a
                    className={classNames('btn btn-default', { active: enableFilters })}
                    onClick={handleEnableFilters}
                    style={{ marginRight: '6px' }}
                    title="Filter"
                >
                    <span className="glyphicon glyphicon-filter" />
                </a>
                <label>
                    <input
                        className="form-control input-sm"
                        onChange={handleSearch}
                        placeholder="Search"
                        style={{ width: '200px' }}
                        type="search"
                    />
                </label>
            </div>
        </div>
    ) : null;

    const belowTable = pagination ? (
        <div>
            <Info
                end={end}
                numRows={rowsFiltered.length}
                numRowsUnfiltered={rows.length}
                start={start}
            />
            <Paging
                currentPage={currentPage}
                numRows={rowsFiltered.length}
                onClick={handlePaging}
                perPage={perPage}
            />
        </div>
    ) : null;

    const tfoot = footer ? (
        <tfoot>
            {(Array.isArray(footer[0]) ? footer : [footer]).map((row, i) => (
                <tr key={i}>
                    {row.map((value, j) => {
                        if (value !== null && value.hasOwnProperty('value')) {
                            return <th className={classNames(value.classNames)} key={j}>{value.value}</th>;
                        }
                        return <th key={j}>{value}</th>;
                    })}
                </tr>
            ))}
        </tfoot>
    ) : null;

    return (
        <div className="table-responsive">
            {aboveTable}
            <table className="table table-striped table-bordered table-condensed table-hover">
                <Header
                    cols={cols}
                    enableFilters={enableFilters}
                    filters={filters}
                    handleColClick={handleColClick}
                    handleFilterUpdate={handleFilterUpdate}
                    sortBys={sortBys}
                    superCols={superCols}
                />
                <tbody>
                    {sortedRows.map(row => (
                        <Row
                            key={row.key}
                            row={row}
                            clicked={false}
                            toggleClicked={() => {}}
                        />
                    ))}
                </tbody>
                {tfoot}
            </table>
            {belowTable}
        </div>
    );
};

export default DataTable;
