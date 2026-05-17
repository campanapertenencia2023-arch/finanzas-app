'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getIngresos, getEgresos } from '@/lib/supabase';
import { formatearMoneda, getNombreMes, obtenerAñoActual } from '@/lib/utils';
import jsPDF from 'jspdf';
import { writeFile } from 'xlsx';
import * as XLSX from 'xlsx';

export default function ReportesPage() {
  const { usuario, loading: authLoading } = useAuth();
  const [año, setAño] = useState(obtenerAñoActual());
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [egresos, setEgresos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function cargarDatos() {
    if (!usuario) return;
    setLoading(true);
    try {
      const [ing, egr] = await Promise.all([
        getIngresos(usuario.id, undefined, año),
        getEgresos(usuario.id, undefined, año),
      ]);
      setIngresos(ing);
      setEgresos(egr);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading && usuario) {
      cargarDatos();
    }
  }, [año, usuario, authLoading]);

  const totalIngresos = ingresos.reduce((sum, i) => sum + parseFloat(i.monto), 0);
  const totalEgresos = egresos.reduce((sum, e) => sum + parseFloat(e.monto), 0);

  function exportarPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Encabezado
    doc.setFontSize(18);
    doc.text('Reporte Financiero', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(`Año: ${año}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, pageWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 15;

    // Resumen
    doc.setFontSize(12);
    doc.text('RESUMEN', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Total Ingresos: ${formatearMoneda(totalIngresos)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Total Egresos: ${formatearMoneda(totalEgresos)}`, 20, yPosition);
    yPosition += 8;
    doc.text(
      `Balance: ${formatearMoneda(totalIngresos - totalEgresos)}`,
      20,
      yPosition
    );
    yPosition += 15;

    // Tabla de ingresos
    doc.setFontSize(12);
    doc.text('INGRESOS POR MES Y CONCEPTO', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    const ingresosPorMes = Array.from({ length: 12 }, (_, i) => {
      const mes = i + 1;
      const mesIngresos = ingresos.filter(ing => ing.mes === mes);
      const total = mesIngresos.reduce((sum, ing) => sum + parseFloat(ing.monto), 0);
      return { mes: getNombreMes(mes), ingresos: mesIngresos, total };
    });

    ingresosPorMes.forEach(({ mes, ingresos: mesIngresos, total }) => {
      if (mesIngresos.length > 0) {
        doc.text(`${mes}:`, 20, yPosition);
        yPosition += 6;
        mesIngresos.forEach(ing => {
          doc.text(
            `  ${ing.conceptos_ingresos.nombre}: ${formatearMoneda(ing.monto)}`,
            25,
            yPosition
          );
          yPosition += 6;
        });
        doc.text(`  Subtotal: ${formatearMoneda(total)}`, 25, yPosition);
        yPosition += 8;

        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
      }
    });

    yPosition += 10;
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    // Tabla de egresos
    doc.setFontSize(12);
    doc.text('EGRESOS POR MES Y CONCEPTO', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(9);
    const egresosPorMes = Array.from({ length: 12 }, (_, i) => {
      const mes = i + 1;
      const mesEgresos = egresos.filter(egr => egr.mes === mes);
      const total = mesEgresos.reduce((sum, egr) => sum + parseFloat(egr.monto), 0);
      return { mes: getNombreMes(mes), egresos: mesEgresos, total };
    });

    egresosPorMes.forEach(({ mes, egresos: mesEgresos, total }) => {
      if (mesEgresos.length > 0) {
        doc.text(`${mes}:`, 20, yPosition);
        yPosition += 6;
        mesEgresos.forEach(egr => {
          doc.text(
            `  ${egr.conceptos_egresos.nombre}: ${formatearMoneda(egr.monto)}`,
            25,
            yPosition
          );
          yPosition += 6;
        });
        doc.text(`  Subtotal: ${formatearMoneda(total)}`, 25, yPosition);
        yPosition += 8;

        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
      }
    });

    doc.save(`reporte-finanzas-${año}.pdf`);
  }

  function exportarExcel() {
    const workbook = XLSX.utils.book_new();

    // Hoja de resumen
    const resumen = [
      ['Reporte Financiero', año],
      ['Generado:', new Date().toLocaleDateString('es-CO')],
      [],
      ['Total Ingresos', totalIngresos],
      ['Total Egresos', totalEgresos],
      ['Balance', totalIngresos - totalEgresos],
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(resumen), 'Resumen');

    // Hoja de ingresos
    const datosIngresos = ingresos.map(ing => [
      getNombreMes(ing.mes),
      ing.año,
      ing.conceptos_ingresos.nombre,
      ing.monto,
      ing.descripcion || '',
    ]);
    const headerIngresos = ['Mes', 'Año', 'Concepto', 'Monto', 'Descripción'];
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([headerIngresos, ...datosIngresos]),
      'Ingresos'
    );

    // Hoja de egresos
    const datosEgresos = egresos.map(egr => [
      getNombreMes(egr.mes),
      egr.año,
      egr.conceptos_egresos.nombre,
      egr.monto,
      egr.descripcion || '',
    ]);
    const headerEgresos = ['Mes', 'Año', 'Concepto', 'Monto', 'Descripción'];
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.aoa_to_sheet([headerEgresos, ...datosEgresos]),
      'Egresos'
    );

    XLSX.writeFile(workbook, `reporte-finanzas-${año}.xlsx`);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Reportes Financieros</h1>

        {/* Selector de año */}
        <div className="mb-8 flex gap-4 items-center">
          <label className="text-lg font-semibold text-gray-700">Selecciona año:</label>
          <select
            value={año}
            onChange={(e) => setAño(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg text-lg"
          >
            {Array.from({ length: 5 }, (_, i) => año - 2 + i).map(a => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Opciones de exportación */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Exportar Reporte</h2>
          <div className="flex gap-4">
            <button
              onClick={exportarPDF}
              disabled={loading}
              className="px-6 py-3 bg-[#4a6fa5] text-white rounded-lg hover:bg-[#3d5a7f] disabled:bg-gray-400"
            >
              📄 Descargar PDF
            </button>
            <button
              onClick={exportarExcel}
              disabled={loading}
              className="px-6 py-3 bg-[#4a6fa5] text-white rounded-lg hover:bg-[#3d5a7f] disabled:bg-gray-400"
            >
              📊 Descargar Excel
            </button>
          </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Ingresos</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatearMoneda(totalIngresos)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Egresos</h3>
            <p className="text-3xl font-bold text-red-600">{formatearMoneda(totalEgresos)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Balance</h3>
            <p
              className={`text-3xl font-bold ${
                totalIngresos - totalEgresos >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatearMoneda(totalIngresos - totalEgresos)}
            </p>
          </div>
        </div>

        {/* Tabla de ingresos */}
        <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="bg-green-100 px-6 py-4">
            <h3 className="text-xl font-bold text-green-800">Ingresos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">Mes</th>
                  <th className="px-6 py-3 text-left">Concepto</th>
                  <th className="px-6 py-3 text-left">Monto</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No hay ingresos
                    </td>
                  </tr>
                ) : (
                  ingresos.map((ingreso, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{getNombreMes(ingreso.mes)}</td>
                      <td className="px-6 py-4">{ingreso.conceptos_ingresos.nombre}</td>
                      <td className="px-6 py-4 font-semibold text-green-600">
                        {formatearMoneda(ingreso.monto)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla de egresos */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-100 px-6 py-4">
            <h3 className="text-xl font-bold text-red-800">Egresos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">Mes</th>
                  <th className="px-6 py-3 text-left">Concepto</th>
                  <th className="px-6 py-3 text-left">Monto</th>
                </tr>
              </thead>
              <tbody>
                {egresos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      No hay egresos
                    </td>
                  </tr>
                ) : (
                  egresos.map((egreso, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">{getNombreMes(egreso.mes)}</td>
                      <td className="px-6 py-4">{egreso.conceptos_egresos.nombre}</td>
                      <td className="px-6 py-4 font-semibold text-red-600">
                        {formatearMoneda(egreso.monto)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
