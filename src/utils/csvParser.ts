import Papa from "papaparse";

export const parseCSV = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: (results) => {
                if (results.errors.length) {
                    reject(results.errors);
                } else {
                    const [headers, ...rows] = results.data as string[][];
                    const labels = rows.map((row) => row[0]); // Assume first column is labels
                    const datasets = headers.slice(1).map((header, index) => ({
                        label: header,
                        data: rows.map((row) => parseFloat(row[index + 1]) || 0),
                    }));
                    resolve({ labels, datasets });
                }
            },
            header: false,
            skipEmptyLines: true,
        });
    });
};
