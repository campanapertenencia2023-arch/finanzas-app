import { google } from 'googleapis';

// Configurar autenticación con credenciales desde variable de entorno
let auth: any;

if (process.env.GOOGLE_CREDENTIALS_JSON) {
  // En producción (Vercel), usar variable de entorno
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
  auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
} else {
  // En desarrollo local, intentar usar el archivo
  try {
    const path = require('path');
    auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'credentials.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } catch (error) {
    console.error('Error: No Google credentials found. Set GOOGLE_CREDENTIALS_JSON environment variable.');
    throw error;
  }
}

const sheets = google.sheets({ version: 'v4', auth });

// ID del Google Sheet
const SPREADSHEET_ID = '1sT7s9O36CRVZc5NuwVZ5lU-Owu4DhyOP8grVktGYTO4';

interface Transaccion {
  usuario: string;
  tipo: 'ingreso' | 'egreso';
  fecha: string;
  concepto: string;
  monto: number;
  año: number;
}

interface ResumenConcepto {
  concepto: string;
  ingresos: number;
  egresos: number;
  balance: number;
}

/**
 * Obtiene todas las transacciones de un usuario para un año específico
 * agrupadas por concepto
 */
export async function getResumenPorConcepto(
  usuario: string,
  año: number
): Promise<ResumenConcepto[]> {
  try {
    // Obtener todos los datos de la hoja "Transacciones"
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Transacciones!A:F',
    });

    const rows = response.data.values || [];

    // Saltar header (primera fila)
    const transacciones = rows.slice(1);

    // Filtrar por usuario y año
    const userTransacciones = transacciones.filter((row: any[]) => {
      return row[0] === usuario && parseInt(row[5]) === año;
    });

    // Agrupar por concepto
    const resumenMap: { [key: string]: ResumenConcepto } = {};

    userTransacciones.forEach((row: any[]) => {
      const concepto = row[3];
      const tipo = row[1];
      const monto = parseFloat(row[4]) || 0;

      if (!resumenMap[concepto]) {
        resumenMap[concepto] = {
          concepto,
          ingresos: 0,
          egresos: 0,
          balance: 0,
        };
      }

      if (tipo === 'ingreso') {
        resumenMap[concepto].ingresos += monto;
      } else if (tipo === 'egreso') {
        resumenMap[concepto].egresos += monto;
      }

      resumenMap[concepto].balance =
        resumenMap[concepto].ingresos - resumenMap[concepto].egresos;
    });

    return Object.values(resumenMap);
  } catch (error) {
    console.error('Error al obtener datos de Google Sheets:', error);
    return [];
  }
}

/**
 * Agrega una nueva transacción al Google Sheet
 */
export async function agregarTransaccion(datos: Transaccion): Promise<void> {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Transacciones!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            datos.usuario,
            datos.tipo,
            datos.fecha,
            datos.concepto,
            datos.monto,
            datos.año,
          ],
        ],
      },
    });
  } catch (error) {
    console.error('Error al agregar transacción:', error);
    throw error;
  }
}

/**
 * Obtiene todos los conceptos de un usuario
 */
export async function getConceptos(
  usuario: string,
  tipo: 'ingreso' | 'egreso'
): Promise<string[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Conceptos!A:C',
    });

    const rows = response.data.values || [];
    const conceptos = rows
      .slice(1)
      .filter((row: any[]) => row[0] === usuario && row[1] === tipo)
      .map((row: any[]) => row[2]);

    return conceptos;
  } catch (error) {
    console.error('Error al obtener conceptos:', error);
    return [];
  }
}

/**
 * Agrega un nuevo concepto
 */
export async function agregarConcepto(
  usuario: string,
  tipo: 'ingreso' | 'egreso',
  concepto: string,
  descripcion?: string
): Promise<void> {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Conceptos!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[usuario, tipo, concepto, descripcion || '']],
      },
    });
  } catch (error) {
    console.error('Error al agregar concepto:', error);
    throw error;
  }
}

/**
 * Valida credenciales de usuario desde Google Sheets
 */
export async function validarUsuario(
  nombre: string,
  password: string
): Promise<{ id: string; nombre: string } | null> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Usuarios!A:C',
    });

    const rows = response.data.values || [];

    // Saltar header (primera fila)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] === nombre && row[1] === password) {
        return {
          id: row[0], // usuario es el ID
          nombre: row[0],
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error al validar usuario:', error);
    return null;
  }
}
