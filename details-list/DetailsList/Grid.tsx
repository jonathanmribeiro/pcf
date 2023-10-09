import * as React from 'react';
import { DetailsList, buildColumns, IColumn, IGroup, Image, Link, ImageFit } from '@fluentui/react';
import { IExampleItem, createListItems } from '@fluentui/example-data';
import { IGrouped, SortAndGroup, SortItems } from './Utils/SortAndGroup';

export interface IGridState {
    sortedItems: IExampleItem[];
    columns: IColumn[];
    groups: IGroup[];
}

export interface IGridProps {
    selectedGroups?: any[]
}

export class Grid extends React.Component<IGridProps, IGridState> {
    constructor(props: {}) {
        super(props);

        const items = createListItems(100);

        this.state = {
            sortedItems: items,
            columns: this._buildColumns(items),
            groups: []
        };
    }

    componentDidMount(): void {
        this._buildGroups();
    }

    public render() {
        const { sortedItems, columns, groups } = this.state;

        return (
            <DetailsList
                items={sortedItems}
                columns={columns}
                onRenderItemColumn={this._renderItemColumn}
                groups={groups}
                groupProps={{ showEmptyGroups: true }}
            />
        );
    }

    private _buildColumns(items: IExampleItem[]): IColumn[] {
        const { selectedGroups } = this.props;
        const columns = buildColumns(items, false, this._onColumnClick.bind(this), selectedGroups![0], false);
        const thumbnailColumn = columns.filter(column => column.name === 'thumbnail')[0];

        thumbnailColumn.name = '';
        thumbnailColumn.maxWidth = 50;
        thumbnailColumn.ariaLabel = 'Thumbnail';
        thumbnailColumn.onColumnClick = undefined;

        columns.forEach((column: IColumn) => {
            if (column.name) {
                column.isCollapsible = column.name === 'description';
                column.isSorted = selectedGroups![0] ? selectedGroups![0] === column.name : false;
                column.isSortedDescending = false;
            }
        });

        return columns;
    }

    private _buildGroups(sortColumn: string = '', isSortedDescending: boolean = false) {
        const { columns } = this.state;
        let { groups, sortedItems } = this.state;
        const { selectedGroups } = this.props;

        if (selectedGroups![0]) {
            sortColumn = sortColumn ? sortColumn : selectedGroups![0];
            const mustSortDescending = sortColumn && sortColumn === selectedGroups![0] ? isSortedDescending : columns.find(column => column.key === selectedGroups![0])?.isSortedDescending;
            const groupedItems = SortAndGroup(sortedItems, selectedGroups![0], mustSortDescending);
            groups = [];

            groupedItems.forEach((child, index) => {
                const startIndex: number = index === 0 ? 0 : groupedItems![index - 1].startIndex + groupedItems![index - 1].size;
                child.startIndex = startIndex;

                const child_group: IGroup = { key: child.key, name: child.key, startIndex: startIndex, count: child.size, level: 0, children: [] };

                if (selectedGroups![1]) {
                    child.children = this._buildNestedGroup(1, child_group, child, sortColumn, isSortedDescending);
                }

                groups.push(child_group);
            });
            sortedItems = this._flattenNestedItems(groupedItems);
        } else {
            sortedItems = SortItems(sortedItems, sortColumn, isSortedDescending);
        }


        this.setState(
            {
                sortedItems: sortedItems,
                groups: groups,
                columns: columns.map(col => {
                    col.isSorted = col.key === sortColumn;

                    if (col.isSorted) {
                        col.isSortedDescending = isSortedDescending;
                    }

                    return col;
                })
            });
    }

    private _buildNestedGroup(groupLevel: number, parent_group: IGroup, parentGroupedItems: IGrouped, sortColumn: string = '', isSortedDescending: boolean = false): any[] {
        const { selectedGroups } = this.props;
        const { columns } = this.state;

        const groupKey = selectedGroups![groupLevel];
        const nextGroupLevel = groupLevel + 1;

        let mustSortDescending = sortColumn && sortColumn === groupKey ? isSortedDescending : columns.find(column => column.key === groupKey)?.isSortedDescending;
        parentGroupedItems.children = SortAndGroup(parentGroupedItems.children!, groupKey, mustSortDescending);

        parentGroupedItems.children!.forEach((child, index) => {
            const startIndex: number = index === 0 ? parentGroupedItems.startIndex : parentGroupedItems.children![index - 1].startIndex + parentGroupedItems.children![index - 1].size;
            child.startIndex = startIndex;

            const child_group: IGroup = { key: child.key, name: child.key, startIndex: startIndex, count: child.size, level: groupLevel, children: [] };

            if (selectedGroups![nextGroupLevel]) {
                child.children = this._buildNestedGroup(nextGroupLevel, child_group, child, sortColumn, isSortedDescending);
            } else {
                child.children = SortItems(child.children!, sortColumn, isSortedDescending);
            }

            parent_group.children?.push(child_group);
        });

        return parentGroupedItems.children;
    }

    private _flattenNestedItems(groupedItems: any[]) {
        let flattenedItems: any[] = [];

        flattenedItems = groupedItems.map(item => item.children).flat();

        if (flattenedItems.find(item => !!item.children))
            flattenedItems = flattenedItems.map(item => item.children).flat();
        if (flattenedItems.find(item => !!item.children))
            flattenedItems = flattenedItems.map(item => item.children).flat();
        if (flattenedItems.find(item => !!item.children))
            flattenedItems = flattenedItems.map(item => item.children).flat();
        if (flattenedItems.find(item => !!item.children))
            flattenedItems = flattenedItems.map(item => item.children).flat();
        if (flattenedItems.find(item => !!item.children))
            flattenedItems = flattenedItems.map(item => item.children).flat();

        return flattenedItems;
    }

    private _renderItemColumn(item: IExampleItem, index: number | undefined, column: IColumn | undefined) {
        const fieldContent = item[column?.fieldName as keyof IExampleItem] as string;

        switch (column?.key) {
            case 'thumbnail':
                return <Image src={fieldContent} width={50} height={50} imageFit={ImageFit.cover} />;
            case 'name':
                return <Link href="#">{fieldContent}</Link>;
            case 'color':
                return (<span data-selection-disabled={true}>{fieldContent}</span>);
            default:
                return <span>{fieldContent}</span >;
        }
    }

    private _onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn) {
        this._buildGroups(column.key, !column.isSortedDescending);
    }
}