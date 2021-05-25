import { createObjectCsvWriter } from 'csv-writer';
import ComparisonData from './lib/ComparisonData';

export const printDatabase = (records: Array<ComparisonData>) => {
    const csvWriter = createObjectCsvWriter({
        path: 'evaluations.csv',
        header: Object.keys(records[0]).map((header) => ({ id: header, title: header })),
        fieldDelimiter: ";"
    });
    return csvWriter.writeRecords(records);
}