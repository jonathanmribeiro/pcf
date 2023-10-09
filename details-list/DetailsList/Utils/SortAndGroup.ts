export interface IGrouped {
    key: string;
    children?: IGrouped[];
    isSortedDescending: boolean;
    startIndex: number;
    size: number;
}

export const SortAndGroup = (objectList: any[], property: string, isSortedDescending: boolean = false): IGrouped[] => {
    const mappedList: IGrouped[] = [];

    objectList
        .map(item => item[property])
        .sort((a, b) => ((isSortedDescending ? a < b : a > b) ? 1 : -1))
        .forEach((item, index, array) => {
            if (array.indexOf(item) === index) {
                mappedList.push({ key: item, isSortedDescending: false, startIndex: 0, size: 0 });
            }
        });

    mappedList.forEach((mappedItem) => {
        const filteredList = objectList.filter(item => { return item[property] === mappedItem.key });
        mappedItem.children = filteredList;
        mappedItem.size = filteredList.length;
    });

    return mappedList;
}

export const SortItems = (objectList: any[], property: string, isSortedDescending: boolean = false) => {
    return objectList
        .sort((a, b) => ((isSortedDescending ? a[property] < b[property] : a[property] > b[property]) ? 1 : -1));
}