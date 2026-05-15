import PDFDocument from 'pdfkit';

import { ChartJSNodeCanvas }
from 'chartjs-node-canvas';

import Indicator from '../models/Indicator.js';

import IndicatorData from '../models/IndicatorData.js';

import {
  IndicatorType,
  IndicatorTrend,
} from '../models/index.js';

import User from '../models/User.js';

// =====================================================
// FUNCION PARA DIBUJAR CELDAS
// =====================================================

const drawCell = (
  doc,
  x,
  y,
  w,
  h,
  text = '',
  options = {}
) => {

  doc
    .rect(x, y, w, h)
    .fillAndStroke(
      options.fill || '#FFFFFF',
      '#000000'
    );

  doc
    .fillColor('black')
    .font(
      options.bold
        ? 'Helvetica-Bold'
        : 'Helvetica'
    )
    .fontSize(options.size || 8)
    .text(
      text,
      x + 4,
      y + 6,
      {
        width: w - 8,
        align:
          options.align ||
          'center',
      }
    );
};

// =====================================================
// CONTROLLER PDF
// =====================================================

export const generateIndicatorReport =
  async (req, res) => {

    try {

      const {
        indicatorId,
        year,
      } = req.params;

      // =====================================================
      // INDICADOR
      // =====================================================

      const indicator =
        await Indicator.findByPk(
          indicatorId,
          {

            include: [

              {
                model: User,

                attributes: [
                  'id',
                  'name',
                ],
              },

              {
                model:
                  IndicatorType,

                attributes: [
                  'id',
                  'name',
                ],
              },

              {
                model:
                  IndicatorTrend,

                attributes: [
                  'id',
                  'name',
                ],
              },
            ],
          }
        );

      if (!indicator) {

        return res
          .status(404)
          .json({
            message:
              'Indicador no encontrado',
          });
      }

      // =====================================================
      // VALIDACION
      // =====================================================

      if (
        req.user.role !==
          'superadmin' &&
        indicator.entityId !==
          req.user.id
      ) {

        return res
          .status(403)
          .json({
            message:
              'No autorizado',
          });
      }

      // =====================================================
      // DATOS
      // =====================================================

      const data =
        await IndicatorData.findAll({

          where: {
            indicatorId,
            year,
          },

          order: [['id', 'ASC']],
        });

      // =====================================================
      // GRAFICA
      // =====================================================

      const width = 900;
      const height = 400;

      const chartCanvas =
        new ChartJSNodeCanvas({

          width,
          height,

          backgroundColour:
            '#ffffff',
        });

      const chartImage =
        await chartCanvas.renderToBuffer({

          type: 'bar',

          data: {

            labels: data.map(
              (d) => d.periodo
            ),

            datasets: [

              // =====================================================
              // BARRAS
              // =====================================================

              {
                type: 'bar',

                label: 'Logro',

                data: data.map(
                  (d) =>
                    Number(
                      d.logro || 0
                    )
                ),

                backgroundColor:
                  '#3b82f6',

                borderRadius: 8,

                borderSkipped: false,

                order: 1,
              },

              // =====================================================
              // META
              // =====================================================

              {
                type: 'line',

                label: 'Meta',

                data:
                  new Array(
                    data.length
                  ).fill(
                    Number(
                      indicator.meta ||
                        0
                    )
                  ),

                borderColor:
                  '#2563eb',

                borderWidth: 4,

borderDash: [
  14,
  6,
],

pointRadius: 0,

pointHoverRadius: 0,

fill: false,

tension: 0,

spanGaps: true,

clip: false,

order: 0,
              },

              // =====================================================
              // SATISFACTORIO
              // =====================================================

              {
                type: 'line',

                label:
                  'Satisfactorio',

                data:
                  new Array(
                    data.length
                  ).fill(
                    Number(
                      indicator.satisfactorio ||
                        0
                    )
                  ),

                borderColor:
                  '#10b981',

                borderWidth: 4,

borderDash: [
  14,
  6,
],

pointRadius: 0,

pointHoverRadius: 0,

fill: false,

tension: 0,

spanGaps: true,

clip: false,

order: 0,
              },

              // =====================================================
              // CRITICO
              // =====================================================

              {
                type: 'line',

                label: 'Crítico',

                data:
                  new Array(
                    data.length
                  ).fill(
                    Number(
                      indicator.critico ||
                        0
                    )
                  ),

                borderColor:
                  '#ef4444',

                borderWidth: 4,

borderDash: [
  14,
  6,
],

pointRadius: 0,

pointHoverRadius: 0,

fill: false,

tension: 0,

spanGaps: true,

clip: false,

order: 0,
              },
            ],
          },

          options: {

            responsive: true,

            plugins: {

              legend: {

                position: 'top',
              },
            },

            scales: {

              y: {

                min: 0,

                max: 100,
              },
            },
          },
        });

      // =====================================================
      // HEADERS
      // =====================================================

      res.setHeader(
        'Content-Type',
        'application/pdf'
      );

      res.setHeader(
        'Content-Disposition',
        `attachment; filename=indicador-${indicator.nombre}.pdf`
      );

      // =====================================================
      // PDF
      // =====================================================

      const doc =
        new PDFDocument({

          margin: 40,

          size: 'A4',
        });

      doc.pipe(res);

      // =====================================================
      // COLORES
      // =====================================================

      const gray = '#d9d9d9';
      const darkGray = '#bfbfbf';
      const light = '#f2f2f2';
      const green = '#92d050';
      const red = '#ff0000';

      // =====================================================
      // ENCABEZADO
      // =====================================================

      drawCell(
        doc,
        40,
        40,
        515,
        25,
        'CARTA DE INDICADOR',
        {
          fill: gray,
          bold: true,
          size: 12,
        }
      );

      // =====================================================
      // ENTIDAD
      // =====================================================

      drawCell(
        doc,
        40,
        65,
        515,
        20,
        indicator.User?.name ||
          '-',
        {
          fill: light,
          bold: true,
        }
      );

      // =====================================================
      // NOMBRE
      // =====================================================

      drawCell(
        doc,
        40,
        85,
        130,
        30,
        'NOMBRE DEL INDICADOR',
        {
          fill: darkGray,
          bold: true,
        }
      );

      drawCell(
        doc,
        170,
        85,
        250,
        30,
        indicator.nombre || '-',
        {
          fill: light,
          bold: true,
        }
      );

      // =====================================================
      // RESPONSABLE
      // =====================================================

      drawCell(
        doc,
        420,
        85,
        70,
        30,
        'RESPONSABLE',
        {
          fill: darkGray,
          bold: true,
        }
      );

      drawCell(
        doc,
        490,
        85,
        65,
        30,
        indicator.responsable ||
          '-',
        {
          fill: light,
        }
      );

      // =====================================================
      // PROCESO
      // =====================================================

      drawCell(
        doc,
        40,
        115,
        130,
        40,
        'PROCESO',
        {
          fill: darkGray,
          bold: true,
        }
      );

      drawCell(
        doc,
        170,
        115,
        385,
        40,
        indicator.proceso || '-',
        {
          fill: light,
          align: 'left',
        }
      );

      // =====================================================
      // TIPO
      // =====================================================

      drawCell(
        doc,
        40,
        155,
        130,
        30,
        'TIPO',
        {
          fill: darkGray,
          bold: true,
        }
      );

      drawCell(
        doc,
        170,
        155,
        385,
        30,
        indicator.IndicatorType
          ?.name || '-',
        {
          fill: light,
        }
      );

      // =====================================================
      // UTILIDAD
      // =====================================================

      drawCell(
        doc,
        40,
        185,
        130,
        70,
        'UTILIDAD',
        {
          fill: darkGray,
          bold: true,
        }
      );

      drawCell(
        doc,
        170,
        185,
        385,
        70,
        indicator.utilidad || '-',
        {
          fill: light,
          align: 'left',
        }
      );

      // =====================================================
      // FRECUENCIA
      // =====================================================

      drawCell(
        doc,
        40,
        255,
        130,
        40,
        'FRECUENCIA',
        {
          fill: darkGray,
          bold: true,
        }
      );

      drawCell(
        doc,
        170,
        255,
        100,
        40,
        indicator.frecuencia ||
          '-',
        {
          fill: light,
        }
      );

      // =====================================================
      // TENDENCIA
      // =====================================================

      drawCell(
        doc,
        270,
        255,
        120,
        40,
        'TENDENCIA',
        {
          fill: darkGray,
          bold: true,
        }
      );

      drawCell(
        doc,
        390,
        255,
        165,
        40,
        indicator
          .IndicatorTrend
          ?.name || '-',
        {
          fill: light,
        }
      );

      // =====================================================
      // META
      // =====================================================

      drawCell(
        doc,
        40,
        295,
        100,
        25,
        'META',
        {
          fill: darkGray,
          bold: true,
        }
      );

      drawCell(
        doc,
        140,
        295,
        80,
        25,
        `${indicator.meta}%`,
        {
          fill: light,
          bold: true,
        }
      );

      // =====================================================
      // SATISFACTORIO
      // =====================================================

      drawCell(
        doc,
        220,
        295,
        120,
        25,
        'SATISFACTORIO',
        {
          fill: darkGray,
          bold: true,
        }
      );

      drawCell(
        doc,
        340,
        295,
        80,
        25,
        `${indicator.satisfactorio}%`,
        {
          fill: green,
          bold: true,
        }
      );

      // =====================================================
      // CRITICO
      // =====================================================

      drawCell(
        doc,
        420,
        295,
        70,
        25,
        'CRÍTICO',
        {
          fill: darkGray,
          bold: true,
        }
      );

      drawCell(
        doc,
        490,
        295,
        65,
        25,
        `${indicator.critico}%`,
        {
          fill: red,
          bold: true,
        }
      );

      // =====================================================
      // AÑO
      // =====================================================

      drawCell(
        doc,
        40,
        320,
        130,
        25,
        'AÑO',
        {
          fill: darkGray,
          bold: true,
        }
      );

      drawCell(
        doc,
        170,
        320,
        100,
        25,
        `${year}`,
        {
          fill: light,
        }
      );

      // =====================================================
      // GRAFICA
      // =====================================================

      doc.y = 380;


      doc.moveDown();

      const chartWidth = 500;
const chartHeight = 250;

const chartX =
  (doc.page.width - chartWidth) / 2;

doc.image(chartImage, chartX, doc.y, {
  width: chartWidth,
  height: chartHeight,
});

      doc.moveDown(2);

      // =====================================================
      // TABLA
      // =====================================================

      doc.moveDown();

      const startX = 40;
      let startY = 700;

      const colWidths = [
        70,
        80,
        80,
        80,
        100,
        145,
      ];

      const headers = [

        'Periodo',
        'Numerador',
        'Denominador',
        'Logro',
        'Análisis',
        'Acciones',
      ];

      let currentX = startX;

      headers.forEach(
        (
          header,
          index
        ) => {

          drawCell(
            doc,
            currentX,
            startY,
            colWidths[index],
            25,
            header,
            {
              fill: darkGray,
              bold: true,
            }
          );

          currentX +=
            colWidths[index];
        }
      );

      startY += 25;

      data.forEach((item) => {

        currentX = startX;

        const row = [

          item.periodo,

          String(
            item.numerador
          ),

          String(
            item.denominador
          ),

          `${item.logro}%`,

          item.analisis ||
            '-',

          item.acciones ||
            '-',
        ];

        row.forEach(
          (
            value,
            index
          ) => {

            drawCell(
              doc,
              currentX,
              startY,
              colWidths[index],
              40,
              value,
              {
                fill: light,

                align:
                  index >= 4
                    ? 'left'
                    : 'center',
              }
            );

            currentX +=
              colWidths[index];
          }
        );

        startY += 40;
      });

      // =====================================================
      // FINALIZAR
      // =====================================================

      doc.end();

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          'Error generando PDF',
      });
    }
  };