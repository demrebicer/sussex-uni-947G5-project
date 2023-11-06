import React from 'react';

const GridComponentBase = ({ data, colors }) => {
  // 11 sütun x 5 satır matris oluştur
  const rows = Array.from({ length: 5 }, (_, rowIndex) =>
    data.slice(rowIndex * 11, (rowIndex + 1) * 11)
  );

  return (
    <div className="grid grid-rows-5 mt-4 border-1 border-white">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((id, colIndex) => {
            const colorClass = colors[id] || 'bg-gray-200'; // Eğer rengi tanımlanmamışsa gri göster
            return (
              <div
                key={colIndex}
                className={`w-4 h-4 ${colorClass} border-1 border-white border-opacity-20`}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// React.memo ile komponenti sarmalayın. Karşılaştırma fonksiyonu olarak her zaman `true` döndüren bir fonksiyon kullanın.
const GridComponent = React.memo(GridComponentBase, () => true);

export default GridComponent;
