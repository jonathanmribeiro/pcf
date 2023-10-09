import * as React from 'react';
import { DetailsList, buildColumns, IColumn, IGroup, Image, Link, ImageFit } from '@fluentui/react';
import { IExampleItem, createListItems } from '@fluentui/example-data';
import { SortAndGroup, SortItems } from './Utils/SortAndGroup';

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

        const items = createListItems(500);

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
                onRenderItemColumn={this.renderItemColumn}
                groups={groups}
                groupProps={{ showEmptyGroups: true }}
            />
        );
    }

    private _buildColumns(items: IExampleItem[]): IColumn[] {
        const columns = buildColumns(items, false, this.onColumnClick.bind(this));
        const thumbnailColumn = columns.filter(column => column.name === 'thumbnail')[0];

        thumbnailColumn.name = '';
        thumbnailColumn.maxWidth = 50;
        thumbnailColumn.ariaLabel = 'Thumbnail';
        thumbnailColumn.onColumnClick = undefined;

        columns.forEach((column: IColumn) => {
            if (column.name) {
                column.isCollapsible = column.name === 'description';
            }
        });

        return columns;
    }

    private _buildGroups(sortColumn: string = '', isSortedDescending: boolean = false) {
        const { columns } = this.state;
        let { sortedItems, groups } = this.state;
        const { selectedGroups } = this.props;

        if (selectedGroups![0]) {
            groups = [];

            const mustSortDescending = sortColumn && sortColumn === selectedGroups![0] ? isSortedDescending : columns.find(column => column.key === selectedGroups![0])?.isSortedDescending;
            const groupedItems = SortAndGroup(sortedItems, selectedGroups![0], mustSortDescending);

            groupedItems.forEach((child1, index) => {
                const startIndex: number = index === 0 ? 0 : groupedItems![index - 1].startIndex + groupedItems![index - 1].size;
                child1.startIndex = startIndex;

                const child1_group: IGroup = { key: child1.key, name: child1.key, startIndex: startIndex, count: child1.size, level: 1, children: [] };

                if (selectedGroups![1]) {
                    const mustSortDescending = sortColumn && sortColumn === selectedGroups![1] ? isSortedDescending : columns.find(column => column.key === selectedGroups![1])?.isSortedDescending;
                    child1.children = SortAndGroup(child1.children!, selectedGroups![1], mustSortDescending);
                    child1.children!.forEach((child2, index) => {
                        const startIndex: number = index === 0 ? child1.startIndex : child1.children![index - 1].startIndex + child1.children![index - 1].size;
                        child2.startIndex = startIndex;

                        const child2_group: IGroup = { key: child2.key, name: child2.key, startIndex: startIndex, count: child2.size, level: 2, children: [] };

                        if (selectedGroups![2]) {
                            const mustSortDescending = sortColumn && sortColumn === selectedGroups![2] ? isSortedDescending : columns.find(column => column.key === selectedGroups![2])?.isSortedDescending;
                            child2.children = SortAndGroup(child2.children!, selectedGroups![2], mustSortDescending);
                            child2.children!.forEach((child3, index) => {
                                const startIndex: number = index === 0 ? child2.startIndex : child2.children![index - 1].startIndex + child2.children![index - 1].size;
                                child3.startIndex = startIndex;

                                const child3_group: IGroup = { key: child3.key, name: child3.key, startIndex: startIndex, count: child3.size, level: 3, children: [] };

                                if (selectedGroups![3]) {
                                    const mustSortDescending = sortColumn && sortColumn === selectedGroups![3] ? isSortedDescending : columns.find(column => column.key === selectedGroups![3])?.isSortedDescending;
                                    child3.children = SortAndGroup(child3.children!, selectedGroups![3], mustSortDescending);
                                    child3.children!.forEach((child4, index) => {
                                        const startIndex: number = index === 0 ? child3.startIndex : child3.children![index - 1].startIndex + child3.children![index - 1].size;
                                        child4.startIndex = startIndex;

                                        const child4_group: IGroup = { key: child4.key, name: child4.key, startIndex: startIndex, count: child4.size, level: 4, children: [] };

                                        if (selectedGroups![4]) {
                                            const mustSortDescending = sortColumn && sortColumn === selectedGroups![4] ? isSortedDescending : columns.find(column => column.key === selectedGroups![4])?.isSortedDescending;
                                            child4.children = SortAndGroup(child4.children!, selectedGroups![4], mustSortDescending);
                                            child4.children!.forEach((child5, index) => {
                                                const startIndex: number = index === 0 ? child4.startIndex : child4.children![index - 1].startIndex + child4.children![index - 1].size;
                                                child5.startIndex = startIndex;

                                                const child5_group: IGroup = { key: child5.key, name: child5.key, startIndex: startIndex, count: child5.size, level: 5, children: [] };

                                                if (selectedGroups![5]) {
                                                    const mustSortDescending = sortColumn && sortColumn === selectedGroups![5] ? isSortedDescending : columns.find(column => column.key === selectedGroups![4])?.isSortedDescending;
                                                    child5.children = SortAndGroup(child5.children!, selectedGroups![5], mustSortDescending);
                                                }

                                                child5_group.children?.push(child5_group);
                                            });
                                        }

                                        child3_group.children!.push(child4_group);
                                    });
                                }

                                child2_group.children!.push(child3_group);
                            });
                        }

                        child1_group.children!.push(child2_group);
                    });
                }

                groups.push(child1_group);
            });

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

            sortedItems = flattenedItems;
        } else {
            const mustSortDescending = sortColumn ? isSortedDescending : columns.find(column => column.key === selectedGroups![0])?.isSortedDescending;
            sortedItems = SortItems(sortedItems, sortColumn, mustSortDescending);
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

    private renderItemColumn(item: IExampleItem, index: number | undefined, column: IColumn | undefined) {
        const fieldContent = item[column?.fieldName as keyof IExampleItem] as string;

        switch (column?.key) {
            case 'thumbnail':
                return <Image src={fieldContent} width={50} height={50} imageFit={ImageFit.cover
                } />;

            case 'name':
                return <Link href="#">{fieldContent}</Link>;

            case 'color':
                return (
                    <span
                        data-selection-disabled={true}
                    >
                        {fieldContent}
                    </span>
                );

            default:
                return <span>{fieldContent}</span >;
        }
    }

    private onColumnClick(ev: React.MouseEvent<HTMLElement>, column: IColumn) {
        let isSortedDescending = column.isSortedDescending;

        if (column.isSorted) {
            isSortedDescending = !isSortedDescending;
        }

        this._buildGroups(column.key, isSortedDescending);
    }
}