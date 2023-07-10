import { CSVLink } from 'react-csv';
import GetAppIcon from '@mui/icons-material/GetApp';

function MatrixDownload({ matrixData, label }) {
  const columnHeaders = Array.from({ length: matrixData[0].length }, (_, index) => `Column ${index + 1}`);

  const csvData = matrixData.map(row =>
    row.reduce((acc, cell, index) => {
      return { ...acc, [columnHeaders[index]]: cell };
    }, {})
  );

  return (
    <div>
      <CSVLink data={csvData} filename="matrix.csv" style={{color:"green", textDecoration: 'none'}}>
        <GetAppIcon /> {label}
      </CSVLink>
    </div>
  );
}

export default MatrixDownload;
