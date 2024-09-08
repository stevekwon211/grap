import Papa from "papaparse";

export const parseCSV = (file: File): Promise<Record<string, string | number>[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: (results) => {
                if (results.errors.length) {
                    reject(results.errors);
                } else {
                    const [headers, ...rows] = results.data as string[][];
                    const parsedData = rows.map((row) => {
                        const rowData: Record<string, string | number> = {};
                        headers.forEach((header, index) => {
                            // 첫 번째 열을 날짜로 가정
                            if (index === 0) {
                                rowData[header] = row[index];
                            } else {
                                rowData[header] = isNaN(Number(row[index])) ? row[index] : Number(row[index]);
                            }
                        });
                        return rowData;
                    });
                    resolve(parsedData);
                }
            },
            header: false,
            skipEmptyLines: true,
        });
    });
};
