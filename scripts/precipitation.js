(function() {
  const width = 600;
  var circos = new Circos({
    container: '#precipitation_chart',
    width: width,
    height: width
  });

  circos.layout([{
      len: 10,
      color: "#8dd3c7",
      label: "Enero",
      id: "enero"
    },
    {
      len: 10,
      color: "#ffffb3",
      label: "Febrero",
      id: "febrero"
    },
    {
      len: 10,
      color: "#bebada",
      label: "Marzo",
      id: "marzo"
    },
    {
      len: 10,
      color: "#fb8072",
      label: "Abril",
      id: "abril"
    },
    {
      len: 10,
      color: "#80b1d3",
      label: "Mayo",
      id: "mayo"
    },
    {
      len: 10,
      color: "#fdb462",
      label: "Junio",
      id: "junio"
    },
    {
      len: 10,
      color: "#b3de69",
      label: "Julio",
      id: "julio"
    },
    {
      len: 10,
      color: "#fccde5",
      label: "Agosto",
      id: "agosto"
    },
    {
      len: 10,
      color: "#d9d9d9",
      label: "Septiembre",
      id: "septiembre"
    },
    {
      len: 10,
      color: "#bc80bd",
      label: "Octubre",
      id: "octubre"
    },
    {
      len: 10,
      color: "#ccebc5",
      label: "Noviembre",
      id: "noviembre"
    },
    {
      len: 10,
      color: "#ffed6f",
      label: "Diciembre",
      id: "diciembre"
    }
  ], {
    innerRadius: width / 2 - 80,
    outerRadius: width / 2 - 30,
    ticks: {
      display: false
    },
    labels: {
      position: 'center',
      display: true,
      size: 14,
      color: '#000',
      radialOffset: 15
    }
  });

  d3.csv('data/precipitaciones_bogota.csv',
    row => {
      return {
        municipio: row.MUNICIPIO,
        cuenca: row.CUENCA,
        anio: +row.ANIO,
        enero: +row.ENERO,
        febrero: +row.FEBRERO,
        marzo: +row.MARZO,
        abril: +row.ABRIL,
        mayo: +row.MAYO,
        junio: +row.JUNIO,
        julio: +row.JULIO,
        agosto: +row.AGOSTO,
        septiembre: +row.SEPTIEMBRE,
        octubre: +row.OCTUBRE,
        noviembre: +row.NOVIEMBRE,
        diciembre: +row.DICIEMBRE
      }
    },
    (error, data) => {
      if (error) throw error;

      const temperaturaBogota = data.filter(d => {
        return d.municipio === 'Santafé de Bogotá' && d.cuenca === 'R. Bogotá';
      });

      const temperaturaPorMes = temperaturaBogota
        .reduce((result, d) => {
          return result.concat(Object.keys(d)
            .filter(k => k !== 'municipio' && k !== 'cuenca' && k !== 'anio')
            .map(k => {
              return {
                anio: d['anio'],
                mes: k,
                temperatura: d[k]
              }
            }));
        }, [])
        .filter(d => d.temperatura > 0);

      const min = d3.min(temperaturaPorMes, d => d.temperatura);
      const max = d3.max(temperaturaPorMes, d => d.temperatura);

      const nestedByYear = d3.nest()
        .key(d => {
          return d.anio;
        })
        .entries(temperaturaPorMes);

      nestedByYear.forEach((year, i) => {

        const data = year.values.map((d) => {
          return {
            block_id: d.mes,
            start: 0,
            end: 10,
            value: d.temperatura
          }
        });

        const config = {
          innerRadius: 0.99 - i * 0.01,
          outerRadius: 0.98 - i * 0.01,
          logScale: false,
          color: 'Blues',
          events: {},
          tooltipContent: (datum, index) => {
            return `<h5>${datum.value}</h5>`
          }
        };

        circos.heatmap(`temperatura-en-anio-${year.key}`, data, config);

      })

      circos.render();
    });
}());
