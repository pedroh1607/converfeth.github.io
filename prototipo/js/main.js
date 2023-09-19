function convertToJSON() {
    const input = document.getElementsByName("xlsx-file") [0];
    const file = input.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
  
        const jsonArrays = [];
  
        // Itera sobre cada planilha no arquivo
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
  
          // Adicionando a detecção de coluna
          const jsonWithColumnDetection = jsonData.map((row) => {
            const rowWithColumnDetection = {};
            for (const column in row) {
              const columnIndex = XLSX.utils.decode_col(column);
              rowWithColumnDetection[column] = {
                value: row[column],
                columnIndex: columnIndex
              };
            }
            return rowWithColumnDetection;
          });
  
          jsonArrays.push(jsonWithColumnDetection);
        });
  
        fetch("https://4sqwxk-9128.csb.app/horario/edit", {
          method: "POST",
          body: JSON.stringify(jsonArrays),
          headers: { "Content-Type": "application/json" }
        })
          .then((res) => res.json())
          .then((data) => alert("tudo certo"))
          .catch((err) => alert("lilsbvszlril")) ;
      };
  
      reader.readAsArrayBuffer(file);
    }
  }
  
