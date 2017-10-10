(function() {
  const width = 600;
  var circos = new Circos({
    container: '#precipitation_chart',
    width: width,
    height: width
  });

  circos.layout(months, {
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

      const precipitacionPorMes = temperaturaBogota
        .reduce((result, d) => {
          return result.concat(Object.keys(d)
            .filter(k => k !== 'municipio' && k !== 'cuenca' && k !== 'anio')
            .map(k => {
              return {
                anio: d['anio'],
                mes: k,
                precipitacion: d[k]
              }
            }));
        }, [])
        .filter(d => d.precipitacion > 0);

      const min = d3.min(precipitacionPorMes, d => d.precipitacion);
      const max = d3.max(precipitacionPorMes, d => d.precipitacion);

      const nestedByYear = d3.nest()
        .key(d => d.anio)
        .sortKeys(d3.ascending)
        .entries(precipitacionPorMes);

      nestedByYear.forEach((year, i) => {

        const data = year.values.map((d) => {
          return {
            block_id: d.mes,
            start: 0,
            end: 10,
            value: d.precipitacion,
            year: year.key
          }
        });

        const config = {
          innerRadius: 0.99 - i * 0.01,
          outerRadius: 0.98 - i * 0.01,
          logScale: false,
          color: 'Blues',
          events: {},
          tooltipContent: (datum, index) => {
            return `<h5>${datum.value} mm en ${datum.year}</h5>`
          }
        };

        circos.heatmap(`precipitacion-en-anio-${year.key}`, data, config);

      })

      circos.render();
    });
}());
