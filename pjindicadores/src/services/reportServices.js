import api from '@/lib/api';

export const downloadIndicatorReport =
  async (indicatorId, year) => {

    const response =
      await api.get(
        `/report/indicator/${indicatorId}/${year}`,
        {
          responseType: 'blob',
        }
      );

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement('a');

    link.href = url;

    link.setAttribute(
      'download',
      `indicador-${year}.pdf`
    );

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();
  };